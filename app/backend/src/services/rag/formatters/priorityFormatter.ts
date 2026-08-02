import { AIPipelineRawResult } from '../types';

export function formatPriorityResponse(recId: string, alertMessage: string, raw: AIPipelineRawResult) {
  return {
    recommendation_id: recId,
    explanation: {
      issue: `Rule Violation: ${alertMessage}`,
      matters: raw.reply,
      action: `Review recommendation and follow priority action steps.`
    },
    disclaimer: 'Advisory simulation only. Recommendations are not trading orders and do not constitute financial advice.'
  };
}
