import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { API_BASE } from '../services/api';
import { Goal, AIGoalCoachMessage } from '../types';
import { formatCurrency } from '../utils/formatters';

interface GoalOptions {
  goal_id: string;
  shortfall: number;
  option_a_required_monthly_savings: number;
  option_b_supported_present_cost: number;
  option_c_delay_months: number;
}

const CATEGORY_THEMES: Record<string, {
  bgGradient: string;
  borderColor: string;
  avatarBg: string;
  icon: string;
  accentColor: string;
  badgeBg: string;
  badgeColor: string;
  progressGradient: string;
}> = {
  Education: {
    bgGradient: 'linear-gradient(145deg, rgba(30, 27, 75, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
    borderColor: 'rgba(124, 58, 237, 0.35)',
    avatarBg: 'rgba(124, 58, 237, 0.25)',
    icon: '🎓',
    accentColor: '#a78bfa',
    badgeBg: 'rgba(124, 58, 237, 0.2)',
    badgeColor: '#c4b5fd',
    progressGradient: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
  },
  Purchase: {
    bgGradient: 'linear-gradient(145deg, rgba(30, 27, 75, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
    borderColor: 'rgba(124, 58, 237, 0.35)',
    avatarBg: 'rgba(124, 58, 237, 0.25)',
    icon: '🚗',
    accentColor: '#a78bfa',
    badgeBg: 'rgba(124, 58, 237, 0.2)',
    badgeColor: '#c4b5fd',
    progressGradient: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
  },
  Retirement: {
    bgGradient: 'linear-gradient(145deg, rgba(17, 94, 89, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
    borderColor: 'rgba(20, 184, 166, 0.35)',
    avatarBg: 'rgba(20, 184, 166, 0.25)',
    icon: '☂️',
    accentColor: '#2dd4bf',
    badgeBg: 'rgba(20, 184, 166, 0.2)',
    badgeColor: '#5eead4',
    progressGradient: 'linear-gradient(90deg, #0d9488 0%, #10b981 100%)',
  },
  'Emergency Fund': {
    bgGradient: 'linear-gradient(145deg, rgba(17, 94, 89, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
    borderColor: 'rgba(20, 184, 166, 0.35)',
    avatarBg: 'rgba(20, 184, 166, 0.25)',
    icon: '🛡️',
    accentColor: '#2dd4bf',
    badgeBg: 'rgba(20, 184, 166, 0.2)',
    badgeColor: '#5eead4',
    progressGradient: 'linear-gradient(90deg, #0d9488 0%, #10b981 100%)',
  },
  Default: {
    bgGradient: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
    borderColor: 'rgba(99, 102, 241, 0.3)',
    avatarBg: 'rgba(99, 102, 241, 0.2)',
    icon: '🎯',
    accentColor: '#818cf8',
    badgeBg: 'rgba(99, 102, 241, 0.2)',
    badgeColor: '#a5b4fc',
    progressGradient: 'linear-gradient(90deg, #4f46e5 0%, #6366f1 100%)',
  }
};

const PRIORITY_BADGES: Record<string, { bg: string; color: string; label: string }> = {
  High: { bg: 'rgba(225, 29, 72, 0.2)', color: '#f43f5e', label: 'HIGH PRIORITY' },
  Medium: { bg: 'rgba(217, 119, 6, 0.2)', color: '#fbbf24', label: 'MEDIUM PRIORITY' },
  Low: { bg: 'rgba(16, 185, 129, 0.2)', color: '#34d399', label: 'LOW PRIORITY' },
};

