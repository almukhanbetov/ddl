package repository

import (
	"context"
	"encoding/json"

	"ddl/backend/internal/models"
)

func (r *Repository) getLocalizedSiteContent(ctx context.Context) (*models.LocalizedSiteContent, error) {
	var raw []byte
	err := r.pool.QueryRow(ctx, `SELECT data FROM site_content WHERE id = 1`).Scan(&raw)
	if err != nil {
		return nil, err
	}
	var content models.LocalizedSiteContent
	if err := json.Unmarshal(raw, &content); err != nil {
		return nil, err
	}
	return &content, nil
}

func (r *Repository) GetSiteContent(ctx context.Context, locale string) (*models.SiteContent, error) {
	content, err := r.getLocalizedSiteContent(ctx)
	if err != nil {
		return nil, err
	}
	if locale == "kk" {
		return &content.KK, nil
	}
	return &content.RU, nil
}

func (r *Repository) GetLocalizedSiteContent(ctx context.Context) (*models.LocalizedSiteContent, error) {
	return r.getLocalizedSiteContent(ctx)
}

func (r *Repository) UpdateSiteContent(ctx context.Context, content models.LocalizedSiteContent) (*models.LocalizedSiteContent, error) {
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
