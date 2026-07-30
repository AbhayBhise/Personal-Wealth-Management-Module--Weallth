<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Roadmap adjustments based on segment priorities

Based on industry research on wealth management priorities and go-to-market strategies, here's a comprehensive roadmap adjustment based on segment priorities.

# ROADMAP ADJUSTMENTS BASED ON SEGMENT PRIORITIES

## Global Wealth Management Platform - Segment-Driven Phased Implementation

**Date:** January 24, 2026
**Purpose:** Optimize 24-month roadmap based on segment-specific priorities, market opportunity, and strategic considerations
**Framework:** Segment-first approach with shared platform infrastructure

***

## STRATEGIC SEGMENT ANALYSIS

### Market Opportunity Assessment

| Segment | Market Size (India) | Growth Rate | Competition | Profitability | Time to Revenue |
| :-- | :-- | :-- | :-- | :-- | :-- |
| **Mass Market** | 500M+ potential users | 15%+ | High (Paytm, Groww, PhonePe) | Low (₹50-200/user/year) | 18-24 months |
| **Mass Affluent** | 40M+ households | 12% | Medium (Scripbox, Kuvera, INDMoney) | Medium (₹2K-10K/user/year) | 9-12 months |
| **HNI** | 800K+ individuals | 10% | Medium (PMS, Wealth firms) | High (₹50K-2L/client/year) | 6-9 months |
| **UHNWI** | 150K+ individuals | 8% | Low (Few integrated solutions) | Very High (₹5L-20L/client/year) | 6-12 months |
| **Family Office** | 10K+ families | 12% | Very Low (Mostly manual/Excel) | Highest (₹50L+/family/year) | 12-18 months |

### Strategic Recommendation: **HNI-First, Expand Up \& Down**

Based on analysis:[^1][^2][^3]

1. **Start with HNI** - Best balance of revenue potential, manageable complexity, faster time to revenue
2. **Expand to UHNWI** - Higher revenue per client, builds on HNI foundation
3. **Then Mass Affluent** - Scale play, leverage platform built for HNI
4. **Family Office** - Premium tier, longest sales cycle but highest LTV
5. **Mass Market** - Last priority (optional), requires different economics

***

## REVISED ROADMAP OVERVIEW

### Original Roadmap vs. Segment-Adjusted Roadmap

| Phase | Original Focus | **Adjusted Focus** | Rationale |
| :-- | :-- | :-- | :-- |
| **Phase 1 (M1-4)** | Foundation + Investment Mgmt | Foundation + **HNI Core Features** | Faster revenue, prove value |
| **Phase 2 (M5-8)** | Retirement, Education, Lifestyle | **HNI Completion** + UHNWI Start | Deepen HNI, upsell path |
| **Phase 3 (M9-12)** | Estate, Risk, Healthcare, Cash Flow | **UHNWI Core** + Mass Affluent Start | Dual-track expansion |
| **Phase 4 (M13-16)** | ESG, Global, Philanthropy, Succession | **Mass Affluent Scale** + Family Office Start | Volume + Premium |
| **Phase 5 (M17-20)** | Special Needs, Education Fund, Debt, Inheritance | **Family Office Core** + Platform Polish | Complete offering |
| **Phase 6 (M21-24)** | Scale \& Launch | **Full Platform GA** + Mass Market (Optional) | Market expansion |


***

## PHASE 1: HNI FOUNDATION (Months 1-4)

### Target Segment: HNI (\$1M - \$10M)

### Goal: Launch MVP for 50-100 HNI clients via advisor channel

**Why HNI First:**

- Highest revenue per client relative to complexity[^4]
- Advisors eager for consolidated platform (pain point validated)
- 6-9 month sales cycle aligns with development timeline
- Success with HNI creates credibility for UHNWI and Mass Affluent


### Month 1: Platform Foundation + HNI Research

**Week 1-2: HNI-Specific Discovery**

- [ ] Interview 20 HNI clients on pain points
- [ ] Interview 15 wealth advisors/RMs on workflow needs
- [ ] Map competitive landscape (PMS platforms, wealth firm tools)
- [ ] Define HNI-specific ICP (Ideal Client Profile)

**Week 3-4: Technical Foundation**

