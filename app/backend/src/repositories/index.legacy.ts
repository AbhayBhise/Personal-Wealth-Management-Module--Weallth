/**
 * SUPERSEDED BY src/repositories/index.ts (Prisma Postgres Cutover 2026-07-30)
 * Legacy JSON-backed repository layer — retained for historical audit trail.
 */
import { v4 as uuidv4 } from 'uuid';
import {
  users, clientProfiles, holdings, accounts, institutions, liabilities, goals,
  recommendations, householdProfiles, householdMembers, incomeProfiles,
  insuranceProfiles, assumptionsStore, advisorClientConsent, whsHistory,
  generateNetWorthHistory, DEMO_CLIENT_ID,
} from '../data/seed';
import {
  User, ClientProfile, Holding, Account, Institution, Liability, Goal,
  RecommendationAlert, AlertStatus, HouseholdProfile, HouseholdMember,
  IncomeProfile, InsuranceProfile, Assumptions,
} from '../types';
import { saveDB } from '../services/db';

// ─── Users ────────────────────────────────────────────────────────────────────
export function findUserByEmail(email: string): User | undefined {
  return users.find(u => u.email === email);
}

export function createUser(data: Omit<User, 'id'>): User {
  const newUser: User = {
    id: uuidv4(),
    ...data,
  };
  users.push(newUser);
  saveDB();
  return newUser;
}

export function findUserById(userId: string): User | undefined {
  return users.find(u => u.id === userId);
}

export function updateUser(userId: string, updates: Partial<User>): User | null {
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return null;
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates };
  saveDB();
  return users[idx];
}

// ─── Client Profiles ─────────────────────────────────────────────────────────
export function getClientProfile(userId: string): ClientProfile | undefined {
  return clientProfiles.find(p => p.user_id === userId);
}

export function upsertClientProfile(userId: string, data: Partial<ClientProfile>): ClientProfile {
  const idx = clientProfiles.findIndex(p => p.user_id === userId);
  if (idx === -1) {
    const newProfile: ClientProfile = {
      user_id: userId,
      age: 30,
      risk_profile: 'Balanced',
      display_currency: 'USD',
      ...data,
    };
    clientProfiles.push(newProfile);
    saveDB();
    return newProfile;
  }
  clientProfiles[idx] = { ...clientProfiles[idx], ...data };
  saveDB();
  return clientProfiles[idx];
}

// ─── Household ────────────────────────────────────────────────────────────────
export function getHouseholdProfile(userId: string): HouseholdProfile | undefined {
  return householdProfiles.find(h => h.user_id === userId);
}

export function upsertHouseholdProfile(userId: string, data: Partial<HouseholdProfile>): HouseholdProfile {
  const idx = householdProfiles.findIndex(h => h.user_id === userId);
  if (idx === -1) {
    const newProfile: HouseholdProfile = {
      user_id: userId,
      marital_status: 'Single',
      occupation: '',
      dependents: [],
      ...data,
    };
    householdProfiles.push(newProfile);
    saveDB();
    return newProfile;
  }
  householdProfiles[idx] = { ...householdProfiles[idx], ...data };
  saveDB();
  return householdProfiles[idx];
}

export function addHouseholdMember(userId: string, member: Omit<HouseholdMember, 'id' | 'user_id'>): HouseholdMember {
  const newMember: HouseholdMember = {
    id: uuidv4(),
    user_id: userId,
    ...member,
  };
  householdMembers.push(newMember);
  saveDB();
  return newMember;
}

export function getHouseholdMembers(userId: string): HouseholdMember[] {
  return householdMembers.filter(m => m.user_id === userId);
}

// ─── Income ───────────────────────────────────────────────────────────────────
export function getIncomeProfile(userId: string): IncomeProfile | undefined {
  return incomeProfiles.find(i => i.user_id === userId);
}

export function upsertIncomeProfile(userId: string, data: Partial<IncomeProfile>): IncomeProfile {
  const idx = incomeProfiles.findIndex(i => i.user_id === userId);
  if (idx === -1) {
    const newProfile: IncomeProfile = { user_id: userId, salary: 0, business: 0, rental: 0, other: 0, ...data };
    incomeProfiles.push(newProfile);
    saveDB();
    return newProfile;
  }
  incomeProfiles[idx] = { ...incomeProfiles[idx], ...data };
  saveDB();
  return incomeProfiles[idx];
}

// ─── Insurance ────────────────────────────────────────────────────────────────
export function getInsuranceProfile(userId: string): InsuranceProfile | undefined {
  return insuranceProfiles.find(i => i.user_id === userId);
}

export function upsertInsuranceProfile(userId: string, data: Partial<InsuranceProfile>): InsuranceProfile {
  const idx = insuranceProfiles.findIndex(i => i.user_id === userId);
  if (idx === -1) {
    const newProfile: InsuranceProfile = {
      user_id: userId, life_coverage: 0, health_coverage: 0,
      disability_coverage_monthly: 0, has_long_term_care: false, ...data,
    };
    insuranceProfiles.push(newProfile);
    saveDB();
    return newProfile;
  }
  insuranceProfiles[idx] = { ...insuranceProfiles[idx], ...data };
  saveDB();
  return insuranceProfiles[idx];
}

// ─── Assumptions ─────────────────────────────────────────────────────────────
export function getAssumptions(userId: string): Assumptions {
  const stored = assumptionsStore.find(a => a.user_id === userId);
  if (stored) return stored;
  // Default Edelman-aligned assumptions
  return {
    user_id: userId,
    inflation_rate: 0.03,
    expected_return: 0.07,
    retirement_inflation: 0.04,
    education_inflation: 0.06,
  };
}

