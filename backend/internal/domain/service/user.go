package service

import (
	"context"

	"github.com/lighttiger2505/wakabata/internal/domain/model"
	"github.com/lighttiger2505/wakabata/internal/infra"
)

type UserService struct {
	UserInfra *infra.UserInfra
}

func NewUserService(userInfra *infra.UserInfra) *UserService {
	return &UserService{
		UserInfra: userInfra,
	}
}

func (s *UserService) Create(ctx context.Context, user *model.User) (*model.User, error) {
	createdUser, err := s.UserInfra.Create(ctx, user)
	if err != nil {
		return nil, err
	}
	return createdUser, nil
}

func (s *UserService) Update(ctx context.Context, id int, user *model.User) (*model.User, error) {
	existingUser, err := s.Get(ctx, id)
	if err != nil {
		return nil, err
	}

	existingUser.Username = user.Username
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