- [ ] Cloud infrastructure (AWS/Azure)
- [ ] Authentication with enhanced security (HNI requirement)
- [ ] Core API architecture (microservices)
- [ ] Data model for multi-account, multi-entity

**Deliverables:**

- ✅ HNI persona validation
- ✅ Core infrastructure operational
- ✅ Security framework (SOC 2 ready)

***

### Month 2: HNI Account Aggregation

**Focus:** Solve \#1 HNI pain point - fragmented portfolio view[^5]

**Week 5-6: Custodian Integration**

- [ ] Integrate 3 major custodians (HDFC Securities, ICICI Direct, Kotak Securities)
- [ ] PMS data integration (manual upload + API where available)
- [ ] AIF integration (fund admin feeds)

**Week 7-8: Manual Asset Entry**

- [ ] Real estate entry with valuation
- [ ] Unlisted shares/pre-IPO
- [ ] Insurance policy aggregation
- [ ] Loan/liability tracking

**HNI-Specific Features:**


| Feature | HNI Configuration | Mass Market Equivalent |
| :-- | :-- | :-- |
| **Account Types** | Brokerage, PMS, AIF, MF, Insurance, Real Estate, Loans | Bank + basic brokerage only |
| **Refresh Frequency** | Real-time + daily batch | Daily batch only |
| **Manual Entry** | Extensive (alternatives, property) | Minimal |
| **Multi-Currency** | Yes (USD, GBP, SGD) | No |

**Deliverables:**

- ✅ 5+ custodian integrations
- ✅ Complete asset entry for all HNI asset types
- ✅ Unified net worth view

***

### Month 3: HNI Portfolio Analytics \& Performance

**Focus:** Institutional-grade analytics for HNI portfolios

**Week 9-10: Performance Engine**

- [ ] TWR calculation (Modified Dietz)
- [ ] MWR/IRR calculation
- [ ] Performance attribution (asset class, security selection)
- [ ] Benchmark comparison (custom benchmarks)

**Week 11-12: Risk \& Analytics**

- [ ] Risk metrics (Volatility, Sharpe, Beta, Max Drawdown)
- [ ] Asset allocation analysis (12 asset classes)
- [ ] Concentration risk alerts
- [ ] Sector/geography exposure

**HNI-Specific Features:**


| Feature | HNI Configuration | Mass Affluent Equivalent |
| :-- | :-- | :-- |
| **Performance Periods** | Custom date range, since inception | Standard periods only |
| **Attribution** | Full attribution analysis | Basic only |
| **Benchmarking** | Custom blended benchmarks | Pre-set benchmarks |
| **Risk Metrics** | Full suite + factor analysis | Basic metrics |

**Deliverables:**

- ✅ Institutional-grade performance reporting
- ✅ Custom benchmark creation
- ✅ Risk analytics dashboard

***

### Month 4: HNI Advisor Tools \& Beta Launch

**Focus:** Enable advisors to serve HNI clients efficiently

**Week 13-14: Advisor Workbench**

- [ ] Client dashboard for RMs
- [ ] Proposal generation tool
- [ ] Report builder (PDF, Excel, PPT)
- [ ] Task/follow-up management

**Week 15-16: Beta Launch**

- [ ] Onboard 10 advisor firms (50-100 HNI clients)
- [ ] Training program for advisors
- [ ] Feedback collection system
- [ ] Iteration based on feedback

**HNI-Specific Features:**


| Feature | HNI Configuration | Not Available for Lower Segments |
| :-- | :-- | :-- |
| **Advisor Dashboard** | Full client management | Self-service only |
| **White-Label Reports** | Advisor-branded | Platform-branded |
| **Compliance Tracking** | Suitability documentation | N/A |
| **Household View** | Family aggregation | Individual only |

**Deliverables:**

- ✅ Advisor workbench operational
- ✅ 50-100 HNI clients on platform
- ✅ Advisor NPS > 40
- ✅ First revenue (pilot fees from advisors)


### Phase 1 Milestone: HNI MVP Live

- **Clients:** 50-100 HNI
- **Advisors:** 10 firms
- **AUM Tracked:** ₹500 Cr - ₹1,000 Cr
- **Revenue:** ₹10-20 Lakhs (pilot fees)

***

## PHASE 2: HNI COMPLETION + UHNWI START (Months 5-8)

### Target Segments: HNI (complete) + UHNWI (start)

