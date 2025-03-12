package main

import (
	"flag"
	"log"
	"net/http"

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
	userInfra := infra.NewUserInfra()
	emailVerificationTokenInfra := infra.NewEmailVerificationTokenInfra()
	userService := service.NewUserService(userInfra, emailVerificationTokenInfra)
	userHandler := app.NewUserHandler(userService)
	userHandler.SetHandler(api)

	taskInfra := infra.NewTaskInfra(gormdb)
	taskService := service.NewTaskService(taskInfra)
	taskHandler := app.NewTaskHandler(taskService)
	taskHandler.SetHandler(api)

	projectInfra := infra.NewProjectInfra()
	projectService := service.NewProjectService(projectInfra)
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
