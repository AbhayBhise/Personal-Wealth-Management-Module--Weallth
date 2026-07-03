/**
 * Service layer — business logic and orchestration.
 * Calls repositories for data and calculation/recommendation engines for math.
 * Controllers must never contain business logic.
 * Repositories must never contain business logic.
 */
import * as repo from '../repositories';
import {
  calculateWHS, getWHSCategory, calculateEmergencyFundTarget,
  calculateInflationAdjustedCost, calculateGoalShortfall,
  calculateFutureValue, calculateFutureValueOfSavings,
  calculateRequiredSavings, calculateSupportableCost, calculateDelayMonths,
  yearsUntilYear, deriveWealthSegment, scoreToRiskProfile, RISK_QUESTIONS,
  calculateTWR, calculateVolatility, calculateSharpeRatio,
  calculateBeta, calculateAlpha, computeAssetAllocation, calculatePortfolioDrift,
  annualizeReturn, TARGET_ALLOCATIONS, PeriodReturn,
} from '../calculations/engine';
import { generateRecommendations } from '../calculations/recommendations';
import { GoalCategory } from '../types';
import { ragEngine } from './rag/engine';


import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-demo';

// ─── Auth Service ─────────────────────────────────────────────────────────────
export function loginUser(email: string, password: string) {
  const user = repo.findUserByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return null;
  }
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    onboarding_complete: user.onboarding_complete,
    segment: user.segment,
    token,
  };
}

export function registerUser(email: string, password: string, name: string) {
  const existing = repo.findUserByEmail(email);
  if (existing) throw new Error('User already exists');

  const password_hash = bcrypt.hashSync(password, 10);
  const user = repo.createUser({
    email,
    password_hash,
    name,
    role: 'client',
    onboarding_complete: false,
    segment: 'Mass Affluent',
  });

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    onboarding_complete: user.onboarding_complete,
    segment: user.segment,
    token,
  };
}

export function updateUserPreferences(userId: string, preferences: { display_currency?: string }) {
  const profile = repo.upsertClientProfile(userId, preferences);
  return {
    display_currency: profile.display_currency
  };
}

// ─── Risk Questions ───────────────────────────────────────────────────────────
export function getRiskQuestions() {
  return RISK_QUESTIONS;
}

// ─── Wealth Discovery ─────────────────────────────────────────────────────────
export interface WealthDiscoveryPayload {
  // Step 1: Basic Info & Family
  dob: string;
  occupation: string;
  marital_status: string;
  dependents: Array<{ name: string; relationship: string; dob: string }>;

  // Step 2: Income
  income: { salary: number; business: number; rental: number; other: number };

  // Step 3: Assets (institution -> account -> holdings)
  accounts: Array<{
    institution_name: string;
    institution_type: string;
    account_name: string;
    account_type: string;
    holdings: Array<{
      name: string;
      category: string;
      current_value: number;
      is_liquid: boolean;
    }>;
  }>;

  // Step 4: Liabilities
  liabilities: Array<{
    name: string;
    category: string;
    outstanding_balance: number;
    interest_rate: number;
    monthly_payment: number;
  }>;

  // Step 5: Goals
  goals: Array<{
    name: string;
    category: string;
    priority: string;
    target_amount: number;
    target_year: number;
    already_saved: number;
    monthly_contribution: number;
  }>;

  // Step 6: Risk Assessment (question_id -> score)
  risk_answers: Record<string, number>;

  // Step 7: Insurance
  insurance: {
    life_coverage: number;
    health_coverage: number;
    disability_coverage_monthly: number;
    has_long_term_care: boolean;
  };

  // Step 8: Consent
  has_will: boolean;
  has_poa: boolean;
  has_hc_proxy: boolean;
  consent_advisory_disclaimer: boolean;
}

