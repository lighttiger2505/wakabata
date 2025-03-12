package util

import (
	"crypto/sha256"
	"encoding/hex"

	"github.com/google/uuid"
)

// GenerateVerificationToken generates a new UUID and returns both the raw token and its SHA256 hash
func GenerateVerificationToken() (string, string, error) {
	// Generate UUID
	token := uuid.New().String()

	// Generate SHA256 hash
	hash := sha256.New()
	hash.Write([]byte(token))
	tokenHash := hex.EncodeToString(hash.Sum(nil))

	return token, tokenHash, nil
}
