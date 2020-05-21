package controllers

import (
	"context"
	"io/ioutil"
	"net/http"
	"strings"
	"testing"

	"com.aviebrantz.dota.api/model"
	"github.com/gofiber/fiber"
)

type FakeHeroRepository struct {
	database map[string]*model.DotaHero
}

func (fhr *FakeHeroRepository) FindById(ctx context.Context, id string) (*model.DotaHero, error) {
	hero := fhr.database[id]
	return hero, nil
}

func (fhr *FakeHeroRepository) LoadHeroesList(ids []string) ([]model.DotaHero, error) {
	var heroes []model.DotaHero
	for _, id := range ids {
		hero := fhr.database[id]
		heroes = append(heroes, *hero)
	}
	return heroes, nil
}

func TestGetRecommendationIntersection(t *testing.T) {
	heroRepository := &FakeHeroRepository{
		database: map[string]*model.DotaHero{
			"h1": {
				ID: "h1",
				WorstHeroes: map[string]model.DotaHeroVersus{
					"h4": {
						ID: "h4",
					},
					"h2": {
						ID: "h2",
					},
				},
			},
			"h2": {
				ID: "h2",
				WorstHeroes: map[string]model.DotaHeroVersus{
					"h4": {
						ID: "h4",
					},
					"h5": {
						ID: "h5",
					},
				},
			},
			"h3": {
				ID: "h3",
				WorstHeroes: map[string]model.DotaHeroVersus{
					"h5": {
						ID: "h5",
					},
				},
			},
		},
	}
	controller := NewHeroController(heroRepository)

	enemiesIds := []string{"h1", "h2"}
	teamIds := []string{}

	heroesIds, _ := controller.getRecommendations(enemiesIds, teamIds)
	expected := "h4,h5"
	joinedHeroesIds := strings.Join(heroesIds, ",")

	if joinedHeroesIds != expected {
		t.Errorf("getRecommendation(h1,h2) = %s; want %s", joinedHeroesIds, expected)
	}
}

func TestGetRecommendationIntersectionFillTopHero(t *testing.T) {
	heroRepository := &FakeHeroRepository{
		database: map[string]*model.DotaHero{
			"h1": {
				ID: "h1",
				WorstHeroes: map[string]model.DotaHeroVersus{
					"h4": {
						ID: "h4",
					},
				},
			},
			"h2": {
				ID: "h2",
				WorstHeroes: map[string]model.DotaHeroVersus{
					"h4": {
						ID: "h4",
					},
					"h5": {
						ID:        "h5",
						Advantage: 10,
					},
				},
			},
			"h3": {
				ID: "h3",
				WorstHeroes: map[string]model.DotaHeroVersus{
					"h6": {
						ID:        "h6",
						Advantage: 20,
					},
					"h7": {
						ID:        "h7",
						Advantage: 30,
					},
				},
			},
		},
	}
	controller := NewHeroController(heroRepository)

	enemiesIds := []string{"h1", "h2", "h3"}
	teamIds := []string{"h7"}

	heroesIds, _ := controller.getRecommendations(enemiesIds, teamIds)
	expected := "h4,h6,h5"
	joinedHeroesIds := strings.Join(heroesIds, ",")

	if joinedHeroesIds != expected {
		t.Errorf("getRecommendation((h1,h2,h3),(h7)) = %s; want %s", joinedHeroesIds, expected)
	}
}

func TestGetHeroBydId(t *testing.T) {
	heroRepository := &FakeHeroRepository{
		database: map[string]*model.DotaHero{
			"h1": {
				ID:       "h1",
				ImageURL: "/img",
				Name:     "Hero 1",
				Rank:     1,
				WinRate:  50.1,
			},
		},
	}

	tests := []struct {
		description   string
		route         string
		expectedError bool
		expectedCode  int
		expectedBody  string
	}{
		{
			description:  "Find Hero 1",
			route:        "/h1",
			expectedCode: 200,
			expectedBody: `{"id":"h1","imageUrl":"/img","name":"Hero 1","rank":1,"winRate":50.1}`,
		},
		{
			description:  "Non Existing Hero",
			route:        "/not-hero",
			expectedCode: 404,
			expectedBody: `{"message":"Hero Not Found"}`,
		},
	}

	controller := NewHeroController(heroRepository)
	app := fiber.New()
	app.Get("/:heroId", controller.GetHeroById)
	// Iterate through test single test cases
	for _, test := range tests {

		req, _ := http.NewRequest(
			"GET",
			test.route,
			nil,
		)

		res, err := app.Test(req, -1)
		if err != nil {
			t.Errorf("error sending test request: %s", err.Error())
		}

		if res.StatusCode != test.expectedCode {
			t.Errorf("expected status code %d, receivd %d", test.expectedCode, res.StatusCode)
		}

		body, err := ioutil.ReadAll(res.Body)
		if err != nil {
			t.Errorf("error getting request body: %s", err.Error())
		}

		if string(body) != test.expectedBody {
			t.Errorf("GetHeroById(%s) = %s; want %s", test.description, string(body), test.expectedBody)
		}
	}
}

func TestGetHeroRecommendation(t *testing.T) {
	heroRepository := &FakeHeroRepository{
		database: map[string]*model.DotaHero{
			"h1": {
				ID: "h1",
				WorstHeroes: map[string]model.DotaHeroVersus{
					"h3": {
						ID: "h3",
					},
				},
			},
			"h3": {
				ID:       "h3",
				ImageURL: "/img",
				Name:     "Hero 3",
				Rank:     3,
				WinRate:  50.1,
			},
		},
	}

	tests := []struct {
		description   string
		route         string
		expectedError bool
		expectedCode  int
		expectedBody  string
	}{
		{
			description:  "Missing enemies parameter",
			route:        "/rec",
			expectedCode: 400,
			expectedBody: `{"message":"Missing enemies query parameter"}`,
		},
		{
			description:  "Max enemies",
			route:        "/rec?enemies=h1,h2,h3,h4,h5,h6",
			expectedCode: 400,
			expectedBody: `{"message":"Max number of enemies"}`,
		},
		{
			description:  "Max own team heroes",
			route:        "/rec?enemies=h7&team=h1,h2,h3,h4,h5,h6",
			expectedCode: 400,
			expectedBody: `{"message":"Max number of team heroes"}`,
		},
		{
			description:  "Return hero recommendation",
			route:        "/rec?enemies=h1",
			expectedCode: 200,
			expectedBody: `{"h3":{"id":"h3","imageUrl":"/img","name":"Hero 3","rank":3,"winRate":50.1}}`,
		},
	}

	controller := NewHeroController(heroRepository)
	app := fiber.New()
	app.Get("/rec", controller.GetHeroesRecommendations)
	// Iterate through test single test cases
	for _, test := range tests {

		req, _ := http.NewRequest(
			"GET",
			test.route,
			nil,
		)

		res, err := app.Test(req, -1)
		if err != nil {
			t.Errorf("error sending test request: %s", err.Error())
		}

		if res.StatusCode != test.expectedCode {
			t.Errorf("expected status code %d, receivd %d", test.expectedCode, res.StatusCode)
		}

		body, err := ioutil.ReadAll(res.Body)
		if err != nil {
			t.Errorf("error getting request body: %s", err.Error())
		}

		if string(body) != test.expectedBody {
			t.Errorf("GetHeroesRecommendations(%s) = %s; want %s", test.description, string(body), test.expectedBody)
		}
	}
}
