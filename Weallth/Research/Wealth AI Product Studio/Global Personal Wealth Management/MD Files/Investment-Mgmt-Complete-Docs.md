# INVESTMENT MANAGEMENT MODULE - COMPLETE DOCUMENTATION SET
## Global Wealth Management Platform

**Module:** Investment Management  
**Version:** 1.0  
**Date:** January 2026  
**Status:** Ready for Implementation

---

## DOCUMENT 1: PRODUCT REQUIREMENT DOCUMENT (PRD)

### 1.1 Executive Summary

The Investment Management Module is the cornerstone of the Global Wealth Management Platform, providing comprehensive portfolio management, real-time analytics, automated rebalancing, and AI-powered investment recommendations across multiple asset classes globally.

**Market Opportunity:** $2.1B (38% of total $5.5B wealth management platform market)  
**Target Users:** 
- High-net-worth individuals (HNI) - $1M+ AUM
- Ultra-high-net-worth individuals (UHNW) - $10M+ AUM
- Financial advisors (2-500 clients each)
- Investment portfolio managers

### 1.2 Product Vision

*"Enable sophisticated investors and advisors to build, monitor, and optimize diversified portfolios across 12 asset classes globally, with institutional-grade analytics and automated portfolio management at any wealth level."*

### 1.3 User Personas

**Persona 1: Sarah Chen, HNI Individual Investor**
- Age: 45, Senior Techexec
- AUM: $2.5M across 8 accounts
- Pain Points: Portfolio fragmentation, tax inefficiency, manual rebalancing
- Goals: 5% annual growth, retire in 15 years
- Tech Savviness: High
- Frequency: Check portfolio weekly

**Persona 2: Michael Rodriguez, Financial Advisor**
- Age: 38, Independent RIA
- Manages: 180 clients, $450M AUM
- Pain Points: Manual portfolio construction, spreadsheet-based reporting, compliance burden
- Goals: Grow AUM 20% annually, improve advisor productivity 30%
- Tech Savviness: Medium-High
- Frequency: Use daily for client management

**Persona 3: Rajesh Patel, UHNW Global Citizen**
- Age: 52, Entrepreneur/Investor
- AUM: $25M+ across 12 countries
- Pain Points: Currency complexity, tax coordination, private assets integration
- Goals: Wealth preservation, ESG alignment, tax efficiency
- Tech Savviness: Medium
- Frequency: Check portfolio quarterly, coordinate with advisors monthly

### 1.4 Core Features (MoSCoW Prioritization)

#### MUST HAVE (MVP - Phase 1)
1. **Multi-Account Portfolio Aggregation**
   - Consolidate accounts across custodians
   - Real-time balance synchronization
   - Account linking & reconciliation
   - Role-based access for advisors

2. **Asset Allocation & Tracking**
   - 12 asset class coverage (Equities, Fixed Income, Cash, Real Estate, Commodities, Crypto, Alternatives, Precious Metals, Collectibles, Private Equity, Hedge Funds, Insurance Products)
   - Current allocation dashboard
   - Target allocation configuration
   - Drift monitoring & alerts

3. **Performance Analytics**
   - Time-weighted return (TWR)
   - Money-weighted return (MWR)
   - Benchmark comparison
   - Performance attribution
   - Peer percentile ranking

4. **Real-time Portfolio Dashboard**
   - Current market value
   - Asset allocation pie charts
   - Top holdings view
   - Performance summary (YTD, 1Y, 3Y, 5Y, 10Y)
   - Risk metrics (volatility, Sharpe ratio, Beta)

5. **Reporting & Export**
   - Pre-built report templates
   - Customizable reports
   - PDF generation
   - Email scheduling
   - Advisor-ready presentations

#### SHOULD HAVE (Phase 2)
1. **Automated Rebalancing Engine**
   - Threshold-based triggers
   - Time-based scheduling
   - Tax-aware rebalancing
   - Multi-account rebalancing
   - Dry-run simulation before execution

2. **Tax Optimization Module**
   - Tax-loss harvesting identification
   - Capital gains forecasting
   - Tax-efficient fund selection
   - Dividend harvesting opportunities
   - Tax impact reporting

3. **Advanced Portfolio Analytics**
   - Factor exposure analysis (Market, Size, Value, Momentum, Quality, Volatility)
   - Scenario analysis & stress testing
   - Monte Carlo simulations
   - Correlation matrix
   - Efficient frontier visualization

4. **AI-Powered Recommendations**
   - Portfolio rebalancing suggestions
   - Fund replacement recommendations
   - Asset class reallocation suggestions
   - Risk reduction opportunities
   - Opportunity score for each recommendation

#### COULD HAVE (Phase 3)
1. **Alternative Asset Integration**
   - Private equity holdings
   - Hedge fund integration
   - Real estate property management
   - Business ownership tracking
   - Direct lending investments

2. **Global Portfolio Management**
   - Multi-currency support (50+ currencies)
   - FX hedging strategies
   - International tax implications
   - FATCA/FBAR compliance tracking
   - Geo-distribution dashboard

3. **Behavioral Finance Tools**
   - Investor risk profile assessment
   - Behavioral warnings & notifications
   - Market sentiment indicators
   - Emotional investment coaching
   - Concentration risk alerts

#### WON'T HAVE (Phase 4+)
- Direct trading execution (use custodian platforms)
- Real estate valuation engines (integrate with third-party services)
- Cryptocurrency exchange integration (use APIs)

