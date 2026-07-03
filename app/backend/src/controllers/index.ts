/**
 * Controller layer — handles HTTP req/res only.
 * No business logic. No financial formulas.
 * Calls services, maps results to responses.
 */
import { Request, Response } from 'express';
import * as svc from '../services';

// ─── Auth ──────────────────────────────────────────────────────────────────────
export function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  const user = svc.loginUser(email, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }
  return res.status(200).json(user);
}

export function register(req: Request, res: Response) {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required.' });
  }
  try {
    const user = svc.registerUser(email, password, name);
    return res.status(201).json(user);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}

export function patchUserPreferences(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { display_currency } = req.body;
    const result = svc.updateUserPreferences(userId, { display_currency });
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update preferences', detail: err.message });
  }
}

// ─── Risk Questions ────────────────────────────────────────────────────────────
export function getRiskQuestions(_req: Request, res: Response) {
  return res.status(200).json(svc.getRiskQuestions());
}

// ─── Wealth Discovery ──────────────────────────────────────────────────────────
export function submitWealthDiscovery(req: Request, res: Response) {
  const { userId } = req.params;
  try {
    const snapshot = svc.submitWealthDiscovery(userId, req.body);
    return res.status(200).json(snapshot);
  } catch (err: any) {
    console.error('WealthDiscovery error:', err);
    return res.status(500).json({ error: 'Failed to process wealth discovery.', detail: err.message });
  }
}

// ─── WHS ───────────────────────────────────────────────────────────────────────
export function getWHSSnapshot(req: Request, res: Response) {
  const snapshot = svc.getWHSSnapshot(req.params.userId);
  if (!snapshot) return res.status(404).json({ error: 'Profile not found.' });
  return res.status(200).json(snapshot);
}

// ─── Net Worth ─────────────────────────────────────────────────────────────────
export function getNetWorth(req: Request, res: Response) {
  const data = svc.getNetWorth(req.params.userId);
  return res.status(200).json(data);
}

// ─── Goals ─────────────────────────────────────────────────────────────────────
export function getGoals(req: Request, res: Response) {
  return res.status(200).json(svc.getGoals(req.params.userId));
}

export function createGoal(req: Request, res: Response) {
  const { userId } = req.params;
  const { name, category, priority, target_amount, target_year, already_saved, monthly_contribution } = req.body;
  if (!name || !category || !target_amount || !target_year) {
    return res.status(400).json({ error: 'name, category, target_amount, and target_year are required.' });
  }
  const goal = svc.createGoal(userId, {
    name, category, priority: priority ?? 'Medium',
    target_amount: Number(target_amount),
    target_year: Number(target_year),
    already_saved: Number(already_saved ?? 0),
    monthly_contribution: Number(monthly_contribution ?? 0),
  });
  return res.status(201).json(goal);
}

export function getGoalOptions(req: Request, res: Response) {
  const { userId, goalId } = req.params;
  const options = svc.getGoalOptions(userId, goalId);
  if (!options) return res.status(404).json({ error: 'Goal not found or has no shortfall.' });
  return res.status(200).json(options);
}

export function deleteGoal(req: Request, res: Response) {
  const { userId, goalId } = req.params;
  const success = svc.deleteGoal(userId, goalId);
  if (!success) return res.status(404).json({ error: 'Goal not found.' });
  return res.status(204).send();
}

// ─── Recommendations ───────────────────────────────────────────────────────────
export function getRecommendations(req: Request, res: Response) {
  return res.status(200).json(svc.getRecommendations(req.params.userId));
}

export function updateRecommendation(req: Request, res: Response) {
  const { userId, recId } = req.params;
  const { status } = req.body;
  const result = svc.updateRecommendation(userId, recId, status);
  if (!result) return res.status(404).json({ error: 'Recommendation not found.' });
  return res.status(200).json(result);
}

// ─── Assumptions ───────────────────────────────────────────────────────────────
export function getAssumptions(req: Request, res: Response) {
  return res.status(200).json(svc.getAssumptions(req.params.userId));
}

// ─── Advisor ───────────────────────────────────────────────────────────────────
export function getAdvisorClients(req: Request, res: Response) {
  return res.status(200).json(svc.getAdvisorClients(req.params.advisorId));
}

// ─── Investment Management Module (Phase 1) ────────────────────────────────────

export function getPortfolioSummary(req: Request, res: Response) {
  try {
    const data = svc.getPortfolioSummary(req.params.userId);
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve portfolio summary.', detail: err.message });
  }
}

export function getPortfolioPerformance(req: Request, res: Response) {
  try {
    const data = svc.getPortfolioPerformance(req.params.userId);
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to calculate portfolio performance.', detail: err.message });
  }
}

export function getAssetAllocation(req: Request, res: Response) {
  try {
    const data = svc.getAssetAllocation(req.params.userId);
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve asset allocation.', detail: err.message });
  }
}

export function getRebalancingAlerts(req: Request, res: Response) {
  try {
    const data = svc.getRebalancingAlerts(req.params.userId);
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve rebalancing alerts.', detail: err.message });
  }
}

// ─── AI Mock Services (Modules 1.1, 1.2, 1.3) ──────────────────────────────────

export function getAIGoalCoachMessage(req: Request, res: Response) {
  try {
    const data = svc.getAIGoalCoachMessage(req.params.userId, req.params.goalId);
    if (!data) return res.status(404).json({ error: 'Goal or shortfall not found.' });
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve AI Goal Coach message.', detail: err.message });
  }
}

export function getAIRetirementCoachMessage(req: Request, res: Response) {
  try {
    const data = svc.getAIRetirementCoachMessage(req.params.userId);
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve AI Retirement Coach message.', detail: err.message });
  }
}

export function getAIRecommendationExplanation(req: Request, res: Response) {
  try {
    const data = svc.getAIRecommendationExplanation(req.params.userId, req.params.recId);
    if (!data) return res.status(404).json({ error: 'Recommendation not found.' });
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve AI Recommendation Explanation.', detail: err.message });
  }
}

export function postAIChat(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }
    const data = svc.chatWithAdvisor(userId, message);
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to process AI chat.', detail: err.message });
  }
}
