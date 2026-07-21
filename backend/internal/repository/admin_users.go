package repository

import (
	"context"

	"ddl/backend/internal/models"
)

func (r *Repository) GetAdminByEmail(ctx context.Context, email string) (*models.AdminUser, error) {
	var u models.AdminUser
	err := r.pool.QueryRow(ctx, `
		SELECT id, email, name, password_hash, created_at FROM admin_users WHERE email = $1
	`, email).Scan(&u.ID, &u.Email, &u.Name, &u.PasswordHash, &u.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *Repository) GetAdminByID(ctx context.Context, id int64) (*models.AdminUser, error) {
	var u models.AdminUser
	err := r.pool.QueryRow(ctx, `
		SELECT id, email, name, password_hash, created_at FROM admin_users WHERE id = $1
	`, id).Scan(&u.ID, &u.Email, &u.Name, &u.PasswordHash, &u.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *Repository) CreateAdminUser(ctx context.Context, email, name, passwordHash string) (*models.AdminUser, error) {
	var u models.AdminUser
	err := r.pool.QueryRow(ctx, `
		INSERT INTO admin_users (email, name, password_hash) VALUES ($1, $2, $3)
		RETURNING id, email, name, password_hash, created_at
	`, email, name, passwordHash).Scan(&u.ID, &u.Email, &u.Name, &u.PasswordHash, &u.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *Repository) ListAdminUsers(ctx context.Context) ([]models.AdminUser, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT id, email, name, password_hash, created_at FROM admin_users ORDER BY created_at
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []models.AdminUser
	for rows.Next() {
		var u models.AdminUser
		if err := rows.Scan(&u.ID, &u.Email, &u.Name, &u.PasswordHash, &u.CreatedAt); err != nil {
			return nil, err
		}
		out = append(out, u)
	}
	return out, rows.Err()
}
