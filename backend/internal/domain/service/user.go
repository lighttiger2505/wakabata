package service

import (
	"context"

	wakabatav1 "github.com/lighttiger2505/wakabata/internal/app/v1"
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

func (s *UserService) Create(ctx context.Context, createUser *wakabatav1.CreateUserRequest) (*wakabatav1.User, error) {
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

func (s *UserService) Update(ctx context.Context, updateUser *wakabatav1.UpdateUserRequest) (*wakabatav1.User, error) {
	user := &model.User{
		ID:           updateUser.Id,
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

func (s *UserService) Search(ctx context.Context, searchUser *wakabatav1.SearchUsersRequest) ([]*wakabatav1.User, error) {
	users, err := s.UserInfra.Search(ctx, searchUser)
	if err != nil {
		return nil, err
	}
	results := make([]*wakabatav1.User, len(users))
	for i, user := range users {
		results[i] = s.parseUser(user)
	}
	return results, nil
}

func (s *UserService) Get(ctx context.Context, getUser *wakabatav1.GetUserRequest) (*wakabatav1.User, error) {
	user, err := s.UserInfra.Get(ctx, getUser)
	if err != nil {
		return nil, err
	}
	return s.parseUser(user), nil
}

func (s *UserService) parseUser(modelUser *model.User) *wakabatav1.User {
	return &wakabatav1.User{
		Id:           modelUser.ID,
		Username:     modelUser.Username,
		Email:        modelUser.Email,
		PasswordHash: modelUser.PasswordHash,
		CreatedAt:    "",
		UpdatedAt:    "",
	}
}
