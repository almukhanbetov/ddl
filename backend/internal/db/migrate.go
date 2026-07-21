package db

import (
	"context"
	"embed"
	"fmt"
	"io/fs"
	"log"
	"sort"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"
)

//go:embed migrations/*.sql
var migrationFiles embed.FS

// Migrate applies every "*.up.sql" file under migrations/ that hasn't been
// recorded in schema_migrations yet, in filename order, each in its own
// transaction. Filenames are expected to sort in the order they should run
// (e.g. 0001_init.up.sql, 0002_seed.up.sql).
func Migrate(ctx context.Context, pool *pgxpool.Pool) error {
	if _, err := pool.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS schema_migrations (
			version     TEXT PRIMARY KEY,
			applied_at  TIMESTAMPTZ NOT NULL DEFAULT now()
		)
	`); err != nil {
		return fmt.Errorf("create schema_migrations: %w", err)
	}

	entries, err := fs.Glob(migrationFiles, "migrations/*.up.sql")
	if err != nil {
		return fmt.Errorf("glob migrations: %w", err)
	}
	sort.Strings(entries)

	for _, path := range entries {
		version := strings.TrimSuffix(strings.TrimPrefix(path, "migrations/"), ".up.sql")

		var already bool
		err := pool.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM schema_migrations WHERE version = $1)`, version).Scan(&already)
		if err != nil {
			return fmt.Errorf("check migration %s: %w", version, err)
		}
		if already {
			continue
		}

		content, err := migrationFiles.ReadFile(path)
		if err != nil {
			return fmt.Errorf("read migration %s: %w", path, err)
		}

		tx, err := pool.Begin(ctx)
		if err != nil {
			return fmt.Errorf("begin tx for %s: %w", version, err)
		}

		if _, err := tx.Exec(ctx, string(content)); err != nil {
			tx.Rollback(ctx)
			return fmt.Errorf("apply migration %s: %w", version, err)
		}
		if _, err := tx.Exec(ctx, `INSERT INTO schema_migrations (version) VALUES ($1)`, version); err != nil {
			tx.Rollback(ctx)
			return fmt.Errorf("record migration %s: %w", version, err)
		}
		if err := tx.Commit(ctx); err != nil {
			return fmt.Errorf("commit migration %s: %w", version, err)
		}

		log.Printf("db: applied migration %s", version)
	}

	return nil
}
