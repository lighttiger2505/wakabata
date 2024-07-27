package app

import (
	"context"
	"log"

	"connectrpc.com/connect"
	wakabatav1 "github.com/lighttiger2505/wakabata/internal/app/v1"
)

type UserHandler struct {
}

func NewUserHandler() *UserHandler {
	return &UserHandler{}
}

func (h *UserHandler) CreateUser(ctx context.Context, req *connect.Request[wakabatav1.CreateUserRequest]) (*connect.Response[wakabatav1.CreateUserResponse], error) {
	log.Println("Request create user: ", req.Msg.Username, req.Msg.Username)
	res := connect.NewResponse(&wakabatav1.CreateUserResponse{
		User: &wakabatav1.User{},
	})
	log.Println("Created user")
	return res, nil
}

func (h *UserHandler) UpdateUser(ctx context.Context, req *connect.Request[wakabatav1.UpdateUserRequest]) (*connect.Response[wakabatav1.UpdateUserResponse], error) {
	res := connect.NewResponse(&wakabatav1.UpdateUserResponse{
		User: &wakabatav1.User{},
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
