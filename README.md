# Cloud Architecture Canvas

Collaborative React frontend for designing cloud architecture diagrams with
AWS service icons, a diagram DSL editor, workspace sharing, and real-time
collaboration.

## Requirements

- Node.js 20 or newer
- The companion backend running locally or at a deployed URL

## Setup

```bash
npm install
Copy-Item .env.example .env
npm run dev
```

On macOS/Linux, use `cp .env.example .env` instead of `Copy-Item`.

The default development configuration expects the backend at
`http://localhost:8080`. Set these variables in `.env` when the backend is
hosted elsewhere:

```dotenv
VITE_API_BASE_URL=https://your-backend.example.com
VITE_WS_BASE_URL=https://your-backend.example.com
```

## Available scripts

- `npm run dev` - start the Vite development server
- `npm run build` - type-check and create a production build
- `npm run lint` - run ESLint
- `npm run preview` - preview the production build locally

## Security

`.env` files are ignored by Git. Never commit API keys, access tokens,
passwords, private keys, or production credentials.

Vite exposes every `VITE_*` variable to browser users, so
`VITE_OPENAI_API_KEY` must not contain a production secret. Use a server-side
AI proxy for production deployments.
