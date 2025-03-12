package service

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/lighttiger2505/wakabata/internal/domain/model"
	"github.com/lighttiger2505/wakabata/internal/infra"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type GoogleAuthService struct {
	config            *oauth2.Config
	UserInfra         *infra.UserInfra
	AuthProviderInfra *infra.AuthProviderInfra
	AuthService       *AuthService
}

func NewGoogleAuthService(
	clientID string,
	clientSecret string,
	redirectURL string,
	userInfra *infra.UserInfra,
	authProviderInfra *infra.AuthProviderInfra,
	authService *AuthService,
) *GoogleAuthService {
	config := &oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		RedirectURL:  redirectURL,
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}

	return &GoogleAuthService{
		config:            config,
		UserInfra:         userInfra,
		AuthProviderInfra: authProviderInfra,
		AuthService:       authService,
	}
}

// GetAuthURL Google認証URLを生成する
func (s *GoogleAuthService) GetAuthURL() string {
	return s.config.AuthCodeURL("state")
}

type GoogleUserInfo struct {
	Sub           string `json:"sub"`
	Email         string `json:"email"`
	EmailVerified bool   `json:"email_verified"`
}

// HandleCallback Googleコールバックを処理する
func (s *GoogleAuthService) HandleCallback(ctx context.Context, code string) (*TokenPair, error) {
	// 認可コードをトークンに交換
	token, err := s.config.Exchange(ctx, code)
	if err != nil {
		return nil, fmt.Errorf("failed to exchange code: %v", err)
	}

	// ユーザー情報を取得
	userInfo, err := s.getUserInfo(ctx, token.AccessToken)
	if err != nil {
		return nil, fmt.Errorf("failed to get user info: %v", err)
	}

	// 既存のプロバイダー情報を確認
	authProvider, err := s.AuthProviderInfra.GetByProviderUserID(ctx, "google", userInfo.Sub)
	if err == nil {
		// 既存ユーザーの場合、トークンを生成して返す
		return s.AuthService.generateTokenPair(ctx, authProvider.UserID)
	}

	// 新規ユーザーの場合、ユーザーを作成
	userID := uuid.New().String()
	now := time.Now()
	emailVerified := userInfo.EmailVerified
	user := &model.User{
		ID:              userID,
		Email:           userInfo.Email,
		IsEmailVerified: &emailVerified,
		CreatedAt:       &now,
		UpdatedAt:       &now,
	}

	if _, err := s.UserInfra.Create(ctx, user); err != nil {
		return nil, fmt.Errorf("failed to create user: %v", err)
	}

	// 認証プロバイダー情報を保存
	provider := &model.AuthProvider{
		UserID:         userID,
		Provider:       "google",
		ProviderUserID: userInfo.Sub,
		CreatedAt:      &now,
		UpdatedAt:      &now,
	}

	if err := s.AuthProviderInfra.Create(ctx, provider); err != nil {
		return nil, fmt.Errorf("failed to create auth provider: %v", err)
	}

	// トークンを生成して返す
	return s.AuthService.generateTokenPair(ctx, userID)
}

// getUserInfo Googleのユーザー情報を取得する
func (s *GoogleAuthService) getUserInfo(ctx context.Context, accessToken string) (*GoogleUserInfo, error) {
	resp, err := http.Get("https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + accessToken)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var userInfo GoogleUserInfo
	if err := json.NewDecoder(resp.Body).Decode(&userInfo); err != nil {
		return nil, err
	}

	return &userInfo, nil
}
