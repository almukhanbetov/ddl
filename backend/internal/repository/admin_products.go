package repository

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"

	"ddl/backend/internal/models"
)

var (
	ErrArticleExists      = errors.New("article already exists")
	ErrInvalidSubcategory = errors.New("unknown category/subcategory combination")
)

func (r *Repository) CreateProduct(ctx context.Context, id string, in models.ProductInput) (*models.Product, error) {
	_, err := r.pool.Exec(ctx, `
		INSERT INTO products (id, category_id, subcategory_id, name, article, stock, price_day, damage_cost, image_url, description)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
	`, id, in.CategoryID, in.SubcategoryID, in.Name, in.Article, in.Stock, in.PriceDay, in.DamageCost, in.ImageURL, in.Description)
	if err != nil {
		return nil, translateProductWriteErr(err)
	}
	return r.getPlainProduct(ctx, id)
}

func (r *Repository) UpdateProduct(ctx context.Context, id string, in models.ProductInput) (*models.Product, error) {
	tag, err := r.pool.Exec(ctx, `
		UPDATE products SET
			category_id = $2, subcategory_id = $3, name = $4, article = $5,
			stock = $6, price_day = $7, damage_cost = $8, image_url = $9, description = $10
		WHERE id = $1
	`, id, in.CategoryID, in.SubcategoryID, in.Name, in.Article, in.Stock, in.PriceDay, in.DamageCost, in.ImageURL, in.Description)
	if err != nil {
		return nil, translateProductWriteErr(err)
	}
	if tag.RowsAffected() == 0 {
		return nil, ErrProductNotFound
	}
	return r.getPlainProduct(ctx, id)
}

func (r *Repository) DeleteProduct(ctx context.Context, id string) error {
	tag, err := r.pool.Exec(ctx, `DELETE FROM products WHERE id = $1`, id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return ErrProductNotFound
	}
	return nil
}

func (r *Repository) getPlainProduct(ctx context.Context, id string) (*models.Product, error) {
	row := r.pool.QueryRow(ctx, productSelect+` WHERE p.id = $1`, id)
	p, err := scanProduct(row)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, ErrProductNotFound
		}
		return nil, err
	}
	return &p, nil
}

func translateProductWriteErr(err error) error {
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) {
		switch pgErr.Code {
		case "23505": // unique_violation (article)
			return ErrArticleExists
		case "23503": // foreign_key_violation (category/subcategory combo)
			return ErrInvalidSubcategory
		}
	}
	return err
}
