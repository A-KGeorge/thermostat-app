# 🌡️ Smart Thermostat App

A modern, full-stack thermostat application built with .NET 9.0 and React 19, featuring real-time temperature tracking, infinite scroll, and beautiful UI with micro-interactions.

## 📋 Table of Contents

- [Screenshots](#-screenshots).
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [Quick Start with Docker](#quick-start-with-docker)
  - [Local Development Setup](#local-development-setup)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Architecture](#-architecture)

## 📷 Screenshots

<img width="1919" height="993" alt="image" src="https://github.com/user-attachments/assets/24c0f394-65b6-490a-a467-eb7b667e20ca" />

<img width="1917" height="991" alt="image" src="https://github.com/user-attachments/assets/85a4144b-e078-4179-95c5-f4cb078d22fe" />

<img width="1918" height="990" alt="image" src="https://github.com/user-attachments/assets/c07a5558-b28c-480b-a4d4-bbc19e0cdd16" />

## ✨ Features

### Core Functionality

- [x] **Temperature Recording** - Add readings via circular knob or text input
- [x] **Real-time Stats** - Current, Average, Maximum, and Minimum temperature tracking
- [x] **Infinite Scroll** - Lazy-loaded, paginated temperature history
- [x] **Smart Caching** - React Query with 30-second stale time for optimal performance
- [x] **UTC to Local** - Automatic timezone conversion for accurate timestamps

### UI/UX Highlights

- 🎨 **Modern Design** - Purple gradient theme with Tailwind CSS
- 🎛️ **Dual Input Modes** - Interactive circular knob with drag OR text input
- ✨ **Micro-interactions** - Hover effects, animations, and status pulse
- 📱 **Responsive** - Mobile-first design that works on all devices
- 🌓 **Vignette Effect** - Subtle background gradient for depth

### Technical Excellence

- 🔒 **Type-safe** - Full TypeScript coverage
- 🚀 **Performance** - Connection pooling, request deduplication, optimistic updates
- 🧪 **Tested** - Unit tests (xUnit) + E2E tests (Cypress)
- 🐳 **Containerized** - Docker & Docker Compose ready
- 🔄 **CI/CD** - GitHub Actions pipeline with automated testing

## 🛠️ Tech Stack

### Backend

- **Runtime:** .NET 9.0
- **Framework:** ASP.NET Core Web API
- **Database:** SQLite with Entity Framework Core 9.0
- **API Versioning:** v1 with Swagger/OpenAPI
- **Testing:** xUnit, FluentAssertions, Microsoft.AspNetCore.Mvc.Testing

### Frontend

- **Framework:** React 19.1.1
- **Language:** TypeScript 5.9.3
- **Build Tool:** Vite 7.1.7
- **Styling:** Tailwind CSS 3.4.18
- **State Management:** TanStack React Query 5.90.5
- **Testing:** Cypress 15.5.0
- **E2E:** Cypress Testing Library

### DevOps

- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions
- **Web Server:** Nginx (production)

## 📦 Prerequisites

### For Docker (Recommended)

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) 20.10+
- [Docker Compose](https://docs.docker.com/compose/install/) 2.0+

### For Local Development

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js](https://nodejs.org/) 20.x or higher
- [npm](https://www.npmjs.com/) 10.x or higher
- [Git](https://git-scm.com/)

## 🚀 Getting Started

### Quick Start with Docker

The fastest way to run the entire application:

```bash

# Clone the repository

git clone https://github.com/A-KGeorge/thermostat-app.git
cd thermostat-app

# Start both backend and frontend

docker-compose up -d

# View logs

docker-compose logs -f

# Stop services

docker-compose down
```

**Access the app:**

- Frontend: http://localhost:5173
- Backend API: http://localhost:5127
- Swagger UI: http://localhost:5127/swagger

### Local Development Setup

#### 1. Clone and Navigate

```bash
git clone https://github.com/yourusername/thermostat-app.git
cd thermostat-app
```

#### 2. Backend Setup

```bash

# Navigate to API project

cd ThermostatApi

# Restore dependencies

dotnet restore

# Apply database migrations

dotnet ef database update

# Run the API (listens on http://localhost:5127)

dotnet run
```

The API will be available at:

- HTTP: http://localhost:5127
- Swagger: http://localhost:5127/swagger

#### 3. Frontend Setup

Open a new terminal:

```bash

# Navigate to client project

cd client

# Install dependencies

npm install

# Start development server (http://localhost:5173)

npm run dev
```

The React app will open automatically at http://localhost:5173

#### 4. Verify Setup

1. Open http://localhost:5173 in your browser
2. Try adding a temperature reading
3. Check that stats update in real-time
4. Test infinite scroll by adding 20+ readings

## 📁 Project Structure

```
ThermostatApp/
├── .github/
│ └── workflows/
│ └── ci.yml # GitHub Actions CI/CD pipeline
├── ThermostatApi/ # .NET Backend
│ ├── Controllers/
│ │ └── ReadingsController.cs
│ ├── Data/
│ │ └── AppDbContext.cs
│ ├── Models/
│ │ ├── Reading.cs
│ │ └── PagedResult.cs
│ ├── Services/
│ │ └── ReadingService.cs
│ ├── Migrations/
│ ├── Program.cs
│ └── ThermostatApi.csproj
├── ThermostatApi.Tests/ # Backend Tests
│ ├── ReadingsControllerTests.cs
│ ├── ReadingServiceTests.cs
│ └── ThermostatApi.Tests.csproj
├── client/ # React Frontend
│ ├── src/
│ │ ├── components/
│ │ │ ├── Header.tsx
│ │ │ ├── StatCard.tsx
│ │ │ ├── TemperatureControl.tsx
│ │ │ └── ReadingsList.tsx
│ │ ├── lib/
│ │ │ ├── api.ts # API client
│ │ │ └── queries.ts # React Query hooks
│ │ ├── App.tsx
│ │ └── main.tsx
│ ├── cypress/
│ │ ├── e2e/
│ │ │ ├── thermostat.cy.ts
│ │ │ └── infinite-scroll.cy.ts
│ │ └── support/
│ ├── Dockerfile
│ ├── nginx.conf
│ └── package.json
├── Dockerfile # Backend Docker image
├── docker-compose.yml # Multi-container orchestration
└── README.md
```

## 📚 API Documentation

### Base URL

```
http://localhost:5127/api/v1
```

### Endpoints

#### **GET** `/readings`

Get paginated temperature readings (newest first)

**Query Parameters:**

- `page` (int, default: 1) - Page number
- `pageSize` (int, default: 20) - Items per page

**Response:**

```json
{
  "items": [
    {
      "id": 1,
      "temperatureC": 22.5,
      "createdAtUtc": "2025-10-26T14:30:00Z",
      "location": "Living Room",
      "notes": "Test reading"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "totalCount": 100,
  "totalPages": 5
}
```

#### **POST** `/readings`

Create a new temperature reading

**Request Body:**

```json
{
  "temperatureC": 22.5,
  "location": "Living Room",
  "notes": "Optional notes"
}
```

**Validation:**

- `temperatureC`: Required, must be between -100°C and 100°C
- `location`: Optional string
- `notes`: Optional string

**Response:** Returns the created reading with auto-generated `id` and `createdAtUtc`

### Interactive Documentation

Visit http://localhost:5127/swagger for interactive Swagger UI

## 🧪 Testing

### Backend Tests (xUnit)

```bash

# Run all backend tests

cd ThermostatApi.Tests
dotnet test

# Run with detailed output

dotnet test --verbosity detailed

# Run with coverage

dotnet test /p:CollectCoverage=true
```

**Test Coverage:**

- [x] Controller integration tests (WebApplicationFactory)
- [x] Service layer unit tests (InMemory database)
- [x] Pagination logic
- [x] Temperature validation (-100 to 100°C)
- [x] Data ordering (newest first)

### Frontend Tests (Cypress)

```bash
cd client

# Open Cypress Test Runner (interactive)

npm run cypress:open

# Run tests headlessly (CI mode) - default

npm run cypress:run

# Run E2E tests with server start (headless)

npm run test:e2e
```

**Test Coverage:**

- [x] Component rendering
- [x] Adding readings (text & knob modes)
- [x] Infinite scroll pagination
- [x] Stats calculation
- [x] Loading states
- [x] Error handling
- [x] Mode switching
- [x] Temperature validation

### Run All Tests

```bash

# Backend

cd ThermostatApi.Tests && dotnet test

# Frontend

cd client && npm run test:e2e
```

## 🔄 CI/CD Pipeline

The project uses **GitHub Actions** for automated testing and deployment.

### Workflow Triggers

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

### Pipeline Stages

1. **Backend Tests** (.NET)

   - Restore dependencies
   - Build solution
   - Run xUnit tests

2. **Frontend Tests** (React + Cypress)

   - Install npm dependencies
   - Lint code
   - Build production bundle
   - Run E2E tests with Cypress
   - Upload screenshots/videos on failure

3. **Docker Build**

   - Build backend Docker image
   - Build frontend Docker image
   - Test docker-compose orchestration
   - Cache layers for faster builds

4. **Deploy** (main branch only)
   - Placeholder for production deployment
   - Can integrate with Azure, AWS, GCP, etc.

### View Pipeline Status

Check the **Actions** tab in your GitHub repository

## 🏗️ Architecture

### Backend Architecture

```
    ┌─────────────┐
    │    Client   │
    └──────┬──────┘
           │ HTTP/JSON
           ▼
┌─────────────────────┐
│    API Controller   │ ← Handles requests, validation
│    (ASP.NET Core)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    Service Layer    │ ← Business logic
│   (ReadingService)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      Data Layer     │ ← EF Core + SQLite
│    (AppDbContext)   │
└─────────────────────┘
```

### Frontend Architecture

```
┌─────────────────────┐
│     React App       │
│     (App.tsx)       │
└──────────┬──────────┘
           │
           ├─► Components (UI)
           │ ├─ Header
           │ ├─ StatCard
           │ ├─ TemperatureControl
           │ └─ ReadingsList
           │
           ├─► React Query (State)
           │ ├─ useInfiniteReadings
           │ ├─ useCreateReading
           │ └─ useAllReadings
           │
           └─► API Layer
           └─ api.ts (fetch wrapper)
```

### Key Design Patterns

- **Repository Pattern** - Service layer abstracts data access
- **Dependency Injection** - ASP.NET Core built-in DI
- **API Versioning** - `/api/v1/...` for backward compatibility
- **Optimistic Updates** - React Query mutations with cache invalidation
- **Infinite Scroll** - Intersection Observer + React Query pagination
- **Connection Pooling** - Browser-native via fetch API

### Development Guidelines

- Follow existing code style (ESLint for frontend, C# conventions for backend)
- Write tests for new features
- Update documentation as needed
- Ensure CI pipeline passes before submitting PR

## 🙏 Acknowledgments

- Icons: Emoji unicode characters
- UI Framework: [Tailwind CSS](https://tailwindcss.com)
- State Management: [TanStack Query](https://tanstack.com/query)
