package router

import (
	"go-web/pkg/adapter"
	"go-web/pkg/page"
	"net/http"
)

type Router struct {
	App adapter.HttpServer
}

func NewRouter(app adapter.HttpServer) *Router {
	return &Router{
		App: app,
	}
}

type PageHandler func(p *page.Page)

func (r *Router) Page(path string, handler PageHandler) {
	r.App.Get(path, func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html")
		page := page.NewPage(r, w)
		handler(page)
		page.Render()
	})
}
