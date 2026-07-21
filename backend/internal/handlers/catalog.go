package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"

	"ddl/backend/internal/models"
	"ddl/backend/internal/repository"
)

func (h *Handler) ListCategories(c *gin.Context) {
	categories, err := h.repo.ListCategories(c.Request.Context())
	if err != nil {
		errJSON(c, http.StatusInternalServerError, "failed to load categories")
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": categories})
}

func (h *Handler) ListSubcategories(c *gin.Context) {
	categoryID := c.Param("id")

	exists, err := h.repo.CategoryExists(c.Request.Context(), categoryID)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, "failed to load category")
		return
	}
	if !exists {
		errJSON(c, http.StatusNotFound, "category not found")
		return
	}

	subs, err := h.repo.ListSubcategories(c.Request.Context(), categoryID)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, "failed to load subcategories")
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": subs})
}

func (h *Handler) ListProducts(c *gin.Context) {
	limit, _ := strconv.Atoi(c.Query("limit"))

	filter := repository.ProductFilter{
		CategoryID:    c.Query("category"),
		SubcategoryID: c.Query("subcategory"),
		Limit:         limit,
	}

	products, total, err := h.repo.ListProducts(c.Request.Context(), filter)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, "failed to load products")
		return
	}
	if products == nil {
		products = []models.Product{}
	}
	c.JSON(http.StatusOK, gin.H{"items": products, "total": total})
}

func (h *Handler) GetProduct(c *gin.Context) {
	id := c.Param("id")

	product, err := h.repo.GetProduct(c.Request.Context(), id)
	if err != nil {
		if err == pgx.ErrNoRows {
			errJSON(c, http.StatusNotFound, "product not found")
			return
		}
		errJSON(c, http.StatusInternalServerError, "failed to load product")
		return
	}

	related, err := h.repo.ListRelatedProducts(c.Request.Context(), product.CategoryID, product.ID, 4)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, "failed to load related products")
		return
	}
	if related == nil {
		related = []models.Product{}
	}

	c.JSON(http.StatusOK, gin.H{"product": product, "related": related})
}