export function submitWealthDiscovery(userId: string, payload: WealthDiscoveryPayload) {
  // ── Step 1: Save household profile ─────────────────────────────────────────
  const dob = new Date(payload.dob);
  const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

  repo.upsertHouseholdProfile(userId, {
    marital_status: payload.marital_status,
    occupation: payload.occupation,
  });

  payload.dependents.forEach(d => {
    repo.addHouseholdMember(userId, {
      relationship: d.relationship as any,
      name: d.name,
      dob: d.dob,
    });
  });

  // ── Step 2: Save income profile ────────────────────────────────────────────
  const incomeProfile = repo.upsertIncomeProfile(userId, payload.income);
  const annualIncome = (incomeProfile.salary + incomeProfile.business + incomeProfile.rental + incomeProfile.other);
  const monthlyNetIncome = annualIncome / 12;
  const hasDependents = payload.dependents.length > 0;

  // ── Step 3: Save accounts & holdings ──────────────────────────────────────
  let totalInvestableAssets = 0;
  let liquidCash = 0;

  for (const acct of payload.accounts) {
    const institution = repo.createInstitution(userId, {
      name: acct.institution_name,
      type: acct.institution_type,
    });

    const account = repo.createAccount(userId, {
      institution_id: institution.id,
      name: acct.account_name,
      type: acct.account_type as any,
    });

    for (const h of acct.holdings) {
      repo.createHolding(userId, {
        account_id: account.id,
        name: h.name,
        category: h.category as any,
        current_value: h.current_value,
        is_liquid: h.is_liquid,
      });
      totalInvestableAssets += h.current_value;
      if (h.is_liquid) liquidCash += h.current_value;
    }
  }

  // ── Step 4: Save liabilities ────────────────────────────────────────────────
  let totalDebt = 0;
  let highInterestDebt = 0;
  let highInterestDebtRate = 0;
  let monthlyDebtPayments = 0;

  for (const l of payload.liabilities) {
    repo.createLiability(userId, {
      name: l.name,
      category: l.category as any,
      outstanding_balance: l.outstanding_balance,
      interest_rate: l.interest_rate,
      monthly_payment: l.monthly_payment,
    });
    totalDebt += l.outstanding_balance;
    monthlyDebtPayments += l.monthly_payment;
    if (l.interest_rate > 0.08) {
      highInterestDebt += l.outstanding_balance;
      highInterestDebtRate = Math.max(highInterestDebtRate, l.interest_rate);
    }
  }

  // ── Step 5: Save goals (with shortfall calculation) ─────────────────────────
  const assumptions = repo.getAssumptions(userId);
  let goalsFunded = 0;
  let totalGoals = payload.goals.length;

  for (const g of payload.goals) {
    const years = yearsUntilYear(g.target_year);
    const inflationRate = g.category === 'Education' ? assumptions.education_inflation
      : g.category === 'Retirement' ? assumptions.retirement_inflation
      : assumptions.inflation_rate;
    const returnRate = assumptions.expected_return;

    const futureCost = calculateInflationAdjustedCost(g.target_amount, inflationRate, years);
    const fvAssets = calculateFutureValue(g.already_saved, returnRate, years);
    const fvSavings = calculateFutureValueOfSavings(g.monthly_contribution, returnRate, years);
    const shortfall = calculateGoalShortfall(futureCost, fvAssets, fvSavings, 0);

    if (shortfall <= 0) goalsFunded++;

    repo.createGoal(userId, {
      name: g.name,
      category: g.category as GoalCategory,
      priority: g.priority as 'High' | 'Medium' | 'Low',
      target_amount: g.target_amount,
      target_year: g.target_year,
      already_saved: g.already_saved,
      monthly_contribution: g.monthly_contribution,
      shortfall: Math.round(shortfall),
    });
  }

  const goalFundingRatio = totalGoals > 0 ? goalsFunded / totalGoals : 1;

  // ── Step 6: Risk score → risk profile ───────────────────────────────────────
  const riskScore = Object.values(payload.risk_answers).reduce((s, v) => s + v, 0);
  const riskProfile = scoreToRiskProfile(riskScore);

  // ── Step 7: Insurance ─────────────────────────────────────────────────────
  const insurance = repo.upsertInsuranceProfile(userId, payload.insurance);
  const disabilityTarget = monthlyNetIncome * 0.60;
  const lifeTarget = (annualIncome * 10) + totalDebt;
  const disabilityCoverageRatio = insurance.disability_coverage_monthly / Math.max(1, disabilityTarget);
  const lifeCoverageRatio = insurance.life_coverage / Math.max(1, lifeTarget);

  // ── Step 8: Derive segment & update user ──────────────────────────────────
  const segment = deriveWealthSegment(totalInvestableAssets, annualIncome);
  repo.updateUser(userId, {
    onboarding_complete: true,
    segment,
  });

  // ── Save client profile ────────────────────────────────────────────────────
  const monthlyExpenses = monthlyNetIncome * 0.70; // estimated
  const monthlySavings = monthlyNetIncome - monthlyExpenses - monthlyDebtPayments;
  const savingsRate = monthlyNetIncome > 0 ? Math.max(0, monthlySavings / monthlyNetIncome) : 0;
  const jobVolatility = savingsRate > 0.20 ? 'low' : savingsRate > 0.10 ? 'medium' : 'high';

  repo.upsertClientProfile(userId, {
    age,
    risk_profile: riskProfile,
    display_currency: 'USD',
  });

  // ── Calculate WHS ──────────────────────────────────────────────────────────
  const emergencyFundTarget = calculateEmergencyFundTarget(monthlyExpenses, jobVolatility, hasDependents);
  const retirementGoal = payload.goals.find(g => g.category === 'Retirement');
  let retirementReadinessRatio = 0.5; // default if no retirement goal
  if (retirementGoal) {
    const retYears = yearsUntilYear(retirementGoal.target_year);
    const fvRet = calculateFutureValue(retirementGoal.already_saved, assumptions.expected_return, retYears)
      + calculateFutureValueOfSavings(retirementGoal.monthly_contribution, assumptions.expected_return, retYears);
    const futureCostRet = calculateInflationAdjustedCost(retirementGoal.target_amount, assumptions.retirement_inflation, retYears);
    retirementReadinessRatio = Math.min(1, fvRet / Math.max(1, futureCostRet));
  }

  const whsResult = calculateWHS({
    liquidCashBalance: liquidCash,
    emergencyFundTarget,
    highInterestDebt,
    totalDebt,
    totalAssets: totalInvestableAssets,
    monthlyNetIncome,
    monthlySavings: Math.max(0, monthlySavings),
    savingsRate,
    targetSavingsRate: 0.15,
    portfolioDrift: 0.05,
    retirementReadinessRatio,
    goalFundingRatio,
    disabilityCoverageRatio,
    lifeCoverageRatio,
    hasLTC: insurance.has_long_term_care,
    age,
    hasWill: payload.has_will,
    hasPOA: payload.has_poa,
    hasHCProxy: payload.has_hc_proxy,
  });

  const whsCategory = getWHSCategory(whsResult.score);
  repo.appendWhsHistory(userId, whsResult.score, whsCategory);

  // ── Generate Recommendations ───────────────────────────────────────────────
  const generatedRecs = generateRecommendations({
    userId,
    liquidCash,
    emergencyFundTarget,
    monthlyExpenses,
    monthlyNetIncome,
    monthlySavings: Math.max(0, monthlySavings),
    totalDebt,
    highInterestDebt,
    highInterestDebtRate,
    savingsRate,
    retirementReadinessRatio,
    goalFundingRatio,
    disabilityCoverageRatio,
    lifeCoverageRatio,
    hasWill: payload.has_will,
    hasPOA: payload.has_poa,
    hasHCProxy: payload.has_hc_proxy,
    hasEmergencyFundGoal: payload.goals.some(g => g.category === 'Emergency Fund'),
  });
  repo.replaceRecommendations(userId, generatedRecs);

  // ── Return Financial Snapshot ─────────────────────────────────────────────
  return {
    segment,
    risk_profile: riskProfile,
    whs: {
      score: whsResult.score,
      category: whsCategory,
      pillars: whsResult.pillars,
      ...whsResult.metrics,
    },
    top_risks: generatedRecs
      .filter(r => r.priority === 'Critical' || r.priority === 'High')
      .slice(0, 3)
      .map(r => ({ priority: r.priority, category: r.category, message: r.alert_message })),
    assumptions,
    disclaimer: 'Advisory simulation only. Recommendations are not trading orders and do not constitute financial advice.',
  };
}

