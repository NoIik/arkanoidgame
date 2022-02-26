package main

import (
	"time"
)

type Player struct {
	ID        int64     `json:"id"`
	Username  string    `json:"username"`
	Score     int       `json:"score"`
	CreatedAt time.Time `json:"created_at"`
}

type Players []Player

func (a Players) Len() int {
	return len(a)
}

func (a Players) Less(i, j int) bool {
	return a[i].Score > a[j].Score
}

func (a Players) Swap(i, j int) {
	a[i], a[j] = a[j], a[i]
}
