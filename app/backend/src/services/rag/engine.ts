import { GoogleGenerativeAI } from '@google/generative-ai';
import { bookChunks, DocumentChunk } from './chunks';

function formatSourceCitation(source?: string): string {
  if (!source) return 'Ric Edelman Wealth Principles';
  let cleaned = source
    .replace(/C HAPTER/gi, 'Chapter')
    .replace(/Ruhr/gi, 'Rely')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleaned.includes('Discover The Wealth Within You')) {
    const parts = cleaned.split('-');
    const chapterPart = parts[1] ? parts[1].trim() : '';
    return `📖 Ric Edelman: Discover The Wealth Within You (${chapterPart || 'Core Strategy'})`;
  } else if (cleaned.includes('Global Personal Wealth')) {
    const parts = cleaned.split('-');
    const docPart = parts[1] ? parts[1].trim() : '';
    return `📊 Global Wealth Research (${docPart || 'Framework'})`;
  }
  return `📖 ${cleaned}`;
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
   * Performs Semantic Search across all quality knowledge chunks.
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
      return candidates.slice(0, 3);
    }

    // Score candidates based on Term Frequency & Title Matching
    const scored = candidates.map(chunk => {
      const textTokens = chunk.text.toLowerCase().split(/\W+/);
      const titleTokens = (chunk.metadata.title || '').toLowerCase().split(/\W+/);
      let score = 0;

      for (const token of queryTokens) {
        const textCount = textTokens.filter(t => t === token).length;
        const titleCount = titleTokens.filter(t => t === token).length;
        score += (textCount * 1.5) + (titleCount * 4.0);
      }
      return { chunk, score };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    // Return top 3 matching chunks
    const results = scored.filter(s => s.score > 0).map(s => s.chunk).slice(0, 3);
    
    // Fallback: If no keyword match, return candidate defaults
    if (results.length === 0 && candidates.length > 0) {
      results.push(candidates[0]);
      if (candidates.length > 1) results.push(candidates[1]);
    }

    console.log(`[RAG ENGINE] Retrieved ${results.length} chunks from Knowledge Base (${bookChunks.length} total chunks indexed).`);
    return results;
  }

  /**
   * Generates AI Coach response using Google Gemini API (gemini-2.0-flash) with local fallback.
   */
  public async generateResponse(promptContext: string, retrievedChunks: DocumentChunk[]): Promise<string> {
    const contextText = retrievedChunks.map((c, i) => 
      `[Source ${i + 1}: ${c.metadata.source} (${c.metadata.category})]\n"${c.text}"`
    ).join('\n\n');

    const apiKey = process.env.GEMINI_API_KEY;

    if (this.genAI && apiKey && apiKey.trim().length > 0) {
      const modelNames = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash-8b'];
      for (const modelName of modelNames) {
        try {
          console.log(`[RAG ENGINE] Calling Gemini API (${modelName}) with RAG context...`);
          const model = this.genAI.getGenerativeModel({ model: modelName });

          const systemInstruction = `
You are Weallth's Advisory Wealth Coach. You guide clients using principles from Ric Edelman's 'Discover The Wealth Within You' and 'Global Personal Wealth Management Research'.

CRITICAL GUARDRAILS & FORMATTING INSTRUCTIONS:
1. You are strictly ADVISORY-ONLY. Never recommend specific stock tickers or place trade executions.
2. All monetary figures MUST be displayed in Indian Rupee (₹) using en-IN formatting (e.g. ₹50,000, ₹1,20,000).
3. If addressing a goal shortfall, recommend ONLY: Option A (Increase Monthly Savings), Option B (Reduce Goal Cost), Option C (Extend Target Timeline). NEVER suggest raising return assumptions or ignoring taxes/inflation.
4. Format your response cleanly using bullet points, bold section headers, and clean source citations (e.g., 📖 Ric Edelman Chapter 13 or 📊 Global Wealth Research).
5. Ground your advice directly in the provided RAG Context Chunks. Keep your tone empathetic, clear, professional, and actionable (100–180 words).
`;

          const fullPrompt = `${systemInstruction}

RAG KNOWLEDGE CONTEXT CHUNKS:
${contextText}

CLIENT CONTEXT & REQUEST:
${promptContext}

Provide a beautifully formatted, advisory coaching response:`;

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

    // Local Fallback Synthesis with Clean Formatting
    console.log('[RAG ENGINE] Using local RAG fallback response template.');
    const topChunk = retrievedChunks[0];
    const citation = formatSourceCitation(topChunk?.metadata?.source);
    const textSnippet = (topChunk?.text || '').trim();

    if (promptContext.includes("Goal Name") || promptContext.includes("shortfall")) {
      return `🎯 **Edelman 3-Lever Shortfall Analysis**
*Source: ${citation}*

When facing a goal funding gap, increasing market risk is counterproductive. You have three mathematical levers under your control:

• **Option A (Increase Savings):** Boost monthly contribution to bridge the gap safely.
• **Option B (Reduce Target Cost):** Adjust present-value goal cost target.
• **Option C (Extend Target Timeline):** Extend target horizon to give compounding more time.

*Which option would you like to apply to your financial plan?*`;
    } else if (promptContext.includes("Retirement") || promptContext.includes("longevity")) {
      return `🌅 **Retirement & Longevity Strategy**
*Source: ${citation}*

Key Guidance:
• **Longevity Planning:** Plan for a retirement horizon up to age 95 or 100 due to medical advancements.
• **Tax-Efficient Withdrawal Order:** Tap taxable brokerage accounts first, preserving tax-deferred IRAs/401(k)s and Roth accounts for long-term growth.
• **Controlled Principal Utilization:** Planned spending of principal in retirement is normal and mathematically sound.

*Would you like to review your retirement readiness score or tax-efficient withdrawal sequence?*`;
    } else if (promptContext.toLowerCase().includes("debt") || promptContext.toLowerCase().includes("credit card")) {
      return `💳 **Ric Edelman Debt Elimination Strategy**
*Source: ${citation}*

Core Advice:
• **Pay Off High-Interest Debt First:** Consumer debt (>8% APR) is the single most destructive obstacle to wealth creation. Paying it off gives a guaranteed, tax-free return equal to the interest rate.
• **Debt Avalanche Approach:** Direct extra monthly savings aggressively toward highest-rate credit balances while maintaining minimums on others.
• **Prioritize Before Investing:** Eliminate high-interest balances before expanding growth investment allocations.

*Would you like assistance calculating your debt payoff timeline?*`;
    } else if (promptContext.toLowerCase().includes("emergency") || promptContext.toLowerCase().includes("cash")) {
      return `🛡️ **Cash Reserve & Emergency Fund Guidelines**
*Source: ${citation}*

Core Advice:
• **3 to 6 Months Liquidity Buffer:** Maintain 3 to 6 months of baseline living expenses in liquid, high-yield cash accounts.
• **Wealth Protection Shield:** Your cash reserve prevents forced liquidation of growth assets during market downturns or income disruptions.
• **Keep Separate from Operating Funds:** Hold emergency reserves in a dedicated liquid account to prevent accidental spending.

*Would you like me to calculate your recommended target emergency cash buffer?*`;
    } else {
      const summarySnippet = textSnippet.length > 220 ? textSnippet.slice(0, 220) + '...' : textSnippet;
      return `💡 **Wealth Planning Insight**
*Source: ${citation}*

${summarySnippet}

*How would you like to apply this principle to your financial goals or portfolio setup?*`;
    }
  }
}

export const ragEngine = new RAGEngine();
