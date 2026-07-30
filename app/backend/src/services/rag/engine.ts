import { GoogleGenerativeAI } from '@google/generative-ai';
import { bookChunks, DocumentChunk } from './chunks';

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
      // Return general wealth principles if query has no tokens > 2 chars
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
      const modelNames = ['gemini-2.0-flash', 'gemini-1.5-flash'];
      for (const modelName of modelNames) {
        try {
          console.log(`[RAG ENGINE] Calling Gemini API (${modelName}) with RAG context...`);
          const model = this.genAI.getGenerativeModel({ model: modelName });

          const systemInstruction = `
You are Weallth's Advisory Wealth Coach. You guide clients using principles from Ric Edelman's 'Discover The Wealth Within You' and 'Global Personal Wealth Management Research'.

CRITICAL GUARDRAILS & INSTRUCTIONS:
1. You are strictly ADVISORY-ONLY. Never recommend specific stock tickers or place trade executions.
2. All monetary figures MUST be displayed in Indian Rupee (₹) using en-IN formatting (e.g. ₹50,000, ₹1,20,000).
3. If addressing a goal shortfall, recommend ONLY: Option A (Increase Monthly Savings), Option B (Reduce Goal Cost), Option C (Extend Target Timeline). NEVER suggest raising return assumptions or ignoring taxes/inflation.
4. Ground your advice directly in the provided RAG Context Chunks. Cite the source title in your response when relevant.
5. Keep your tone empathetic, clear, professional, and actionable (100–180 words).
`;

          const fullPrompt = `${systemInstruction}

RAG KNOWLEDGE CONTEXT CHUNKS:
${contextText}

CLIENT CONTEXT & REQUEST:
${promptContext}

Provide a concise, advisory coaching response:`;

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

    // Local Fallback Synthesis
    console.log('[RAG ENGINE] Using local RAG fallback response template.');
    const topChunk = retrievedChunks[0];
    const sourceTitle = topChunk?.metadata?.source || 'Ric Edelman Wealth Principles';
    const textSnippet = topChunk?.text || '';

    if (promptContext.includes("Goal Name") || promptContext.includes("shortfall")) {
      return `We have analyzed your goal shortfall based on Ric Edelman's methodology [${sourceTitle}]:

Key Principles:
- When facing a goal funding shortfall, taking on higher market risk is counterproductive.
- You have three mathematical levers under your control:
  1. Option A: Increase your monthly savings rate.
  2. Option B: Reduce your present-value goal cost target.
  3. Option C: Extend your target timeline to allow more compounding time.`;
    } else if (promptContext.includes("Retirement") || promptContext.includes("longevity")) {
      return `Based on Ric Edelman's retirement planning principles [${sourceTitle}]:

Key Guidance:
1. Longevity Risk: Plan for a retirement lifetime up to age 95 or 100 due to medical advancements.
2. Withdrawal Sequence: Tap taxable brokerage accounts first, preserving tax-deferred IRAs/401(k)s and Roth accounts for long-term growth.
3. Principal Spending: Gradual, controlled spending of principal in retirement is normal and mathematically expected.`;
    } else if (promptContext.toLowerCase().includes("debt") || promptContext.toLowerCase().includes("credit card")) {
      return `Based on Ric Edelman's debt management methodology [${sourceTitle}]:

Core Advice:
- High-interest consumer debt (>8% APR) is the single most destructive force in personal wealth accumulation.
- Eliminating high-interest debt provides a guaranteed risk-free return equal to the interest rate.
- Prioritize aggressive debt elimination before expanding growth investment allocations.`;
    } else if (promptContext.toLowerCase().includes("emergency") || promptContext.toLowerCase().includes("cash")) {
      return `Based on Ric Edelman's cash reserve guidelines [${sourceTitle}]:

Core Advice:
- Maintain 3 to 6 months of living expenses in liquid, high-yield cash accounts.
- Your emergency fund is insurance to prevent forced selling of growth investments during income disruptions.`;
    } else {
      return `Based on our wealth management research [${sourceTitle}]:

Key Insight:
${textSnippet.slice(0, 240)}...

How would you like to apply this to your current financial goals or portfolio setup?`;
    }
  }
}

export const ragEngine = new RAGEngine();
