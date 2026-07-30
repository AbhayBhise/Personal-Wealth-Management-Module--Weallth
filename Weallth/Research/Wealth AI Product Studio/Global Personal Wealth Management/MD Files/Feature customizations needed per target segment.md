<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Feature customizations needed per target segment

Based on comprehensive research on wealth management platform customization, here's a detailed feature customization guide for each target segment.

# FEATURE CUSTOMIZATIONS BY WEALTH SEGMENT

## Global Wealth Management Platform - Segment-Specific Configuration Guide

**Date:** January 24, 2026
**Purpose:** Define feature variations, UI/UX differences, and service model customizations per segment
**Segments:** Mass Market, Mass Affluent, HNI, UHNWI, Family Office

***

## CUSTOMIZATION FRAMEWORK

Each feature in the platform is customized across 6 dimensions:


| Dimension | Description |
| :-- | :-- |
| **Feature Depth** | Basic → Standard → Advanced → Comprehensive → Bespoke |
| **Service Model** | Self-service → Hybrid → Advisor-assisted → Dedicated advisor → Family office team |
| **Automation Level** | Fully automated → Rules-based → AI-assisted → Human-augmented → White-glove |
| **UI Complexity** | Simplified → Standard → Professional → Institutional → Custom |
| **Reporting Granularity** | Summary → Detailed → Comprehensive → Institutional → Custom |
| **Pricing Tier** | Free/Freemium → Subscription → AUM-based → Premium → Enterprise |


***

## SEGMENT 1: MASS MARKET (< \$100K)

### Service Model: Self-Service + Robo-Advisory[^1][^2]

| Characteristic | Configuration |
| :-- | :-- |
| **Primary Interface** | Mobile-first (90% mobile usage) |
| **Advisor Access** | None (chatbot + help center only) |
| **Automation Level** | Fully automated |
| **Fee Structure** | Freemium + 0.25% AUM for robo |
| **Support** | Self-service, community forums |

### Feature Customizations

#### 1. Onboarding \& Profile

| Feature | Mass Market Configuration | Why |
| :-- | :-- | :-- |
| **Risk Assessment** | 5-question visual quiz (emojis, sliders) | Quick, non-intimidating |
| **KYC** | Aadhaar e-KYC, PAN auto-fetch | Frictionless, digital-native |
| **Goal Setting** | Pre-built templates (emergency fund, vacation, gadget) | Users don't know what to set |
| **Financial Profile** | Income + expenses only (no complex tax status) | Keep it simple |
| **Time to Complete** | < 5 minutes | Abandon if longer |

#### 2. Account Aggregation

| Feature | Mass Market Configuration | Why |
| :-- | :-- | :-- |
| **Account Types** | Bank accounts, basic brokerage, PPF, FDs | Limited investment types |
| **Integration Method** | Plaid/Yodlee via OAuth | One-tap connection |
| **Manual Entry** | Minimal (gold, cash savings only) | Reduce friction |
| **Refresh Frequency** | Daily batch | Cost-effective |
| **Multi-Currency** | ❌ Not available | Not needed |

#### 3. Investment Management

| Feature | Mass Market Configuration | Why |
| :-- | :-- | :-- |
| **Portfolio View** | Simple pie chart + total value | Avoid overwhelming |
| **Asset Classes** | 3-4 only (equity, debt, gold, cash) | Simplified categorization |
| **Performance Display** | Absolute returns only (₹ gained/lost) | TWR confuses beginners |
| **Benchmarking** | ❌ Hidden | Too advanced |
| **Risk Metrics** | Simple risk score (1-10) | No Sharpe ratio, etc. |
| **Rebalancing** | Fully automated (robo handles) | No user decisions |
| **Tax Optimization** | ❌ Not available | Complexity not worth it |
| **Recommendations** | 3-5 curated funds only | Paradox of choice |

#### 4. Goal Planning

| Feature | Mass Market Configuration | Why |
| :-- | :-- | :-- |
| **Goal Types** | Emergency fund, vacation, gadget, wedding, car | Relatable, concrete |
| **Planning Horizon** | 1-5 years max | Long-term feels abstract |
| **Scenarios** | Single scenario (no what-ifs) | Keep simple |
| **Automation** | Auto-debit SIPs linked to goals | Set and forget |
| **Progress Display** | Visual progress bar + countdown | Gamified |
| **Nudges** | Weekly encouragement notifications [^3] | Maintain engagement |

#### 5. Cash Flow \& Budgeting

| Feature | Mass Market Configuration | Why |
| :-- | :-- | :-- |
| **Expense Tracking** | Auto-categorized from bank feeds | Zero effort |
| **Budget Creation** | Template-based (50/30/20 rule) | Prescriptive guidance |
| **Categories** | 10-12 simplified categories | Not too granular |
| **Alerts** | Overspending alerts, bill reminders | Proactive help |
| **Subscription Tracking** | ✅ Highlight \& suggest cancellation | High value for segment |
| **Forecasting** | ❌ Not available | Too complex |

