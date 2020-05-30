package main

import (
	"log"
	"os"

	"com.aviebrantz.dota.api/controllers"
	"com.aviebrantz.dota.api/database"
	"com.aviebrantz.dota.api/logger"
	"com.aviebrantz.dota.api/model"
	"github.com/gofiber/cors"
	"github.com/gofiber/fiber"
	"github.com/gofiber/recover"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file")
	}

	port := "8000"
	if envPort := os.Getenv("PORT"); envPort != "" {
		port = envPort
	}

	log.Println(port)

	firebaseDB := database.Connect()
	heroRepository := model.NewFirebaseHeroRepository(firebaseDB)
	heroController := controllers.NewHeroController(heroRepository)

	app := fiber.New()

	app.Use(cors.New())
	app.Use(logger.NewZapLogger())
	cfg := recover.Config{
		Handler: func(c *fiber.Ctx, err error) {
			c.Status(500).JSON(fiber.Map{"message": err.Error()})
		},
	}
	app.Use(recover.New(cfg))

	app.Get("/", func(c *fiber.Ctx) {
		c.Send("Olá Twitch.tv!")
	})

	app.Get("/hero/:heroId", heroController.GetHeroById)
	app.Get("/recommendation", heroController.GetHeroesRecommendations)

	err = app.Listen(port)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	}
}
