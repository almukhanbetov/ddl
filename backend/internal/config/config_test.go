package config

import (
	"errors"
	"strings"
	"testing"
)

func TestValidateJWTSecret(t *testing.T) {
	const fresh = "5f0c9a1be2d84763a1f0e9d8c7b6a5943827160f1e2d3c4b5a69788796a5b4c3"
	cases := []struct {
		name, env, secret string
		ok                bool
	}{
		{"empty", "production", "", false},
		{"spaces", "production", "   ", false},
		{"tabs and newlines", "production", "\t\r\n ", false},
		{"dev value", "production", "dev-insecure-secret-change-me", false},
		{"dev value padded, upper case", "production", " DEV-INSECURE-SECRET-CHANGE-ME ", false},
		{"example value", "production", "changeme-generate-a-random-secret", false},
		{"random", "production", fresh, true},
		{"development keeps the default", "development", "", true},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			t.Setenv("APP_ENV", tc.env)
			t.Setenv("JWT_SECRET", tc.secret)
			err := Load().Validate()
			if tc.ok != (err == nil) {
				t.Fatalf("err = %v, want ok = %v", err, tc.ok)
			}
			if err != nil {
				if !errors.Is(err, ErrInsecureJWTSecret) {
					t.Fatalf("unexpected error %v", err)
				}
				if s := strings.TrimSpace(tc.secret); s != "" && strings.Contains(err.Error(), s) {
					t.Fatal("error reveals the secret")
				}
			}
		})
	}
}
