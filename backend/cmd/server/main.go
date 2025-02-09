package main

import (
	"log"

	"github.com/go-fuego/fuego"
	"github.com/go-fuego/fuego/option"
	"github.com/lighttiger2505/wakabata/internal/app"
	"github.com/lighttiger2505/wakabata/internal/domain/service"
	"github.com/lighttiger2505/wakabata/internal/infra"
	"github.com/lighttiger2505/wakabata/internal/infra/persistence/postgres"
	"github.com/lighttiger2505/wakabata/internal/infra/persistence/query"
)

func main() {
	gormdb, err := postgres.OpenGormDB()
	if err != nil {
		log.Fatal(err)
	}
	query.SetDefault(gormdb)

	server := fuego.NewServer()

	userInfra := infra.NewUserInfra()
	userService := service.NewUserService(userInfra)
	userHandler := app.NewUserHandler(userService)

	fuego.Get(server, "/", func(c fuego.ContextNoBody) (string, error) {
		return "Hello, World!", nil
	})
	fuego.Get(server, "/users", userHandler.SearchUsers)
	fuego.Post(server, "/users", userHandler.CreateUser, option.DefaultStatusCode(201))
	fuego.Get(server, "/users/{id}", userHandler.GetUser)
	fuego.Put(server, "/users/{id}", userHandler.UpdateUser)

	server.Run()
}
