package service

import (
	"context"
	"errors"

	"github.com/go-fuego/fuego"
	"github.com/lighttiger2505/wakabata/internal/domain/model"
	"github.com/lighttiger2505/wakabata/internal/infra"
	"gorm.io/gorm"
)

type ProjectService struct {
	ProjectInfra *infra.ProjectInfra
}

func NewProjectService(userInfra *infra.ProjectInfra) *ProjectService {
	return &ProjectService{
		ProjectInfra: userInfra,
	}
}

func (s *ProjectService) Create(ctx context.Context, user *model.Project) (*model.Project, error) {
	createdTask, err := s.ProjectInfra.Create(ctx, user)
	if err != nil {
		return nil, err
	}
	return createdTask, nil
}

func (s *ProjectService) Update(ctx context.Context, task *model.Project) (*model.Project, error) {
	if _, err := s.ProjectInfra.Get(ctx, task.ID); err != nil {
		return nil, err
	}

	updatedTask, err := s.ProjectInfra.Update(ctx, task)
	if err != nil {
		return nil, err
	}
	return updatedTask, nil
}

func (s *ProjectService) Delete(ctx context.Context, id string) error {
	existingTask, err := s.Get(ctx, id)
	if err != nil {
		return err
	}
	if err := s.ProjectInfra.Delete(ctx, existingTask); err != nil {
		return err
	}
	return nil
}

func (s *ProjectService) Search(ctx context.Context) ([]*model.Project, error) {
	users, err := s.ProjectInfra.Search(ctx)
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (s *ProjectService) Get(ctx context.Context, id string) (*model.Project, error) {
	user, err := s.ProjectInfra.Get(ctx, id)
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
