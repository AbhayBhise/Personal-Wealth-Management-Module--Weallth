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
import { loadDB, getUsers, setUsers, getClientProfiles, setClientProfiles, getHouseholdMembers, setHouseholdMembers, getHouseholdProfiles, setHouseholdProfiles, getIncomeProfiles, setIncomeProfiles, getInsuranceProfiles, setInsuranceProfiles, getAssumptionsStore, setAssumptionsStore, getInstitutions, setInstitutions, getAccounts, setAccounts, getHoldings, setHoldings, getLiabilities, setLiabilities, getGoals, setGoals, getWhsHistoryStore, setWhsHistoryStore, getRecommendations, setRecommendations } from '../services/db';

loadDB();

// ─── Demo IDs ─────────────────────────────────────────────────────────────────
export const DEMO_CLIENT_ID = 'a1b2c3d4-0001-0001-0001-000000000001';
export const DEMO_ADVISOR_ID = 'a1b2c3d4-0002-0002-0002-000000000002';

let initialUsers = getUsers();
if (initialUsers.length === 0) {
  initialUsers = [
    {
      id: DEMO_CLIENT_ID,
      email: 'client@weallth.demo',
      password_hash: '$2a$10$X05mR2kP5y7Q5/L7c03JFeWnO5YgX3Q08T5w5YgX3Q08T5w5YgX3Q', // dummy bcrypt hash for demo1234
      name: 'Demo Client',
      role: 'client',
      onboarding_complete: false,
      segment: 'Mass Affluent',
    },
    {
      id: DEMO_ADVISOR_ID,
      email: 'advisor@weallth.demo',
      password_hash: '$2a$10$X05mR2kP5y7Q5/L7c03JFeWnO5YgX3Q08T5w5YgX3Q08T5w5YgX3Q',
      name: 'Demo Advisor',
      role: 'advisor',
      onboarding_complete: true,
      segment: 'HNI',
    },
  ];
  setUsers(initialUsers);
}
export const users: User[] = initialUsers;

let initialClientProfiles = getClientProfiles();
if (initialClientProfiles.length === 0) {
  initialClientProfiles = [
    {
      user_id: DEMO_CLIENT_ID,
      age: 34,
      risk_profile: 'Balanced',
      display_currency: 'USD',
    },
  ];
  setClientProfiles(initialClientProfiles);
}
export const clientProfiles: ClientProfile[] = initialClientProfiles;

// ─── Household Profiles ───────────────────────────────────────────────────────
let initialHouseholdMembers = getHouseholdMembers();
if (initialHouseholdMembers.length === 0) { setHouseholdMembers(initialHouseholdMembers); }
export const householdMembers: HouseholdMember[] = initialHouseholdMembers;

let initialHouseholdProfiles = getHouseholdProfiles();
if (initialHouseholdProfiles.length === 0) { setHouseholdProfiles(initialHouseholdProfiles); }
export const householdProfiles: HouseholdProfile[] = initialHouseholdProfiles;

// ─── Income Profiles ──────────────────────────────────────────────────────────
let initialIncomeProfiles = getIncomeProfiles();
if (initialIncomeProfiles.length === 0) { setIncomeProfiles(initialIncomeProfiles); }
export const incomeProfiles: IncomeProfile[] = initialIncomeProfiles;

// ─── Insurance Profiles ───────────────────────────────────────────────────────
let initialInsuranceProfiles = getInsuranceProfiles();
if (initialInsuranceProfiles.length === 0) { setInsuranceProfiles(initialInsuranceProfiles); }
export const insuranceProfiles: InsuranceProfile[] = initialInsuranceProfiles;

// ─── Assumptions ─────────────────────────────────────────────────────────────
let initialAssumptionsStore = getAssumptionsStore();
if (initialAssumptionsStore.length === 0) { setAssumptionsStore(initialAssumptionsStore); }
export const assumptionsStore: Assumptions[] = initialAssumptionsStore;

// ─── Institutions (Financial Institutions) ────────────────────────────────────
let initialInstitutions = getInstitutions();
if (initialInstitutions.length === 0) { setInstitutions(initialInstitutions); }
export const institutions: Institution[] = initialInstitutions;

// ─── Accounts ────────────────────────────────────────────────────────────────
let initialAccounts = getAccounts();
if (initialAccounts.length === 0) { setAccounts(initialAccounts); }
export const accounts: Account[] = initialAccounts;

// ─── Holdings (Assets within Accounts) ───────────────────────────────────────
let initialHoldings = getHoldings();
if (initialHoldings.length === 0) { setHoldings(initialHoldings); }
export const holdings: Holding[] = initialHoldings;

// ─── Liabilities ──────────────────────────────────────────────────────────────
let initialLiabilities = getLiabilities();
if (initialLiabilities.length === 0) { setLiabilities(initialLiabilities); }
export const liabilities: Liability[] = initialLiabilities;

// ─── Goals ────────────────────────────────────────────────────────────────────
let initialGoals = getGoals();
if (initialGoals.length === 0) { setGoals(initialGoals); }
export const goals: Goal[] = initialGoals;

// ─── WHS Score History ────────────────────────────────────────────────────────
let initialWhsHistory = getWhsHistoryStore();
if (initialWhsHistory.length === 0) { setWhsHistoryStore(initialWhsHistory); }
export const whsHistory: { user_id: string; score: number; category: string; date: string }[] = initialWhsHistory;

// ─── Recommendation Alerts ────────────────────────────────────────────────────
let initialRecommendations = getRecommendations();
if (initialRecommendations.length === 0) { setRecommendations(initialRecommendations); }
export const recommendations: RecommendationAlert[] = initialRecommendations;

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
