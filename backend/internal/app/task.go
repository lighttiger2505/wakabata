package app

import (
	"strconv"
	"time"

	"github.com/go-fuego/fuego"
	"github.com/go-fuego/fuego/option"
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
	fuego.Post(server, "/tasks", h.CreateTask, option.Tags(tagName), option.DefaultStatusCode(201))
	fuego.Get(server, "/tasks/{id}", h.GetTask, option.Tags(tagName))
	fuego.Put(server, "/tasks/{id}", h.UpdateTask, option.Tags(tagName))
}

type TaskToCreate struct {
	ProjectID   string    `json:"project_id"`
	Name        string    `json:"name" validate:"required"`
	Description string    `json:"description"`
	DueDate     time.Time `json:"due_date"`
	Priority    int32     `json:"priority"`
	Status      string    `json:"status"`
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

func (h *TaskHandler) UpdateTask(c fuego.ContextWithBody[*model.Task]) (*model.Task, error) {
	ctx := c.Context()

	id, err := strconv.Atoi(c.PathParam("id"))
	if err != nil {
		return nil, fuego.BadRequestError{
			Title:  "Invalid ID",
			Detail: "The provided ID is not a valid integer.",
			Err:    err,
		}
	}

	input, err := c.Body()
	if err != nil {
		return nil, err
	}

	return h.Service.Update(ctx, id, input)
}

func (h *TaskHandler) SearchTasks(c fuego.ContextNoBody) ([]*model.Task, error) {
	return h.Service.Search(c.Context())
}

func (h *TaskHandler) GetTask(c fuego.ContextNoBody) (*model.Task, error) {
	id, err := strconv.Atoi(c.PathParam("id"))
	if err != nil {
		return nil, fuego.BadRequestError{
			Title:  "Invalid ID",
			Detail: "The provided ID is not a valid integer.",
			Err:    err,
		}
	}
	return h.Service.Get(c.Context(), id)
}
