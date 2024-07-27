package service

import (
	"context"

	"github.com/lighttiger2505/WakabaTasks/backend/internal/domain/model"
	"github.com/lighttiger2505/WakabaTasks/backend/internal/infra"
)

type UserService struct {
	UserInfra *infra.UserInfra
}

func NewUserService() *UserService {
	return &UserService{}
}

func (s *UserService) Create(ctx context.Context) error {
	user := &model.User{}
	if err := s.UserInfra.Create(ctx, user); err != nil {
		return err
	}
	return nil
}

func (s *UserService) Update(ctx context.Context) error {
	user := &model.User{}
	if err := s.UserInfra.Update(ctx, user); err != nil {
		return err
	}
	return nil
}

func (s *UserService) Search() error {
	return nil
}

func (s *UserService) Get() error {
	return nil
}