// ─── WHS Service ──────────────────────────────────────────────────────────────
export function getWHSSnapshot(userId: string) {
  const profile = repo.getClientProfile(userId);
  const userHoldings = repo.getHoldings(userId);
  const userLiabilities = repo.getLiabilities(userId);
  const incomeProfile = repo.getIncomeProfile(userId);
  const insurance = repo.getInsuranceProfile(userId);
  const assumptions = repo.getAssumptions(userId);
  const userGoals = repo.getGoals(userId);

  if (!profile) return null;

  const annualIncome = incomeProfile
    ? (incomeProfile.salary + incomeProfile.business + incomeProfile.rental + incomeProfile.other)
    : 0;
  const monthlyNetIncome = annualIncome / 12;
  const totalAssets = userHoldings.reduce((s, h) => s + h.current_value, 0);
  const liquidCash = userHoldings.filter(h => h.is_liquid).reduce((s, h) => s + h.current_value, 0);
  const totalDebt = userLiabilities.reduce((s, l) => s + l.outstanding_balance, 0);
  const highInterestDebt = userLiabilities.filter(l => l.interest_rate > 0.08).reduce((s, l) => s + l.outstanding_balance, 0);
  const monthlyDebtPayments = userLiabilities.reduce((s, l) => s + l.monthly_payment, 0);
  const monthlyExpenses = monthlyNetIncome * 0.70;
  const monthlySavings = Math.max(0, monthlyNetIncome - monthlyExpenses - monthlyDebtPayments);
  const savingsRate = monthlyNetIncome > 0 ? monthlySavings / monthlyNetIncome : 0;
  const hasDependents = repo.getHouseholdMembers(userId).length > 0;
  const jobVolatility = savingsRate > 0.20 ? 'low' : savingsRate > 0.10 ? 'medium' : 'high';
  const emergencyFundTarget = calculateEmergencyFundTarget(monthlyExpenses, jobVolatility, hasDependents);

  const disabilityTarget = monthlyNetIncome * 0.60;
  const lifeCoverageTarget = (annualIncome * 10) + totalDebt;
  const disabilityCoverageRatio = insurance
    ? insurance.disability_coverage_monthly / Math.max(1, disabilityTarget) : 0;
  const lifeCoverageRatio = insurance
    ? insurance.life_coverage / Math.max(1, lifeCoverageTarget) : 0;

  // Retirement readiness
  const retirementGoal = userGoals.find(g => g.category === 'Retirement');
  let retirementReadinessRatio = 0.5;
  if (retirementGoal) {
    const retYears = yearsUntilYear(retirementGoal.target_year);
    const fvRet = calculateFutureValue(retirementGoal.already_saved, assumptions.expected_return, retYears)
      + calculateFutureValueOfSavings(retirementGoal.monthly_contribution, assumptions.expected_return, retYears);
    retirementReadinessRatio = Math.min(1, fvRet / Math.max(1, retirementGoal.target_amount));
  }

  // Goal funding ratio
  const goalsOnTrack = userGoals.filter(g => g.shortfall <= 0).length;
  const goalFundingRatio = userGoals.length > 0 ? goalsOnTrack / userGoals.length : 1;

  const household = repo.getHouseholdProfile(userId);

  const result = calculateWHS({
    liquidCashBalance: liquidCash,
    emergencyFundTarget,
    highInterestDebt,
    totalDebt,
    totalAssets,
    monthlyNetIncome,
    monthlySavings,
    savingsRate,
    targetSavingsRate: 0.15,
    portfolioDrift: 0.05,
    retirementReadinessRatio,
    goalFundingRatio,
    disabilityCoverageRatio,
    lifeCoverageRatio,
    hasLTC: insurance?.has_long_term_care ?? false,
    age: profile.age,
    hasWill: false,  // Retrieved from discovery payload stored on user if needed
    hasPOA: false,
    hasHCProxy: false,
  });

  return {
    user_id: userId,
    score: result.score,
    category: getWHSCategory(result.score),
    score_emergency_fund: result.pillars.emergency_fund,
    score_debt_mgmt: result.pillars.debt_mgmt,
    score_savings_rate: result.pillars.savings_rate,
    score_portfolio_drift: result.pillars.portfolio_drift,
    score_retirement_readiness: result.pillars.retirement_readiness,
    score_insurance_protection: result.pillars.insurance_protection,
    score_estate_planning: result.pillars.estate_planning,
    ...result.metrics,
    updated_at: new Date().toISOString(),
    disclaimer: 'Advisory simulation only. Recommendations are not trading orders and do not constitute financial advice.',
  };
}