### Goal: Full HNI feature set, begin UHNWI customization

### Month 5: HNI Tax \& Retirement Planning

**HNI Tax Features:**

- [ ] Tax dashboard (estimated liability)
- [ ] Tax-loss harvesting identification
- [ ] Capital gains forecasting
- [ ] Asset location recommendations
- [ ] Tax report generation for CA

**HNI Retirement Features:**

- [ ] Comprehensive retirement calculator
- [ ] Withdrawal strategy optimization
- [ ] NPS/PPF/EPF integration
- [ ] Longevity analysis

**Deliverables:**

- ✅ Tax optimization module for HNI
- ✅ Retirement planning for HNI

***

### Month 6: HNI Estate \& Insurance Planning

**HNI Estate Features:**

- [ ] Estate inventory management
- [ ] Beneficiary tracking \& mismatch alerts
- [ ] Document vault (secure storage)
- [ ] Estate tax projection (basic)

**HNI Insurance Features:**

- [ ] Policy aggregation
- [ ] Gap analysis (life, health, liability)
- [ ] Coverage recommendations
- [ ] Premium tracking

**Deliverables:**

- ✅ Estate planning module for HNI
- ✅ Insurance management for HNI
- ✅ HNI feature set 90% complete

***

### Month 7: UHNWI Foundation - Multi-Entity \& Alternatives

**Focus:** Begin UHNWI-specific features (not needed for HNI/MA)

**UHNWI Multi-Entity:**

- [ ] Entity management (trusts, LLCs, HUFs)
- [ ] Entity-level and consolidated views
- [ ] Inter-entity transfers tracking
- [ ] Role-based access per entity

**UHNWI Alternative Investments:**

- [ ] PE/VC fund tracking[^6]
- [ ] Capital call \& distribution management
- [ ] IRR/TVPI/DPI calculations
- [ ] Vintage year analysis

**UHNWI-Specific Features (Not in HNI):**


| Feature | UHNWI | HNI |
| :-- | :-- | :-- |
| **Multi-Entity** | ✅ Full | ❌ Not needed |
| **PE/VC Tracking** | ✅ Comprehensive | ❌ Basic only |
| **Capital Calls** | ✅ Forecasting | ❌ N/A |
| **Vintage Year** | ✅ Analysis | ❌ N/A |

**Deliverables:**

- ✅ Multi-entity architecture
- ✅ Alternative investment module

***

### Month 8: UHNWI Governance \& HNI Scale

**UHNWI Family Governance:**

- [ ] Family member management
- [ ] Role definitions (patriarch, trustee, beneficiary)
- [ ] Access control per family member
- [ ] Basic family constitution templates

**HNI Scale Activities:**

- [ ] Onboard 20 more advisor firms
- [ ] 500 HNI clients target
- [ ] Performance optimization
- [ ] Feature refinement based on feedback

**Deliverables:**

- ✅ UHNWI governance foundation
- ✅ 500 HNI clients
- ✅ 30 advisor firms
- ✅ ₹5,000 Cr AUM tracked


### Phase 2 Milestone: HNI Complete, UHNWI Started

- **HNI Clients:** 500
- **UHNWI Clients:** 10-20 (early adopters)
- **Advisors:** 30 firms
- **AUM Tracked:** ₹5,000 Cr
- **Revenue:** ₹50-75 Lakhs ARR

***

## PHASE 3: UHNWI CORE + MASS AFFLUENT START (Months 9-12)

### Target Segments: UHNWI (core) + Mass Affluent (start)

### Goal: Complete UHNWI offering, launch Mass Affluent tier

### Month 9: UHNWI Advanced Features

**UHNWI Estate \& Trust:**

- [ ] Trust structure management
- [ ] Trust accounting basics
- [ ] Generation-skipping planning
- [ ] Gifting strategy tracker

**UHNWI Tax (Multi-Jurisdiction):**

- [ ] Multi-country tax consideration
- [ ] FBAR/FATCA compliance tracking
- [ ] International withholding tax

**Deliverables:**

- ✅ Advanced estate planning for UHNWI
- ✅ International tax tracking

***

### Month 10: Mass Affluent MVP

**Focus:** Simplify HNI features for Mass Affluent segment[^7][^5]

**Mass Affluent Account Aggregation:**

