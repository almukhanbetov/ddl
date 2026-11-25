package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"ddl/backend/internal/repository"
)

type Handler struct {
	repo         *repository.Repository
	jwtSecret    string
	cookieSecure bool
	uploadDir    string
	production   bool
}

func New(repo *repository.Repository, jwtSecret string, cookieSecure bool, uploadDir string, production bool) *Handler {
	return &Handler{repo: repo, jwtSecret: jwtSecret, cookieSecure: cookieSecure, uploadDir: uploadDir, production: production}
}

func (h *Handler) Health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func errJSON(c *gin.Context, status int, message string) {
	c.JSON(status, gin.H{"error": message})
}