#### 6. Financial Education[^3]

| Feature | Mass Market Configuration | Why |
| :-- | :-- | :-- |
| **Content Format** | Short videos (< 3 min), interactive quizzes | Attention span |
| **Topics** | Budgeting, saving, credit score, basic investing | Foundational |
| **Gamification** | ✅ Badges, streaks, leaderboards | Drive engagement |
| **Language** | Vernacular (Hindi, Tamil, etc.) | Accessibility |
| **Personalization** | Based on financial behavior | Relevant nudges |

#### 7. UI/UX Configuration

| Element | Mass Market Configuration |
| :-- | :-- |
| **Dashboard** | Single-screen summary, large touch targets |
| **Navigation** | Bottom tab bar (4 tabs max) |
| **Data Density** | Low (lots of white space) |
| **Visualizations** | Simple charts, no tables |
| **Colors** | Friendly, approachable palette |
| **Terminology** | Plain language, no jargon |
| **Help** | Contextual tooltips, chatbot |


***

## SEGMENT 2: MASS AFFLUENT (\$100K - \$1M)

### Service Model: Hybrid (Digital + Occasional Advisor)[^3][^1]

| Characteristic | Configuration |
| :-- | :-- |
| **Primary Interface** | Web + Mobile (60/40 split) |
| **Advisor Access** | On-demand video calls, scheduled reviews |
| **Automation Level** | AI-assisted with human override |
| **Fee Structure** | 0.5-0.75% AUM or subscription (\$20-50/month) |
| **Support** | Chat, email, scheduled calls |

### Feature Customizations

#### 1. Onboarding \& Profile

| Feature | Mass Affluent Configuration | Why |
| :-- | :-- | :-- |
| **Risk Assessment** | 15-question comprehensive questionnaire | Better profiling |
| **KYC** | Digital KYC + video verification for advanced features | Compliance |
| **Goal Setting** | Custom goals + templates | Flexibility |
| **Financial Profile** | Full profile (tax status, dependents, employment) | Holistic planning |
| **Time to Complete** | 10-15 minutes | Worth investment |

#### 2. Account Aggregation

| Feature | Mass Affluent Configuration | Why |
| :-- | :-- | :-- |
| **Account Types** | All retail accounts + NPS, ESOP, RSU tracking | Complex portfolios |
| **Integration Method** | API + Plaid + CSV import | Multiple sources |
| **Manual Entry** | Property, gold, unlisted shares | Complete picture |
| **Refresh Frequency** | Real-time for brokerage, daily for banks | Active investors |
| **Multi-Currency** | ✅ Basic (USD, EUR for US stocks) [^4] | International investments |

#### 3. Investment Management

| Feature | Mass Affluent Configuration | Why |
| :-- | :-- | :-- |
| **Portfolio View** | Detailed dashboard with drill-down | Sophisticated users |
| **Asset Classes** | 8-10 classes (including REITs, international) | Diversified portfolios |
| **Performance Display** | TWR, MWR, absolute returns, periods | Standard metrics |
| **Benchmarking** | ✅ vs. Nifty, S\&P 500, custom blend | Measure performance |
| **Risk Metrics** | Volatility, Sharpe, Max Drawdown | Risk-aware |
| **Rebalancing** | Semi-automated (suggest + approve) [^5] | User control |
| **Tax Optimization** | ✅ Tax-loss harvesting suggestions | Tax alpha |
| **Recommendations** | AI-powered, 10-15 options per category | Curated choice |

#### 4. Goal Planning

| Feature | Mass Affluent Configuration | Why |
| :-- | :-- | :-- |
| **Goal Types** | Retirement, home, education, FIRE, custom | Life stage goals |
| **Planning Horizon** | 1-30 years | Long-term planning |
| **Scenarios** | ✅ Multiple what-if scenarios | Explore options |
| **Inflation Modeling** | ✅ Configurable inflation rates | Realistic projections |
| **Monte Carlo** | ❌ Not available (too complex) | Save for HNI |
| **Progress Display** | Dashboard + detailed projections | Track progress |

#### 5. Retirement Planning

| Feature | Mass Affluent Configuration | Why |
| :-- | :-- | :-- |
| **Calculator** | ✅ Multi-variable calculator | Core need |
| **Social Security/Pension** | ✅ Integration | Income source |
| **Withdrawal Strategies** | Basic (systematic withdrawal) | Starting point |
| **FIRE Calculator** | ✅ Dedicated tool | Segment interest |
| **Tax Projections** | ✅ Post-retirement tax estimates | Planning |

