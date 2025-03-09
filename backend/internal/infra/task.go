package infra

import (
	"context"

	"github.com/google/uuid"
	"github.com/lighttiger2505/wakabata/internal/domain/entity"
	"github.com/lighttiger2505/wakabata/internal/domain/model"
	"github.com/lighttiger2505/wakabata/internal/infra/persistence/query"
	"gorm.io/gorm"
)

type TaskInfra struct {
	db *gorm.DB
}

func NewTaskInfra(db *gorm.DB) *TaskInfra {
	return &TaskInfra{db: db}
}

func (i *TaskInfra) Create(ctx context.Context, task *model.Task) (*model.Task, error) {
	uUID, err := uuid.NewV7()
	if err != nil {
		return nil, err
	}
	task.ID = uUID.String()

	db := query.Task.WithContext(ctx)
	if err := db.Create(task); err != nil {
		return nil, err
	}
	return task, nil
}

func (i *TaskInfra) Update(ctx context.Context, task *model.Task) (*model.Task, error) {
	u := query.Task
	db := query.Task.WithContext(ctx)
	if _, err := db.Where(u.ID.Eq(task.ID)).Updates(task); err != nil {
		return nil, err
	}
	return task, nil
}

func (i *TaskInfra) Delete(ctx context.Context, task *model.Task) error {
	db := query.Task.WithContext(ctx)
	if _, err := db.Delete(task); err != nil {
		return err
	}
	return nil
}

func (i *TaskInfra) Search(ctx context.Context) ([]*entity.Task, error) {
	results := []*entity.Task{}
	q := i.db.
		Table("tasks").
		Select(`
			tasks.id as id
			,tasks.name as name
			,tasks.description as description
			,tasks.due_date as due_date
			,tasks.priority as priority
			,tasks.status as status
			,tasks.created_at as created_at
			,tasks.updated_at as updated_at
			,projects.id as project_id
			,projects.name as project_name
			`).
		Joins("left join projects on projects.id = tasks.project_id").
		Order("tasks.created_at desc").
		Find(&results)
	if q.Error != nil {
		return nil, q.Error
	}
	return results, nil
}

func (i *TaskInfra) Get(ctx context.Context, id string) (*model.Task, error) {
	u := query.Task
	db := query.Task.WithContext(ctx)
	return db.Where(u.ID.Eq(id)).First()
}
