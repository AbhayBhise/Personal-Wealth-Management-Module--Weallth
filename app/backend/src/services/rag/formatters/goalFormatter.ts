import { AIPipelineRawResult } from '../types';

export function formatGoalResponse(goalId: string, raw: AIPipelineRawResult) {
  return {
    goal_id: goalId,
    message: raw.reply,
    disclaimer: 'Advisory simulation only. Recommendations are not trading orders and do not constitute financial advice.'
  };
}