#### 6. Tax Planning

| Feature | Mass Affluent Configuration | Why |
| :-- | :-- | :-- |
| **Tax Dashboard** | ✅ Estimated liability, deductions used | Visibility |
| **Tax-Loss Harvesting** | ✅ Automated identification | Tax savings |
| **Asset Location** | ✅ Recommendations | Optimization |
| **RSU/ESOP Tax** | ✅ Exercise optimization | Common for segment |
| **Crypto Tax** | ✅ VDA tax tracking | Relevant |
| **Tax Reports** | ✅ Export for CA | Compliance |

#### 7. Reporting

| Feature | Mass Affluent Configuration | Why |
| :-- | :-- | :-- |
| **Report Types** | Portfolio summary, performance, tax | Standard needs |
| **Frequency** | On-demand + monthly email | Stay informed |
| **Format** | PDF, Excel export | Flexibility |
| **Customization** | Limited (choose sections) | Some control |
| **Sharing** | ✅ Share with spouse/CA | Collaboration |

#### 8. Advisor Collaboration

| Feature | Mass Affluent Configuration | Why |
| :-- | :-- | :-- |
| **Advisor Access** | ✅ On-demand (pay per session) or included | Hybrid model [^1] |
| **Session Types** | Video call, screen share | Remote-first |
| **Frequency** | Quarterly review recommended | Touchpoint |
| **Advisor Dashboard** | ❌ Not applicable | Client-facing only |
| **Co-Browsing** | ✅ Advisor can view client screen | Guided help |

#### 9. UI/UX Configuration

| Element | Mass Affluent Configuration |
| :-- | :-- |
| **Dashboard** | Multi-widget, customizable layout |
| **Navigation** | Side navigation + top tabs |
| **Data Density** | Medium (balance of detail and clarity) |
| **Visualizations** | Interactive charts, basic tables |
| **Colors** | Professional, trustworthy palette |
| **Terminology** | Some financial terms with tooltips |
| **Help** | Help center, chat, advisor escalation |


***

## SEGMENT 3: HNI (\$1M - \$10M)

### Service Model: Advisor-Assisted with Digital Tools[^6][^7]

| Characteristic | Configuration |
| :-- | :-- |
| **Primary Interface** | Web (70%), Mobile for monitoring (30%) |
| **Advisor Access** | Dedicated relationship manager |
| **Automation Level** | Human-augmented (advisor uses tools) |
| **Fee Structure** | 0.75-1.0% AUM (negotiable) |
| **Support** | Dedicated RM, priority support line |

### Feature Customizations

#### 1. Onboarding \& Profile

| Feature | HNI Configuration | Why |
| :-- | :-- | :-- |
| **Risk Assessment** | Comprehensive + behavioral finance assessment | Deep understanding |
| **KYC** | Full KYC + in-person verification option | Regulatory + relationship |
| **Goal Setting** | ✅ Advisor-assisted goal discovery | Complex needs |
| **Financial Profile** | Complete (multiple income sources, entities, family) | Holistic |
| **Investment Policy Statement** | ✅ Formal IPS creation | Institutional approach |
| **Time to Complete** | 1-2 hours (with advisor) | Thorough |

#### 2. Account Aggregation

| Feature | HNI Configuration | Why |
| :-- | :-- | :-- |
| **Account Types** | All retail + PMS, AIFs, insurance policies, loans | Full picture [^8] |
| **Integration Method** | Direct API, custodian feeds, advisor data entry | Comprehensive |
| **Manual Entry** | ✅ Extensive (real estate, art, private investments) | Alternative assets |
| **Refresh Frequency** | Real-time where available | Active management |
| **Multi-Currency** | ✅ Full (10+ currencies) | Global investments |
| **Household View** | ✅ Aggregate family members | Family wealth |

#### 3. Investment Management

| Feature | HNI Configuration | Why |
| :-- | :-- | :-- |
| **Portfolio View** | Institutional-grade dashboard | Sophisticated needs |
| **Asset Classes** | 12 classes (including alternatives, structured) | Full spectrum |
| **Performance Display** | TWR, MWR, attribution, peer comparison | Deep analysis |
| **Benchmarking** | ✅ Custom benchmarks, peer percentile | Meaningful comparison |
| **Risk Metrics** | Full suite (VaR, factor exposures, stress tests) | Risk management |
| **Rebalancing** | ✅ Advisor-proposed, client-approved | Collaborative |
| **Tax Optimization** | ✅ Full (harvesting, location, lot selection) | Significant tax alpha |
| **Alternative Investments** | ✅ PE, AIFs, structured products tracking | Key differentiator [^8] |
| **Model Portfolios** | ✅ Advisor-built models | Customization |

#### 4. Goal Planning

