# RETIREMENT & ESTATE PLANNING MODULES - TEMPLATE DOCUMENTATION
## Global Wealth Management Platform

**Modules:** Retirement Planning Module + Estate Planning Module  
**Version:** 1.0  
**Date:** January 2026  
**Status:** Template Ready for Customization

---

# RETIREMENT PLANNING MODULE

## PRODUCT REQUIREMENT DOCUMENT (PRD) - SECTION 1

### Executive Summary

The Retirement Planning Module empowers users to design, model, and execute comprehensive retirement strategies through multi-scenario analysis, longevity planning, and Social Security optimization—all integrated with the investment management and healthcare planning modules.

**Market Opportunity:** $1.2B (22% of total market)  
**Target Users:**
- Pre-retirees (ages 50-67, seeking withdrawal strategies)
- Retirees (ages 65+, executing retirement plan)
- Business owners planning exit strategies
- Advisors managing retirement client relationships

### Core Features (MoSCoW)

**MUST HAVE:**
1. **Retirement Calculator**
   - Define retirement goals (target age, desired income)
   - Current savings & assets
   - Expected returns by asset class
   - Inflation adjustment (default 2.5%)
   - Years to retirement calculation
   - Retirement shortfall/surplus analysis

2. **Multi-Scenario Modeling**
   - Base case (median assumptions)
   - Conservative case (-2% annual returns, +0.5% inflation)
   - Optimistic case (+2% annual returns, -0.5% inflation)
   - Early retirement (age 55, 60, 62)
   - Late retirement (age 70, 75)
   - What-if: Job loss, market crash, longevity scenarios

3. **Income Projection**
   - Social Security benefit estimation (SSA integration)
   - Pension income (manual entry for DB plans)
   - Annuity income from insurance products
   - Rental income from real estate
   - Business income / self-employment
   - Required Minimum Distributions (RMD) calculation

4. **Longevity Planning**
   - Life expectancy estimation (based on age, health)
   - Plan through age 95 (minimum)
   - Longevity risk visualization (probability of outliving savings)
   - Safe withdrawal rate calculation (4% rule + variations)
   - Sustainable income level at different probabilities (90%, 95%, 99%)

5. **Withdrawal Strategy**
   - Taxable vs tax-advantaged account sequencing
   - Tax-efficient withdrawal algorithm
   - Bucket strategy visualization (3-bucket: immediate, medium, long-term)
   - Roth conversion planning
   - Tax bracket optimization

**SHOULD HAVE:**
1. **Social Security Optimization**
   - Claiming age analysis (62, 66, 70, etc.)
   - Spousal benefit considerations
   - Break-even analysis
   - Earnings test implications
   - Benefit reduction scenarios

2. **Pension Integration & Management**
   - Pension lump sum vs annuity analysis
   - DB plan details integration
   - Survivor benefit options
   - Pension commencement date optimization

3. **RMD Management**
   - Automatic RMD calculation (IRA, 401k, etc.)
   - Multi-account RMD aggregation
   - Distribution recommendation
   - Tax withholding optimization
   - Deadline tracking & alerts

4. **Healthcare Cost Projection**
   - Medical inflation (default 3.5%-5%)
   - Medicare eligibility & premiums
   - Long-term care costs (facility vs home care)
   - Insurance premiums in retirement
   - Out-of-pocket maximum planning

5. **Annuity Analysis**
   - Compare lump sum vs immediate annuity
   - Break-even age calculation
   - Income floor via annuity strategy
   - Deferred income annuity (DIA) scenarios

**COULD HAVE:**
1. **Lifestyle Cost Tracking**
   - Spending reduction in retirement (typically 70-80% of pre-retirement)
   - Discretionary vs necessary expenses
   - Age-based spending curves
   - Travel/leisure budget optimization
   - Legacy planning goals

---

## FUNCTIONAL SPECIFICATION - RETIREMENT CALCULATOR ENGINE

### Function: CalculateRetirementProjection()

