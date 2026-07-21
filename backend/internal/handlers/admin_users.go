package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"

	"ddl/backend/internal/auth"
)

func (h *Handler) ListAdminUsers(c *gin.Context) {
	users, err := h.repo.ListAdminUsers(c.Request.Context())
	if err != nil {
		errJSON(c, http.StatusInternalServerError, "failed to load users")
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": users})
}

type createAdminUserRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Name     string `json:"name" binding:"required"`
	Password string `json:"password" binding:"required,min=8"`
}

func (h *Handler) CreateAdminUser(c *gin.Context) {
	var req createAdminUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errJSON(c, http.StatusBadRequest, "email, name и пароль (мин. 8 символов) обязательны")
		return
	}

	if _, err := h.repo.GetAdminByEmail(c.Request.Context(), req.Email); err == nil {
		errJSON(c, http.StatusConflict, "пользователь с таким email уже существует")
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

	user, err := h.repo.CreateAdminUser(c.Request.Context(), req.Email, req.Name, hash)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, "failed to create user")
		return
	}

	c.JSON(http.StatusCreated, gin.H{"user": gin.H{"id": user.ID, "email": user.Email, "name": user.Name}})
}
