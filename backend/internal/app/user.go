package app

import (
	"context"

	"connectrpc.com/connect"
	wakabatav1 "github.com/lighttiger2505/wakabata/internal/app/v1"
	"github.com/lighttiger2505/wakabata/internal/domain/service"
)

type UserHandler struct {
	Service *service.UserService
}

func NewUserHandler(s *service.UserService) *UserHandler {
	return &UserHandler{s}
}

func (h *UserHandler) CreateUser(ctx context.Context, req *connect.Request[wakabatav1.CreateUserRequest]) (*connect.Response[wakabatav1.CreateUserResponse], error) {
	user, err := h.Service.Create(ctx, req.Msg)
	if err != nil {
		return nil, err
	}

	res := connect.NewResponse(&wakabatav1.CreateUserResponse{
		User: user,
	})
	return res, nil
}

func (h *UserHandler) UpdateUser(ctx context.Context, req *connect.Request[wakabatav1.UpdateUserRequest]) (*connect.Response[wakabatav1.UpdateUserResponse], error) {
	user, err := h.Service.Update(ctx, req.Msg)
	if err != nil {
		return nil, err
	}

	res := connect.NewResponse(&wakabatav1.UpdateUserResponse{
		User: user,
	})
	return res, nil
}

func (h *UserHandler) SearchUsers(ctx context.Context, req *connect.Request[wakabatav1.SearchUsersRequest]) (*connect.Response[wakabatav1.SearchUsersResponse], error) {
	users, err := h.Service.Search(ctx, req.Msg)
	if err != nil {
		return nil, err
	}

	res := connect.NewResponse(&wakabatav1.SearchUsersResponse{
		Users: users,
	})
	return res, nil
}

func (h *UserHandler) GetUser(ctx context.Context, req *connect.Request[wakabatav1.GetUserRequest]) (*connect.Response[wakabatav1.GetUserResponse], error) {
	user, err := h.Service.Get(ctx, req.Msg)
	if err != nil {
		return nil, err
	}

	res := connect.NewResponse(&wakabatav1.GetUserResponse{
		User: user,
	})
	return res, nil
}
