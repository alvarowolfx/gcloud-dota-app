package controllers

import (
	"context"
	"os"
	"sort"
	"strconv"
	"strings"

	"com.aviebrantz.dota.api/model"
	"github.com/gofiber/fiber"
)

type HeroController struct {
	HeroRepository       model.HeroRepository
	maxHeroesRecommended int
}

func NewHeroController(heroRepository model.HeroRepository) *HeroController {
	maxHeroesRecommended := 5
	if envMaxHeroesRecommended := os.Getenv("MAX_HEROES_RECOMMENDED"); envMaxHeroesRecommended != "" {
		v, err := strconv.Atoi(envMaxHeroesRecommended)
		if err == nil {
			maxHeroesRecommended = v
		}
	}
	return &HeroController{
		HeroRepository:       heroRepository,
		maxHeroesRecommended: maxHeroesRecommended,
	}
}

func (hr *HeroController) GetHeroById(c *fiber.Ctx) {
	heroID := c.Params("heroId")
	ctx := context.Background()
	hero, err := hr.HeroRepository.FindById(ctx, heroID)
	if err != nil {
		c.Status(500).JSON(map[string]string{"message": "Internal error to fetch data"})
		return
	}
	if hero == nil {
		c.Status(404).JSON(map[string]string{"message": "Hero Not Found"})
		return
	}
	c.Status(200).JSON(hero)
}

func (hr *HeroController) GetHeroesRecommendations(c *fiber.Ctx) {
	enemies := c.Query("enemies")
	if enemies == "" {
		c.Status(400).JSON(map[string]string{"message": "Missing enemies query parameter"})
		return
	}
	enemiesIds := strings.Split(enemies, ",")

	if len(enemiesIds) > 5 {
		c.Status(400).JSON(map[string]string{"message": "Max number of enemies"})
		return
	}

	team := c.Query("team")
	teamIds := strings.Split(team, ",")

	if len(teamIds) > 5 {
		c.Status(400).JSON(map[string]string{"message": "Max number of team heroes"})
		return
	}

	heroesIds, err := hr.getRecommendations(enemiesIds, teamIds)
	if err != nil {
		c.Status(500).JSON(map[string]string{"message": err.Error()})
		return
	}

	finalHeroes, err := hr.HeroRepository.LoadHeroesList(heroesIds)
	if err != nil {
		c.Status(500).JSON(map[string]string{"message": err.Error()})
		return
	}

	finalHeroesMap := map[string]model.DotaHero{}
	for _, hero := range finalHeroes {
		hero.BestHeroes = nil
		hero.WorstHeroes = nil
		finalHeroesMap[hero.ID] = hero
	}

	c.Status(200).JSON(finalHeroesMap)
}

func (hc *HeroController) getRecommendations(enemiesIds, teamIds []string) ([]string, error) {
	teamMap := map[string]bool{}
	for _, teamID := range teamIds {
		teamMap[teamID] = true
	}

	enemyHeroes, err := hc.HeroRepository.LoadHeroesList(enemiesIds)
	if err != nil {
		return nil, err
	}

	intersections := make(map[string]model.DotaHeroVersus)
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
				if hero, ok := enemyB.WorstHeroes[key]; ok {
					_, isOnMyTeam := teamMap[key]
					if !isOnMyTeam {
						intersections[key] = hero
					}
				}
			}
		}
	}

	var heroesIds []string
	intersectCount := len(intersections)
	if intersectCount > 0 {
		for heroID := range intersections {
			heroesIds = append(heroesIds, heroID)
		}
	}

	if intersectCount < hc.maxHeroesRecommended {
		missingHeroes := hc.maxHeroesRecommended - intersectCount
		var allHeroes []model.DotaHeroVersus
		for _, enemy := range enemyHeroes {
			for _, hero := range enemy.WorstHeroes {
				_, isOnMyTeam := teamMap[hero.ID]
				_, isOnEnemyTeam := enemyMap[hero.ID]
				_, isOnIntersection := intersections[hero.ID]
				if !isOnMyTeam && !isOnIntersection && !isOnEnemyTeam {
					allHeroes = append(allHeroes, hero)
				}
			}
		}
		allHeroesLen := len(allHeroes)
		if allHeroesLen > 0 {
			sort.Sort(model.ByDotaHeroVersusAdvantage(allHeroes))
			cache := map[string]bool{}
			min := missingHeroes
			if allHeroesLen < missingHeroes {
				min = allHeroesLen
			}
			for _, hero := range allHeroes[0:min] {
				if _, ok := cache[hero.ID]; !ok {
					heroesIds = append(heroesIds, hero.ID)
					cache[hero.ID] = true
				}
			}
		}
	}
	return heroesIds, nil
}
