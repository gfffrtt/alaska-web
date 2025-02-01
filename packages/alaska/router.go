package alaska

import (
	"context"
	"fmt"
	"net/http"

	"github.com/a-h/templ"
)

type Router struct {
	Base   string
	App    HttpServer
	Layout Component
}

func NewRouter(app HttpServer) *Router {
	return &Router{
		App:  app,
		Base: "",
	}
}

type PageHandler func(p *Page) Component

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

		page := NewPage(request, writer)

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

func (r *Router) WithLayout(component Component) {
	r.Layout = component
}
