package main

import (
	"log"
	"net/http"

	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"

	"github.com/lighttiger2505/wakabata/internal/app"
	"github.com/lighttiger2505/wakabata/internal/app/v1/wakabatav1connect"
)

func main() {
	mux := http.NewServeMux()

	{
		svc := app.NewUserHandler()
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
