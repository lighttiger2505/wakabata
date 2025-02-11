package main

import (
	"log"

	"github.com/go-fuego/fuego"
	"github.com/lighttiger2505/wakabata/internal/app"
	"github.com/lighttiger2505/wakabata/internal/domain/service"
	"github.com/lighttiger2505/wakabata/internal/infra"
	"github.com/lighttiger2505/wakabata/internal/infra/persistence/postgres"
	"github.com/lighttiger2505/wakabata/internal/infra/persistence/query"

	"github.com/rs/cors"
)

func main() {
	gormdb, err := postgres.OpenGormDB()
	if err != nil {
		log.Fatal(err)
	}
	query.SetDefault(gormdb)

	server := fuego.NewServer(
		fuego.WithAddr("localhost:8088"),
		fuego.WithEngineOptions(
			fuego.WithOpenAPIConfig(
				fuego.OpenAPIConfig{
					PrettyFormatJSON: true,
				},
			),
		),
		fuego.WithBasePath("/api/v1"),
	)
	fuego.Use(server, cors.AllowAll().Handler)

	userInfra := infra.NewUserInfra()
	userService := service.NewUserService(userInfra)
	userHandler := app.NewUserHandler(userService)
	userHandler.SetHandler(server)

	taskInfra := infra.NewTaskInfra()
	taskService := service.NewTaskService(taskInfra)
	taskHandler := app.NewTaskHandler(taskService)
	taskHandler.SetHandler(server)

	server.Run()
}
