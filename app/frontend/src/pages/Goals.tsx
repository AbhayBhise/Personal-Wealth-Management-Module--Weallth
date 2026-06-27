import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { API_BASE } from '../services/api';
import { Goal, AIGoalCoachMessage } from '../types';

interface GoalOptions {
  goal_id: string;
  shortfall: number;
  option_a_required_monthly_savings: number;
  option_b_supported_present_cost: number;
  option_c_delay_months: number;
}

const PRIORITY_COLORS: Record<string, string> = {
  High: '#e63946', Medium: '#f4a261', Low: '#2ec4b6',
};

export default function Goals() {
  const { user } = useAppStore();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [options, setOptions] = useState<Record<string, GoalOptions>>({});
  const [coachMessages, setCoachMessages] = useState<Record<string, AIGoalCoachMessage>>({});
  const [loading, setLoading] = useState(true);

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="spinner" />
        <p style={{ color: 'var(--text-secondary)' }}>Loading your goals...</p>
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
        <h2>No Goals Yet</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Goals are created during the Wealth Discovery process. Complete onboarding to see your goals here with funding analysis and Edelman Solver options.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: '0 0 0.25rem' }}>Financial Goals</h2>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Each goal includes Edelman Solver options to close any funding gap.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <span>
            <strong style={{ color: 'var(--status-healthy)' }}>
              {goals.filter(g => g.shortfall <= 0).length}
            </strong> on track
          </span>
          <span>·</span>
          <span>
            <strong style={{ color: 'var(--status-caution)' }}>
              {goals.filter(g => g.shortfall > 0).length}
            </strong> with shortfall
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {goals.map(goal => {
          const opt = options[goal.id];
          const fundedPct = goal.target_amount > 0
            ? Math.min(100, Math.round((goal.already_saved / goal.target_amount) * 100)) : 0;

          return (
            <div key={goal.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem' }}>{goal.name}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '4px',
                      background: 'rgba(99,102,241,0.15)', color: 'var(--accent-primary)', fontWeight: 600,
                    }}>
                      {goal.category}
                    </span>
                    <span style={{
                      fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: '4px',
                      background: `${PRIORITY_COLORS[goal.priority]}15`,
                      color: PRIORITY_COLORS[goal.priority], fontWeight: 700, textTransform: 'uppercase',
                    }}>
                      {goal.priority}
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Target: {goal.target_year}
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span>{fundedPct}% funded</span>
                  <span>${goal.already_saved.toLocaleString()} / ${goal.target_amount.toLocaleString()}</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
                  <div style={{
                    width: `${fundedPct}%`, height: '100%', borderRadius: '3px',
                    background: goal.shortfall > 0 ? 'var(--status-caution)' : 'var(--status-healthy)',
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>

              {/* Key Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Monthly Contribution</div>
                  <div style={{ fontWeight: 600 }}>${goal.monthly_contribution.toLocaleString()}</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Projected Shortfall</div>
                  <div style={{ fontWeight: 600, color: goal.shortfall > 0 ? 'var(--status-caution)' : 'var(--status-healthy)' }}>
                    {goal.shortfall > 0 ? `$${goal.shortfall.toLocaleString()}` : '✓ On Track'}
                  </div>
                </div>
              </div>

              {/* AI Coach */}
              {coachMessages[goal.id] && (
                <div style={{ marginBottom: '1.25rem', padding: '1rem', background: 'rgba(99,102,241,0.1)', borderRadius: '8px', borderLeft: '4px solid var(--accent-primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>🤖</span>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--accent-primary)' }}>AI Goal Coach</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', lineHeight: 1.5, margin: 0, color: 'var(--text-secondary)' }}>
                    {coachMessages[goal.id].message}
                  </p>
                </div>
              )}

              {/* Solver Options */}
              {opt && (
                <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(99,102,241,0.06)', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.15)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.75rem', color: 'var(--accent-primary)' }}>
                    ⚡ Edelman Solver Options
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--status-healthy)', minWidth: '16px' }}>A</span>
                      <span style={{ color: 'var(--text-secondary)' }}>Increase savings to <strong style={{ color: 'var(--text-primary)' }}>${opt.option_a_required_monthly_savings.toLocaleString()}/mo</strong></span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--status-caution)', minWidth: '16px' }}>B</span>
                      <span style={{ color: 'var(--text-secondary)' }}>Reduce target to <strong style={{ color: 'var(--text-primary)' }}>${opt.option_b_supported_present_cost.toLocaleString()}</strong></span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: '#6366f1', minWidth: '16px' }}>C</span>
                      <span style={{ color: 'var(--text-secondary)' }}>Delay by <strong style={{ color: 'var(--text-primary)' }}>{opt.option_c_delay_months} months</strong></span>
                    </div>
                  </div>
                </div>
              )}

              {goal.shortfall <= 0 && (
                <div style={{ marginTop: 'auto', padding: '0.75rem', background: 'rgba(6,214,160,0.08)', borderRadius: '8px', border: '1px solid rgba(6,214,160,0.2)', textAlign: 'center', fontSize: '0.85rem', color: 'var(--status-healthy)', fontWeight: 600 }}>
                  ✅ This goal is fully funded at your current contribution rate.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
