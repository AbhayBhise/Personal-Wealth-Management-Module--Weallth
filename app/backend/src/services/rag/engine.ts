import { bookChunks, DocumentChunk } from './chunks';

export class RAGEngine {
  /**
   * Simulates Pinecone Vector Search using TF-IDF/Keyword overlap.
   */
  public semanticSearch(query: string, categoryFilter?: string): DocumentChunk[] {
    console.log(`[RAG ENGINE] Initiating semantic search for: "${query}"`);
    
    let candidates = bookChunks;
    if (categoryFilter) {
      candidates = candidates.filter(c => c.metadata.category === categoryFilter);
    }

    // Tokenize query
    const queryTokens = query.toLowerCase().split(/\W+/).filter(t => t.length > 2);

    // Score candidates based on term frequency
    const scored = candidates.map(chunk => {
      const textTokens = chunk.text.toLowerCase().split(/\W+/);
      let score = 0;
      for (const token of queryTokens) {
        score += textTokens.filter(t => t === token).length;
      }
      return { chunk, score };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    // Return top 2 matching chunks
    const results = scored.filter(s => s.score > 0).map(s => s.chunk).slice(0, 2);
    
    // Fallback: If no keyword overlap, return the first chunk of the category as a fallback
    if (results.length === 0 && candidates.length > 0) {
      results.push(candidates[0]);
    }

    console.log(`[RAG ENGINE] Retrieved ${results.length} chunks from 'Discover The Wealth Within You'.`);
    return results;
  }

  /**
   * Simulates OpenAI Text Synthesis using a deterministic template.
   */
  public generateResponse(promptContext: string, retrievedChunks: DocumentChunk[]): string {
    console.log(`[RAG ENGINE] Generating LLM response with Temperature=0.2...`);
    
    const contextText = retrievedChunks.map(c => `[From ${c.metadata.source}]: "${c.text}"`).join('\n\n');
    
    // In a real implementation, this strings together the Prompt + Context and sends to OpenAI.
    // For this local token-free simulation, we parse the prompt intent and inject the RAG text.
    
    let baseResponse = "";

    if (promptContext.includes("Goal Name")) {
      baseResponse = `We have analyzed your goal shortfall. According to Ric Edelman's methodology: "${retrievedChunks[0]?.text}"\n\nTherefore, we do not recommend taking on risky investments. Please choose one of the mathematical options calculated below to safely fund your goal.`;
    } else if (promptContext.includes("Retirement")) {
      baseResponse = `Based on your retirement profile, we have structured your roadmap using Edelman principles. \n\n1. Longevity: "${retrievedChunks.find(c => c.id.includes('longevity'))?.text}"\n\n2. Withdrawals: "${retrievedChunks.find(c => c.id.includes('withdrawals'))?.text}"`;
    } else {
      baseResponse = `Based on Ric Edelman's rules: "${retrievedChunks[0]?.text}"\n\nPlease follow the recommended action to protect your wealth.`;
    }

    return baseResponse;
  }
}

export const ragEngine = new RAGEngine();
