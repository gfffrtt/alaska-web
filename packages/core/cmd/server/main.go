package main

import (
	"context"
	"go-web/internal/pages/home"
	"go-web/pkg/page"
	"go-web/pkg/port"
	"go-web/pkg/router"
	"go-web/pkg/stream"
	"net/http"
	"time"
)

func Home(p *page.Page) {
	p.Partial(func() *stream.Partial {
		time.Sleep(time.Second * 5)
		return stream.NewPartial("user", home.User())
	})

	p.Partial(func() *stream.Partial {
		time.Sleep(time.Second * 2)
		return stream.NewPartial("sidebar", home.Sidebard())
	})

	home.Home().Render(context.Background(), p.Response)
}

func main() {
	app := http.NewServeMux()

	router := router.NewRouter(port.NewStdHttpServer(app))

	router.Page("/", Home)

	http.ListenAndServe(":3000", app)
}