- [ ] Simplified onboarding (< 10 minutes)
- [ ] Plaid/Yodlee integration for easy linking
- [ ] Basic manual entry (property, gold)
- [ ] 8 asset class view (vs. 12 for HNI)

**Mass Affluent Portfolio View:**

- [ ] Simplified dashboard
- [ ] Standard performance metrics
- [ ] Pre-set benchmarks (Nifty, S\&P 500)
- [ ] Basic risk score

**Mass Affluent vs. HNI Feature Differences:**


| Feature | Mass Affluent | HNI |
| :-- | :-- | :-- |
| **Onboarding Time** | < 10 min | 1-2 hours (with advisor) |
| **Asset Classes** | 8 | 12 |
| **Alternatives** | Basic (REITs, gold) | Full (PE, AIF, structured) |
| **Benchmarks** | Pre-set | Custom |
| **Tax Optimization** | Basic suggestions | Full optimization |
| **Advisor** | On-demand | Dedicated RM |
| **Price** | ₹500-2K/month or 0.5% AUM | 0.75-1% AUM |

**Deliverables:**

- ✅ Mass Affluent MVP launched
- ✅ Self-service onboarding
- ✅ Hybrid advisor model configured

***

### Month 11: Mass Affluent Goal \& Retirement Planning

**Mass Affluent Goals:**

- [ ] Goal templates (retirement, home, education, FIRE)
- [ ] Progress tracking
- [ ] Basic what-if scenarios
- [ ] SIP recommendations linked to goals

**Mass Affluent Retirement:**

- [ ] Simplified retirement calculator
- [ ] FIRE calculator (segment favorite)
- [ ] NPS/EPF integration
- [ ] Basic withdrawal guidance

**Deliverables:**

- ✅ Goal planning for Mass Affluent
- ✅ FIRE calculator (key differentiator)

***

### Month 12: Platform Integration \& Limited GA

**UHNWI Completion:**

- [ ] Philanthropy module (DAF, charitable planning)
- [ ] Concierge service integration
- [ ] Family meeting support tools

**Mass Affluent Enhancement:**

- [ ] Tax dashboard
- [ ] Basic estate checklist
- [ ] Insurance gap analysis

**Platform Integration:**

- [ ] Cross-segment data architecture validation
- [ ] Performance testing (1,000+ users)
- [ ] Security audit
- [ ] Limited GA launch

**Deliverables:**

- ✅ UHNWI core complete
- ✅ Mass Affluent feature set complete
- ✅ 1,000+ clients across segments


### Phase 3 Milestone: Multi-Segment Platform Live

| Segment | Clients | AUM Tracked | Revenue |
| :-- | :-- | :-- | :-- |
| **HNI** | 800 | ₹8,000 Cr | ₹1.5 Cr ARR |
| **UHNWI** | 50 | ₹5,000 Cr | ₹1 Cr ARR |
| **Mass Affluent** | 2,000 | ₹1,000 Cr | ₹50 L ARR |
| **Total** | 2,850 | ₹14,000 Cr | ₹3 Cr ARR |


***

## PHASE 4: MASS AFFLUENT SCALE + FAMILY OFFICE START (Months 13-16)

### Target Segments: Mass Affluent (scale) + Family Office (start)

### Goal: Scale Mass Affluent to 10K+, begin Family Office tier

### Month 13: Mass Affluent Scale Features

**Scale Enablers:**

- [ ] Marketing website \& content
- [ ] Referral program
- [ ] In-app education content
- [ ] Mobile app optimization

**Mass Affluent Advanced:**

- [ ] RSU/ESOP tracking (tech professional focus)
- [ ] Crypto integration (VDA tax tracking)
- [ ] ESG portfolio scoring
- [ ] Automated rebalancing suggestions

**Deliverables:**

- ✅ 5,000 Mass Affluent users
- ✅ Mobile app enhanced

***

### Month 14: Family Office Foundation

**Focus:** Enterprise features for multi-generational families[^8][^9]

**Family Office Structure:**

- [ ] Multi-generation family tree
- [ ] Branch-level views
- [ ] Consolidated family balance sheet
- [ ] Entity hierarchy management

**Family Office Reporting:**

- [ ] Family-level reporting
- [ ] Branch-level reporting
- [ ] Beneficiary statements
- [ ] Custom report builder

**Family Office vs. UHNWI Differences:**


