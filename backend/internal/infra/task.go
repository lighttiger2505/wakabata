package infra

import (
	"context"
	"strconv"

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
	if err := query.Task.WithContext(ctx).Create(task); err != nil {
		return nil, err
	}
	return task, nil
}

func (i *TaskInfra) Update(ctx context.Context, user *model.Task) (*model.Task, error) {
	if err := query.Task.WithContext(ctx).Create(user); err != nil {
		return nil, err
	}
	return user, nil
}

func (i *TaskInfra) Search(ctx context.Context) ([]*model.Task, error) {
	db := query.Task.WithContext(ctx)
	return db.Find()
}

func (i *TaskInfra) Get(ctx context.Context, id int) (*model.Task, error) {
	u := query.Task
	db := query.Task.WithContext(ctx)
	return db.Where(u.ID.Eq(strconv.Itoa(id))).First()
}
