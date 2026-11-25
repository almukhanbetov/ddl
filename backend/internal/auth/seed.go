package auth

// seedAdminHash is the hash inserted by migration 0003. Its password was
// committed to the repository, so it must never grant access in production.
const seedAdminHash = "$2a$10$LcEDE8DBbrLnZj6Dp9nwUODyWw.qRCtjTXqPucUVdEfBkAdSJNJ7i"

// IsSeedPassword reports whether password is the publicly known seed password.
func IsSeedPassword(password string) bool {
	return CheckPassword(seedAdminHash, password)
}

// IsSeedHash reports whether an account still has the untouched seed password.
func IsSeedHash(hash string) bool {
	return hash == seedAdminHash
}