```
Input Parameters:
{
  currentAge: integer (25-100),
  retirementAge: integer (50-95),
  lifeExpectancy: integer (75-100),
  currentSavings: decimal,
  monthlyContribution: decimal,
  employerMatch: decimal (as %),
  
  expenses: {
    currentAnnual: decimal,
    inflationRate: decimal (default 2.5%),
    retirementReductionFactor: decimal (default 0.8),  // 80% of pre-retirement
    estimatedHealthcareCost: decimal
  },
  
  income: {
    socialSecurity: decimal (annual),
    pension: decimal (annual),
    rentalProperty: decimal (annual),
    partTimeWork: decimal (annual)
  },
  
  investments: {
    currentBalance: decimal,
    assetAllocation: {
      stocks: decimal (0-1),
      bonds: decimal (0-1),
      cash: decimal (0-1)
    },
    expectedReturns: {
      stocks: decimal (default 8%),
      bonds: decimal (default 4%),
      cash: decimal (default 1%)
    },
    fees: decimal (default 0.5%)
  },
  
  scenario: enum ('BASE', 'CONSERVATIVE', 'OPTIMISTIC')
}

Processing Logic:

Phase 1: Pre-Retirement Accumulation (currentAge → retirementAge)
├─ Annual calculation:
│  ├─ Beginning balance
│  ├─ Add monthly contributions (12 * monthlyContribution)
│  ├─ Add employer match
│  ├─ Apply weighted investment returns
│  │  └─ Return = (stocks_pct * stock_return) + (bonds_pct * bond_return)...
│  ├─ Subtract fees (balance * fees)
│  ├─ Adjust for scenario (BASE: no change, CONSERVATIVE: -2%, OPTIMISTIC: +2%)
│  └─ Ending balance = Beginning + Contributions + Returns - Fees
│
├─ Adjust returns based on scenario:
│  ├─ BASE: Use provided returns
│  ├─ CONSERVATIVE: Reduce by 2%, increase inflation by 0.5%
│  └─ OPTIMISTIC: Increase by 2%, reduce inflation by 0.5%
│
├─ Account for asset reallocation:
│  ├─ Age 25-45: 80/20 stocks/bonds
│  ├─ Age 45-60: 60/40 stocks/bonds
│  └─ Age 60+: 40/60 stocks/bonds
│
└─ Total at retirementAge = accumulated balance

Phase 2: Retirement Spending (retirementAge → lifeExpectancy)
├─ Annual retirement need:
│  ├─ Base: currentAnnual * retirementReductionFactor
│  ├─ Adjust for inflation: Base * (1 + inflationRate)^(year - retirementYear)
│  ├─ Add healthcare costs: estimatedHealthcareCost * inflationRate
│  └─ Total Annual Expense
│
├─ Annual income sources:
│  ├─ Social Security (no inflation adjustment, already indexed)
│  ├─ Pension (typically fixed)
│  ├─ Rental/business income (adjust for inflation)
│  └─ Total Fixed Income
│
├─ Withdrawal needed from investments:
│  └─ Annual Withdrawal = Total Expense - Total Fixed Income
│
├─ Investment balance remaining:
│  ├─ Beginning balance
│  ├─ Subtract annual withdrawal
│  ├─ Apply investment returns
│  ├─ Continue until:
│     ├─ Balance reaches zero (money runs out!) - FLAG
│     ├─ Or reach life expectancy
│     └─ Or reach age 100
│  └─ Track all values by year
│
└─ Calculate outputs:
   ├─ Shortfall: total years funding will last < life expectancy
   ├─ Sustainable withdrawal rate: safe % that lasts to life expectancy
   ├─ Year balance runs out (if applicable)
   └─ Final balance at life expectancy

Phase 3: Longevity Risk Analysis
├─ Probability calculations:
│  ├─ P(money lasts to age 85) = % of scenarios
│  ├─ P(money lasts to age 90) = % of scenarios
│  ├─ P(money lasts to age 95) = % of scenarios
│  └─ P(money lasts to age 100) = % of scenarios
│
├─ Safe withdrawal rate:
│  ├─ Run 1000 Monte Carlo simulations
│  ├─ Vary: market returns (±5%), inflation (±1%), life expectancy (±10 years)
│  ├─ For each simulation, calculate max annual withdrawal that doesn't deplete
│  └─ 95th percentile result = 95% confidence withdrawal rate
│
└─ Generate visualization:
   ├─ Probability fan chart (balance over time, multiple scenarios)
   └─ Safe withdrawal range chart

Output Data Structure:
{
  projectionValid: boolean,
  
  preRetirement: {
    startBalance: decimal,
    endBalance: decimal,
    totalContributions: decimal,
    totalReturns: decimal,
    totalFees: decimal,
    balanceAtRetirement: decimal
  },
  
  retirement: {
    annualExpense: decimal (first year),
    annualIncome: decimal,
    annualWithdrawalNeeded: decimal (first year),
    retirementYearsNeeded: integer,
    moneyRunsOutAt: integer (age, or null if lasts to life expectancy),
    balanceAtLifeExpectancy: decimal (could be 0 or positive)
  },
  
  analysis: {
    shortfallAmount: decimal,
    shortfallYears: integer,
    safeWithdrawalRate: {
      rate_95_confidence: decimal (e.g., 0.038 = 3.8%),
      rate_90_confidence: decimal,
      rate_85_confidence: decimal
    },
    probabilityMeetsGoals: {
      toAge85: decimal (0-1),
      toAge90: decimal (0-1),
      toAge95: decimal (0-1),
      toAge100: decimal (0-1)
    },
    recommendations: [
      "Increase annual savings by $XX",
      "Delay retirement by X years",
      "Reduce post-retirement spending by X%",
      "Convert X% to annuity for income floor"
    ]
  },
  
  yearByYearProjection: [
    {
      year: integer,
      age: integer,
      beginningBalance: decimal,
      contribution: decimal,
      investment_return: decimal,
      withdrawal: decimal,
      endingBalance: decimal
    },
    ...
  ],
  
  scenarioComparison: {
    base: { ... },  // same structure
    conservative: { ... },
    optimistic: { ... }
  }
}
```