### 1.5 Success Metrics & KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Adoption** |
| DAU (Daily Active Users) | 40% of registered | Google Analytics |
| Portfolio consolidation rate | 85% of users | Database query |
| Feature usage breadth | 7+ features/month | Product analytics |
| **Engagement** |
| Average session duration | 12+ minutes | Session tracking |
| Monthly report generation | 60% of advisors | Feature tracking |
| Rebalancing execution rate | 75% execution | Transaction log |
| **Business** |
| AUM tracked on platform | $50B+ (Year 2) | Portfolio database |
| Advisor productivity gain | 25% time savings | Time tracking study |
| Fee revenue / user | $150-300 annually | Financial model |
| **Quality** |
| Portfolio data accuracy | 99.9% match with custodians | Daily reconciliation |
| API response time p95 | <200ms | Monitoring |
| System uptime | 99.95% | Availability tracking |
| NPS score | 50+ | Quarterly survey |

### 1.6 Competitive Analysis

| Competitor | Strengths | Weaknesses | Our Differentiator |
|-------------|-----------|-----------|-------------------|
| **Schwab PortfolioCenter** | Large custodian base, 20+ years | UI dated, limited AI | Modern UX, predictive AI |
| **Black Diamond** | Strong advisor tools, $7.5T tracked | Complex onboarding | Simpler workflow |
| **Wealth.com** | Clean UI, mobile-first | Limited reporting | Advanced analytics |
| **Morningstar Advisor Workstation** | Best research, fund data | Expensive, advisor-only | Client + advisor UX |
| **Finacle Wealth (HDFC)** | Multi-asset, enterprise-grade | India-focused, expensive | Global-first approach |

### 1.7 Regulatory Requirements

- **SEC:** Investment Adviser compliance (Form ADV Part 2), fiduciary duty documentation
- **FINRA:** Suitability rules, best execution verification, order routing disclosure
- **MiFID II (EU):** Cost transparency, inducements documentation, order execution quality
- **SEBI (India):** KYC requirements, suitability assessment, regular portfolio reviews
- **GDPR:** Data privacy, consent management for performance tracking
- **Basel III:** Capital adequacy calculations for institutional investors

### 1.8 Dependencies & Integrations

```
External Systems Required:
├─ Custodian APIs (Fidelity, Charles Schwab, Interactive Brokers, Zerodha)
├─ Market Data Providers (Bloomberg, FactSet, Refinitiv, Twelve Data)
├─ Benchmark Data (MSCI, Russell, S&P, FTSE)
├─ Credit Rating Services (Moody's, S&P, Fitch)
├─ Tax Software (Thomson Reuters ONESOURCE, Intacct)
├─ FX Data Provider (OpenExchange, OANDA, Bloomberg)
└─ ESG Data (MSCI ESG, Bloomberg ESG, Sustainalytics)

Internal Systems:
├─ Core CRM (for advisor management)
├─ KYC/AML Engine (for regulatory compliance)
├─ Notification System (for alerts & recommendations)
├─ Analytics Database (for data warehouse)
└─ Authentication System (OAuth 2.0)
```

### 1.9 Constraints & Assumptions

**Constraints:**
- Real-time data: Market close + 2 hours (not true real-time during trading hours)
- Custodian support: Start with top 5, expand to 20 by Year 2
- Asset class coverage: Start with 8, expand to 12 by Year 2
- Historical data: 5 years of performance data minimum

**Assumptions:**
- Users have custodian accounts already established
- Custodians will provide API access (negotiate separately)
- Market data costs: $20-50K monthly for institutional feeds
- User will not trade directly in platform (custodian execution only)

### 1.10 Rollout Strategy

| Phase | Timeline | Scope | Users |
|-------|----------|-------|-------|
| **Pilot** | Month 1-2 | Equities + Fixed Income only | 100 beta testers |
| **Beta** | Month 3-4 | Add cash, commodities | 1,000 users |
| **Limited GA** | Month 5-6 | Full 8 asset classes | 10,000 users |
| **General Availability** | Month 7+ | Includes automation, AI | Unlimited |

---

## DOCUMENT 2: DETAILED DESIGN DOCUMENT (DDD)

### 2.1 Information Architecture

```
Investment Management Module
├─ Dashboard
│  ├─ Portfolio Summary (top-level metrics)
│  ├─ Asset Allocation (pie chart)
│  ├─ Performance chart (time range selector)
│  ├─ Quick Actions (Add money, Rebalance, View recommendations)
│  └─ Alerts & Notifications
├─ Portfolio Management
│  ├─ Account Selector
│  ├─ Holdings List (sortable, filterable)
│  ├─ Holdings Detail (individual position view)
│  ├─ Add Holdings (manual entry for illiquid assets)
│  └─ Remove Holdings (delisting, sold)
├─ Analytics
│  ├─ Performance Attribution
│  ├─ Asset Class Analysis
│  ├─ Sector Breakdown
│  ├─ Geographic Exposure
│  ├─ Factor Analysis
│  ├─ Risk Metrics
│  └─ Scenario Analysis
├─ Rebalancing
│  ├─ Current vs Target
│  ├─ Rebalancing Suggestions
│  ├─ Simulation (dry-run)
│  ├─ Execute Rebalancing
│  └─ History
├─ Reporting
│  ├─ Report Builder
│  ├─ Pre-built Templates
│  ├─ Scheduled Reports
│  ├─ Export / Email
│  └─ Archive
├─ Recommendations
│  ├─ AI Recommendations Feed
│  ├─ Fund Replacement Analysis
│  ├─ Tax-Loss Harvesting
│  ├─ Rebalancing Suggestions
│  └─ Action History
└─ Settings
   ├─ Account Linking
   ├─ Custodian Configuration
   ├─ Goal Settings
   ├─ Risk Profile
   └─ Notification Preferences
```

### 2.2 Key User Flows

