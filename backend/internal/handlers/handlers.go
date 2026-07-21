package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"ddl/backend/internal/repository"
)

type Handler struct {
	repo         *repository.Repository
	deliveryCost float64
	jwtSecret    string
	cookieSecure bool
	uploadDir    string
}

func New(repo *repository.Repository, deliveryCost float64, jwtSecret string, cookieSecure bool, uploadDir string) *Handler {
	return &Handler{repo: repo, deliveryCost: deliveryCost, jwtSecret: jwtSecret, cookieSecure: cookieSecure, uploadDir: uploadDir}
}

func (h *Handler) Health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func errJSON(c *gin.Context, status int, message string) {
	c.JSON(status, gin.H{"error": message})
}
