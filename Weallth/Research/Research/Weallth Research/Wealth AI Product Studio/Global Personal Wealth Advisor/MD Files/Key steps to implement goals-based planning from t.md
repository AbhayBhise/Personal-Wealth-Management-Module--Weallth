<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Key steps to implement goals-based planning from these case studies

Based on the case studies and research discussed in our conversation, here are the **key steps to implement goals-based planning** synthesized from successful implementations:

## Step 1: Transform the Discovery Process

**Lesson from Planful Finance \& Cannon Financial Case Studies:**

The discovery process must shift from data gathering to emotional connection and goal exploration.[^1][^2]


| Traditional Approach | Goals-Based Approach |
| :-- | :-- |
| Collect financial data first | Build trust and rapport first |
| Ask "what are your goals?" | Show goal possibilities, let clients choose |
| Single discovery meeting | Multiple conversations over time |
| Advisor-led questionnaire | Collaborative exploration |

**Implementation Steps:**

1. **Use goal menus** — Present pre-defined categories (retirement, education, home, legacy) since 73% of clients change goals when shown options[^2]
2. **Conduct appreciative inquiry** — Ask powerful questions about aspirations before diving into numbers[^2]
3. **Allow iteration** — Expect 2-3 conversations before finalizing goals, as 26% of clients change their \#1 priority[^2]
4. **Document SMART goals** — Convert aspirations into Specific, Measurable, Achievable, Relevant, Time-bound objectives

***

## Step 2: Select Technology That Enables Visual Clarity

**Lesson from RightCapital/Planful Finance Case Study:**

Scott Frey's transition from MoneyGuidePro to RightCapital demonstrated that visual design dramatically impacts client engagement.[^1]

**Key Technology Requirements:**

- **Intuitive interface** — Clients should "see and digest information so much faster" without advisor explanation[^1]
- **Real-time scenario modeling** — Interactive what-if analysis during meetings, not offline iterations
- **Progress visualization** — Clear progress bars and probability scores for each goal
- **Integrated planning-to-execution** — Connect goals to actual portfolio implementation[^3]

**Platform Selection Criteria:**


| Capability | Why It Matters | Top Platforms |
| :-- | :-- | :-- |
| Monte Carlo simulations | Stress-test goal probability | RightCapital, eMoney, MoneyGuide |
| Visual goal tracking | Client engagement | RightCapital (8.7 rating) |
| Tax planning integration | Maximize after-tax outcomes | RightCapital, eMoney |
| Client portal | Self-service access | eMoney (8.5 rating) |
| API integrations | Connect to CRM, custodians | All major platforms |


***

## Step 3: Structure Goals with Prioritization Framework

**Lesson from Brown Miller \& Fowler Drew Case Studies:**

Successful implementations organize multiple goals by priority and timeline, not as a single end-all objective.[^1]

**Goal Prioritization Framework:**

```
TIER 1: ESSENTIAL GOALS (Must achieve)
├── Retirement income security
├── Emergency fund
└── Debt elimination

TIER 2: IMPORTANT GOALS (Should achieve)
├── Children's education
├── Home purchase/upgrade
└── Healthcare reserves

TIER 3: ASPIRATIONAL GOALS (Nice to achieve)
├── Vacation home
├── Early retirement
└── Legacy/charitable giving
```

**Implementation Steps:**

1. **Categorize all goals** into essential, important, and aspirational tiers
2. **Assign risk profiles per goal** — Long-term goals can tolerate more equity; short-term goals need conservative allocation
3. **Create dependencies** — Show clients how achieving Tier 1 enables Tier 2 and 3
4. **Document trade-offs** — If resources are limited, which goals get funded first?

***

## Step 4: Run Probability Analysis, Not Just Projections

**Lesson from Silvercrest \& Industry Research:**

Monte Carlo simulations provide realistic probability ranges rather than false precision of linear projections.[^1]

**Implementation Steps:**

1. **Run 1,000+ simulations** per goal to stress-test outcomes
2. **Target 80-90% success probability** as the planning threshold
3. **Show probability ranges** — "You have an 87% chance of achieving retirement goal" vs. "You'll have \$2.5M"
4. **Identify underfunded goals** — Goals below 70% probability need intervention

**Scenario Presentation Template:**


| Goal | Current Probability | After Adjustment |
| :-- | :-- | :-- |
| Retirement at 62 | 78% ⚠ | 92% ✓ (save \$1,000 more/month) |
| Education fund | 72% ⚠ | 85% ✓ (extend timeline 1 year) |
| Vacation home | 65% ⚠ | 75% ✓ (reduce target by \$50K) |


***

## Step 5: Integrate Planning with Portfolio Implementation

**Lesson from Vestmark \& Capco Research:**

The biggest implementation gap is between holistic planning and actual portfolio execution.[^3]

**Implementation Steps:**

1. **Create goal-based account structures** — Separate accounts or sleeves per goal when practical
2. **Implement automatic glide paths** — Risk allocation adjusts as goal timeline shortens
3. **Enable tax-aware execution** — Coordinate tax-loss harvesting across all goal accounts
4. **Automate rebalancing** — Drift detection triggers rebalancing toward goal allocations

**Technology Integration Required:**

```
Planning Service ←→ Portfolio Service ←→ Trading Service
       │                    │                    │
       ▼                    ▼                    ▼
  Goal targets      Holdings/balances      Execution
  Risk profiles     Performance data       Rebalancing
  Time horizons     Tax lots               Tax optimization
```


***

## Step 6: Establish Progress Monitoring Cadence

**Lesson from eMoney ROI Study \& Case Studies:**

