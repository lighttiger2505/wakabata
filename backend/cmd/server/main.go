package main

import (
	"flag"
	"log"
	"net/http"
	"os"

	"github.com/go-fuego/fuego"
	"github.com/lighttiger2505/wakabata/internal/app"
	"github.com/lighttiger2505/wakabata/internal/domain/service"
	"github.com/lighttiger2505/wakabata/internal/infra"
	"github.com/lighttiger2505/wakabata/internal/infra/persistence/postgres"
	"github.com/lighttiger2505/wakabata/internal/infra/persistence/query"

	"github.com/rs/cors"
)

var generateOpenAPI bool

func main() {
	flag.BoolVar(&generateOpenAPI, "generate-open-api", false, "Generate OpenAPI specification and exit")
	flag.Parse()

	// 環境変数の取得
	googleClientID := os.Getenv("GOOGLE_CLIENT_ID")
	if googleClientID == "" {
		log.Fatal("GOOGLE_CLIENT_ID is required")
	}
	googleClientSecret := os.Getenv("GOOGLE_CLIENT_SECRET")
	if googleClientSecret == "" {
		log.Fatal("GOOGLE_CLIENT_SECRET is required")
	}
	googleRedirectURL := os.Getenv("GOOGLE_REDIRECT_URL")
	if googleRedirectURL == "" {
		log.Fatal("GOOGLE_REDIRECT_URL is required")
	}

	gormdb, err := postgres.OpenGormDB()
	if err != nil {
		log.Fatal(err)
	}
	query.SetDefault(gormdb)

	server := fuego.NewServer(
		fuego.WithAddr("0.0.0.0:8088"),
		fuego.WithEngineOptions(
			fuego.WithOpenAPIConfig(
				fuego.OpenAPIConfig{
					PrettyFormatJSON: true,
				},
			),
		),
		fuego.WithGlobalMiddlewares(cors.New(cors.Options{
			AllowedOrigins: []string{"*"},
			AllowedMethods: []string{
				http.MethodHead,
				http.MethodGet,
				http.MethodPost,
				http.MethodPut,
				http.MethodPatch,
				http.MethodDelete,
			},
			AllowedHeaders:   []string{"*"},
			AllowCredentials: true,
		}).Handler),
	)
	server.OpenAPI.Description().Info.Description = "wakabata API"

	// Check health
	fuego.Get(server, "/health", func(c fuego.ContextNoBody) (string, error) {
		return "Server is running", nil
	})

	api := fuego.Group(server, "/api/v1")

	// インフラ層の初期化
	userInfra := infra.NewUserInfra()
	emailVerificationTokenInfra := infra.NewEmailVerificationTokenInfra()
	accessTokenInfra := infra.NewAccessTokenInfra()
	refreshTokenInfra := infra.NewRefreshTokenInfra()
	authProviderInfra := infra.NewAuthProviderInfra()
	taskInfra := infra.NewTaskInfra(gormdb)
	projectInfra := infra.NewProjectInfra()

	// サービス層の初期化
	userService := service.NewUserService(userInfra, emailVerificationTokenInfra)
	authService := service.NewAuthService(userInfra, accessTokenInfra, refreshTokenInfra)
	googleAuthService := service.NewGoogleAuthService(
		googleClientID,
		googleClientSecret,
		googleRedirectURL,
		userInfra,
		authProviderInfra,
		authService,
	)
	taskService := service.NewTaskService(taskInfra)
	projectService := service.NewProjectService(projectInfra)

	// ハンドラー層の初期化と登録
	authHandler := app.NewAuthHandler(authService)
	authHandler.SetHandler(api)

	googleAuthHandler := app.NewGoogleAuthHandler(googleAuthService)
	googleAuthHandler.SetHandler(api)

	userHandler := app.NewUserHandler(userService)
	userHandler.SetHandler(api)

	taskHandler := app.NewTaskHandler(taskService)
	taskHandler.SetHandler(api)

	projectHandler := app.NewProjectHandler(projectService)
	projectHandler.SetHandler(api)

	if generateOpenAPI {
		server.OutputOpenAPISpec()
		return
	}

	if err := server.Run(); err != nil {
		log.Fatal(err)
	}
}
