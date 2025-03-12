package infra

import (
	"context"
	"strconv"

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

func (i *UserInfra) Search(ctx context.Context) ([]*model.User, error) {
	db := query.User.WithContext(ctx)
	return db.Find()
}

func (i *UserInfra) Get(ctx context.Context, id int) (*model.User, error) {
	u := query.User
	db := query.User.WithContext(ctx)
	return db.Where(u.ID.Eq(strconv.Itoa(id))).First()
}

func (i *UserInfra) GetByEmail(ctx context.Context, user *model.User) (*model.User, error) {
	u := query.User
	db := query.User.WithContext(ctx)
	return db.Where(u.Email.Eq(user.Email)).First()
}
