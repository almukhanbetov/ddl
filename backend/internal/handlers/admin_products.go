package handlers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"ddl/backend/internal/models"
	"ddl/backend/internal/repository"
)

// AdminListProducts reuses the public listing (no stock/visibility
// restrictions apply there already) so the admin table shows every product.
func (h *Handler) AdminListProducts(c *gin.Context) {
	products, total, err := h.repo.ListProducts(c.Request.Context(), repository.ProductFilter{})
	if err != nil {
		errJSON(c, http.StatusInternalServerError, "failed to load products")
		return
	}
	if products == nil {
		products = []models.Product{}
	}
	c.JSON(http.StatusOK, gin.H{"items": products, "total": total})
}

func (h *Handler) AdminCreateProduct(c *gin.Context) {
	var in models.ProductInput
	if err := c.ShouldBindJSON(&in); err != nil {
		errJSON(c, http.StatusBadRequest, "invalid request: "+err.Error())
		return
	}

	id := "pd-" + uuid.NewString()[:8]
	product, err := h.repo.CreateProduct(c.Request.Context(), id, in)
	if err != nil {
		writeProductWriteError(c, err)
		return
	}

	c.JSON(http.StatusCreated, gin.H{"product": product})
}

func (h *Handler) AdminUpdateProduct(c *gin.Context) {
	id := c.Param("id")
	var in models.ProductInput
	if err := c.ShouldBindJSON(&in); err != nil {
		errJSON(c, http.StatusBadRequest, "invalid request: "+err.Error())
		return
	}

	product, err := h.repo.UpdateProduct(c.Request.Context(), id, in)
	if err != nil {
		writeProductWriteError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"product": product})
}

func (h *Handler) AdminDeleteProduct(c *gin.Context) {
	id := c.Param("id")
	if err := h.repo.DeleteProduct(c.Request.Context(), id); err != nil {
		if errors.Is(err, repository.ErrProductNotFound) {
			errJSON(c, http.StatusNotFound, "product not found")
			return
		}
		errJSON(c, http.StatusInternalServerError, "failed to delete product")
		return
	}
	c.JSON(http.StatusOK, gin.H{"deleted": true})
}

func writeProductWriteError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, repository.ErrProductNotFound):
		errJSON(c, http.StatusNotFound, "product not found")
	case errors.Is(err, repository.ErrArticleExists):
		errJSON(c, http.StatusConflict, "товар с таким артикулом уже существует")
	case errors.Is(err, repository.ErrInvalidSubcategory):
		errJSON(c, http.StatusBadRequest, "указанная категория/подкатегория не существует")
	default:
		errJSON(c, http.StatusInternalServerError, "failed to save product")
	}
}
