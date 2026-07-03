import fs from 'fs';
import path from 'path';
import { User, ClientProfile, Holding, Account, Institution, Liability, Goal, RecommendationAlert, HouseholdProfile, HouseholdMember, IncomeProfile, InsuranceProfile, Assumptions } from '../types';

const DATA_FILE = path.join(__dirname, '../../data.json');

interface Database {
  users: User[];
  clientProfiles: ClientProfile[];
  householdMembers: HouseholdMember[];
  householdProfiles: HouseholdProfile[];
  incomeProfiles: IncomeProfile[];
  insuranceProfiles: InsuranceProfile[];
  assumptionsStore: Assumptions[];
  institutions: Institution[];
  accounts: Account[];
  holdings: Holding[];
  liabilities: Liability[];
  goals: Goal[];
  whsHistory: { user_id: string; score: number; category: string; date: string }[];
  recommendations: RecommendationAlert[];
}

let db: Database = {
  users: [],
  clientProfiles: [],
  householdMembers: [],
  householdProfiles: [],
  incomeProfiles: [],
  insuranceProfiles: [],
  assumptionsStore: [],
  institutions: [],
  accounts: [],
  holdings: [],
  liabilities: [],
  goals: [],
  whsHistory: [],
  recommendations: [],
};

export function loadDB() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      db = { ...db, ...parsed };
      console.log('Loaded data from', DATA_FILE);
    } catch (err) {
      console.error('Error parsing data.json:', err);
    }
  } else {
    console.log('No data.json found, starting fresh.');
  }
}

export function saveDB() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing data.json:', err);
  }
}

export function getUsers(): User[] {
  return db.users;
}

export function setUsers(users: User[]) {
  db.users = users;
  saveDB();
}

export function getClientProfiles(): ClientProfile[] {
  return db.clientProfiles;
}
export function setClientProfiles(profiles: ClientProfile[]) {
  db.clientProfiles = profiles;
  saveDB();
}

export function getHouseholdMembers(): HouseholdMember[] { return db.householdMembers; }
export function setHouseholdMembers(data: HouseholdMember[]) { db.householdMembers = data; saveDB(); }

export function getHouseholdProfiles(): HouseholdProfile[] { return db.householdProfiles; }
export function setHouseholdProfiles(data: HouseholdProfile[]) { db.householdProfiles = data; saveDB(); }

export function getIncomeProfiles(): IncomeProfile[] { return db.incomeProfiles; }
export function setIncomeProfiles(data: IncomeProfile[]) { db.incomeProfiles = data; saveDB(); }

export function getInsuranceProfiles(): InsuranceProfile[] { return db.insuranceProfiles; }
export function setInsuranceProfiles(data: InsuranceProfile[]) { db.insuranceProfiles = data; saveDB(); }

export function getAssumptionsStore(): Assumptions[] { return db.assumptionsStore; }
export function setAssumptionsStore(data: Assumptions[]) { db.assumptionsStore = data; saveDB(); }

export function getInstitutions(): Institution[] { return db.institutions; }
export function setInstitutions(data: Institution[]) { db.institutions = data; saveDB(); }

export function getAccounts(): Account[] { return db.accounts; }
export function setAccounts(data: Account[]) { db.accounts = data; saveDB(); }

export function getHoldings(): Holding[] { return db.holdings; }
export function setHoldings(data: Holding[]) { db.holdings = data; saveDB(); }

export function getLiabilities(): Liability[] { return db.liabilities; }
export function setLiabilities(data: Liability[]) { db.liabilities = data; saveDB(); }

export function getGoals(): Goal[] { return db.goals; }
export function setGoals(data: Goal[]) { db.goals = data; saveDB(); }

export function getWhsHistoryStore() { return db.whsHistory; }
export function setWhsHistoryStore(data: { user_id: string; score: number; category: string; date: string }[]) { db.whsHistory = data; saveDB(); }

export function getRecommendations(): RecommendationAlert[] { return db.recommendations; }
export function setRecommendations(data: RecommendationAlert[]) { db.recommendations = data; saveDB(); }
