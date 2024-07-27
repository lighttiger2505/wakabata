package postgres

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	_ "github.com/jackc/pgx/v5"
)

func OpenGormDB() (db *gorm.DB, err error) {
	dsn := "host=localhost user=exampleuser password=examplepass dbname=wakabatasks port=5432 sslmode=disable TimeZone=Asia/Tokyo"
	return gorm.Open(postgres.Open(dsn), &gorm.Config{})
}
