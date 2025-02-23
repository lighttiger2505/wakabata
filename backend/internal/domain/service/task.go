package service

import (
	"context"
	"errors"

	"github.com/go-fuego/fuego"
	"github.com/lighttiger2505/wakabata/internal/domain/model"
	"github.com/lighttiger2505/wakabata/internal/infra"
	"gorm.io/gorm"
)

type TaskService struct {
	TaskInfra *infra.TaskInfra
}

func NewTaskService(userInfra *infra.TaskInfra) *TaskService {
	return &TaskService{
		TaskInfra: userInfra,
	}
}

func (s *TaskService) Create(ctx context.Context, user *model.Task) (*model.Task, error) {
	createdTask, err := s.TaskInfra.Create(ctx, user)
	if err != nil {
		return nil, err
	}
	return createdTask, nil
}

func (s *TaskService) Update(ctx context.Context, task *model.Task) (*model.Task, error) {
	if _, err := s.Get(ctx, task.ID); err != nil {
		return nil, err
	}

	updatedTask, err := s.TaskInfra.Update(ctx, task)
	if err != nil {
		return nil, err
	}
	return updatedTask, nil
}

func (s *TaskService) Delete(ctx context.Context, id string) error {
	existingTask, err := s.Get(ctx, id)
	if err != nil {
		return err
	}
	if err := s.TaskInfra.Delete(ctx, existingTask); err != nil {
		return err
	}
	return nil
}

func (s *TaskService) Search(ctx context.Context) ([]*model.Task, error) {
	users, err := s.TaskInfra.Search(ctx)
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (s *TaskService) Get(ctx context.Context, id string) (*model.Task, error) {
	user, err := s.TaskInfra.Get(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fuego.NotFoundError{
				Title:  "Not found task",
				Detail: "No task matching the provided ID was found.",
				Err:    err,
			}
		}
		return nil, err
	}
	return user, nil
}
