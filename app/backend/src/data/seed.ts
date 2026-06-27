/**
 * In-memory seed data for the PWM prototype.
 * Phase 1: Repository data source. Replace arrays with Supabase queries in Phase 2.
 * No controller or service changes required on migration.
 */
import { v4 as uuidv4 } from 'uuid';
import {
  User, ClientProfile, Holding, Account, Institution, Liability, Goal,
  RecommendationAlert, NetWorthHistory, HouseholdProfile, HouseholdMember,
  IncomeProfile, InsuranceProfile, Assumptions, WealthSegment,
} from '../types';

// ─── Demo IDs ─────────────────────────────────────────────────────────────────
export const DEMO_CLIENT_ID = 'a1b2c3d4-0001-0001-0001-000000000001';
export const DEMO_ADVISOR_ID = 'a1b2c3d4-0002-0002-0002-000000000002';

// ─── Users ────────────────────────────────────────────────────────────────────
export const users: User[] = [
  {
    id: DEMO_CLIENT_ID,
    email: 'client@weallth.demo',
    password_hash: 'demo1234',
    name: 'Demo Client',
    role: 'client',
    onboarding_complete: false,  // Forces Wealth Discovery Wizard on first login
    segment: 'Mass Affluent',
  },
  {
    id: DEMO_ADVISOR_ID,
    email: 'advisor@weallth.demo',
    password_hash: 'demo1234',
    name: 'Demo Advisor',
    role: 'advisor',
    onboarding_complete: true,
    segment: 'HNI',
  },
];

// ─── Client Profiles ─────────────────────────────────────────────────────────
export const clientProfiles: ClientProfile[] = [
  {
    user_id: DEMO_CLIENT_ID,
    age: 34,
    risk_profile: 'Balanced',
    display_currency: 'USD',
  },
];

// ─── Household Profiles ───────────────────────────────────────────────────────
export const householdMembers: HouseholdMember[] = [];

export const householdProfiles: HouseholdProfile[] = [];

// ─── Income Profiles ──────────────────────────────────────────────────────────
export const incomeProfiles: IncomeProfile[] = [];

// ─── Insurance Profiles ───────────────────────────────────────────────────────
export const insuranceProfiles: InsuranceProfile[] = [];

// ─── Assumptions ─────────────────────────────────────────────────────────────
export const assumptionsStore: Assumptions[] = [];

// ─── Institutions (Financial Institutions) ────────────────────────────────────
export const institutions: Institution[] = [];

// ─── Accounts ────────────────────────────────────────────────────────────────
export const accounts: Account[] = [];

// ─── Holdings (Assets within Accounts) ───────────────────────────────────────
export const holdings: Holding[] = [];

// ─── Liabilities ──────────────────────────────────────────────────────────────
export const liabilities: Liability[] = [];

// ─── Goals ────────────────────────────────────────────────────────────────────
export const goals: Goal[] = [];

// ─── WHS Score History ────────────────────────────────────────────────────────
export const whsHistory: { user_id: string; score: number; category: string; date: string }[] = [];

// ─── Recommendation Alerts ────────────────────────────────────────────────────
export const recommendations: RecommendationAlert[] = [];

// ─── Net Worth History ─────────────────────────────────────────────────────────
export function generateNetWorthHistory(userId: string): NetWorthHistory[] {
  const userHoldings = holdings.filter(h => h.user_id === userId);
  const userLiabilities = liabilities.filter(l => l.user_id === userId);
  const totalAssets = userHoldings.reduce((s, h) => s + h.current_value, 0);
  const totalLiabilities = userLiabilities.reduce((s, l) => s + l.outstanding_balance, 0);
  const currentNetWorth = totalAssets - totalLiabilities;

  // Generate 6-month history based on current net worth
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return d.toISOString().slice(0, 7) + '-01';
  });

  return months.map((date, i) => ({
    date,
    net_worth: Math.round(currentNetWorth * (0.75 + (i * 0.05))),
  }));
}

// ─── Advisor → Client mapping ─────────────────────────────────────────────────
export const advisorClientConsent: { advisor_id: string; client_id: string }[] = [
  { advisor_id: DEMO_ADVISOR_ID, client_id: DEMO_CLIENT_ID },
];