Consistent progress tracking drives client satisfaction (94% improvement) and retention (81% improvement).[^4]

**Monitoring Framework:**


| Frequency | Activity | Deliverable |
| :-- | :-- | :-- |
| **Real-time** | Client portal access | Dashboard with goal progress |
| **Monthly** | Automated alerts | Milestone notifications, drift alerts |
| **Quarterly** | Progress report | Email summary with visual progress bars |
| **Annually** | Comprehensive review | Full plan reassessment meeting |

**Key Metrics to Track:**

- Goal funding percentage (current vs. target)
- Success probability trend (improving/declining)
- Savings rate adherence
- Portfolio performance vs. goal benchmark (not market benchmark)

***

## Step 7: Train Advisors on Behavioral Coaching

**Lesson from Franklin Templeton \& Behavioral Research:**

Goals-based planning fails if clients abandon plans during market volatility.[^3]

**Training Components:**


| Skill | Application |
| :-- | :-- |
| **Reframing** | Connect portfolio declines to specific goals: "Your retirement goal is still 87% funded" |
| **Anchoring** | Keep clients focused on long-term goals, not short-term noise |
| **Loss aversion management** | Show goal progress, not portfolio performance vs. benchmarks |
| **Positive goal framing** | Frame goals around aspirations, not fears (reduces anxiety-driven decisions) |

**Implementation Steps:**

1. **Conduct discovery workshop training** — Practice client conversations with role-playing[^2]
2. **Teach behavioral finance fundamentals** — Understand cognitive biases[^2]
3. **Create volatility communication templates** — Pre-written messages connecting market events to goal context
4. **Review client outcome cases** — Learn from what worked and didn't

***

## Step 8: Measure Success with Goals-Based Metrics

**Lesson from eMoney \& SEI Research:**

Traditional metrics (AUM, returns) don't capture goals-based success.[^4]

**Goals-Based KPIs:**


| Metric Category | Specific KPIs | Target |
| :-- | :-- | :-- |
| **Client Outcomes** | Goal achievement rate | 85%+ of goals achieved |
| **Client Satisfaction** | Satisfaction score | 84%+ (vs. 67% traditional) |
| **Engagement** | Portal logins per month | 3+ per client |
| **Retention** | Client retention rate | 95%+ |
| **Referrals** | Referrals from planning clients | 20+ per year |
| **Efficiency** | Time to create plan | <2 hours |

**ROI Measurement:**

- 83% of advisors see ROI within first year of implementation[^4]
- 79% of advisors using interactive planning receive 20+ referrals[^4]
- 92% report improved business efficiency[^4]

***

## Step 9: Scale with Automation and Segmentation

**Lesson from Scalability Challenges:**

Goals-based planning is time-intensive; scaling requires automation.[^3]

**Automation Opportunities:**


| Manual Task | Automation Solution |
| :-- | :-- |
| Data collection | Account aggregation, custodian feeds |
| Progress tracking | Automated dashboard updates |
| Client communications | Templated quarterly reports, milestone alerts |
| Rebalancing | Rule-based automatic rebalancing |
| Compliance documentation | Auto-generated audit trails |

**Client Segmentation:**


| Segment | Service Model | Technology Reliance |
| :-- | :-- | :-- |
| **High-touch** (>\$1M AUM) | Quarterly meetings, custom analysis | Moderate |
| **Core** (\$250K-\$1M) | Semi-annual meetings, templated plans | High |
| **Digital** (<\$250K) | Annual check-in, self-service portal | Very high |


***

## Implementation Timeline Summary

| Phase | Duration | Key Deliverables |
| :-- | :-- | :-- |
| **Phase 1: Foundation** | Months 1-2 | Discovery process redesign, technology selection, advisor training |
| **Phase 2: Pilot** | Months 3-4 | Implement with 10-20 clients, refine workflows, gather feedback |
| **Phase 3: Rollout** | Months 5-6 | Expand to all clients, automate communications, measure KPIs |
| **Phase 4: Optimization** | Ongoing | Continuous improvement based on outcomes and client feedback |


***

## Critical Success Factors from Case Studies

| Factor | Evidence | Implementation Action |
| :-- | :-- | :-- |
| **Visual clarity** | RightCapital adoption freed time for planning conversations [^1] | Select intuitive, visual planning software |
| **Emotional connection** | Discovery workshops improved advisor confidence [^1] | Train advisors on appreciative inquiry |
| **Goal-specific risk** | Fowler Drew's defined-outcome portfolios increased client control [^1] | Implement per-goal risk allocation |
| **Holistic integration** | Silvercrest's coordinated wealth reports enabled informed decisions [^1] | Connect planning across tax, estate, investments |
| **Progress visibility** | 79% of interactive planning users got 20+ referrals [^4] | Deploy client portals with goal dashboards |
| **Behavioral coaching** | Reduces panic selling during volatility [^3] | Train advisors on behavioral finance |

By following these steps synthesized from successful case studies, advisors can implement goals-based planning that delivers measurable improvements in client satisfaction, retention, and business growth.

<div align="center">⁂</div>

[^1]: https://resources.envestnet.com/financial-planning/tamarac-moneyguide-integration

[^2]: https://www.envestnet.com/financial-intel/envestnet-moneyguide-brings-retirement-income-planning-life

[^3]: https://insart.com/case-study-designing-orion-integration-wealth-management-platform/

[^4]: https://newsroom.envestnet.com/2025-05-13-Envestnet-Unveils-2025-2026-Strategic-Platform-Roadmap-Powering-the-Future-of-Financial-Advice-Personalized-At-Scale

