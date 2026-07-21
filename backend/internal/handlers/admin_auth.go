package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"

	"ddl/backend/internal/auth"
	"ddl/backend/internal/models"
)

const adminUserContextKey = "adminUser"

type loginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func (h *Handler) AdminLogin(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errJSON(c, http.StatusBadRequest, "email and password are required")
		return
	}

	user, err := h.repo.GetAdminByEmail(c.Request.Context(), req.Email)
	if err != nil {
		if err == pgx.ErrNoRows {
			errJSON(c, http.StatusUnauthorized, "неверный email или пароль")
			return
		}
		errJSON(c, http.StatusInternalServerError, "failed to check credentials")
		return
	}

	if !auth.CheckPassword(user.PasswordHash, req.Password) {
		errJSON(c, http.StatusUnauthorized, "неверный email или пароль")
		return
	}

	token, expiresAt, err := auth.IssueToken(h.jwtSecret, user.ID, user.Email)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, "failed to issue session")
		return
	}

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(auth.CookieName, token, int(time.Until(expiresAt).Seconds()), "/", "", h.cookieSecure, true)

	c.JSON(http.StatusOK, gin.H{"user": gin.H{"id": user.ID, "email": user.Email, "name": user.Name}})
}

func (h *Handler) AdminLogout(c *gin.Context) {
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(auth.CookieName, "", -1, "/", "", h.cookieSecure, true)
	c.JSON(http.StatusOK, gin.H{"loggedOut": true})
}

func (h *Handler) AdminMe(c *gin.Context) {
	user := currentAdmin(c)
	c.JSON(http.StatusOK, gin.H{"user": gin.H{"id": user.ID, "email": user.Email, "name": user.Name}})
}

// RequireAdmin reads the session cookie, validates the JWT, loads the admin
// user, and stores it in the request context for downstream handlers.
func (h *Handler) RequireAdmin(c *gin.Context) {
	cookie, err := c.Cookie(auth.CookieName)
	if err != nil || cookie == "" {
		errJSON(c, http.StatusUnauthorized, "требуется вход в систему")
		c.Abort()
		return
	}

	claims, err := auth.ParseToken(h.jwtSecret, cookie)
	if err != nil {
		errJSON(c, http.StatusUnauthorized, "сессия истекла, войдите снова")
		c.Abort()
		return
	}

	user, err := h.repo.GetAdminByID(c.Request.Context(), claims.UserID)
	if err != nil {
		errJSON(c, http.StatusUnauthorized, "пользователь не найден")
		c.Abort()
		return
	}

	c.Set(adminUserContextKey, user)
	c.Next()
}

func currentAdmin(c *gin.Context) *models.AdminUser {
	v, ok := c.Get(adminUserContextKey)
	if !ok {
		return nil
	}
	return v.(*models.AdminUser)
}
