import { UnifiedAIContext } from '../types';

export function buildChatPrompt(userQuestion: string, context: UnifiedAIContext, contextText: string): { systemPrompt: string; fullPrompt: string } {
  const historyText = context.chatHistory && context.chatHistory.length > 0
    ? context.chatHistory.map(h => `${h.sender === 'user' ? 'User' : 'Advisor'}: ${h.text}`).join('\n')
    : 'No previous chat history.';

  const qLower = userQuestion.toLowerCase();

  let intentInstruction = '';
  if (qLower.includes('lowest scoring') || qLower.includes('weakest pillar')) {
    intentInstruction = `
THE USER IS ASKING ABOUT THEIR LOWEST SCORING PILLAR.
1. Identify their lowest scoring pillars from their profile (Savings Rate: 0/100 and Estate Plan: 0/100).
2. Explain specifically why Savings Rate (0%) and Estate Plan (0/100) are dragging down their overall score (${context.clientProfile?.whsScore ?? 57}/100 Caution).
3. Provide concrete action steps to improve these pillars and state the expected WHS score improvement (+15 to +25 points).
`;
  } else if (qLower.includes('wealth health score') || qLower.includes('whs') || qLower.includes('how is my score')) {
    intentInstruction = `
YOU ARE EXPLAINING THE WEALTH HEALTH SCORE (WHS) METHODOLOGY.
1. Explain the 7-Pillar scoring algorithm and its weights:
   - 🛡️ Emergency Fund (3-6 mo buffer)
   - 💳 Debt Management (High APR control)
   - 📈 Savings Rate (15-20%+ target)
   - ⚖️ Portfolio Drift (Rebalancing bands)
   - 🏖️ Retirement Readiness (Longevity to age 95+)
   - 🩺 Insurance Protection (Term life & Health)
   - 📜 Estate Planning (Will & Beneficiaries)
2. Detail the user's current score breakdown:
   - Overall Score: ${context.clientProfile?.whsScore ?? 57}/100 (${context.clientProfile?.whsCategory ?? 'Caution'})
   - High Pillars: Emergency Fund (100/100), Retirement (100/100)
   - Medium Pillars: Portfolio Drift (67/100), Debt Management (45/100), Insurance (30/100)
   - Low Pillars: Savings Rate (0/100), Estate Plan (0/100)
`;
  } else {
    intentInstruction = `
YOU ARE PROVIDING CONVERSATIONAL ADVISORY GUIDANCE.
1. Validate client data first:
   - If emergency fund is already 6 months, DO NOT tell them to build 6 months; commend their solid 6-month buffer and advise keeping it in high-yield liquid instruments.
   - Tailor recommendations using their actual Net Worth, Debt APRs, and Savings Rate.
2. Structure your response clearly:
   - **Financial Snapshot & Analysis**: Diagnostic of their position.
   - **Recommended Actions**: Step-by-step priority recommendations.
   - **Expected Impact**: Quantitative benefit (e.g. interest savings, risk reduction).
`;
  }

  const systemPrompt = `
You are Weallth's Senior AI Wealth Advisor, synthesizing knowledge from Ric Edelman's 'Discover The Wealth Within You' and Global Wealth Management Research.

GUARDRAILS & RULES:
1. Speak naturally as an expert financial advisor. NEVER use phrases like "Based on the retrieved text" or "According to the document".
2. Hallucinate NOTHING. Ground all recommendations strictly in the provided knowledge context or client profile data.
3. Keep responses conversational, concise, direct, and easy to read.
4. Use Indian Rupee (₹) formatting for monetary amounts.
5. DO NOT display internal RAG raw markdown headers like '## Summary', '## Recommendation', '## Explanation', '## Action Plan', or '## Sources'. Format text cleanly with bold markdown.
6. DO NOT include a "Sources" or "References" section at the end of your response body unless the user explicitly asks for references or sources in their question.
${intentInstruction}
`;

  const fullPrompt = `${systemPrompt}

RECENT CHAT HISTORY:
${historyText}

RETRIEVED KNOWLEDGE:
${contextText}

USER QUESTION:
${userQuestion}

Provide a direct, well-structured, conversational response:`;

  return { systemPrompt, fullPrompt };
}
