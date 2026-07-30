<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Revised timeline for MVP launches per segment

Based on industry research on fintech MVP development timelines and multi-segment SaaS strategies, here's a detailed revised timeline for MVP launches per segment.

# REVISED MVP LAUNCH TIMELINE BY SEGMENT

## Global Wealth Management Platform - Segment-Specific MVP Roadmap

**Date:** January 24, 2026
**Purpose:** Define precise MVP scope, timeline, and launch criteria for each wealth segment
**Methodology:** Staged rollout based on segment priority, shared platform leverage, and market validation

***

## MVP LAUNCH PHILOSOPHY

### Core Principles

Based on fintech MVP best practices:[^1][^2][^3]

1. **Segment-Sequential Launch** - Launch MVPs in order of revenue priority, not feature completeness
2. **Shared Platform, Custom Experience** - Build core once, customize UX per segment
3. **Validation Before Expansion** - Validate each segment MVP before launching next
4. **Time-Boxed Development** - Each MVP within 8-16 weeks of focused development
5. **Revenue-Generating from Day 1** - Charge from MVP launch, not after "full product"

### MVP Definition by Segment

| Segment | MVP Definition | Success Threshold |
| :-- | :-- | :-- |
| **HNI** | Minimum features for advisor to serve HNI client daily | 50 clients, 10 advisors actively using |
| **UHNWI** | HNI + alternative assets + multi-entity | 20 clients, ₹500 Cr AUM |
| **Mass Affluent** | Simplified HNI features, self-service | 1,000 users, 20% weekly active |
| **Family Office** | UHNWI + governance + consolidated reporting | 3 families onboarded |
| **Mass Market** | Basic budgeting + goal tracking + robo | 10,000 users, 10% weekly active |


***

## SEGMENT MVP LAUNCH TIMELINE OVERVIEW

```
2026                                              2027
Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct  Nov  Dec  Jan  Feb  Mar  Apr  May  Jun  Jul  Aug
|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
     [====PLATFORM FOUNDATION====]
          [========HNI MVP========]
               LAUNCH ▲ (Month 4)
                    [====HNI V1.1====]
                         [=====UHNWI MVP=====]
                              LAUNCH ▲ (Month 8)
                                   [====MASS AFFLUENT MVP====]
                                        LAUNCH ▲ (Month 11)
                                             [====FAMILY OFFICE MVP====]
                                                  LAUNCH ▲ (Month 15)
                                                       [====MASS MARKET MVP====]
                                                            LAUNCH ▲ (Month 20)
```


### Summary Launch Dates

| Segment | MVP Start | MVP Launch | GA Launch | Development Time |
| :-- | :-- | :-- | :-- | :-- |
| **HNI** | Month 1 | **Month 4 (Apr 2026)** | Month 8 | 16 weeks |
| **UHNWI** | Month 5 | **Month 8 (Aug 2026)** | Month 12 | 12 weeks |
| **Mass Affluent** | Month 8 | **Month 11 (Nov 2026)** | Month 14 | 12 weeks |
| **Family Office** | Month 12 | **Month 15 (Mar 2027)** | Month 20 | 12 weeks |
| **Mass Market** | Month 17 | **Month 20 (Aug 2027)** | Month 24 | 12 weeks |


***

## MVP 1: HNI (HIGH NET WORTH INDIVIDUALS)

### Timeline: Months 1-4 (January - April 2026)

**Launch Date:** April 30, 2026
**Development Duration:** 16 weeks[^4][^1]
**Team Size:** 20 people
**Budget:** ₹2.5 Crores

### Week-by-Week Development Timeline

#### Stage 1: Discovery \& Research (Weeks 1-2)[^1]

| Week | Activities | Deliverables |
| :-- | :-- | :-- |
| **Week 1** | HNI persona validation (15 interviews), advisor workflow mapping, competitive analysis | Validated personas, journey maps |
| **Week 2** | Technical architecture design, compliance requirements (SEBI, RBI), vendor selection | Architecture doc, compliance checklist |

#### Stage 2: Design \& Prototyping (Weeks 3-4)[^2]

