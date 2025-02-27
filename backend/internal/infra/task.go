package infra

import (
	"context"

	"github.com/google/uuid"
	"github.com/lighttiger2505/wakabata/internal/domain/model"
	"github.com/lighttiger2505/wakabata/internal/infra/persistence/query"
)

type TaskInfra struct {
}

func NewTaskInfra() *TaskInfra {
	return &TaskInfra{}
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

func (i *TaskInfra) Search(ctx context.Context) ([]*model.Task, error) {
	u := query.Task
	db := query.Task.WithContext(ctx).Order(u.CreatedAt.Desc())
	return db.Find()
}

func (i *TaskInfra) Get(ctx context.Context, id string) (*model.Task, error) {
	u := query.Task
	db := query.Task.WithContext(ctx)
	return db.Where(u.ID.Eq(id)).First()
}
