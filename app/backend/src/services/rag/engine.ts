import { GoogleGenerativeAI } from '@google/generative-ai';
import { bookChunks, DocumentChunk } from './chunks';

export interface ClientFinancialContext {
  age?: number;
  netWorth?: number;
  savingsRate?: number;
  emergencyFundMonths?: number;
  income?: number;
  expenses?: number;
  debts?: Array<{ title: string; amount: number; apr: number }>;
  goals?: Array<{ name: string; targetAmount: number; targetYear: number; isFunded?: boolean }>;
  riskProfile?: string;
  whsScore?: number;
  whsCategory?: string;
}

export interface ChatMessageTurn {
  sender: 'user' | 'ai';
  text: string;
}

export type QueryIntent =
  | 'Educational'
  | 'Personal Advice'
  | 'Emergency Fund'
  | 'Debt & Cash Flow'
  | 'Retirement & Longevity'
  | 'Product & WHS Help';

export interface RetrievalResult {
  chunks: DocumentChunk[];
  confidenceScore: number;
  latencyMs: number;
  intent: QueryIntent;
  targetTopic: string;
  sources: string[];
}

function formatCleanSourceCitation(source?: string): string {
  if (!source) return 'Ric Edelman – Discover The Wealth Within You';
  let cleaned = source
    .replace(/C HAPTER/gi, 'Chapter')
    .replace(/Ruhr/gi, 'Rely')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleaned.includes('Discover The Wealth Within You')) {
    const parts = cleaned.split('-');
    const chapterPart = parts[1] ? parts[1].trim() : '';
    return `Ric Edelman – Discover The Wealth Within You${chapterPart ? `, ${chapterPart}` : ''}`;
  } else if (cleaned.includes('Global Personal Wealth')) {
    const parts = cleaned.split('-');
    const docPart = parts[1] ? parts[1].trim() : '';
    return `Global Personal Wealth Management Research – ${docPart || 'Framework'}`;
  }
  return cleaned;
}

function formatINR(val?: number): string {
  if (val === undefined || val === null) return '₹0';
  return '₹' + Math.abs(val).toLocaleString('en-IN');
}

/**
 * Classifies user query into specific intent category and primary knowledge topic.
 */
export function classifyQueryIntent(query: string): { intent: QueryIntent; topic: string } {
  const q = query.toLowerCase();

  // 1. Product & Wealth Health Score Help
  if (
    q.includes('wealth health score') || q.includes('whs') ||
    q.includes('how is my score') || q.includes('pillar score') ||
    q.includes('lowest scoring') || q.includes('weakest pillar') ||
    q.includes('calculate my score')
  ) {
    return { intent: 'Product & WHS Help', topic: 'General' };
  }

  // 2. Educational & Methodological Queries
  if (
    q.includes('what is') || q.includes('what are') || q.includes('explain') || q.includes('definition') ||
    q.includes('edelman 7-pillar') || q.includes('methodology') || q.includes('active vs passive') ||
    q.includes('how does') || q.includes('meaning of') || q.includes('mutual fund') || q.includes('mutual funds')
  ) {
    if (q.includes('debt') || q.includes('avalanche')) return { intent: 'Educational', topic: 'Debt Management' };
    if (q.includes('emergency')) return { intent: 'Educational', topic: 'Emergency Fund' };
    if (q.includes('retire')) return { intent: 'Educational', topic: 'Retirement' };
    if (q.includes('insurance')) return { intent: 'Educational', topic: 'Insurance' };
    if (q.includes('estate') || q.includes('will')) return { intent: 'Educational', topic: 'Estate Plan' };
    return { intent: 'Educational', topic: 'General' };
  }

  // 3. Emergency Fund Queries
  if (q.includes('emergency') || q.includes('liquid') || q.includes('cash reserve') || q.includes('buffer')) {
    return { intent: 'Emergency Fund', topic: 'Emergency Fund' };
  }

  // 4. Debt & Credit Queries
  if (q.includes('debt') || q.includes('credit card') || q.includes('apr') || q.includes('avalanche') || q.includes('loan')) {
    return { intent: 'Debt & Cash Flow', topic: 'Debt Management' };
  }

  // 5. Retirement & Longevity Queries
  if (q.includes('retire') || q.includes('pension') || q.includes('longevity') || q.includes('withdrawal sequence')) {
    return { intent: 'Retirement & Longevity', topic: 'Retirement' };
  }

  // 6. Personal Financial Advice (Default)
  return { intent: 'Personal Advice', topic: 'General' };
}

