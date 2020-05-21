package model

import (
	"context"
	"errors"
	"sync"
	"time"

	"firebase.google.com/go/db"
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

type HeroRepository interface {
	FindById(ctx context.Context, id string) (*DotaHero, error)
	LoadHeroesList(ids []string) ([]DotaHero, error)
}

type FirebaseHeroRepository struct {
	FirebaseDB *db.Client
}

func NewFirebaseHeroRepository(firebaseDB *db.Client) HeroRepository {
	return &FirebaseHeroRepository{
		FirebaseDB: firebaseDB,
	}
}

func (fhr *FirebaseHeroRepository) FindById(ctx context.Context, id string) (*DotaHero, error) {
	hero := &DotaHero{}
	err := fhr.FirebaseDB.NewRef("/heroes").Child(id).Get(ctx, hero)
	return hero, err
}

func (fhr *FirebaseHeroRepository) LoadHeroesList(ids []string) ([]DotaHero, error) {
	var heroes []DotaHero

	ctx, cancel := context.WithCancel(context.Background())
	var wg sync.WaitGroup
	var mutex = &sync.Mutex{}

	for i := 0; i < len(ids); i++ {
		id := ids[i]
		wg.Add(1)
		go func(id string, wg *sync.WaitGroup) {
			defer wg.Done()
			hero, err := fhr.FindById(ctx, id)
			if err == nil {
				mutex.Lock()
				heroes = append(heroes, *hero)
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
