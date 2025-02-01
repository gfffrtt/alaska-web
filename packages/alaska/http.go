package alaska

import "net/http"

type HttpServer interface {
	Get(string, func(http.ResponseWriter, *http.Request))
	Post(string, func(http.ResponseWriter, *http.Request))
	Static()
}