| Week | Activities | Deliverables |
| :-- | :-- | :-- |
| **Week 3** | UI/UX design for advisor workbench, client dashboard wireframes | Figma wireframes |
| **Week 4** | Interactive prototype, user testing with 5 advisors | Tested prototype, feedback incorporated |

#### Stage 3: Core Development (Weeks 5-12)[^1]

| Week | Sprint Focus | Features Delivered |
| :-- | :-- | :-- |
| **Week 5-6** | Platform foundation | Auth, user management, API gateway, database |
| **Week 7-8** | Account aggregation | Custodian integration (HDFC, ICICI, Kotak), manual entry |
| **Week 9-10** | Portfolio analytics | Holdings view, asset allocation, performance (TWR/MWR) |
| **Week 11-12** | Advisor tools | Client dashboard, basic reporting, task management |

#### Stage 4: Testing \& QA (Weeks 13-14)[^1]

| Week | Activities | Deliverables |
| :-- | :-- | :-- |
| **Week 13** | Integration testing, security testing, performance testing | Test reports, bug fixes |
| **Week 14** | UAT with 5 pilot advisors, compliance review | UAT sign-off, compliance approval |

#### Stage 5: Launch \& Feedback (Weeks 15-16)[^1]

| Week | Activities | Deliverables |
| :-- | :-- | :-- |
| **Week 15** | Soft launch to 10 advisors (50 clients), training sessions | Onboarded users, training materials |
| **Week 16** | Feedback collection, critical bug fixes, stabilization | Stable MVP, feedback backlog |

### HNI MVP Feature Scope

#### Included in MVP ✅

| Module | MVP Features | Excluded (V1.1+) |
| :-- | :-- | :-- |
| **Onboarding** | Digital KYC, risk questionnaire, basic profile | IPS creation, family mapping |
| **Aggregation** | 3 custodians, MF, insurance, manual entry | All custodians, real-time refresh |
| **Portfolio** | Holdings, allocation (8 classes), basic performance | 12 classes, attribution, factors |
| **Performance** | TWR, absolute returns, 5 standard periods | Custom periods, MWR, benchmarks |
| **Risk** | Basic risk score, concentration alerts | Full metrics, VaR, stress testing |
| **Reporting** | Portfolio summary PDF, holdings Excel | Custom reports, scheduled delivery |
| **Advisor Tools** | Client list, basic dashboard, notes | Proposals, compliance, bulk operations |

#### MVP Success Criteria

| Metric | Target | Measurement |
| :-- | :-- | :-- |
| **Advisors Onboarded** | 10 firms | Count |
| **HNI Clients** | 50 | Count |
| **AUM Tracked** | ₹250 Cr | Sum of portfolio values |
| **Daily Active Advisors** | 60% | DAU/Total advisors |
| **Data Accuracy** | 99%+ | Reconciliation |
| **NPS (Advisor)** | 40+ | Survey |
| **Critical Bugs** | 0 | Post-launch week |

### HNI MVP Cost Breakdown

| Category | Cost (₹) | % of Total |
| :-- | :-- | :-- |
| **Engineering (12 developers × 4 months)** | 1.44 Cr | 58% |
| **Design (3 designers × 4 months)** | 36 L | 14% |
| **Product (2 PMs × 4 months)** | 24 L | 10% |
| **Infrastructure (AWS)** | 15 L | 6% |
| **Data/API Licenses** | 20 L | 8% |
| **Compliance/Legal** | 10 L | 4% |
| **Total** | **2.49 Cr** | 100% |


***

## MVP 2: UHNWI (ULTRA HIGH NET WORTH)

### Timeline: Months 5-8 (May - August 2026)

**Launch Date:** August 31, 2026
**Development Duration:** 12 weeks (builds on HNI platform)
**Team Size:** 15 people (incremental)
**Budget:** ₹1.5 Crores (incremental)

### Development Timeline

#### Stage 1: UHNWI Discovery (Weeks 1-2)