| Feature | Family Office | UHNWI |
| :-- | :-- | :-- |
| **Family Structure** | Multi-gen, multi-branch | Single household |
| **Entities** | Unlimited | Up to 10 |
| **Reporting** | Custom, enterprise-grade | Standard + custom |
| **Governance** | Full (constitution, meetings) | Basic |
| **Staff** | FO team access | Advisor only |
| **Pricing** | Enterprise (₹50L+/year) | AUM-based |

**Deliverables:**

- ✅ Family Office architecture
- ✅ Multi-generation support

***

### Month 15: Family Office Governance \& Admin

**Governance Features:**

- [ ] Family constitution management
- [ ] Investment committee workflow
- [ ] Meeting management (agenda, minutes, voting)
- [ ] Decision tracking

**Administrative Features:**

- [ ] Bill pay integration
- [ ] Household staff management
- [ ] Vendor coordination
- [ ] Document management

**Deliverables:**

- ✅ Family governance platform
- ✅ Administrative tools

***

### Month 16: Global \& ESG Features (All Segments)

**Global Wealth (UHNWI, Family Office):**

- [ ] Multi-jurisdiction support (India, US, UK, UAE, Singapore)
- [ ] Cross-border tax considerations
- [ ] International estate planning basics
- [ ] Multi-currency optimization

**ESG/SRI (All Segments):**

- [ ] ESG scoring integration[^10]
- [ ] Values-based screening
- [ ] Impact reporting
- [ ] ESG fund recommendations

**Deliverables:**

- ✅ Global wealth features
- ✅ ESG across all segments
- ✅ 3 Family Office clients onboarded


### Phase 4 Milestone: Scale Achieved

| Segment | Clients | AUM Tracked | Revenue |
| :-- | :-- | :-- | :-- |
| **HNI** | 1,500 | ₹15,000 Cr | ₹3 Cr ARR |
| **UHNWI** | 100 | ₹10,000 Cr | ₹2 Cr ARR |
| **Mass Affluent** | 10,000 | ₹5,000 Cr | ₹2 Cr ARR |
| **Family Office** | 5 | ₹7,500 Cr | ₹2.5 Cr ARR |
| **Total** | 11,605 | ₹37,500 Cr | ₹9.5 Cr ARR |


***

## PHASE 5: FAMILY OFFICE COMPLETE + SPECIALIZED (Months 17-20)

### Target Segments: Family Office (complete) + Specialized features

### Goal: Complete Family Office, add specialized modules

### Month 17: Family Office Advanced

**Trust Administration:**

- [ ] Full trust accounting
- [ ] Distribution management
- [ ] Fiduciary compliance tracking
- [ ] Beneficiary portal

**Philanthropy:**

- [ ] Private foundation management
- [ ] Grant workflow
- [ ] Impact measurement
- [ ] Compliance (990-PF preparation)

**Deliverables:**

- ✅ Trust administration
- ✅ Foundation management

***

### Month 18: Specialized Modules (All Segments)

**Business Succession (HNI, UHNWI):**

- [ ] Business valuation tools
- [ ] Succession scenario modeling
- [ ] Buy-sell agreement tracking

**Education Funding (MA, HNI):**

- [ ] College cost projections
- [ ] 529/education savings tracking
- [ ] Multi-child planning

**Debt Management (MM, MA):**

- [ ] Debt consolidation analysis
- [ ] Refinancing recommendations
- [ ] Payoff optimization

**Special Needs (All):**

- [ ] SNT tracking
- [ ] ABLE account integration
- [ ] Benefit preservation analysis

**Deliverables:**

- ✅ Specialized modules complete

***

### Month 19: Inheritance \& Next-Gen

**Inheritance Planning:**

- [ ] Inherited asset workflow
- [ ] Inherited IRA management
- [ ] Stepped-up basis calculator

**Next-Gen Education (UHNWI, FO):**

- [ ] Financial literacy curriculum
- [ ] Progress tracking
- [ ] Family involvement tools

**Deliverables:**

- ✅ Inheritance module
- ✅ Next-gen program

***

### Month 20: Platform Polish \& Optimization

**Performance Optimization:**

- [ ] Database optimization (< 100ms queries)
- [ ] CDN implementation
- [ ] Mobile performance
- [ ] Load testing (50K concurrent users)

**Quality Assurance:**

