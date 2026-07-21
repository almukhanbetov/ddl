package repository

import (
	"context"
	"time"

	"ddl/backend/internal/models"
)

func (r *Repository) CreatePhoneCode(ctx context.Context, phone, channel, code string, ttl time.Duration) (int64, error) {
	var id int64
	err := r.pool.QueryRow(ctx, `
		INSERT INTO phone_verifications (phone, code, channel, expires_at)
		VALUES ($1, $2, $3, now() + $4::interval)
		RETURNING id
	`, phone, code, channel, ttl.String()).Scan(&id)
	return id, err
}

// LatestActiveCode returns the most recent, unexpired, unverified code sent to phone.
func (r *Repository) LatestActiveCode(ctx context.Context, phone string) (*models.PhoneVerification, error) {
	var v models.PhoneVerification
	err := r.pool.QueryRow(ctx, `
		SELECT id, phone, code, channel, token, verified, created_at, expires_at
		FROM phone_verifications
		WHERE phone = $1 AND verified = FALSE AND expires_at > now()
		ORDER BY created_at DESC
		LIMIT 1
	`, phone).Scan(&v.ID, &v.Phone, &v.Code, &v.Channel, &v.Token, &v.Verified, &v.CreatedAt, &v.ExpiresAt)
	if err != nil {
		return nil, err
	}
	return &v, nil
}

func (r *Repository) MarkPhoneVerified(ctx context.Context, id int64, token string) error {
	_, err := r.pool.Exec(ctx, `
		UPDATE phone_verifications SET verified = TRUE, token = $2 WHERE id = $1
	`, id, token)
	return err
}

// HasVerifiedToken reports whether the given token corresponds to a verified
// code sent to phone within the last hour (order confirmation window).
func (r *Repository) HasVerifiedToken(ctx context.Context, phone, token string) (bool, error) {
	var exists bool
	err := r.pool.QueryRow(ctx, `
		SELECT EXISTS(
			SELECT 1 FROM phone_verifications
			WHERE phone = $1 AND token = $2 AND verified = TRUE AND created_at > now() - interval '1 hour'
		)
	`, phone, token).Scan(&exists)
	return exists, err
}
