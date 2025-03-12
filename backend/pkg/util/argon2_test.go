package util

import (
	"strings"
	"testing"
)

func TestGenerateHash(t *testing.T) {
	t.Run("should generate hash successfully", func(t *testing.T) {
		password := "test-password"
		hash, err := GenerateHash(password)
		if err != nil {
			t.Errorf("GenerateHash() error = %v", err)
			return
		}

		// ハッシュが期待される形式かチェック
		parts := strings.Split(hash, "$")
		if len(parts) != 6 {
			t.Errorf("GenerateHash() invalid hash format, got %v parts, want 6", len(parts))
			return
		}

		if parts[1] != "argon2id" {
			t.Errorf("GenerateHash() invalid algorithm, got %v, want argon2id", parts[1])
		}
	})

	t.Run("should generate different hashes for same password", func(t *testing.T) {
		password := "test-password"
		hash1, err := GenerateHash(password)
		if err != nil {
			t.Errorf("GenerateHash() error = %v", err)
			return
		}

		hash2, err := GenerateHash(password)
		if err != nil {
			t.Errorf("GenerateHash() error = %v", err)
			return
		}

		if hash1 == hash2 {
			t.Error("GenerateHash() generated same hash for same password")
		}
	})
}

func TestCompareHash(t *testing.T) {
	t.Run("should return true for correct password", func(t *testing.T) {
		password := "test-password"
		hash, err := GenerateHash(password)
		if err != nil {
			t.Errorf("GenerateHash() error = %v", err)
			return
		}

		if !CompareHash(password, hash) {
			t.Error("CompareHash() returned false for correct password")
		}
	})

	t.Run("should return false for incorrect password", func(t *testing.T) {
		password := "test-password"
		hash, err := GenerateHash(password)
		if err != nil {
			t.Errorf("GenerateHash() error = %v", err)
			return
		}

		if CompareHash("wrong-password", hash) {
			t.Error("CompareHash() returned true for incorrect password")
		}
	})

	t.Run("should return false for invalid hash format", func(t *testing.T) {
		invalidHashes := []string{
			"invalid-hash",
			"$argon2id$v=19$m=65536,t=3,p=2$invalid-salt$invalid-hash",
			"$argon2id$v=19$invalid-params$salt$hash",
		}

		for _, hash := range invalidHashes {
			if CompareHash("test-password", hash) {
				t.Errorf("CompareHash() returned true for invalid hash format: %v", hash)
			}
		}
	})

	t.Run("should handle empty password and hash", func(t *testing.T) {
		if CompareHash("", "") {
			t.Error("CompareHash() returned true for empty password and hash")
		}

		hash, _ := GenerateHash("test-password")
		if CompareHash("", hash) {
			t.Error("CompareHash() returned true for empty password")
		}
	})
}