- [ ] Comprehensive regression testing
- [ ] Security penetration testing
- [ ] Compliance validation
- [ ] SOC 2 Type II certification

**Deliverables:**

- ✅ Performance benchmarks met
- ✅ Security certifications obtained


### Phase 5 Milestone: Full Platform Complete

| Segment | Clients | AUM Tracked | Revenue |
| :-- | :-- | :-- | :-- |
| **HNI** | 2,500 | ₹25,000 Cr | ₹5 Cr ARR |
| **UHNWI** | 200 | ₹20,000 Cr | ₹4 Cr ARR |
| **Mass Affluent** | 25,000 | ₹12,500 Cr | ₹5 Cr ARR |
| **Family Office** | 15 | ₹22,500 Cr | ₹7.5 Cr ARR |
| **Total** | 27,715 | ₹80,000 Cr | ₹21.5 Cr ARR |


***

## PHASE 6: GENERAL AVAILABILITY + MASS MARKET (Months 21-24)

### Target: Full GA + Optional Mass Market

### Goal: Market leadership, scale, profitability

### Month 21: AI/ML Enhancement

**AI Features (All Segments):**

- [ ] AI-powered portfolio optimization
- [ ] Predictive analytics
- [ ] Personalized recommendations engine
- [ ] Natural language queries
- [ ] Behavioral coaching

**Deliverables:**

- ✅ AI features deployed

***

### Month 22: Mass Market (Optional)

**Decision Point:** Evaluate if Mass Market aligns with strategy

**If Proceed with Mass Market:**

- [ ] Simplified mobile-first app
- [ ] Robo-advisor integration
- [ ] Gamified financial education
- [ ] Freemium model
- [ ] Vernacular language support

**Mass Market Economics:**


| Metric | Target |
| :-- | :-- |
| **CAC** | < ₹200 |
| **ARPU** | ₹100-200/year |
| **LTV** | ₹500-1,000 |
| **LTV:CAC** | > 3:1 |
| **Scale Required** | 500K+ users for profitability |

**Alternative:** Partner with existing Mass Market players (Groww, Zerodha, INDMoney) for data feeds and referrals

**Deliverables:**

- ✅ Mass Market MVP (if proceeding)
- ✅ OR Partnership agreements

***

### Month 23: Enterprise \& API

**Enterprise Features:**

- [ ] White-label platform for banks/NBFCs
- [ ] API marketplace
- [ ] Partner portal
- [ ] Bulk operations

**Distribution Partnerships:**

- [ ] Bank partnerships (HDFC, ICICI, Kotak)
- [ ] Wealth firm partnerships
- [ ] CA/CFP network integration

**Deliverables:**

- ✅ Enterprise tier launched
- ✅ 3+ distribution partnerships

***

### Month 24: Full GA \& Expansion

**General Availability:**

- [ ] Marketing campaign launch
- [ ] PR \& media outreach
- [ ] Industry events presence
- [ ] Referral program scaling

**Geographic Expansion:**

- [ ] NRI market (US, UK, UAE, Singapore)
- [ ] Preparation for international launch

**Fundraising:**

- [ ] Series A completion (₹100-200 Cr target)

**Deliverables:**

- ✅ Full General Availability
- ✅ Series A funded
- ✅ Market leadership position


### Phase 6 Milestone: Market Leader

| Segment | Clients | AUM Tracked | Revenue |
| :-- | :-- | :-- | :-- |
| **HNI** | 5,000 | ₹50,000 Cr | ₹10 Cr ARR |
| **UHNWI** | 400 | ₹40,000 Cr | ₹8 Cr ARR |
| **Mass Affluent** | 50,000 | ₹25,000 Cr | ₹10 Cr ARR |
| **Family Office** | 30 | ₹45,000 Cr | ₹15 Cr ARR |
| **Mass Market** | 100,000 | ₹5,000 Cr | ₹2 Cr ARR |
| **Total** | 155,430 | ₹1,65,000 Cr | ₹45 Cr ARR |


***

## RESOURCE ALLOCATION BY SEGMENT

### Team Structure by Phase

