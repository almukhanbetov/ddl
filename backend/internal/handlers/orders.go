package handlers

import (
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"

	"ddl/backend/internal/delivery"
	"ddl/backend/internal/models"
	"ddl/backend/internal/repository"
)

const orderDateLayout = "2006-01-02"

func rentalDays(startStr, endStr string) (int, error) {
	start, err := time.Parse(orderDateLayout, startStr)
	if err != nil {
		return 0, errors.New("некорректная дата начала аренды")
	}
	end, err := time.Parse(orderDateLayout, endStr)
	if err != nil {
		return 0, errors.New("некорректная дата возврата")
	}
	days := int(end.Sub(start).Hours() / 24)
	if days < 1 {
		return 0, errors.New("дата возврата должна быть позже даты начала аренды")
	}
	return days, nil
}

type quoteRequest struct {
	Items          []models.OrderItemInput `json:"items" binding:"required,min=1,dive"`
	RentalStart    string                  `json:"rentalStart" binding:"required"`
	RentalEnd      string                  `json:"rentalEnd" binding:"required"`
	DeliveryMethod string                  `json:"deliveryMethod" binding:"required,oneof=delivery pickup"`
	DeliveryZone   string                  `json:"deliveryZone"`
}

func (h *Handler) QuoteCart(c *gin.Context) {
	var req quoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errJSON(c, http.StatusBadRequest, "invalid request: "+err.Error())
		return
	}

	days, err := rentalDays(req.RentalStart, req.RentalEnd)
	if err != nil {
		errJSON(c, http.StatusBadRequest, err.Error())
		return
	}

	ids := make([]string, len(req.Items))
	for i, it := range req.Items {
		ids[i] = it.ProductID
	}
	products, err := h.repo.GetProductsByIDs(c.Request.Context(), ids)
	if err != nil {
		errJSON(c, http.StatusInternalServerError, "failed to load products")
		return
	}

	type quoteItem struct {
		ProductID      string  `json:"productId"`
		Qty            int     `json:"qty"`
		PriceDay       float64 `json:"priceDay"`
		LineTotal      float64 `json:"lineTotal"`
		AvailableStock int     `json:"availableStock"`
		InStock        bool    `json:"inStock"`
	}

	var itemsTotal float64
	items := make([]quoteItem, 0, len(req.Items))
	for _, it := range req.Items {
		product, ok := products[it.ProductID]
		if !ok {
			errJSON(c, http.StatusBadRequest, "товар не найден: "+it.ProductID)
			return
		}
		lineTotal := product.PriceDay * float64(it.Qty) * float64(days)
		itemsTotal += lineTotal
		items = append(items, quoteItem{
			ProductID:      it.ProductID,
			Qty:            it.Qty,
			PriceDay:       product.PriceDay,
			LineTotal:      lineTotal,
			AvailableStock: product.Stock,
			InStock:        product.Stock >= it.Qty,
		})
	}

	quote, err := delivery.Resolve(req.DeliveryMethod, req.DeliveryZone)
	if err != nil {
		errJSON(c, http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"days":         days,
		"itemsTotal":   itemsTotal,
		"deliveryZone": quote.Zone,
		"deliveryCost": quote.Cost,
		"total":        quote.Total(itemsTotal),
		"items":        items,
	})
}

type createOrderRequest struct {
	Items          []models.OrderItemInput `json:"items" binding:"required,min=1,dive"`
	RentalStart    string                  `json:"rentalStart" binding:"required"`
	RentalEnd      string                  `json:"rentalEnd" binding:"required"`
	DeliveryMethod string                  `json:"deliveryMethod" binding:"required,oneof=delivery pickup"`
	DeliveryZone   string                  `json:"deliveryZone"`
	Address        string                  `json:"address"`
	ContactName    string                  `json:"contactName" binding:"required"`
	ContactPhone   string                  `json:"contactPhone" binding:"required"`
	Comment        string                  `json:"comment"`
	PhoneToken     string                  `json:"phoneToken"`
}

func (h *Handler) CreateOrder(c *gin.Context) {
	var req createOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		errJSON(c, http.StatusBadRequest, "invalid request: "+err.Error())
		return
	}

	if req.DeliveryMethod == "delivery" && req.Address == "" {
		errJSON(c, http.StatusBadRequest, "address is required for delivery")
		return
	}

	if !validPhone(req.ContactPhone) {
		errJSON(c, http.StatusBadRequest, "укажите номер телефона в формате +7 (XXX) XXX-XX-XX")
		return
	}

	days, err := rentalDays(req.RentalStart, req.RentalEnd)
	if err != nil {
		errJSON(c, http.StatusBadRequest, err.Error())
		return
	}

	quote, err := delivery.Resolve(req.DeliveryMethod, req.DeliveryZone)
	if err != nil {
		errJSON(c, http.StatusBadRequest, err.Error())
		return
	}

	// In production codes aren't really sent, so no token proves anything.
	phoneVerified := false
	if req.PhoneToken != "" && !h.production {
		verified, err := h.repo.HasVerifiedToken(c.Request.Context(), req.ContactPhone, req.PhoneToken)
		if err != nil {
			errJSON(c, http.StatusInternalServerError, "failed to check phone verification")
			return
		}
		phoneVerified = verified
	}

	var address *string
	if req.Address != "" {
		address = &req.Address
	}

	order, err := h.repo.CreateOrder(c.Request.Context(), repository.NewOrder{
		Items:          req.Items,
		RentalStart:    req.RentalStart,
		RentalEnd:      req.RentalEnd,
		RentalDays:     days,
		DeliveryMethod: req.DeliveryMethod,
		Address:        address,
		ContactName:    req.ContactName,
		ContactPhone:   req.ContactPhone,
		PhoneVerified:  phoneVerified,
		Comment:        req.Comment,
		Delivery:       quote,
	})
	if err != nil {
		switch {
		case errors.Is(err, repository.ErrProductNotFound):
			errJSON(c, http.StatusBadRequest, "один из товаров не найден")
		case errors.Is(err, repository.ErrInsufficientStock):
			errJSON(c, http.StatusConflict, err.Error())
		default:
			errJSON(c, http.StatusInternalServerError, "failed to create order")
		}
		return
	}

	c.JSON(http.StatusCreated, gin.H{"order": order.Public()})
}

func (h *Handler) GetOrder(c *gin.Context) {
	publicID := c.Param("publicId")
	order, err := h.repo.GetOrderByPublicID(c.Request.Context(), publicID)
	if err != nil {
		if err == pgx.ErrNoRows {
			errJSON(c, http.StatusNotFound, "order not found")
			return
		}
		errJSON(c, http.StatusInternalServerError, "failed to load order")
		return
	}
	c.JSON(http.StatusOK, gin.H{"order": order.Public()})
}
