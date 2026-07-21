package repository

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5/pgconn"

	"ddl/backend/internal/models"
)

var (
	ErrCategoryExists      = errors.New("category already exists")
	ErrCategoryNotFound    = errors.New("category not found")
	ErrCategoryInUse       = errors.New("category has products and cannot be deleted")
	ErrSubcategoryExists   = errors.New("subcategory already exists")
	ErrSubcategoryNotFound = errors.New("subcategory not found")
	ErrSubcategoryInUse    = errors.New("subcategory has products and cannot be deleted")
)

func (r *Repository) CreateCategory(ctx context.Context, id string, in models.CategoryInput) (*models.Category, error) {
	_, err := r.pool.Exec(ctx, `
		INSERT INTO categories (id, name, item_count, image_url, position)
		VALUES ($1, $2, $3, $4, (SELECT COALESCE(MAX(position), 0) + 1 FROM categories))
	`, id, in.Name, in.ItemCount, in.ImageURL)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return nil, ErrCategoryExists
		}
		return nil, err
	}

	return &models.Category{ID: id, Name: in.Name, ItemCount: in.ItemCount, ImageURL: in.ImageURL}, nil
}

func (r *Repository) UpdateCategory(ctx context.Context, id string, in models.CategoryInput) (*models.Category, error) {
	tag, err := r.pool.Exec(ctx, `
		UPDATE categories SET name = $2, item_count = $3, image_url = $4 WHERE id = $1
	`, id, in.Name, in.ItemCount, in.ImageURL)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return nil, ErrCategoryExists
		}
		return nil, err
	}
	if tag.RowsAffected() == 0 {
		return nil, ErrCategoryNotFound
	}

	return &models.Category{ID: id, Name: in.Name, ItemCount: in.ItemCount, ImageURL: in.ImageURL}, nil
}

func (r *Repository) DeleteCategory(ctx context.Context, id string) error {
	tag, err := r.pool.Exec(ctx, `DELETE FROM categories WHERE id = $1`, id)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23503" {
			return ErrCategoryInUse
		}
		return err
	}
	if tag.RowsAffected() == 0 {
		return ErrCategoryNotFound
	}
	return nil
}

func (r *Repository) CreateSubcategory(ctx context.Context, categoryID, id string, in models.SubcategoryInput) (*models.Subcategory, error) {
	exists, err := r.CategoryExists(ctx, categoryID)
	if err != nil {
		return nil, err
	}
	if !exists {
		return nil, ErrCategoryNotFound
	}

	_, err = r.pool.Exec(ctx, `
		INSERT INTO subcategories (id, category_id, name, item_count, position)
		VALUES ($1, $2, $3, $4, (SELECT COALESCE(MAX(position), 0) + 1 FROM subcategories WHERE category_id = $2))
	`, id, categoryID, in.Name, in.ItemCount)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return nil, ErrSubcategoryExists
		}
		return nil, err
	}

	return &models.Subcategory{ID: id, CategoryID: categoryID, Name: in.Name, ItemCount: in.ItemCount}, nil
}

func (r *Repository) UpdateSubcategory(ctx context.Context, categoryID, id string, in models.SubcategoryInput) (*models.Subcategory, error) {
	tag, err := r.pool.Exec(ctx, `
		UPDATE subcategories SET name = $3, item_count = $4 WHERE category_id = $1 AND id = $2
	`, categoryID, id, in.Name, in.ItemCount)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return nil, ErrSubcategoryExists
		}
		return nil, err
	}
	if tag.RowsAffected() == 0 {
		return nil, ErrSubcategoryNotFound
	}

	return &models.Subcategory{ID: id, CategoryID: categoryID, Name: in.Name, ItemCount: in.ItemCount}, nil
}

func (r *Repository) DeleteSubcategory(ctx context.Context, categoryID, id string) error {
	tag, err := r.pool.Exec(ctx, `DELETE FROM subcategories WHERE category_id = $1 AND id = $2`, categoryID, id)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23503" {
			return ErrSubcategoryInUse
		}
		return err
	}
	if tag.RowsAffected() == 0 {
		return ErrSubcategoryNotFound
	}
	return nil
}