### Key Validation Rules

```javascript
Validation({
  currentAge < retirementAge: "Retirement age must be in future",
  retirementAge < lifeExpectancy: "Life expectancy must exceed retirement age",
  lifeExpectancy <= 100: "Assume max 100 years",
  currentAge >= 18: "Minimum age 18",
  currentSavings >= 0: "Savings cannot be negative",
  monthlyContribution >= 0: "Contribution cannot be negative",
  expenseInflationRate: 0-5%: "Inflation typically 0-5% annually",
  stockReturn: 5-12%: "Historical stock returns 8-10% average",
  bondReturn: 2-6%: "Historical bond returns 4-5% average",
  retirementReductionFactor: 0.5-1.0: "Typically 70-80% of pre-retirement spending"
})
```

---

# ESTATE PLANNING MODULE

## PRODUCT REQUIREMENT DOCUMENT (PRD) - SECTION 1

### Executive Summary

The Estate Planning Module enables comprehensive legacy planning, ensuring efficient wealth transfer, minimizing estate taxes, and coordinating multi-generational planning across jurisdictions.

**Market Opportunity:** $900M (16% of total market)  
**Target Users:**
- High-net-worth individuals ($5M+) with estate tax concerns
- Business owners planning succession
- Parents with minor children (guardianship planning)
- Married couples seeking joint planning
- Global citizens with multi-jurisdiction estates

### Core Features (MoSCoW)

**MUST HAVE:**
1. **Estate Inventory & Valuation**
   - Asset tracking by type:
     - Real estate (primary residence, investment properties)
     - Financial investments (brokerage accounts)
     - Retirement accounts (IRAs, 401ks)
     - Business interests
     - Collectibles & personal property
     - Digital assets (cryptocurrencies, online accounts)
   - Current fair market value
   - Ownership structure (sole, joint, corporation, trust)
   - Titling status

2. **Beneficiary Management**
   - Beneficiary directory
   - Primary & contingent beneficiaries per account
   - Beneficiary designation documents
   - Tracking inconsistencies (account vs will)
   - Update reminders (trigger on account changes)
   - Guardian designation for minor children

