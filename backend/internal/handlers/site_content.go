package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"ddl/backend/internal/models"
)

func (h *Handler) GetSiteContent(c *gin.Context) {
	content, err := h.repo.GetSiteContent(c.Request.Context())
	if err != nil {
		errJSON(c, http.StatusInternalServerError, "failed to load site content")
		return
	}
	c.JSON(http.StatusOK, content)
}

func (h *Handler) AdminUpdateSiteContent(c *gin.Context) {
	var content models.SiteContent
	if err := c.ShouldBindJSON(&content); err != nil {
		errJSON(c, http.StatusBadRequest, "invalid request: "+err.Error())
		return
	}

	updated, err := h.repo.UpdateSiteContent(c.Request.Context(), content)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, "failed to save site content")
		return
	}

	c.JSON(http.StatusOK, updated)
}
