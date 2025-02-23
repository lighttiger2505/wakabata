// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.

package model

import (
	"time"
)

const TableNameTag = "tags"

// Tag mapped from table <tags>
type Tag struct {
	ID        string     `gorm:"column:id;primaryKey" json:"id"`
	Name      string     `gorm:"column:name;not null" json:"name"`
	CreatedAt *time.Time `gorm:"column:created_at;default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt *time.Time `gorm:"column:updated_at;default:CURRENT_TIMESTAMP" json:"updated_at"`
}

// TableName Tag's table name
func (*Tag) TableName() string {
	return TableNameTag
}