| Feature | HNI Configuration | Why |
| :-- | :-- | :-- |
| **Goal Types** | Unlimited custom goals | Complex lives |
| **Planning Horizon** | Multi-generational (50+ years) | Legacy planning |
| **Scenarios** | ✅ Advanced scenario modeling | What-if analysis |
| **Monte Carlo** | ✅ 1,000+ simulations | Probability-based |
| **Linked Goals** | ✅ Interdependent goal modeling | Realistic planning |
| **Progress Display** | ✅ Detailed projections + probability of success | Sophisticated output |

#### 5. Retirement Planning

| Feature | HNI Configuration | Why |
| :-- | :-- | :-- |
| **Calculator** | ✅ Comprehensive with advisor review | Core offering |
| **Withdrawal Strategies** | ✅ Advanced (bucket, floor-ceiling, dynamic) | Optimization |
| **Roth Conversion** | ✅ Multi-year conversion planning | Tax strategy |
| **Pension Optimization** | ✅ Lump sum vs. annuity analysis | Decision support |
| **Longevity Analysis** | ✅ Probability-weighted life expectancy | Conservative planning |
| **Healthcare Costs** | ✅ Integrated healthcare expense projection | Complete picture |

#### 6. Tax Planning

| Feature | HNI Configuration | Why |
| :-- | :-- | :-- |
| **Tax Dashboard** | ✅ Real-time estimated liability | Visibility |
| **Multi-Year Planning** | ✅ 5-year tax projection | Strategic planning |
| **Income Timing** | ✅ Defer/accelerate income strategies | Bracket management |
| **Charitable Strategies** | ✅ Bunching, DAF timing | Tax-efficient giving |
| **Estate Tax** | ✅ Federal + state projections | Estate planning |
| **International Tax** | ✅ FBAR/FATCA tracking, withholding | Global assets |

#### 7. Estate Planning

| Feature | HNI Configuration | Why |
| :-- | :-- | :-- |
| **Estate Inventory** | ✅ Complete asset + title tracking | Foundation |
| **Beneficiary Management** | ✅ All accounts, mismatch alerts | Coordination |
| **Document Vault** | ✅ Secure storage (will, trusts, POA) | Centralization |
| **Estate Tax Projection** | ✅ Federal + state calculation | Planning |
| **Gifting Tracker** | ✅ Annual + lifetime exemption tracking | Compliance |
| **Trust Visualization** | ✅ Basic trust structure diagrams | Understanding |

#### 8. Insurance \& Risk

| Feature | HNI Configuration | Why |
| :-- | :-- | :-- |
| **Policy Aggregation** | ✅ All policies in one view | Visibility |
| **Gap Analysis** | ✅ Life, disability, liability, umbrella | Comprehensive |
| **Coverage Recommendations** | ✅ Based on net worth, income, liabilities | Appropriate coverage |
| **Premium Tracking** | ✅ Payment reminders, optimization | Cost management |
| **Key Person Insurance** | ✅ For business owners | Business continuity |

#### 9. Reporting \& Insights

| Feature | HNI Configuration | Why |
| :-- | :-- | :-- |
| **Report Types** | Comprehensive (portfolio, performance, tax, estate, insurance) | Full picture |
| **Frequency** | Monthly automated + quarterly review | Regular cadence |
| **Format** | PDF, Excel, PowerPoint presentation | Flexibility |
| **Customization** | ✅ High (choose metrics, periods, comparisons) | Control |
| **White-Label** | ✅ Advisor-branded reports | Professional |
| **Sharing** | ✅ Secure share with family, CPA, attorney | Collaboration |

#### 10. Advisor Tools

| Feature | HNI Configuration | Why |
| :-- | :-- | :-- |
| **Advisor Dashboard** | ✅ Full client view with analytics | RM efficiency |
| **Proposal Generation** | ✅ Investment proposals with scenarios | Sales tool |
| **Compliance Tracking** | ✅ Suitability, best interest documentation | Regulatory |
| **Task Management** | ✅ Client follow-ups, action items | Service quality |
| **Billing/Fee Tracking** | ✅ AUM calculation, fee invoicing | Operations |

#### 11. UI/UX Configuration

| Element | HNI Configuration |
| :-- | :-- |
| **Dashboard** | Comprehensive, executive summary + drill-down |
| **Navigation** | Full navigation with role-based menus |
| **Data Density** | High (detailed tables, multi-level charts) |
| **Visualizations** | Interactive, exportable, drill-down |
| **Colors** | Professional, subdued, trustworthy |
| **Terminology** | Financial terms (users are sophisticated) |
| **Help** | Dedicated RM, priority support, knowledge base |


***

## SEGMENT 4: UHNWI (\$10M - \$50M)

### Service Model: Dedicated Advisor + Bespoke Solutions[^8][^9]

