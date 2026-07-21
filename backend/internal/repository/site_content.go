package repository

import (
	"context"
	"encoding/json"

	"ddl/backend/internal/models"
)

func (r *Repository) GetSiteContent(ctx context.Context) (*models.SiteContent, error) {
	var raw []byte
	err := r.pool.QueryRow(ctx, `SELECT data FROM site_content WHERE id = 1`).Scan(&raw)
	if err != nil {
		return nil, err
	}
	var content models.SiteContent
	if err := json.Unmarshal(raw, &content); err != nil {
		return nil, err
	}
	return &content, nil
}

func (r *Repository) UpdateSiteContent(ctx context.Context, content models.SiteContent) (*models.SiteContent, error) {
	raw, err := json.Marshal(content)
	if err != nil {
		return nil, err
	}
	_, err = r.pool.Exec(ctx, `
		INSERT INTO site_content (id, data, updated_at) VALUES (1, $1, now())
		ON CONFLICT (id) DO UPDATE SET data = $1, updated_at = now()
	`, raw)
	if err != nil {
		return nil, err
	}
	return &content, nil
}
