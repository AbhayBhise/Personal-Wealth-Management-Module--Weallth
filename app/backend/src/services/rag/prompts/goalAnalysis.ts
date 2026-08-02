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

STRUCTURE YOUR OUTPUT CLEANLY:
- **Net Worth & Goal Position Summary**: Diagnostic of current progress and shortfall.
- **Edelman Solver Option A (Increase Monthly Savings)**: Explanation of required savings boost.
- **Edelman Solver Option B (Adjust Present Target)**: Explanation of present target adjustment.
- **Edelman Solver Option C (Extend Horizon)**: Explanation of timeline extension.
- **Recommended Action Step**: Specific priority recommendation.

RULES:
1. Speak directly, professionally, and concisely.
2. DO NOT engage in general small talk or cite raw document filenames.
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
