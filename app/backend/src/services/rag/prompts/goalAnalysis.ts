import { UnifiedAIContext } from '../types';

export function buildGoalAnalysisPrompt(context: UnifiedAIContext, contextText: string): { systemPrompt: string; fullPrompt: string } {
  const goal = context.selectedGoal;
  const options = goal?.options;

  const goalSummaryStr = goal ? `
- Goal Name: ${goal.name}
- Category: ${goal.category}
- Priority: ${goal.priority}
- Target Amount: ₹${goal.targetAmount.toLocaleString('en-IN')} by ${goal.targetYear}
- Already Saved: ₹${goal.alreadySaved.toLocaleString('en-IN')} (${goal.fundedPercentage}% funded)
- Monthly Contribution: ₹${goal.monthlyContribution.toLocaleString('en-IN')}
- Projected Shortfall: ₹${goal.shortfall.toLocaleString('en-IN')}
- Option A (Boost Monthly Savings): Add ₹${(options?.optionA_monthlySavings || 0).toLocaleString('en-IN')}/mo
- Option B (Reduce Present Target Cost): Supported present cost is ₹${(options?.optionB_presentCost || 0).toLocaleString('en-IN')}
- Option C (Delay Goal Horizon): Delay goal by ${options?.optionC_delayMonths || 0} months
` : 'No specific goal selected.';

  const systemPrompt = `
You are Weallth's Goal Strategy Specialist.
Your task is to produce a focused, structured mathematical analysis of a specific financial goal and present Ric Edelman's Solver Options.

STRUCTURE YOUR OUTPUT CLEANLY INTO EXACTLY THESE 8 BOLD HEADERS:
**Executive Summary**
**Personalized Analysis** (Goal Progress & Shortfall Summary)
**Why It Matters**
**Action Plan** (Ric Edelman 3-Option Solver Strategies)
**Financial Impact** (Perform exact calculations on shortfall and options)
**Risks & Trade-offs**
**Next Best Actions** (Recommended Action Step)
**Confidence**

RULES:
1. Speak directly, professionally, and concisely.
2. DO NOT use raw internal markdown headers like '## Summary'. Use the exact bold headers above.
3. Keep focus strictly on the selected financial goal metrics and solver trade-offs.
`;

  const fullPrompt = `${systemPrompt}

TARGET GOAL ANALYSIS METRICS:
${goalSummaryStr}

RETRIEVED KNOWLEDGE:
${contextText}

Synthesize a structured Goal AI Strategy analysis:`;

  return { systemPrompt, fullPrompt };
}

export function generateGoalAnalysisFallback(context: UnifiedAIContext): string {
  const goal = context.selectedGoal;
  if (!goal) {
    return 'Goal Strategy Analysis: Select a financial goal to view personalized Edelman Solver options and shortfall analysis.';
  }

  const options = goal.options;
  const targetFormatted = `₹${goal.targetAmount.toLocaleString('en-IN')}`;
  const savedFormatted = `₹${goal.alreadySaved.toLocaleString('en-IN')}`;
  const shortfallFormatted = `₹${goal.shortfall.toLocaleString('en-IN')}`;
  const monthlyFormatted = `₹${goal.monthlyContribution.toLocaleString('en-IN')}`;

  const optAFormatted = options?.optionA_monthlySavings ? `₹${options.optionA_monthlySavings.toLocaleString('en-IN')}` : 'N/A';
  const optBFormatted = options?.optionB_presentCost ? `₹${options.optionB_presentCost.toLocaleString('en-IN')}` : 'N/A';
  const optCDelay = options?.optionC_delayMonths ?? 0;

  return `Goal Strategy: ${goal.name}

Goal Progress & Shortfall Summary:
Your ${goal.name} target is ${targetFormatted} by ${goal.targetYear}. You have saved ${savedFormatted} (${goal.fundedPercentage}% funded) with a monthly contribution of ${monthlyFormatted}/month. The projected funding shortfall is ${shortfallFormatted}.

Ric Edelman 3-Option Solver Strategies:
1. Increase Monthly Savings (Option A): Boost monthly contribution by +${optAFormatted}/month to close the ${shortfallFormatted} shortfall on schedule.
2. Adjust Present Target (Option B): Reduce target present cost to ${optBFormatted} to align with your current savings trajectory.
3. Extend Target Horizon (Option C): Delay goal completion by ${optCDelay} months to allow compound growth to cover the shortfall.

Recommended Action Step:
Prioritize Option A by automating an additional ${optAFormatted}/month allocation to ensure 100% funding by ${goal.targetYear}.`;
}
