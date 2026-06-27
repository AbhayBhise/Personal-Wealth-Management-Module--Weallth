export const API_BASE = '/api/v1';

export async function fetchWHS(userId: string) {
  const res = await fetch(`${API_BASE}/users/${userId}/wealth-health-score`);
  if (!res.ok) throw new Error('Failed to fetch WHS');
  return res.json();
}

export async function fetchNetWorth(userId: string) {
  const res = await fetch(`${API_BASE}/users/${userId}/net-worth`);
  if (!res.ok) throw new Error('Failed to fetch net worth');
  return res.json();
}

export async function fetchRecommendations(userId: string) {
  const res = await fetch(`${API_BASE}/users/${userId}/recommendations`);
  if (!res.ok) throw new Error('Failed to fetch recommendations');
  return res.json();
}

export async function dismissRecommendation(userId: string, recId: string) {
  const res = await fetch(`${API_BASE}/users/${userId}/recommendations/${recId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Dismissed' }),
  });
  if (!res.ok) throw new Error('Failed to dismiss recommendation');
  return res.json();
}