| Week | Activities | Deliverables |
| :-- | :-- | :-- |
| **Week 1** | UHNWI interviews (10 clients), family office consultant input | UHNWI-specific requirements |
| **Week 2** | Delta design (what's different from HNI), architecture extension | Extension architecture |

#### Stage 2: Core UHNWI Development (Weeks 3-10)

| Week | Sprint Focus | Features Delivered |
| :-- | :-- | :-- |
| **Week 3-4** | Multi-entity architecture | Entity management, trust/LLC support, consolidated view |
| **Week 5-6** | Alternative investments | PE/VC tracking, capital calls, distributions, IRR |
| **Week 7-8** | Advanced reporting | Entity-level reports, family balance sheet |
| **Week 9-10** | UHNWI-specific UX | Customized dashboard, enhanced security |

#### Stage 3: Testing \& Launch (Weeks 11-12)

| Week | Activities | Deliverables |
| :-- | :-- | :-- |
| **Week 11** | Integration testing, UHNWI pilot (5 clients) | Test completion |
| **Week 12** | Soft launch, training, feedback | UHNWI MVP live |

### UHNWI MVP Feature Scope (Delta from HNI)

| Module | UHNWI MVP Additions | Excluded (V1.1+) |
| :-- | :-- | :-- |
| **Multi-Entity** | ✅ Trusts, LLCs, HUFs, consolidated view | Unlimited entities, entity accounting |
| **Alternatives** | ✅ PE/VC tracking, capital calls, IRR/TVPI | Hedge funds, private credit, co-invest |
| **Real Estate** | ✅ Property tracking with manual valuation | Automated valuation, rental tracking |
| **Reporting** | ✅ Family balance sheet, entity reports | Custom report builder |
| **Security** | ✅ Enhanced MFA, session controls | Hardware keys, IP restrictions |
| **Governance** | ❌ Not in MVP | Family constitution, meetings |

#### UHNWI MVP Success Criteria

| Metric | Target | Measurement |
| :-- | :-- | :-- |
| **UHNWI Clients** | 20 | Count |
| **AUM Tracked** | ₹500 Cr | Sum |
| **Entities Managed** | 50+ | Count |
| **Alternative Assets Tracked** | ₹100 Cr | Value |
| **Client NPS** | 50+ | Survey |

### UHNWI MVP Cost Breakdown (Incremental)

| Category | Cost (₹) | Notes |
| :-- | :-- | :-- |
| **Engineering (8 developers × 3 months)** | 72 L | Builds on HNI platform |
| **Design (2 designers × 3 months)** | 18 L | UX customization |
| **Product (1 PM × 3 months)** | 9 L | UHNWI focus |
| **Infrastructure** | 10 L | Incremental |
| **Alternative Data Feeds** | 25 L | PE/VC data |
| **Total Incremental** | **1.34 Cr** |  |


***

## MVP 3: MASS AFFLUENT

### Timeline: Months 8-11 (August - November 2026)

**Launch Date:** November 30, 2026
**Development Duration:** 12 weeks (simplification of HNI)
**Team Size:** 12 people
**Budget:** ₹1.2 Crores

### Development Timeline

#### Stage 1: Mass Affluent Research (Weeks 1-2)

| Week | Activities | Deliverables |
| :-- | :-- | :-- |
| **Week 1** | Mass affluent surveys (100 responses), competitor analysis (INDMoney, Groww) | User requirements |
| **Week 2** | Simplified UX design, self-service flow mapping | Simplified wireframes |

#### Stage 2: Simplification \& Self-Service (Weeks 3-10)

| Week | Sprint Focus | Features Delivered |
| :-- | :-- | :-- |
| **Week 3-4** | Simplified onboarding | Quick signup, basic risk quiz, Plaid integration |
| **Week 5-6** | Self-service aggregation | Easy account linking, 5-minute setup |
| **Week 7-8** | Simplified portfolio view | Clean dashboard, basic metrics, mobile-first |
| **Week 9-10** | Goal planning | Goal templates, progress tracking, SIP recommendations |

#### Stage 3: Testing \& Launch (Weeks 11-12)

| Week | Activities | Deliverables |
| :-- | :-- | :-- |
| **Week 11** | Beta launch (500 users), mobile testing | Beta feedback |
| **Week 12** | Public launch, marketing activation | MA MVP live |

### Mass Affluent MVP Feature Scope

| Module | Mass Affluent MVP | Different from HNI |
| :-- | :-- | :-- |
| **Onboarding** | 5-question risk quiz, Aadhaar KYC | Simpler than HNI |
| **Aggregation** | Plaid/Yodlee, 5 custodians, basic manual | Fewer integrations |
| **Portfolio** | 6 asset classes, simplified view | Fewer classes |
| **Performance** | Absolute + simple %, 3 periods | Fewer metrics |
| **Goals** | ✅ Templates, progress, SIP link | New (not in HNI MVP) |
| **Retirement** | ✅ Basic calculator, FIRE mode | Simplified |
| **Advisor** | On-demand (pay per session) | Optional, not default |
| **Mobile** | ✅ Mobile-first design | Priority for MA |

#### Mass Affluent MVP Success Criteria

| Metric | Target | Measurement |
| :-- | :-- | :-- |
| **Registered Users** | 2,000 | Count |
| **Weekly Active Users** | 25% | WAU/Total |
| **Accounts Linked** | 3,000+ | Count |
| **Goals Created** | 1,500+ | Count |
| **Paid Subscribers** | 200 (10%) | Conversion |
| **NPS** | 40+ | Survey |
| **App Store Rating** | 4.2+ | Rating |

### Mass Affluent MVP Cost Breakdown

| Category | Cost (₹) | Notes |
| :-- | :-- | :-- |
| **Engineering (6 developers × 3 months)** | 54 L | Reuse HNI components |
| **Design (2 designers × 3 months)** | 18 L | Simplified UX |
| **Product (1 PM × 3 months)** | 9 L | MA focus |
| **Mobile Development** | 20 L | React Native |
| **Marketing (launch)** | 15 L | Digital campaigns |
| **Total** | **1.16 Cr** |  |


***

## MVP 4: FAMILY OFFICE

### Timeline: Months 12-15 (December 2026 - March 2027)

**Launch Date:** March 31, 2027
**Development Duration:** 12 weeks (builds on UHNWI)
**Team Size:** 15 people
**Budget:** ₹2 Crores

### Development Timeline

#### Stage 1: Family Office Discovery (Weeks 1-3)

| Week | Activities | Deliverables |
| :-- | :-- | :-- |
| **Week 1-2** | Family office interviews (5 families), consultant partnerships | Deep requirements |
| **Week 3** | Enterprise architecture design, security enhancement | FO architecture |

#### Stage 2: Family Office Features (Weeks 4-10)

| Week | Sprint Focus | Features Delivered |
| :-- | :-- | :-- |
| **Week 4-5** | Multi-generation structure | Family tree, G1/G2/G3, branch views |
| **Week 6-7** | Consolidated reporting | Family balance sheet, branch reports, custom reports |
| **Week 8-9** | Governance | Basic family constitution, meeting support |
| **Week 10** | External collaboration | Advisor portal, document sharing |

#### Stage 3: Enterprise Launch (Weeks 11-12)

| Week | Activities | Deliverables |
| :-- | :-- | :-- |
| **Week 11** | Pilot with 2 families, enterprise security audit | Pilot feedback |
| **Week 12** | Enterprise launch, dedicated onboarding | FO MVP live |

### Family Office MVP Feature Scope (Delta from UHNWI)

| Module | Family Office MVP | Excluded (V1.1+) |
| :-- | :-- | :-- |
| **Family Structure** | ✅ Multi-gen, branches, relationships | Unlimited complexity |
| **Consolidated Reporting** | ✅ Family balance sheet, branch reports | Full custom builder |
| **Governance** | ✅ Basic constitution, meeting notes | Voting, investment committee |
| **Access Control** | ✅ Role-based (principal, member, staff) | Granular permissions |
| **External Advisors** | ✅ Advisor portal with controlled access | Full collaboration suite |
| **Trust Admin** | ❌ Not in MVP | Trust accounting, distributions |
| **Philanthropy** | ❌ Not in MVP | Foundation management |

#### Family Office MVP Success Criteria

| Metric | Target | Measurement |
| :-- | :-- | :-- |
| **Families Onboarded** | 3 | Count |
| **Family Members** | 30+ | Total across families |
| **AUM Tracked** | ₹1,500 Cr | Sum |
| **Entities Managed** | 100+ | Count |
| **Annual Contract Value** | ₹1.5 Cr | Revenue |
| **Client NPS** | 60+ | Survey |

### Family Office MVP Cost Breakdown

| Category | Cost (₹) | Notes |
| :-- | :-- | :-- |
| **Engineering (10 developers × 3 months)** | 90 L | Enterprise complexity |
| **Design (2 designers × 3 months)** | 18 L | Custom dashboards |
| **Product (2 PMs × 3 months)** | 18 L | Enterprise requirements |
| **Security Enhancement** | 25 L | Enterprise security |
| **Professional Services** | 30 L | Implementation support |
| **Total** | **1.81 Cr** |  |


***

## MVP 5: MASS MARKET (Optional)

### Timeline: Months 17-20 (May - August 2027)

**Launch Date:** August 31, 2027
**Development Duration:** 12 weeks
**Team Size:** 10 people
**Budget:** ₹1 Crore

### Go/No-Go Decision Criteria (Month 16)

Before proceeding with Mass Market MVP, evaluate:


| Criterion | Threshold | Rationale |
| :-- | :-- | :-- |
| **MA User Growth** | 25K+ users | Validates consumer demand |
| **MA Unit Economics** | LTV:CAC > 5:1 | Proves B2C can work |
| **Platform Stability** | 99.9% uptime | Infrastructure ready for scale |
| **Funding Secured** | Series A closed | Capital for user acquisition |
| **Competitive Position** | Clear differentiation | Avoid commodity battle |

**Decision:** Proceed with Mass Market only if all criteria met. Otherwise, double down on Mass Affluent scale.

### Mass Market MVP Feature Scope (If Proceed)

| Module | Mass Market MVP | Why |
| :-- | :-- | :-- |
| **Onboarding** | 3-minute signup, Aadhaar OTP | Frictionless |
| **Budgeting** | ✅ Auto-categorized expenses, budget templates | Core need |
| **Goals** | ✅ Simple goals (emergency fund, vacation) | Motivational |
| **Savings** | ✅ Round-ups, auto-transfer rules | Automation |
| **Investing** | ✅ Robo-advisor (3 model portfolios) | Guided |
| **Education** | ✅ Short videos, quizzes, gamification | Engagement |
| **Portfolio** | Basic view (what you own, simple returns) | Simplified |

#### Mass Market MVP Success Criteria

| Metric | Target | Measurement |
| :-- | :-- | :-- |
| **Registered Users** | 25,000 | Count |
| **Weekly Active Users** | 15% | WAU/Total |
| **Paid Conversions** | 3% | Premium/Total |
| **CAC** | < ₹150 | Marketing spend/acquisitions |
| **App Store Rating** | 4.3+ | Rating |


***

## CONSOLIDATED MVP TIMELINE GANTT

```
                    2026                                         2027
         Q1          Q2          Q3          Q4          Q1          Q2          Q3
    Jan Feb Mar | Apr May Jun | Jul Aug Sep | Oct Nov Dec | Jan Feb Mar | Apr May Jun | Jul Aug
    ----+---+---|----+---+---|----+---+---|----+---+---|----+---+---|----+---+---|----+---
         
PLATFORM |███████████|
         [Foundation]
         
HNI      |   |███████████████████|▲|
         [  Discovery  ][  Development  ][Launch]
                                        MVP
         
UHNWI               |       |██████████████████|▲|
                    [      HNI V1.1     ][ UHNWI Dev ][Launch]
                                                     MVP
                                                     
MASS AFF                        |       |████████████████|▲|
                                [   UHNWI V1.1  ][ MA Dev ][Launch]
                                                          MVP
                                                          
FAMILY                                          |       |████████████████████|▲|
OFFICE                                          [  MA Scale ][ FO Discovery ][ FO Dev ][Launch]
                                                                                        MVP
                                                                                        
MASS MKT                                                            |Decision|████████████████|▲|
(Optional)                                                          [Go/NoGo][   MM Dev   ][Launch]
                                                                                              MVP
```


***

## FEATURE ROLLOUT MATRIX

### Features by MVP Launch

| Feature | HNI MVP (M4) | UHNWI MVP (M8) | MA MVP (M11) | FO MVP (M15) | MM MVP (M20) |
| :-- | :--: | :--: | :--: | :--: | :--: |
| **Account Aggregation** | ✅ 3 custodians | ✅ +alternatives | ✅ Simplified | ✅ Full | ✅ Basic |
| **Portfolio View** | ✅ 8 classes | ✅ 12 classes | ✅ 6 classes | ✅ Full | ✅ 3 classes |
| **Performance Analytics** | ✅ Basic | ✅ Advanced | ✅ Simple | ✅ Attribution | ✅ Absolute |
| **Multi-Entity** | ❌ | ✅ | ❌ | ✅ Full | ❌ |
| **Alternative Investments** | ❌ | ✅ PE/VC | ❌ | ✅ Full | ❌ |
| **Goal Planning** | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Retirement Calculator** | ❌ | ❌ | ✅ Basic | ✅ | ✅ Simple |
| **Tax Optimization** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Estate Planning** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Family Governance** | ❌ | ❌ | ❌ | ✅ Basic | ❌ |
| **Advisor Tools** | ✅ Basic | ✅ Enhanced | ❌ | ✅ Full | ❌ |
| **Mobile App** | ⚪ Basic | ⚪ Basic | ✅ Primary | ✅ | ✅ Primary |
| **Robo-Advisor** | ❌ | ❌ | ⚪ Optional | ❌ | ✅ |
| **Budgeting** | ❌ | ❌ | ⚪ Optional | ❌ | ✅ |

**Legend:** ✅ Included | ⚪ Partial | ❌ Not included

***

## POST-MVP ITERATION CYCLES

### V1.1 Release Schedule (After Each MVP)

| Segment | MVP Launch | V1.1 Release | V1.1 Features |
| :-- | :-- | :-- | :-- |
| **HNI** | M4 | M6 | Tax optimization, retirement planning, estate basics |
| **UHNWI** | M8 | M10 | Governance, philanthropy basics, advanced reporting |
| **Mass Affluent** | M11 | M13 | Tax dashboard, RSU tracking, enhanced goals |
| **Family Office** | M15 | M18 | Trust admin, philanthropy, full governance |
| **Mass Market** | M20 | M22 | Enhanced education, social features |

### Continuous Improvement Cycle

```
MVP Launch → 4 weeks feedback → V1.1 Planning → 6 weeks development → V1.1 Launch
    │                                                                       │
    └───────────────────── 10-12 week cycle ────────────────────────────────┘
```


***

## RESOURCE LOADING BY MVP

### Team Allocation Timeline

| Month | Platform | HNI | UHNWI | MA | FO | MM | Total |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| M1-2 | 10 | 10 | 0 | 0 | 0 | 0 | **20** |
| M3-4 | 5 | 15 | 0 | 0 | 0 | 0 | **20** |
| M5-6 | 5 | 10 | 10 | 0 | 0 | 0 | **25** |
| M7-8 | 5 | 5 | 15 | 0 | 0 | 0 | **25** |
| M9-10 | 5 | 5 | 5 | 12 | 0 | 0 | **27** |
| M11-12 | 5 | 5 | 5 | 10 | 10 | 0 | **35** |
| M13-14 | 5 | 5 | 5 | 10 | 15 | 0 | **40** |
| M15-16 | 5 | 5 | 5 | 10 | 15 | 0 | **40** |
| M17-18 | 5 | 5 | 5 | 10 | 10 | 10 | **45** |
| M19-20 | 5 | 5 | 5 | 10 | 10 | 15 | **50** |


***

## RISK MITIGATION BY MVP

| MVP | Key Risk | Mitigation Strategy | Contingency |
| :-- | :-- | :-- | :-- |
| **HNI** | Advisor adoption slow | Intensive training, co-selling with advisors | Extend pilot, increase incentives |
| **UHNWI** | Long sales cycle | Start conversations early (M1), use HNI success stories | Pivot to more HNI scale |
| **Mass Affluent** | High CAC | B2B (advisor) channel primary, B2C secondary | Reduce B2C spend, focus B2B |
| **Family Office** | Customization demands | Clear product boundaries, professional services tier | Productize common customizations |
| **Mass Market** | Unit economics don't work | Go/No-Go gate at M16 | Skip MM, focus on MA scale |


***

## MVP LAUNCH CHECKLIST

### Pre-Launch (2 Weeks Before)

- [ ] All P0 features complete and tested
- [ ] Security penetration testing passed
- [ ] Performance benchmarks met (< 2s load, < 200ms API)
- [ ] Compliance review approved
- [ ] Support team trained
- [ ] Documentation complete
- [ ] Marketing materials ready
- [ ] Pilot users identified and scheduled


### Launch Week

- [ ] Soft launch to pilot users (Day 1-3)
- [ ] Monitor metrics hourly
- [ ] Daily standup for launch issues
- [ ] Critical bug fix SLA: 4 hours
- [ ] Collect feedback via in-app survey
- [ ] Wider launch (Day 5-7)
- [ ] Press release / announcement


### Post-Launch (2 Weeks After)

- [ ] Analyze user behavior data
- [ ] Conduct user interviews (10+)
- [ ] Prioritize V1.1 backlog
- [ ] Celebrate launch 🎉
- [ ] Begin next MVP development

***

## SUMMARY: MVP LAUNCH CALENDAR

| Date | Milestone | Segment | Key Metric |
| :-- | :-- | :-- | :-- |
| **Jan 27, 2026** | Development Kickoff | Platform + HNI | Team onboarded |
| **Apr 30, 2026** | 🚀 **HNI MVP Launch** | HNI | 50 clients, 10 advisors |
| **Jun 30, 2026** | HNI V1.1 Release | HNI | Tax, retirement added |
| **Aug 31, 2026** | 🚀 **UHNWI MVP Launch** | UHNWI | 20 clients, ₹500 Cr AUM |
| **Nov 30, 2026** | 🚀 **Mass Affluent MVP Launch** | MA | 2,000 users |
| **Dec 31, 2026** | Year-End Review | All | ₹3 Cr ARR target |
| **Mar 31, 2027** | 🚀 **Family Office MVP Launch** | FO | 3 families |
| **Apr 30, 2027** | Mass Market Go/No-Go Decision | MM | Evaluation |
| **Aug 31, 2027** | 🚀 **Mass Market MVP Launch** (if approved) | MM | 25,000 users |
| **Dec 31, 2027** | Full Platform GA | All | ₹45 Cr ARR target |


***

**Document Created:** January 24, 2026
**Version:** 1.0
**Next Review:** After HNI MVP Launch (May 2026)
**Status:** Ready for Execution
<span style="display:none">[^10][^11][^12][^13][^14][^15][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://engineerbabu.com/blog/how-to-build-a-fintech-mvp/

[^2]: https://sdh.global/blog/development/mvp-development-cost-in-2025-building-a-profitable-fintech-app-in-30-days/

[^3]: https://www.indenttechnologies.com/post/mvp-development-for-fintech-app-a-complete-guide-for-2025

[^4]: https://webmobtech.com/blog/cost-to-build-fintech-app-mvp-2025/

[^5]: https://www.webelight.com/blog/how-to-scale-a-fintech-mvp-with-future-proof-app-architecture-2025-guide

[^6]: https://appinventiv.com/blog/guide-to-wealth-management-software-development/

[^7]: https://route06.com/insights/42

[^8]: https://www.softsuave.com/blog/mvp-development-services-for-fintech-companies/

[^9]: https://nitrogenwealth.com/blog/four-stages-of-growing-a-wealth-management-firm/

[^10]: https://saasboomi.org/saas/product/product-positioning-strategies-to-look-out-for/

[^11]: https://www.flutterflowdevs.com/blog/mvp-vs-poc-development-the-ultimate-guide-for-startup-founders-2025

[^12]: https://www.wrightresearch.in/blog/path-to-wealth-creation-timeline-to-initiate-a-pms-account-in-india/

[^13]: https://amplitude.com/explore/product/how-to-product-strategy

[^14]: https://softprodigy.com/fintech-app-development-guide/

[^15]: https://www.dbs.com/investorday/presentations/Reimagining_Wealth_Management.pdf

