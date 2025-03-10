package util

import (
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"errors"
	"fmt"
	"strings"

	"golang.org/x/crypto/argon2"
)

// Argon2パラメータ
const (
	time    = 1         // 計算回数
	memory  = 64 * 1024 // 使用メモリ（KiB単位、例: 64MB）
	threads = 4         // 並列処理数
	keyLen  = 32        // 生成するハッシュの長さ（バイト）
	saltLen = 16        // ソルトの長さ（バイト）
)

// GenerateHash は、指定したパスワードからランダムなソルトを生成し、Argon2idでハッシュを生成します。
// 結果は、フォーマット "$argon2id$v=19$m=65536,t=1,p=4$<salt>$<hash>" の文字列として返します。
func GenerateHash(password string) (string, error) {
	// ソルトの生成
	salt := make([]byte, saltLen)
	if _, err := rand.Read(salt); err != nil {
		return "", err
	}

	// パスワードハッシュの生成
	hash := argon2.IDKey([]byte(password), salt, time, memory, uint8(threads), keyLen)

	// ソルトとハッシュをBase64エンコード（パディング無し）
	b64Salt := base64.RawStdEncoding.EncodeToString(salt)
	b64Hash := base64.RawStdEncoding.EncodeToString(hash)

	// ハッシュのフォーマット化
	encodedHash := fmt.Sprintf("$argon2id$v=19$m=%d,t=%d,p=%d$%s$%s", memory, time, threads, b64Salt, b64Hash)
	return encodedHash, nil
}

// ComparePasswordAndHash は、パスワードと保存されているハッシュ文字列を比較し、正しいか検証します。
func ComparePasswordAndHash(password, encodedHash string) (bool, error) {
	// エンコードされたハッシュを "$" で分割する
	parts := strings.Split(encodedHash, "$")
	if len(parts) != 6 {
		return false, errors.New("invalid hash format")
	}
	// parts[3]にはパラメータ (例: "m=65536,t=1,p=4")、parts[4]がBase64エンコードされたソルト、parts[5]がハッシュ
	var mem uint32
	var timeParam uint32
	var thr uint8
	_, err := fmt.Sscanf(parts[3], "m=%d,t=%d,p=%d", &mem, &timeParam, &thr)
	if err != nil {
		return false, err
	}
	salt, err := base64.RawStdEncoding.DecodeString(parts[4])
	if err != nil {
		return false, err
	}
	hash, err := base64.RawStdEncoding.DecodeString(parts[5])
	if err != nil {
		return false, err
	}

	// 入力されたパスワードからハッシュを再生成
	computedHash := argon2.IDKey([]byte(password), salt, timeParam, mem, thr, uint32(len(hash)))

	// 定数時間比較で検証
	if subtle.ConstantTimeCompare(hash, computedHash) == 1 {
		return true, nil
	}
	return false, nil
}
