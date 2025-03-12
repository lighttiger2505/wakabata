package infra

import (
	"context"

	"github.com/lighttiger2505/wakabata/internal/domain/model"
	"github.com/lighttiger2505/wakabata/internal/infra/persistence/query"
)

type AuthProviderInfra struct {
}

func NewAuthProviderInfra() *AuthProviderInfra {
	return &AuthProviderInfra{}
}

func (i *AuthProviderInfra) Create(ctx context.Context, provider *model.AuthProvider) error {
	if err := query.AuthProvider.WithContext(ctx).Create(provider); err != nil {
		return err
	}
	return nil
}

func (i *AuthProviderInfra) GetByProviderUserID(ctx context.Context, provider, providerUserID string) (*model.AuthProvider, error) {
	p := query.AuthProvider
	db := query.AuthProvider.WithContext(ctx)
	return db.Where(
		p.Provider.Eq(provider),
		p.ProviderUserID.Eq(providerUserID),
	).First()
}

func (i *AuthProviderInfra) GetByUserID(ctx context.Context, userID string) ([]*model.AuthProvider, error) {
	p := query.AuthProvider
	db := query.AuthProvider.WithContext(ctx)
	return db.Where(p.UserID.Eq(userID)).Find()
}
