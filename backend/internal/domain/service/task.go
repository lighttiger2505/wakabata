package service

import (
	"context"

	"github.com/lighttiger2505/wakabata/internal/domain/model"
	"github.com/lighttiger2505/wakabata/internal/infra"
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

func (s *TaskService) Update(ctx context.Context, id int, task *model.Task) (*model.Task, error) {
	existingTask, err := s.Get(ctx, id)
	if err != nil {
		return nil, err
	}

	existingTask.ProjectID = task.ProjectID
	existingTask.Name = task.Name
	existingTask.Description = task.Description
	existingTask.DueDate = task.DueDate
	existingTask.Priority = task.Priority
	existingTask.Status = task.Status

	updatedTask, err := s.TaskInfra.Update(ctx, task)
	if err != nil {
		return nil, err
	}
	return updatedTask, nil
}

func (s *TaskService) Search(ctx context.Context) ([]*model.Task, error) {
	users, err := s.TaskInfra.Search(ctx)
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (s *TaskService) Get(ctx context.Context, id int) (*model.Task, error) {
	user, err := s.TaskInfra.Get(ctx, id)
	if err != nil {
		return nil, err
	}
	return user, nil
}