| Characteristic | Configuration |
| :-- | :-- |
| **Primary Interface** | Web + Tablet (advisor-presented) |
| **Advisor Access** | Dedicated team (RM + specialists) |
| **Automation Level** | White-glove (human-driven, tech-enabled) |
| **Fee Structure** | 0.5-0.75% AUM (volume discount) + service fees |
| **Support** | 24/7 dedicated line, concierge services |

### Feature Customizations

#### 1. Onboarding \& Profile

| Feature | UHNWI Configuration | Why |
| :-- | :-- | :-- |
| **Risk Assessment** | Multi-dimensional (risk tolerance, capacity, perception) | Nuanced understanding |
| **KYC** | ✅ In-person + enhanced due diligence | Regulatory + relationship |
| **Goal Setting** | ✅ Facilitated family wealth planning session | Complex families |
| **Financial Profile** | Complete family wealth mapping | Multi-entity |
| **Investment Policy Statement** | ✅ Comprehensive IPS with governance | Institutional |
| **Family Governance** | ✅ Family constitution support | Unique to UHNWI |

#### 2. Account Aggregation

| Feature | UHNWI Configuration | Why |
| :-- | :-- | :-- |
| **Account Types** | Everything + PE/VC, hedge funds, private debt, art [^8] | Alternative-heavy |
| **Integration Method** | Direct feeds + fund admin integration + manual | Complete picture |
| **Alternative Assets** | ✅ Full tracking (capital calls, distributions, IRR) | Core holding |
| **Real Estate** | ✅ Property-level detail with appraisals | Significant holdings |
| **Collectibles** | ✅ Art, wine, jewelry with valuations | Lifestyle assets |
| **Multi-Currency** | ✅ All currencies + FX hedging analysis | Global wealth |
| **Multi-Entity** | ✅ Trusts, LLCs, foundations, family members | Complex structures |

#### 3. Investment Management

| Feature | UHNWI Configuration | Why |
| :-- | :-- | :-- |
| **Portfolio View** | Multi-entity consolidated + entity-level | Family wealth |
| **Asset Classes** | 15+ classes (full alternative spectrum) | Sophisticated allocation |
| **Performance Display** | Institutional (TWR, IRR, PME for PE, vintage year) | Appropriate metrics |
| **Benchmarking** | ✅ Custom benchmarks, Cambridge Associates for PE | Relevant comparison |
| **Risk Metrics** | ✅ Comprehensive + liquidity risk, concentration | Full risk picture |
| **Direct Indexing** | ✅ Custom index with tax optimization | Ultimate personalization |
| **Co-Investment** | ✅ Deal flow tracking, commitment management | Common for UHNWI |
| **Private Markets** | ✅ Full PE/VC/private credit management [^8] | Major allocation |

#### 4. Tax Planning

| Feature | UHNWI Configuration | Why |
| :-- | :-- | :-- |
| **Multi-Jurisdiction** | ✅ US, India, Singapore, UAE, UK | Global presence |
| **Entity-Level Planning** | ✅ Tax optimization across structures | Complex structures |
| **QSBS Tracking** | ✅ Qualified Small Business Stock | Startup founders |
| **Opportunity Zones** | ✅ OZ investment tracking | Tax deferral |
| **Charitable Strategies** | ✅ CRT, CLT, foundation grants | Sophisticated giving |
| **Tax Advisors Integration** | ✅ Collaboration portal for CPAs | Team approach |

#### 5. Estate Planning

| Feature | UHNWI Configuration | Why |
| :-- | :-- | :-- |
| **Trust Administration** | ✅ Full trust tracking (revocable, irrevocable, dynasty) | Complex structures |
| **Generation-Skipping** | ✅ GST planning and tracking | Multi-generational |
| **Family Limited Partnerships** | ✅ FLP/FLLC valuation and planning | Transfer strategies |
| **Life Insurance Trusts** | ✅ ILIT tracking and compliance | Estate liquidity |
| **Charitable Structures** | ✅ Private foundation, DAF, CRT management | Philanthropy |
| **Estate Liquidity Analysis** | ✅ Ensure estate can pay taxes | Planning |

#### 6. Family Governance[^9]

| Feature | UHNWI Configuration | Why |
| :-- | :-- | :-- |
| **Family Constitution** | ✅ Template + facilitation support | Governance |
| **Family Meeting Support** | ✅ Agenda templates, presentation generation | Coordination |
| **Role Management** | ✅ Family member roles, access controls | Security |
| **Next-Gen Program** | ✅ Financial education for heirs [^4] | Preparation |
| **Decision Tracking** | ✅ Family investment committee decisions | Governance |

#### 7. Philanthropy[^8]

