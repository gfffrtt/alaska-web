package alaska

import (
	"net/http"
)

type Page struct {
	Flusher  http.Flusher
	Request  *http.Request
	Response http.ResponseWriter
	Stream   *Stream
}

func NewPage(request *http.Request, response http.ResponseWriter) *Page {
	flusher := response.(http.Flusher)
	stream := NewStream(response, flusher)
	return &Page{
		Request:  request,
		Response: response,
		Stream:   stream,
		Flusher:  flusher,
	}
}

func (p *Page) Partial(handler func() *Partial) {
	p.Stream.Enqueue(handler)
}

func (p *Page) Render() {
	go p.Stream.Process()
	p.Flusher.Flush()
	p.Stream.Render()
}
