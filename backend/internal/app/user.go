package app

import (
	"context"

	"connectrpc.com/connect"
	wakabatav1 "github.com/lighttiger2505/wakabata/internal/app/v1"
	"github.com/lighttiger2505/wakabata/internal/domain/entity"
	"github.com/lighttiger2505/wakabata/internal/domain/service"
)

type UserHandler struct {
	Service *service.UserService
}

func NewUserHandler(s *service.UserService) *UserHandler {
	return &UserHandler{s}
}

func (h *UserHandler) CreateUser(ctx context.Context, req *connect.Request[wakabatav1.CreateUserRequest]) (*connect.Response[wakabatav1.CreateUserResponse], error) {
	createUser := &entity.CreateUser{
		Username: req.Msg.Username,
		Email:    req.Msg.Email,
		Password: req.Msg.Password,
	}
	user, err := h.Service.Create(ctx, createUser)
	if err != nil {
		return nil, err
	}

	res := connect.NewResponse(&wakabatav1.CreateUserResponse{
		User: h.parseUser(user),
	})
	return res, nil
}

func (h *UserHandler) UpdateUser(ctx context.Context, req *connect.Request[wakabatav1.UpdateUserRequest]) (*connect.Response[wakabatav1.UpdateUserResponse], error) {
	updateUser := &entity.UpdateUser{
		ID:       req.Msg.Id,
		Username: req.Msg.Username,
		Email:    req.Msg.Email,
		Password: req.Msg.Password,
	}
	user, err := h.Service.Update(ctx, updateUser)
	if err != nil {
		return nil, err
	}

	res := connect.NewResponse(&wakabatav1.UpdateUserResponse{
		User: h.parseUser(user),
	})
	return res, nil
}

func (h *UserHandler) SearchUsers(ctx context.Context, req *connect.Request[wakabatav1.SearchUsersRequest]) (*connect.Response[wakabatav1.SearchUsersResponse], error) {
	res := connect.NewResponse(&wakabatav1.SearchUsersResponse{})
	return res, nil
}

func (h *UserHandler) GetUser(ctx context.Context, req *connect.Request[wakabatav1.GetUserRequest]) (*connect.Response[wakabatav1.GetUserResponse], error) {
	res := connect.NewResponse(&wakabatav1.GetUserResponse{})
	return res, nil
}

func (h *UserHandler) parseUser(entityUser *entity.User) *wakabatav1.User {
	return &wakabatav1.User{
		Id:           entityUser.ID,
		Username:     entityUser.Username,
		Email:        entityUser.Email,
		PasswordHash: "",
		CreatedAt:    "",
		UpdatedAt:    "",
	}
}
