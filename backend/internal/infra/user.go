package infra

import (
	"context"

	"github.com/lighttiger2505/WakabaTasks/backend/internal/infra/peristence/query"
	"github.com/lighttiger2505/WakabaTasks/backend/internal/model"
)

type UserInfra struct {
}

func NewUserInfra() *UserInfra {
	return &UserInfra{}
}

func (i *UserInfra) Create(ctx context.Context, user *model.User) error {
	return query.User.WithContext(ctx).Create(&user)
}

func (i *UserInfra) Update(ctx context.Context, user *model.User) error {
	return query.User.WithContext(ctx).Create(&user)
}
