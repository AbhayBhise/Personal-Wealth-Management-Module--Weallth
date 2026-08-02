/**
 * Centralized AI Output Post-Processor & Cleaner.
 * Normalizes ₹ formatting, removes raw markdown header tags, strips internal chunk IDs,
 * deduplicates sentences, and cleans spacing.
 */
export function cleanAIResponseOutput(text: string, isDeveloperDebugMode: boolean = false, stripAsterisks: boolean = true): string {
  if (!text) return '';

  let cleaned = text;

  // 1. Remove raw markdown section headers (e.g. ## Summary, ## Recommendation)
  cleaned = cleaned
    .replace(/##\s*Summary/gi, '')
    .replace(/##\s*Recommendation/gi, '')
    .replace(/##\s*Explanation/gi, '')
    .replace(/##\s*Action Plan/gi, '')
    .replace(/#{1,6}\s*/g, '');

  // 2. Strip asterisks if requested for clean plain text rendering
  if (stripAsterisks) {
    cleaned = cleaned.replace(/\*\*/g, '').replace(/\*/g, '');
  }

  // 3. Hide Sources section unless Debug mode is active
  if (!isDeveloperDebugMode) {
    cleaned = cleaned
      .replace(/##\s*Sources[\s\S]*/gi, '')
      .replace(/\*Sources:\*[\s\S]*/gi, '')
      .replace(/Sources:[\s\S]*/gi, '');
  }

  // 4. Strip internal chunk IDs and filenames if leaked
  cleaned = cleaned
    .replace(/dwwy_chunk_\d+/g, '')
    .replace(/rag_knowledge\.json/g, '')
    .replace(/book_chunks\.ts/g, '');

  // 5. Normalize Indian Rupee (₹) formatting (e.g. Rs. 25000 -> ₹25,000, INR 25000 -> ₹25,000)
  cleaned = cleaned
    .replace(/INR\s*(\d+)/gi, '₹$1')
    .replace(/Rs\.?\s*(\d+)/gi, '₹$1');

  // 6. Remove consecutive duplicate lines
  const lines = cleaned.split('\n');
  const uniqueLines: string[] = [];
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (uniqueLines.length === 0 || uniqueLines[uniqueLines.length - 1].trim() !== trimmedLine || trimmedLine === '') {
      uniqueLines.push(line);
    }
  }
  cleaned = uniqueLines.join('\n');

  // 7. Clean multiple empty line breaks
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();

  return cleaned;
}
