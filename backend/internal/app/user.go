package app

import (
	"strconv"

	"github.com/go-fuego/fuego"
	"github.com/go-fuego/fuego/option"
	"github.com/lighttiger2505/wakabata/internal/domain/model"
	"github.com/lighttiger2505/wakabata/internal/domain/service"
)

type UserHandler struct {
	Service *service.UserService
}

func NewUserHandler(s *service.UserService) *UserHandler {
	return &UserHandler{s}
}

func (h *UserHandler) SetHandler(server *fuego.Server) {

	tagName := "user"
	fuego.Get(server, "/users", h.SearchUsers, option.Tags(tagName))
	fuego.Post(server, "/users", h.CreateUser, option.Tags(tagName), option.DefaultStatusCode(201))
	fuego.Get(server, "/users/{id}", h.GetUser, option.Tags(tagName))
	fuego.Put(server, "/users/{id}", h.UpdateUser, option.Tags(tagName))
}

type UserToCreate struct {
	Username     string `json:"name" validate:"required"`
	Email        string `json:"email" validate:"required"`
	PasswordHash string `json:"password_hash" validate:"required"`
}

func (h *UserHandler) CreateUser(c fuego.ContextWithBody[*UserToCreate]) (*model.User, error) {
	input, err := c.Body()
	if err != nil {
		return nil, err
	}

	user := &model.User{
		Username:     input.Username,
		Email:        input.Email,
		PasswordHash: input.PasswordHash,
	}

	return h.Service.Create(c.Context(), user)
}

func (h *UserHandler) UpdateUser(c fuego.ContextWithBody[*model.User]) (*model.User, error) {
	ctx := c.Context()

	id, err := strconv.Atoi(c.PathParam("id"))
	if err != nil {
		return nil, fuego.BadRequestError{
			Title:  "Invalid ID",
			Detail: "The provided ID is not a valid integer.",
			Err:    err,
		}
	}

	input, err := c.Body()
	if err != nil {
		return nil, err
	}

	return h.Service.Update(ctx, id, input)
}

func (h *UserHandler) SearchUsers(c fuego.ContextNoBody) ([]*model.User, error) {
	return h.Service.Search(c.Context())
}

func (h *UserHandler) GetUser(c fuego.ContextNoBody) (*model.User, error) {
	id, err := strconv.Atoi(c.PathParam("id"))
	if err != nil {
		return nil, fuego.BadRequestError{
			Title:  "Invalid ID",
			Detail: "The provided ID is not a valid integer.",
			Err:    err,
		}
	}
	return h.Service.Get(c.Context(), id)
}
