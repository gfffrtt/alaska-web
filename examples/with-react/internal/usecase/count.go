package usecase

import (
	"database/sql"
	"log/slog"
)

type Count struct {
	Count int `json:"count" db:"count"`
}

func (c *Count) Increment() {
	c.Count++
}

func (c *Count) Decrement() {
	c.Count--
}

func NewCount(count int) *Count {
	return &Count{Count: count}
}

type CountRepository struct {
	DB *sql.DB
}

func NewCountRepository(db *sql.DB) *CountRepository {
	return &CountRepository{DB: db}
}

func (r *CountRepository) GetCountByIp(ip string) (*Count, error) {
	var count int
	err := r.DB.QueryRow("SELECT count FROM counts WHERE ip = ?", ip).Scan(&count)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return NewCount(count), nil
}

func (r *CountRepository) UpdateCountByIp(ip string, count int) error {
	_, err := r.DB.Exec("UPDATE counts SET count = ? WHERE ip = ?", count, ip)
	return err
}

func (r *CountRepository) InsertCount(ip string, count int) error {
	_, err := r.DB.Exec("INSERT INTO counts (count, ip) VALUES (?, ?)", count, ip)
	return err
}

type IncrementCount struct {
	Repository *CountRepository
}

func NewIncrementCount(repository *CountRepository) *IncrementCount {
	return &IncrementCount{Repository: repository}
}

func (uc *IncrementCount) Execute(ip string) (*Count, error) {
	count, err := uc.Repository.GetCountByIp(ip)
	if err != nil {
		slog.Error("get")
		return nil, err
	}

	if count == nil {
		uc.Repository.InsertCount(ip, 0)
		count = NewCount(0)
	}

	count.Increment()

	if err := uc.Repository.UpdateCountByIp(ip, count.Count); err != nil {
		slog.Error("update count by ip failed")
		return nil, err
	}

	return count, nil
}

type DecrementCount struct {
	Repository *CountRepository
}

func NewDecrementCount(repository *CountRepository) *DecrementCount {
	return &DecrementCount{Repository: repository}
}

func (uc *DecrementCount) Execute(ip string) (*Count, error) {
	count, err := uc.Repository.GetCountByIp(ip)
	if err != nil {
		slog.Error("an error occurred")
		return nil, err
	}

	if count == nil {
		uc.Repository.InsertCount(ip, 0)
		count = NewCount(0)
	}

	count.Decrement()

	if err := uc.Repository.UpdateCountByIp(ip, count.Count); err != nil {
		slog.Error("update count by ip failed")
		return nil, err
	}

	return count, nil
}

type SaveCount struct {
	Repository *CountRepository
}

func NewSaveCount(repository *CountRepository) *SaveCount {
	return &SaveCount{Repository: repository}
}

func (uc *SaveCount) Execute(ip string, count int) error {
	err := uc.Repository.UpdateCountByIp(ip, count)
	if err != nil {
		err = uc.Repository.InsertCount(ip, count)
	}
	return err
}

type GetCountByIp struct {
	Repository *CountRepository
}

func NewGetCountByIp(repository *CountRepository) *GetCountByIp {
	return &GetCountByIp{Repository: repository}
}

func (uc *GetCountByIp) Execute(ip string) (*Count, error) {
	c, err := uc.Repository.GetCountByIp(ip)
	if err != nil {
		err = uc.Repository.InsertCount(ip, 0)
		return NewCount(0), err
	}
	return c, nil
}