3. **Will & Trust Documentation**
   - Pre-built template library:
     - Simple will (individual, no trust)
     - Revocable living trust (RLT)
     - Testamentary trust (in will)
     - Marital deduction trust (A-B trust)
     - Survivor's trust (state-specific)
   - Interactive document builder
   - State-specific requirements checklist
   - Digital signature integration (DocuSign, Adobe Sign)
   - Document versioning & storage

4. **Estate Tax Projection**
   - Federal estate tax calculation
   - State estate/inheritance tax (where applicable)
   - Combined tax estimate
   - Tax-free current exemption tracking ($13.61M in 2024)
   - Portability elections (spousal unlimited marital deduction)
   - Estate tax threshold scenarios

5. **Asset Distribution Planning**
   - Design distribution scheme:
     - Equal to all children vs need-based
     - Trustee discretion vs mandatory distributions
     - Outright distribution vs in-trust structures
   - Tax-efficient ordering (which assets to which beneficiary)
   - Equalization planning (equalizing inheritance among children)

**SHOULD HAVE:**
1. **Inheritance Tax Optimization**
   - Lifetime gifting strategy
   - Annual exclusion gifts ($18K per recipient in 2024)
   - Crummey letter generation
   - Charitable remainder trust (CRT) modeling
   - Dynasty trust strategies (for ultra-wealthy)
   - Generation-skipping transfer (GST) tax analysis

2. **Charitable Planning**
   - Charitable giving options:
     - Direct outright gift
     - Donor-advised fund (DAF)
     - Charitable remainder trust (CRT)
     - Charitable lead trust (CLT)
     - Conservation easement
   - Tax deduction calculations
   - Impact measurement & reporting

3. **Business Succession Planning**
   - Succession scenarios:
     - Family succession
     - Key employee buyout (KEOB)
     - Sell to third party
     - Private equity transition
     - IPO transition
   - Buy-sell agreement templates
   - Valuation method (FMV, formula, appraisal)
   - Funding mechanisms (insurance, escrow, notes)

4. **Multi-Jurisdictional Planning**
   - Domicile & residency tracking
   - Multi-state property management
   - International asset considerations
   - Foreign beneficiary implications
   - FBAR/FATCA compliance for expats
   - Local probate requirements

5. **Guardian & Guardianship**
   - Minor child guardianship designation
   - Successor guardian selection
   - Guardianship alternatives (standby, co-guardianship)
   - Financial guardian vs personal guardian
   - State-specific guardianship requirements
   - Letter of intent for guardians

**COULD HAVE:**
1. **Digital Asset Management**
   - Digital asset inventory (accounts, files, etc.)
   - Password & access credential management
   - Digital heir/executor designation
   - Social media account planning
   - Cryptocurrency management & transfer

2. **Long-Term Care Planning**
   - Asset protection strategies
   - Medicaid eligibility planning
   - Trust-based asset protection (SAFT, DAPT)
   - Long-term care insurance integration
   - Spend-down strategies

3. **Special Needs Planning**
   - Supplemental Needs Trust (SNT)
   - Pooled trust structures
   - First-party trusts vs third-party trusts
   - Government benefit coordination
   - Special needs expense tracking

---

## FUNCTIONAL SPECIFICATION - ESTATE TAX CALCULATOR

### Function: CalculateEstateTax()

