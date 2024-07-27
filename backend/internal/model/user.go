package model

import "gorm.io/gorm"

type User struct {
	gorm.Model
	ID           string
	Username     string
	Email        string
	PasswordHash string
}
