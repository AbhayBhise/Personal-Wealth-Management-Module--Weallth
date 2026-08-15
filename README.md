<div align="center">

# Weallth PWM — Personal Wealth Management Module

**An intelligent, AI-powered wealth management platform built for financial advisors and self-directed investors.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16_+_pgvector-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Groq LPU](https://img.shields.io/badge/Groq-Llama_3.3_70B-F55036?logo=fastapi&logoColor=white)](https://groq.com/)
[![Google Gemini](https://img.shields.io/badge/Gemini-3.5_Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

</div>

---

## What is Weallth?

Weallth is an enterprise-grade **Personal Wealth Management (PWM)** platform that helps individuals understand, plan, and grow their financial lives using AI-driven insights grounded in proven wealth management methodologies.

It combines:
- **Holistic financial profiling** (household, income, assets, liabilities, goals, insurance)
- **Wealth Health Score (WHS)** — a composite 0–100 score across 7 financial pillars
- **AI Wealth Advisor** — a multi-tier RAG assistant powered by Groq LPU (`llama-3.3-70b`), xAI Grok, and Google Gemini (`gemini-3.5-flash`)
- **Goal-based planning** with Edelman's 3-option shortfall solver (Option A/B/C)
- **Portfolio analytics** (TWR, MWR, Sharpe, Beta, Alpha, drift detection, rebalancing)
- **Adaptive priority actions** (rule-based recommendation engine with INR-focused advisory explanations)

---

## Core Features

| Feature | Description |
|:---|:---|
| **Wealth Health Score** | Composite 0–100 score across 7 pillars: Emergency Fund, Debt, Savings, Insurance, Goals, Retirement, Investment |
| **Financial Goals** | Create, track, and resolve goals with the Edelman 3-option solver (Option A: Boost Savings, Option B: Downsize Target, Option C: Extend Horizon) |
| **AI Wealth Advisor** | Multi-tier RAG-powered conversational assistant with sub-second LPU inference (~370ms) and multi-turn memory |
| **Priority Action Analysis** | Adaptive category-aware AI diagnostics with urgency badges (`🔴 HIGH`, `🟡 MEDIUM`, `🟢 LOW`) and interactive chat follow-up chips |
| **Indian Wealth Context** | Strict INR (₹) grounding and Indian tax/retirement instruments (EPF, VPF, NPS, ELSS) with zero US account hallucinations (no 401k/Roth IRA) |
| **Portfolio Management** | Asset allocation, performance charts (TWR/MWR), Sharpe ratio, drift alerts, and rebalancing recommendations |
| **Retirement Coach** | AI-driven retirement readiness analysis with longevity horizon planning (to age 95+) and tax-efficient withdrawal sequencing |
| **Multi-role Support** | Client and Advisor roles with consent-based data sharing |

---

## Tech Stack

| Layer | Technology |
|:---|:---|
| **Frontend** | React 18, TypeScript, Vite, Zustand, Recharts, Vanilla CSS (Dark Glassmorphism) |
| **Backend** | Node.js 18, Express 4, TypeScript |
| **Database** | PostgreSQL 16 with `pgvector` extension via Docker, Prisma ORM 5 |
| **AI Multi-Tier Synthesis** | **Tier 1:** GroqCloud (`llama-3.3-70b-versatile`) / xAI Grok (`grok-3`)<br/>**Tier 2:** Google Gemini API (`gemini-3.5-flash`) with 429 rate-limit cooldown<br/>**Tier 3:** Deterministic formula-driven local rule synthesizer |
| **RAG Retrieval Engine** | PostgreSQL + pgvector Hybrid Search (Dense 768-dim Vector + Full-Text Keyword RRF) with 15-min in-memory response cache |
| **Auth** | JWT + bcryptjs |

---

## Quick Start

### Prerequisites
- [Node.js 18+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- At least one API key:
  - [Groq API Key (Free & Fast)](https://console.groq.com) — *Recommended*
  - [Google Gemini API Key](https://aistudio.google.com/)

### 1. Clone and install

```bash
git clone https://github.com/AbhayBhise/Personal-Wealth-Management-Module--Weallth.git
cd Personal-Wealth-Management-Module--Weallth

# Install backend dependencies
cd app/backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Start PostgreSQL with pgvector (Docker)

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
```

Edit `app/backend/.env` with your database and API keys:

```env
DATABASE_URL="postgresql://postgres:dev@localhost:5432/weallth?schema=public"
JWT_SECRET="weallth-development-secret-key-2026"
PORT=3001

# Fast LLM Configuration (GroqCloud free tier or xAI Grok)
GROK_API_KEY="gsk_your_groq_api_key"
GROK_MODEL_NAME="llama-3.3-70b-versatile"
GROK_TIMEOUT_MS=4000

# Google Gemini Configuration (Fallback Tier)
GEMINI_API_KEY="your_gemini_api_key"
EMBEDDING_MODEL_NAME="gemini-embedding-001"
EMBEDDING_DIMENSION=768
```

### 4. Run database migrations, seed data, and knowledge ingestion

```bash
cd app/backend

# Apply Prisma schema to PostgreSQL
npx prisma db push

# Seed demo users, accounts, holdings, and liabilities
npx prisma db seed

# Ingest book knowledge chunks into pgvector
npm run rag:ingest
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

**Demo credentials:**
- **Client:** `client@weallth.demo` / `demo1234`
- **Advisor:** `advisor@weallth.demo` / `demo1234`

---

## Environment Variables

Create `app/backend/.env` from `app/backend/.env.example`:

| Variable | Required | Default | Description |
|:---|:---|:---|:---|
| `DATABASE_URL` | ✅ | — | PostgreSQL connection string (`postgresql://postgres:dev@localhost:5432/weallth`) |
| `JWT_SECRET` | ✅ | — | Secret for signing JWT authentication tokens |
| `GROK_API_KEY` | Optional | `""` | GroqCloud (`gsk_...`) or xAI Grok (`xai-...`) API key |
| `GROK_MODEL_NAME` | Optional | `llama-3.3-70b-versatile` | Model name for Tier 1 inference |
| `GROK_TIMEOUT_MS` | Optional | `4000` | Tier 1 timeout in milliseconds |
| `GEMINI_API_KEY` | ✅ | — | Google Gemini API key (embeddings + Tier 2 LLM) |
| `EMBEDDING_MODEL_NAME` | Optional | `gemini-embedding-001` | Embedding model for semantic search |
| `EMBEDDING_DIMENSION` | Optional | `768` | Vector dimension for pgvector |
| `RETRIEVAL_TOP_K` | Optional | `6` | Number of chunks retrieved per search |
| `RETRIEVAL_MIN_SIMILARITY` | Optional | `0.55` | Minimum cosine similarity threshold |
| `LLM_CACHE_ENABLED` | Optional | `true` | In-memory LLM response caching toggle |
| `LLM_CACHE_TTL_SECONDS` | Optional | `600` | Cache time-to-live in seconds (10 mins) |
| `PORT` | Optional | `3001` | Backend Express server port |

---

## Project Structure

```
.
├── app/
│   ├── frontend/              # React + Vite + TypeScript SPA
│   │   ├── src/
│   │   │   ├── components/    # AIChatWidget, NetWorthChart, AssetAllocationChart, etc.
│   │   │   ├── pages/         # Dashboard, Goals, Onboarding, Login, Register
│   │   │   ├── store/         # Zustand store (useAppStore.ts)
│   │   │   └── services/      # Frontend API client
│   └── backend/               # Express + Prisma + PostgreSQL API
│       ├── prisma/            # Schema, seed.ts, migrations
│       └── src/
│           ├── calculations/  # Math engine (WHS, TWR, 3-Option solver, recommendations)
│           ├── controllers/   # Route handlers
│           ├── repositories/  # Prisma data access layer
│           ├── routes/        # Express route definitions
│           └── services/      # Business logic orchestration
│               └── rag/       # 3-Tier RAG Engine, pgvector store, embedder, grokClient
├── docs/                      # Technical specifications, architecture, and diagrams
├── research/                  # Knowledge base documentation
├── scripts/                   # Knowledge base building & extraction scripts
└── PROJECT_DOCUMENTATION.md  # Comprehensive technical & product documentation
```

---

## RAG Knowledge Base & pgvector

The AI advisor is grounded in a hybrid vector knowledge base derived from Ric Edelman's *Discover the Wealth Within You* (HarperCollins 2010) and internal wealth management research.

To rebuild or evaluate retrieval locally:
```bash
# Ingest extracted text chunks into pgvector
cd app/backend
npm run rag:ingest

# Run retrieval evaluation test suite
npm run rag:eval
```

---

## Documentation

- 📘 **[PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)** — Comprehensive technical & product documentation (15 sections)
- 📁 **[docs/](docs/)** — Architecture diagrams, API contracts, mathematical specifications
- 🔬 **[research/README.md](research/README.md)** — RAG knowledge base rebuild guide

---

## License

This project is proprietary. All rights reserved © Weallth / AbhayBhise.
