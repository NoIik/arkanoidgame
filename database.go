package main

import (
	"database/sql"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

func GetDB() (*sql.DB, error) {
	db, err := sql.Open("sqlite3", "./mainDB.db")
	if err != nil {
		return nil, err
	}
	if err = db.Ping(); err != nil {
		return nil, err
	}

	posts, err := db.Prepare("CREATE TABLE IF NOT EXISTS scores(username varchar, score int, createdAt datetime)")
	if err != nil {
		return nil, err
	}
	posts.Exec()
	return db, err
}

func InsertScore(player Player) (*Player, error) {
	db, err := GetDB()
	if err != nil {
		return nil, err
	}

	stmt := `INSERT INTO scores(username, score, createdAt)
		VALUES(?, ?, ?)`

	result, err := db.Exec(stmt, player.Username, player.Score, time.Now())

	if err != nil {
		db.Close()
		return nil, err
	}

	id, err := result.LastInsertId()

	if err != nil {
		db.Close()
		return nil, err
	}

	player.ID = id
	db.Close()
	return &player, err
}

func GetAllScore() ([]Player, error) {
	db, err := GetDB()
	if err != nil {
		return nil, err
	}

	stmt := `SELECT rowid, username, score, createdAt FROM scores`

	rows, err := db.Query(stmt)

	var players []Player

	if err != nil {
		return players, err
	}

	for rows.Next() {
		p := Player{}
		err = rows.Scan(&p.ID, &p.Username, &p.Score, &p.CreatedAt)
		if err != nil {
			return players, err
		}
		players = append(players, p)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return players, nil

}