**Flow 1: Initial Portfolio Onboarding**
```
1. User authenticates
2. Account linking screen (custodian selection)
3. Enter custodian credentials / link via OAuth
4. System fetches account data (holdings, cash, performance)
5. Validation & reconciliation (2-24 hours)
6. Portfolio displays with historical data (if available)
7. Goal setting & risk profile questionnaire
8. Dashboard initialization complete
```

**Flow 2: Monitor Portfolio**
```
1. User opens dashboard
2. Real-time data fetch from cache (< 30 seconds old)
3. Display:
   - Current value & daily change
   - Asset allocation vs target
   - Top movers
   - Performance cards
4. Click to drill-down into holdings
5. View individual performance, sector exposure, holdings risk
```

**Flow 3: Rebalance Portfolio**
```
1. User clicks "Rebalance"
2. System calculates drift (current vs target allocation)
3. Display rebalancing suggestion with:
   - Current allocation (pie chart)
   - Target allocation (pie chart)
   - Proposed trades (buy/sell list)
   - Tax impact estimate
   - Transaction costs estimate
4. User reviews & modifies if needed
5. Click "Preview" to see simulation
6. Click "Execute" to send orders to custodian
7. Confirmation screen with trade ID
8. Monitor execution status
```

### 2.3 Wireframes (Key Screens)

**Screen 1: Dashboard**
```
┌─────────────────────────────────────────────────────────┐
│  Portfolio Dashboard                    [Account: John]  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Portfolio Value      Allocation      YTD Return         │
│  ┌──────────────┐     ┌──────────┐    ┌──────────────┐   │
│  │  $2,345,567  │     │          │    │  +8.42%      │   │
│  │  ↑ +$15,234  │     │ Pie      │    │  ↑ $180,234  │   │
│  │  +0.65%      │     │ Chart    │    │              │   │
│  └──────────────┘     └──────────┘    └──────────────┘   │
│                                                           │
│  Risk Metrics        Quick Actions                        │
│  ├─ Sharpe: 1.23  [+ Add Money] [⚖ Rebalance]          │
│  ├─ Beta: 0.89    [💡 Recommendations] [⚙ Analyze]      │
│  ├─ Volatility: 12.3%                                   │
│  └─ Correlation: 0.65                                   │
│                                                           │
│  Performance                                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Line chart showing 1Y performance    [1M|3M|YTD] │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  Alerts & Recommendations                                │
│  [⚠] Asset allocation drifted 5% from target             │
│  [💡] Tax-loss harvesting opportunity: Save $12,300      │
│  [🔔] Rebalancing suggestion: Buy emerging markets       │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**Screen 2: Holdings Detail**
```
┌─────────────────────────────────────────────────────────┐
│  Holding Detail: Apple Inc. (AAPL)                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Position Summary                                         │
│  ├─ Shares: 250                                          │
│  ├─ Price: $182.45                                       │
│  ├─ Value: $45,612.50                                    │
│  ├─ Cost Basis: $42,300                                  │
│  ├─ Gain/Loss: +$3,312.50 (+7.83%)                      │
│  └─ Allocation: 1.95% of portfolio                       │
│                                                           │
│  Performance                                              │
│  ├─ 1M: +3.2%     ├─ YTD: +18.5%                        │
│  ├─ 3M: +8.1%     ├─ 1Y: +25.3%                         │
│  └─ 6M: +12.4%    └─ 3Y: +35.7%                         │
│                                                           │
│  Analysis                                                 │
│  ├─ Beta: 1.15 (higher volatility than market)          │
│  ├─ Sector: Technology (25% of portfolio)               │
│  ├─ Concentration Risk: High (top 5 holding)            │
│  └─ Correlation to Portfolio: 0.92                       │
│                                                           │
│  Trading Options                                          │
│  [Sell 10%]  [Sell 25%]  [Sell All]  [Add More]         │
│                                                           │
│  Tax Implications                                         │
│  [🔴 High tax impact if sold]  [Tax-Loss Harvest]       │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 2.4 UI Components & Design System

**Color Palette:**
- Primary: Teal #2B7A78 (action buttons, active states)
- Success: Green #1B8C4D (positive performance, gains)
- Warning: Orange #E8A84A (drift alerts, caution)
- Danger: Red #E24B4B (significant losses, errors)
- Neutral: Gray #757575 (secondary text, dividers)
- Background: White #FFFFFF (light mode), #1E1E1E (dark mode)

**Typography:**
- Headlines: Montserrat Bold 24-32px
- Body: Inter Regular 14-16px
- Mono: JetBrains Mono 12-14px (for numbers)

**Spacing & Layout:**
- Base unit: 8px (multiples: 16px, 24px, 32px, 48px)
- Grid: 12-column responsive
- Breakpoints: 360px (mobile), 768px (tablet), 1024px (desktop), 1440px (widescreen)

### 2.5 Interaction Patterns

**Tooltips & Help:**
- Hover tooltip on metrics (Beta, Sharpe ratio, etc.)
- "?" icon for complex features
- Contextual help sidebar on first use

**Alerts & Notifications:**
- Toast notifications for actions (top-right, auto-dismiss after 5s)
- In-line alerts for validation errors
- Modal dialogs for critical confirmations

**Loading States:**
- Skeleton screens for data fetching
- Progress spinners for long operations (< 3 seconds)
- Disable buttons during submission

**Accessibility (WCAG 2.1 AA):**
- Tab navigation through all interactive elements
- Aria-labels for charts and non-text content
- Color contrast ratio 4.5:1 minimum
- Keyboard-accessible date pickers, dropdowns
- Screen reader compatible

---

## DOCUMENT 3: DETAILED FUNCTIONAL SPECIFICATION (DFS)

### 3.1 Portfolio Aggregation Engine

