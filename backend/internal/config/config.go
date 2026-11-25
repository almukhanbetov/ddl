package config

import (
	"errors"
	"os"
	"strings"
)

type Config struct {
	Env          string
	HTTPPort     string
	DatabaseURL  string
	CORSOrigins  []string
	JWTSecret    string
	CookieSecure bool
	UploadDir    string
}

const devJWTSecret = "dev-insecure-secret-change-me"

// Values published in the repository; anyone could sign a session with them.
var publicJWTSecrets = map[string]bool{
	devJWTSecret:                        true,
	"changeme-generate-a-random-secret": true, // .env.production.example
}

// ErrInsecureJWTSecret deliberately doesn't include the rejected value.
var ErrInsecureJWTSecret = errors.New("JWT_SECRET is missing, blank or a value published in the repository; generate one with: openssl rand -hex 32")

// Validate refuses settings that are only acceptable in development.
func (c Config) Validate() error {
	if c.Env != "production" {
		return nil
	}
	// Load replaces a missing or empty secret with devJWTSecret, so that case
	// is caught by the list too.
	secret := strings.TrimSpace(c.JWTSecret)
	if secret == "" || publicJWTSecrets[strings.ToLower(secret)] {
		return ErrInsecureJWTSecret
	}
	return nil
}

func Load() Config {
	return Config{
		Env:          getEnv("APP_ENV", "development"),
		HTTPPort:     getEnv("HTTP_PORT", "8080"),
		DatabaseURL:  getEnv("DATABASE_URL", "postgres://ddl:ddl_dev_password@localhost:5434/ddl?sslmode=disable"),
		CORSOrigins:  splitCSV(getEnv("CORS_ORIGINS", "http://localhost:3000")),
		JWTSecret:    getEnv("JWT_SECRET", devJWTSecret),
		CookieSecure: getEnv("APP_ENV", "development") == "production",
		UploadDir:    getEnv("UPLOAD_DIR", "./uploads"),
	}
}

func getEnv(key, fallback string) string {
	if v, ok := os.LookupEnv(key); ok && v != "" {
		return v
	}
	return fallback
}

func splitCSV(v string) []string {
	parts := strings.Split(v, ",")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		p = strings.TrimSpace(p)
		if p != "" {
			out = append(out, p)
		}
	}
	return out
}
