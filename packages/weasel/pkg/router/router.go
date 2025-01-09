package router

import (
	"fmt"
	"go-web/pkg/adapter"
	"go-web/pkg/page"
	"net/http"
)

type Router struct {
	Base string
	App  adapter.HttpServer
}

func NewRouter(app adapter.HttpServer) *Router {
	return &Router{
		App:  app,
		Base: "",
	}
}

type PageHandler func(p *page.Page)

type GroupConfig struct {
}

func (r *Router) Group(base string) *Router {
	return &Router{
		App:  r.App,
		Base: base,
	}
}

func (r *Router) Page(path string, handler PageHandler) {
	r.App.Get(fmt.Sprintf("%s%s", r.Base, path), func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html")
		page := page.NewPage(r, w)
		handler(page)
		page.Render()
	})
}