| Feature | UHNWI Configuration | Why |
| :-- | :-- | :-- |
| **Giving Strategy** | ✅ Multi-year philanthropic planning | Strategic giving |
| **Vehicle Comparison** | ✅ DAF vs. foundation vs. direct | Optimization |
| **Grant Management** | ✅ Track grants, impact, reporting | Foundation admin |
| **Tax Optimization** | ✅ Timing, asset selection for gifts | Tax alpha |
| **Family Involvement** | ✅ Assign family members to causes | Engagement |

#### 8. Concierge Services[^8]

| Feature | UHNWI Configuration | Why |
| :-- | :-- | :-- |
| **Bill Pay** | ✅ Personal bill payment service | Lifestyle |
| **Cash Management** | ✅ Multi-account liquidity optimization | Efficiency |
| **Document Management** | ✅ Secure vault for all important docs | Centralization |
| **Vendor Coordination** | ✅ CPA, attorney, insurance agent collaboration | Team approach |
| **Travel \& Lifestyle** | ✅ Referral network for luxury services | Relationship |

#### 9. Reporting

| Feature | UHNWI Configuration | Why |
| :-- | :-- | :-- |
| **Report Types** | Custom reports by entity, family member, asset class | Flexibility |
| **Frequency** | ✅ Real-time dashboard + periodic formal reports | Always current |
| **Family Wealth Report** | ✅ Consolidated family balance sheet | Total picture |
| **Presentation Mode** | ✅ Client-ready presentations for family meetings | Professional |
| **Audit Support** | ✅ Reports for tax filing, trust accounting | Compliance |

#### 10. UI/UX Configuration

| Element | UHNWI Configuration |
| :-- | :-- |
| **Dashboard** | Executive summary with family-level view |
| **Navigation** | Role-based (principal vs. family member vs. advisor) |
| **Data Density** | Configurable (summary or detail) |
| **Visualizations** | Institutional quality, boardroom-ready |
| **Colors** | Elegant, understated, premium feel |
| **Terminology** | Institutional/family office language |
| **Branding** | ✅ White-label option for family |


***

## SEGMENT 5: FAMILY OFFICE (\$50M+)

### Service Model: Multi-Family Office Platform[^9][^8]

| Characteristic | Configuration |
| :-- | :-- |
| **Primary Interface** | Enterprise web application |
| **Advisor Access** | Full family office team + external advisors |
| **Automation Level** | Configurable workflows |
| **Fee Structure** | Enterprise licensing + AUM component |
| **Support** | Dedicated success manager, SLA-backed |

### Feature Customizations

#### 1. Family Structure Management

| Feature | Family Office Configuration | Why |
| :-- | :-- | :-- |
| **Multi-Generation** | ✅ G1, G2, G3+ tracking with relationships | Core requirement |
| **Entity Management** | ✅ Unlimited entities (trusts, LLCs, foundations) | Complex structures |
| **Branch Views** | ✅ Separate views per family branch | Privacy |
| **Governance Roles** | ✅ Trustee, beneficiary, advisor, staff roles | Access control |
| **Family Tree** | ✅ Visual family tree with wealth overlay | Understanding |

#### 2. Investment Management

| Feature | Family Office Configuration | Why |
| :-- | :-- | :-- |
| **Portfolio Construction** | ✅ Model portfolios by family/entity | Consistency |
| **Investment Committee** | ✅ Meeting management, voting, documentation | Governance |
| **Manager Selection** | ✅ Track external managers, performance | Oversight |
| **Allocation Framework** | ✅ Strategic + tactical allocation management | Institutional |
| **Risk Budgeting** | ✅ Risk allocation across family | Coordination |
| **Direct Investments** | ✅ Full deal tracking, due diligence | Co-invest/direct |

#### 3. Consolidated Reporting[^8]

| Feature | Family Office Configuration | Why |
| :-- | :-- | :-- |
| **Family Balance Sheet** | ✅ Total family net worth | Top-level view |
| **Entity Statements** | ✅ Individual entity reports | Compliance |
| **Branch Reports** | ✅ Per-branch summaries | Branch autonomy |
| **Beneficiary Statements** | ✅ What each beneficiary receives | Transparency |
| **Performance Attribution** | ✅ Manager, asset class, currency attribution | Deep analysis |
| **Custom Reports** | ✅ Report builder for any view | Flexibility |

#### 4. Trust \& Estate Administration[^9]

| Feature | Family Office Configuration | Why |
| :-- | :-- | :-- |
| **Trust Accounting** | ✅ Full trust income/principal accounting | Compliance |
| **Distribution Management** | ✅ Track distributions, discretionary decisions | Administration |
| **Document Repository** | ✅ Trust documents, amendments, minutes | Centralization |
| **Beneficiary Portal** | ✅ Self-service for beneficiaries | Transparency |
| **Fiduciary Tracking** | ✅ Trustee duties, compliance | Risk management |

