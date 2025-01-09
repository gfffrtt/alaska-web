package port

import "net/http"

type StdHttpServer struct {
	App *http.ServeMux
}

func NewStdHttpServer(app *http.ServeMux) *StdHttpServer {
	return &StdHttpServer{
		App: app,
	}
}

func (s *StdHttpServer) Get(path string, handler func(http.ResponseWriter, *http.Request)) {
	s.App.HandleFunc(path, handler)
}

func (s *StdHttpServer) Post(path string, handler func(http.ResponseWriter, *http.Request)) {
	s.App.HandleFunc(path, handler)
}
