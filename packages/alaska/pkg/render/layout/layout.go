package layout

import (
	"net/http"

	"github.com/gfffrtt/alaska/tree/main/packages/alaska/pkg/render/partial"
)

type Layout struct {
	Flusher  http.Flusher
	Request  *http.Request
	Response http.ResponseWriter
	Stream   *partial.Stream
}

func NewLayout(request *http.Request, response http.ResponseWriter) *Layout {
	flusher := response.(http.Flusher)
	stream := partial.NewStream(response, flusher)
	return &Layout{
		Request:  request,
		Response: response,
		Stream:   stream,
		Flusher:  flusher,
	}
}

func (p *Layout) Partial(handler func() *partial.Partial) {
	p.Stream.Enqueue(handler)
}

func (p *Layout) Render() {
	go p.Stream.Process()
	p.Flusher.Flush()
	p.Stream.Render()
}
