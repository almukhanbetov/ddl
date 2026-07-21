package handlers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"

	"ddl/backend/internal/models"
	"ddl/backend/internal/repository"
)

func (h *Handler) AdminListOrders(c *gin.Context) {
	status := c.Query("status")
	orders, err := h.repo.ListOrders(c.Request.Context(), status)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, "failed to load orders")
		return
	}
	if orders == nil {
		orders = []models.Order{}
	}
	c.JSON(http.StatusOK, gin.H{"items": orders})
}

type updateOrderStatusRequest struct {
	Status string `json:"status" binding:"required"`
}

func (h *Handler) AdminUpdateOrderStatus(c *gin.Context) {
	publicID := c.Param("publicId")
	var req updateOrderStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errJSON(c, http.StatusBadRequest, "status is required")
		return
	}

	order, err := h.repo.UpdateOrderStatus(c.Request.Context(), publicID, req.Status)
	if err != nil {
		switch {
		case errors.Is(err, repository.ErrInvalidStatus):
			errJSON(c, http.StatusBadRequest, "status must be one of new, confirmed, cancelled")
		case errors.Is(err, pgx.ErrNoRows):
			errJSON(c, http.StatusNotFound, "order not found")
		default:
			errJSON(c, http.StatusInternalServerError, "failed to update order")
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"order": order})
}
