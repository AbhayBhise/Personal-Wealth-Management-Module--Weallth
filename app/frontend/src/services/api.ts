import { useAppStore } from '../store/useAppStore';

export const API_BASE = '/api/v1';

function getHeaders(extraHeaders: Record<string, string> = {}) {
  const token = useAppStore.getState().user?.token;
  return {
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
export async function fetchWHS(userId: string) {
  const res = await fetch(`${API_BASE}/users/${userId}/wealth-health-score`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch WHS');
  return res.json();
}

export async function fetchNetWorth(userId: string) {
  const res = await fetch(`${API_BASE}/users/${userId}/net-worth`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch net worth');
  return res.json();
}

export async function fetchRecommendations(userId: string) {
  const res = await fetch(`${API_BASE}/users/${userId}/recommendations`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch recommendations');
  return res.json();
}

export async function dismissRecommendation(userId: string, recId: string) {
  const res = await fetch(`${API_BASE}/users/${userId}/recommendations/${recId}`, {
    method: 'PATCH',
    headers: getHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ status: 'Dismissed' }),
  });
  if (!res.ok) throw new Error('Failed to dismiss recommendation');
  return res.json();
}

export async function sendAIChatMessage(userId: string, message: string) {
  const res = await fetch(`${API_BASE}/users/${userId}/ai/chat`, {
    method: 'POST',
    headers: getHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error('Failed to send AI chat message');
  return res.json();
}

export async function updatePreferences(userId: string, display_currency: string) {
  const res = await fetch(`${API_BASE}/users/${userId}/preferences`, {
    method: 'PATCH',
    headers: getHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ display_currency }),
  });
  if (!res.ok) throw new Error('Failed to update preferences');
  return res.json();
}