// ─── Net Worth Service ────────────────────────────────────────────────────────
export function getNetWorth(userId: string) {
  return repo.getNetWorthHistory(userId);
}

// ─── Goal Service ─────────────────────────────────────────────────────────────
export function getGoals(userId: string) {
  return repo.getGoals(userId);
}

export function createGoal(userId: string, body: {
  name: string; category: GoalCategory; priority: 'High' | 'Medium' | 'Low';
  target_amount: number; target_year: number; already_saved: number; monthly_contribution: number;
}) {
  const assumptions = repo.getAssumptions(userId);
  const years = yearsUntilYear(body.target_year);
  const inflationRate = body.category === 'Education' ? assumptions.education_inflation
    : body.category === 'Retirement' ? assumptions.retirement_inflation
    : assumptions.inflation_rate;
  const returnRate = assumptions.expected_return;

  const futureCost = calculateInflationAdjustedCost(body.target_amount, inflationRate, years);
  const fvAssets = calculateFutureValue(body.already_saved, returnRate, years);
  const fvSavings = calculateFutureValueOfSavings(body.monthly_contribution, returnRate, years);
  const shortfall = calculateGoalShortfall(futureCost, fvAssets, fvSavings, 0);

  return repo.createGoal(userId, { ...body, shortfall: Math.round(shortfall) });
}

