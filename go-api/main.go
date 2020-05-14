package main

import (
	"errors"
	"log"
	"os"
	"sort"
	"strings"
	"sync"
	"time"

	firebase "firebase.google.com/go"
	"firebase.google.com/go/db"
	"github.com/gofiber/fiber"
	"github.com/joho/godotenv"

	"context"
)

var fbDb *db.Client

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

type byDotaHeroVersusAdvantage []DotaHeroVersus

func (s byDotaHeroVersusAdvantage) Len() int {
	return len(s)
}
func (s byDotaHeroVersusAdvantage) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}
func (s byDotaHeroVersusAdvantage) Less(i, j int) bool {
	return s[i].Advantage > s[j].Advantage
}

func loadHeroesList(ids []string) ([]DotaHero, error) {
	var heroes []DotaHero

	heroesRef := fbDb.NewRef("/heroes")

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

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file")
	}

	app := fiber.New()

	port := "3000"
	if envPort := os.Getenv("PORT"); envPort != "" {
		port = envPort
	}

	projectID := os.Getenv("GCP_PROJECT")
	if projectID == "" {
		// App Engine uses another name
		projectID = os.Getenv("GOOGLE_CLOUD_PROJECT")
	}

	config := &firebase.Config{
		ProjectID:   projectID,
		DatabaseURL: "https://" + projectID + ".firebaseio.com",
	}

	ctx := context.Background()
	fbApp, err := firebase.NewApp(ctx, config)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	}

	fbDb, err = fbApp.Database(ctx)
	if err != nil {
		log.Fatalln("Error initializing database client:", err)
	}

	app.Get("/", func(c *fiber.Ctx) {
		c.Send("Olá Mundo!")
	})

	app.Get("/hero/:heroId", func(c *fiber.Ctx) {
		heroID := c.Params("heroId")
		ctx := context.Background()
		hero := &DotaHero{}
		err := fbDb.NewRef("/heroes").Child(heroID).Get(ctx, hero)
		if err != nil {
			c.Status(500).JSON(map[string]string{"message": "Internal error to fetch data"})
			return
		}
		if hero == nil {
			c.Status(404).JSON(map[string]string{"message": "Hero Not Found"})
			return
		}
		c.Status(200).JSON(hero)
	})

	app.Get("/recommendation", func(c *fiber.Ctx) {
		enemies := c.Query("enemies")
		if enemies == "" {
			c.Status(400).JSON(map[string]string{"message": "Missing enemies query parameter"})
			return
		}

		enemiesIds := strings.Split(enemies, ",")
		enemyHeroes, err := loadHeroesList(enemiesIds)
		if err != nil {
			c.Status(500).JSON(map[string]string{"message": err.Error()})
			return
		}

		intersections := make(map[string]DotaHeroVersus)
		enemyMap := map[string]bool{}
		for _, enemy := range enemyHeroes {
			enemyMap[enemy.ID] = true
		}

		for i, enemyA := range enemyHeroes {
			for j, enemyB := range enemyHeroes {
				if i == j {
					continue
				}

				for key := range enemyA.WorstHeroes {
					if _, ok := enemyMap[key]; ok {
						continue
					}
					hero, ok := enemyB.WorstHeroes[key]
					if ok {
						intersections[key] = hero
					}
				}
			}
		}

		var heroesIds []string
		if len(intersections) > 0 {
			heroesIds = make([]string, len(intersections))
			i := 0
			for heroID := range intersections {
				heroesIds[i] = heroID
				i++
			}
		} else {
			var allHeroes []DotaHeroVersus
			for _, enemy := range enemyHeroes {
				for _, hero := range enemy.WorstHeroes {
					allHeroes = append(allHeroes, hero)
				}
			}
			sort.Sort(byDotaHeroVersusAdvantage(allHeroes))
			cache := map[string]bool{}
			for _, hero := range allHeroes[0:3] {
				if _, ok := cache[hero.ID]; !ok {
					heroesIds = append(heroesIds, hero.ID)
					cache[hero.ID] = true
				}
			}
		}

		finalHeroes, err := loadHeroesList(heroesIds)
		if err != nil {
			c.Status(500).JSON(map[string]string{"message": err.Error()})
			return
		}

		finalHeroesMap := map[string]DotaHero{}
		for _, hero := range finalHeroes {
			hero.BestHeroes = nil
			hero.WorstHeroes = nil
			finalHeroesMap[hero.ID] = hero
		}

		c.Status(200).JSON(finalHeroesMap)
	})

	app.Listen(port)
}
