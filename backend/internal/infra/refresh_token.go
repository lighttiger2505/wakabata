package infra

import (
	"context"
	"time"

	"github.com/lighttiger2505/wakabata/internal/domain/model"
	"github.com/lighttiger2505/wakabata/internal/infra/persistence/query"
)

type RefreshTokenInfra struct {
}

func NewRefreshTokenInfra() *RefreshTokenInfra {
	return &RefreshTokenInfra{}
}

func (i *RefreshTokenInfra) Create(ctx context.Context, token *model.RefreshToken) error {
	if err := query.RefreshToken.WithContext(ctx).Create(token); err != nil {
		return err
	}
	return nil
}

func (i *RefreshTokenInfra) GetByToken(ctx context.Context, tokenHash string) (*model.RefreshToken, error) {
	t := query.RefreshToken
	db := query.RefreshToken.WithContext(ctx)
	return db.Where(t.TokenHash.Eq(tokenHash)).First()
}

func (i *RefreshTokenInfra) RevokeToken(ctx context.Context, token *model.RefreshToken) error {
	now := time.Now()
	token.RevokedAt = &now
	if err := query.RefreshToken.WithContext(ctx).Save(token); err != nil {
		return err
	}
	return nil
}

func (i *RefreshTokenInfra) RevokeAllUserTokens(ctx context.Context, userID string) error {
	now := time.Now()
	t := query.RefreshToken
	db := query.RefreshToken.WithContext(ctx)
	_, err := db.Where(t.UserID.Eq(userID), t.RevokedAt.IsNull()).Update(t.RevokedAt, &now)
	return err
}

func (i *RefreshTokenInfra) IsTokenValid(ctx context.Context, tokenHash string) (bool, error) {
	t := query.RefreshToken
	db := query.RefreshToken.WithContext(ctx)
	token, err := db.Where(
		t.TokenHash.Eq(tokenHash),
		t.RevokedAt.IsNull(),
		t.ExpiresAt.Gt(time.Now()),
	).First()
	if err != nil {
		return false, err
	}
	return token != nil, nil
}
