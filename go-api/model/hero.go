package model

import (
	"context"
	"errors"
	"sync"
	"time"

	"com.aviebrantz.dota.api/database"
)

type DotaHeroVersus struct {
	Advantage float64 `json:"advantage"`
	ID        string  `json:"id"`
	Matches   int     `json:"matches"`
	Name      string  `json:"name"`
	WinRate   float64 `json:"winRate"`
}

type DotaHero struct {
	ID          string                    `json:"id"`
	ImageURL    string                    `json:"imageUrl"`
	Name        string                    `json:"name"`
	Rank        int                       `json:"rank"`
	WinRate     float64                   `json:"winRate"`
	BestHeroes  map[string]DotaHeroVersus `json:"bestHeroes,omitempty"`
	WorstHeroes map[string]DotaHeroVersus `json:"worstHeroes,omitempty"`
}

type ByDotaHeroVersusAdvantage []DotaHeroVersus

func (s ByDotaHeroVersusAdvantage) Len() int {
	return len(s)
}
func (s ByDotaHeroVersusAdvantage) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}
func (s ByDotaHeroVersusAdvantage) Less(i, j int) bool {
	return s[i].Advantage > s[j].Advantage
}

func LoadHeroesList(ids []string) ([]DotaHero, error) {
	var heroes []DotaHero

	heroesRef := database.FirebaseDB.NewRef("/heroes")

	ctx, cancel := context.WithCancel(context.Background())
	var wg sync.WaitGroup
	var mutex = &sync.Mutex{}

	for i := 0; i < len(ids); i++ {
		id := ids[i]
		wg.Add(1)
		go func(id string, wg *sync.WaitGroup) {
			defer wg.Done()
			var hero DotaHero
			err := heroesRef.Child(id).Get(ctx, &hero)
			if err == nil {
				mutex.Lock()
				heroes = append(heroes, hero)
				mutex.Unlock()
			}
		}(id, &wg)
	}

	timeout := make(chan bool, 1)
	done := make(chan bool, 1)

	go func() {
		time.Sleep(5 * time.Second)
		cancel()
		timeout <- true
	}()

	go func() {
		wg.Wait()
		done <- true
	}()

	select {
	case <-done:
		return heroes, nil
	case <-timeout:
		return nil, errors.New("Timeout getting heroes data")
	}
}
