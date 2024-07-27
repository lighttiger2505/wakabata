package main

import (
	"log"

	"github.com/lighttiger2505/WakabaTasks/backend/internal/infra/persistence/postgres"
	"gorm.io/gen"
)

// Dynamic SQL
type Querier interface {
	// SELECT * FROM @@table WHERE name = @name{{if role !=""}} AND role = @role{{end}}
	FilterWithNameAndRole(name, role string) ([]gen.T, error)
}

func main() {
	g := gen.NewGenerator(gen.Config{
		OutPath:      "./internal/infra/persistence/query",
		ModelPkgPath: "./internal/domain/model",
		Mode:         gen.WithoutContext | gen.WithDefaultQuery | gen.WithQueryInterface, // generate mode
	})

	gormdb, err := postgres.OpenGormDB()
	if err != nil {
		log.Fatal(err)
	}

	// gormdb, _ := gorm.Open(mysql.Open("root:@(127.0.0.1:3306)/demo?charset=utf8mb4&parseTime=True&loc=Local"))
	g.UseDB(gormdb) // reuse your gorm db

	models := []interface{}{
		g.GenerateModel("users"),
		g.GenerateModel("projects"),
		g.GenerateModel("tasks"),
		g.GenerateModel("task_comments"),
		g.GenerateModel("tags"),
		g.GenerateModel("task_tags"),
	}

	// Generate basic type-safe DAO API for struct `model.User` following conventions
	g.ApplyBasic(
		models...,
	)

	// Generate Type Safe API with Dynamic SQL defined on Querier interface for `model.User` and `model.Company`
	g.ApplyInterface(
		func(Querier) {},
		models...,
	)

	// Generate the code
	g.Execute()
}
