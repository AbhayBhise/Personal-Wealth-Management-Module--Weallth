import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser, WHSSnapshot, Goal, RecommendationAlert, NetWorthHistory, FinancialSnapshot, PortfolioSummary, PortfolioPerformance, AssetAllocation, RebalancingAlerts, AIRetirementCoachMessage } from '../types';
import { API_BASE, sendAIChatMessage, updatePreferences } from '../services/api';

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
  logout: () => void;
  setFinancialSnapshot: (snapshot: FinancialSnapshot) => void;
  fetchDashboardData: (userId: string) => Promise<void>;
  fetchPortfolioData: (userId: string) => Promise<void>;
  dismissRecommendation: (recId: string) => Promise<void>;

  // ─── Chat State ───────────────────────────────────────────────────────────
  chatHistory: { sender: 'user' | 'ai', text: string, suggestedFollowUps?: string[], diagnostics?: any }[];
  isChatOpen: boolean;
  isChatLoading: boolean;
  toggleChat: () => void;
  sendChatMessage: (message: string) => Promise<void>;

  // ─── Currency State ───────────────────────────────────────────────────────
  currency: string;
  setCurrency: (currency: string) => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
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

  setUser: (user) => {
    set({ user });
    if (user?.display_currency) {
      set({ currency: user.display_currency });
    }
  },

  logout: () => set({ user: null, whs: null, portfolioSummary: null }),

  setFinancialSnapshot: (snapshot) => set({ financialSnapshot: snapshot }),

  fetchDashboardData: async (userId: string) => {
    set({ isLoadingDashboard: true });
    try {
      const headers: Record<string, string> = get().user?.token ? { Authorization: `Bearer ${get().user?.token}` } : {};
      const [whsRes, goalsRes, recsRes, nwRes] = await Promise.all([
        fetch(`${API_BASE}/users/${userId}/wealth-health-score`, { headers }),
        fetch(`${API_BASE}/users/${userId}/goals`, { headers }),
        fetch(`${API_BASE}/users/${userId}/recommendations`, { headers }),
        fetch(`${API_BASE}/users/${userId}/net-worth`, { headers }),
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
      const headers: Record<string, string> = get().user?.token ? { Authorization: `Bearer ${get().user?.token}` } : {};
      const [summaryRes, perfRes, allocRes, rebalRes] = await Promise.all([
        fetch(`${API_BASE}/users/${userId}/portfolio/summary`, { headers }),
        fetch(`${API_BASE}/users/${userId}/portfolio/performance`, { headers }),
        fetch(`${API_BASE}/users/${userId}/portfolio/allocation`, { headers }),
        fetch(`${API_BASE}/users/${userId}/portfolio/rebalancing`, { headers }),
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
      const headers: Record<string, string> = get().user?.token ? { Authorization: `Bearer ${get().user?.token}` } : {};
      const res = await fetch(`${API_BASE}/users/${userId}/retirement-coach`, { headers });
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
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (user.token) headers['Authorization'] = `Bearer ${user.token}`;
    await fetch(`${API_BASE}/users/${user.id}/recommendations/${recId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status: 'Dismissed' }),
    });
    set({ recommendations: get().recommendations.filter(r => r.id !== recId) });
  },

  // ─── Chat State ───────────────────────────────────────────────────────────
  chatHistory: [],
  isChatOpen: false,
  isChatLoading: false,
  toggleChat: () => set(state => ({ isChatOpen: !state.isChatOpen })),
  sendChatMessage: async (message: string) => {
    const { user, chatHistory } = get();
    if (!user) return;
    
    // Optimistic update for user message
    const newHistory = [...chatHistory, { sender: 'user' as const, text: message }];
    set({ chatHistory: newHistory, isChatLoading: true });
    
    try {
      const response = await sendAIChatMessage(user.id, message, chatHistory);
      set({ 
        chatHistory: [
          ...newHistory,
          {
            sender: 'ai' as const,
            text: response.reply,
            suggestedFollowUps: response.suggestedFollowUps,
            diagnostics: response.diagnostics,
          }
        ],
        isChatLoading: false
      });
    } catch (err) {
      console.error('Chat error:', err);
      set({ 
        chatHistory: [...newHistory, { sender: 'ai' as const, text: 'Sorry, I am having trouble connecting right now.' }],
        isChatLoading: false 
      });
    }
  },

  // ─── Currency State ───────────────────────────────────────────────────────
  currency: 'INR',
  setCurrency: async (currency: string) => {
    const { user } = get();
    set({ currency }); // Optimistic update
    if (user) {
      try {
        await updatePreferences(user.id, currency);
      } catch (err) {
        console.error('Failed to update currency preferences:', err);
      }
    }
  },
    }),
    {
      name: 'weallth-auth-storage',
      partialize: (state) => ({ user: state.user }), // Only persist user/token
    }
  )
);