```
Input Parameters:
{
  year: integer (2024-2030),
  maritalStatus: enum ('SINGLE', 'MARRIED_FILING_JOINTLY', 'WIDOW(ER)'),
  state: string (US state code or international country),
  
  assets: [
    {
      assetId: UUID,
      name: string,
      type: enum ('REAL_ESTATE', 'INVESTMENT', 'RETIREMENT', 'BUSINESS', 'PERSONAL'),
      fairMarketValue: decimal,
      ownership: enum ('SOLE', 'JOINT_TENANCY', 'TENANCY_IN_COMMON', 'COMMUNITY_PROPERTY'),
      ownershipPercentage: decimal (0-1),  // for TIC
      includedInEstate: boolean,
      marketingCost: decimal (real estate expense),
      debt: decimal (mortgage, other liens)
    },
    ...
  ],
  
  liabilities: {
    mortgages: decimal,
    loans: decimal,
    creditCard: decimal,
    taxes: decimal,
    funeralExpenses: decimal,
    adminCosts: decimal (typically 3-5% of estate)
  },
  
  gifts: {
    totalLifetimeGifts: decimal,  // cumulative prior gifts
    annualExclusionGifts: [
      { year: integer, amount: decimal },  // typically $18K/recipient/year
      ...
    ]
  },
  
  trusts: [
    {
      type: enum ('MARITAL', 'SURVIVOR', 'IRREVOCABLE_LIFE_INSURANCE', 'CHARITABLE'),
      value: decimal,
      includedInEstate: boolean
    },
    ...
  ],
  
  portabilityElection: boolean (married filers only)
}

Calculation Steps:

Step 1: Calculate Gross Estate
├─ Real Property:
│  ├─ Include: Fair market value (for sole property)
│  ├─ Include 50%: Joint tenancy with spouse
│  └─ Include 100%: Joint tenancy with non-spouse
├─ Investments:
│  ├─ Include: Full value of securities
│  ├─ Adjustment: Discount for lack of control (-20% to -40% for business interests)
│  └─ Adjustment: Discount for lack of marketability (-10% to -40%)
├─ Retirement Accounts:
│  ├─ Include: Full value (IRAs, 401ks, etc.)
│  └─ Consider: Income in respect of decedent (IRD) tax consequences
├─ Life Insurance:
│  ├─ Include: Proceeds payable to estate
│  ├─ Include: Proceeds in which decedent had incidents of ownership
│  └─ Exclude: Proceeds in irrevocable trust (ILIT) if no incidents of ownership
├─ Business Interest:
│  ├─ Include: Fair market value of business or partnership interest
│  ├─ Adjustment: Section 409A business valuation discount
│  └─ Special: Section 2031(c) conservation easement exclusion (up to $1.12M in 2024)
└─ Personal Property:
   └─ Include: Tangible property, collections, vehicles, etc.

Gross Estate Total = Sum of all included assets

Step 2: Calculate Adjusted Gross Estate
├─ Deduct: Estate liabilities (debts, mortgages, loans)
├─ Deduct: Funeral and administration expenses
├─ Deduct: Charitable pledges & bequests
└─ Deduct: Marital deduction (spouse inheritance, unlimited)

Adjusted Gross Estate = Gross Estate - Deductions

Step 3: Calculate Taxable Estate
├─ Start with: Adjusted Gross Estate
├─ Add back: Net gifts (gifts within 3 years of death, where donor paid tax)
├─ Add back: Generation-skipping transfer tax
└─ Taxable Estate = Adjusted Gross Estate (adjusted)

Step 4: Federal Estate Tax Calculation (US)
├─ Estate Tax Exemption (2024): $13,610,000 (married), $6,805,000 (single)
│  └─ Scheduled reduction to ~$7M (married) in 2026 (sunset of TCJA)
├─ Portable Exemption (married):
│  ├─ If spouse died after 2010: Can use deceased spouse's unused exemption
│  └─ Additional exemption = max $13,610,000 (married filing together)
├─ Taxable Estate After Exemption = Taxable Estate - Exemption Amount
│
├─ Estate Tax Rate (2024): 40% flat rate (for amounts over exemption)
│
├─ Estate Tax = Taxable Estate After Exemption * 40%
│
└─ Potential credits:
   ├─ Credit for prior taxes on gifts
   ├─ Credit for foreign taxes (if international assets)
   └─ Adjusted Estate Tax = Estate Tax - Credits

Step 5: State Estate/Inheritance Tax (if applicable)
├─ Check state domicile:
│  ├─ Connecticut: Yes (12% rate, $6.94M exemption in 2024)
│  ├─ Illinois: Yes (16% rate)
│  ├─ Maine: Yes (12% rate)
│  ├─ Maryland: Yes (16% rate)
│  ├─ Massachusetts: Yes (16% rate)
│  ├─ Minnesota: Yes (16% rate)
│  ├─ Mississippi: Yes (inheritance tax, 18%)
│  ├─ Missouri: Yes (inheritance tax, 18%)
│  ├─ Montana: Yes (80% of federal credit)
│  ├─ New Hampshire: Yes (interest & dividends only)
│  ├─ New Jersey: Yes (inheritance tax, 11-16%)
│  ├─ New York: Yes (3.06-16% rate, $6.58M exemption)
│  ├─ North Carolina: Yes (inheritance tax)
│  ├─ Ohio: Yes (inheritance tax)
│  ├─ Oregon: Yes (16% rate)
│  ├─ Pennsylvania: Yes (inheritance tax, 0-15%)
│  ├─ Rhode Island: Yes (12% rate)
│  ├─ Tennessee: Yes (inheritance tax, 0-17%)
│  ├─ Vermont: Yes (16% rate)
│  ├─ Washington: Yes (20% rate, $2.193M exemption in 2024)
│  └─ All others: No state estate tax
│
├─ Calculate state tax if applicable:
│  ├─ State Exemption Amount
│  ├─ State Taxable Estate = Taxable Estate - State Exemption
│  └─ State Estate Tax = State Taxable Estate * State Rate
│
└─ Check for Credit for Estate Taxes Paid to Other States

Step 6: Calculate Total Estate Tax
├─ Federal Estate Tax
├─ State Estate Tax
├─ Generation-Skipping Transfer (GST) Tax (if applicable)
└─ Total Tax Liability = Federal + State + GST

Step 7: Scenario Analysis
├─ Current scenario (provided data)
├─ Reduced gifts scenario (lifetime gifts = 0)
├─ Increased assets scenario (+20%)
├─ Spousal scenario (if married):
│  ├─ If first spouse dies
│  ├─ If second spouse dies (with portability)
│  └─ If second spouse dies (without portability)
└─ Generate comparison table

Step 8: Recommendation Generation
├─ If tax > $500K:
│  ├─ "Consider living trust to avoid probate"
│  ├─ "Consider charitable remainder trust to reduce estate"
│  ├─ "Consider annual gifts to family members"
│  ├─ "Consider irrevocable life insurance trust (ILIT)"
│  └─ "Consider dynasty trust or generation-skipping trust"
├─ If large business interest:
│  ├─ "Consider Section 1031 exchange for real estate"
│  ├─ "Consider key employee insurance buyout"
│  ├─ "Consider family limited partnership"
│  └─ "Consider qualified personal residence trust (QPRT)"
└─ Tax optimization opportunities

Output Data Structure:
{
  taxCalculationValid: boolean,
  year: integer,
  
  grossEstate: {
    realEstate: decimal,
    investments: decimal,
    retirementAccounts: decimal,
    lifeInsurance: decimal,
    business: decimal,
    personalProperty: decimal,
    total: decimal
  },
  
  adjustments: {
    discountForControl: decimal,
    discountForMarketability: decimal,
    funeralExpenses: decimal,
    adminCosts: decimal,
    maritalDeduction: decimal,
    charitableDeduction: decimal,
    totalDeductions: decimal
  },
  
  taxableEstate: decimal,
  
  federalEstateTax: {
    exemptionAmount: decimal,
    taxableAmount: decimal,
    taxRate: decimal (0.40),
    estimatedTax: decimal
  },
  
  stateEstateTax: {
    stateApplicable: boolean,
    stateName: string,
    exemptionAmount: decimal,
    taxableAmount: decimal,
    estimatedTax: decimal
  },
  
  generationSkippingTax: {
    applicable: boolean,
    estimatedTax: decimal
  },
  
  totalEstimateTaxLiability: decimal,
  
  effectiveTaxRate: decimal (totalTax / grossEstate),
  
  scenarios: [
    {
      name: string,
      taxLiability: decimal,
      difference: decimal
    },
    ...
  ],
  
  recommendations: [
    {
      strategy: string,
      estimatedTaxSavings: decimal,
      priority: enum ('HIGH', 'MEDIUM', 'LOW')
    },
    ...
  ]
}
```

