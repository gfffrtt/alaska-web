package db

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

func NewDB() *sql.DB {
	db, err := sql.Open("sqlite3", "file::memory:?cache=shared")
	if err != nil {
		panic(err)
	}

	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS counts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		count INTEGER NOT NULL,
		ip TEXT NOT NULL
	);`)

	if err != nil {
		panic(err)
	}

	return db
}
