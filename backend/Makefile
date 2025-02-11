.PHONY: up
up:
	docker-compose up -d

.PHONY: down
down:
	docker-compose down

.PHONY: restart
restart: down up

.PHONY: logs
logs:
	docker-compose logs -f

.PHONY: flyway-migrate
flyway-migrate:
	docker-compose run --rm flyway -url=jdbc:postgresql://db:5432/wakabatasks -user=exampleuser -password=examplepass migrate

.PHONY: flyway-clean
flyway-clean:
	docker-compose run --rm flyway -url=jdbc:postgresql://db:5432/wakabatasks -user=exampleuser -password=examplepass -cleanDisabled=false clean

.PHONY: flyway-validate
flyway-validate:
	docker-compose run --rm flyway -url=jdbc:postgresql://db:5432/wakabatasks -user=exampleuser -password=examplepass validate

.PHONY: flyway-repair
flyway-repair:
	docker-compose run --rm flyway -url=jdbc:postgresql://db:5432/exampledb -user=exampleuser -password=examplepass repair

.PHONY: build
build:
	go build ./cmd/server/main.go

.PHONY: server
server:
	go run ./cmd/server/main.go

.PHONY: gormgen
gormgen:
	go run ./cmd/gen/main.go

.PHONY: lint
lint:
	golangci-lint run

.PHONY: buf-lint
buf-lint:
	buf lint ./wakabata

.PHONY: buf-generate
buf-generate:
	buf generate ./wakabata
