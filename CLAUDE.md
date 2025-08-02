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

### Backend (run from `/backend`)
- `make up` - Start PostgreSQL database in Docker
- `make server` - Run Go server locally
- `make watch` - Run server with hot reload (requires Air)
- `make build` - Build server binary
- `make gormgen` - Generate database models and queries
- `make openapi` - Generate OpenAPI specification
- `make flyway-migrate` - Run database migrations
- `make lint` - Run golangci-lint

### Frontend (run from `/frontend`)
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm lint` - Run Biome linting (requires file paths)
- `pnpm format` - Run Biome formatting
- `pnpm check` - Run Biome checks (lint + format)
- `pnpm type-check` - Run TypeScript type checking
- Add `:fix` suffix to auto-fix issues (e.g., `pnpm lint:fix`)

### API Client Generation
After backend API changes, regenerate frontend client:
1. `cd backend && make openapi` - Generate OpenAPI spec
2. `cd frontend && pnpm orval` - Generate API client and Zod schemas from OpenAPI

## Project Structure

This is a monorepo with separate `/backend` (Go) and `/frontend` (Next.js) directories. Most development commands must be run from the appropriate subdirectory.

## Key Configuration

- **Database migrations:** Located in `backend/flyway/sql/`
- **Code generation:** 
  - Backend: `backend/cmd/gen/main.go` generates GORM models and queries
  - Frontend: `frontend/orval.config.ts` generates API client and Zod schemas from OpenAPI
- **Tool management:** Both directories use `mise.toml` for development tools
- **Git hooks:** Lefthook configuration in root runs quality checks on pre-commit/pre-push
- **Environment variables:** Backend requires `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URL`

## Code Quality

- Frontend uses Biome (configured in `biome.json`) for linting and formatting
- Backend uses golangci-lint for Go code quality  
- Git hooks automatically run quality checks before commits
- Type checking enforced with TypeScript and `pnpm type-check`
- No automated test suite currently configured

## Development Workflow

1. `cd backend && make up` - Start the database
2. `cd backend && make gormgen` - After database schema changes
3. `cd backend && make openapi && cd ../frontend && pnpm orval` - After API changes
4. `cd backend && make server` + `cd frontend && pnpm dev` - Start both servers for development
5. All code must pass linting and type checking before commits