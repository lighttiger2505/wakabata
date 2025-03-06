package app

import (
	"time"

	"github.com/go-fuego/fuego"
	"github.com/go-fuego/fuego/option"
	"github.com/google/uuid"
	"github.com/lighttiger2505/wakabata/internal/domain/entity"
	"github.com/lighttiger2505/wakabata/internal/domain/model"
	"github.com/lighttiger2505/wakabata/internal/domain/service"
)

type TaskHandler struct {
	Service *service.TaskService
}

func NewTaskHandler(s *service.TaskService) *TaskHandler {
	return &TaskHandler{s}
}

func (h *TaskHandler) SetHandler(server *fuego.Server) {
	tagName := "task"
	fuego.Get(server, "/tasks", h.SearchTasks, option.Tags(tagName))
	fuego.Post(server, "/tasks", h.CreateTask, option.Tags(tagName), option.DefaultStatusCode(201), fuego.OptionRequestContentType("application/json"))
	fuego.Get(server, "/tasks/{id}", h.GetTask, option.Tags(tagName))
	fuego.Put(server, "/tasks/{id}", h.UpdateTask, option.Tags(tagName), fuego.OptionRequestContentType("application/json"))
	fuego.Delete(server, "/tasks/{id}", h.DeleteTask, option.Tags(tagName), fuego.OptionRequestContentType("application/json"))
}

type TaskToCreate struct {
	ProjectID   *string    `json:"project_id"`
	Name        string     `json:"name" validate:"required"`
	Description *string    `json:"description"`
	DueDate     *time.Time `json:"due_date"`
	Priority    *int32     `json:"priority"`
}

func (h *TaskHandler) CreateTask(c fuego.ContextWithBody[*TaskToCreate]) (*model.Task, error) {
	input, err := c.Body()
	if err != nil {
		return nil, err
	}

	task := &model.Task{
		ProjectID:   input.ProjectID,
		Name:        input.Name,
		Description: input.Description,
		DueDate:     input.DueDate,
		Priority:    input.Priority,
	}

	return h.Service.Create(c.Context(), task)
}

type TaskToUpdate struct {
	TaskToCreate
	Status *bool `json:"status"`
}

func (h *TaskHandler) UpdateTask(c fuego.ContextWithBody[*TaskToUpdate]) (*model.Task, error) {
	ctx := c.Context()

	uUID, err := h.parseUUID(c.PathParam("id"))
	if err != nil {
		return nil, err
	}

	input, err := c.Body()
	if err != nil {
		return nil, err
	}

	task := &model.Task{
		ID:          uUID.String(),
		ProjectID:   input.ProjectID,
		Name:        input.Name,
		Description: input.Description,
		DueDate:     input.DueDate,
		Priority:    input.Priority,
		Status:      input.Status,
	}

	return h.Service.Update(ctx, task)
}

func (h *TaskHandler) DeleteTask(c fuego.ContextNoBody) (interface{}, error) {
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

func (h *TaskHandler) SearchTasks(c fuego.ContextNoBody) ([]*entity.Task, error) {
	return h.Service.Search(c.Context())
}

func (h *TaskHandler) GetTask(c fuego.ContextNoBody) (*model.Task, error) {
	uUID, err := h.parseUUID(c.PathParam("id"))
	if err != nil {
		return nil, err
	}
	return h.Service.Get(c.Context(), uUID.String())
}

func (h *TaskHandler) parseUUID(id string) (*uuid.UUID, error) {
	uUID, err := uuid.Parse(id)
	if err != nil {
		return nil, fuego.BadRequestError{
			Title:  "Invalid ID",
			Detail: "The provided ID is not a valid uuid.",
		}
	}
	return &uUID, nil
}
