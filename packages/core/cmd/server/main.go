package main

import (
	"context"
	"go-web/internal/pages"
	"net/http"
)

func main() {
	app := http.NewServeMux()

	app.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("assets"))))

	app.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		pages.Page().Render(context.Background(), w)
	})

	http.ListenAndServe(":8080", app)
}
