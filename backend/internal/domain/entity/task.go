package entity

import "time"

// Task mapped from table <tasks>
type Task struct {
	ID          string     `gorm:"column:id;primaryKey" json:"id"`
	Name        string     `gorm:"column:name;not null" json:"name"`
	Description *string    `gorm:"column:description" json:"description"`
	DueDate     *time.Time `gorm:"column:due_date" json:"due_date"`
	Priority    *int32     `gorm:"column:priority" json:"priority"`
	Status      *bool      `gorm:"column:status" json:"status"`
	CreatedAt   *time.Time `gorm:"column:created_at;default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt   *time.Time `gorm:"column:updated_at;default:CURRENT_TIMESTAMP" json:"updated_at"`

	ProjectID   *string `gorm:"column:project_id" json:"project_id"`
	ProjectName *string `gorm:"column:project_name" json:"project_name"`
}
