import { UnifiedAIContext } from '../types';

export function buildPriorityAnalysisPrompt(context: UnifiedAIContext, contextText: string): { systemPrompt: string; fullPrompt: string } {
  const rec = context.selectedRecommendation;

  const recSummaryStr = rec ? `
- Category: ${rec.category}
- Priority: ${rec.priority}
- Rule Violation / Alert: ${rec.alertMessage}
- System Reason: ${rec.reason}
- Expected Benefit: ${rec.expectedBenefit}
- Suggested Action: ${rec.action}
` : 'No recommendation selected.';

  const systemPrompt = `
You are Weallth's Priority Action & Risk Diagnostic Specialist.
Your task is to explain why a specific recommendation rule violation was triggered and provide an actionable mitigation strategy.

STRUCTURE YOUR RESPONSE CLEANLY INTO EXACTLY THESE 8 BOLD HEADERS:
**Executive Summary**
**Personalized Analysis** (Explain Why This Action Was Triggered)
**Why It Matters**
**Action Plan** (Detail Recommended Action Steps)
**Financial Impact** (Perform exact calculations: Interest drag, WHS score penalty, Savings)
**Risks & Trade-offs**
**Next Best Actions**
**Confidence**

RULES:
1. Be direct, authoritative, and structured.
2. DO NOT use conversational small talk or raw internal markdown headers like '## Summary'. Use the exact bold headers above.
`;

  const fullPrompt = `${systemPrompt}

PRIORITY ACTION DETAILS:
${recSummaryStr}

RETRIEVED KNOWLEDGE:
${contextText}

Synthesize a structured Priority Action analysis:`;

  return { systemPrompt, fullPrompt };
}

export function generatePriorityAnalysisFallback(context: UnifiedAIContext): string {
  const rec = context.selectedRecommendation;
  const netWorthStr = context.clientProfile?.netWorth ? `₹${context.clientProfile.netWorth.toLocaleString('en-IN')}` : '₹1,64,500';

  if (!rec) {
    return `Personalized Priority Analysis

Your current profile shows an outstanding high-interest credit card balance at 21.99% APR. Applying Ric Edelman's Debt Avalanche method by directing monthly surplus cash flow toward paying off this balance eliminates interest drag and protects your Net Worth (${netWorthStr}).`;
  }

  return `Personalized Priority Analysis: ${rec.category}

Why It Matters:
${rec.reason || 'High-interest liabilities create guaranteed negative returns that drag down your Debt Management WHS pillar.'}

Recommended Strategy:
Apply Ric Edelman's Debt Avalanche method:
1. Maintain minimum monthly payments on all low-interest liabilities.
2. Direct 100% of available monthly surplus cash flow toward paying off high-interest credit card debt.
3. ${rec.expectedBenefit || `Eliminating this debt saves interest and protects your Net Worth (${netWorthStr}).`}`;
}
