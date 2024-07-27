package service

import (
	"context"

	"github.com/lighttiger2505/wakabata/internal/domain/entity"
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

func (s *UserService) Create(ctx context.Context, createUser *entity.CreateUser) (*entity.User, error) {
	user := &model.User{
		Username:     createUser.Username,
		Email:        createUser.Email,
		PasswordHash: createUser.Password,
	}
	createdUser, err := s.UserInfra.Create(ctx, user)
	if err != nil {
		return nil, err
	}
	return s.parseUser(createdUser), nil
}

func (s *UserService) Update(ctx context.Context, updateUser *entity.UpdateUser) (*entity.User, error) {
	user := &model.User{
		ID:           updateUser.ID,
		Username:     updateUser.Username,
		Email:        updateUser.Email,
		PasswordHash: updateUser.Password,
	}
	updatedUser, err := s.UserInfra.Update(ctx, user)
	if err != nil {
		return nil, err
	}
	return s.parseUser(updatedUser), nil
}

func (s *UserService) parseUser(modelUser *model.User) *entity.User {
	return &entity.User{
		ID:       modelUser.ID,
		Username: modelUser.Username,
		Email:    modelUser.Email,
	}
}

func (s *UserService) Search() error {
	return nil
}

func (s *UserService) Get() error {
	return nil
}
