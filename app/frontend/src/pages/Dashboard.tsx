import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { API_BASE } from '../services/api';
import ScoreGauge from '../components/ScoreGauge';
import NetWorthChart from '../components/NetWorthChart';
import AssetAllocationChart from '../components/AssetAllocationChart';
import PerformanceChart from '../components/PerformanceChart';
import RebalancingAlertsPanel from '../components/RebalancingAlerts';
import HoldingsView from '../components/HoldingsView';
import { formatCurrency } from '../utils/formatters';

const PRIORITY_COLORS: Record<string, string> = {
  Critical: '#e63946', High: '#f4a261', Medium: '#2ec4b6', Low: '#94A3B8',
};

const PILLAR_LABELS: Record<string, string> = {
  score_emergency_fund: '🛡️ Emergency Fund',
  score_debt_mgmt: '💳 Debt Management',
  score_savings_rate: '📈 Savings Rate',
  score_portfolio_drift: '⚖️ Portfolio Drift',
  score_retirement_readiness: '🏖️ Retirement',
  score_insurance_protection: '🩺 Insurance',
  score_estate_planning: '📜 Estate Plan',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    user, whs, goals, recommendations, netWorthHistory, isLoadingDashboard,
    fetchDashboardData, dismissRecommendation,
    portfolioSummary, portfolioPerformance, assetAllocation, rebalancingAlerts,
    isLoadingPortfolio, fetchPortfolioData,
    aiRetirementCoachMessage, fetchAIRetirementCoach,
    currency,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio'>('overview');
  const [explainers, setExplainers] = useState<Record<string, any>>({});

  const handleExplain = async (recId: string) => {
    if (explainers[recId]) return;
    setExplainers(prev => ({ ...prev, [recId]: 'loading' }));
    try {
      const res = await fetch(`${API_BASE}/users/${user!.id}/recommendations/${recId}/explain`);
      if (res.ok) {
        const data = await res.json();
        setExplainers(prev => ({ ...prev, [recId]: data }));
      } else {
        setExplainers(prev => ({ ...prev, [recId]: null }));
      }
    } catch (e) {
      setExplainers(prev => ({ ...prev, [recId]: null }));
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData(user.id);
      fetchPortfolioData(user.id);
      fetchAIRetirementCoach(user.id);
    }
  }, [user?.id]);

  if (!user) return null;
  if (isLoadingDashboard) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="spinner" />
        <p style={{ color: 'var(--text-secondary)' }}>Loading your wealth profile...</p>
      </div>
    );
  }

  const currentNetWorth = netWorthHistory.length > 0 ? netWorthHistory[netWorthHistory.length - 1].net_worth : 0;
  const activeRecs = recommendations.filter(r => r.status === 'Active');


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
        {(['overview', 'portfolio'] as const).map(tab => (
          <button
            key={tab}
            id={`tab-${tab}`}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? 'var(--accent-primary)' : 'transparent',
              border: 'none', borderRadius: '7px', padding: '0.45rem 1.25rem',
              color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
              fontWeight: activeTab === tab ? 700 : 400,
              fontSize: '0.85rem', cursor: 'pointer',
              transition: 'all 0.2s ease', textTransform: 'capitalize',
            }}
          >
            {tab === 'overview' ? '📊 Overview' : '💼 Portfolio'}
          </button>
        ))}
      </div>

      {/* ─── OVERVIEW TAB ─────────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <>
          {/* Row 1: WHS + Key Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <h3 style={{ margin: '0 0 1rem', alignSelf: 'flex-start', fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Wealth Health Score</h3>
              {whs && <ScoreGauge score={whs.score} category={whs.category} />}
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '1rem', marginBottom: 0 }}>
                Edelman 7-Pillar Methodology
              </p>
            </div>

            <div className="glass-panel">
              <h3 style={{ margin: '0 0 1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Financial Overview</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'Net Worth', value: formatCurrency(currentNetWorth, currency), color: currentNetWorth >= 0 ? 'var(--status-healthy)' : '#e63946' },
                  { label: 'Savings Rate', value: `${whs?.savings_rate ?? 0}%`, color: (whs?.savings_rate ?? 0) >= 15 ? 'var(--status-healthy)' : 'var(--status-caution)' },
                  { label: 'Emergency Fund', value: `${whs?.emergency_fund_coverage ?? 0}mo`, color: (whs?.emergency_fund_coverage ?? 0) >= 6 ? 'var(--status-healthy)' : 'var(--status-caution)' },
                  { label: 'Retirement Ready', value: `${whs?.retirement_readiness ?? 0}%`, color: (whs?.retirement_readiness ?? 0) >= 70 ? 'var(--status-healthy)' : '#e63946' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color }}>{value}</div>
                  </div>
                ))}
              </div>
              {netWorthHistory.length > 0 && <NetWorthChart data={netWorthHistory} />}
            </div>
          </div>

          {/* Row 2: Pillar Breakdown */}
          {whs && (
            <div className="glass-panel">
              <h3 style={{ margin: '0 0 1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>7-Pillar Breakdown</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.75rem' }}>
                {Object.entries(PILLAR_LABELS).map(([key, label]) => {
                  const score = (whs as any)[key] ?? 0;
                  const color = score >= 70 ? 'var(--status-healthy)' : score >= 40 ? 'var(--status-caution)' : '#e63946';
                  return (
                    <div key={key} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.875rem', borderRadius: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', lineHeight: 1.4 }}>{label}</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color }}>{score}</div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>/100</div>
                      <div style={{ marginTop: '0.5rem', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: '2px', transition: 'width 0.5s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Row 3: Goals + Recommendations */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="glass-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Goal Progress</h3>
                <button onClick={() => navigate('/goals')} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                  View All →
                </button>
              </div>
              {goals.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>No goals yet. Complete the Goals section to track progress.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {goals.slice(0, 4).map(goal => {
                    const fundedPct = goal.target_amount > 0 ? Math.min(100, Math.round((goal.already_saved / goal.target_amount) * 100)) : 0;
                    return (
                      <div key={goal.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.875rem', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{goal.name}</span>
                          <span style={{ fontSize: '0.75rem', color: goal.shortfall > 0 ? 'var(--status-caution)' : 'var(--status-healthy)' }}>
                            {goal.shortfall > 0 ? `${formatCurrency(goal.shortfall, currency)} gap` : '✓ On Track'}
                          </span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                          <div style={{ width: `${fundedPct}%`, height: '100%', background: goal.shortfall > 0 ? 'var(--status-caution)' : 'var(--status-healthy)', borderRadius: '3px', transition: 'width 0.5s ease' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                          <span>{fundedPct}% funded</span>
                          <span>Target: {goal.target_year}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="glass-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Priority Actions
                  {activeRecs.length > 0 && (
                    <span style={{ marginLeft: '0.5rem', background: '#e63946', color: '#fff', fontSize: '0.7rem', padding: '0.1rem 0.45rem', borderRadius: '10px', fontWeight: 700 }}>
                      {activeRecs.length}
                    </span>
                  )}
                </h3>
              </div>
              {activeRecs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
                  <p style={{ margin: 0 }}>All actions resolved!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto' }}>
                  {activeRecs.map(rec => (
                    <div key={rec.id} style={{
                      background: 'rgba(0,0,0,0.2)', padding: '0.875rem', borderRadius: '8px',
                      borderLeft: `3px solid ${PRIORITY_COLORS[rec.priority] ?? '#6366f1'}`,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.8rem', color: PRIORITY_COLORS[rec.priority] }}>{rec.priority}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{rec.category}</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', lineHeight: 1.5, margin: '0 0 0.5rem', color: 'var(--text-secondary)' }}>{rec.alert_message}</p>
                      {rec.action && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', margin: '0 0 0.5rem', fontStyle: 'italic' }}>↳ {rec.action}</p>
                      )}

                      {/* AI Explainer section */}
                      {explainers[rec.id] === 'loading' ? (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>🤖 Thinking...</div>
                      ) : explainers[rec.id] && explainers[rec.id] !== 'loading' ? (
                        <div style={{ background: 'rgba(99,102,241,0.1)', padding: '0.75rem', borderRadius: '6px', marginBottom: '0.75rem', borderLeft: '3px solid var(--accent-primary)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                            <span>🤖</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)' }}>AI Explainer</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            <p style={{ margin: 0 }}><strong>The Issue:</strong> {explainers[rec.id].explanation.issue}</p>
                            <p style={{ margin: 0 }}><strong>Why It Matters:</strong> {explainers[rec.id].explanation.matters}</p>
                            <p style={{ margin: 0 }}><strong>What To Do:</strong> {explainers[rec.id].explanation.action}</p>
                          </div>
                        </div>
                      ) : null}

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {!explainers[rec.id] && (
                          <button onClick={() => handleExplain(rec.id)} style={{
                            background: 'transparent', border: '1px solid var(--accent-primary)',
                            color: 'var(--accent-primary)', padding: '0.2rem 0.6rem',
                            borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem',
                          }}>
                            Explain with AI 🤖
                          </button>
                        )}
                        <button onClick={() => dismissRecommendation(rec.id)} style={{
                          background: 'transparent', border: '1px solid var(--border-color)',
                          color: 'var(--text-secondary)', padding: '0.2rem 0.6rem',
                          borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem',
                        }}>
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* AI Retirement Coach */}
          {aiRetirementCoachMessage && (
            <div className="glass-panel" style={{ marginTop: '0.5rem', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🤖</span>
                <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  AI Retirement Coach
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {aiRetirementCoachMessage.sections.map((sec: any) => (
                  <div key={sec.title} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>{sec.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {sec.content}
                    </p>
                  </div>
                ))}
              </div>
              <p style={{ margin: '1rem 0 0', fontSize: '0.65rem', color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'right' }}>
                {aiRetirementCoachMessage.disclaimer}
              </p>
            </div>
          )}
        </>
      )}

      {/* ─── PORTFOLIO TAB ────────────────────────────────────────────────────── */}
      {activeTab === 'portfolio' && (
        <>
          {isLoadingPortfolio ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', flexDirection: 'column', gap: '1rem' }}>
              <div className="spinner" />
              <p style={{ color: 'var(--text-secondary)' }}>Calculating portfolio analytics...</p>
            </div>
          ) : portfolioSummary ? (
            <>
              {/* Portfolio KPIs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                {[
                  { label: 'Portfolio Value', value: formatCurrency(portfolioSummary.total_portfolio_value, currency), color: 'var(--accent-primary)' },
                  { label: 'Net Worth', value: formatCurrency(portfolioSummary.net_worth, currency), color: portfolioSummary.net_worth >= 0 ? 'var(--status-healthy)' : '#e63946' },
                  { label: 'Risk Profile', value: portfolioSummary.risk_profile, color: 'var(--text-primary)' },
                  { label: 'Rebalance Needed', value: rebalancingAlerts?.needs_rebalance ? `⚠ ${rebalancingAlerts.alert_count} Alerts` : '✓ Aligned', color: rebalancingAlerts?.needs_rebalance ? '#f4a261' : 'var(--status-healthy)' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '10px' }} className="glass-panel">
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Performance Chart */}
              {portfolioPerformance && (
                <div className="glass-panel">
                  <h3 style={{ margin: '0 0 1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    📈 Performance Analytics
                  </h3>
                  <PerformanceChart performance={portfolioPerformance} />
                </div>
              )}

              {/* Allocation + Rebalancing */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {assetAllocation && (
                  <div className="glass-panel">
                    <h3 style={{ margin: '0 0 1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      ⚖️ Asset Allocation
                    </h3>
                    <AssetAllocationChart allocation={assetAllocation} />
                  </div>
                )}

                {rebalancingAlerts && (
                  <div className="glass-panel">
                    <h3 style={{ margin: '0 0 1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      🔔 Rebalancing Alerts
                    </h3>
                    <RebalancingAlertsPanel alerts={rebalancingAlerts} />
                  </div>
                )}
              </div>

              {/* Holdings View */}
              <div className="glass-panel">
                <h3 style={{ margin: '0 0 1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  🏦 Holdings Breakdown
                </h3>
                <HoldingsView summary={portfolioSummary} />
              </div>
            </>
          ) : (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Complete your onboarding to view portfolio analytics.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

