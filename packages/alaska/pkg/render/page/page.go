package page

import (
	"net/http"

	"github.com/gfffrtt/alaska/packages/alaska/pkg/render/partial"
)

type Page struct {
	Flusher  http.Flusher
	Request  *http.Request
	Response http.ResponseWriter
	Stream   *partial.Stream
}

func NewPage(request *http.Request, response http.ResponseWriter) *Page {
	flusher := response.(http.Flusher)
	stream := partial.NewStream(response, flusher)
	return &Page{
		Request:  request,
		Response: response,
		Stream:   stream,
		Flusher:  flusher,
	}
}

func (p *Page) Partial(handler func() *partial.Partial) {
	p.Stream.Enqueue(handler)
}

func (p *Page) Render() {
	go p.Stream.Process()
	p.Flusher.Flush()
	p.Stream.Render()
}
