/**
 * RAG Knowledge Base Loader
 *
 * Attempts to load the full knowledge base (rag_knowledge.json) first.
 * rag_knowledge.json is gitignored because it contains text derived from
 * Ric Edelman's copyrighted book (HarperCollins 2010) — 41.1% of its 689 chunks.
 *
 * On a fresh clone, the app falls back to sample_rag_knowledge.json (5 copyright-free
 * placeholder chunks). To rebuild the full knowledge base locally, run:
 *   python3 scripts/build_rag_knowledge.py
 * See also: research/README.md
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
let knowledgeData: any[];
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  knowledgeData = require('./rag_knowledge.json');
} catch {
  console.warn('[RAG] rag_knowledge.json not found locally. Using sample_rag_knowledge.json (5 chunks).');
  console.warn('[RAG] To rebuild: python3 scripts/build_rag_knowledge.py — see research/README.md');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  knowledgeData = require('./sample_rag_knowledge.json');
}

export interface DocumentChunk {
  id: string;
  metadata: {
    category: string;
    source: string;
    book?: string;
    title?: string;
  };
  text: string;
}

export const bookChunks: DocumentChunk[] = (knowledgeData as any[]).map(item => ({
  id: item.id,
  metadata: {
    category: item.category || 'General',
    source: item.source || 'Discover The Wealth Within You',
    book: item.book || 'Discover The Wealth Within You',
    title: item.title || item.source
  },
  text: item.text
}));
