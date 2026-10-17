import React, { useMemo, useState } from 'react';
import { Search, ChevronRight, CircleCheck } from 'lucide-react';
import { RULES, severityTone, statusTone } from '../lib/constants';

export default function DashboardView({ alerts, stats, plots, onInspectAlert, onOpenPlotTimeline }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [ruleFilter, setRuleFilter] = useState('ALL');

  const ruleCounts = useMemo(() => {
    const counts = {};
    RULES.forEach(r => (counts[r.id] = 0));
    alerts.forEach(a => (counts[a.ruleId] = (counts[a.ruleId] || 0) + 1));
    return counts;
  }, [alerts]);
  const maxRuleCount = Math.max(1, ...Object.values(ruleCounts));

  const filteredAlerts = alerts.filter(a => {
    const s = searchTerm.toLowerCase();
    const matchesSearch =
      a.plotId.toLowerCase().includes(s) ||
      a.ruleId.toLowerCase().includes(s) ||
      a.explanation.toLowerCase().includes(s) ||
      a.ruleTitle.toLowerCase().includes(s);
    return (
      matchesSearch &&
      (severityFilter === 'ALL' || a.severity === severityFilter) &&
      (statusFilter === 'ALL' || a.reviewStatus === statusFilter) &&
      (ruleFilter === 'ALL' || a.ruleId === ruleFilter)
    );
  });

  const total = stats?.total || 0;
  const resolved = stats?.resolved || 0;
  const progress = total ? Math.round((resolved / total) * 100) : 0;

  const metrics = [
    { label: 'Total alerts', value: total, note: `Across ${plots?.length || 0} parcels` },
    { label: 'High severity', value: stats?.highPriority || 0, note: 'Double-sale, duplicate deed', tone: 'high' },
    { label: 'Open', value: stats?.openReviews || 0, note: 'Awaiting inspection', tone: 'info' },
    { label: 'Under review', value: stats?.underReview || 0, note: 'Held for inquiry', tone: 'review' },
  ];

  return (
    <div className="page">
      <section className="metrics" aria-label="Screening summary">
        {metrics.map(m => (
          <div key={m.label} className="metric card">
            <div className="metric-label">
              {m.tone && <span className={`tone-dot tone-dot--${m.tone}`} aria-hidden="true" />}
              <span>{m.label}</span>
            </div>
            <div className="metric-value">{m.value}</div>
            <div className="metric-note">{m.note}</div>
          </div>
        ))}
        <div className="metric card">
          <div className="metric-label">
            <span className="tone-dot tone-dot--ok" aria-hidden="true" />
            <span>Closed</span>
          </div>
          <div className="metric-value">
            {resolved}
            <span className="metric-of">/ {total}</span>
          </div>
          <div className="progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Review progress">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
      </section>

      <div className="dash-grid">
        <section className="card alert-panel" aria-labelledby="queue-title">
          <div className="card-header">
            <div>
              <h2 id="queue-title" className="card-title">Review queue</h2>
              <p className="card-meta">
                Showing {filteredAlerts.length} of {alerts.length} alerts
              </p>
            </div>
          </div>

          <div className="queue-toolbar">
            <label className="search-field">
              <span className="sr-only">Search alerts</span>
              <Search size={15} />
              <input
                type="search"
                className="input"
                placeholder="Search plot, rule, or keyword"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </label>
            <label>
              <span className="sr-only">Severity</span>
              <select className="input" value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}>
                <option value="ALL">All severities</option>
                <option value="High">High</option>
                <option value="Review">Review</option>
              </select>
            </label>
            <label>
              <span className="sr-only">Status</span>
              <select className="input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="ALL">All statuses</option>
                <option value="Open">Open</option>
                <option value="Under Review">Under review</option>
                <option value="Resolved">Resolved</option>
                <option value="Dismissed">Dismissed</option>
              </select>
            </label>
          </div>

          {filteredAlerts.length === 0 ? (
            <div className="empty-state">
              <CircleCheck size={28} />
              <strong>No alerts match these filters</strong>
              <span>Records in this view are consistent or already addressed.</span>
            </div>
          ) : (
            <ul className="alert-list">
              {filteredAlerts.map(alert => {
                const tone = severityTone(alert.severity);
                return (
                  <li key={alert.alertId} className={`alert-row alert-row--${tone}`}>
                    <button type="button" className="alert-row-main" onClick={() => onInspectAlert(alert)}>
                      <div className="alert-row-top">
                        <span className="rule-code">{alert.ruleId}</span>
                        <span className="alert-row-title">{alert.ruleTitle}</span>
                      </div>
                      <p className="alert-row-text">{alert.explanation}</p>
                      <div className="alert-row-meta">
                        <span className={`chip chip--${tone}`}>{alert.severity === 'High' ? 'High' : 'Review'}</span>
                        <span className={`chip chip--${statusTone(alert.reviewStatus)}`}>{alert.reviewStatus}</span>
                        <span className="alert-row-evidence">
                          {alert.evidenceRefs?.length || 0} linked records
                        </span>
                      </div>
                    </button>
                    <div className="alert-row-side">
                      <button
                        type="button"
                        className="mono plot-link"
                        onClick={() => onOpenPlotTimeline(alert.plotId)}
                        aria-label={`Open timeline for ${alert.plotId}`}
                      >
                        {alert.plotId}
                      </button>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => onInspectAlert(alert)}>
                        <span>Inspect</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <aside className="dash-aside">
          <section className="card" aria-labelledby="rules-title">
            <div className="card-header">
              <h2 id="rules-title" className="card-title">Detection rules</h2>
              <span className="card-meta">Deterministic</span>
            </div>
            <ul className="rule-list">
              {RULES.map(rule => {
                const count = ruleCounts[rule.id] || 0;
                const isActive = ruleFilter === rule.id;
                return (
                  <li key={rule.id}>
                    <button
                      type="button"
                      className={`rule-item ${isActive ? 'is-active' : ''}`}
                      onClick={() => setRuleFilter(isActive ? 'ALL' : rule.id)}
                      aria-pressed={isActive}
                    >
                      <span className="rule-code">{rule.id}</span>
                      <span className="rule-item-body">
                        <span className="rule-item-name">{rule.name}</span>
                        <span className="rule-bar" aria-hidden="true">
                          <span style={{ width: `${(count / maxRuleCount) * 100}%` }} />
                        </span>
                      </span>
                      <span className="rule-item-count">{count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {ruleFilter !== 'ALL' && (
              <div className="rule-clear">
                <button type="button" className="link-btn" onClick={() => setRuleFilter('ALL')}>
                  Clear rule filter
                </button>
              </div>
            )}
          </section>

          <section className="card principle-card">
            <span className="eyebrow">Review principle</span>
            <p>
              Each alert links the exact records that triggered it. PlotGuard flags inconsistencies; an authorized officer records the decision.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
