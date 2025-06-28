# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WakabaTa is a TODO application with a Go backend (using Fuego framework) and Next.js frontend. The application features user authentication (including Google OAuth), project and task management, with a PostgreSQL database.

## Architecture

**Backend (Go):**
- Framework: Fuego (web framework)
- Database: PostgreSQL with GORM ORM
- Code generation: GORM Gen for database models and queries
- Authentication: JWT tokens with Google OAuth integration
- Architecture: Clean architecture with layers:
  - `cmd/server/` - Application entry point
  - `internal/app/` - HTTP handlers
  - `internal/domain/service/` - Business logic
  - `internal/domain/entity/` - Domain entities
  - `internal/domain/model/` - Generated database models
  - `internal/infra/` - Infrastructure layer (database repositories)

**Frontend (Next.js):**
- Framework: Next.js 15 with TypeScript
- UI: TailwindCSS with Radix UI components
- State management: Zustand for auth state
- Data fetching: SWR with auto-generated API client (Orval)
- Forms: React Hook Form with Zod validation
- Code quality: Biome for linting/formatting

## Development Commands

### Backend
- `make up` - Start PostgreSQL database in Docker
- `make server` - Run Go server locally
- `make watch` - Run server with hot reload (requires Air)
- `make build` - Build server binary
- `make gormgen` - Generate database models and queries
- `make openapi` - Generate OpenAPI specification
- `make flyway-migrate` - Run database migrations
- `make lint` - Run golangci-lint

### Frontend
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm lint` - Run Biome linting
- `pnpm format` - Run Biome formatting
- `pnpm check` - Run Biome checks (lint + format)
- `pnpm type-check` - Run TypeScript type checking
- Add `:fix` suffix to auto-fix issues (e.g., `pnpm lint:fix`)

### API Client Generation
Generate frontend API client from OpenAPI spec:
1. `cd backend && make openapi` - Generate OpenAPI spec
2. `cd frontend && pnpm orval` - Generate API client and Zod schemas

## Key Configuration

- **Database migrations:** Located in `backend/flyway/sql/`
- **Code generation:** 
  - Backend: `backend/cmd/gen/main.go` generates GORM models
  - Frontend: `frontend/orval.config.ts` generates API client from OpenAPI
- **Git hooks:** Lefthook runs Biome checks and golangci-lint on pre-commit/pre-push
- **Environment variables:** Backend requires `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URL`

## Testing and Quality

- Frontend uses Biome (configured in `biome.json`) for linting and formatting
- Backend uses golangci-lint for Go code quality
- Git hooks automatically run quality checks before commits
- Type checking enforced with TypeScript and `pnpm type-check`

## Development Workflow

1. Use `make up` to start the database
2. Run `make gormgen` after database schema changes
3. Use `make openapi` and `pnpm orval` after API changes
4. Run `make server` (backend) and `pnpm dev` (frontend) for development
5. All code must pass linting and type checking before commits