---

## DESIGN CONSIDERATIONS

### Retirement Planning Module UI Principles

1. **Simplicity for Complex Concepts**
   - Hide advanced parameters by default
   - Progressive disclosure: Basic → Advanced settings
   - Visualizations prioritize over tables
   - Clear scenario labels (not "Scenario A", but "Retiring at 65 (Conservative)")

2. **Key Screens**
   - **Quick Start:** 5-question wizard → instant projection
   - **Detailed Plan:** Full parameter input with help tooltips
   - **Scenario Comparison:** Side-by-side projection charts
   - **Annual Breakdown:** Year-by-year table for drilling down
   - **Recommendations Dashboard:** Action items prioritized

3. **Visualization Patterns**
   - Probability fan chart: Shows range of outcomes over time
   - Waterfall chart: Shows income sources flowing to meet expenses
   - Bucket strategy: Visual representation of 3-bucket approach
   - Heatmap: Asset allocation by age over time

---

### Estate Planning Module UI Principles

1. **Guided Workflows**
   - Start with asset inventory (most critical)
   - Then beneficiary assignments
   - Then document drafting
   - Then tax planning

2. **Key Screens**
   - **Asset Inventory:** Add, edit, organize assets by category
   - **Beneficiary Assignments:** Map beneficiaries to accounts
   - **Tax Projection:** See estimated tax liability
   - **Document Builder:** Interactive template with fill-in sections
   - **Compliance Checklist:** Required actions by state/situation

