import { create } from 'zustand';
import { AuthUser, WHSSnapshot, Goal, RecommendationAlert, NetWorthHistory, FinancialSnapshot, PortfolioSummary, PortfolioPerformance, AssetAllocation, RebalancingAlerts } from '../types';
import { API_BASE } from '../services/api';

interface AppState {
  user: AuthUser | null;
  financialSnapshot: FinancialSnapshot | null;
  whs: WHSSnapshot | null;
  goals: Goal[];
  recommendations: RecommendationAlert[];
  netWorthHistory: NetWorthHistory[];
  isLoadingDashboard: boolean;

  // ─── Investment Management State ───────────────────────────────────────
  portfolioSummary: PortfolioSummary | null;
  portfolioPerformance: PortfolioPerformance | null;
  assetAllocation: AssetAllocation | null;
  rebalancingAlerts: RebalancingAlerts | null;
  isLoadingPortfolio: boolean;

  // ─── AI Mock State ───────────────────────────────────────────────────────
  aiRetirementCoachMessage: AIRetirementCoachMessage | null;
  fetchAIRetirementCoach: (userId: string) => Promise<void>;

  setUser: (user: AuthUser | null) => void;
  setFinancialSnapshot: (snapshot: FinancialSnapshot) => void;
  fetchDashboardData: (userId: string) => Promise<void>;
  fetchPortfolioData: (userId: string) => Promise<void>;
  dismissRecommendation: (recId: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  financialSnapshot: null,
  whs: null,
  goals: [],
  recommendations: [],
  netWorthHistory: [],
  isLoadingDashboard: false,

  // ─── Investment Management Initial State ───────────────────────────────
  portfolioSummary: null,
  portfolioPerformance: null,
  assetAllocation: null,
  rebalancingAlerts: null,
  isLoadingPortfolio: false,

  aiRetirementCoachMessage: null,

  setUser: (user) => set({ user }),

  setFinancialSnapshot: (snapshot) => set({ financialSnapshot: snapshot }),

  fetchDashboardData: async (userId: string) => {
    set({ isLoadingDashboard: true });
    try {
      const [whsRes, goalsRes, recsRes, nwRes] = await Promise.all([
        fetch(`${API_BASE}/users/${userId}/wealth-health-score`),
        fetch(`${API_BASE}/users/${userId}/goals`),
        fetch(`${API_BASE}/users/${userId}/recommendations`),
        fetch(`${API_BASE}/users/${userId}/net-worth`),
      ]);
      const [whs, goals, recommendations, netWorthHistory] = await Promise.all([
        whsRes.json(), goalsRes.json(), recsRes.json(), nwRes.json(),
      ]);
      set({ whs, goals, recommendations, netWorthHistory, isLoadingDashboard: false });
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      set({ isLoadingDashboard: false });
    }
  },

  fetchPortfolioData: async (userId: string) => {
    set({ isLoadingPortfolio: true });
    try {
      const [summaryRes, perfRes, allocRes, rebalRes] = await Promise.all([
        fetch(`${API_BASE}/users/${userId}/portfolio/summary`),
        fetch(`${API_BASE}/users/${userId}/portfolio/performance`),
        fetch(`${API_BASE}/users/${userId}/portfolio/allocation`),
        fetch(`${API_BASE}/users/${userId}/portfolio/rebalancing`),
      ]);
      const [portfolioSummary, portfolioPerformance, assetAllocation, rebalancingAlerts] = await Promise.all([
        summaryRes.json(), perfRes.json(), allocRes.json(), rebalRes.json(),
      ]);
      set({ portfolioSummary, portfolioPerformance, assetAllocation, rebalancingAlerts, isLoadingPortfolio: false });
    } catch (err) {
      console.error('Portfolio fetch error:', err);
      set({ isLoadingPortfolio: false });
    }
  },

  fetchAIRetirementCoach: async (userId: string) => {
    try {
      const res = await fetch(`${API_BASE}/users/${userId}/retirement-coach`);
      if (res.ok) {
        set({ aiRetirementCoachMessage: await res.json() });
      }
    } catch (err) {
      console.error('AI Retirement Coach fetch error:', err);
    }
  },

  dismissRecommendation: async (recId: string) => {
    const { user } = get();
    if (!user) return;
    await fetch(`${API_BASE}/users/${user.id}/recommendations/${recId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Dismissed' }),
    });
    set({ recommendations: get().recommendations.filter(r => r.id !== recId) });
  },
}));

