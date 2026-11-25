package auth

import (
	"os"
	"strings"
	"testing"
)

func TestSeedHashMatchesMigration(t *testing.T) {
	sql, err := os.ReadFile("../db/migrations/0003_admin.up.sql")
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(sql), seedAdminHash) {
		t.Fatal("seedAdminHash differs from the hash in migration 0003")
	}
	if !IsSeedHash(seedAdminHash) || IsSeedHash("other") || IsSeedPassword("some-other-password") {
		t.Fatal("seed checks are wrong")
	}
}
