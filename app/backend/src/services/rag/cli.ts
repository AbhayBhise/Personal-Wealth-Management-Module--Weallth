import 'dotenv/config';
import { ingestKnowledgeBase, incrementalSync } from './ingestion/ingestor';
import { vectorStore } from './vectorStore';
import { embedder } from './embedder';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const namespace = command === 'test-query' ? 'production' : (args[1] || 'production');

  if (!command) {
    console.error('Usage: npx ts-node cli.ts <command> [namespace]');
    console.error('Commands: ingest, sync, stats, deleteAll, test-query');
    process.exit(1);
  }

  try {
    await vectorStore.initialize(namespace);
    
    switch (command) {
      case 'ingest':
        console.log(`Starting full ingestion for namespace: ${namespace}`);
        const ingestStats = await ingestKnowledgeBase(namespace, false);
        console.log('✅ Knowledge base ingestion complete!', ingestStats);
        break;

      case 'sync':
        console.log(`Starting incremental sync for namespace: ${namespace}`);
        const syncStats = await incrementalSync(namespace);
        console.log(`Skipped ${syncStats.skippedChunks}/${syncStats.totalChunks} unchanged, ${syncStats.newChunks} new/updated`);
        break;

      case 'stats':
        if (!vectorStore.isAvailable) {
           console.error('PostgreSQL vectorStore not available.');
           break;
        }
        const stats = await vectorStore.getStats();
        console.log('Index Stats:', JSON.stringify(stats, null, 2));
        break;

      case 'deleteAll':
        console.log(`⚠️ Warning: Deleting all vectors in PostgreSQL table in 2 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await vectorStore.deleteAll();
        console.log('✅ Vectors deleted.');
        break;

      case 'test-query':
        const query = args.slice(1).join(' ');
        if (!query) {
           console.error('Provide a query string for test-query');
           process.exit(1);
        }
        console.log(`Testing query: "${query}" on PostgreSQL + pgvector`);
        const queryVector = await embedder.embed(query);
        const results = await vectorStore.search(queryVector, { topK: 5, searchQuery: query });
        
        console.log(`Found ${results.length} results:`);
        results.forEach((r, idx) => {
           console.log(`\n[${idx + 1}] Score: ${r.score.toFixed(4)} | Title: ${r.metadata.title}`);
           console.log(`Citation: ${r.metadata.book}, ${r.metadata.chapter}, Section: ${r.metadata.section} (pp. ${r.metadata.page_start}-${r.metadata.page_end})`);
           console.log(r.text.substring(0, 150) + '...');
        });
        break;

      default:
        console.error(`Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error('CLI Error:', error);
    process.exit(1);
  }
}

main();
