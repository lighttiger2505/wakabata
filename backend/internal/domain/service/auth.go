package service

import (
	"context"
	"fmt"
	"time"

	"github.com/lighttiger2505/wakabata/internal/domain/model"
	"github.com/lighttiger2505/wakabata/internal/infra"
	"github.com/lighttiger2505/wakabata/pkg/util"
)

type AuthService struct {
	UserInfra         *infra.UserInfra
	AccessTokenInfra  *infra.AccessTokenInfra
	RefreshTokenInfra *infra.RefreshTokenInfra
}

type TokenPair struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

func NewAuthService(
	userInfra *infra.UserInfra,
	accessTokenInfra *infra.AccessTokenInfra,
	refreshTokenInfra *infra.RefreshTokenInfra,
) *AuthService {
	return &AuthService{
		UserInfra:         userInfra,
		AccessTokenInfra:  accessTokenInfra,
		RefreshTokenInfra: refreshTokenInfra,
	}
}

func (s *AuthService) Login(ctx context.Context, email, password string) (*TokenPair, error) {
	// ユーザーを検索
	u := &model.User{Email: email}
	user, err := s.UserInfra.GetByEmail(ctx, u)
	if err != nil {
		return nil, fmt.Errorf("user not found: %v", err)
	}

	// パスワードを検証
	if !util.CompareHash(password, *user.PasswordHash) {
		return nil, fmt.Errorf("invalid password")
	}

	// 既存のトークンを無効化
	if err := s.AccessTokenInfra.RevokeAllUserTokens(ctx, user.ID); err != nil {
		return nil, fmt.Errorf("failed to revoke access tokens: %v", err)
	}
	if err := s.RefreshTokenInfra.RevokeAllUserTokens(ctx, user.ID); err != nil {
		return nil, fmt.Errorf("failed to revoke refresh tokens: %v", err)
	}

	// 新しいトークンペアを生成
	tokenPair, err := s.generateTokenPair(ctx, user.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to generate tokens: %v", err)
	}

	return tokenPair, nil
}

func (s *AuthService) RefreshTokens(ctx context.Context, refreshToken string) (*TokenPair, error) {
	// リフレッシュトークンをハッシュ化して検証
	tokenHash := util.HashToken(refreshToken)
	isValid, err := s.RefreshTokenInfra.IsTokenValid(ctx, tokenHash)
	if err != nil {
		return nil, fmt.Errorf("failed to validate refresh token: %v", err)
	}
	if !isValid {
		return nil, fmt.Errorf("invalid refresh token")
	}

	// 現在のリフレッシュトークンを取得
	currentToken, err := s.RefreshTokenInfra.GetByToken(ctx, tokenHash)
	if err != nil {
		return nil, fmt.Errorf("failed to get refresh token: %v", err)
	}

	// 現在のリフレッシュトークンを無効化
	if err := s.RefreshTokenInfra.RevokeToken(ctx, currentToken); err != nil {
		return nil, fmt.Errorf("failed to revoke refresh token: %v", err)
	}

	// 新しいトークンペアを生成
	tokenPair, err := s.generateTokenPair(ctx, currentToken.UserID)
	if err != nil {
		return nil, fmt.Errorf("failed to generate new tokens: %v", err)
	}

	return tokenPair, nil
}

func (s *AuthService) generateTokenPair(ctx context.Context, userID string) (*TokenPair, error) {
	// JWTアクセストークンを生成
	accessToken, err := util.GenerateJWTToken(userID)
	if err != nil {
		return nil, fmt.Errorf("failed to generate access token: %v", err)
	}

	// アクセストークンをハッシュ化してDBに保存
	accessTokenHash := util.HashToken(accessToken)
	accessTokenRecord := &model.AccessToken{
		UserID:    userID,
		TokenHash: accessTokenHash,
		IssuedAt:  time.Now(),
		ExpiresAt: time.Now().Add(30 * time.Minute),
	}
	if err := s.AccessTokenInfra.Create(ctx, accessTokenRecord); err != nil {
		return nil, fmt.Errorf("failed to save access token: %v", err)
	}

	// リフレッシュトークンを生成
	refreshToken, refreshTokenHash, err := util.GenerateRefreshToken()
	if err != nil {
		return nil, fmt.Errorf("failed to generate refresh token: %v", err)
	}

	// リフレッシュトークンをDBに保存
	refreshTokenRecord := &model.RefreshToken{
		UserID:    userID,
		TokenHash: refreshTokenHash,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour), // 7日間
	}
	if err := s.RefreshTokenInfra.Create(ctx, refreshTokenRecord); err != nil {
		return nil, fmt.Errorf("failed to save refresh token: %v", err)
	}

	return &TokenPair{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}
