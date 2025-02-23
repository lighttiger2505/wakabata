package infra

import (
	"context"

	"github.com/google/uuid"
	"github.com/lighttiger2505/wakabata/internal/domain/model"
	"github.com/lighttiger2505/wakabata/internal/infra/persistence/query"
)

type ProjectInfra struct {
}

func NewProjectInfra() *ProjectInfra {
	return &ProjectInfra{}
}

func (i *ProjectInfra) Create(ctx context.Context, task *model.Project) (*model.Project, error) {
	uUID, err := uuid.NewV7()
	if err != nil {
		return nil, err
	}
	task.ID = uUID.String()

	db := query.Project.WithContext(ctx)
	if err := db.Create(task); err != nil {
		return nil, err
	}
	return task, nil
}

func (i *ProjectInfra) Update(ctx context.Context, task *model.Project) (*model.Project, error) {
	u := query.Project
	db := query.Project.WithContext(ctx)
	if _, err := db.Where(u.ID.Eq(task.ID)).Updates(task); err != nil {
		return nil, err
	}
	return task, nil
}

func (i *ProjectInfra) Delete(ctx context.Context, task *model.Project) error {
	db := query.Project.WithContext(ctx)
	if _, err := db.Delete(task); err != nil {
		return err
	}
	return nil
}

func (i *ProjectInfra) Search(ctx context.Context) ([]*model.Project, error) {
	u := query.Project
	db := query.Project.WithContext(ctx).Order(u.CreatedAt.Desc())
	return db.Find()
}

func (i *ProjectInfra) Get(ctx context.Context, id string) (*model.Project, error) {
	u := query.Project
	db := query.Project.WithContext(ctx)
	return db.Where(u.ID.Eq(id)).First()
}
