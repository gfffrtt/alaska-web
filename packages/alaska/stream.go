package alaska

import (
	"context"
	"net/http"
	"sync"
)

type Stream struct {
	Response  http.ResponseWriter
	Flusher   http.Flusher
	Content   chan *Partial
	Queue     []func() *Partial
	WaitGroup sync.WaitGroup
}

func NewStream(response http.ResponseWriter, flusher http.Flusher) *Stream {
	return &Stream{
		Response:  response,
		Flusher:   flusher,
		Content:   make(chan *Partial),
		Queue:     []func() *Partial{},
		WaitGroup: sync.WaitGroup{},
	}
}

func (s *Stream) Enqueue(handler func() *Partial) {
	s.Queue = append(s.Queue, func() *Partial {
		content := handler()
		s.Content <- content
		s.WaitGroup.Done()
		return content
	})
	s.WaitGroup.Add(1)
}

func (s *Stream) Process() {
	for _, handler := range s.Queue {
		go handler()
	}
	s.WaitGroup.Wait()
	close(s.Content)
}

func (s *Stream) Render() {
	for {
		content := <-s.Content
		if content == nil {
			return
		}
		if err := content.Render(context.Background(), s.Response); err != nil {
			continue
		}
		s.Flusher.Flush()
	}
}
