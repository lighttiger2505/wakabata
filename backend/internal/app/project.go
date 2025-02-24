package app

import (
	"github.com/go-fuego/fuego"
	"github.com/go-fuego/fuego/option"
	"github.com/google/uuid"
	"github.com/lighttiger2505/wakabata/internal/domain/model"
	"github.com/lighttiger2505/wakabata/internal/domain/service"
)

type ProjectHandler struct {
	Service *service.ProjectService
}

func NewProjectHandler(s *service.ProjectService) *ProjectHandler {
	return &ProjectHandler{s}
}

func (h *ProjectHandler) SetHandler(server *fuego.Server) {
	tagName := "project"
	fuego.Get(server, "/projects", h.SearchProjects, option.Tags(tagName))
	fuego.Post(server, "/projects", h.CreateProject, option.Tags(tagName), option.DefaultStatusCode(201), fuego.OptionRequestContentType("application/json"))
	fuego.Get(server, "/projects/{id}", h.GetProject, option.Tags(tagName))
	fuego.Put(server, "/projects/{id}", h.UpdateProject, option.Tags(tagName), fuego.OptionRequestContentType("application/json"))
	fuego.Delete(server, "/projects/{id}", h.DeleteProject, option.Tags(tagName), fuego.OptionRequestContentType("application/json"))
}

type ProjectToCreate struct {
	Name        string  `json:"name"`
	UserID      *string `json:"user_id"`
	Description *string `json:"description"`
}

func (h *ProjectHandler) CreateProject(c fuego.ContextWithBody[*ProjectToCreate]) (*model.Project, error) {
	input, err := c.Body()
	if err != nil {
		return nil, err
	}

	project := &model.Project{
		UserID:      input.UserID,
		Name:        input.Name,
		Description: input.Description,
	}

	return h.Service.Create(c.Context(), project)
}

type ProjectToUpdate struct {
	ProjectToCreate
}

func (h *ProjectHandler) UpdateProject(c fuego.ContextWithBody[*ProjectToUpdate]) (*model.Project, error) {
	ctx := c.Context()

	uUID, err := h.parseUUID(c.PathParam("id"))
	if err != nil {
		return nil, err
	}

	input, err := c.Body()
	if err != nil {
		return nil, err
	}

	task := &model.Project{
		ID:          uUID.String(),
		UserID:      input.UserID,
		Name:        input.Name,
		Description: input.Description,
	}

	return h.Service.Update(ctx, task)
}

func (h *ProjectHandler) DeleteProject(c fuego.ContextNoBody) (interface{}, error) {
	ctx := c.Context()

	uUID, err := h.parseUUID(c.PathParam("id"))
	if err != nil {
		return nil, err
	}
	if err := h.Service.Delete(ctx, uUID.String()); err != nil {
		return nil, err
	}
	return nil, nil
}

func (h *ProjectHandler) SearchProjects(c fuego.ContextNoBody) ([]*model.Project, error) {
	return h.Service.Search(c.Context())
}

func (h *ProjectHandler) GetProject(c fuego.ContextNoBody) (*model.Project, error) {
	uUID, err := h.parseUUID(c.PathParam("id"))
	if err != nil {
		return nil, err
	}
	return h.Service.Get(c.Context(), uUID.String())
}

func (h *ProjectHandler) parseUUID(id string) (*uuid.UUID, error) {
	uUID, err := uuid.Parse(id)
	if err != nil {
		return nil, fuego.BadRequestError{
			Title:  "Invalid ID",
			Detail: "The provided ID is not a valid uuid.",
		}
	}
	return &uUID, nil
}
