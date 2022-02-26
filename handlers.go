package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sort"
	"strconv"
)

//GetAllScoresHandler gives list of scores
func GetAllScoresHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		players, err := GetAllScore()
		if err != nil {
			fmt.Println(err)
			w.WriteHeader(500)
			return
		}
		sort.Sort(Players(players))

		s, err := json.Marshal(players)
		if err != nil {
			log.Print(err)
		}

		w.Write([]byte(s))
	} else {
		http.NotFound(w, r)
	}
}

//SaveScoreHandler scores the
func SaveScoreHandler(w http.ResponseWriter, r *http.Request) {

	var gamer Player
	err := r.ParseForm()
	if err != nil {
		w.WriteHeader(500)
		return
	}
	gamer.Username = r.FormValue("name")
	gamer.Score, _ = strconv.Atoi(r.FormValue("scoreHolder"))
	if gamer.Score == 0 {
		http.Redirect(w, r, "/", http.StatusSeeOther)
		return
	}
	_, err = InsertScore(gamer)

	if err != nil {
		fmt.Println(err)
		w.WriteHeader(500)
		return
	}
	http.Redirect(w, r, "/", http.StatusSeeOther)
}