3. **Visualization Patterns**
   - Sankey diagram: Shows asset flow to beneficiaries
   - Sunburst chart: Estate composition by asset type
   - Pie chart: Tax allocation (to beneficiaries vs. to IRS)
   - Timeline: Generation plan across 3+ generations

---

## INTEGRATION REQUIREMENTS

### Retirement Planning ↔ Investment Management
- Portfolio performance feeds retirement projection
- Rebalancing triggers retirement review
- Retirement goal drives investment allocation

### Estate Planning ↔ Beneficiary Management
- Estate plan designates beneficiaries
- Account beneficiary designations match estate plan
- Alerts for inconsistencies between estate plan and account designations

### Estate Planning ↔ Investment Management
- Estate tax calculation needs current portfolio values
- Inheritance simulation uses current allocation
- Tax impact analysis on inherited assets

---

## SUCCESS METRICS

### Retirement Planning Module

| Metric | Target |
|--------|--------|
| Users completing full projection | 70% of users |
| Plan review frequency | Annually minimum |
| Scenario analysis adoption | 40% of users |
| NPS Score | 55+ |
| Advisor productivity gain | 20% time savings |

### Estate Planning Module

| Metric | Target |
|--------|--------|
| Users creating complete inventory | 65% of users |
| Estate plans drafted in platform | 50% of users |
| Document signing (digital) | 80% of drafted docs |
| Tax savings identified | $50K+ per UHNW user |
| NPS Score | 50+ |

---

## COMPLIANCE & REGULATORY

### Retirement Planning
- Not providing investment advice (safe harbor from Securities Act)
- Financial literacy/education only
- Disclaimers on projections (past performance ≠ future results)
- Integration with SEC-registered advisors for actual advice

### Estate Planning
- Document templates reviewed by estate planning attorney (per state)
- Not providing legal advice (educational only)
- Recommendation to consult with tax attorney/CPA
- Disclaimer on tax calculations (estimates only)

---

## NEXT STEPS FOR EACH MODULE

1. **Conduct user research** with target personas (retirees, estate planning clients)
2. **Refine calculations** with financial planning software experts
3. **Legal review** of templates and disclaimers
4. **Pilot testing** with 100 users in each module
5. **Integrate with other modules** (Investment, Healthcare, Tax)
6. **Full launch** with advisor support materials

---

**Document Owner:** Retirement & Estate Planning Module Leads  
**Created:** January 2026  
**Distribution:** Product Team, Engineering, Compliance, Legal Review