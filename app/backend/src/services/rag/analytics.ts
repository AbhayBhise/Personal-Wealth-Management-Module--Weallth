export interface AITelemetryRecord {
  purpose: string;
  intent: string;
  confidenceScore: number;
  totalLatencyMs: number;
  retrievalLatencyMs: number;
  timestamp: string;
}

export class AIAnalyticsTracker {
  private records: AITelemetryRecord[] = [];
  private feedbackLog: Array<{ messageIdx: number; type: 'up' | 'down'; timestamp: string }> = [];

  public logExecution(record: AITelemetryRecord): void {
    this.records.push(record);
    if (this.records.length > 500) {
      this.records.shift(); // Keep last 500 records
    }
  }

  public logFeedback(messageIdx: number, type: 'up' | 'down'): void {
    this.feedbackLog.push({ messageIdx, type, timestamp: new Date().toISOString() });
  }

  public getSummaryMetrics() {
    const totalRequests = this.records.length;
    if (totalRequests === 0) {
      return { totalRequests: 0, avgLatencyMs: 0, lowConfidenceCount: 0, feedbackUp: 0, feedbackDown: 0 };
    }

    const totalLatency = this.records.reduce((acc, r) => acc + r.totalLatencyMs, 0);
    const lowConfidenceCount = this.records.filter(r => r.confidenceScore < 0.3).length;
    const feedbackUp = this.feedbackLog.filter(f => f.type === 'up').length;
    const feedbackDown = this.feedbackLog.filter(f => f.type === 'down').length;

    return {
      totalRequests,
      avgLatencyMs: Math.round(totalLatency / totalRequests),
      lowConfidenceCount,
      feedbackUp,
      feedbackDown,
      purposeDistribution: this.getDistribution('purpose'),
      intentDistribution: this.getDistribution('intent')
    };
  }

  private getDistribution(key: 'purpose' | 'intent'): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const r of this.records) {
      const val = r[key];
      counts[val] = (counts[val] || 0) + 1;
    }
    return counts;
  }
}

export const aiAnalytics = new AIAnalyticsTracker();