export function getGoalOptions(userId: string, goalId: string) {
  const goal = repo.getGoalById(userId, goalId);
  if (!goal || goal.shortfall <= 0) return null;
  const assumptions = repo.getAssumptions(userId);
  const years = yearsUntilYear(goal.target_year);
  const r = assumptions.expected_return;
  const inflationRate = goal.category === 'Education' ? assumptions.education_inflation
    : goal.category === 'Retirement' ? assumptions.retirement_inflation
    : assumptions.inflation_rate;

  return {
    goal_id: goalId,
    shortfall: goal.shortfall,
    option_a_required_monthly_savings: Math.round(
      calculateRequiredSavings(goal.shortfall, r, years) + goal.monthly_contribution
    ),
    option_b_supported_present_cost: Math.round(
      calculateSupportableCost(
        calculateFutureValue(goal.already_saved, r, years),
        calculateFutureValueOfSavings(goal.monthly_contribution, r, years),
        0, inflationRate, years
      )
    ),
    option_c_delay_months: calculateDelayMonths(goal.shortfall, goal.monthly_contribution, r),
  };
}

export function deleteGoal(userId: string, goalId: string) {
  return repo.deleteGoal(userId, goalId);
}

// ─── Recommendations ──────────────────────────────────────────────────────────
export function getRecommendations(userId: string) {
  return repo.getRecommendations(userId);
}

export function updateRecommendation(userId: string, recId: string, status: 'Active' | 'Dismissed' | 'Snoozed' | 'Addressed') {
  return repo.updateRecommendationStatus(userId, recId, status);
}

// ─── Assumptions ─────────────────────────────────────────────────────────────
export function getAssumptions(userId: string) {
  return repo.getAssumptions(userId);
}

// ─── Advisor ──────────────────────────────────────────────────────────────────
export function getAdvisorClients(advisorId: string) {
  return repo.getAdvisorClients(advisorId).map(u => {
    const profile = repo.getClientProfile(u.id);
    const whs = getWHSSnapshot(u.id);
    return {
      id: u.id, name: u.name, email: u.email,
      whs_score: whs?.score ?? 0,
      whs_category: whs?.category ?? 'VULNERABLE',
      segment: u.segment,
      age: profile?.age,
    };
  });
}

// ─── Investment Management Module (Phase 1) ───────────────────────────────────

/**
 * Mock monthly return series for development (12 months).
 * In production these come from custodian API price history.
 */
function getMockMonthlyReturns(seed: number): number[] {
  const returns: number[] = [];
  let prng = seed;
  for (let i = 0; i < 12; i++) {
    prng = (prng * 1664525 + 1013904223) & 0xffffffff;
    returns.push(((prng >>> 0) / 0xffffffff - 0.48) * 0.06); // ±3% monthly
  }
  return returns;
}

const BENCHMARK_MONTHLY_RETURNS = [
  0.015, -0.008, 0.022, 0.011, -0.012, 0.019,
  0.008, -0.005, 0.017, 0.021, -0.003, 0.014,
]; // Simulated Nifty 50 / S&P monthly returns

const RISK_FREE_RATE_ANNUAL = 0.065; // 6.5% — India 10Y Govt Bond

/**
 * Portfolio Summary — aggregates all accounts and holdings for a user.
 * Returns total value, asset breakdown by institution, and key counts.
 */