#### 5. Tax Management

| Feature | Family Office Configuration | Why |
| :-- | :-- | :-- |
| **Multi-Jurisdiction** | ✅ Global tax management | International families |
| **Entity Tax Planning** | ✅ Tax optimization across entities | Efficiency |
| **K-1 Aggregation** | ✅ Consolidate partnership K-1s | Simplification |
| **Tax Estimate Tracking** | ✅ Quarterly estimates by entity | Cash management |
| **Compliance Calendar** | ✅ Filing deadlines across jurisdictions | Risk reduction |

#### 6. Bill Pay \& Cash Management[^8]

| Feature | Family Office Configuration | Why |
| :-- | :-- | :-- |
| **Bill Pay Automation** | ✅ Vendor management, payment processing | Operations |
| **Multi-Account Cash** | ✅ Sweep optimization across accounts | Efficiency |
| **Payroll** | ✅ Household staff, family office staff payroll | Administration |
| **Expense Tracking** | ✅ Family member expense reporting | Control |
| **Budgeting** | ✅ Family and entity-level budgets | Planning |

#### 7. Family Governance Platform

| Feature | Family Office Configuration | Why |
| :-- | :-- | :-- |
| **Family Constitution** | ✅ Document management, version control | Foundation |
| **Meeting Management** | ✅ Schedule, agenda, minutes, action items | Coordination |
| **Voting/Decisions** | ✅ Track family council decisions | Governance |
| **Communication Hub** | ✅ Secure family messaging | Privacy |
| **Education Portal** | ✅ Next-gen learning management | Preparation |
| **Family Calendar** | ✅ Shared events, deadlines | Coordination |

#### 8. Philanthropy Management[^9]

| Feature | Family Office Configuration | Why |
| :-- | :-- | :-- |
| **Foundation Admin** | ✅ Full private foundation management | Operations |
| **Grant Workflow** | ✅ Application, review, approval, tracking | Process |
| **Impact Measurement** | ✅ Track outcomes across giving | Effectiveness |
| **Family Involvement** | ✅ Assign family members to giving areas | Engagement |
| **Compliance** | ✅ 990-PF preparation, minimum distribution | Regulatory |

#### 9. External Advisor Collaboration

| Feature | Family Office Configuration | Why |
| :-- | :-- | :-- |
| **Advisor Portal** | ✅ Secure access for external advisors | Collaboration |
| **Document Sharing** | ✅ Controlled sharing with CPAs, attorneys | Workflow |
| **Task Assignment** | ✅ Assign tasks to external advisors | Coordination |
| **Advisor Directory** | ✅ Track all professional relationships | Management |
| **Fee Tracking** | ✅ Track advisor fees across family | Cost control |

#### 10. Security \& Compliance

| Feature | Family Office Configuration | Why |
| :-- | :-- | :-- |
| **Role-Based Access** | ✅ Granular permissions by role | Security |
| **Audit Trail** | ✅ Complete activity logging | Compliance |
| **Data Segregation** | ✅ Branch-level data isolation | Privacy |
| **Two-Person Rules** | ✅ Dual approval for sensitive actions | Control |
| **Regulatory Reporting** | ✅ FBAR, FATCA, CRS automation | Compliance |

#### 11. Integration \& API

| Feature | Family Office Configuration | Why |
| :-- | :-- | :-- |
| **Custodian Feeds** | ✅ Direct feeds from all major custodians | Automation |
| **Fund Admin Integration** | ✅ PE/VC fund administrator feeds | Alternatives |
| **Accounting Export** | ✅ QuickBooks, Sage, custom GL | Back office |
| **Tax Software** | ✅ Integration with tax prep software | Efficiency |
| **Open API** | ✅ Full API for custom integrations | Flexibility |


***

## FEATURE COMPARISON MATRIX

### Core Platform Features

| Feature | Mass Market | Mass Affluent | HNI | UHNWI | Family Office |
| :-- | :--: | :--: | :--: | :--: | :--: |
| **Account Aggregation** | Basic | Standard | Comprehensive | Full + Alternatives | Enterprise |
| **Portfolio View** | Simple | Detailed | Institutional | Multi-Entity | Family-Level |
| **Asset Classes** | 4 | 8-10 | 12 | 15+ | 15+ |
| **Performance Metrics** | Absolute | TWR/MWR | +Attribution | +IRR/PME | +Custom |
| **Risk Metrics** | Score | Standard | Full Suite | +Liquidity | +Concentration |
| **Rebalancing** | Auto | Semi-Auto | Advisor | Bespoke | Committee |
| **Tax Optimization** | ❌ | Basic | Full | Multi-Jurisdiction | Entity-Level |
| **Alternatives** | ❌ | Limited | ✅ | Comprehensive | Full Admin |
| **Estate Planning** | ❌ | Basic | Comprehensive | +Trusts | Full Admin |
| **Philanthropy** | ❌ | ❌ | Basic | Comprehensive | Foundation Mgmt |
| **Family Governance** | ❌ | ❌ | ❌ | Basic | Full Platform |
| **Advisor Tools** | ❌ | Limited | Full | Bespoke | Enterprise |
| **API Access** | ❌ | ❌ | Limited | ✅ | Full |

