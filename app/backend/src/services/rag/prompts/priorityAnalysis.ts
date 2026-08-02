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

STRUCTURE YOUR RESPONSE CLEANLY:
- Explain **Why This Action Was Triggered** (Root cause analysis).
- Explain **Financial Impact** (Interest drag, risk exposure, WHS score penalty).
- Detail **Recommended Action Steps** (Exact execution plan).
- State **Expected Improvement** (WHS points gain or interest savings).

RULES:
1. Be direct, authoritative, and structured.
2. DO NOT use conversational small talk or raw internal markdown headers like '## Summary'.
`;

  const fullPrompt = `${systemPrompt}

PRIORITY ACTION DETAILS:
${recSummaryStr}

RETRIEVED KNOWLEDGE:
${contextText}

Synthesize a structured Priority Action analysis:`;

  return { systemPrompt, fullPrompt };
}
