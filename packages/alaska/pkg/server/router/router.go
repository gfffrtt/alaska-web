package router

import (
	"context"
	"fmt"
	"go-web/pkg/render"
	"go-web/pkg/render/page"
	"go-web/pkg/server"
	"net/http"

	"github.com/a-h/templ"
)

type Router struct {
	Base   string
	App    server.HttpServer
	Layout render.Component
}

func NewRouter(app server.HttpServer) *Router {
	return &Router{
		App:  app,
		Base: "",
	}
}

type PageHandler func(p *page.Page) render.Component

func (r *Router) Group(base string) *Router {
	return &Router{
		App:    r.App,
		Base:   base,
		Layout: r.Layout,
	}
}

func (r *Router) Page(path string, handler PageHandler) {
	r.App.Get(fmt.Sprintf("%s%s", r.Base, path), func(writer http.ResponseWriter, request *http.Request) {
		writer.Header().Set("Content-Type", "text/html")

		page := page.NewPage(request, writer)

		component := handler(page)

		isPageOnly := request.FormValue("page") == "true"

		if r.Layout != nil && !isPageOnly {
			ctx := templ.WithChildren(context.Background(), component)
			r.Layout.Render(ctx, writer)
		} else {
			component.Render(context.Background(), writer)
		}

		page.Render()
	})
}

func (r *Router) WithLayout(component render.Component) {
	r.Layout = component
}
