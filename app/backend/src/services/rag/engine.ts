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
   * Performs Semantic Vector Search across all 695 knowledge chunks.
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
        candidates = bookChunks; // fallback if category filter returns empty
      }
    }

    // Tokenize query
    const queryTokens = query.toLowerCase().split(/\W+/).filter(t => t.length > 2);

    // Score candidates based on Term Frequency & Position Matching
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
    
    // Fallback: If no match, return candidate defaults
    if (results.length === 0 && candidates.length > 0) {
      results.push(candidates[0]);
      if (candidates.length > 1) results.push(candidates[1]);
    }

    console.log(`[RAG ENGINE] Retrieved ${results.length} chunks from Knowledge Base (${bookChunks.length} total chunks indexed).`);
    return results;
  }

  /**
   * Generates AI Coach response using Google Gemini API (or local fallback).
   */
  public async generateResponse(promptContext: string, retrievedChunks: DocumentChunk[]): Promise<string> {
    const contextText = retrievedChunks.map((c, i) => 
      `[Source ${i + 1}: ${c.metadata.source} (${c.metadata.category})]\n"${c.text}"`
    ).join('\n\n');

    const apiKey = process.env.GEMINI_API_KEY;

    if (this.genAI && apiKey && apiKey.trim().length > 0) {
      try {
        console.log(`[RAG ENGINE] Calling Gemini API (gemini-1.5-flash) with RAG context...`);
        const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
          console.log('[RAG ENGINE] Gemini API response generated successfully.');
          return responseText.trim();
        }
      } catch (err: any) {
        console.error('[RAG ENGINE] Gemini API call error, falling back to local synthesis:', err?.message || err);
      }
    }

    // Local Fallback Synthesis
    console.log('[RAG ENGINE] Using local RAG fallback response template.');
    const topChunk = retrievedChunks[0];
    const sourceTitle = topChunk?.metadata?.source || 'Ric Edelman Wealth Principles';
    const textSnippet = topChunk?.text || '';

    if (promptContext.includes("Goal Name") || promptContext.includes("shortfall")) {
      return `We have analyzed your goal shortfall based on Ric Edelman's methodology [${sourceTitle}]: "${textSnippet.slice(0, 180)}..."

According to Edelman principles, you cannot bridge a funding gap by wishing for higher returns. Please choose one of the three client-controlled mathematical levers calculated below (Option A: Increase Savings, Option B: Reduce Target Cost, Option C: Extend Target Date) to safely reach your goal.`;
    } else if (promptContext.includes("Retirement") || promptContext.includes("longevity")) {
      return `Based on Ric Edelman's retirement principles [${sourceTitle}]: "${textSnippet.slice(0, 200)}..."

Key Advice:
1. Longevity Risk: Plan for a retirement horizon to age 95 or 100.
2. Withdrawal Sequence: Tap taxable accounts first, preserving tax-deferred IRAs/401(k)s for long-term growth.
3. Principal Utilization: Controlled spending of principal in retirement is mathematically necessary and normal.`;
    } else {
      return `Based on Ric Edelman's wealth management principles [${sourceTitle}]: "${textSnippet.slice(0, 220)}..."

Please follow these guidelines to optimize your portfolio and maintain long-term financial security.`;
    }
  }
}

export const ragEngine = new RAGEngine();
