package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"connectrpc.com/connect"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"

	wakabatav1 "github.com/lighttiger2505/wakabata/internal/app/v1"
	"github.com/lighttiger2505/wakabata/internal/app/v1/wakabatav1connect"
)

type WakabataServer struct{}

func (s *WakabataServer) Wakabata(
	ctx context.Context,
	req *connect.Request[wakabatav1.WakabataRequest],
) (*connect.Response[wakabatav1.WakabataResponse], error) {
	log.Println("Request headers: ", req.Header())
	res := connect.NewResponse(&wakabatav1.WakabataResponse{
		Greeting: fmt.Sprintf("Hello, %s!", req.Msg.Name),
	})
	res.Header().Set("Greet-Version", "v1")
	return res, nil
}

func main() {
	server := &WakabataServer{}
	mux := http.NewServeMux()
	path, handler := wakabatav1connect.NewWakabataServiceHandler(server)
	mux.Handle(path, handler)
	err := http.ListenAndServe(
		"localhost:8080",
		// Use h2c so we can serve HTTP/2 without TLS.
		h2c.NewHandler(mux, &http2.Server{}),
	)
	if err != nil {
		log.Fatal(err)
	}
}
