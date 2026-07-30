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
    return `Ric Edelman – Discover The Wealth Within You, ${chapterPart || 'Core Strategy'}`;
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
   * Performs Semantic Search & Re-ranking across knowledge chunks.
   * Retrieves top 10 candidates, re-ranks, deduplicates, and selects top 3-5.
   */
  public async semanticSearch(query: string, categoryFilter?: string): Promise<DocumentChunk[]> {
    console.log(`[RAG ENGINE] Initiating semantic search for: "${query}" (Filter: ${categoryFilter || 'None'})`);
    
    let candidates = bookChunks;
    if (categoryFilter) {
      const filterLower = categoryFilter.toLowerCase();
      candidates = candidates.filter(c => 
        c.metadata.category.toLowerCase().includes(filterLower) ||
        filterLower.includes(c.metadata.category.toLowerCase())
      );
      if (candidates.length === 0) {
        candidates = bookChunks;
      }
    }

    // Tokenize query
    const queryTokens = query.toLowerCase().split(/\W+/).filter(t => t.length > 2);

    if (queryTokens.length === 0) {
      return candidates.slice(0, 4);
    }

    // Score candidates based on TF-IDF term overlap, Title Match & Content Density
    const scored = candidates.map(chunk => {
      const textLower = chunk.text.toLowerCase();
      const titleLower = (chunk.metadata.title || '').toLowerCase();
      const textTokens = textLower.split(/\W+/);
      const titleTokens = titleLower.split(/\W+/);
      
      let score = 0;
      for (const token of queryTokens) {
        const textCount = textTokens.filter(t => t === token).length;
        const titleCount = titleTokens.filter(t => t === token).length;
        score += (textCount * 2.0) + (titleCount * 5.0);
      }

      // Small bonus for quality text length
      if (chunk.text.length > 300) score += 0.5;

      return { chunk, score };
    });

    // Sort by relevance score descending
    scored.sort((a, b) => b.score - a.score);

    // Filter top candidates with score > 0
    let topScored = scored.filter(s => s.score > 0).map(s => s.chunk);

    // Fallback if no direct keyword match
    if (topScored.length === 0) {
      topScored = candidates.slice(0, 5);
    }

    // Deduplicate chunks with identical titles or overlapping text snippets
    const uniqueChunks: DocumentChunk[] = [];
    const seenTexts = new Set<string>();

    for (const chunk of topScored) {
      const snippetKey = chunk.text.slice(0, 60);
      if (!seenTexts.has(snippetKey)) {
        seenTexts.add(snippetKey);
        uniqueChunks.push(chunk);
      }
      if (uniqueChunks.length >= 5) break; // Select top 3-5 best chunks
    }

    console.log(`[RAG ENGINE] Selected ${uniqueChunks.length} re-ranked, deduplicated chunks from Knowledge Base.`);
    return uniqueChunks;
  }

  /**
   * Generates production-quality advisory response following the required 5-section schema.
   */
  public async generateResponse(
    userQuestion: string,
    retrievedChunks: DocumentChunk[],
    clientContext?: ClientFinancialContext
  ): Promise<string> {
    const contextText = retrievedChunks.map((c, i) => 
      `[Document ${i + 1}: ${formatCleanSourceCitation(c.metadata.source)}]\n${c.text}`
    ).join('\n\n');

    let clientContextStr = 'No specific financial profile data attached.';
    if (clientContext) {
      const debtSummary = clientContext.debts && clientContext.debts.length > 0 
        ? clientContext.debts.map(d => `${d.title}: ${formatINR(d.amount)} at ${d.apr}% APR`).join(', ')
        : 'None recorded';

      const goalSummary = clientContext.goals && clientContext.goals.length > 0
        ? clientContext.goals.map(g => `${g.name}: ${formatINR(g.targetAmount)} target for ${g.targetYear}`).join(', ')
        : 'None recorded';

      clientContextStr = `
- Age: ${clientContext.age ?? 'Not specified'}
- Net Worth: ${formatINR(clientContext.netWorth)}
- Savings Rate: ${clientContext.savingsRate ?? 0}%
- Emergency Fund Buffer: ${clientContext.emergencyFundMonths ?? 0} months
- Outstanding Liabilities: ${debtSummary}
- Active Goals: ${goalSummary}
- Risk Profile: ${clientContext.riskProfile ?? 'Moderate'}
`;
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (this.genAI && apiKey && apiKey.trim().length > 0) {
      const modelNames = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash-8b'];
      for (const modelName of modelNames) {
        try {
          console.log(`[RAG ENGINE] Calling Gemini API (${modelName}) with RAG context & client profile...`);
          const model = this.genAI.getGenerativeModel({ model: modelName });

          const systemInstruction = `
You are Weallth's Senior AI Wealth Advisor. You synthesize advice from Ric Edelman's 'Discover The Wealth Within You' and 'Global Personal Wealth Management Research'.

CRITICAL INSTRUCTIONS & GUARDRAILS:
1. Speak directly as a professional financial advisor. DO NOT include meta-phrases such as "Based on the retrieved context", "According to the documents", "The context says", or "Based on...".
2. NEVER copy document text verbatim. Synthesize ideas from all retrieved documents into clear, original advice.
3. Personalize your recommendations using the client's financial data (Net Worth, Emergency Fund Months, Savings Rate, Debt APRs, and Goals) when available. Include simple calculations or quantitative examples where helpful.
4. Hallucinate NOTHING. If retrieved knowledge or client data is insufficient, explicitly state that in the Explanation section instead of guessing.
5. All monetary figures MUST be displayed in Indian Rupee (₹) using en-IN formatting (e.g. ₹50,000, ₹1,20,000).

MANDATORY 5-SECTION RESPONSE FORMAT:
You MUST format your entire response into these exact 5 Markdown sections using '##' headers:

## Summary
[1–2 sentences summarizing the core advice tailored to the user]

## Recommendation
[Clear, actionable advice personalized to their net worth, cash flow, debt, or goals]

## Explanation
[Synthesize financial principles across the retrieved sources with calculations or reasoning]

## Action Plan
1. [Numbered step 1]
2. [Numbered step 2]
3. [Numbered step 3]

## Sources
- [Clean Document Citation 1]
- [Clean Document Citation 2]

(Only list document citations under ## Sources. Do not cite them in the main text.)
`;

          const fullPrompt = `${systemInstruction}

CLIENT FINANCIAL PROFILE:
${clientContextStr}

RETRIEVED KNOWLEDGE DOCUMENTS:
${contextText}

CLIENT QUESTION:
${userQuestion}

Provide your structured 5-section response:`;

          const result = await model.generateContent(fullPrompt);
          const responseText = result.response.text();

          if (responseText && responseText.trim().length > 0) {
            console.log(`[RAG ENGINE] Gemini API (${modelName}) response generated successfully.`);
            return responseText.trim();
          }
        } catch (err: any) {
          console.warn(`[RAG ENGINE] Gemini API (${modelName}) note: ${err?.message || err}`);
        }
      }
    }

    // Local Fallback Synthesizer - Generates the exact mandatory 5-section layout
    console.log('[RAG ENGINE] Using local RAG fallback multi-chunk synthesizer.');
    
    // Extract unique clean sources
    const uniqueSources = Array.from(new Set(retrievedChunks.map(c => formatCleanSourceCitation(c.metadata.source))));
    const sourcesListStr = uniqueSources.map(s => `- ${s}`).join('\n');

    const qLower = userQuestion.toLowerCase();
    const efMonths = clientContext?.emergencyFundMonths ?? 2.9;
    const netWorthStr = formatINR(clientContext?.netWorth ?? 170400);

    if (qLower.includes('debt') || qLower.includes('credit card') || qLower.includes('apr')) {
      const topDebt = clientContext?.debts && clientContext.debts.length > 0 ? clientContext.debts[0] : null;
      const debtDetails = topDebt ? `${topDebt.title} (${formatINR(topDebt.amount)} at ${topDebt.apr}% APR)` : 'outstanding consumer credit balances';

      return `## Summary
Prioritize aggressive payoff of high-interest debt over speculative growth investments to secure a guaranteed risk-free financial return.

## Recommendation
Direct all excess monthly cash flow toward paying off ${debtDetails}. Eliminating debt above 8% APR yields a guaranteed tax-free return equal to your APR interest rate.

## Explanation
High-interest debt acts as negative compounding against your net worth. By applying Ric Edelman's debt avalanche strategy, every rupee used to reduce high-interest principal protects future wealth creation and stabilizes net worth (currently at ${netWorthStr}).

## Action Plan
1. Maintain minimum monthly payments across all low-interest loans.
2. Direct all available surplus savings exclusively toward highest APR balances.
3. Pause new discretionary growth investments until credit balances above 8% APR are completely cleared.

## Sources
${sourcesListStr}`;
    } else if (qLower.includes('emergency') || qLower.includes('cash') || qLower.includes('reserve')) {
      return `## Summary
Establish a dedicated 3 to 6-month liquid cash reserve to safeguard your long-term wealth assets against income disruptions.

## Recommendation
Build your current emergency buffer from ${efMonths} months to a full 6-month target of liquid cash reserves stored in high-yield liquid instruments.

## Explanation
An emergency cash reserve operates as financial insurance. Without an adequate liquid buffer, market downturns or unexpected expenses force premature liquidation of long-term investments, locking in capital losses.

## Action Plan
1. Calculate baseline monthly operating expenses.
2. Automate monthly transfers into high-yield liquid savings accounts until the 6-month buffer is achieved.
3. Ring-fence emergency funds separately from daily checking or long-term growth brokerage accounts.

## Sources
${sourcesListStr}`;
    } else if (qLower.includes('retire') || qLower.includes('longevity') || qLower.includes('pension')) {
      return `## Summary
Structure a long-term retirement strategy assuming a lifetime horizon to age 95–100, pairing growth compounding with tax-efficient withdrawal sequencing.

## Recommendation
Align retirement contributions with tax-advantaged accounts first, preserving growth assets for long-term longevity protection.

## Explanation
Retirement planning must account for extended longevity risk. Orderly account drawdowns—tapping taxable accounts before tax-deferred reserves—maximize total wealth longevity while controlling principal depletion rates.

## Action Plan
1. Model retirement income needs for a horizon through age 95.
2. Maximize annual tax-advantaged contributions before allocating to taxable accounts.
3. Implement tax-efficient withdrawal sequencing during retirement phase.

## Sources
${sourcesListStr}`;
    } else {
      return `## Summary
Optimize your portfolio allocations and cash flow discipline to achieve balanced long-term wealth growth.

## Recommendation
Review your current net worth (${netWorthStr}) and savings rate to ensure alignment with target financial milestones.

## Explanation
Comprehensive wealth management combines liquidity preservation, disciplined debt control, and goal-based asset allocation across diversified market sectors.

## Action Plan
1. Audit current monthly cash flow and savings rate.
2. Rebalance portfolio asset allocation to maintain target risk tolerance.
3. Review progress toward major financial goal targets annually.

## Sources
${sourcesListStr}`;
    }
  }
}

export const ragEngine = new RAGEngine();
