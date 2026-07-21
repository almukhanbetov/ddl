package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"
	"time"

	"github.com/joho/godotenv"

	"ddl/backend/internal/config"
	"ddl/backend/internal/db"
	"ddl/backend/internal/handlers"
	"ddl/backend/internal/repository"
	"ddl/backend/internal/router"
)

func main() {
	_ = godotenv.Load()
	cfg := config.Load()

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	pool, err := db.Connect(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("db connect: %v", err)
	}
	defer pool.Close()

	if err := db.Migrate(ctx, pool); err != nil {
		log.Fatalf("db migrate: %v", err)
	}

	for _, subdir := range []string{"reviews", "admin"} {
		if err := os.MkdirAll(filepath.Join(cfg.UploadDir, subdir), 0o755); err != nil {
			log.Fatalf("create upload dir: %v", err)
		}
	}

	repo := repository.New(pool)
	h := handlers.New(repo, cfg.DeliveryCost, cfg.JWTSecret, cfg.CookieSecure, cfg.UploadDir)
	engine := router.New(h, cfg.CORSOrigins, cfg.UploadDir)

	srv := &http.Server{
		Addr:    ":" + cfg.HTTPPort,
		Handler: engine,
	}

	go func() {
		log.Printf("api: listening on :%s (env=%s)", cfg.HTTPPort, cfg.Env)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %v", err)
		}
	}()

	<-ctx.Done()
	log.Println("api: shutting down")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Fatalf("shutdown: %v", err)
	}
}
