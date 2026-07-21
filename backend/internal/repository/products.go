package repository

import (
	"context"
	"fmt"

	"ddl/backend/internal/models"
)

const productSelect = `
	SELECT p.id, p.category_id, p.subcategory_id, c.name, s.name, p.name, p.article, p.stock, p.price_day, p.damage_cost, p.image_url
	FROM products p
	JOIN categories c ON c.id = p.category_id
	JOIN subcategories s ON s.category_id = p.category_id AND s.id = p.subcategory_id
`

type ProductFilter struct {
	CategoryID    string
	SubcategoryID string
	Limit         int
}

func (r *Repository) ListProducts(ctx context.Context, f ProductFilter) ([]models.Product, int, error) {
	where := ""
	args := []any{}

	if f.CategoryID != "" {
		args = append(args, f.CategoryID)
		where += fmt.Sprintf(" AND p.category_id = $%d", len(args))
	}
	if f.SubcategoryID != "" {
		args = append(args, f.SubcategoryID)
		where += fmt.Sprintf(" AND p.subcategory_id = $%d", len(args))
	}

	var total int
	countQuery := "SELECT COUNT(*) FROM products p WHERE TRUE" + where
	if err := r.pool.QueryRow(ctx, countQuery, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	query := productSelect + " WHERE TRUE" + where + " ORDER BY p.id"
	if f.Limit > 0 {
		args = append(args, f.Limit)
		query += fmt.Sprintf(" LIMIT $%d", len(args))
	}

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var out []models.Product
	for rows.Next() {
		p, err := scanProduct(rows)
		if err != nil {
			return nil, 0, err
		}
		out = append(out, p)
	}
	return out, total, rows.Err()
}

func (r *Repository) GetProduct(ctx context.Context, id string) (*models.ProductDetail, error) {
	var d models.ProductDetail
	err := r.pool.QueryRow(ctx, `
		SELECT p.id, p.category_id, p.subcategory_id, c.name, s.name, p.name, p.article, p.stock, p.price_day, p.damage_cost,
		       p.image_url, p.description
		FROM products p
		JOIN categories c ON c.id = p.category_id
		JOIN subcategories s ON s.category_id = p.category_id AND s.id = p.subcategory_id
		WHERE p.id = $1
	`, id).Scan(
		&d.ID, &d.CategoryID, &d.SubcategoryID, &d.CategoryName, &d.SubcategoryName, &d.Name, &d.Article, &d.Stock, &d.PriceDay, &d.DamageCost,
		&d.ImageURL, &d.Description,
	)
	if err != nil {
		return nil, err
	}

	rows, err := r.pool.Query(ctx, `
		SELECT image_url FROM product_images WHERE product_id = $1 ORDER BY position
	`, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var url string
		if err := rows.Scan(&url); err != nil {
			return nil, err
		}
		d.Gallery = append(d.Gallery, url)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	if len(d.Gallery) == 0 {
		d.Gallery = []string{d.ImageURL}
	}

	return &d, nil
}

func (r *Repository) ListRelatedProducts(ctx context.Context, categoryID, excludeID string, limit int) ([]models.Product, error) {
	rows, err := r.pool.Query(ctx, productSelect+`
		WHERE p.category_id = $1 AND p.id != $2
		ORDER BY p.id
		LIMIT $3
	`, categoryID, excludeID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []models.Product
	for rows.Next() {
		p, err := scanProduct(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, p)
	}
	return out, rows.Err()
}

// GetProductsByIDs returns the requested products keyed by id. Missing ids are
// simply absent from the result so callers can detect them.
func (r *Repository) GetProductsByIDs(ctx context.Context, ids []string) (map[string]models.Product, error) {
	rows, err := r.pool.Query(ctx, productSelect+` WHERE p.id = ANY($1)`, ids)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := make(map[string]models.Product, len(ids))
	for rows.Next() {
		p, err := scanProduct(rows)
		if err != nil {
			return nil, err
		}
		out[p.ID] = p
	}
	return out, rows.Err()
}

type rowScanner interface {
	Scan(dest ...any) error
}

func scanProduct(row rowScanner) (models.Product, error) {
	var p models.Product
	err := row.Scan(
		&p.ID, &p.CategoryID, &p.SubcategoryID, &p.CategoryName, &p.SubcategoryName,
		&p.Name, &p.Article, &p.Stock, &p.PriceDay, &p.DamageCost, &p.ImageURL,
	)
	return p, err
}
