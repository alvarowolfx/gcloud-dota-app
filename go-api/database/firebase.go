package database

import (
	"context"
	"log"
	"os"

	firebase "firebase.google.com/go"
	"firebase.google.com/go/db"
)

func Connect() *db.Client {
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

	firebaseDB, err := fbApp.Database(ctx)
	if err != nil {
		log.Fatalln("Error initializing database client:", err)
	}

	return firebaseDB
}