export function getPortfolioSummary(userId: string) {
  const holdings = repo.getHoldings(userId);
  const liabilities = repo.getLiabilities(userId);
  const incomeProfile = repo.getIncomeProfile(userId);
  const clientProfile = repo.getClientProfile(userId);
  const accounts = repo.getAccounts(userId);
  const institutions = repo.getInstitutions(userId);

  const totalValue = holdings.reduce((s, h) => s + h.current_value, 0);
  const totalLiabilities = liabilities.reduce((s, l) => s + l.outstanding_balance, 0);
  const netWorth = totalValue - totalLiabilities;

  // Group holdings by asset class
  const byAssetClass: Record<string, { value: number; count: number }> = {};
  for (const h of holdings) {
    if (!byAssetClass[h.category]) byAssetClass[h.category] = { value: 0, count: 0 };
    byAssetClass[h.category].value += h.current_value;
    byAssetClass[h.category].count += 1;
  }

  // Group by institution
  const byInstitution = institutions.map(inst => {
    const instAccounts = accounts.filter(a => a.institution_id === inst.id);
    const instHoldings = holdings.filter(h => instAccounts.some(a => a.id === h.account_id));
    return {
      institution_id: inst.id,
      institution_name: inst.name,
      institution_type: inst.type,
      total_value: instHoldings.reduce((s, h) => s + h.current_value, 0),
      account_count: instAccounts.length,
    };
  });

  const allocationPercent: Record<string, number> = {};
  for (const [cat, data] of Object.entries(byAssetClass)) {
    allocationPercent[cat] = totalValue > 0 ? data.value / totalValue : 0;
  }

  return {
    user_id: userId,
    total_portfolio_value: Math.round(totalValue),
    total_liabilities: Math.round(totalLiabilities),
    net_worth: Math.round(netWorth),
    holdings_count: holdings.length,
    account_count: accounts.length,
    institution_count: institutions.length,
    risk_profile: clientProfile?.risk_profile ?? 'Balanced',
    by_asset_class: Object.entries(byAssetClass).map(([category, data]) => ({
      category,
      value: Math.round(data.value),
      percentage: Math.round(allocationPercent[category] * 10000) / 100, // 2 decimal places
      count: data.count,
    })).sort((a, b) => b.value - a.value),
    by_institution: byInstitution,
    disclaimer: 'Advisory simulation only. Not a live custodian feed.',
  };
}

/**
 * Portfolio Performance Analytics.
 * Calculates TWR, annualized return, volatility, Sharpe Ratio, Beta, Alpha vs benchmark.
 */
export function getPortfolioPerformance(userId: string) {
  const holdings = repo.getHoldings(userId);
  const clientProfile = repo.getClientProfile(userId);
  const totalValue = holdings.reduce((s, h) => s + h.current_value, 0);

  // Generate mock monthly returns seeded from the user's portfolio value
  const seed = Math.abs(Math.round(totalValue)) || 12345;
  const monthlyReturns = getMockMonthlyReturns(seed);

  // Build period objects for TWR
  let runningValue = totalValue * 0.88; // approximate start-of-year value
  const periods: PeriodReturn[] = monthlyReturns.map(r => {
    const startValue = runningValue;
    const endValue = startValue * (1 + r);
    runningValue = endValue;
    return { startValue, endValue };
  });

  const twr = calculateTWR(periods);
  const annualizedTWR = annualizeReturn(twr, 1); // already ~1 year of data
  const volatility = calculateVolatility(monthlyReturns, 12);
  const rfMonthly = RISK_FREE_RATE_ANNUAL / 12;
  const sharpe = calculateSharpeRatio(annualizedTWR, RISK_FREE_RATE_ANNUAL, volatility);
  const beta = calculateBeta(monthlyReturns, BENCHMARK_MONTHLY_RETURNS);
  const benchmarkTWR = calculateTWR(
    BENCHMARK_MONTHLY_RETURNS.map((r, i) => ({
      startValue: 100000 * Math.pow(1.001, i),
      endValue: 100000 * Math.pow(1.001, i) * (1 + r),
    }))
  );
  const alpha = calculateAlpha(annualizedTWR, annualizeReturn(benchmarkTWR, 1), RISK_FREE_RATE_ANNUAL, beta);

  // Build monthly chart data
  let chartValue = totalValue * 0.88;
  let benchValue = totalValue * 0.88;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const chartData = monthlyReturns.map((r, i) => {
    const monthIdx = (currentMonth - 11 + i + 12) % 12;
    chartValue *= (1 + r);
    benchValue *= (1 + BENCHMARK_MONTHLY_RETURNS[i]);
    return {
      month: monthNames[monthIdx],
      portfolio_value: Math.round(chartValue),
      benchmark_value: Math.round(benchValue),
      portfolio_return_pct: Math.round(r * 10000) / 100,
    };
  });

  return {
    user_id: userId,
    risk_profile: clientProfile?.risk_profile ?? 'Balanced',
    period: 'YTD (12 months)',
    twr_pct: Math.round(twr * 10000) / 100,
    annualized_return_pct: Math.round(annualizedTWR * 10000) / 100,
    benchmark_return_pct: Math.round(benchmarkTWR * 10000) / 100,
    outperformance_pct: Math.round((twr - benchmarkTWR) * 10000) / 100,
    volatility_pct: Math.round(volatility * 10000) / 100,
    sharpe_ratio: Math.round(sharpe * 100) / 100,
    beta: Math.round(beta * 100) / 100,
    alpha_pct: Math.round(alpha * 10000) / 100,
    risk_free_rate_pct: Math.round(RISK_FREE_RATE_ANNUAL * 10000) / 100,
    monthly_chart: chartData,
    disclaimer: 'Performance is simulated for advisory illustration. Based on current holdings snapshot, not live price feeds.',
  };
}

