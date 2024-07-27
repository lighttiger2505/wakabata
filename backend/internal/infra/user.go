package infra

import (
	"context"

	"github.com/lighttiger2505/wakabata/backend/internal/domain/model"
	"github.com/lighttiger2505/wakabata/backend/internal/infra/persistence/query"
)

type UserInfra struct {
}

func NewUserInfra() *UserInfra {
	return &UserInfra{}
}

func (i *UserInfra) Create(ctx context.Context, user *model.User) error {
	return query.User.WithContext(ctx).Create(user)
}

func (i *UserInfra) Update(ctx context.Context, user *model.User) error {
	return query.User.WithContext(ctx).Create(user)
}
