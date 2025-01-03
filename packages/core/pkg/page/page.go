package page

import (
	"go-web/pkg/stream"
	"net/http"
)

type Page struct {
	Flusher  http.Flusher
	Request  *http.Request
	Response http.ResponseWriter
	Stream   *stream.Stream
}

func NewPage(request *http.Request, response http.ResponseWriter) *Page {
	flusher := response.(http.Flusher)
	stream := stream.NewStream(response, flusher)
	return &Page{
		Request:  request,
		Response: response,
		Stream:   stream,
		Flusher:  flusher,
	}
}

func (p *Page) Partial(handler func() *stream.Partial) {
	p.Stream.Enqueue(handler)
}

func (p *Page) Render() {
	go p.Stream.Process()
	p.Flusher.Flush()
	p.Stream.Render()
}