/**
 * Asset Allocation — current vs target per risk profile.
 * Triggers rebalancing alerts when drift exceeds 5% threshold.
 */
export function getAssetAllocation(userId: string) {
  const holdings = repo.getHoldings(userId);
  const clientProfile = repo.getClientProfile(userId);
  const riskProfile = clientProfile?.risk_profile ?? 'Balanced';

  const currentAllocation = computeAssetAllocation(holdings);
  const targetAllocation = TARGET_ALLOCATIONS[riskProfile] ?? TARGET_ALLOCATIONS['Balanced'];
  const { totalDrift, driftByAsset } = calculatePortfolioDrift(currentAllocation, targetAllocation);

  const totalValue = holdings.reduce((s, h) => s + h.current_value, 0);

  const allAssets = new Set([...Object.keys(currentAllocation), ...Object.keys(targetAllocation)]);
  const breakdown = Array.from(allAssets).map(cat => ({
    category: cat,
    current_pct: Math.round((currentAllocation[cat] ?? 0) * 10000) / 100,
    target_pct: Math.round((targetAllocation[cat] ?? 0) * 10000) / 100,
    drift_pct: Math.round((driftByAsset[cat] ?? 0) * 10000) / 100,
    current_value: Math.round((currentAllocation[cat] ?? 0) * totalValue),
    needs_rebalance: (driftByAsset[cat] ?? 0) > 0.05,
  })).sort((a, b) => b.current_pct - a.current_pct);

  return {
    user_id: userId,
    risk_profile: riskProfile,
    total_portfolio_value: Math.round(totalValue),
    total_drift_pct: Math.round(totalDrift * 10000) / 100,
    needs_rebalance: totalDrift > 0.10, // >10% aggregate drift triggers alert
    breakdown,
    disclaimer: 'Target allocations are derived from Ric Edelman\'s portfolio methodology for your risk profile.',
  };
}

/**
 * Rebalancing Alerts — specific actions needed to restore target allocation.
 * Only fires when drift is material (>5% per asset class).
 */
export function getRebalancingAlerts(userId: string) {
  const allocation = getAssetAllocation(userId);
  const alerts = allocation.breakdown
    .filter(b => b.needs_rebalance)
    .map(b => ({
      category: b.category,
      action: b.current_pct > b.target_pct ? 'REDUCE' : 'INCREASE',
      current_pct: b.current_pct,
      target_pct: b.target_pct,
      drift_pct: b.drift_pct,
      amount_to_move: Math.round(Math.abs(b.current_pct - b.target_pct) / 100 * allocation.total_portfolio_value),
      message: b.current_pct > b.target_pct
        ? `Your ${b.category} allocation is ${b.drift_pct}% above target. Consider reducing exposure.`
        : `Your ${b.category} allocation is ${b.drift_pct}% below target. Consider increasing exposure.`,
    }));

  return {
    user_id: userId,
    risk_profile: allocation.risk_profile,
    needs_rebalance: allocation.needs_rebalance,
    total_drift_pct: allocation.total_drift_pct,
    alert_count: alerts.length,
    alerts,
    disclaimer: 'These are advisory suggestions only. Execute any trades through your external custodian broker.',
  };
}

