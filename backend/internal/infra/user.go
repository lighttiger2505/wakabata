package infra

import (
	"context"

	wakabatav1 "github.com/lighttiger2505/wakabata/internal/app/v1"
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

func (i *UserInfra) Search(ctx context.Context, searchUser *wakabatav1.SearchUsersRequest) ([]*model.User, error) {
	u := query.User
	db := query.User.WithContext(ctx)

	if searchUser.Email != "" {
		db = db.Where(u.Email.Like("%" + searchUser.Email + "%"))
	}
	if searchUser.Username != "" {
		db = db.Where(u.Username.Like("%" + searchUser.Username + "%"))
	}

	return db.Find()
}

func (i *UserInfra) Get(ctx context.Context, getUser *wakabatav1.GetUserRequest) (*model.User, error) {
	u := query.User
	db := query.User.WithContext(ctx)
	return db.Where(u.ID.Eq(getUser.Id)).First()
}
