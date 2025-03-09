package postgres

import (
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func OpenGormDB() (db *gorm.DB, err error) {
	host := getEnv("DB_HOST", "localhost")
	port := getEnv("DB_PORT", "5432")
	user := getEnv("DB_USER", "exampleuser")
	password := getEnv("DB_PASSWORD", "examplepass")
	dbname := getEnv("DB_NAME", "wakabatasks")

	dsn := "host=" + host + " user=" + user + " password=" + password + " dbname=" + dbname + " port=" + port + " sslmode=disable TimeZone=Asia/Tokyo"
	return gorm.Open(postgres.Open(dsn), &gorm.Config{})
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
