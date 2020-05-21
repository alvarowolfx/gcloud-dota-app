package logger

import (
	"os"
	"strconv"
	"time"

	"github.com/gofiber/fiber"
	fiberLogger "github.com/gofiber/logger"
	"go.uber.org/zap"
)

func NewZapLogger() func(*fiber.Ctx) {
	logConfig := "json"
	if logConfigEnv := os.Getenv("LOG_CONFIG"); logConfigEnv != "" {
		logConfig = logConfigEnv
	}

	if logConfig == "stdout" {
		return fiberLogger.New()
	}

	logger, _ := zap.NewProduction()

	return func(c *fiber.Ctx) {
		defer logger.Sync()
		start := time.Now()

		c.Next()

		stop := time.Now()

		timestamp := time.Now().Format(time.RFC3339)
		ip := c.IP()
		method := c.Method()
		path := c.Path()
		latency := stop.Sub(start).String()
		status := strconv.Itoa(c.Fasthttp.Response.StatusCode())

		logger.Info("REQUEST",
			zap.String("timestamp", timestamp),
			zap.String("method", method),
			zap.String("status", status),
			zap.String("ip", ip),
			zap.String("path", path),
			zap.String("latency", latency),
		)
	}
}
