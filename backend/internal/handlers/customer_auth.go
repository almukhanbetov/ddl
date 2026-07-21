package handlers

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"

	"ddl/backend/internal/auth"
	"ddl/backend/internal/models"
)

const customerContextKey = "customer"

func customerJSON(c *models.Customer) gin.H {
	return gin.H{"id": c.ID, "email": c.Email, "name": c.Name}
}

func (h *Handler) CustomerRegister(c *gin.Context) {
	var req models.CustomerRegisterInput
	if err := c.ShouldBindJSON(&req); err != nil {
		errJSON(c, http.StatusBadRequest, "укажите имя, email и пароль (мин. 6 символов)")
		return
	}
	name := strings.TrimSpace(req.Name)
	email := strings.ToLower(strings.TrimSpace(req.Email))

	if _, err := h.repo.GetCustomerByEmail(c.Request.Context(), email); err == nil {
		errJSON(c, http.StatusConflict, "пользователь с таким email уже зарегистрирован")
		return
	} else if err != pgx.ErrNoRows {
		errJSON(c, http.StatusInternalServerError, "failed to check existing user")
		return
	}

	hash, err := auth.HashPassword(req.Password)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, "failed to hash password")
		return
	}

	customer, err := h.repo.CreateCustomer(c.Request.Context(), name, email, hash)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, "не удалось зарегистрироваться")
		return
	}

	token, expiresAt, err := auth.IssueToken(h.jwtSecret, customer.ID, customer.Email, auth.RoleCustomer)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, "failed to issue session")
		return
	}
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(auth.CustomerCookieName, token, int(time.Until(expiresAt).Seconds()), "/", "", h.cookieSecure, true)

	c.JSON(http.StatusCreated, gin.H{"user": customerJSON(customer)})
}

func (h *Handler) CustomerLogin(c *gin.Context) {
	var req models.CustomerLoginInput
	if err := c.ShouldBindJSON(&req); err != nil {
		errJSON(c, http.StatusBadRequest, "email and password are required")
		return
	}
	email := strings.ToLower(strings.TrimSpace(req.Email))

	customer, err := h.repo.GetCustomerByEmail(c.Request.Context(), email)
	if err != nil {
		if err == pgx.ErrNoRows {
			errJSON(c, http.StatusUnauthorized, "неверный email или пароль")
			return
		}
		errJSON(c, http.StatusInternalServerError, "failed to check credentials")
		return
	}

	if !auth.CheckPassword(customer.PasswordHash, req.Password) {
		errJSON(c, http.StatusUnauthorized, "неверный email или пароль")
		return
	}

	token, expiresAt, err := auth.IssueToken(h.jwtSecret, customer.ID, customer.Email, auth.RoleCustomer)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, "failed to issue session")
		return
	}
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(auth.CustomerCookieName, token, int(time.Until(expiresAt).Seconds()), "/", "", h.cookieSecure, true)

	c.JSON(http.StatusOK, gin.H{"user": customerJSON(customer)})
}

func (h *Handler) CustomerLogout(c *gin.Context) {
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(auth.CustomerCookieName, "", -1, "/", "", h.cookieSecure, true)
	c.JSON(http.StatusOK, gin.H{"loggedOut": true})
}

func (h *Handler) CustomerMe(c *gin.Context) {
	customer := currentCustomer(c)
	c.JSON(http.StatusOK, gin.H{"user": customerJSON(customer)})
}

// RequireCustomer reads the customer session cookie, validates the JWT
// (checking it was issued for a customer, not an admin session), loads the
// customer, and stores it in the request context for downstream handlers.
func (h *Handler) RequireCustomer(c *gin.Context) {
	cookie, err := c.Cookie(auth.CustomerCookieName)
	if err != nil || cookie == "" {
		errJSON(c, http.StatusUnauthorized, "требуется вход в систему")
		c.Abort()
		return
	}

	claims, err := auth.ParseToken(h.jwtSecret, cookie)
	if err != nil || claims.Role != auth.RoleCustomer {
		errJSON(c, http.StatusUnauthorized, "сессия истекла, войдите снова")
		c.Abort()
		return
	}

	customer, err := h.repo.GetCustomerByID(c.Request.Context(), claims.UserID)
	if err != nil {
		errJSON(c, http.StatusUnauthorized, "пользователь не найден")
		c.Abort()
		return
	}

	c.Set(customerContextKey, customer)
	c.Next()
}

func currentCustomer(c *gin.Context) *models.Customer {
	v, ok := c.Get(customerContextKey)
	if !ok {
		return nil
	}
	return v.(*models.Customer)
}
