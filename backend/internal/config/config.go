package config

import (
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

func Load() Config {
	return Config{
		Env:          getEnv("APP_ENV", "development"),
		HTTPPort:     getEnv("HTTP_PORT", "8080"),
		DatabaseURL:  getEnv("DATABASE_URL", "postgres://ddl:ddl_dev_password@localhost:5434/ddl?sslmode=disable"),
		CORSOrigins:  splitCSV(getEnv("CORS_ORIGINS", "http://localhost:3000")),
		JWTSecret:    getEnv("JWT_SECRET", "dev-insecure-secret-change-me"),
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
