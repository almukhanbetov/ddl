package repository

import (
	"context"

	"ddl/backend/internal/models"
)

func (r *Repository) GetCustomerByEmail(ctx context.Context, email string) (*models.Customer, error) {
	var c models.Customer
	err := r.pool.QueryRow(ctx, `
		SELECT id, name, email, password_hash, created_at FROM customers WHERE email = $1
	`, email).Scan(&c.ID, &c.Name, &c.Email, &c.PasswordHash, &c.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &c, nil
}

func (r *Repository) GetCustomerByID(ctx context.Context, id int64) (*models.Customer, error) {
	var c models.Customer
	err := r.pool.QueryRow(ctx, `
		SELECT id, name, email, password_hash, created_at FROM customers WHERE id = $1
	`, id).Scan(&c.ID, &c.Name, &c.Email, &c.PasswordHash, &c.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &c, nil
}

func (r *Repository) CreateCustomer(ctx context.Context, name, email, passwordHash string) (*models.Customer, error) {
	var c models.Customer
	err := r.pool.QueryRow(ctx, `
		INSERT INTO customers (name, email, password_hash) VALUES ($1, $2, $3)
		RETURNING id, name, email, password_hash, created_at
	`, name, email, passwordHash).Scan(&c.ID, &c.Name, &c.Email, &c.PasswordHash, &c.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &c, nil
}
