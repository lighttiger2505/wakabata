package service

import (
	"context"
	"time"

	"github.com/lighttiger2505/wakabata/internal/domain/model"
	"github.com/lighttiger2505/wakabata/internal/infra"
	"github.com/lighttiger2505/wakabata/pkg/util"
)

type UserService struct {
	UserInfra                   *infra.UserInfra
	EmailVerificationTokenInfra *infra.EmailVerificationTokenInfra
}

func NewUserService(userInfra *infra.UserInfra, emailVerificationTokenInfra *infra.EmailVerificationTokenInfra) *UserService {
	return &UserService{
		UserInfra:                   userInfra,
		EmailVerificationTokenInfra: emailVerificationTokenInfra,
	}
}

func (s *UserService) Create(ctx context.Context, user *model.User) (*model.User, error) {
	// ユーザーを作成
	createdUser, err := s.UserInfra.Create(ctx, user)
	if err != nil {
		return nil, err
	}

	// メール認証トークンを生成
	_, tokenHash, err := util.GenerateVerificationToken()
	if err != nil {
		return nil, err
	}

	expiresAt := time.Now().Add(24 * time.Hour) // 24時間有効

	// メール認証トークンを保存
	verificationToken := &model.EmailVerificationToken{
		UserID:    createdUser.ID,
		TokenHash: tokenHash,
		ExpiresAt: expiresAt,
	}
	if err := s.EmailVerificationTokenInfra.Create(ctx, verificationToken); err != nil {
		return nil, err
	}

	// TODO: メール送信機能を実装する
	// 以下のような処理を追加予定：
	// - メール認証用のURLを生成（例：https://example.com/verify-email?token={rawToken}）
	// - ユーザーのメールアドレスに認証メールを送信
	// - メール本文には認証URLとトークンの有効期限（24時間）を含める

	return createdUser, nil
}

func (s *UserService) Update(ctx context.Context, id int, user *model.User) (*model.User, error) {
	existingUser, err := s.Get(ctx, id)
	if err != nil {
		return nil, err
	}

	existingUser.Email = user.Email
	existingUser.PasswordHash = user.PasswordHash

	updatedUser, err := s.UserInfra.Update(ctx, user)
	if err != nil {
		return nil, err
	}
	return updatedUser, nil
}

func (s *UserService) Search(ctx context.Context) ([]*model.User, error) {
	users, err := s.UserInfra.Search(ctx)
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (s *UserService) Get(ctx context.Context, id int) (*model.User, error) {
	user, err := s.UserInfra.Get(ctx, id)
	if err != nil {
		return nil, err
	}
	return user, nil
}
