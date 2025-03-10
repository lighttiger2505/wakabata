// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.

package model

import (
	"time"
)

const TableNameUser = "users"

// User mapped from table <users>
type User struct {
	ID              string     `gorm:"column:id;primaryKey" json:"id"`
	Email           string     `gorm:"column:email;not null" json:"email"`
	PasswordHash    *string    `gorm:"column:password_hash" json:"password_hash"`
	TotpSecret      *string    `gorm:"column:totp_secret" json:"totp_secret"`
	IsEmailVerified *bool      `gorm:"column:is_email_verified" json:"is_email_verified"`
	CreatedAt       *time.Time `gorm:"column:created_at;default:now()" json:"created_at"`
	UpdatedAt       *time.Time `gorm:"column:updated_at;default:now()" json:"updated_at"`
}

// TableName User's table name
func (*User) TableName() string {
	return TableNameUser
}