export function upsertAssumptions(userId: string, data: Partial<Assumptions>): Assumptions {
  const idx = assumptionsStore.findIndex(a => a.user_id === userId);
  if (idx === -1) {
    const newAssumptions: Assumptions = {
      user_id: userId,
      inflation_rate: 0.03,
      expected_return: 0.07,
      retirement_inflation: 0.04,
      education_inflation: 0.06,
      ...data,
    };
    assumptionsStore.push(newAssumptions);
    saveDB();
    return newAssumptions;
  }
  assumptionsStore[idx] = { ...assumptionsStore[idx], ...data };
  saveDB();
  return assumptionsStore[idx];
}

// ─── Institutions ─────────────────────────────────────────────────────────────
export function getInstitutions(userId: string): Institution[] {
  return institutions.filter(i => i.user_id === userId);
}

export function createInstitution(userId: string, data: Omit<Institution, 'id' | 'user_id'>): Institution {
  const newInst: Institution = { id: uuidv4(), user_id: userId, ...data };
  institutions.push(newInst);
  saveDB();
  return newInst;
}

// ─── Accounts ─────────────────────────────────────────────────────────────────
export function getAccounts(userId: string): Account[] {
  return accounts.filter(a => a.user_id === userId);
}

export function createAccount(userId: string, data: Omit<Account, 'id' | 'user_id'>): Account {
  const newAccount: Account = { id: uuidv4(), user_id: userId, ...data };
  accounts.push(newAccount);
  saveDB();
  return newAccount;
}

// ─── Holdings ─────────────────────────────────────────────────────────────────
export function getHoldings(userId: string): Holding[] {
  return holdings.filter(h => h.user_id === userId);
}

export function createHolding(userId: string, data: Omit<Holding, 'id' | 'user_id'>): Holding {
  const newHolding: Holding = { id: uuidv4(), user_id: userId, ...data };
  holdings.push(newHolding);
  saveDB();
  return newHolding;
}

// ─── Liabilities ──────────────────────────────────────────────────────────────
export function getLiabilities(userId: string): Liability[] {
  return liabilities.filter(l => l.user_id === userId);
}

export function createLiability(userId: string, data: Omit<Liability, 'id' | 'user_id'>): Liability {
  const newLiability: Liability = { id: uuidv4(), user_id: userId, ...data };
  liabilities.push(newLiability);
  saveDB();
  return newLiability;
}

// ─── Goals ────────────────────────────────────────────────────────────────────
export function getGoals(userId: string): Goal[] {
  return goals.filter(g => g.user_id === userId);
}

export function getGoalById(userId: string, goalId: string): Goal | undefined {
  return goals.find(g => g.user_id === userId && g.id === goalId);
}

export function createGoal(userId: string, data: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Goal {
  const now = new Date().toISOString();
  const newGoal: Goal = {
    id: uuidv4(), user_id: userId,
    created_at: now, updated_at: now, ...data,
  };
  goals.push(newGoal);
  saveDB();
  return newGoal;
}

export function updateGoal(userId: string, goalId: string, data: Partial<Goal>): Goal | null {
  const idx = goals.findIndex(g => g.user_id === userId && g.id === goalId);
  if (idx === -1) return null;
  goals[idx] = { ...goals[idx], ...data, updated_at: new Date().toISOString() };
  saveDB();
  return goals[idx];
}

export function deleteGoal(userId: string, goalId: string): boolean {
  const idx = goals.findIndex(g => g.user_id === userId && g.id === goalId);
  if (idx === -1) return false;
  goals.splice(idx, 1);
  saveDB();
  return true;
}

// ─── Recommendations ──────────────────────────────────────────────────────────
export function getRecommendations(userId: string): RecommendationAlert[] {
  return recommendations.filter(r => r.user_id === userId && r.status === 'Active');
}

export function replaceRecommendations(userId: string, newRecs: Omit<RecommendationAlert, 'id' | 'created_at' | 'status'>[]): RecommendationAlert[] {
  // Remove all active recs for this user
  const idx = recommendations.reduce<number[]>((acc, r, i) => {
    if (r.user_id === userId) acc.push(i);
    return acc;
  }, []);
  idx.reverse().forEach(i => recommendations.splice(i, 1));

  const now = new Date().toISOString();
  const created = newRecs.map(r => ({
    ...r,
    id: uuidv4(),
    created_at: now,
    status: 'Active' as const,
  }));
  recommendations.push(...created);
  saveDB();
  return created;
}

export function updateRecommendationStatus(userId: string, recId: string, status: AlertStatus): RecommendationAlert | null {
  const idx = recommendations.findIndex(r => r.user_id === userId && r.id === recId);
  if (idx === -1) return null;
  recommendations[idx] = { ...recommendations[idx], status };
  saveDB();
  return recommendations[idx];
}

// ─── Net Worth History ────────────────────────────────────────────────────────
export function getNetWorthHistory(userId: string) {
  return generateNetWorthHistory(userId);
}

// ─── WHS History ──────────────────────────────────────────────────────────────
export function getWhsHistory(userId: string) {
  return whsHistory.filter(h => h.user_id === userId);
}

export function appendWhsHistory(userId: string, score: number, category: string) {
  whsHistory.push({
    user_id: userId,
    score,
    category,
    date: new Date().toISOString().slice(0, 10),
  });
  saveDB();
}

// ─── Advisor → Client ─────────────────────────────────────────────────────────
export function getAdvisorClients(advisorId: string): User[] {
  const clientIds = advisorClientConsent.filter(a => a.advisor_id === advisorId).map(a => a.client_id);
  return users.filter(u => clientIds.includes(u.id));
}
