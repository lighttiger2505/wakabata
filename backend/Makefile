SERVER_MAIN_FILE="./cmd/server/main.go"
SERVER_BIN_FILE="./bin/server"

.PHONY: up
up:
	# docker-compose up -d
	docker compose -f docker-compose.dev.yml up -d

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
	go build -o $(SERVER_BIN_FILE) $(SERVER_MAIN_FILE)

.PHONY: server
server:
	go run $(SERVER_MAIN_FILE)

.PHONY: watch
watch:
	air --build.cmd "go build -o $(SERVER_BIN_FILE) $(SERVER_MAIN_FILE)" --build.bin $(SERVER_BIN_FILE)


.PHONY: gormgen
gormgen:
	go run ./cmd/gen/main.go

.PHONY: lint
lint:
	golangci-lint run

.PHONY: openapi
openapi:
	go run $(SERVER_MAIN_FILE) --generate-open-api