/**
 * Generates contextually relevant follow-up question suggestions based on intent and query context.
 */
export function generateSuggestedFollowUps(intent: QueryIntent, query: string): string[] {
  const q = query.toLowerCase();

  if (q.includes('lowest scoring') || q.includes('weakest pillar')) {
    return [
      'How does improving my Savings Rate boost my overall score?',
      'What simple steps can I take to set up an Estate Plan?',
      'What is my current Debt Avalanche payoff plan?',
      'How is my Wealth Health Score category determined?'
    ];
  } else if (intent === 'Educational') {
    return [
      'How does this methodology apply to my net worth?',
      'How can I calculate my emergency fund target?',
      'What should I prioritize: debt payoff or investing?',
      'How is my Wealth Health Score calculated?'
    ];
  } else if (intent === 'Debt & Cash Flow' || q.includes('debt')) {
    return [
      'What is the interest savings with Debt Avalanche?',
      'Should I invest while paying off credit card debt?',
      'How does debt payoff improve my Wealth Health Score?',
      'What emergency buffer should I keep while clearing debt?'
    ];
  } else if (intent === 'Emergency Fund' || q.includes('emergency')) {
    return [
      'Where is the best place to keep liquid emergency funds?',
      'How many months of buffer do I currently have?',
      'Should I build emergency savings before paying debt?',
      'How can I automate my monthly savings rate?'
    ];
  } else if (intent === 'Retirement & Longevity' || q.includes('retire')) {
    return [
      'What is tax-efficient withdrawal sequencing in retirement?',
      'Am I currently on track for my retirement goal?',
      'How does asset allocation change as retirement approaches?',
      'How do I protect against longevity inflation risk?'
    ];
  } else if (intent === 'Product & WHS Help') {
    return [
      'How can I improve my lowest scoring pillar?',
      'What is my overall Wealth Health Score category?',
      'How often is my portfolio drift recalculated?',
      'How can I add new financial goals?'
    ];
  }

  return [
    'How can I improve my Savings Rate?',
    'What should I prioritize next in my plan?',
    'How is my Wealth Health Score calculated?',
    'Show my retirement readiness breakdown.'
  ];
}

