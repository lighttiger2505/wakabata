package infra

import (
	"context"

	"github.com/lighttiger2505/wakabata/internal/domain/model"
	"github.com/lighttiger2505/wakabata/internal/infra/persistence/query"
)

type UserInfra struct {
}

func NewUserInfra() *UserInfra {
	return &UserInfra{}
}

func (i *UserInfra) Create(ctx context.Context, user *model.User) (*model.User, error) {
	if err := query.User.WithContext(ctx).Create(user); err != nil {
		return nil, err
	}
	return user, nil
}

func (i *UserInfra) Update(ctx context.Context, user *model.User) (*model.User, error) {
	if err := query.User.WithContext(ctx).Create(user); err != nil {
		return nil, err
	}
	return user, nil
}
