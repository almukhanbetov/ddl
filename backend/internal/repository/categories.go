package repository

import (
	"context"

	"ddl/backend/internal/models"
)

func (r *Repository) ListCategories(ctx context.Context) ([]models.Category, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT id, name, item_count, image_url
		FROM categories
		ORDER BY position
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []models.Category
	for rows.Next() {
		var c models.Category
		if err := rows.Scan(&c.ID, &c.Name, &c.ItemCount, &c.ImageURL); err != nil {
			return nil, err
		}
		out = append(out, c)
	}
	return out, rows.Err()
}

func (r *Repository) ListSubcategories(ctx context.Context, categoryID string) ([]models.Subcategory, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT id, category_id, name, item_count
		FROM subcategories
		WHERE category_id = $1
		ORDER BY position
	`, categoryID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []models.Subcategory
	for rows.Next() {
		var s models.Subcategory
		if err := rows.Scan(&s.ID, &s.CategoryID, &s.Name, &s.ItemCount); err != nil {
			return nil, err
		}
		out = append(out, s)
	}
	return out, rows.Err()
}

func (r *Repository) CategoryExists(ctx context.Context, categoryID string) (bool, error) {
	var exists bool
	err := r.pool.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM categories WHERE id = $1)`, categoryID).Scan(&exists)
	return exists, err
}
