package main

import (
	"net/http"
	"with-react/internal/components/layout"
	"with-react/internal/db"
	"with-react/internal/pages"
	"with-react/internal/usecase"

	"github.com/gfffrtt/alaska"
)

func main() {
	mux := http.NewServeMux()
	db := db.NewDB()
	defer db.Close()
	app := alaska.NewRouter(alaska.NewStdHttpServer(mux))

	countRepo := usecase.NewCountRepository(db)
	getCountByIp := usecase.NewGetCountByIp(countRepo)
	incrementCount := usecase.NewIncrementCount(countRepo)
	decrementCount := usecase.NewDecrementCount(countRepo)
	saveCount := usecase.NewSaveCount(countRepo)

	app.App.Static()

	app.WithLayout(layout.Layout())

	app.Page("/", func(page *alaska.Page) alaska.Component {
		return pages.HomePage()
	})

	app.Page("/counter", func(page *alaska.Page) alaska.Component {
		count, err := getCountByIp.Execute(page.Request.Header.Get("x-forwarded-for"))
		if err != nil {
			err := saveCount.Execute(page.Request.Header.Get("x-forwarded-for"), 0)
			if err != nil {
				panic(err)
			}
			return pages.CounterPage(0)
		}
		if count == nil {
			err := saveCount.Execute(page.Request.Header.Get("x-forwarded-for"), 0)
			if err != nil {
				panic(err)
			}
			return pages.CounterPage(0)
		}
		return pages.CounterPage(count.Count)
	})

	app.App.Post("/increment", func(w http.ResponseWriter, r *http.Request) {
		_, err := incrementCount.Execute(r.Header.Get("x-forwarded-for"))
		if err != nil {
			panic(err)
		}
		w.WriteHeader(http.StatusOK)
	})

	app.App.Post("/decrement", func(w http.ResponseWriter, r *http.Request) {
		_, err := decrementCount.Execute(r.Header.Get("x-forwarded-for"))
		if err != nil {
			panic(err)
		}
		w.WriteHeader(http.StatusOK)
	})

	http.ListenAndServe(":8080", mux)
}
