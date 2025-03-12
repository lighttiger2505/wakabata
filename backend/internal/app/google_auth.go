package app

import (
	"fmt"
	"net/http"

	"github.com/go-fuego/fuego"
	"github.com/go-fuego/fuego/option"
	"github.com/lighttiger2505/wakabata/internal/domain/service"
)

type GoogleAuthHandler struct {
	Service *service.GoogleAuthService
}

func NewGoogleAuthHandler(s *service.GoogleAuthService) *GoogleAuthHandler {
	return &GoogleAuthHandler{s}
}

func (h *GoogleAuthHandler) SetHandler(server *fuego.Server) {
	tagName := "auth"
	fuego.Get(server, "/auth/google/login", h.Login, option.Tags(tagName))
	fuego.Get(server, "/auth/google/callback", h.Callback, option.Tags(tagName))
}

type RedirectResponse struct {
	URL string `json:"-"`
}

func (r RedirectResponse) StatusCode() int {
	return http.StatusTemporaryRedirect
}

func (r RedirectResponse) Headers() map[string]string {
	return map[string]string{
		"Location": r.URL,
	}
}

// Login Googleログイン用のURLを生成する
func (h *GoogleAuthHandler) Login(c fuego.ContextNoBody) (*RedirectResponse, error) {
	authURL := h.Service.GetAuthURL()
	return &RedirectResponse{URL: authURL}, nil
}

// Callback Googleコールバックを処理する
func (h *GoogleAuthHandler) Callback(c fuego.ContextNoBody) (*service.TokenPair, error) {
	code := c.QueryParam("code")
	if code == "" {
		return nil, fuego.BadRequestError{
			Title:  "Invalid request",
			Detail: "Authorization code is missing",
		}
	}

	tokenPair, err := h.Service.HandleCallback(c.Context(), code)
	if err != nil {
		return nil, fuego.UnauthorizedError{
			Title:  "Authentication failed",
			Detail: fmt.Sprintf("Failed to authenticate with Google: %v", err),
			Err:    err,
		}
	}

	return tokenPair, nil
}
