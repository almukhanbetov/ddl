package repository

import (
	"context"
	"encoding/json"

	"ddl/backend/internal/models"
)

func (r *Repository) CreateReview(ctx context.Context, authorName, text string, photos []string) (*models.Review, error) {
	if photos == nil {
		photos = []string{}
	}
	photosJSON, err := json.Marshal(photos)
	if err != nil {
		return nil, err
	}

	var review models.Review
	err = r.pool.QueryRow(ctx, `
		INSERT INTO reviews (author_name, review_text, photos)
		VALUES ($1, $2, $3)
		RETURNING id, author_name, review_text, photos, created_at
	`, authorName, text, photosJSON).Scan(&review.ID, &review.AuthorName, &review.Text, &photosJSON, &review.CreatedAt)
	if err != nil {
		return nil, err
	}
	if err := json.Unmarshal(photosJSON, &review.Photos); err != nil {
		return nil, err
	}
	return &review, nil
}

func (r *Repository) ListReviews(ctx context.Context) ([]models.Review, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT id, author_name, review_text, photos, created_at
		FROM reviews
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	reviews := []models.Review{}
	for rows.Next() {
		var review models.Review
		var photosJSON []byte
		if err := rows.Scan(&review.ID, &review.AuthorName, &review.Text, &photosJSON, &review.CreatedAt); err != nil {
			return nil, err
		}
		if err := json.Unmarshal(photosJSON, &review.Photos); err != nil {
			return nil, err
		}
		reviews = append(reviews, review)
	}
	return reviews, rows.Err()
}
