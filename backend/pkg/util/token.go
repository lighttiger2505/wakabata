package util

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtSecretKey = []byte("your-secret-key") // TODO: 環境変数から取得するように変更する

type Claims struct {
	UserID string `json:"user_id"`
	jwt.RegisteredClaims
}

// GenerateJWTToken JWTトークンを生成する
func GenerateJWTToken(userID string) (string, error) {
	expirationTime := time.Now().Add(30 * time.Minute)
	claims := &Claims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtSecretKey)
	if err != nil {
		return "", fmt.Errorf("could not generate token: %v", err)
	}

	return tokenString, nil
}

// ValidateJWTToken JWTトークンを検証する
func ValidateJWTToken(tokenString string) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecretKey, nil
	})

	if err != nil {
		return nil, fmt.Errorf("could not parse token: %v", err)
	}

	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return claims, nil
}

// GenerateRefreshToken リフレッシュトークンを生成する
func GenerateRefreshToken() (string, string, error) {
	// 32バイトのランダムな値を生成
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", "", fmt.Errorf("could not generate refresh token: %v", err)
	}

	// Base64エンコードしてトークンとして使用
	token := base64.URLEncoding.EncodeToString(b)

	// トークンをSHA256でハッシュ化
	hash := sha256.New()
	hash.Write([]byte(token))
	tokenHash := hex.EncodeToString(hash.Sum(nil))

	return token, tokenHash, nil
}

// HashToken 文字列をSHA256でハッシュ化する
func HashToken(token string) string {
	hash := sha256.New()
	hash.Write([]byte(token))
	return hex.EncodeToString(hash.Sum(nil))
}
