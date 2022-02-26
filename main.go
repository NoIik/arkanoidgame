package main

import (
	"fmt"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	_, err := GetDB()
	if err != nil {
		fmt.Println(err)
		return
	}
	port := "4001"
	http.Handle("/", http.FileServer(http.Dir("src")))
	http.HandleFunc("/get/scores", GetAllScoresHandler)
	http.HandleFunc("/save/score", SaveScoreHandler)

	fmt.Println("Listening to Server on port " + port)
	http.ListenAndServe(":"+port, nil)
}
