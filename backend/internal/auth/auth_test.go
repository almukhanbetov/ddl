package auth

import "testing"

func TestAdminSessionFollowsPassword(t *testing.T) {
	const secret = "test-only"
	token, _, err := IssueAdminToken(secret, 1, "a@example.com", "hash-1")
	if err != nil {
		t.Fatal(err)
	}
	claims, err := ParseToken(secret, token)
	if err != nil {
		t.Fatal(err)
	}
	if claims.Role != RoleAdmin || !claims.MatchesPassword(secret, "hash-1") {
		t.Error("a fresh session must be accepted")
	}
	if claims.MatchesPassword(secret, "hash-2") {
		t.Error("a session must end when the stored hash changes")
	}

	// Issued before fingerprints existed.
	legacy, _, _ := IssueToken(secret, 1, "a@example.com", RoleAdmin)
	if claims, err = ParseToken(secret, legacy); err != nil {
		t.Fatal(err)
	}
	if claims.MatchesPassword(secret, "hash-1") {
		t.Error("a token without a fingerprint must be rejected")
	}
}
