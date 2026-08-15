<div align="center">

# Weallth PWM — Personal Wealth Management Module

**An intelligent, AI-powered wealth management platform built for financial advisors and self-directed investors.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Google Gemini](https://img.shields.io/badge/Gemini-1.5_Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

</div>

---

## What is Weallth?

Weallth is a **Personal Wealth Management (PWM)** platform that helps individuals understand, plan, and grow their financial lives using AI-driven insights grounded in proven wealth management methodologies.

It combines:
- **Holistic financial profiling** (household, income, assets, liabilities, goals, insurance)
- **Wealth Health Score (WHS)** — a composite 0–100 score across 7 financial pillars
- **AI Wealth Advisor** — a RAG-powered chat assistant using Google Gemini
- **Goal-based planning** with Edelman's three-option shortfall solver
- **Portfolio analytics** (TWR, MWR, Sharpe, Beta, Alpha, drift detection)
- **Automated priority actions** (rule-based recommendation engine)

---

## Core Features

| Feature | Description |
|:---|:---|
| **Wealth Health Score** | Composite 0–100 score across 7 pillars: Emergency Fund, Debt, Savings, Insurance, Goals, Retirement, Investment |
| **Financial Goals** | Create, track, and resolve goals with the Edelman 3-option solver (Option A/B/C) |
| **AI Wealth Advisor** | RAG-powered conversational assistant — chat, goal analysis, portfolio coaching, retirement planning |
| **Portfolio Management** | Asset allocation, performance charts (TWR/MWR), Sharpe ratio, drift alerts, rebalancing |
| **Priority Actions** | Rule-based recommendation engine with AI-powered explanations |
| **Retirement Coach** | AI-driven retirement readiness analysis with withdrawal sequencing guidance |
| **Multi-role Support** | Client and Advisor roles with consent-based data sharing |

---

## Tech Stack

| Layer | Technology |
|:---|:---|
| **Frontend** | React 18, TypeScript, Vite, Zustand, Recharts, Vanilla CSS |
| **Backend** | Node.js 18, Express 4, TypeScript |
| **Database** | PostgreSQL 16 + pgvector via Docker, Prisma ORM 5 |
| **AI / LLM** | Tier 1: GroqCloud / xAI Grok (Fast LPU / Grok-3) · Tier 2: Google Gemini · Tier 3: Local Rule Synthesizer |
| **RAG Engine** | PostgreSQL + pgvector Hybrid Search (Vector + Full-Text RRF) with In-Memory Response Caching |
| **Auth** | JWT + bcryptjs |

---

## Quick Start

### Prerequisites
- [Node.js 18+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Google Gemini API key](https://ai.google.dev/)

### 1. Clone and install

```bash
git clone https://github.com/AbhayBhise/Personal-Wealth-Management-Module--Weallth.git
cd Personal-Wealth-Management-Module--Weallth

# Install backend dependencies
cd app/backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Start PostgreSQL (Docker)

```bash
# First-time setup
docker run --name backend-db-1 \
  -e POSTGRES_PASSWORD=dev \
  -e POSTGRES_DB=weallth \
  -p 5432:5432 \
  -d pgvector/pgvector:pg16

# Subsequent runs
docker start backend-db-1
```

### 3. Configure environment

```bash
# In app/backend/
cp .env.example .env
# Edit .env and set your GEMINI_API_KEY
```

See [Environment Variables](#environment-variables) below for all options.

### 4. Run database migrations and seed

```bash
cd app/backend
npx prisma migrate deploy
npm run seed
```

### 5. Start the servers

```bash
# Terminal 1 — Backend (port 3001)
cd app/backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd app/frontend && npm run dev
```

### 6. Open the app

Navigate to **[http://localhost:5173](http://localhost:5173)**

Demo credentials (seeded by `npm run seed`):
- **Client:** `client@weallth.demo` / `demo1234`
- **Advisor:** `advisor@weallth.demo` / `demo1234`

---

## Environment Variables

Create `app/backend/.env` from `app/backend/.env.example`:

| Variable | Required | Description |
|:---|:---|:---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string (`postgresql://postgres:dev@localhost:5432/weallth`) |
| `JWT_SECRET` | ✅ | Secret for signing JWT tokens |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key (get one at [ai.google.dev](https://ai.google.dev)) |
| `PORT` | Optional | Backend port (default: `3001`) |

---

## Project Structure

```
.
├── app/
│   ├── frontend/              # React + Vite + TypeScript SPA
│   └── backend/               # Express + Prisma + PostgreSQL API
│       ├── prisma/            # Schema, migrations, seed
│       └── src/
│           ├── controllers/   # Route handlers
│           ├── services/      # Business logic + RAG engine
│           ├── repositories/  # Prisma data access layer
│           └── calculations/  # Financial math engine
├── docs/                      # All project documentation
│   ├── architecture/          # Mermaid diagrams
│   ├── specifications/        # API contracts, UI/UX, DB migration
│   ├── database/              # SQL schema
│   ├── ai/                    # AI feature specs
│   ├── implementation/        # Roadmap
│   └── testing/               # Test strategy
├── research/
│   └── README.md              # How to rebuild the RAG knowledge base
├── scripts/
│   └── build_rag_knowledge.py # RAG knowledge base builder
└── PROJECT_DOCUMENTATION.md  # Full technical & product documentation
```

---

## RAG Knowledge Base

The AI advisor uses a local RAG knowledge base (`rag_knowledge.json`) derived from:
- Ric Edelman's *Discover the Wealth Within You* (HarperCollins 2010) — **copyrighted, not committed**
- Internal wealth management research documents — **kept local**

On a fresh clone, the app uses a **5-chunk copyright-free placeholder** (`sample_rag_knowledge.json`) and the AI will respond with limited context.

To rebuild the full 689-chunk knowledge base locally, see **[research/README.md](research/README.md)**.

---

## Documentation

- 📘 **[PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)** — Full technical & product documentation (15 sections)
- 📁 **[docs/](docs/)** — Architecture diagrams, API contracts, specifications
- 🔬 **[research/README.md](research/README.md)** — RAG knowledge base rebuild guide

---

## License

This project is proprietary. All rights reserved © Weallth / AbhayBhise.
