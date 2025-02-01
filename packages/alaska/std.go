package alaska

import (
	"fmt"
	"net/http"
)

type StdHttpServer struct {
	App *http.ServeMux
}

func NewStdHttpServer(app *http.ServeMux) *StdHttpServer {
	return &StdHttpServer{
		App: app,
	}
}

func (s *StdHttpServer) Get(path string, handler func(http.ResponseWriter, *http.Request)) {
	s.App.HandleFunc(fmt.Sprintf("GET %s", path), handler)
}

func (s *StdHttpServer) Post(path string, handler func(http.ResponseWriter, *http.Request)) {
	s.App.HandleFunc(fmt.Sprintf("POST %s", path), handler)
}

func (s *StdHttpServer) Static() {
	s.App.Handle("GET /static/", http.StripPrefix("/static/", http.FileServer(http.Dir("build"))))
}
