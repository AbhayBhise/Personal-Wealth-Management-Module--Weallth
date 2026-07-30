import knowledgeData from './rag_knowledge.json';

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
