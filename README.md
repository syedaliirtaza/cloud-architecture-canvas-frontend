# Cloud Architecture Diagram Editor — Frontend

This repository contains the React frontend for the
[Cloud Architecture Diagram Editor](https://github.com/syedaliirtaza/cloud-architecture-canvas-frontend).
It is the browser application used to draw cloud architecture diagrams,
edit them with the diagram DSL, generate a first draft from a text prompt,
and collaborate in shared workspaces.

The companion Spring Boot backend provides authentication, workspace and
diagram persistence, REST endpoints, and real-time collaboration over
STOMP/WebSocket. This repository is only the frontend; the backend must be
running separately for authentication, workspaces, persistence, and
collaboration to work.

> **Project status:** This is an early working implementation for exploring
> the editor and collaboration features. It is not production-ready.

## What the frontend does

- Draws and edits diagrams on an interactive canvas.
- Provides a small diagram language for defining nodes, groups, and
  connections.
- Parses DSL text in the browser and renders the result on the canvas.
- Arranges generated diagrams with Dagre.
- Sends natural-language prompts to the AI generation endpoint used by the
  current implementation.
- Connects to workspace collaboration topics through STOMP and SockJS.
- Provides authentication, workspace, collaborator, and canvas screens.
- Includes an AWS-focused cloud-service icon set.

The canvas and DSL editor represent the same diagram in two editing styles:
the canvas is useful for positioning and quick changes, while the DSL is
useful for repeatable structural edits. AI generation also returns DSL text,
so generated diagrams remain editable.

## Technology

- React 19 and TypeScript
- Vite
- React Konva and Konva for canvas rendering
- Dagre for automatic layout
- Monaco Editor for the DSL editor
- Zustand and TanStack Query for client state and server state
- Axios for REST requests
- STOMP.js and SockJS for real-time collaboration
- Tailwind CSS and Radix UI components

## Requirements

- Node.js 20 or newer
- npm
- A modern browser
- The companion backend running locally or at a deployed URL

## Run locally

### 1. Start the backend

Start the companion Spring Boot backend and its PostgreSQL database first.
The backend README contains the database, Java, Maven, and Docker Compose
setup instructions.

The default frontend configuration expects the backend at
`http://localhost:8080`.

### 2. Install frontend dependencies

From this repository:

```bash
npm install
```

### 3. Configure the frontend

Create a local environment file from the example:

```powershell
Copy-Item .env.example .env
```

On macOS or Linux:

```bash
cp .env.example .env
```

The default values are:

```dotenv
VITE_API_BASE_URL=http://localhost:8080
VITE_WS_BASE_URL=http://localhost:8080
```

Change both URLs when the backend is hosted elsewhere. The WebSocket base
URL should point to the same backend host; the frontend adds `/ws` for the
SockJS endpoint.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite, register or sign in, create a workspace,
and open it to start editing.

## Available scripts

- `npm run dev` — start the Vite development server
- `npm run build` — type-check and create a production build
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build locally

## Configuration and security

Environment files are ignored by Git. Never commit API keys, access tokens,
passwords, private keys, database credentials, or other secrets.

Vite exposes every `VITE_*` variable to browser users. In particular, do not
put a production OpenAI API key in `VITE_OPENAI_API_KEY`. The current AI
integration is suitable only for development and should be moved behind a
server-side proxy with authentication, validation, rate limiting, and usage
controls before production deployment.

## Known limitations

- AI output can contain incorrect services, connections, or architectural
  choices and must be reviewed.
- The DSL and icon vocabulary are intentionally limited to what the parser
  recognises.
- Invalid DSL lines may be skipped so the rest of a diagram can still render.
- Concurrent edits use a simple last-write-wins approach; simultaneous edits
  to the same element can overwrite one another.
- Automatic layout may need manual refinement for complex diagrams.
- Backend availability and configuration are required for account and
  collaboration features.
