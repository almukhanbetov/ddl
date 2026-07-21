package repository

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"

	"ddl/backend/internal/models"
)

const dateLayout = "2006-01-02"

var (
	ErrProductNotFound   = errors.New("product not found")
	ErrInsufficientStock = errors.New("insufficient stock")
)

type NewOrder struct {
	Items          []models.OrderItemInput
	RentalStart    string
	RentalEnd      string
	RentalDays     int
	DeliveryMethod string
	Address        *string
	ContactName    string
	ContactPhone   string
	PhoneVerified  bool
	Comment        string
	DeliveryCost   float64
}

// CreateOrder validates stock, locks the affected product rows, decrements
// stock, and persists the order with server-computed pricing — all inside a
// single transaction so concurrent checkouts can't oversell inventory.
func (r *Repository) CreateOrder(ctx context.Context, in NewOrder) (*models.Order, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	var itemsTotal float64
	items := make([]models.OrderItem, 0, len(in.Items))

	for _, reqItem := range in.Items {
		var name string
		var stock int
		var priceDay float64
		err := tx.QueryRow(ctx, `
			SELECT name, stock, price_day FROM products WHERE id = $1 FOR UPDATE
		`, reqItem.ProductID).Scan(&name, &stock, &priceDay)
		if err != nil {
			return nil, fmt.Errorf("%w: %s", ErrProductNotFound, reqItem.ProductID)
		}
		if stock < reqItem.Qty {
			return nil, fmt.Errorf("%w: %s (доступно %d, запрошено %d)", ErrInsufficientStock, name, stock, reqItem.Qty)
		}

		if _, err := tx.Exec(ctx, `UPDATE products SET stock = stock - $1 WHERE id = $2`, reqItem.Qty, reqItem.ProductID); err != nil {
			return nil, err
		}

		lineTotal := priceDay * float64(reqItem.Qty) * float64(in.RentalDays)
		itemsTotal += lineTotal
		items = append(items, models.OrderItem{
			ProductID:   reqItem.ProductID,
			ProductName: name,
			Qty:         reqItem.Qty,
			PriceDay:    priceDay,
			LineTotal:   lineTotal,
		})
	}

	total := itemsTotal + in.DeliveryCost

	startDate, err := time.Parse(dateLayout, in.RentalStart)
	if err != nil {
		return nil, fmt.Errorf("invalid rentalStart: %w", err)
	}
	endDate, err := time.Parse(dateLayout, in.RentalEnd)
	if err != nil {
		return nil, fmt.Errorf("invalid rentalEnd: %w", err)
	}

	var o models.Order
	var startOut, endOut time.Time
	err = tx.QueryRow(ctx, `
		INSERT INTO orders (
			rental_start, rental_end, rental_days, delivery_method, address,
			contact_name, contact_phone, phone_verified, comment,
			items_total, delivery_cost, total
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		RETURNING id, public_id, rental_start, rental_end, rental_days, delivery_method, address,
		          contact_name, contact_phone, phone_verified, comment, items_total, delivery_cost, total, status, created_at
	`,
		startDate, endDate, in.RentalDays, in.DeliveryMethod, in.Address,
		in.ContactName, in.ContactPhone, in.PhoneVerified, in.Comment,
		itemsTotal, in.DeliveryCost, total,
	).Scan(
		&o.ID, &o.PublicID, &startOut, &endOut, &o.RentalDays, &o.DeliveryMethod, &o.Address,
		&o.ContactName, &o.ContactPhone, &o.PhoneVerified, &o.Comment, &o.ItemsTotal, &o.DeliveryCost, &o.Total, &o.Status, &o.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	o.RentalStart = startOut.Format(dateLayout)
	o.RentalEnd = endOut.Format(dateLayout)

	for _, item := range items {
		if _, err := tx.Exec(ctx, `
			INSERT INTO order_items (order_id, product_id, product_name, qty, price_day)
			VALUES ($1, $2, $3, $4, $5)
		`, o.ID, item.ProductID, item.ProductName, item.Qty, item.PriceDay); err != nil {
			return nil, err
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}

	o.Items = items
	return &o, nil
}

var validOrderStatuses = map[string]bool{"new": true, "confirmed": true, "cancelled": true}

var ErrInvalidStatus = errors.New("invalid order status")

func (r *Repository) ListOrders(ctx context.Context, status string) ([]models.Order, error) {
	where := ""
	args := []any{}
	if status != "" {
		args = append(args, status)
		where = " WHERE status = $1"
	}

	rows, err := r.pool.Query(ctx, `
		SELECT id, public_id, rental_start, rental_end, rental_days, delivery_method, address,
		       contact_name, contact_phone, phone_verified, comment, items_total, delivery_cost, total, status, created_at
		FROM orders`+where+`
		ORDER BY created_at DESC
	`, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []models.Order
	for rows.Next() {
		var o models.Order
		var startOut, endOut time.Time
		if err := rows.Scan(
			&o.ID, &o.PublicID, &startOut, &endOut, &o.RentalDays, &o.DeliveryMethod, &o.Address,
			&o.ContactName, &o.ContactPhone, &o.PhoneVerified, &o.Comment, &o.ItemsTotal, &o.DeliveryCost, &o.Total, &o.Status, &o.CreatedAt,
		); err != nil {
			return nil, err
		}
		o.RentalStart = startOut.Format(dateLayout)
		o.RentalEnd = endOut.Format(dateLayout)
		o.Items = []models.OrderItem{}
		out = append(out, o)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	if len(out) == 0 {
		return out, nil
	}

	ids := make([]int64, len(out))
	indexByID := make(map[int64]int, len(out))
	for i, o := range out {
		ids[i] = o.ID
		indexByID[o.ID] = i
	}

	itemRows, err := r.pool.Query(ctx, `
		SELECT order_id, product_id, product_name, qty, price_day
		FROM order_items WHERE order_id = ANY($1) ORDER BY id
	`, ids)
	if err != nil {
		return nil, err
	}
	defer itemRows.Close()
	for itemRows.Next() {
		var orderID int64
		var it models.OrderItem
		if err := itemRows.Scan(&orderID, &it.ProductID, &it.ProductName, &it.Qty, &it.PriceDay); err != nil {
			return nil, err
		}
		idx := indexByID[orderID]
		it.LineTotal = it.PriceDay * float64(it.Qty) * float64(out[idx].RentalDays)
		out[idx].Items = append(out[idx].Items, it)
	}
	if err := itemRows.Err(); err != nil {
		return nil, err
	}

	return out, nil
}

func (r *Repository) UpdateOrderStatus(ctx context.Context, publicID, status string) (*models.Order, error) {
	if !validOrderStatuses[status] {
		return nil, ErrInvalidStatus
	}
	tag, err := r.pool.Exec(ctx, `UPDATE orders SET status = $2 WHERE public_id = $1`, publicID, status)
	if err != nil {
		return nil, err
	}
	if tag.RowsAffected() == 0 {
		return nil, pgx.ErrNoRows
	}
	return r.GetOrderByPublicID(ctx, publicID)
}

func (r *Repository) GetOrderByPublicID(ctx context.Context, publicID string) (*models.Order, error) {
	var o models.Order
	var startOut, endOut time.Time
	err := r.pool.QueryRow(ctx, `
		SELECT id, public_id, rental_start, rental_end, rental_days, delivery_method, address,
		       contact_name, contact_phone, phone_verified, comment, items_total, delivery_cost, total, status, created_at
		FROM orders WHERE public_id = $1
	`, publicID).Scan(
		&o.ID, &o.PublicID, &startOut, &endOut, &o.RentalDays, &o.DeliveryMethod, &o.Address,
		&o.ContactName, &o.ContactPhone, &o.PhoneVerified, &o.Comment, &o.ItemsTotal, &o.DeliveryCost, &o.Total, &o.Status, &o.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	o.RentalStart = startOut.Format(dateLayout)
	o.RentalEnd = endOut.Format(dateLayout)
	o.Items = []models.OrderItem{}

	rows, err := r.pool.Query(ctx, `
		SELECT product_id, product_name, qty, price_day FROM order_items WHERE order_id = $1 ORDER BY id
	`, o.ID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var it models.OrderItem
		if err := rows.Scan(&it.ProductID, &it.ProductName, &it.Qty, &it.PriceDay); err != nil {
			return nil, err
		}
		it.LineTotal = it.PriceDay * float64(it.Qty) * float64(o.RentalDays)
		o.Items = append(o.Items, it)
	}
	return &o, rows.Err()
}
