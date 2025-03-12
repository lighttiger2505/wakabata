package app

import (
	"github.com/go-fuego/fuego"
	"github.com/go-fuego/fuego/option"
	"github.com/lighttiger2505/wakabata/internal/domain/service"
)

type AuthHandler struct {
	Service *service.AuthService
}

func NewAuthHandler(s *service.AuthService) *AuthHandler {
	return &AuthHandler{s}
}

func (h *AuthHandler) SetHandler(server *fuego.Server) {
	tagName := "auth"
	fuego.Post(server, "/auth/login", h.Login, option.Tags(tagName), option.DefaultStatusCode(200), fuego.OptionRequestContentType("application/json"))
	fuego.Post(server, "/auth/refresh", h.RefreshToken, option.Tags(tagName), option.DefaultStatusCode(200), fuego.OptionRequestContentType("application/json"))
}

type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

func (h *AuthHandler) Login(c fuego.ContextWithBody[*LoginRequest]) (*service.TokenPair, error) {
	input, err := c.Body()
	if err != nil {
		return nil, err
	}

	tokenPair, err := h.Service.Login(c.Context(), input.Email, input.Password)
	if err != nil {
		return nil, fuego.UnauthorizedError{
			Title:  "Login failed",
			Detail: "Invalid email or password",
			Err:    err,
		}
	}

	return tokenPair, nil
}

type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token" validate:"required"`
}

func (h *AuthHandler) RefreshToken(c fuego.ContextWithBody[*RefreshTokenRequest]) (*service.TokenPair, error) {
	input, err := c.Body()
	if err != nil {
		return nil, err
	}

	tokenPair, err := h.Service.RefreshTokens(c.Context(), input.RefreshToken)
	if err != nil {
		return nil, fuego.UnauthorizedError{
			Title:  "Token refresh failed",
			Detail: "Invalid refresh token",
			Err:    err,
		}
	}

	return tokenPair, nil
}
