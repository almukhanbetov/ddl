package handlers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"ddl/backend/internal/models"
	"ddl/backend/internal/repository"
)

func (h *Handler) AdminCreateCategory(c *gin.Context) {
	var in models.CategoryInput
	if err := c.ShouldBindJSON(&in); err != nil {
		errJSON(c, http.StatusBadRequest, "invalid request: "+err.Error())
		return
	}

	id := "cat-" + uuid.NewString()[:8]
	category, err := h.repo.CreateCategory(c.Request.Context(), id, in)
	if err != nil {
		writeCategoryWriteError(c, err)
		return
	}

	c.JSON(http.StatusCreated, gin.H{"category": category})
}

func (h *Handler) AdminUpdateCategory(c *gin.Context) {
	id := c.Param("categoryId")

	var in models.CategoryInput
	if err := c.ShouldBindJSON(&in); err != nil {
		errJSON(c, http.StatusBadRequest, "invalid request: "+err.Error())
		return
	}

	category, err := h.repo.UpdateCategory(c.Request.Context(), id, in)
	if err != nil {
		writeCategoryWriteError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"category": category})
}

func (h *Handler) AdminDeleteCategory(c *gin.Context) {
	id := c.Param("categoryId")
	if err := h.repo.DeleteCategory(c.Request.Context(), id); err != nil {
		writeCategoryWriteError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"deleted": true})
}

func (h *Handler) AdminCreateSubcategory(c *gin.Context) {
	categoryID := c.Param("categoryId")

	var in models.SubcategoryInput
	if err := c.ShouldBindJSON(&in); err != nil {
		errJSON(c, http.StatusBadRequest, "invalid request: "+err.Error())
		return
	}

	id := "sub-" + uuid.NewString()[:8]
	subcategory, err := h.repo.CreateSubcategory(c.Request.Context(), categoryID, id, in)
	if err != nil {
		writeSubcategoryWriteError(c, err)
		return
	}

	c.JSON(http.StatusCreated, gin.H{"subcategory": subcategory})
}

func (h *Handler) AdminUpdateSubcategory(c *gin.Context) {
	categoryID := c.Param("categoryId")
	id := c.Param("subcategoryId")

	var in models.SubcategoryInput
	if err := c.ShouldBindJSON(&in); err != nil {
		errJSON(c, http.StatusBadRequest, "invalid request: "+err.Error())
		return
	}

	subcategory, err := h.repo.UpdateSubcategory(c.Request.Context(), categoryID, id, in)
	if err != nil {
		writeSubcategoryWriteError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"subcategory": subcategory})
}

func (h *Handler) AdminDeleteSubcategory(c *gin.Context) {
	categoryID := c.Param("categoryId")
	id := c.Param("subcategoryId")
	if err := h.repo.DeleteSubcategory(c.Request.Context(), categoryID, id); err != nil {
		writeSubcategoryWriteError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"deleted": true})
}

func writeCategoryWriteError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, repository.ErrCategoryNotFound):
		errJSON(c, http.StatusNotFound, "категория не найдена")
	case errors.Is(err, repository.ErrCategoryExists):
		errJSON(c, http.StatusConflict, "категория с таким именем уже существует")
	case errors.Is(err, repository.ErrCategoryInUse):
		errJSON(c, http.StatusConflict, "нельзя удалить категорию: в ней есть товары")
	default:
		errJSON(c, http.StatusInternalServerError, "failed to save category")
	}
}

func writeSubcategoryWriteError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, repository.ErrCategoryNotFound):
		errJSON(c, http.StatusNotFound, "категория не найдена")
	case errors.Is(err, repository.ErrSubcategoryNotFound):
		errJSON(c, http.StatusNotFound, "подкатегория не найдена")
	case errors.Is(err, repository.ErrSubcategoryExists):
		errJSON(c, http.StatusConflict, "подкатегория с таким именем уже существует")
	case errors.Is(err, repository.ErrSubcategoryInUse):
		errJSON(c, http.StatusConflict, "нельзя удалить подкатегорию: в ней есть товары")
	default:
		errJSON(c, http.StatusInternalServerError, "failed to save subcategory")
	}
}
