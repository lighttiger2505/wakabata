package main

import (
	"log"
	"net/http"

	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"

	"github.com/lighttiger2505/wakabata/internal/app"
	"github.com/lighttiger2505/wakabata/internal/app/v1/wakabatav1connect"
	"github.com/lighttiger2505/wakabata/internal/domain/service"
	"github.com/lighttiger2505/wakabata/internal/infra"
)

func main() {
	mux := http.NewServeMux()

	{
		i := infra.NewUserInfra()
		s := service.NewUserService(i)
		svc := app.NewUserHandler(s)
		path, handler := wakabatav1connect.NewUserServiceHandler(svc)
		mux.Handle(path, handler)
	}

	err := http.ListenAndServe(
		"localhost:8080",
		// Use h2c so we can serve HTTP/2 without TLS.
		h2c.NewHandler(mux, &http2.Server{}),
	)
	if err != nil {
		log.Fatal(err)
	}
}