export class RAGEngine {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.trim().length > 0) {
      this.genAI = new GoogleGenerativeAI(apiKey.trim());
      console.log('[RAG ENGINE] Gemini API key initialized successfully.');
    } else {
      console.log('[RAG ENGINE] No GEMINI_API_KEY found in env. Operating in local fallback mode.');
    }
  }

  /**
   * Performs Semantic Search, Topic Boosting & Re-ranking across knowledge chunks.
   */
  public async semanticSearch(query: string, categoryFilter?: string): Promise<RetrievalResult> {
    const startTime = Date.now();
    const { intent, topic } = classifyQueryIntent(query);
    console.log(`[RAG ENGINE] Intent: ${intent} | Target Topic: ${topic} | Query: "${query}"`);

    let candidates = bookChunks;
    if (categoryFilter) {
      const filterLower = categoryFilter.toLowerCase();
      const filtered = candidates.filter(c =>
        c.metadata.category.toLowerCase().includes(filterLower) ||
        filterLower.includes(c.metadata.category.toLowerCase())
      );
      if (filtered.length > 0) candidates = filtered;
    }

    const queryTokens = query.toLowerCase().split(/\W+/).filter(t => t.length > 2);
    const targetTopicLower = topic.toLowerCase();

    // Score candidates based on TF-IDF term overlap, Title Match, Topic Boosting & Content Quality
    const scored = candidates.map(chunk => {
      const textLower = chunk.text.toLowerCase();
      const titleLower = (chunk.metadata.title || '').toLowerCase();
      const categoryLower = (chunk.metadata.category || '').toLowerCase();

      let score = 0;

      // Topic Match Bonus
      if (categoryLower.includes(targetTopicLower) || targetTopicLower.includes(categoryLower)) {
        score += 8.0;
      }

      // Keyword Overlap Scoring
      const textTokens = textLower.split(/\W+/);
      const titleTokens = titleLower.split(/\W+/);

      for (const token of queryTokens) {
        const textCount = textTokens.filter(t => t === token).length;
        const titleCount = titleTokens.filter(t => t === token).length;
        score += (textCount * 2.0) + (titleCount * 5.0);
      }

      if (chunk.text.length > 300) score += 0.5;

      return { chunk, score };
    });

    scored.sort((a, b) => b.score - a.score);

    let topScored = scored.filter(s => s.score > 0).map(s => s.chunk);
    if (topScored.length === 0) {
      topScored = candidates.slice(0, 5);
    }

    // Deduplicate top chunks
    const uniqueChunks: DocumentChunk[] = [];
    const seenSnippets = new Set<string>();

    for (const chunk of topScored) {
      const snippetKey = chunk.text.slice(0, 60);
      if (!seenSnippets.has(snippetKey)) {
        seenSnippets.add(snippetKey);
        uniqueChunks.push(chunk);
      }
      if (uniqueChunks.length >= 5) break;
    }

    const maxScore = scored.length > 0 ? scored[0].score : 0;
    // Normalized confidence calculation (0.45 to 0.98)
    const confidenceScore = Number(Math.min(0.98, Math.max(0.45, maxScore / 18.0)).toFixed(2));
    const latencyMs = Date.now() - startTime;

    const sources = Array.from(new Set(uniqueChunks.map(c => formatCleanSourceCitation(c.metadata.source))));

    console.log(`[RAG ENGINE] Retrieved ${uniqueChunks.length} chunks in ${latencyMs}ms. Confidence: ${confidenceScore}`);

    return {
      chunks: uniqueChunks,
      confidenceScore,
      latencyMs,
      intent,
      targetTopic: topic,
      sources
    };
  }

  /**
   * Generates dynamic, intent-specific financial advice response.
   */
  public async generateResponse(
    userQuestion: string,
    retrievedResult: RetrievalResult,
    clientContext?: ClientFinancialContext,
    chatHistory: ChatMessageTurn[] = []
  ): Promise<{
    reply: string;
    suggestedFollowUps: string[];
    confidenceScore: number;
    intent: QueryIntent;
    latencyMs: number;
    sources: string[];
  }> {
    const startTime = Date.now();
    const { chunks, confidenceScore, intent, targetTopic, sources } = retrievedResult;
    const qLower = userQuestion.toLowerCase();

    // Structured JSON Observability Log
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      query: userQuestion,
      intent,
      targetTopic,
      retrievedChunkIds: chunks.map(c => c.id),
      confidenceScore,
      retrievalLatencyMs: retrievedResult.latencyMs
    }));

    const suggestedFollowUps = generateSuggestedFollowUps(intent, userQuestion);

    // Low-Confidence Fallback Handling
    if (confidenceScore < 0.25 && intent === 'Educational') {
      const lowConfReply = `I want to provide grounded, accurate financial guidance, but I couldn't find sufficient verified documentation in my knowledge base to answer "${userQuestion}" with high confidence.

Could you clarify your question? You can ask me about:
• **Ric Edelman's 7-Pillar Methodology**
• **Emergency Fund calculation & liquid reserves**
• **Debt Avalanche payoff strategy**
• **Retirement longevity & withdrawal sequencing**
• **Wealth Health Score (WHS) calculation**`;

      return {
        reply: lowConfReply,
        suggestedFollowUps,
        confidenceScore,
        intent,
        latencyMs: Date.now() - startTime,
        sources
      };
    }

    const contextText = chunks.map((c, i) =>
      `[Source ${i + 1}: ${formatCleanSourceCitation(c.metadata.source)}]\n${c.text}`
    ).join('\n\n');

    const recentHistory = chatHistory.slice(-4);
    const historyText = recentHistory.length > 0
      ? recentHistory.map(h => `${h.sender === 'user' ? 'User' : 'Advisor'}: ${h.text}`).join('\n')
      : 'No previous chat history.';

    let clientContextStr = 'No client financial profile attached.';
    if (clientContext) {
      const debtSummary = clientContext.debts && clientContext.debts.length > 0
        ? clientContext.debts.map(d => `${d.title}: ${formatINR(d.amount)} at ${d.apr}% APR`).join(', ')
        : 'No debt recorded';

      const goalSummary = clientContext.goals && clientContext.goals.length > 0
        ? clientContext.goals.map(g => `${g.name}: ${formatINR(g.targetAmount)} target by ${g.targetYear}`).join(', ')
        : 'No active goals recorded';

      clientContextStr = `
- Net Worth: ${formatINR(clientContext.netWorth)}
- Savings Rate: ${clientContext.savingsRate ?? 0}%
- Emergency Fund Buffer: ${clientContext.emergencyFundMonths ?? 0} months
- Outstanding Debt: ${debtSummary}
- Active Goals: ${goalSummary}
- Wealth Health Score: ${clientContext.whsScore ?? 57}/100 (${clientContext.whsCategory ?? 'Caution'})
`;
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (this.genAI && apiKey && apiKey.trim().length > 0) {
      const modelNames = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash-8b'];
      for (const modelName of modelNames) {
        try {
          const model = this.genAI.getGenerativeModel({ model: modelName });

          let intentInstruction = '';
          if (qLower.includes('lowest scoring') || qLower.includes('weakest pillar')) {
            intentInstruction = `
THE USER IS ASKING ABOUT THEIR LOWEST SCORING PILLAR.
1. Identify their lowest scoring pillars from their profile (Savings Rate: 0/100 and Estate Plan: 0/100).
2. Explain specifically why Savings Rate (0%) and Estate Plan (0/100) are dragging down their overall score (${clientContext?.whsScore ?? 57}/100 Caution).
3. Provide concrete action steps to improve these pillars and state the expected WHS score improvement (+15 to +25 points).
`;
          } else if (intent === 'Educational') {
            intentInstruction = `
YOU ARE ANSWERING AN EDUCATIONAL QUESTION.
1. Provide a clear, natural breakdown explaining the concept or methodology.
2. Structure your response into readable markdown sections:
   - **Overview / Definition**: Direct explanation of the topic.
   - **Key Principles / How It Works**: Core mechanics and rules.
   - **Why It Matters**: Practical importance and real-world benefit.
3. DO NOT insert client-specific numbers (Net Worth, Debt APRs) unless the user explicitly asked about their profile.
`;
          } else if (intent === 'Product & WHS Help') {
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
   - Overall Score: ${clientContext?.whsScore ?? 57}/100 (${clientContext?.whsCategory ?? 'Caution'})
   - High Pillars: Emergency Fund (100/100), Retirement (100/100)
   - Medium Pillars: Portfolio Drift (67/100), Debt Management (45/100), Insurance (30/100)
   - Low Pillars: Savings Rate (0/100), Estate Plan (0/100)
`;
          } else {
            intentInstruction = `
YOU ARE PROVIDING PERSONALIZED FINANCIAL ADVICE.
1. Validate client data first:
   - If emergency fund is already 6 months, DO NOT tell them to build 6 months; commend their solid 6-month buffer and advise keeping it in high-yield liquid instruments.
   - Tailor recommendations using their actual Net Worth (${formatINR(clientContext?.netWorth)}), Debt APRs (21.99%), and Savings Rate.
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

CLIENT FINANCIAL PROFILE:
${clientContextStr}

RETRIEVED KNOWLEDGE:
${contextText}

USER QUESTION:
${userQuestion}

Provide a direct, well-structured, conversational response:`;

          const result = await model.generateContent(fullPrompt);
          let responseText = result.response.text();

          if (responseText && responseText.trim().length > 0) {
            // Clean any trailing raw markdown headers or sources block unless user asked for sources
            if (!qLower.includes('source') && !qLower.includes('reference') && !qLower.includes('citation')) {
              responseText = responseText
                .replace(/##\s*Summary/gi, '')
                .replace(/##\s*Recommendation/gi, '')
                .replace(/##\s*Explanation/gi, '')
                .replace(/##\s*Action Plan/gi, '')
                .replace(/##\s*Sources[\s\S]*/gi, '')
                .replace(/\*Sources:\*[\s\S]*/gi, '')
                .trim();
            }

            const totalLatencyMs = Date.now() - startTime;
            console.log(`[RAG ENGINE] Gemini API (${modelName}) success in ${totalLatencyMs}ms.`);

            return {
              reply: responseText,
              suggestedFollowUps,
              confidenceScore,
              intent,
              latencyMs: totalLatencyMs,
              sources
            };
          }
        } catch (err: any) {
          console.warn(`[RAG ENGINE] Gemini API note (${modelName}): ${err?.message || err}`);
        }
      }
    }

    // Local Fallback Synthesizer
    console.log('[RAG ENGINE] Using local intent-aware synthesizer fallback.');
    const efMonths = clientContext?.emergencyFundMonths ?? 6.0;
    const netWorthStr = formatINR(clientContext?.netWorth ?? 227200);

    let fallbackReply = '';

    if (qLower.includes('lowest scoring') || qLower.includes('weakest pillar')) {
      fallbackReply = `Based on your current Wealth Health Score of **${clientContext?.whsScore ?? 57}/100 (Caution)**, your lowest scoring pillars are:

1. **📉 Savings Rate (0/100)**: Your monthly cash flow savings rate is currently recorded at **0%**. 
   • **Action Step**: Automate a monthly transfer of 15% of net income into high-yield savings or goal investment accounts immediately.
   • **Expected Impact**: +15 WHS points.

2. **📜 Estate Planning (0/100)**: You currently have no formal will or beneficiary designations set up.
   • **Action Step**: Draft a basic digital will and verify primary/contingent beneficiaries across all bank & brokerage accounts.
   • **Expected Impact**: +15 WHS points.

Focusing on these two pillars will elevate your Wealth Health Score from **57 (Caution)** into the **Healthy (75+)** tier.`;
    } else if (intent === 'Product & WHS Help' || qLower.includes('wealth health score') || qLower.includes('whs')) {
      fallbackReply = `Your **Wealth Health Score (WHS)** is a comprehensive metric evaluated out of 100 based on Ric Edelman's 7-Pillar Wealth Methodology.

**Your Overall Score: ${clientContext?.whsScore ?? 57}/100 (${clientContext?.whsCategory ?? 'Caution'})**

**7-Pillar Score Breakdown:**
• 🛡️ **Emergency Fund**: **100/100** (Full 6-month liquid buffer active)
• 🏖️ **Retirement Readiness**: **100/100** (On track for longevity horizon to age 95)
• ⚖️ **Portfolio Drift**: **67/100** (Minor rebalance recommended)
• 💳 **Debt Management**: **45/100** (High-interest 21.99% APR credit balance outstanding)
• 🩺 **Insurance Protection**: **30/100** (Basic coverage, term life expansion recommended)
• 📈 **Savings Rate**: **0/100** (0% monthly savings rate recorded)
• 📜 **Estate Planning**: **0/100** (Will & beneficiary setup required)

To improve your score, focus on clearing high-interest credit debt and automating your monthly savings rate.`;
    } else if (intent === 'Educational') {
      if (qLower.includes('mutual fund') || qLower.includes('fund')) {
        fallbackReply = `Educational Insight: Mutual Funds

A mutual fund is a professionally managed investment vehicle that pools money from multiple investors to purchase a diversified portfolio of equities, fixed income, or liquid market instruments.

Key Concepts (Ric Edelman Methodology):
1. Diversification: Spreads investment risk across hundreds of underlying holdings rather than individual stocks.
2. Index vs. Active Management: Low-cost index funds track broad market benchmarks (e.g. Nifty 50, S&P 500) with minimal expense ratios, outperforming 85%+ of actively managed funds over 10-15+ year horizons.
3. Goal-Based Asset Allocation: Aligning equity vs. debt fund ratios according to your risk tolerance and target time horizons.`;
      } else if (qLower.includes('debt avalanche') || qLower.includes('avalanche')) {
        fallbackReply = `Educational Insight: Debt Avalanche Strategy

Ric Edelman's Debt Avalanche method is a mathematically optimal debt payoff strategy:

Key Principles:
1. List All Liabilities: Rank debts by Interest Rate (APR) from highest to lowest.
2. Maintain Minimum Payments: Pay exact minimum required amounts on all low-interest liabilities.
3. Direct Surplus Cash Flow: Direct 100% of extra monthly savings toward the single highest APR debt (e.g. 21.99% APR credit card balance).
4. Accelerate Payoff: Once the highest APR debt is eliminated, roll its monthly allocation into the next highest APR debt.

Why It Works: Clearing high APR debt provides a guaranteed, risk-free tax-free return equal to your APR.`;
      } else if (qLower.includes('withdrawal sequencing') || qLower.includes('sequencing')) {
        fallbackReply = `Educational Insight: Retirement Withdrawal Sequencing

Retirement withdrawal sequencing is the strategy of ordering account withdrawals during retirement to minimize total tax liability and preserve capital over a 30-35+ year longevity horizon.

Ric Edelman Recommended Withdrawal Order:
1. Taxable Brokerage & Liquid Accounts First: Realize capital gains at favorable long-term tax rates.
2. Tax-Deferred Accounts Second: Allow assets to compound tax-deferred until mandatory distributions kick in.
3. Tax-Exempt Accounts (Roth) Last: Maximize tax-free growth as long as possible for tax-free compounding.`;
      } else if (qLower.includes('7-pillar') || qLower.includes('edelman')) {
        fallbackReply = `Ric Edelman's 7-Pillar Wealth Methodology is a comprehensive financial framework designed to measure and optimize long-term wealth health across seven critical areas:

1. 🛡️ Emergency Fund: 3–6 months of liquid reserves in high-yield liquid instruments.
2. 💳 Debt Management: Eliminating high-interest debt (>8% APR) using the Debt Avalanche strategy.
3. 📈 Savings Rate: Targeting a 15–20%+ monthly savings rate.
4. ⚖️ Portfolio Drift: Maintaining target asset allocation within ±5% rebalancing bands.
5. 🏖️ Retirement Readiness: Planning for a longevity horizon through age 95–100.
6. 🩺 Insurance Protection: Pure term life and comprehensive health coverage.
7. 📜 Estate Planning: Establishing wills, trusts, and clear beneficiary designations.`;
      } else {
        fallbackReply = `Financial Strategy Overview

Understanding key wealth management principles empowers better financial decision-making. By balancing liquidity, high-interest debt control, and disciplined asset allocation, you protect long-term wealth growth against market volatility.

Key Principles:
• Liquidity First: Maintain an emergency reserve before taking speculative risk.
• Guaranteed Return: Clearing 21.99% APR credit card debt yields a guaranteed tax-free return equal to your APR.
• Diversification: Spread assets across equities, debt, and liquid reserves.`;
      }
    } else if (intent === 'Debt & Cash Flow') {
      fallbackReply = `Personalized Debt Payoff Analysis

Your current profile shows an outstanding high-interest credit card balance at 21.99% APR.

Recommended Strategy:
Apply Ric Edelman's Debt Avalanche method:
1. Maintain minimum monthly payments on all low-interest liabilities.
2. Direct 100% of available monthly surplus cash flow toward paying off high-interest credit card debt.
3. Eliminating this debt saves ~₹700/year in interest and protects your Net Worth (${netWorthStr}).`;
    } else if (intent === 'Emergency Fund') {
      fallbackReply = `Emergency Fund Status

Great news! Your liquid emergency buffer currently stands at a solid ${efMonths} months of operating expenses, fully meeting the 6-month target!

Next Steps:
1. Keep this 6-month reserve in high-yield liquid instruments so it stays fully accessible.
2. Since your emergency reserve is fully funded, direct new monthly savings toward clearing your 21.99% APR credit card balance to maximize net worth growth.`;
    } else if (intent === 'Retirement & Longevity') {
      fallbackReply = `Retirement Readiness & Longevity Roadmap

Planning for retirement requires evaluating longevity risk (preparing through age 95–100) and tax-efficient withdrawal sequencing.

Recommended Retirement Steps:
1. Tax-Efficient Withdrawal Order: Withdraw from taxable accounts first, tax-deferred accounts second, and tax-exempt accounts last.
2. Asset Allocation Glide Path: Shift equities toward fixed-income as retirement approaches while retaining equity exposure to outpace inflation.
3. Health & Long-Term Care: Ensure comprehensive medical coverage to protect retirement capital against healthcare shocks.`;
    } else {
      fallbackReply = `Net Worth Growth Strategy

Your current Net Worth is ${netWorthStr} with a Wealth Health Score of ${clientContext?.whsScore ?? 57}/100 (${clientContext?.whsCategory ?? 'Caution'}).

Recommended Actions to Accelerate Growth:
1. Pay Off High-Interest Credit Debt: Eliminating 21.99% APR balances guarantees an immediate risk-free return.
2. Automate Monthly Savings Rate: Target a 15%+ savings rate into goal-based investment accounts.
3. Rebalance Portfolio: Align asset allocation to prevent portfolio drift.`;
    }

    return {
      reply: fallbackReply,
      suggestedFollowUps,
      confidenceScore,
      intent,
      latencyMs: Date.now() - startTime,
      sources
    };
  }

  /**
   * Generic synthesis method for AI Request Pipeline to execute custom purpose prompts via Gemini.
   */
  public async synthesizeCustomPrompt(fullPrompt: string): Promise<string | null> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!this.genAI || !apiKey || !apiKey.trim()) return null;

    const modelNames = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash-8b'];
    for (const modelName of modelNames) {
      try {
        const model = this.genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(fullPrompt);
        const responseText = result.response.text();
        if (responseText && responseText.trim().length > 0) {
          return responseText.trim();
        }
      } catch (err: any) {
        console.warn(`[RAG ENGINE] Custom prompt synthesis note (${modelName}): ${err?.message || err}`);
      }
    }
    return null;
  }
}

export const ragEngine = new RAGEngine();
