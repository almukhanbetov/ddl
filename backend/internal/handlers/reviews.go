package handlers

import (
	"mime/multipart"
	"net/http"
	"strings"
	"unicode/utf8"

	"github.com/gin-gonic/gin"
)

const (
	reviewMaxPhotos    = 6
	reviewMinAuthorLen = 2
	reviewMaxAuthorLen = 100
	reviewMinTextLen   = 3
	reviewMaxTextLen   = 3000
)

func (h *Handler) ListReviews(c *gin.Context) {
	reviews, err := h.repo.ListReviews(c.Request.Context())
	if err != nil {
		errJSON(c, http.StatusInternalServerError, "failed to load reviews")
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": reviews})
}

func (h *Handler) CreateReview(c *gin.Context) {
	authorName := strings.TrimSpace(c.PostForm("authorName"))
	text := strings.TrimSpace(c.PostForm("text"))

	if n := utf8.RuneCountInString(authorName); n < reviewMinAuthorLen || n > reviewMaxAuthorLen {
		errJSON(c, http.StatusBadRequest, "имя должно быть от 2 до 100 символов")
		return
	}
	if n := utf8.RuneCountInString(text); n < reviewMinTextLen || n > reviewMaxTextLen {
		errJSON(c, http.StatusBadRequest, "отзыв должен быть от 3 до 3000 символов")
		return
	}

	form, err := c.MultipartForm()
	if err != nil && err != http.ErrNotMultipart && err != http.ErrMissingBoundary {
		errJSON(c, http.StatusBadRequest, "не удалось разобрать форму")
		return
	}

	var files []*multipart.FileHeader
	if form != nil {
		files = form.File["photos"]
	}
	if len(files) > reviewMaxPhotos {
		errJSON(c, http.StatusBadRequest, "можно приложить не более 6 фото")
		return
	}

	photoURLs := make([]string, 0, len(files))
	savedPaths := make([]string, 0, len(files))
	for _, fh := range files {
		img, clientMsg, err := saveUploadedImage(fh, h.uploadDir, "reviews")
		if err != nil {
			cleanupFiles(savedPaths)
			errJSON(c, http.StatusInternalServerError, "не удалось сохранить файл")
			return
		}
		if clientMsg != "" {
			cleanupFiles(savedPaths)
			errJSON(c, http.StatusBadRequest, clientMsg)
			return
		}
		savedPaths = append(savedPaths, img.Path)
		photoURLs = append(photoURLs, img.URL)
	}

	review, err := h.repo.CreateReview(c.Request.Context(), authorName, text, photoURLs)
	if err != nil {
		cleanupFiles(savedPaths)
		errJSON(c, http.StatusInternalServerError, "не удалось сохранить отзыв")
		return
	}

	c.JSON(http.StatusCreated, review)
}