// ─── AI Coach Mock Services (Modules 1.1, 1.2, 1.3) ─────────────────────────

export function getAIGoalCoachMessage(userId: string, goalId: string) {
  const goal = repo.getGoalById(userId, goalId);
  const options = getGoalOptions(userId, goalId);
  if (!goal || !options) return null;

  // RAG Integration
  const retrievedChunks = ragEngine.semanticSearch("goal shortfall risk mathematical options", "Goals");
  const promptContext = `Goal Name: ${goal.name}. Client needs to know options to fix shortfall.`;
  const synthesizedBase = ragEngine.generateResponse(promptContext, retrievedChunks);

  return {
    goal_id: goalId,
    message: `${synthesizedBase}\n\nOption A: Increase monthly savings to $${options.option_a_required_monthly_savings.toLocaleString()}.\nOption B: Reduce target cost to $${options.option_b_supported_present_cost.toLocaleString()}.\nOption C: Delay target date by ${options.option_c_delay_months} months.`,
    disclaimer: 'Advisory simulation only. Recommendations are not trading orders and do not constitute financial advice.',
  };
}

export function getAIRetirementCoachMessage(userId: string) {
  const profile = repo.getClientProfile(userId);
  const age = profile?.age ?? 40;
  
  // RAG Integration
  const retrievedChunks = ragEngine.semanticSearch("retirement longevity risk withdrawal sequence", "Retirement");
  const promptContext = `Retirement Plan for Age ${age}. Explain longevity and withdrawals.`;
  const synthesizedBase = ragEngine.generateResponse(promptContext, retrievedChunks);
  
  return {
    user_id: userId,
    sections: [
      {
        title: 'Retirement Roadmap via RAG',
        content: synthesizedBase,
      },
      {
        title: 'Spending Principal',
        content: `Don't panic about spending your principal in retirement. It is completely normal and mathematically necessary, provided your withdrawal rate is sustainable.`,
      }
    ],
    disclaimer: 'Advisory simulation only. Recommendations are not trading orders and do not constitute financial advice.',
  };
}

export function getAIRecommendationExplanation(userId: string, recId: string) {
  const rec = repo.getRecommendations(userId).find(r => r.id === recId);
  if (!rec) return null;

  // RAG Integration
  const categoryFilter = rec.category === "Debt" ? "Debt" : rec.category === "Emergency Fund" ? "Emergency Fund" : "Asset Allocation";
  const retrievedChunks = ragEngine.semanticSearch(rec.category, categoryFilter);
  const promptContext = `Explain rule violation for ${rec.category}.`;
  const synthesizedBase = ragEngine.generateResponse(promptContext, retrievedChunks);

  let action = '';

  switch (rec.category) {
    case 'Debt':
      action = `Pause extra investing and aggressively pay down this balance.`;
      break;
    case 'Emergency Fund':
      action = `Redirect savings to a high-yield cash account until your safety net is full.`;
      break;
    default:
      action = `Review your current allocations and follow the priority action provided.`;
  }

  return {
    recommendation_id: recId,
    explanation: {
      issue: `Rule Violation: ${rec.alert_message}`,
      matters: synthesizedBase,
      action,
    },
    disclaimer: 'Advisory simulation only. Recommendations are not trading orders and do not constitute financial advice.',
  };
}

export function chatWithAdvisor(userId: string, message: string) {
  const profile = repo.getClientProfile(userId);
  const context = `User Profile: Age ${profile?.age ?? 'Unknown'}. User Message: ${message}`;
  
  // Retrieve relevant Edelman rules
  const retrievedChunks = ragEngine.semanticSearch(message);
  
  // Synthesize response
  console.log(`[AI CHAT] Generating response for user ${userId}`);
  
  let responseText = "";
  if (retrievedChunks.length > 0) {
    responseText = `According to our principles: "${retrievedChunks[0].text}"\n\nHow can I help you apply this to your specific financial situation?`;
  } else {
    responseText = "I'm here to help you build wealth using our proven methodology. Could you provide a bit more detail about what you'd like to discuss?";
  }

  return {
    reply: responseText,
    disclaimer: 'Advisory simulation only. Not financial advice.'
  };
}

