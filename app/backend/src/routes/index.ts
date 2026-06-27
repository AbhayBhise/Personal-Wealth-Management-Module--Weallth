/**
 * API route definitions — Maps HTTP endpoints to controllers.
 * No business logic here. All logic lives in services.
 */
import { Router } from 'express';
import * as ctrl from '../controllers';

const router = Router();

// ─── Auth ──────────────────────────────────────────────────────────────────────
router.post('/auth/login', ctrl.login);

// ─── Risk Questions (for Step 6 of onboarding) ────────────────────────────────
router.get('/risk-questions', ctrl.getRiskQuestions);

// ─── Wealth Discovery (Onboarding) ────────────────────────────────────────────
router.post('/users/:userId/wealth-discovery', ctrl.submitWealthDiscovery);

// ─── WHS ───────────────────────────────────────────────────────────────────────
router.get('/users/:userId/wealth-health-score', ctrl.getWHSSnapshot);

// ─── Net Worth ─────────────────────────────────────────────────────────────────
router.get('/users/:userId/net-worth', ctrl.getNetWorth);

// ─── Goals ─────────────────────────────────────────────────────────────────────
router.get('/users/:userId/goals', ctrl.getGoals);
router.post('/users/:userId/goals', ctrl.createGoal);
router.get('/users/:userId/goals/:goalId/options', ctrl.getGoalOptions);
router.delete('/users/:userId/goals/:goalId', ctrl.deleteGoal);

// ─── Recommendations ───────────────────────────────────────────────────────────
router.get('/users/:userId/recommendations', ctrl.getRecommendations);
router.patch('/users/:userId/recommendations/:recId', ctrl.updateRecommendation);

// ─── Assumptions ───────────────────────────────────────────────────────────────
router.get('/users/:userId/assumptions', ctrl.getAssumptions);

// ─── Advisor ───────────────────────────────────────────────────────────────────
router.get('/advisors/:advisorId/clients', ctrl.getAdvisorClients);

// ─── Investment Management Module (Phase 1) ────────────────────────────────────
router.get('/users/:userId/portfolio/summary', ctrl.getPortfolioSummary);
router.get('/users/:userId/portfolio/performance', ctrl.getPortfolioPerformance);
router.get('/users/:userId/portfolio/allocation', ctrl.getAssetAllocation);
router.get('/users/:userId/portfolio/rebalancing', ctrl.getRebalancingAlerts);

// ─── AI Mock Services (Modules 1.1, 1.2, 1.3) ──────────────────────────────────
router.get('/users/:userId/goals/:goalId/coach', ctrl.getAIGoalCoachMessage);
router.get('/users/:userId/retirement-coach', ctrl.getAIRetirementCoachMessage);
router.get('/users/:userId/recommendations/:recId/explain', ctrl.getAIRecommendationExplanation);

export default router;