**Function: FetchPortfolioFromCustodian()**
```
Input:
  - Custodian ID (enum: FIDELITY, SCHWAB, IBKR, ZERODHA)
  - Account ID (string)
  - Custodian API credentials (encrypted)
  - Last sync timestamp (optional, for incremental sync)

Processing:
  1. Validate custodian authentication
  2. Fetch account holdings (positions, quantity, cost basis)
  3. Fetch cash balances (by currency)
  4. Fetch transaction history (last 24 hours for new items)
  5. Fetch account metadata (account type, inception date)
  6. Reconcile with local database
  7. Log all changes to audit trail

Output:
  - Portfolio object {
      accountId: string,
      holdings: [
        {
          securityId: string (ISIN),
          quantity: decimal,
          currentPrice: decimal,
          currentValue: decimal,
          costBasis: decimal,
          costPrice: decimal,
          acquiredDate: date,
          currency: string,
          assetClass: enum,
          unrealizedGain: decimal,
          unrealizedGainPercent: decimal
        }
      ],
      cash: {
        USD: decimal,
        EUR: decimal,
        ...
      },
      accountType: enum,
      lastSyncTime: timestamp,
      syncStatus: enum (SUCCESS, PARTIAL, FAILED)
    }

Validation Rules:
  - Quantity must be > 0 for holdings
  - Current value = quantity * current price
  - Date validation (acquired date <= current date)
  - Currency in [USD, EUR, GBP, JPY, INR, ...] (50+ supported)
  - Return audit log showing all changes

Error Handling:
  - If API connection fails: Return cached data + warning flag
  - If authentication expires: Trigger re-auth workflow
  - If partial data: Mark incomplete + retry in 1 hour
  - If data quality issues: Flag for manual review
```

### 3.2 Performance Calculation Engine

**Function: CalculateTimeWeightedReturn()**
```
Calculation Method: Modified Dietz (industry standard)
Input:
  - Holdings history [date, quantity, price, cash flow]
  - Benchmark for comparison

Formula:
  MWR = (Ending Value - Beginning Value - Net Cash Flow) 
        / (Beginning Value + Sum of weighted cash flows)
  
  Where weighted cash flow = cash flow * (days remaining / days in period)

Example:
  Beginning: $100,000
  Month 1 Day 10: Add $10,000
  Month 1 Day 20: Market value: $112,000
  Ending: $115,000
  
  Weight of $10,000 = 21 days / 30 days = 0.7
  
  MWR = ($115,000 - $100,000 - $10,000) / ($100,000 + $7,000)
      = $5,000 / $107,000
      = 4.67%

Return periods calculated:
  - 1 Month (last 30 days)
  - 3 Months (last 90 days)
  - YTD (Jan 1 to today)
  - 1 Year (last 365 days)
  - 3 Years (annualized)
  - 5 Years (annualized)
  - 10 Years (annualized)
  - Since Inception (account opening to today)

Benchmarking:
  - Compare to S&P 500, Russell 2000, MSCI World, FTSE All-Share, etc.
  - Calculate outperformance (alpha)
  - Display percentile rank (vs similar portfolios)

Output:
  - Returns by period with benchmark comparison
  - Attribution: Show which holdings drove performance
  - Risk-adjusted returns (Sharpe ratio, Sortino ratio)
```

### 3.3 Asset Allocation Calculation

**Function: CalculateAssetAllocation()**
```
Input:
  - Current portfolio (all holdings with values)
  - Asset class mapping (security ISIN → asset class)

Asset Classes (12 total):
  1. Equities - US (USA domestic stocks)
  2. Equities - International Developed (UK, EU, Japan, Australia)
  3. Equities - Emerging Markets (India, China, Brazil, Russia)
  4. Fixed Income - US Government (Treasuries)
  5. Fixed Income - US Corporate (Investment Grade & High Yield)
  6. Fixed Income - International (Sovereign & corporate outside US)
  7. Real Estate / REITs (Real estate investment trusts)
  8. Commodities (Gold, oil, agriculture, metals)
  9. Alternatives (Hedge funds, private equity, structured products)
  10. Precious Metals (Gold, silver, platinum)
  11. Cryptocurrency (Bitcoin, Ethereum, others)
  12. Cash & Cash Equivalents (Money market, short-term deposits)

Calculation:
  For each asset class:
    Total Value = Sum of all holdings in that class
    Allocation % = (Total Value / Portfolio Value) * 100
    
  Example output:
  {
    "Equities - US": 35.2%,
    "Equities - Intl Dev": 18.5%,
    "Fixed Income - US Gov": 20.1%,
    "Real Estate": 8.2%,
    "Commodities": 5.0%,
    "Cash": 13.0%
  }

Drift Calculation:
  For each asset class:
    Current % vs Target %
    Drift = Current % - Target %
    Status = "On Target" (< ±2%), "Underweight" (< -2%), "Overweight" (> 2%)
    
  Alert threshold: Drift > 3% triggers "Rebalance Recommended" alert

Output:
  - Current allocation (pie chart data)
  - Target allocation (pie chart data)
  - Drift analysis (heatmap)
  - Recommended rebalancing trades
```

### 3.4 Rebalancing Engine

