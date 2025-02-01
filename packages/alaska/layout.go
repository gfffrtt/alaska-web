package alaska

import (
	"net/http"
)

type Layout struct {
	Flusher  http.Flusher
	Request  *http.Request
	Response http.ResponseWriter
	Stream   *Stream
}

func NewLayout(request *http.Request, response http.ResponseWriter) *Layout {
	flusher := response.(http.Flusher)
	stream := NewStream(response, flusher)
	return &Layout{
		Request:  request,
		Response: response,
		Stream:   stream,
		Flusher:  flusher,
	}
}

func (p *Layout) Partial(handler func() *Partial) {
	p.Stream.Enqueue(handler)
}

func (p *Layout) Render() {
	go p.Stream.Process()
	p.Flusher.Flush()
	p.Stream.Render()
}