function stripMarkdown(text: string): string {
  if (!text) return '';
  return text
    .replace(/##\s*Summary/gi, '')
    .replace(/##\s*Recommendation/gi, '')
    .replace(/##\s*Explanation/gi, '')
    .replace(/##\s*Action Plan/gi, '')
    .replace(/##\s*Sources/gi, '')
    .replace(/#{1,6}\s*/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`/g, '')
    .replace(/[\r\n]+/g, ' ')
    .trim();
}

export default function Goals() {
  const { user, currency } = useAppStore();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [options, setOptions] = useState<Record<string, GoalOptions>>({});
  const [coachMessages, setCoachMessages] = useState<Record<string, AIGoalCoachMessage>>({});
  const [loading, setLoading] = useState(true);
  const [selectedGoalIdModal, setSelectedGoalIdModal] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch(`${API_BASE}/users/${user.id}/goals`)
      .then(res => res.json())
      .then(data => {
        setGoals(data);
        setLoading(false);

        data.forEach((g: Goal) => {
          if (g.shortfall > 0) {
            fetch(`${API_BASE}/users/${user.id}/goals/${g.id}/options`)
              .then(r => r.ok ? r.json() : null)
              .then(opt => {
                if (opt) setOptions(prev => ({ ...prev, [g.id]: opt }));
              });
              
            fetch(`${API_BASE}/users/${user.id}/goals/${g.id}/coach`)
              .then(r => r.ok ? r.json() : null)
              .then(msg => {
                if (msg) setCoachMessages(prev => ({ ...prev, [g.id]: msg }));
              });
          }
        });
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  if (!user) return null;
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="spinner" />
        <p style={{ color: '#94a3b8' }}>Loading your financial goals dashboard...</p>
      </div>
    );
  }

  const activeModalGoal = goals.find(g => g.id === selectedGoalIdModal);
  const activeModalCoachMsg = selectedGoalIdModal ? coachMessages[selectedGoalIdModal] : null;

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Top Navigation / Dashboard Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: '0 0 0.4rem', fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Financial Goals
          </h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>
            Each goal includes Edelman Solver options to close any funding gap.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <div style={{
            display: 'flex', gap: '0.85rem', alignItems: 'center', padding: '0.45rem 0.9rem',
            background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', fontSize: '0.82rem',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#34d399', fontWeight: 600 }}>
              <span>✓</span> {goals.filter(g => g.shortfall <= 0).length} on track
            </span>
            <span style={{ color: '#475569' }}>|</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#fbbf24', fontWeight: 600 }}>
              <span>⚠️</span> {goals.filter(g => g.shortfall > 0).length} with shortfall
            </span>
          </div>

          <button 
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.25rem',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#fff',
              border: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '0.88rem',
              cursor: 'pointer', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)', transition: 'transform 0.2s ease',
            }}
            onClick={() => alert('New Goal Wizard: Complete Wealth Discovery to add customized financial targets.')}
          >
            <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>+</span> Add New Goal
          </button>
        </div>
      </div>

      {/* Responsive Grid Styles */}
      <style>{`
        .goals-responsive-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.75rem;
          width: 100%;
        }
        @media (max-width: 900px) {
          .goals-responsive-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Grid Layout of Themed Goal Cards */}
      <div className="goals-responsive-grid">
        {goals.map(goal => {
          const theme = CATEGORY_THEMES[goal.category] || CATEGORY_THEMES.Default;
          const priority = PRIORITY_BADGES[goal.priority] || PRIORITY_BADGES.Medium;
          const opt = options[goal.id];
          const fundedPct = goal.target_amount > 0
            ? Math.min(100, Math.round((goal.already_saved / goal.target_amount) * 100)) : 0;

          const rawCoachMsg = coachMessages[goal.id]?.message || '';
          const cleanCoachSummary = stripMarkdown(rawCoachMsg).slice(0, 230) + (rawCoachMsg.length > 230 ? '...' : '');

          return (
            <div 
              key={goal.id} 
              style={{
                background: theme.bgGradient,
                border: `1px solid ${theme.borderColor}`,
                borderRadius: '16px',
                padding: '1.6rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(12px)',
              }}
            >
              {/* Card Header & Avatar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{
                    width: '46px', height: '46px', borderRadius: '50%',
                    background: theme.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem', border: `1px solid ${theme.borderColor}`,
                  }}>
                    {theme.icon}
                  </div>

                  <div>
                    <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
                      {goal.name}
                    </h3>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{
                        fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: '12px',
                        background: theme.badgeBg, color: theme.badgeColor, fontWeight: 600,
                      }}>
                        {goal.category}
                      </span>
                      <span style={{
                        fontSize: '0.68rem', padding: '0.2rem 0.6rem', borderRadius: '12px',
                        background: priority.bg, color: priority.color, fontWeight: 700, letterSpacing: '0.04em',
                      }}>
                        {priority.label}
                      </span>
                    </div>
                  </div>
                </div>

                <span style={{ fontSize: '0.82rem', color: '#94a3b8', background: 'rgba(15,23,42,0.5)', padding: '0.25rem 0.65rem', borderRadius: '8px' }}>
                  Target: {goal.target_year}
                </span>
              </div>

              {/* Progress Section */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
                    {fundedPct}% <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#94a3b8' }}>funded</span>
                  </span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#cbd5e1' }}>
                    {formatCurrency(goal.already_saved, currency)} <span style={{ color: '#64748b' }}>/ {formatCurrency(goal.target_amount, currency)}</span>
                  </span>
                </div>
                <div style={{ height: '8px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{
                    width: `${fundedPct}%`, height: '100%', borderRadius: '4px',
                    background: theme.progressGradient, boxShadow: `0 0 10px ${theme.accentColor}80`,
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>

              {/* Key Metric Tiles */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{
                  background: 'rgba(15, 23, 42, 0.55)', padding: '0.9rem 1rem', borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '0.85rem',
                }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                    👛
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.15rem' }}>
                      Monthly Contribution
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                      {formatCurrency(goal.monthly_contribution, currency)}
                    </div>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(15, 23, 42, 0.55)', padding: '0.9rem 1rem', borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '0.85rem',
                }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                    🍰
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.15rem' }}>
                      Projected Shortfall
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: goal.shortfall > 0 ? '#f87171' : '#34d399' }}>
                      {goal.shortfall > 0 ? formatCurrency(goal.shortfall, currency) : '✓ Fully Funded'}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Goal Coach Card */}
              {rawCoachMsg && (
                <div style={{
                  marginBottom: '1.25rem', padding: '1.1rem', borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.65)', border: `1px solid ${theme.borderColor}`,
                  display: 'flex', flexDirection: 'column', gap: '0.75rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>🤖</span>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: theme.accentColor }}>
                        AI Goal Coach
                      </span>
                    </div>

                    <button 
                      onClick={() => setSelectedGoalIdModal(goal.id)}
                      style={{
                        background: 'transparent', border: 'none', color: theme.accentColor,
                        fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem',
                      }}
                    >
                      View Insights &rarr;
                    </button>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                    {cleanCoachSummary}
                  </p>

                  <div style={{
                    display: 'flex', gap: '1rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(255,255,255,0.06)',
                    fontSize: '0.76rem', color: '#94a3b8', fontWeight: 500,
                  }}>
                    <span>📋 3 Action Plans</span>
                    <span>•</span>
                    <span>⏱️ 5 Strategies</span>
                    <span>•</span>
                    <span>💡 2 Insights</span>
                  </div>
                </div>
              )}

              {/* Edelman Solver Options */}
              {opt && (
                <div style={{
                  marginTop: 'auto', padding: '1.1rem', borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', flexDirection: 'column', gap: '0.85rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.88rem', color: '#38bdf8' }}>
                    <span>⚡</span> Edelman Solver Options
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {/* Option A */}
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0.65rem 0.85rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '8px',
                      border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '0.84rem',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e2e8f0' }}>
                        <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>↑</span>
                        <span>Increase savings to <strong style={{ color: '#fff' }}>{formatCurrency(opt.option_a_required_monthly_savings, currency)}/mo</strong></span>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                        +{formatCurrency(Math.max(0, opt.option_a_required_monthly_savings - goal.monthly_contribution), currency)}
                      </span>
                    </div>

                    {/* Option B */}
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0.65rem 0.85rem', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '8px',
                      border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.84rem',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e2e8f0' }}>
                        <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>↓</span>
                        <span>Reduce target to <strong style={{ color: '#fff' }}>{formatCurrency(opt.option_b_supported_present_cost, currency)}</strong></span>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}>
                        -{formatCurrency(goal.shortfall, currency)}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedGoalIdModal(goal.id)}
                    style={{
                      background: 'transparent', border: 'none', color: '#38bdf8',
                      fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', textAlign: 'center',
                      paddingTop: '0.2rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
                    }}
                  >
                    Explore all options &rarr;
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Goal Coach Full 5-Section Advice Modal */}
      {selectedGoalIdModal && activeModalGoal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000, padding: '1.5rem',
        }}>
          <div style={{
            background: '#0f172a', border: '1px solid rgba(99, 102, 241, 0.4)',
            borderRadius: '20px', width: '100%', maxWidth: '680px', maxHeight: '85vh',
            display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            overflow: 'hidden',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.6rem', background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
              borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.4rem' }}>🤖</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#f8fafc', fontWeight: 700 }}>
                    AI Goal Strategy: {activeModalGoal.name}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    Ric Edelman 7-Pillar Wealth Methodology & RAG Engine
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedGoalIdModal(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body: 5-Section Render */}
            <div style={{ padding: '1.6rem', overflowY: 'auto', flex: 1, color: '#e2e8f0', lineHeight: 1.6, fontSize: '0.9rem' }}>
              {activeModalCoachMsg ? (
                activeModalCoachMsg.message.split('\n').map((line, idx) => {
                  if (line.startsWith('## ')) {
                    return (
                      <h4 key={idx} style={{
                        marginTop: idx > 0 ? '1.4rem' : '0', marginBottom: '0.5rem',
                        fontSize: '1rem', fontWeight: 700, color: '#818cf8',
                        borderBottom: '1px solid rgba(129, 140, 248, 0.2)', paddingBottom: '0.3rem',
                      }}>
                        {line.replace('## ', '')}
                      </h4>
                    );
                  }
                  if (!line.trim()) return <div key={idx} style={{ height: '6px' }} />;
                  return <div key={idx} style={{ marginBottom: '0.4rem' }}>{line}</div>;
                })
              ) : (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                  Loading AI Goal Coach insights...
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem 1.6rem', background: 'rgba(15, 23, 42, 0.95)',
              borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic' }}>
                Advisory simulation only. Not financial advice.
              </span>
              <button 
                onClick={() => setSelectedGoalIdModal(null)}
                style={{
                  padding: '0.5rem 1.25rem', background: '#334155', color: '#fff',
                  border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.84rem', cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