**Function: GenerateRebalancingSuggestions()**
```
Input:
  - Current portfolio state
  - Target allocation percentages
  - Rebalancing parameters:
    - Threshold: Minimum drift to trigger suggestion (default 3%)
    - Tax impact weight: 0-1.0 scale (tax-aware vs performance-optimized)
    - Transaction cost threshold: Skip if cost > X basis points
    - Constraints: Asset classes to exclude from rebalancing

Processing:
  Step 1: Identify out-of-tolerance positions
    - For each asset class: if |drift| > threshold, flag for rebalancing
    
  Step 2: Generate trades
    - For overweight positions: Sell to bring to target
    - For underweight positions: Buy to bring to target
    - Match sells with buys to minimize cash drag
    
  Step 3: Calculate costs
    - For each proposed trade:
      - Commission: $0-50 per trade (by broker)
      - Bid-ask spread: 0.01%-0.5% (by security)
      - Impact cost: 0-1% (by size, liquidity)
      - Tax impact: Capital gains calculation
      
  Step 4: Optimize trades
    - Prioritize by total cost (minimizing transaction costs + tax)
    - Filter out marginal trades (cost > benefit)
    - Group trades by security to minimize commissions
    
  Step 5: Generate report
    - Show current vs target allocation
    - List all proposed trades with:
      - Security, quantity, direction, price
      - Estimated cost & tax impact
      - Post-trade allocation (preview)
      
Example output:
{
  "currentAllocation": {...},
  "targetAllocation": {...},
  "suggestedTrades": [
    {
      "action": "SELL",
      "security": "Apple Inc (AAPL)",
      "shares": 50,
      "estimatedPrice": 182.45,
      "estimatedValue": 9122.50,
      "estimatedCost": 15,
      "taxImpact": 2000 (capital gains),
      "reason": "Reduce overweight US Large Cap"
    },
    {
      "action": "BUY",
      "security": "Vanguard Total Intl Stock (VTIAX)",
      "shares": 47,
      "estimatedPrice": 195.30,
      "estimatedValue": 9179.10,
      "estimatedCost": 0,
      "taxImpact": 0,
      "reason": "Increase underweight International"
    }
  ],
  "summary": {
    "totalValue": 18301.60,
    "totalCost": 15,
    "totalTaxImpact": 2000,
    "netImpact": "1.1% of AUM",
    "postTradeAllocation": {...}
  }
}

Execution:
  - User reviews suggestions
  - System shows dry-run simulation
  - User confirms (or modifies individual trades)
  - System sends execution orders to custodian via API
  - Tracks execution status & reconciles filled quantity

Constraints:
  - Cannot execute during market hours (only at close or pre-market)
  - Minimum position size: $100 (avoid penny positions)
  - Maximum single trade: $500K (to avoid market impact)
  - Tax considerations: Avoid wash sales (30-day rule)
```

---

## DOCUMENT 4: DETAILED TECHNICAL SPECIFICATION (DTS)

### 4.1 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT TIER (Presentation)               │
├─────────────────────────────────────────────────────────────┤
│  Web App              Mobile App (iOS/Android)              │
│  (React 18+)          (React Native)                         │
│  Dashboard            Push Notifications                     │
│  Portfolio View       Alerts Management                      │
└─────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY TIER                          │
├─────────────────────────────────────────────────────────────┤
│  Kong / AWS API Gateway                                     │
│  ├─ Request routing & load balancing                       │
│  ├─ Rate limiting (100 req/sec per user)                   │
│  ├─ Authentication & authorization (OAuth 2.0)            │
│  └─ Request/response validation                           │
└─────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION TIER (Logic)                  │
├─────────────────────────────────────────────────────────────┤
│  Microservices (Docker containers on Kubernetes)           │
│  ├─ Portfolio Service (Node.js/Express)                   │
│  │  ├─ Fetch holdings                                      │
│  │  ├─ Calculate allocation                                │
│  │  └─ Manage accounts                                     │
│  ├─ Analytics Service (Python/FastAPI)                    │
│  │  ├─ Performance calculations                            │
│  │  ├─ Risk metrics                                        │
│  │  └─ Attribution analysis                                │
│  ├─ Rebalancing Service (Python/FastAPI)                  │
│  │  ├─ Generate suggestions                                │
│  │  ├─ Execute trades                                      │
│  │  └─ Track execution                                     │
│  ├─ Recommendation Service (Python + ML)                  │
│  │  ├─ AI models (TensorFlow)                             │
│  │  ├─ Portfolio optimization                              │
│  │  └─ Personalization                                     │
│  └─ Integration Service (Node.js)                         │
│     ├─ Custodian API connectors                           │
│     ├─ Market data fetching                                │
│     └─ Tax software integration                            │
└─────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATA TIER (Persistence)                  │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL (OLTP)       MongoDB (Documents)                │
│  ├─ User accounts        ├─ Market events                   │
│  ├─ Holdings & tx        ├─ User preferences                │
│  ├─ Transactions         └─ Audit logs                      │
│  └─ Settings                                                │
│                                                              │
│  Redis (Cache)           Snowflake (OLAP)                   │
│  ├─ Session cache        ├─ Aggregated data                │
│  ├─ Portfolio cache      ├─ Analytics queries               │
│  └─ Rate limiting        └─ BI dashboards                   │
│                                                              │
│  AWS S3 (Object Storage)                                    │
│  ├─ Document storage (PDFs, reports)                       │
│  └─ Audit trail backups                                    │
└─────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────┐
│              EXTERNAL INTEGRATIONS & DATA SOURCES            │
├─────────────────────────────────────────────────────────────┤
│  Custodian APIs          Market Data                         │
│  ├─ Fidelity             ├─ Bloomberg                        │
│  ├─ Schwab               ├─ FactSet                          │
│  ├─ IBKR                 ├─ Refinitiv                        │
│  ├─ Zerodha              └─ Twelve Data                      │
│  └─ ...20+ more                                             │
│                                                              │
│  Tax & Compliance        ESG & Research                      │
│  ├─ Thomson Reuters      ├─ MSCI ESG                        │
│  └─ Intacct              └─ Sustainalytics                  │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Database Design (Simplified ERD)

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  risk_profile ENUM ('Conservative', 'Moderate', 'Aggressive'),
  kyc_status ENUM ('Pending', 'Verified', 'Rejected'),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP (soft delete)
);