### Service Model Features

| Feature | Mass Market | Mass Affluent | HNI | UHNWI | Family Office |
| :-- | :--: | :--: | :--: | :--: | :--: |
| **Human Advisor** | ❌ Chatbot | On-Demand | Dedicated RM | Team | Full FO Staff |
| **Support Level** | Self-Service | Email/Chat | Priority | 24/7 Concierge | Dedicated CSM |
| **Review Frequency** | ❌ | Quarterly | Monthly | Weekly | Continuous |
| **Customization** | None | Limited | High | Bespoke | Unlimited |
| **White-Label** | ❌ | ❌ | ✅ Advisor | ✅ Family | ✅ Full |
| **SLA** | ❌ | ❌ | ✅ | ✅ Premium | ✅ Enterprise |


***

## IMPLEMENTATION PRIORITIES BY SEGMENT

### Phase 1 (Months 1-6): Foundation

| Segment | Priority Features |
| :-- | :-- |
| **Mass Affluent** | Aggregation, Portfolio View, Goal Planning, Basic Tax |
| **HNI** | Full Aggregation, Performance Analytics, Advisor Tools |

### Phase 2 (Months 7-12): Expansion

| Segment | Priority Features |
| :-- | :-- |
| **Mass Market** | Simplified Aggregation, Budgeting, Robo-Advisor |
| **UHNWI** | Alternatives, Multi-Entity, Estate Planning |

### Phase 3 (Months 13-18): Advanced

| Segment | Priority Features |
| :-- | :-- |
| **Family Office** | Governance, Foundation Admin, Full Reporting |
| **All Segments** | Advanced Tax, Philanthropy, Global |


***

## PRICING MODEL BY SEGMENT

| Segment | Pricing Model | Estimated Price |
| :-- | :-- | :-- |
| **Mass Market** | Freemium + Robo AUM fee | Free + 0.25% AUM |
| **Mass Affluent** | Subscription or AUM | ₹500-2,000/month or 0.5% AUM |
| **HNI** | AUM-based | 0.75-1.0% AUM |
| **UHNWI** | AUM + Service fees | 0.5-0.75% AUM + fees |
| **Family Office** | Enterprise license + AUM | ₹50L+/year + 0.25-0.5% AUM |


***

This comprehensive customization framework ensures each segment receives an appropriately configured experience that matches their needs, sophistication, and willingness to pay.[^5][^4][^10]
<span style="display:none">[^11][^12][^13][^14][^15]</span>

<div align="center">⁂</div>

[^1]: https://www.investopedia.com/robo-advisor-vs-financial-advisor-4775377

[^2]: https://www.linkedin.com/pulse/robo-advisors-vs-human-advisors-luke-dalughut-hcicf

[^3]: https://www.wipro.com/capital-markets/articles/how-wealth-managers-can-win-mass-affluents-with-hyper-personalization/

[^4]: https://www.incedoinc.com/client-segmentation-in-wealth-management/

[^5]: https://www.onevest.com/blog-posts/six-key-features-of-a-configurable-wealth-management-platform

[^6]: https://www.wrightresearch.in/blog/financial-advisors-for-hnis-vs-retail-investors/

[^7]: https://www.iiflcapital.com/blog/personal-finance/robobanking-vs-personal-advisors

[^8]: https://www.f2strategy.com/insight/how-to-identify-the-right-wealth-technology-for-the-new-family-office

[^9]: https://safepacific.com/family-office-vs-multi-family-office-key-differences-benefits-and-which-is-right-for-you/

[^10]: https://vantagepoint.io/blog/sf/ai-driven-client-personalization-transforming-wealth-management-with-smarter-crm

[^11]: https://www.thoughtworks.com/en-in/insights/articles/hyper-personalization-in-wealth-management

[^12]: https://www.flexfunds.com/solutions/personalization-in-wealth-management-trends-for-2025/

[^13]: https://www.kfintech.com/how-private-wealth-management-platforms-add-value-for-wealth-managers/

[^14]: https://www.thewealthmosaic.com/vendors/the-wealth-mosaic/twm-articles/catering-to-the-mass-affluent-why-technology-is-on/

[^15]: https://www.cfainstitute.org/insights/articles/personalization-privacy-data-wealth-management

