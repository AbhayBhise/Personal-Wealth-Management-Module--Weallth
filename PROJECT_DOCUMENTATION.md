# Weallth PWM — Complete Technical & Product Documentation

> **Version:** 2.0 | **Status:** Living Document | **Last Updated:** August 2026  
> **Authors:** Weallth Architecture Team

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Module Documentation](#4-module-documentation)
5. [AI & RAG Documentation](#5-ai--rag-documentation)
6. [Database Documentation](#6-database-documentation)
7. [API Documentation](#7-api-documentation)
8. [Application Workflow](#8-application-workflow)
9. [AI Request Flow](#9-ai-request-flow)
10. [Implementation Status](#10-implementation-status)
11. [Security](#11-security)
12. [Performance & Optimization](#12-performance--optimization)
13. [Deployment & Environment Setup](#13-deployment--environment-setup)
14. [Testing & Evaluation](#14-testing--evaluation)
15. [Future Roadmap](#15-future-roadmap)

---

## 1. Project Overview

### 1.1 Project Vision

**Weallth** is an enterprise-grade, AI-powered Personal Wealth Management (PWM) platform that democratizes the private wealth management strategies previously accessible only to high-net-worth individuals (HNWIs) and ultra-HNWIs. By embedding **Ric Edelman's 7-Pillar Planning Methodology** directly into the calculation engine and pairing it with a grounded **Retrieval-Augmented Generation (RAG)** AI advisory layer, Weallth delivers institutionally rigorous, hyper-personalized financial planning at scale.

The platform serves as the single source of truth for a client's complete financial life — from real-time wealth health scoring and multi-goal tracking, to AI-driven shortfall resolution, retirement readiness projections, portfolio drift analysis, and advisor-grade compliance logging.

---

### 1.2 Problem Statement

Traditional personal finance tools suffer three critical failures:

| Problem | Details |
|:---|:---|
| **Fragmentation** | Most tools solve one dimension (e.g., SIP calculators or retirement planners) without considering holistic household context: debts, dependents, insurance gaps, or liquidity ratios simultaneously. |
| **High Access Barriers** | Human wealth advisors require minimum AUMs of ₹1 crore+ and charge 0.75–1.5% annual management fees, locking out mass market and mass affluent users. |
| **Generic AI Responses** | Standard LLMs hallucinate financial figures, ignore user-specific context (asset mix, risk profile, liabilities), and cannot trace their output to authoritative financial domain documentation. |

---

### 1.3 Key Objectives

1. **Holistic Wealth Assessment:** Compute a real-time **Wealth Health Score (0–100)** across 7 Edelman-derived pillars using live household financial data.
2. **Algorithmic Goal Shortfall Resolution:** The **Edelman 3-Option Solver Engine** automatically computes three concrete mathematical paths (Option A: increase savings, Option B: reduce target cost, Option C: extend timeline) for every underfunded goal.
3. **Grounded AI Advisory:** Deploy a 10-stage RAG pipeline using institutional EPUB wealth textbooks (Ric Edelman's *Discover the Wealth Within You*), markdown architecture specs, and custom prompts — producing factually grounded, non-hallucinatory advisory responses.
4. **Multi-Currency UX:** Seamless INR (₹) and USD ($) formatting across all financial displays.
5. **Advisor-Grade Compliance:** Role-based access control (client / advisor), suitability rationale logging, and consent workflows.

---

### 1.4 Target Users

| Segment | Description | Net Worth (Approximate) |
|:---|:---|:---|
| **Mass Market** | Individuals beginning their wealth journey, primarily salaried employees | < ₹25 L |
| **Mass Affluent** | Established savers with diversified assets including Mutual Funds, FDs, Gold | ₹25 L – ₹1 Cr |
| **HNI (High Net Worth)** | Multi-asset investors with equity, real estate, NPS, international funds | ₹1 Cr – ₹10 Cr |
| **UHNWI** | Ultra high-net-worth with complex estate, business, and alternative investments | > ₹10 Cr |
| **Registered Advisors** | Fiduciary advisors managing client portfolios, consents, and compliance | N/A |

---

### 1.5 Scope of the Project

**In Scope (Current Build):**
- Full 8-step Wealth Discovery onboarding wizard
- Wealth Health Score (WHS) Engine
- Financial Goals management with Edelman 3-Option Solver
- AI Goal Coach (RAG-backed per-goal strategy)
- Priority Actions & Recommendation Engine (rule-based, 10+ rule categories)
- Portfolio Management: Summary, Performance (TWR/MWR/Sharpe/Beta/Alpha), Asset Allocation, Rebalancing Alerts
- AI Wealth Advisor Chat Widget (RAG-grounded conversational interface)
- AI Retirement Coach
- Risk Profiling (12-question questionnaire, scored 0–60)
- Multi-currency display (INR / USD)
- JWT Authentication & Role-Based Access

**Out of Scope (Planned):**
- Live bank/custodian account aggregation (Plaid/Yodlee)
- Tax computation engine
- Direct order placement or trade execution

---

## 2. System Architecture

### 2.1 High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        U["User / Financial Advisor"]
        FE["React 18 + Vite + TypeScript SPA<br/>http://localhost:5173"]
    end

    subgraph "Application Layer"
        PROXY["Vite Dev Proxy (/api → :3001)"]
        API["Express.js REST API<br/>http://localhost:3001"]
        CTRL["Controllers<br/>(Route Handlers)"]
        SVC["Service Layer<br/>(Business Logic)"]
    end

    subgraph "Calculation & Intelligence Layer"
        ENGINE["Edelman Math Engine<br/>(engine.ts)"]
        REC["Recommendation Engine<br/>(recommendations.ts)"]
        PIPELINE["10-Stage AI Pipeline<br/>(pipeline.ts)"]
        RAGENGINE["RAG Engine<br/>(engine.ts)"]
        LLM["Google Gemini API<br/>(gemini-1.5-flash)"]
        KB["Knowledge Base<br/>(rag_knowledge.json)"]
    end

    subgraph "Data Layer"
        REPO["Repository Layer<br/>(repositories/index.ts)"]
        PRISMA["Prisma ORM"]
        PG["PostgreSQL<br/>(Docker: backend-db-1)"]
        JSON["File-Backed Fallback<br/>(data.json)"]
    end

    U --> FE
    FE --> PROXY
    PROXY --> API
    API --> CTRL
    CTRL --> SVC
    SVC --> ENGINE
    SVC --> REC
    SVC --> PIPELINE
    PIPELINE --> RAGENGINE
    RAGENGINE --> KB
    RAGENGINE --> LLM
    SVC --> REPO
    REPO --> PRISMA
    PRISMA --> PG
    REPO -.->|"Fallback if Postgres offline"| JSON
```

---

### 2.2 Frontend Architecture

```mermaid
graph LR
    MAIN["main.tsx<br/>(React Entry Point)"]
    APP["App.tsx<br/>(Router & Auth Guards)"]
    STORE["useAppStore.ts<br/>(Zustand Global State)"]
    API_SVC["api.ts<br/>(HTTP Client)"]

    subgraph Pages
        LOGIN["Login.tsx"]
        REGISTER["Register.tsx"]
        ONBOARD["Onboarding.tsx<br/>(8-step Wizard)"]
        DASH["Dashboard.tsx"]
        GOALS["Goals.tsx"]
    end

    subgraph Components
        CHAT["AIChatWidget.tsx"]
        GAUGE["ScoreGauge.tsx"]
        NETWORTH["NetWorthChart.tsx"]
        ALLOC["AssetAllocationChart.tsx"]
        PERF["PerformanceChart.tsx"]
        HOLDINGS["HoldingsView.tsx"]
        REBAL["RebalancingAlerts.tsx"]
        CURRENCY["CurrencySelector.tsx"]
    end

    MAIN --> APP
    APP --> STORE
    APP --> Pages
    Pages --> Components
    Pages --> API_SVC
    STORE --> API_SVC
    CHAT --> STORE
```

---

### 2.3 Backend Architecture & Layer Separation

The backend follows strict architectural separation — no business logic ever reaches controllers or repositories:

```mermaid
graph TD
    REQ["HTTP Request"] --> CTRL["Controller Layer<br/>controllers/index.ts<br/>• Validates HTTP inputs<br/>• Delegates to service<br/>• Formats HTTP response"]
    CTRL --> SVC["Service Layer<br/>services/index.ts<br/>• All business logic<br/>• Orchestrates sub-services<br/>• Calls engine + repo"]
    SVC --> ENG["Math Engine<br/>calculations/engine.ts<br/>• All financial formulas<br/>• Zero business logic"]
    SVC --> REC["Recommendation Engine<br/>calculations/recommendations.ts<br/>• Rule evaluation<br/>• Alert generation"]
    SVC --> PIPE["AI Pipeline<br/>services/rag/pipeline.ts<br/>• 10-stage AI flow"]
    SVC --> REPO["Repository Layer<br/>repositories/index.ts<br/>• All data access<br/>• Prisma + fallback<br/>• Zero business logic"]
```

---

### 2.4 Complete Folder Structure

```
Personal-Wealth-Management-Module--Weallth/
│
├── app/
│   ├── frontend/                          # React SPA (Vite + TypeScript)
│   │   ├── src/
│   │   │   ├── App.tsx                    # Root router with auth guards
│   │   │   ├── main.tsx                   # React app entry point
│   │   │   ├── index.css                  # Global CSS & design tokens
│   │   │   ├── components/
│   │   │   │   ├── AIChatWidget.tsx       # Floating AI chat window
│   │   │   │   ├── AssetAllocationChart.tsx  # Pie/donut allocation chart
│   │   │   │   ├── CurrencySelector.tsx   # INR/USD currency toggle
│   │   │   │   ├── HoldingsView.tsx       # Holdings table view
│   │   │   │   ├── NetWorthChart.tsx      # Time-series net worth chart
│   │   │   │   ├── PerformanceChart.tsx   # Portfolio performance chart
│   │   │   │   ├── RebalancingAlerts.tsx  # Portfolio drift alert cards
│   │   │   │   └── ScoreGauge.tsx         # WHS animated gauge meter
│   │   │   ├── pages/
│   │   │   │   ├── Login.tsx              # Login page
│   │   │   │   ├── Register.tsx           # Registration page
│   │   │   │   ├── Onboarding.tsx         # 8-step Wealth Discovery wizard
│   │   │   │   ├── Dashboard.tsx          # Main dashboard with all widgets
│   │   │   │   └── Goals.tsx              # Financial goals management page
│   │   │   ├── services/
│   │   │   │   └── api.ts                 # HTTP client & API_BASE constant
│   │   │   ├── store/
│   │   │   │   └── useAppStore.ts         # Zustand global state store
│   │   │   ├── types/                     # Frontend TypeScript interfaces
│   │   │   └── utils/                     # Currency formatter utilities
│   │   └── vite.config.ts                 # Vite config with /api proxy
│   │
│   └── backend/                           # Express.js REST API Server
│       ├── prisma/
│       │   ├── schema.prisma              # Prisma DB schema (all 15 models)
│       │   ├── migrations/                # Prisma migration history
│       │   └── seed.ts                    # DB seed script
│       └── src/
│           ├── index.ts                   # Server bootstrap (Express init)
│           ├── types/
│           │   └── index.ts               # All shared TypeScript types
│           ├── controllers/
│           │   └── index.ts               # All route handlers
│           ├── routes/
│           │   └── index.ts               # Express router definitions
│           ├── services/
│           │   ├── index.ts               # Business logic orchestration
│           │   └── rag/
│           │       ├── engine.ts          # Core RAG engine + Gemini client
│           │       ├── pipeline.ts        # 10-stage AI pipeline
│           │       ├── registry.ts        # AI module registry (purpose-to-module map)
│           │       ├── types.ts           # AI pipeline TypeScript types
│           │       ├── cache.ts           # In-memory retrieval cache (10 min TTL)
│           │       ├── analytics.ts       # AI telemetry tracker
│           │       ├── cleaner.ts         # Output cleaning (strip markdown)
│           │       ├── validator.ts       # Input + confidence + response validation
│           │       ├── evaluation.ts      # Golden test suite + RAG evaluator
│           │       ├── chunks.ts          # Knowledge chunk loader (fallback-aware)
│           │       ├── sample_rag_knowledge.json  # Copyright-free placeholder (5 chunks)
│           │       ├── rag_knowledge.json          # [GITIGNORED] Full 689-chunk KB — rebuild locally
│           │       ├── context/
│           │       │   └── builder.ts     # Unified context assembler
│           │       ├── formatters/        # Purpose-specific output formatters
│           │       ├── profiles/          # AI response profile configurations
│           │       └── prompts/           # Purpose-specific prompt builders
│           ├── calculations/
│           │   ├── engine.ts              # All financial math formulas (TWR, MWR, WHS)
│           │   └── recommendations.ts     # Rule-based recommendation generator
│           └── repositories/
│               └── index.ts               # Prisma repository layer (PostgreSQL)
│
├── docs/                                  # All project documentation
│   ├── architecture/                      # Architecture diagrams (Mermaid)
│   │   ├── erd.mmd                        # Entity Relationship Diagram
│   │   ├── data_flow.mmd                  # Data flow sequence diagram
│   │   ├── domain_model.mmd               # Domain model diagram
│   │   ├── module_dependency.mmd          # Module dependency diagram
│   │   └── system_architecture.md         # Architecture narrative
│   ├── specifications/                    # Functional & technical specs
│   │   ├── api_contracts.md               # API endpoint contracts
│   │   ├── recommendation_engine.md       # Rules engine specification
│   │   ├── calculation_engine.md          # Financial math specification
│   │   ├── ui_ux_plan.md                  # UI/UX design plan
│   │   └── database_migration.md          # DB migration plan
│   ├── database/
│   │   └── schema.sql                     # Raw SQL schema (PostgreSQL)
│   ├── ai/
│   │   └── features.md                    # AI feature specifications
│   ├── implementation/
│   │   └── roadmap.md                     # Phase-by-phase delivery roadmap
│   ├── testing/
│   │   └── strategy.md                    # Testing strategy document
│   ├── wealth_health_score.md             # WHS mathematical specifications
│   ├── requirements.md                    # Functional requirements
│   ├── standards.md                       # Coding standards
│   └── analysis_and_roadmap.md            # Analysis & roadmap narrative
│
├── research/
│   └── README.md                          # How to rebuild the RAG knowledge base locally
│
└── scripts/
    └── build_rag_knowledge.py             # RAG knowledge base builder (requires local Weallth/ folder)
```

---

## 3. Technology Stack

| Category | Technology | Version | Purpose & Rationale |
|:---|:---|:---|:---|
| **Frontend Framework** | React | 18.x | Component model, concurrent rendering, hooks ecosystem |
| **Build Tool** | Vite | 5.x | Sub-100ms HMR, native ES modules, fast production builds |
| **Frontend Language** | TypeScript | 5.x | Strict type safety, shared interfaces with backend |
| **Styling** | Vanilla CSS | — | Full aesthetic control; glassmorphism, dark themes, animations |
| **State Management** | Zustand | 4.x | Minimal boilerplate, reactive subscriptions, persist middleware |
| **Backend Runtime** | Node.js | 18+ | Non-blocking I/O, vast npm ecosystem |
| **Backend Framework** | Express.js | 4.x | Lightweight, mature, excellent TypeScript support |
| **Backend Language** | TypeScript | 5.x | Shared domain models, compile-time safety |
| **Primary Database** | PostgreSQL | 14 (Docker) | ACID compliance, relational integrity, Prisma ORM support |
| **ORM** | Prisma | 5.x | Type-safe queries, schema migrations, Decimal precision |
| **Authentication** | JWT + bcryptjs | — | Stateless tokens, bcrypt password hashing (10 rounds) |
| **AI LLM** | Google Gemini API | `gemini-1.5-flash` | Low-latency, high-reasoning, structured output synthesis |
| **RAG Engine** | Custom TF-IDF + Semantic | — | In-process retrieval, no external vector DB required |
| **Knowledge Base** | EPUB + MD + DOCX chunks | 1.6 MB (local only) | Gitignored — contains Ric Edelman copyrighted text. Rebuild with `scripts/build_rag_knowledge.py`. See `research/README.md` |
| **Charts** | Recharts / SVG | — | Net worth, asset allocation, performance, and score gauge |
| **Docker** | Docker Desktop | — | PostgreSQL container (`backend-db-1`, `pgvector/pgvector:pg16`) |
| **Package Management** | npm | 9+ | Dependency management |

---

## 4. Module Documentation

### 4.1 Authentication & Onboarding

#### Purpose
Securely create user accounts, authenticate sessions, and capture the full financial profile through an 8-step guided wizard.

#### Authentication Flow
- **Register:** `POST /api/v1/auth/register` → `bcrypt.hashSync(password, 10)` → creates User record → returns JWT
- **Login:** `POST /api/v1/auth/login` → `bcrypt.compareSync` → returns JWT signed with 7-day expiry
- **Token Storage:** Stored in Zustand `persist` middleware (`localStorage`) under `weallth-auth-storage`
- **Protected Routes:** Frontend `App.tsx` checks `user !== null` before rendering protected pages

#### Wealth Discovery Wizard (8 Steps)
All 8 steps are submitted as a single `POST /api/v1/users/:userId/wealth-discovery` payload.

| Step | Data Captured | Key Processing |
|:---|:---|:---|
| 1 — Personal & Family | DOB, Occupation, Marital Status, Dependents | Calculates age from DOB, saves HouseholdProfile + HouseholdMembers |
| 2 — Income Profile | Salary, Business, Rental, Other income | Saves IncomeProfile, computes monthly net income |
| 3 — Assets & Holdings | Institution → Account → Holdings (category, value, liquidity) | Creates Institution + Account + Holding records; accumulates total investable assets & liquid cash |
| 4 — Liabilities | Name, Category, Outstanding Balance, Interest Rate, Monthly Payment | Creates Liability records; flags high-interest debt (>8% APR) |
| 5 — Financial Goals | Name, Category, Priority, Target Amount, Target Year, Already Saved, Monthly Contribution | Computes inflation-adjusted future cost & shortfall via Edelman math; saves Goal records |
| 6 — Risk Profiling | 12-question questionnaire (scored 1–5 per question) | Aggregates score 12–60 → maps to RiskProfile via `scoreToRiskProfile()` |
| 7 — Insurance | Life Coverage, Health Coverage, Disability Monthly, Has LTC | Saves InsuranceProfile; computes coverage ratios vs targets |
| 8 — Consent & Estate | Has Will, Has POA, Has HC Proxy, Advisory Disclaimer | Saves estate planning flags; derives wealth segment; triggers WHS + Recommendation computation |

#### Key Files
- [`Onboarding.tsx`](file:///Users/shravanmole/Documents/Personal-Wealth-Management-Module--Weallth/app/frontend/src/pages/Onboarding.tsx) — 8-step wizard UI
- [`services/index.ts#submitWealthDiscovery`](file:///Users/shravanmole/Documents/Personal-Wealth-Management-Module--Weallth/app/backend/src/services/index.ts) — orchestration function
- [`routes/index.ts`](file:///Users/shravanmole/Documents/Personal-Wealth-Management-Module--Weallth/app/backend/src/routes/index.ts) — route definitions

---

### 4.2 Dashboard

#### Purpose
Unified command center presenting the user's complete financial snapshot: WHS score, net worth timeline, priority action alerts, portfolio summary, AI Retirement Coach, and the AI Chat widget.

#### Key Features
- **WHS Score Gauge** (`ScoreGauge.tsx`) — animated SVG arc with category label (VULNERABLE / CAUTION / HEALTHY / EXCELLENT)
- **Net Worth Chart** (`NetWorthChart.tsx`) — 6-month rolling time-series chart
- **Priority Action Cards** — dismissable recommendation alert cards with category icons
- **Portfolio Summary** — total value, asset count, risk profile
- **AI Retirement Coach Card** — AI-generated retirement readiness analysis
- **AI Recommendation Explanation** — clicking a recommendation fetches AI explanation via `/recommendations/:recId/explain`
- **AI Chat Widget** — floating bottom-right chat window (RAG-backed)

#### Data Loading (Parallel)
All dashboard data is fetched in parallel on mount via `fetchDashboardData()` in Zustand:
```
GET /wealth-health-score  →  WHS snapshot
GET /goals                →  Goals array
GET /recommendations      →  Priority actions
GET /net-worth            →  Net worth history
```

#### Key Files
- [`Dashboard.tsx`](file:///Users/shravanmole/Documents/Personal-Wealth-Management-Module--Weallth/app/frontend/src/pages/Dashboard.tsx)
- [`useAppStore.ts#fetchDashboardData`](file:///Users/shravanmole/Documents/Personal-Wealth-Management-Module--Weallth/app/frontend/src/store/useAppStore.ts)

---

### 4.3 Wealth Health Score (WHS) Engine

#### Purpose
Computes a comprehensive financial health score (0–100) across 7 Edelman-derived pillars using aggregated household data.

#### Mathematical Model (7 Pillars)

| Pillar | Max Pts | Formula Summary |
|:---|:---|:---|
| **1. Emergency Fund Adequacy** | 20 | `efRatio = liquidCash / emergencyFundTarget` → `p1 = min(1, efRatio) × 20` |
| **2. Debt Management** | 20 | `debtRatio = totalDebt / totalAssets`; `p2 = 20 − debtRatioPenalty − highDebtPenalty` |
| **3. Savings Rate** | 15 | `srRatio = actualSavingsRate / targetSavingsRate (15%)`; `p3 = srRatio × 15` |
| **4. Portfolio Drift** | 15 | `driftPenalty = portfolioDrift × 100`; `p4 = 15 − driftPenalty` |
| **5. Retirement Readiness** | 15 | `p5 = retirementReadinessRatio × 15` |
| **6. Insurance Protection** | 10 | Disability ratio (3pt) + Life coverage ratio (4pt) + LTC if age ≥ 50 (3pt) |
| **7. Estate Planning** | 5 | Count of estate docs (Will, POA, HC Proxy) × (5/3) |

**Category Thresholds:**
```
0–39   → VULNERABLE
40–64  → CAUTION
65–84  → HEALTHY
85–100 → EXCELLENT
```

#### Key Files
- [`calculations/engine.ts#calculateWHS`](file:///Users/shravanmole/Documents/Personal-Wealth-Management-Module--Weallth/app/backend/src/calculations/engine.ts) — core formula
- [`docs/wealth_health_score.md`](file:///Users/shravanmole/Documents/Personal-Wealth-Management-Module--Weallth/docs/wealth_health_score.md) — detailed specification

---

### 4.4 Financial Goals & Edelman 3-Option Solver

#### Purpose
Track all financial targets with real-time shortfall calculation and AI-powered solver math. Each goal card shows funding progress, Edelman's Option A/B/C paths, and an AI Coach narrative.

#### Business Logic — Shortfall Calculation
```
futureCost     = targetAmount × (1 + inflationRate)^years
fvAssets       = alreadySaved × (1 + returnRate)^years
fvSavings      = monthlyContribution × FVIFA(returnRate, years)
shortfall      = max(0, futureCost − fvAssets − fvSavings)
```

#### Edelman 3-Option Solver
| Option | Formula | Meaning |
|:---|:---|:---|
| **A — Increase Monthly Savings** | `M = shortfall × r / ((1+r)^n − 1)` | Additional monthly savings required to close shortfall by target date |
| **B — Reduce Target Cost** | `C = (fvAssets + fvSavings) / (1 + inflationRate)^years` | Maximum supportable present-value target given current savings |
| **C — Extend Timeline** | `t = ceil(log(1 + shortfall×r/PMT) / log(1+r))` | Additional months needed at current contribution rate |

#### UI — Goal Card Features
- **`⋮` Three-Dot Dropdown Menu** (top-right of each card): ✏️ Edit Goal, 🗑️ Delete Goal
- **Add New Goal Modal** with Name, Category, Priority, Target Amount, Target Year, Already Saved, Monthly Savings
- **Edit Goal Modal** pre-populated with existing values
- **Progress Bar** showing funded percentage
- **Edelman Solver Section** with Option A/B/C cards
- **AI Goal Coach** section with strategy narrative

#### Key Files
- [`Goals.tsx`](file:///Users/shravanmole/Documents/Personal-Wealth-Management-Module--Weallth/app/frontend/src/pages/Goals.tsx)
- [`calculations/engine.ts#calculateRequiredSavings`](file:///Users/shravanmole/Documents/Personal-Wealth-Management-Module--Weallth/app/backend/src/calculations/engine.ts)
- [`services/index.ts#getGoalOptions`](file:///Users/shravanmole/Documents/Personal-Wealth-Management-Module--Weallth/app/backend/src/services/index.ts)

---

### 4.5 AI Goal Coach

#### Purpose
Provides a personalized, AI-generated strategy narrative for each financial goal using the goal's exact shortfall math, Edelman solver options, and RAG-retrieved institutional wealth knowledge.

#### AI Purpose: `goal-analysis`
- **Retrieval Query:** `"goal shortfall risk mathematical options {goalName}"`
- **Category Filter:** `"Goal"`
- **Fallback Generator:** `generateGoalAnalysisFallback(context)` — generates a deterministic math-based response if LLM is unavailable

---

### 4.6 Priority Actions & Recommendation Engine

#### Purpose
Generates contextual, prioritized advisory alerts based on rule evaluation against the user's live financial snapshot.

#### Rule Categories (10+ Rules)

| Category | Trigger Condition | Priority |
|:---|:---|:---|
| Emergency Fund | `liquidCash / emergencyFundTarget < 0.5` (< 3 months) | **Critical** |
| Emergency Fund | `liquidCash / emergencyFundTarget < 1.0` (< 6 months) | **High** |
| Debt Management | `highInterestDebt > 0` (any debt > 8% APR) | **Critical** |
| Debt Management | `debtToIncomeRatio > 0.35` | **High** |
| Savings Rate | `savingsRate < 0.10` | **High** |
| Retirement | `retirementReadinessRatio < 0.5` | **High** |
| Insurance | `disabilityCoverageRatio < 0.6` | **High** |
| Insurance | `lifeCoverageRatio < 0.6` | **High** |
| Estate Planning | `!hasWill && age >= 35` | **Medium** |
| Portfolio Drift | (future: portfolio drift > 10%) | Medium |

Each recommendation includes: `alert_message`, `reason`, `expected_benefit`, and `action`.

#### Key Files
- [`calculations/recommendations.ts`](file:///Users/shravanmole/Documents/Personal-Wealth-Management-Module--Weallth/app/backend/src/calculations/recommendations.ts)

---

### 4.7 Portfolio Management & Analytics

#### Purpose
Provides institutional-grade investment portfolio analytics using holdings data with simulated performance metrics (TWR, MWR, Sharpe, Beta, Alpha).

#### Sub-Modules

**Portfolio Summary:**
- Total portfolio value
- Net worth (assets − liabilities)
- Holdings breakdown by asset class (Cash, Stocks, Mutual Funds, Gold, Real Estate, EPF, PPF, NPS, Bonds, Crypto, Fixed Deposits)
- Breakdown by institution

**Portfolio Performance (TWR-based):**
- Time-Weighted Return (TWR) using `calculateTWR()` — industry-standard metric eliminating external cash flow distortion
- Annualized return vs. benchmark (Nifty/S&P)
- Volatility (annualized standard deviation of monthly returns)
- Sharpe Ratio: `(portfolioReturn − riskFreeRate) / volatility`
- Beta (market sensitivity)
- Jensen's Alpha (risk-adjusted outperformance)

**Asset Allocation & Drift:**
- Target model allocation by risk profile (Conservative/Balanced/Growth/Aggressive)
- Actual allocation percentages
- Drift per asset class (actual − target)
- Rebalancing alerts for drift > threshold

#### Key Files
- [`calculations/engine.ts`](file:///Users/shravanmole/Documents/Personal-Wealth-Management-Module--Weallth/app/backend/src/calculations/engine.ts) — `calculateTWR`, `calculateVolatility`, `calculateSharpeRatio`, `calculateBeta`, `calculateAlpha`
- [`services/index.ts#getPortfolioPerformance`](file:///Users/shravanmole/Documents/Personal-Wealth-Management-Module--Weallth/app/backend/src/services/index.ts)
- [`AssetAllocationChart.tsx`](file:///Users/shravanmole/Documents/Personal-Wealth-Management-Module--Weallth/app/frontend/src/components/AssetAllocationChart.tsx)
- [`PerformanceChart.tsx`](file:///Users/shravanmole/Documents/Personal-Wealth-Management-Module--Weallth/app/frontend/src/components/PerformanceChart.tsx)

---

### 4.8 AI Wealth Advisor Chat

#### Purpose
Provides real-time, conversational financial advisory grounded in institutional wealth management documentation via the RAG pipeline.

#### Features
- **Floating Chat Widget** (bottom-right, all pages)
- **Greeting Detection:** Exact word-boundary regex matching (`\bhi\b`, `\bhello\b`) for instant greeting responses
- **Multi-turn Memory:** Last 4 conversation turns sent to LLM for context continuity
- **Intent Classification:** 6 intent categories (Educational, Personal Advice, Emergency Fund, Debt & Cash Flow, Retirement & Longevity, Product & WHS Help)
- **Suggested Follow-Ups:** Pipeline returns 3 suggested follow-up questions after each response
- **Thumbs Up/Down Feedback:** User feedback logged via `aiAnalytics.logFeedback()`
- **Confidence-gated Fallback:** If retrieval confidence < 0.25, returns an honest "I couldn't find sufficient documentation" response with topic suggestions

#### Key Files
- [`AIChatWidget.tsx`](file:///Users/shravanmole/Documents/Personal-Wealth-Management-Module--Weallth/app/frontend/src/components/AIChatWidget.tsx)
- [`rag/prompts/chat.ts`](file:///Users/shravanmole/Documents/Personal-Wealth-Management-Module--Weallth/app/backend/src/services/rag/prompts/chat.ts)

---

### 4.9 Settings & Profile

#### Currency Preferences
- `PATCH /api/v1/users/:userId/preferences` — updates `display_currency` (INR/USD)
- Currency switch is immediate (optimistic update) and persisted to `ClientProfile.displayCurrency` in DB
- All monetary displays use the `formatCurrency(value, currency)` utility

---

## 5. AI & RAG Documentation

### 5.1 Overall AI Architecture

```mermaid
graph TB
    REQUEST["AIPipelineRequest<br/>{purpose, userId, query, goalData, chatHistory}"]
    STAGE1["Stage 1: Purpose Detection<br/>getAIModule(purpose) → AI_MODULE_REGISTRY"]
    STAGE2["Stage 2: Intent Classification<br/>detectIntentFromPurposeAndQuery()"]
    STAGE3["Stage 3: Unified Context Builder<br/>buildUnifiedContext()"]
    STAGE4["Stage 4: Input Validation<br/>validateInput()"]
    STAGE5["Stage 5: Retrieval Strategy Selection<br/>moduleDef.getRetrievalStrategy()"]
    CACHE["Stage 5b: AI Cache Inspection<br/>aiCache.getCachedRetrieval() [10 min TTL]"]
    RETRIEVAL["RAG Engine Semantic Search<br/>ragEngine.semanticSearch(query, filter)"]
    STAGE6["Stage 6: Confidence Validation<br/>validateConfidence(score, purpose)"]
    STAGE7["Stage 7: Prompt Builder<br/>moduleDef.buildPrompt()"]
    STAGE8["Stage 8: LLM Synthesis<br/>ragEngine.synthesizeCustomPrompt()"]
    VALIDATE["Stage 8b: Response Validation<br/>validateGeneratedResponse() [up to 2 retries]"]
    FALLBACK["Fallback Generator<br/>generateGoalAnalysisFallback()<br/>generatePriorityAnalysisFallback()"]
    STAGE9["Stage 9: Output Cleaning<br/>cleanAIResponseOutput(stripAsterisks)"]
    FORMAT["Stage 9b: Response Formatter<br/>moduleDef.formatResponse()"]
    ANALYTICS["Stage 10: Telemetry Logging<br/>aiAnalytics.logExecution()"]
    RESULT["AIPipelineResult<br/>{formattedOutput, diagnostics}"]

    REQUEST --> STAGE1
    STAGE1 --> STAGE2
    STAGE2 --> STAGE3
    STAGE3 --> STAGE4
    STAGE4 --> STAGE5
    STAGE5 --> CACHE
    CACHE -->|"Cache Miss"| RETRIEVAL
    CACHE -->|"Cache Hit"| STAGE6
    RETRIEVAL --> STAGE6
    STAGE6 -->|"Confidence < 0.25"| FALLBACK
    STAGE6 -->|"Confidence >= 0.25"| STAGE7
    STAGE7 --> STAGE8
    STAGE8 --> VALIDATE
    VALIDATE -->|"Invalid / Empty"| FALLBACK
    VALIDATE -->|"Valid"| STAGE9
    FALLBACK --> STAGE9
    STAGE9 --> FORMAT
    FORMAT --> ANALYTICS
    ANALYTICS --> RESULT
```

---

### 5.2 AI Module Registry (6 Modules)

| Purpose | Retrieval Strategy | Prompt Builder | Fallback Available |
|:---|:---|:---|:---|
| `chat` | Query-based, no filter | `buildChatPrompt` | ✅ (low-confidence message) |
| `goal-analysis` | `"goal shortfall risk mathematical options {goalName}"`, filter: `"Goal"` | `buildGoalAnalysisPrompt` | ✅ `generateGoalAnalysisFallback` |
| `priority-analysis` | `"priority action rule violation {category} {alertMessage}"` | `buildPriorityAnalysisPrompt` | ✅ `generatePriorityAnalysisFallback` |
| `retirement-analysis` | `"retirement longevity risk withdrawal sequence"`, filter: `"Retirement"` | `buildRetirementAnalysisPrompt` | ✅ |
| `portfolio-analysis` | `"portfolio asset allocation drift rebalancing"`, filter: `"Asset Allocation"` | `buildPortfolioAnalysisPrompt` | ❌ |
| `dashboard-insight` | `"wealth health score 7-pillar methodology"` | `buildDashboardInsightPrompt` | ❌ |

---

### 5.3 RAG Knowledge Base & Retrieval

**Knowledge Base (`rag_knowledge.json`):**
- **Size:** 1.6 MB compressed JSON
- **Sources:** Ric Edelman's *Discover the Wealth Within You* (EPUB chunks) + Global Personal Wealth Management Research framework specs
- **Chunk Count:** ~600+ document chunks
- **Chunking Strategy:** ~500–800 word segments with 10% semantic overlap
- **Metadata per Chunk:** `{ id, source, category, text }`

**Retrieval Algorithm:**
- Custom term-frequency scoring with keyword density weighting
- Category pre-filtering (e.g., only `"Goal"` category chunks for goal analysis)
- Ranked by relevance score; top-K chunks returned
- Confidence score: `precision@K × 0.6 + MRR × 0.4`

**Retrieval Evaluation Metrics:**
- **Precision@K** — fraction of top-K retrieved chunks that are topic-relevant
- **Recall@K** — coverage of expected relevant chunks
- **Hit Rate** — binary: at least one relevant chunk in top-K
- **MRR (Mean Reciprocal Rank)** — inverse rank of first relevant chunk

---

### 5.4 Prompt Engineering

Each AI module has a purpose-built system prompt that:
1. Establishes the AI advisor persona (non-hallucinatory, Edelman-grounded)
2. Injects the retrieved knowledge context (`[Source N: title] chunk text`)
3. Injects the unified financial context (user's age, WHS score, debts, goals, savings rate)
4. Provides explicit response constraints (format, length, tone, prohibited behaviors)
5. Ends with the specific question or analysis task

---

### 5.5 Hallucination Guardrails

| Guardrail | Mechanism | Trigger |
|:---|:---|:---|
| **Low Confidence Fallback** | `validateConfidence()` returns static "I couldn't find..." message | Confidence score < 0.25 for chat |
| **Response Contradiction Check** | `validateGeneratedResponse()` checks for known contradictions vs. user context | E.g., user has 6-month EF but response says "you need to build a 6-month fund" |
| **Response Length Check** | `validateGeneratedResponse()` rejects responses < 20 characters | Empty or broken LLM responses |
| **2-Retry Mechanism** | If response validation fails, LLM is called again (max 2 attempts) | Any validation failure |
| **Purpose-Specific Fallback Generators** | Deterministic math-based local fallbacks | If all LLM attempts fail |
| **Grounded Sources** | All responses cite chunk source documents | Default prompt instruction |
| **Clean Output** | `cleanAIResponseOutput()` strips raw `**bold**` markdown for non-chat modules | All non-chat purposes |

---

### 5.6 AI Observability & Telemetry

The `AIAnalyticsTracker` (`analytics.ts`) maintains a rolling in-memory log (last 500 records) of:

```typescript
{
  purpose: 'goal-analysis',
  intent: 'Optimize',
  confidenceScore: 0.72,
  totalLatencyMs: 1243,
  retrievalLatencyMs: 48,
  timestamp: '2026-08-03T06:00:00Z'
}
```

**Available Metrics:**
- `totalRequests` — count of AI pipeline executions
- `avgLatencyMs` — average end-to-end response time
- `lowConfidenceCount` — requests with confidence < 0.30
- `feedbackUp/Down` — thumbs up/down from chat widget
- `purposeDistribution` — breakdown by module type
- `intentDistribution` — breakdown by detected intent

**Structured Console Logging:**
Every pipeline execution emits a JSON log:
```json
{
  "timestamp": "2026-08-03T06:00:00Z",
  "pipelineStage": "COMPLETED",
  "purpose": "goal-analysis",
  "userId": "uuid...",
  "retrievalLatencyMs": 45,
  "totalLatencyMs": 1203,
  "confidenceScore": 0.72,
  "retrievedChunkIds": ["dwwy_chunk_0042", "dwwy_chunk_0099"],
  "sourcesCount": 2
}
```

---

### 5.7 Golden Test Suite (10 Test Cases)

The `GOLDEN_TEST_CASES` array in [`evaluation.ts`](file:///Users/shravanmole/Documents/Personal-Wealth-Management-Module--Weallth/app/backend/src/services/rag/evaluation.ts) defines expected retrieval behavior for 10 canonical financial queries:

| ID | Query | Expected Intent | Target Topic |
|:---|:---|:---|:---|
| ef-01 | "How much emergency fund do I need?" | Emergency Fund | Emergency Fund |
| ef-02 | "Where should I keep my emergency savings?" | Emergency Fund | Emergency Fund |
| debt-01 | "Should I pay debt or invest first?" | Debt & Cash Flow | Debt Management |
| debt-02 | "What is the debt avalanche method?" | Educational | Debt Management |
| ret-01 | "How should I plan for retirement longevity?" | Retirement & Longevity | Retirement |
| ret-02 | "What is retirement withdrawal sequencing?" | Educational | Retirement |
| ins-01 | "Why is term life insurance recommended?" | Educational | Insurance |
| est-01 | "What is the purpose of a will?" | Educational | Estate Plan |
| port-01 | "How should I rebalance my portfolio?" | Personal Advice | Portfolio Drift |
| whs-01 | "How is my Wealth Health Score calculated?" | Product & WHS Help | General |

Pass Criteria: `hitRate > 0 AND latencyMs < 2500ms`

---

## 6. Database Documentation

### 6.1 Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o| ClientProfile : "has profile"
    User ||--o| HouseholdProfile : "has household"
    User ||--o{ HouseholdMember : "has members"
    User ||--o| IncomeProfile : "has income"
    User ||--o| InsuranceProfile : "has insurance"
    User ||--o| Assumptions : "has assumptions"
    User ||--o{ Institution : "owns"
    User ||--o{ Account : "owns"
    User ||--o{ Holding : "owns"
    User ||--o{ Liability : "owes"
    User ||--o{ Goal : "pursues"
    User ||--o{ RecommendationAlert : "receives"
    User ||--o{ WhsHistory : "logged by"
    User ||--o{ AdvisorClientConsent : "advisor side"
    User ||--o{ AdvisorClientConsent : "client side"
    User ||--o{ ComplianceSuitabilityLog : "triggers"

    Institution ||--o{ Account : "contains"
    Account ||--o{ Holding : "holds"
    Goal ||--o{ RecommendationAlert : "triggers"
```

---

### 6.2 Core Tables & Schema Summary

#### `users` — Master User Record
| Column | Type | Description |
|:---|:---|:---|
| `id` | UUID (PK) | Auto-generated unique identifier |
| `email` | VARCHAR (UNIQUE) | Login email |
| `password_hash` | VARCHAR | bcrypt hashed password |
| `name` | VARCHAR | Display name |
| `role` | VARCHAR | `'client'` \| `'advisor'` |
| `onboarding_complete` | BOOLEAN | Set `true` after onboarding wizard |
| `segment` | VARCHAR | `'Mass Market'` \| `'Mass Affluent'` \| `'HNI'` \| `'UHNWI'` |

#### `client_profiles` — Financial Profile
| Column | Type | Description |
|:---|:---|:---|
| `user_id` | UUID (PK, FK) | Linked user |
| `age` | INT | Computed from DOB |
| `risk_profile` | VARCHAR | Conservative → Aggressive |
| `display_currency` | VARCHAR | `'INR'` \| `'USD'` |

#### `goals` — Financial Goals
| Column | Type | Description |
|:---|:---|:---|
| `id` | UUID (PK) | Goal identifier |
| `user_id` | UUID (FK) | Owning user |
| `name` | VARCHAR | Goal name |
| `category` | VARCHAR | GoalCategory enum |
| `priority` | VARCHAR | High / Medium / Low |
| `target_amount` | DECIMAL(14,2) | Present-value target |
| `target_year` | INT | Target completion year |
| `already_saved` | DECIMAL(14,2) | Earmarked assets |
| `monthly_contribution` | DECIMAL(14,2) | Monthly savings toward goal |
| `shortfall` | DECIMAL(14,2) | Computed inflation-adjusted shortfall |
| `created_at` | TIMESTAMP | Auto-set |
| `updated_at` | TIMESTAMP | Auto-updated |

#### `holdings` — Asset Holdings
| Column | Type | Description |
|:---|:---|:---|
| `id` | UUID (PK) | Holding identifier |
| `account_id` | UUID (FK) | Linked account |
| `user_id` | UUID (FK) | Owning user |
| `name` | VARCHAR | Asset name |
| `category` | VARCHAR | Cash, Stocks, Mutual Funds, Gold, etc. |
| `current_value` | DECIMAL(14,2) | Current market value |
| `is_liquid` | BOOLEAN | Eligible for emergency fund |

---

## 7. API Documentation

### Base URL: `/api/v1`

---

### 7.1 Auth APIs

#### `POST /auth/register`
| Field | Details |
|:---|:---|
| **Body** | `{ email: string, password: string, name: string }` |
| **Success** | `201` → `{ id, name, role, onboarding_complete, segment, token }` |
| **Errors** | `409` User already exists |

#### `POST /auth/login`
| Field | Details |
|:---|:---|
| **Body** | `{ email: string, password: string }` |
| **Success** | `200` → `{ id, name, role, onboarding_complete, segment, display_currency, token }` |
| **Errors** | `401` Invalid credentials |

#### `PATCH /users/:userId/preferences`
| Field | Details |
|:---|:---|
| **Body** | `{ display_currency: 'INR' | 'USD' }` |
| **Success** | `200` → `{ display_currency }` |

---

### 7.2 Onboarding APIs

#### `GET /risk-questions`
- **Returns:** Array of 12 risk questionnaire questions with options and scores

#### `POST /users/:userId/wealth-discovery`
- **Body:** Complete 8-step wizard payload (household, income, accounts, liabilities, goals, risk_answers, insurance, consent)
- **Returns:** `{ success: true, segment, whs, recommendations }` — triggers full WHS calculation and recommendation generation

---

### 7.3 Dashboard APIs

#### `GET /users/:userId/wealth-health-score`
- **Returns:** WHS snapshot with per-pillar scores, net worth, savings rate, emergency fund months, debt ratio, disclaimer

#### `GET /users/:userId/net-worth`
- **Returns:** Array of `{ date: 'YYYY-MM-DD', net_worth: number }` for last 6 months

#### `GET /users/:userId/recommendations`
- **Returns:** Array of `RecommendationAlert` objects

#### `PATCH /users/:userId/recommendations/:recId`
- **Body:** `{ status: 'Dismissed' | 'Snoozed' | 'Addressed' }`
- **Returns:** Updated recommendation object

---

### 7.4 Goals APIs

#### `GET /users/:userId/goals`
- **Returns:** `Goal[]`

#### `POST /users/:userId/goals`
- **Body:**
```json
{
  "name": "Children Higher Education Fund",
  "category": "Education",
  "priority": "High",
  "target_amount": 3500000,
  "target_year": 2034,
  "already_saved": 350000,
  "monthly_contribution": 12000
}
```
- **Returns:** Created `Goal` object with computed `shortfall`

#### `DELETE /users/:userId/goals/:goalId`
- **Returns:** `{ success: true }`

#### `GET /users/:userId/goals/:goalId/options`
- **Returns:** Edelman solver options: `{ option_a_required_monthly_savings, option_b_supported_present_cost, option_c_delay_months, shortfall }`

#### `GET /users/:userId/goals/:goalId/coach`
- **Returns:** `{ goalId, reply, suggestedFollowUps, diagnostics }` — AI Goal Coach narrative

---

### 7.5 Portfolio APIs

#### `GET /users/:userId/portfolio/summary`
- **Returns:** Total value, net worth, by_asset_class array, by_institution array, risk_profile

#### `GET /users/:userId/portfolio/performance`
- **Returns:** TWR, annualized return, benchmark return, Sharpe ratio, Beta, Alpha, volatility, monthly_chart data

#### `GET /users/:userId/portfolio/allocation`
- **Returns:** Target vs actual allocation per risk profile, drift per asset class

#### `GET /users/:userId/portfolio/rebalancing`
- **Returns:** Array of rebalancing alerts with sell/buy recommendations

---

### 7.6 AI APIs

#### `POST /users/:userId/ai/chat`
- **Body:** `{ message: string, chatHistory: ChatMessageTurn[], clientContext: ClientFinancialContext }`
- **Returns:** `{ reply, suggestedFollowUps, diagnostics: { confidenceScore, intent, latencyMs } }`

#### `GET /users/:userId/goals/:goalId/coach`
- **Returns:** `{ goalId, reply, suggestedFollowUps, diagnostics }`

#### `GET /users/:userId/retirement-coach`
- **Returns:** `{ userId, reply, suggestedFollowUps, diagnostics }`

#### `GET /users/:userId/recommendations/:recId/explain`
- **Returns:** `{ recId, reply, suggestedFollowUps, diagnostics }`

---

## 8. Application Workflow

### 8.1 New User Onboarding Workflow

```mermaid
flowchart TD
    A["User visits /register"] --> B["Fills email, password, name"]
    B --> C["POST /auth/register"]
    C --> D["User created in DB + JWT issued"]
    D --> E["Redirected to /onboarding"]
    E --> F["Step 1: Personal & Family"]
    F --> G["Step 2: Income Profile"]
    G --> H["Step 3: Assets & Holdings"]
    H --> I["Step 4: Liabilities"]
    I --> J["Step 5: Financial Goals"]
    J --> K["Step 6: Risk Profiling (12 Qs)"]
    K --> L["Step 7: Insurance"]
    L --> M["Step 8: Consent & Advisory Disclaimer"]
    M --> N["POST /wealth-discovery"]
    N --> O["Service layer processes all 8 steps"]
    O --> P["Math Engine computes shortfalls, WHS, segment"]
    P --> Q["Recommendations generated from rules engine"]
    Q --> R["Redirected to /dashboard"]
    R --> S["Dashboard loads all data in parallel"]
```

---

### 8.2 Goal Creation & Shortfall Analysis Workflow

```mermaid
flowchart TD
    A["User clicks '+ Add New Goal'"] --> B["Add New Goal Modal opens"]
    B --> C["User fills: Name, Category, Priority, Amount, Year, Saved, Monthly"]
    C --> D["POST /users/:userId/goals"]
    D --> E["Service: Fetch user Assumptions"]
    E --> F["Compute futureCost = targetAmount × (1+inflation)^years"]
    F --> G["Compute fvAssets + fvSavings using FV formulas"]
    G --> H["shortfall = max(0, futureCost − fvAssets − fvSavings)"]
    H --> I["Persist Goal to DB with shortfall"]
    I --> J["React state updates: goal card appears"]
    J --> K{shortfall > 0?}
    K -- Yes --> L["Async: GET /goals/:goalId/options → Option A/B/C"]
    K -- Yes --> M["Async: GET /goals/:goalId/coach → AI narrative"]
    K -- No --> N["Goal shown as 'Fully Funded'"]
    L --> O["Edelman Solver cards rendered on card"]
    M --> P["AI Goal Coach section rendered on card"]
```

---

### 8.3 AI Chat Conversation Workflow

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant FE as AIChatWidget
    participant STORE as useAppStore
    participant API as Express API
    participant PIPE as AI Pipeline

    U->>FE: Types message & hits Send
    FE->>STORE: sendChatMessage(message)
    STORE->>STORE: Optimistic update: append user turn
    STORE->>API: POST /users/:userId/ai/chat
    Note over API,PIPE: purpose='chat', query=message, chatHistory=last 4 turns
    API->>PIPE: aiPipeline.execute(request)
    PIPE->>PIPE: Stage 1-5: Purpose, Intent, Context, Validate, Retrieval
    PIPE->>PIPE: Check AI cache (10 min TTL)
    PIPE->>PIPE: ragEngine.semanticSearch(query)
    PIPE->>PIPE: Stage 6: Confidence check
    PIPE->>PIPE: Stage 7: Build prompt with context + retrieved chunks
    PIPE->>PIPE: Stage 8: Gemini API synthesis (2 retries)
    PIPE->>PIPE: Stage 9: Clean output
    PIPE->>PIPE: Stage 10: Log telemetry
    PIPE-->>API: { reply, suggestedFollowUps, diagnostics }
    API-->>STORE: JSON response
    STORE->>STORE: Append AI turn to chatHistory
    STORE->>FE: Re-render with new message + follow-ups
```

---

### 8.4 Wealth Health Score Calculation Workflow

```mermaid
flowchart TD
    A["GET /users/:userId/wealth-health-score"] --> B["Fetch ClientProfile, IncomeProfile, Holdings, Liabilities, Goals, Insurance, Assumptions"]
    B --> C["Compute: liquidCash (sum is_liquid holdings)"]
    C --> D["Compute: totalAssets, totalDebt, highInterestDebt"]
    D --> E["Compute: monthlyNetIncome, monthlySavings, savingsRate"]
    E --> F["calculateEmergencyFundTarget(monthlyExpenses, volatility, hasDependents)"]
    F --> G["Find retirement goal → calculateRetirementReadinessRatio"]
    G --> H["Compute goalFundingRatio = goalsOnTrack / totalGoals"]
    H --> I["calculateWHS(inputs) → 7 pillar scores + raw score"]
    I --> J["getWHSCategory(score) → VULNERABLE/CAUTION/HEALTHY/EXCELLENT"]
    J --> K["Return WHSSnapshot JSON + 7 per-pillar percentages"]
```

---

## 9. AI Request Flow

Every AI request travels through 10 distinct stages:

```
User (Frontend)
       │
       ▼
POST /api/v1/users/:userId/ai/chat
       │
       ▼
Express Controller (controllers/index.ts)
  ↳ Extracts: userId, message, chatHistory, clientContext
       │
       ▼
Service Layer (services/index.ts#postAIChat)
  ↳ Assembles AIPipelineRequest
       │
       ▼
Stage 1 — Purpose Detection (pipeline.ts)
  ↳ Maps purpose string to AI_MODULE_REGISTRY entry
  ↳ Returns: AIModuleDefinition (retrieval, prompt, formatter)
       │
       ▼
Stage 2 — Intent Classification (validator.ts)
  ↳ Analyzes query for: why/reason → Diagnose, how/improve → Optimize,
    compare/vs → Compare, future/project → Predict
  ↳ Returns: AIRequestIntent
       │
       ▼
Stage 3 — Unified Context Builder (context/builder.ts)
  ↳ Assembles UnifiedAIContext:
    { userId, clientProfile, selectedGoal, selectedRecommendation,
      chatHistory (last 4 turns for chat only), currentPage }
       │
       ▼
Stage 4 — Input Validation (validator.ts#validateInput)
  ↳ Checks: userId present, query non-empty for chat,
    goalData present for goal-analysis
  ↳ Throws error if invalid → 400 Bad Request
       │
       ▼
Stage 5 — Retrieval Strategy (registry.ts#getRetrievalStrategy)
  ↳ Module builds: { searchQuery, categoryFilter }
  ↳ Examples: "goal shortfall risk mathematical options" + filter:"Goal"
       │
Stage 5b — Cache Inspection (cache.ts)
  ↳ Key = `{query_lowercase}_{categoryFilter}`
  ↳ TTL = 10 minutes
  ↳ Cache HIT → skip to Stage 6
  ↳ Cache MISS → execute retrieval
       │
       ▼
RAG Engine Semantic Search (engine.ts#semanticSearch)
  ↳ Loads rag_knowledge.json (~600+ chunks)
  ↳ TF-IDF + keyword density scoring
  ↳ Category pre-filtering (if filter specified)
  ↳ Top-K chunks returned with confidenceScore
  ↳ Result cached for 10 min
       │
       ▼
Stage 6 — Confidence Validation (validator.ts#validateConfidence)
  ↳ If confidenceScore < 0.25 AND purpose='chat':
    → Return low-confidence fallback message immediately
  ↳ Else: proceed to prompt building
       │
       ▼
Stage 7 — Modular Prompt Builder (prompts/{purpose}.ts)
  ↳ Assembles: systemPrompt + fullPrompt
  ↳ Injects: retrieved chunks, unified context, response constraints
  ↳ Format: "You are Weallth AI... [Context] ... [User's situation] ... [Task]"
       │
       ▼
Stage 8 — LLM Synthesis (engine.ts#synthesizeCustomPrompt)
  ↳ Calls: Google Gemini API (gemini-1.5-flash)
  ↳ Input: fullPrompt string
  ↳ Up to 2 retries if validation fails

Stage 8b — Response Validation (validator.ts#validateGeneratedResponse)
  ↳ Minimum length check (> 20 chars)
  ↳ Contradiction check vs user context
  ↳ If fails → retry LLM or use fallback generator
       │
       ▼
Stage 9 — Output Cleaning (cleaner.ts#cleanAIResponseOutput)
  ↳ For non-chat modules: strips **asterisks** (bold markdown)
  ↳ Normalizes whitespace
  ↳ Removes trailing empty bullets

Stage 9b — Modular Response Formatter (formatters/{purpose}.ts)
  ↳ Wraps output in purpose-specific JSON schema
  ↳ Adds: goalId/recId reference, suggestedFollowUps, diagnostics
       │
       ▼
Stage 10 — Observability & Telemetry (analytics.ts)
  ↳ Logs: AITelemetryRecord to in-memory store (last 500)
  ↳ Emits: Structured JSON console log with all metrics
       │
       ▼
AIPipelineResult returned to Controller
  ↳ { purpose, intent, formattedOutput, diagnostics }
       │
       ▼
HTTP Response → Frontend
  ↳ { reply, suggestedFollowUps, diagnostics: { confidenceScore, latencyMs } }
       │
       ▼
Zustand Store
  ↳ Appends AI turn to chatHistory
  ↳ Re-renders AIChatWidget
```

---

## 10. Implementation Status

### ✅ Fully Implemented & Verified

| Feature | Status | Notes |
|:---|:---|:---|
| JWT Authentication (Register/Login) | ✅ Complete | bcrypt hashing, 7-day tokens |
| 8-Step Wealth Discovery Wizard | ✅ Complete | Full financial profile capture |
| Wealth Health Score Engine (7 Pillars) | ✅ Complete | Formulas per Edelman spec |
| Edelman 3-Option Goal Solver | ✅ Complete | Option A/B/C math verified |
| Goal CRUD (Add/Edit/Delete) | ✅ Complete | ⋮ Menu, modals, API wired |
| Recommendation Engine (10+ rules) | ✅ Complete | Rule-based alert generation |
| AI Goal Coach (RAG) | ✅ Complete | Per-goal RAG narrative |
| AI Priority Analysis (RAG) | ✅ Complete | Per-recommendation RAG analysis |
| AI Retirement Coach (RAG) | ✅ Complete | Withdrawal sequencing analysis |
| AI Chat Widget (RAG) | ✅ Complete | Multi-turn, intent-classified |
| Portfolio Summary | ✅ Complete | Asset class breakdown |
| Portfolio Performance (TWR/Sharpe/Alpha) | ✅ Complete | Simulated; pending live feeds |
| Asset Allocation & Drift Detection | ✅ Complete | Risk-profile target allocations |
| Rebalancing Alerts | ✅ Complete | Drift threshold alerts |
| Multi-Currency (INR/USD) | ✅ Complete | Persisted per user |
| AI Cache Layer | ✅ Complete | 10-min TTL in-memory cache |
| AI Telemetry / Analytics | ✅ Complete | 500-record rolling log |
| Confidence Guardrails | ✅ Complete | Low-confidence fallback |
| Hallucination Contradiction Check | ✅ Complete | Context vs response validation |
| Golden Test Suite (10 cases) | ✅ Complete | Precision@K, MRR, Hit Rate |
| PostgreSQL / Prisma Database | ✅ Complete | All 15 Prisma models |
| File-Backed JSON Fallback | ✅ Complete | Automatic when Postgres offline |
| TypeScript 0-error compilation | ✅ Complete | Frontend + Backend verified |

---

### ⚠️ Known Limitations

| Limitation | Impact | Mitigation |
|:---|:---|:---|
| Portfolio performance is **simulated** (not live custodian feed) | Performance metrics are advisory illustrations | Disclaimer shown; Plaid integration planned |
| Estate planning WHS pillar uses **static false** (no estate doc inputs in UI) | Estate pillar always scores 0 | Estate planning UI planned in Phase 4 |
| Emergency fund target uses **estimated expenses** (70% of net income) | May not reflect actual household spending | Cash flow module planned in Phase 3 |
| AI cache is **in-memory** only | Cache cleared on server restart | Redis integration planned |
| `data.json` fallback has **no concurrent write safety** | Risk of data corruption under concurrent requests | PostgreSQL is primary; fallback for single-user dev only |

---

### 🔧 Technical Debt

| Debt Item | Priority | Details |
|:---|:---|:---|
| `password_hash` stored as plain text prototype comment in types | High | bcrypt is correctly used; misleading comment in type definition |
| Portfolio performance uses `getMockMonthlyReturns(seed)` | Medium | Replace with real market data API |
| WHS snapshot not persisted to `whs_history` table after onboarding | Medium | History pipeline incomplete |
| Advisor portal (client management, consent, compliance logs) | Medium | Controller stubs exist; UI not built |

---

## 11. Security

### 11.1 Authentication & Authorization

- **JWT Tokens:** Signed with `JWT_SECRET` (env var), 7-day expiry
- **Password Hashing:** `bcryptjs` with 10 salt rounds
- **RBAC:** `role: 'client' | 'advisor'` in JWT payload; advisor endpoints verified by role
- **Token Storage:** `localStorage` via Zustand `persist` middleware (client-side only)
- **Authorization Header:** `Bearer {token}` on protected API calls

### 11.2 Data Protection

- All financial data scoped to `userId` in every query — no cross-user data leakage possible
- Prisma ORM parameterized queries — SQL injection prevention
- `DATABASE_URL` and `GEMINI_API_KEY` stored exclusively in `.env` files (gitignored)

### 11.3 Environment Variables

| Variable | Location | Purpose |
|:---|:---|:---|
| `DATABASE_URL` | `app/backend/.env` | PostgreSQL connection string |
| `JWT_SECRET` | `app/backend/.env` | JWT signing key |
| `PORT` | `app/backend/.env` | Backend server port (3001) |
| `GEMINI_API_KEY` | `app/backend/.env` | Google Gemini API key |

### 11.4 API Security

- All AI endpoints require `userId` path parameter — no anonymous AI calls
- Input validation via `validateInput()` before AI pipeline execution
- Response cleaning removes any injected markdown that could trigger XSS in rich text rendering

---

## 12. Performance & Optimization

### 12.1 AI Latency Optimization

| Optimization | Mechanism | Impact |
|:---|:---|:---|
| **Retrieval Caching** | `AICacheManager` — 10-min TTL in-memory cache keyed by `{query}_{filter}` | Eliminates repeated document searches |
| **Pre-filtered Retrieval** | Category filters (`"Goal"`, `"Retirement"`, etc.) reduce chunk set before scoring | ~70% fewer chunks to score |
| **Async AI Calls** | Goal options + AI coach fetched in parallel after goal creation | No blocking on goal card render |
| **Optimistic UI Updates** | Chat user message shown immediately before AI response arrives | Instant UX feedback |
| **Fallback Generators** | Local deterministic fallbacks execute in < 1ms if LLM fails | Zero-latency recovery |

### 12.2 Frontend Performance

- **Parallel API calls:** `Promise.all()` in `fetchDashboardData()` fetches WHS, goals, recommendations, and net-worth simultaneously
- **Zustand `persist`:** Only `user` (auth token) persisted to localStorage — minimal storage footprint
- **Vite code splitting:** Pages lazy-loaded; no unnecessary JavaScript on initial paint

### 12.3 Database Performance

- All queries filtered by `userId` (indexed FK) — no full-table scans
- Prisma Decimal type for all financial figures — no floating-point precision loss
- Connection pooling via Prisma Client (single instance pattern)

---

## 13. Deployment & Environment Setup

### 13.1 Prerequisites

```bash
# Required software
Node.js >= 18.0.0
npm >= 9.0.0
Docker Desktop (for PostgreSQL)
Git
```

### 13.2 Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/AbhayBhise/Personal-Wealth-Management-Module--Weallth.git
cd Personal-Wealth-Management-Module--Weallth

# 2. Start PostgreSQL via Docker
cd app/backend
# Ensure docker-compose.yml exists, then:
/Applications/Docker.app/Contents/Resources/bin/docker start backend-db-1
# Or: docker compose up -d (first time)

# 3. Configure backend environment
cp .env.example .env
# Edit .env:
#   DATABASE_URL="postgresql://postgres:dev@localhost:5432/weallth?schema=public"
#   JWT_SECRET="your-secret-key"
#   PORT=3001
#   GEMINI_API_KEY="your-gemini-api-key"

# 4. Install backend dependencies & run migrations
npm install
npx prisma migrate deploy    # Apply DB migrations
npx prisma generate          # Generate Prisma Client
npm run dev                  # Start backend on :3001

# 5. Install frontend dependencies (new terminal)
cd ../frontend
npm install
npm run dev                  # Start frontend on :5173

# ✅ App accessible at http://localhost:5173
```

### 13.3 Environment Variables Reference

```env
# app/backend/.env
DATABASE_URL="postgresql://postgres:dev@localhost:5432/weallth?schema=public"
JWT_SECRET="weallth-development-secret-key-2026"
PORT=3001
GEMINI_API_KEY="your-google-gemini-api-key"
```

### 13.4 Docker PostgreSQL Management

```bash
DOCKER="/Applications/Docker.app/Contents/Resources/bin/docker"

# List all containers
$DOCKER ps -a

# Start Postgres container
$DOCKER start backend-db-1

# Check running containers
$DOCKER ps

# First-time setup (if container doesn't exist)
$DOCKER run --name backend-db-1 \
  -e POSTGRES_PASSWORD=dev \
  -e POSTGRES_DB=weallth \
  -p 5432:5432 \
  -d pgvector/pgvector:pg16
```

### 13.5 TypeScript Verification

```bash
# Verify zero TypeScript errors
cd app/frontend && npx tsc --noEmit
cd app/backend  && npx tsc --noEmit
```

---

## 14. Testing & Evaluation

### 14.1 TypeScript Compilation Check

```bash
npx tsc --noEmit   # Must return 0 errors
```

Current status: **✅ 0 errors** on both frontend and backend.

### 14.2 RAG Golden Test Suite

Defined in [`evaluation.ts#GOLDEN_TEST_CASES`](file:///Users/shravanmole/Documents/Personal-Wealth-Management-Module--Weallth/app/backend/src/services/rag/evaluation.ts).

**Evaluation Metrics:**

| Metric | Formula | Pass Threshold |
|:---|:---|:---|
| Precision@K | `hitCount / K` | > 0 |
| Recall@K | `min(1.0, hitCount / 2)` | ≥ 0.5 |
| Hit Rate | `1 if hitCount > 0 else 0` | > 0 |
| MRR | `1 / firstHitRank` | > 0 |
| Latency | End-to-end retrieval time | < 2500ms |

### 14.3 Manual Testing Checklist

1. ☑ Register new user → verify redirect to /onboarding
2. ☑ Complete all 8 wizard steps → verify redirect to /dashboard with WHS score
3. ☑ Add new goal → verify Edelman solver options appear
4. ☑ Edit goal → verify card updates with new values
5. ☑ Delete goal → verify card disappears
6. ☑ Send chat message → verify AI response with follow-ups
7. ☑ Switch currency INR ↔ USD → verify all monetary values reformat
8. ☑ Dismiss recommendation alert → verify card removed
9. ☑ Close Docker → verify app still works (JSON fallback)
10. ☑ Restart Docker → verify Postgres data restored

---

## 15. Future Roadmap

### Phase 3 — Q3–Q4 2026

| Feature | Details |
|:---|:---|
| **Live Bank Aggregation** | Plaid / Yodlee API integration for automatic account linking and real-time holding sync |
| **Cash Flow & Budgeting Module** | Income vs. expense tracking, 50/30/20 budget analysis, spending category breakdown |
| **Debt Management Dashboard** | Visual debt avalanche timeline, interest saved calculator, payoff date projections |
| **Tax-Efficient Withdrawal Sequencing** | Taxable → Tax-Deferred → Tax-Free drawdown optimizer for retirement |
| **Estate Planning UI** | Will, POA, HC Proxy checklist module wired to WHS Estate Pillar |

### Phase 4 — Q1 2027

| Feature | Details |
|:---|:---|
| **Advisor Portal** | Full client management UI, consent workflows, suitability log viewer |
| **Multi-Agent AI Orchestration** | Autonomous subagents for goal optimization, rebalancing execution, and insurance gap analysis |
| **AI Performance** | Redis-backed retrieval cache replacing in-memory store; persistent AI context across sessions |
| **Tax-Loss Harvesting Engine** | Automated capital gains offset identification and alert generation |
| **Mobile App (React Native)** | Cross-platform iOS/Android PWM application |

### AI Improvements

| Improvement | Details |
|:---|:---|
| **Hybrid Vector Search** | Add `pgvector` embeddings (OpenAI `text-embedding-3-small`) alongside TF-IDF for semantic similarity |
| **Streaming Responses** | Server-Sent Events (SSE) for real-time token streaming in chat widget |
| **Long-Term Memory** | Persistent user conversation history stored in `ConversationLog` table |
| **Multi-LLM Failover** | Fallback chain: Gemini → Claude → GPT-4o for high-availability AI |
| **Fine-tuned Domain Model** | Custom fine-tune on Edelman wealth methodology corpus for higher precision |

---

*This document is the single source of truth for the Weallth PWM project. Update this file after every significant feature addition or architectural change.*