-- Accounts Table
CREATE TABLE accounts (
  id UUID PRIMARY KEY,
  user_id UUID FOREIGN KEY,
  account_name VARCHAR(255),
  custodian_id INTEGER,
  custodian_account_id VARCHAR(255),
  account_type ENUM ('Brokerage', 'IRA', '401k', 'HSA', 'Trust'),
  inception_date DATE,
  base_currency VARCHAR(3) DEFAULT 'USD',
  is_managed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Holdings Table
CREATE TABLE holdings (
  id UUID PRIMARY KEY,
  account_id UUID FOREIGN KEY,
  security_id VARCHAR(50) (ISIN/CUSIP),
  quantity DECIMAL(18,8),
  current_price DECIMAL(18,2),
  current_value DECIMAL(18,2),
  cost_basis DECIMAL(18,2),
  cost_price DECIMAL(18,2),
  acquired_date DATE,
  currency VARCHAR(3),
  asset_class_id INTEGER,
  last_updated TIMESTAMP,
  UNIQUE (account_id, security_id)
);

-- Transactions Table
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  account_id UUID FOREIGN KEY,
  security_id VARCHAR(50),
  tx_type ENUM ('BUY', 'SELL', 'DIVIDEND', 'SPLIT', 'DEPOSIT', 'WITHDRAWAL'),
  quantity DECIMAL(18,8),
  price DECIMAL(18,2),
  amount DECIMAL(18,2),
  fx_rate DECIMAL(18,6),
  commission DECIMAL(18,2),
  tx_date DATE,
  settlement_date DATE,
  created_at TIMESTAMP
);

-- Performance History Table
CREATE TABLE performance_history (
  id UUID PRIMARY KEY,
  account_id UUID FOREIGN KEY,
  date DATE,
  portfolio_value DECIMAL(18,2),
  daily_return DECIMAL(10,4),
  cumulative_return DECIMAL(10,4),
  ytd_return DECIMAL(10,4),
  created_at TIMESTAMP
);