| Phase | Total Team | HNI Focus | UHNWI Focus | MA Focus | FO Focus | Platform |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| **P1 (M1-4)** | 25 | 60% | 0% | 0% | 0% | 40% |
| **P2 (M5-8)** | 35 | 40% | 30% | 0% | 0% | 30% |
| **P3 (M9-12)** | 45 | 20% | 30% | 30% | 0% | 20% |
| **P4 (M13-16)** | 55 | 15% | 15% | 35% | 20% | 15% |
| **P5 (M17-20)** | 60 | 10% | 15% | 20% | 35% | 20% |
| **P6 (M21-24)** | 70 | 10% | 10% | 25% | 20% | 35% |

### Budget Allocation by Segment

| Segment | Phase 1-2 | Phase 3-4 | Phase 5-6 | Total |
| :-- | :-- | :-- | :-- | :-- |
| **HNI** | ₹3 Cr | ₹1.5 Cr | ₹1 Cr | ₹5.5 Cr |
| **UHNWI** | ₹1 Cr | ₹2.5 Cr | ₹1.5 Cr | ₹5 Cr |
| **Mass Affluent** | ₹0 | ₹2.5 Cr | ₹2 Cr | ₹4.5 Cr |
| **Family Office** | ₹0 | ₹1.5 Cr | ₹3.5 Cr | ₹5 Cr |
| **Platform/Infra** | ₹2 Cr | ₹2 Cr | ₹2 Cr | ₹6 Cr |
| **Total** | ₹6 Cr | ₹10 Cr | ₹10 Cr | ₹26 Cr |


***

## REVENUE PROJECTION BY SEGMENT

### Monthly Revenue Buildup (₹ Lakhs ARR)

| Month | HNI | UHNWI | MA | FO | Total |
| :-- | :-- | :-- | :-- | :-- | :-- |
| M4 | 20 | 0 | 0 | 0 | 20 |
| M8 | 75 | 25 | 0 | 0 | 100 |
| M12 | 150 | 100 | 50 | 0 | 300 |
| M16 | 300 | 200 | 200 | 250 | 950 |
| M20 | 500 | 400 | 500 | 750 | 2,150 |
| M24 | 1,000 | 800 | 1,000 | 1,500 | 4,300 |

### Unit Economics by Segment

| Segment | ACV | CAC | Payback | LTV | LTV:CAC |
| :-- | :-- | :-- | :-- | :-- | :-- |
| **Mass Affluent** | ₹5K | ₹2K | 5 months | ₹25K | 12:1 |
| **HNI** | ₹2L | ₹50K | 3 months | ₹10L | 20:1 |
| **UHNWI** | ₹20L | ₹2L | 1 month | ₹1Cr | 50:1 |
| **Family Office** | ₹50L | ₹5L | 1 month | ₹2.5Cr | 50:1 |


***

## GO-TO-MARKET STRATEGY BY SEGMENT

### HNI (Primary Launch Segment)

| GTM Element | Strategy |
| :-- | :-- |
| **Channel** | B2B via wealth advisors, RIAs, MFDs |
| **Sales Motion** | Advisor enablement → advisor brings HNI clients |
| **Pricing** | 0.75-1.0% AUM (advisor pays, passes to client) |
| **Marketing** | Advisor conferences, LinkedIn, referrals |
| **Sales Cycle** | 3-6 months |

### UHNWI (Expansion)

| GTM Element | Strategy |
| :-- | :-- |
| **Channel** | Direct + Family office consultants |
| **Sales Motion** | Consultative selling, customization discussions |
| **Pricing** | 0.5-0.75% AUM + service fees |
| **Marketing** | Private events, referrals, exclusive content |
| **Sales Cycle** | 6-12 months |

### Mass Affluent (Scale)

| GTM Element | Strategy |
| :-- | :-- |
| **Channel** | B2C digital + B2B via IFAs |
| **Sales Motion** | Self-service + hybrid support |
| **Pricing** | ₹500-2K/month subscription or 0.5% AUM |
| **Marketing** | Content marketing, SEO, paid digital, influencers |
| **Sales Cycle** | Days to weeks (self-service) |

### Family Office (Premium)

| GTM Element | Strategy |
| :-- | :-- |
| **Channel** | Direct enterprise sales |
| **Sales Motion** | RFP response, POC, customization |
| **Pricing** | ₹50L+/year enterprise license + AUM |
| **Marketing** | Industry events, thought leadership, referrals |
| **Sales Cycle** | 12-18 months |


***

## RISK MITIGATION BY SEGMENT

