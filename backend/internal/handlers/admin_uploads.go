package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) AdminUploadImage(c *gin.Context) {
	fh, err := c.FormFile("file")
	if err != nil {
		errJSON(c, http.StatusBadRequest, "файл не передан")
		return
	}

	img, clientMsg, err := saveUploadedImage(fh, h.uploadDir, "admin")
	if err != nil {
		errJSON(c, http.StatusInternalServerError, "не удалось сохранить файл")
		return
	}
	if clientMsg != "" {
		errJSON(c, http.StatusBadRequest, clientMsg)
		return
	}

	c.JSON(http.StatusOK, gin.H{"url": img.URL})
}