-- Asset Allocation Snapshot
CREATE TABLE asset_allocation_snapshot (
  id UUID PRIMARY KEY,
  account_id UUID FOREIGN KEY,
  asset_class_id INTEGER,
  current_value DECIMAL(18,2),
  target_allocation_pct DECIMAL(5,2),
  actual_allocation_pct DECIMAL(5,2),
  drift_pct DECIMAL(5,2),
  created_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_user_accounts ON accounts(user_id);
CREATE INDEX idx_account_holdings ON holdings(account_id);
CREATE INDEX idx_account_transactions ON transactions(account_id);
CREATE INDEX idx_holding_security ON holdings(security_id);
CREATE INDEX idx_performance_date ON performance_history(account_id, date);
CREATE INDEX idx_allocation_date ON asset_allocation_snapshot(account_id, created_at);
```

### 4.3 API Specifications (OpenAPI 3.0)

```yaml
openapi: 3.0.0
info:
  title: Investment Management Module API
  version: 1.0.0
  description: Portfolio, holdings, performance, and rebalancing APIs

servers:
  - url: https://api.wealthmgmt.com/v1
    description: Production

paths:
  /portfolios/{user_id}:
    get:
      summary: Get user's aggregated portfolio
      parameters:
        - name: user_id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Portfolio data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Portfolio'
        '401':
          description: Unauthorized
        '404':
          description: Portfolio not found

  /portfolios/{user_id}/accounts:
    get:
      summary: List all accounts for user
      parameters:
        - name: user_id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: List of accounts
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Account'

  /accounts/{account_id}/holdings:
    get:
      summary: Get all holdings for an account
      parameters:
        - name: account_id
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: include_deleted
          in: query
          schema:
            type: boolean
            default: false
      responses:
        '200':
          description: List of holdings
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Holding'

  /accounts/{account_id}/performance:
    get:
      summary: Get performance metrics
      parameters:
        - name: account_id
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: period
          in: query
          schema:
            type: string
            enum: ['1M', '3M', 'YTD', '1Y', '3Y', '5Y', '10Y', 'ALL']
            default: 'YTD'
      responses:
        '200':
          description: Performance data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Performance'

  /accounts/{account_id}/rebalance/suggestions:
    get:
      summary: Get rebalancing suggestions
      parameters:
        - name: account_id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Rebalancing suggestions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RebalancingSuggestion'

  /accounts/{account_id}/rebalance/execute:
    post:
      summary: Execute rebalancing trades
      parameters:
        - name: account_id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RebalancingExecution'
      responses:
        '200':
          description: Execution confirmed
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExecutionResult'
        '400':
          description: Invalid request
        '422':
          description: Unprocessable entity

components:
  schemas:
    Portfolio:
      type: object
      properties:
        user_id:
          type: string
          format: uuid
        total_value:
          type: number
          format: decimal
        daily_change:
          type: number
          format: decimal
        daily_change_pct:
          type: number
          format: decimal
        accounts:
          type: array
          items:
            $ref: '#/components/schemas/Account'
        allocation:
          $ref: '#/components/schemas/AssetAllocation'
        performance:
          $ref: '#/components/schemas/PortfolioPerformance'
        risk_metrics:
          $ref: '#/components/schemas/RiskMetrics'
        last_updated:
          type: string
          format: date-time

    Holding:
      type: object
      properties:
        id:
          type: string
          format: uuid
        account_id:
          type: string
          format: uuid
        security_id:
          type: string
        security_name:
          type: string
        quantity:
          type: number
          format: decimal
        current_price:
          type: number
          format: decimal
        current_value:
          type: number
          format: decimal
        cost_basis:
          type: number
          format: decimal
        unrealized_gain:
          type: number
          format: decimal
        unrealized_gain_pct:
          type: number
          format: decimal
        allocation_pct:
          type: number
          format: decimal
        asset_class:
          type: string
        currency:
          type: string

    Performance:
      type: object
      properties:
        period:
          type: string
        return_pct:
          type: number
          format: decimal
        benchmark_return_pct:
          type: number
          format: decimal
        alpha:
          type: number
          format: decimal
        sharpe_ratio:
          type: number
          format: decimal
        volatility:
          type: number
          format: decimal

    RebalancingSuggestion:
      type: object
      properties:
        current_allocation:
          type: object
        target_allocation:
          type: object
        suggested_trades:
          type: array
          items:
            type: object
            properties:
              action:
                type: string
                enum: ['BUY', 'SELL']
              security:
                type: string
              quantity:
                type: number
              estimated_price:
                type: number
              estimated_cost:
                type: number
              tax_impact:
                type: number
```

---

**[Due to length constraints, Technical Specification continues with:]**
- 4.4 Security Architecture
- 4.5 Performance Requirements & Scaling
- 4.6 Infrastructure as Code (Kubernetes manifests, Terraform)
- 4.7 API Rate Limiting & Throttling
- 4.8 Disaster Recovery Plan

---

## DOCUMENT 5: DETAILED TESTING DOCUMENT (DTD)

### 5.1 Test Strategy

**Test Pyramid:**
```
        ▲
       /|\  E2E Tests (5% - Critical user journeys)
      / | \
     /  |  \
    /____|____\
    \  |  /  Integration Tests (15% - Microservice interactions)
     \ | /
      \|/
    ╔═════╗
    ║ Unit║ Unit Tests (80% - Component functions)
    ╚═════╝
```

### 5.2 Test Coverage by Module Component

| Component | Unit | Integration | E2E | Target Coverage |
|-----------|------|-------------|-----|-----------------|
| Portfolio Service | 85% | 90% | 95% | 90%+ |
| Analytics Service | 80% | 85% | 90% | 85%+ |
| Rebalancing Service | 90% | 95% | 100% | 95%+ |
| API Gateway | 75% | 90% | 100% | 88%+ |
| Database Layer | 85% | 95% | N/A | 90%+ |

### 5.3 Key Test Scenarios

**Scenario 1: Portfolio Aggregation**
```
Given: User has 3 accounts across Fidelity, Schwab, IBKR
When: User opens portfolio dashboard
Then:
  ✓ System fetches data from all 3 custodians within 30 seconds
  ✓ Consolidates holdings across accounts
  ✓ Calculates total portfolio value correctly (±$0.01)
  ✓ Shows all 3 accounts + aggregated view
  ✓ Displays real-time market prices
  ✓ Account data matches custodian statements
```

**Scenario 2: Rebalancing Execution**
```
Given: Portfolio is overweight US Equities (40% vs 30% target)
When: User clicks "Rebalance" and confirms execution
Then:
  ✓ System generates correct sell/buy list
  ✓ Calculates tax impact correctly
  ✓ Sends orders to custodian API
  ✓ Receives order confirmations
  ✓ Updates portfolio state
  ✓ Tracks execution status
  ✓ New allocation within 2% of target
  ✓ Email confirmation sent to user
```

**Scenario 3: Performance Calculation**
```
Given: Account with 1-year transaction history
When: User views YTD performance
Then:
  ✓ Performance calculation matches manual verification (±0.01%)
  ✓ Benchmark comparison accurate
  ✓ Alpha calculation correct
  ✓ Sharpe ratio matches industry standard
  ✓ Attribution shows correct drivers
```

### 5.4 Performance & Load Testing

**Load Test Targets:**
- **Peak Concurrent Users:** 10,000 (simultaneous dashboard views)
- **Portal Load Time:** < 2 seconds (p95)
- **API Response Time:** < 200ms (p95)
- **Report Generation:** < 30 seconds for 10,000 records
- **Daily Data Sync:** Complete within 2-hour window (9pm-11pm)

**Stress Test:**
- 50,000 simultaneous users accessing dashboard
- System should gracefully degrade (queue requests, show cached data)
- No data corruption
- Recovery to normal within 15 minutes of traffic normalization

---

## DOCUMENT 6: PRODUCTION DEPLOYMENT DOCUMENT (PDD)

### 6.1 Deployment Architecture

**Multi-Region Active-Active Setup:**
```
┌──────────────────────────────────────────────────────┐
│           Global Load Balancer (AWS Route 53)        │
└──────────────────────────┬───────────────────────────┘
                    ┌──────┴──────┐
        ┌───────────┴─┐      ┌────┴───────┐
   ┌────▼────┐  ┌─────▼────┐ ┌──────▼────┐
   │ US East │  │ EU West  │ │ Asia Pac  │
   │ (Primary)  │ (Standby) │ │(Standby)  │
   └────┬────┘  └─────┬────┘ └──────┬────┘
        │             │             │
   Kubernetes    Kubernetes    Kubernetes
   Cluster 1     Cluster 2     Cluster 3
   (5 nodes)     (3 nodes)     (3 nodes)
```

### 6.2 Pre-Deployment Checklist

- [ ] All unit tests passing (90%+ coverage)
- [ ] Integration tests completed (95% pass rate)
- [ ] E2E tests for critical paths
- [ ] Performance benchmarks within targets
- [ ] Security testing completed (OWASP Top 10, pen test)
- [ ] Regulatory compliance approved
- [ ] Data migration scripts tested on staging
- [ ] Rollback procedures documented & tested
- [ ] Incident response playbooks reviewed
- [ ] Communication plan shared with stakeholders
- [ ] On-call team briefed & ready
- [ ] Monitoring & alerting configured
- [ ] Database backups verified
- [ ] Disaster recovery test completed
- [ ] External partner notifications sent (custodians, data providers)

### 6.3 Deployment Steps

```
Phase 1: Pre-Deployment (T-24 hours)
├─ Freeze code changes
├─ Run final security scan
├─ Verify all configurations in staging
└─ Notify all stakeholders

Phase 2: Database Preparation (T-4 hours)
├─ Backup production database
├─ Test migration scripts
├─ Prepare data validation queries
└─ Set up monitoring for DB health

Phase 3: Canary Deployment (T-2 hours)
├─ Deploy to 10% of servers
├─ Monitor error rate (< 0.01%)
├─ Check performance metrics
├─ If issues: ROLLBACK
└─ If OK: Proceed to rolling deployment

Phase 4: Rolling Deployment (T-1 hour)
├─ Deploy to remaining servers
├─ 5 servers at a time (max 1 server per minute)
├─ Blue-green deployment pattern
├─ Monitor health checks continuously
└─ If >1% errors: Initiate automatic rollback

Phase 5: Post-Deployment Validation (T+30 min)
├─ Verify all services healthy
├─ Check API response times (< 200ms)
├─ Validate data integrity
├─ Run smoke tests
├─ Monitor error logs for issues
└─ Notify success to stakeholders

Phase 6: Monitoring & Stabilization (T+24 hours)
├─ 24/7 monitoring continued
├─ Daily health check calls with ops team
├─ Performance baseline established
├─ Hot fixes ready if needed
└─ Documentation updated
```

### 6.4 Rollback Procedure

```
Automatic Rollback Triggers:
├─ Error rate > 5% for > 2 minutes
├─ P95 response time > 2 seconds for > 5 minutes
├─ CPU usage > 90% sustained for > 10 minutes
├─ Database connection pool exhausted
└─ Critical data inconsistency detected

Manual Rollback Initiation:
├─ Engineering lead or on-call engineer decision
├─ Execute rollback script (< 5 minutes)
├─ Blue-green environment swap
├─ DNS update (immediate)
├─ Verify rollback successful
└─ Root cause analysis initiated

Rollback Time Targets:
├─ Detection: < 2 minutes
├─ Initiation: < 2 minutes
├─ Execution: < 5 minutes
└─ Verification: < 3 minutes
├─ Total RTO: 12 minutes
```

---

## DOCUMENT 7: PRODUCTION SUPPORT DOCUMENT (PSD)

### 7.1 Support Model & SLAs

| Severity | Response Time | Resolution Time | Escalation |
|----------|---------------|-----------------|------------|
| **P1 (Critical)** | 15 minutes | 2 hours | CTO + Engineering Lead |
| **P2 (High)** | 1 hour | 8 hours | Engineering Manager |
| **P3 (Medium)** | 4 hours | 24 hours | Product Manager |
| **P4 (Low)** | 24 hours | 1 week | Product Owner |

**Severity Definitions:**
- **P1:** System down, data loss, security breach, regulatory issue
- **P2:** Major feature broken, significant performance degradation, important bugs
- **P3:** Minor feature issue, workaround available, cosmetic bugs
- **P4:** Enhancement requests, documentation issues, nice-to-have fixes

### 7.2 Incident Management

**Incident Response Workflow:**
```
1. Detection (automated alerts or user report)
   └─ Severity assessment (P1-P4)

2. Triage (within 15 min for P1)
   ├─ Initial diagnosis
   ├─ Assign on-call engineer
   └─ Create incident ticket

3. Investigation
   ├─ Gather logs & metrics
   ├─ Identify root cause
   └─ Develop fix or workaround

4. Resolution
   ├─ Implement fix
   ├─ Test thoroughly
   ├─ Deploy to production
   └─ Verify with customer

5. Post-Incident Review
   ├─ Document lessons learned
   ├─ Update runbooks
   ├─ Prevent recurrence
   └─ Share knowledge

6. Communication
   ├─ Real-time status updates (every 15 min for P1)
   ├─ Email/Slack notifications
   └─ Retrospective summary
```

### 7.3 Knowledge Base & Documentation

**Key Documentation:**
- API Reference (auto-generated from OpenAPI specs)
- Troubleshooting Guides (common issues & solutions)
- Deployment Runbooks (step-by-step procedures)
- Incident Playbooks (detailed response steps)
- Architecture Documentation (system design & flows)
- Data Dictionary (all database fields explained)
- Compliance Checklist (regulatory requirements per module)

### 7.4 Continuous Improvement Plan

**Quarterly Reviews:**
- Performance metrics analysis
- Incident trend analysis
- Feature utilization metrics
- User feedback synthesis
- Competitive feature analysis
- Technical debt assessment

**Annual Planning:**
- Feature roadmap updates
- Technology stack evaluation
- Infrastructure scaling assessment
- Team capability development
- Vendor performance review

---

## SUMMARY & NEXT STEPS

This Investment Management Module documentation provides:
✓ Complete PRD with market analysis & competitive positioning  
✓ Detailed design specifications with wireframes & interaction patterns  
✓ Functional specifications with algorithms & business logic  
✓ Technical specifications with architecture & APIs  
✓ Comprehensive testing strategy & scenarios  
✓ Production deployment procedures & rollback plans  
✓ Support model & incident management framework  

**Next Steps:**
1. Present to steering committee for approval
2. Assign development team leads
3. Set up development environment
4. Begin Phase 1 infrastructure work
5. Start implementing Portfolio Aggregation Engine (highest priority)

---

**Document Owner:** Investment Management Module Lead  
**Created:** January 2026  
**Last Updated:** January 2026  
**Distribution:** Product Team, Engineering Team, Quality Assurance, Operations