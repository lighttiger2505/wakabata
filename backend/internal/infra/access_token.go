package infra

import (
	"context"
	"time"

	"github.com/lighttiger2505/wakabata/internal/domain/model"
	"github.com/lighttiger2505/wakabata/internal/infra/persistence/query"
)

type AccessTokenInfra struct {
}

func NewAccessTokenInfra() *AccessTokenInfra {
	return &AccessTokenInfra{}
}

func (i *AccessTokenInfra) Create(ctx context.Context, token *model.AccessToken) error {
	if err := query.AccessToken.WithContext(ctx).Create(token); err != nil {
		return err
	}
	return nil
}

func (i *AccessTokenInfra) GetByToken(ctx context.Context, tokenHash string) (*model.AccessToken, error) {
	t := query.AccessToken
	db := query.AccessToken.WithContext(ctx)
	return db.Where(t.TokenHash.Eq(tokenHash)).First()
}

func (i *AccessTokenInfra) RevokeToken(ctx context.Context, token *model.AccessToken) error {
	now := time.Now()
	token.RevokedAt = &now
	if err := query.AccessToken.WithContext(ctx).Save(token); err != nil {
		return err
	}
	return nil
}

func (i *AccessTokenInfra) RevokeAllUserTokens(ctx context.Context, userID string) error {
	now := time.Now()
	t := query.AccessToken
	db := query.AccessToken.WithContext(ctx)
	_, err := db.Where(t.UserID.Eq(userID), t.RevokedAt.IsNull()).Update(t.RevokedAt, &now)
	return err
}
