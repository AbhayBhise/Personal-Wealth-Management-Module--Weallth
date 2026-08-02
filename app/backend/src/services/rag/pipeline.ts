import { ragEngine } from './engine';
import { AIPipelineRequest, AIPipelineResult, AIPipelineRawResult } from './types';
import { validateInput, detectIntentFromPurposeAndQuery, validateConfidence, validateGeneratedResponse } from './validator';
import { buildUnifiedContext } from './context/builder';
import { getAIModule } from './registry';
import { cleanAIResponseOutput } from './cleaner';
import { aiCache } from './cache';
import { aiAnalytics } from './analytics';
import { generateGoalAnalysisFallback } from './prompts/goalAnalysis';
import { generatePriorityAnalysisFallback } from './prompts/priorityAnalysis';

export class AIRequestPipeline {
  public async execute(req: AIPipelineRequest): Promise<AIPipelineResult> {
    const startTime = Date.now();

    // Stage 1: Purpose Detection & Module Lookup
    const purpose = req.purpose;
    const moduleDef = getAIModule(purpose);

    // Stage 2: Intent Detection
    const intent = detectIntentFromPurposeAndQuery(purpose, req.query);

    // Stage 3: Context Builder
    const context = buildUnifiedContext(req);

    // Stage 4: Input Validation Layer
    const inputValidation = validateInput(req);
    if (!inputValidation.isValid) {
      throw new Error(inputValidation.error || 'Invalid AI Pipeline request inputs.');
    }

    // Stage 5: Purpose Retrieval Strategy
    const { searchQuery, categoryFilter } = moduleDef.getRetrievalStrategy(req.query, context);

    // Stage 5b & 11: Caching Layer Check
    let retrievalResult = aiCache.getCachedRetrieval(searchQuery, categoryFilter);
    if (!retrievalResult) {
      retrievalResult = await ragEngine.semanticSearch(searchQuery, categoryFilter);
      aiCache.setCachedRetrieval(searchQuery, categoryFilter, retrievalResult);
    }
    const retrievalLatencyMs = retrievalResult.latencyMs;

    // Stage 6: Confidence Validation & Guardrails
    const confidenceCheck = validateConfidence(retrievalResult.confidenceScore, purpose);

    let reply = '';
    const contextText = retrievalResult.chunks.map((c, i) =>
      `[Source ${i + 1}: ${c.metadata.source}]\n${c.text}`
    ).join('\n\n');

    if (!confidenceCheck.isSufficient && confidenceCheck.fallbackReply) {
      reply = confidenceCheck.fallbackReply;
    } else {
      // Stage 7: Modular Prompt Builder
      const promptObj = moduleDef.buildPrompt(req.query || searchQuery, context, contextText);

      // Stage 8: Shared RAG Engine LLM Synthesis with Stage 8b Response Validation & 1-Retry
      let attempts = 0;
      let rawResponse: string | null = null;

      while (attempts < 2) {
        attempts++;
        rawResponse = await ragEngine.synthesizeCustomPrompt(promptObj.fullPrompt);
        if (rawResponse) {
          const respCheck = validateGeneratedResponse(rawResponse, context);
          if (respCheck.isValid) {
            reply = rawResponse;
            break;
          } else {
            console.warn(`[AI PIPELINE] Response validation failed on attempt ${attempts}: ${respCheck.error}`);
          }
        }
      }

      if (!reply) {
        if (purpose === 'goal-analysis') {
          reply = generateGoalAnalysisFallback(context);
        } else if (purpose === 'priority-analysis') {
          reply = generatePriorityAnalysisFallback(context);
        } else {
          // Fallback synthesis if custom synthesis failed validation or was empty
          const fallbackResult = await ragEngine.generateResponse(req.query || searchQuery, retrievalResult, context.clientProfile, context.chatHistory);
          reply = fallbackResult.reply;
        }
      }
    }

    // Stage 9: AI Output Cleaning & Post-Processing (strip asterisks for non-chat plain text modules)
    const stripAsterisks = purpose !== 'chat';
    reply = cleanAIResponseOutput(reply, false, stripAsterisks);

    const rawResult: AIPipelineRawResult = {
      reply,
      confidenceScore: retrievalResult.confidenceScore,
      intent: retrievalResult.intent,
      latencyMs: Date.now() - startTime,
      retrievedChunks: retrievalResult.chunks,
      sources: retrievalResult.sources,
      suggestedFollowUps: moduleDef.profile.defaultFollowUps
    };

    // Stage 9b: Modular Response Formatter
    const formattedOutput = moduleDef.formatResponse(req, rawResult, context);

    const totalLatencyMs = Date.now() - startTime;

    // Stage 10 & 12: Centralized Observability & Analytics Telemetry
    aiAnalytics.logExecution({
      purpose,
      intent,
      confidenceScore: rawResult.confidenceScore,
      totalLatencyMs,
      retrievalLatencyMs,
      timestamp: new Date().toISOString()
    });

    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      pipelineStage: 'COMPLETED',
      purpose,
      intent,
      userId: req.userId,
      retrievalLatencyMs,
      totalLatencyMs,
      confidenceScore: rawResult.confidenceScore,
      retrievedChunkIds: rawResult.retrievedChunks.map(c => c.id),
      sourcesCount: rawResult.sources.length
    }));

    return {
      purpose,
      intent,
      formattedOutput,
      diagnostics: {
        confidenceScore: rawResult.confidenceScore,
        intent,
        retrievalLatencyMs,
        totalLatencyMs,
        retrievedChunkIds: rawResult.retrievedChunks.map(c => c.id),
        sources: rawResult.sources
      }
    };
  }
}

export const aiPipeline = new AIRequestPipeline();