| Risk | Mitigation |
| :-- | :-- |
| **HNI adoption slower than expected** | Increase advisor incentives, extend pilot |
| **UHNWI sales cycle too long** | Focus on HNI scale first, UHNWI as upsell |
| **Mass Affluent CAC too high** | Lean into B2B (advisor) channel, reduce B2C spend |
| **Family Office customization demands** | Define clear product boundaries, professional services for custom |
| **Competition from incumbents** | Focus on integration (aggregation) as differentiator |
| **Regulatory changes** | Build compliance flexibility, maintain legal counsel |


***

## ADJUSTED ROADMAP SUMMARY

### Original vs. Adjusted Timeline

| Milestone | Original | **Adjusted** | Change |
| :-- | :-- | :-- | :-- |
| **MVP Launch** | Month 4 | Month 4 | Same |
| **First Revenue** | Month 12 | **Month 4** | -8 months |
| **₹1 Cr ARR** | Month 18 | **Month 14** | -4 months |
| **₹10 Cr ARR** | Month 24 | **Month 20** | -4 months |
| **16 Modules Live** | Month 20 | Month 20 | Same |
| **50,000 Users** | Month 24 | Month 22 | -2 months |

### Key Adjustments Made

1. **HNI-first** instead of feature-first → Faster revenue[^2][^3]
2. **Advisor channel** as primary GTM → Lower CAC, faster adoption
3. **UHNWI as upsell** from HNI → Natural expansion path
4. **Mass Affluent simplified** from HNI features → Reuse, faster development
5. **Family Office as premium tier** → Highest revenue, longest development
6. **Mass Market optional** → Evaluate based on market conditions

***

**Document Created:** January 24, 2026
**Roadmap Version:** 2.0 (Segment-Adjusted)
**Next Review:** End of Phase 1 (Month 4)
**Status:** Ready for Implementation
<span style="display:none">[^11][^12][^13][^14][^15][^16][^17][^18]</span>

<div align="center">⁂</div>

[^1]: https://www.pwc.com/gx/en/issues/transformation/asset-wealth-management/pwc-awm-revolution-2025.pdf

[^2]: https://aexus.com/go-to-market-strategy-for-fintech/

[^3]: https://upgrowth.in/go-to-market-strategy-analysis-for-fintech-companies-a-comprehensive-guide/

[^4]: https://datos-insights.com/reports/wmf-2025-strategic-priorities-for-wealth-managers-and-technology-vendors/

[^5]: https://www.investsuite.com/insights/blogs/current-expectations-in-wealth-management-2024-2025-insights

[^6]: https://www.thewealthmosaic.com/vendors/the-wealth-mosaic/blogs/inside-the-future-view-toolkit/

[^7]: https://www.wipro.com/capital-markets/articles/how-wealth-managers-can-win-mass-affluents-with-hyper-personalization/

[^8]: https://www.f2strategy.com/insight/how-to-identify-the-right-wealth-technology-for-the-new-family-office

[^9]: https://safepacific.com/family-office-vs-multi-family-office-key-differences-benefits-and-which-is-right-for-you/

[^10]: https://www.capgemini.com/insights/research-library/wealth-management-top-trends-2025/

[^11]: https://www.ey.com/content/dam/ey-unified-site/ey-com/en-ae/insights/wealth-asset-management/documents/ey-gcc-wealth-management-industry-report-11-2025.pdf

[^12]: https://newsroom.envestnet.com/2025-09-08-ENVESTNET-ANNOUNCES-FIVE-YEAR-STRATEGIC-ROADMAP,-MARKED-BY-INVESTMENTS-IN-RESEARCH-DEVELOPMENT,-CLIENT-SUPPORT-AND-AI

[^13]: https://www.finrofca.com/startup-qa/unlocking-the-potential-of-mvps

[^14]: https://rocketech.it/blog/post/when-to-launch-an-mvp-7-scenarios-where-its-crucial

[^15]: https://www.gigcmo.com/blog/mastering-go-to-market-strategies-for-fintech-companies

[^16]: https://www.rishabhsoft.com/blog/mvp-development-for-startups

[^17]: https://www.empaxis.com/blog/wealth-management-trends

[^18]: https://www.airmeet.com/hub/blog/7-gtm-strategies-for-fintech-companies-in-2025/

