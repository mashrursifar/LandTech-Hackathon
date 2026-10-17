import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle, Clock, Search, Filter, ArrowRight, Eye, Shield, AlertOctagon } from 'lucide-react';

export default function DashboardView({
  alerts,
  stats,
  plots,
  onInspectAlert,
  onOpenPlotTimeline,
  onRunDetection,
  isRunningDetection
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [ruleFilter, setRuleFilter] = useState('ALL');

  // Filter alerts
  const filteredAlerts = alerts.filter(a => {
    const matchesSearch = 
      a.plotId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.ruleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.ruleTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = severityFilter === 'ALL' || a.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || a.reviewStatus === statusFilter;
    const matchesRule = ruleFilter === 'ALL' || a.ruleId === ruleFilter;

    return matchesSearch && matchesSeverity && matchesStatus && matchesRule;
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Page Title & Mission Statement */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span>Screening & Inconsistency Dashboard</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem', maxWidth: '800px' }}>
            Deterministic rule-based screening engine evaluating fictional land deed registrations, transfers, and mutation records. Highlights explainable anomalies for authorized land verification officers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            className="btn btn-primary"
            onClick={onRunDetection}
            disabled={isRunningDetection}
          >
            <Shield size={16} />
            <span>{isRunningDetection ? 'Executing Rules...' : 'Run All Screening Rules (R1–R5)'}</span>
          </button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '1.75rem'
      }}>
        {/* Card 1: Total Inconsistencies */}
        <div className="glass-panel" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Detected Inconsistencies
            </span>
            <AlertTriangle size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
            {stats?.total || 0}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
            Across {plots?.length || 0} sample parcels screened
          </p>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #f59e0b, #f43f5e)' }} />
        </div>

        {/* Card 2: High Severity Cases */}
        <div className="glass-panel" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fda4af', textTransform: 'uppercase' }}>
              High-Priority Conflicts
            </span>
            <AlertOctagon size={18} color="#f43f5e" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f43f5e' }}>
            {stats?.highPriority || 0}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
            Double-sales & duplicate deed references (R1, R2, R4)
          </p>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: '#f43f5e' }} />
        </div>

        {/* Card 3: Open Reviews */}
        <div className="glass-panel" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fcd34d', textTransform: 'uppercase' }}>
              Open for Human Review
            </span>
            <Clock size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24' }}>
            {stats?.openReviews || 0}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
            Requires verification by Land Officer
          </p>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: '#f59e0b' }} />
        </div>

        {/* Card 4: Under Review / In Progress */}
        <div className="glass-panel" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#38bdf8', textTransform: 'uppercase' }}>
              Under Active Review
            </span>
            <ShieldAlert size={18} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8' }}>
            {stats?.underReview || 0}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
            Cases currently held for archive audit
          </p>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: '#38bdf8' }} />
        </div>

        {/* Card 5: Resolved / Audited */}
        <div className="glass-panel" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6ee7b7', textTransform: 'uppercase' }}>
              Resolved / Dismissed
            </span>
            <CheckCircle size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399' }}>
            {stats?.resolved || 0}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
            Documented with audit rationale
          </p>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: '#10b981' }} />
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            className="input"
            placeholder="Search by Plot ID, Rule (R1-R5), or keyword..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>

        {/* Severity Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Severity:</span>
          <select 
            value={severityFilter} 
            onChange={e => setSeverityFilter(e.target.value)}
            className="input"
            style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
          >
            <option value="ALL">All Severities</option>
            <option value="High">High Severity</option>
            <option value="Review">Requires Review</option>
          </select>
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status:</span>
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            className="input"
            style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Under Review">Under Review</option>
            <option value="Resolved">Resolved</option>
            <option value="Dismissed">Dismissed</option>
          </select>
        </div>

        {/* Rule Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Rule:</span>
          <select 
            value={ruleFilter} 
            onChange={e => setRuleFilter(e.target.value)}
            className="input"
            style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
          >
            <option value="ALL">All Rules (R1-R5)</option>
            <option value="R1">R1: Potential Double-Selling</option>
            <option value="R2">R2: Seller/Owner Conflict</option>
            <option value="R3">R3: Registry/Mutation Mismatch</option>
            <option value="R4">R4: Duplicate Deed Reference</option>
            <option value="R5">R5: Inconsistent Sequence</option>
          </select>
        </div>

        <div style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredAlerts.length}</strong> of {alerts.length} alerts
        </div>
      </div>

      {/* Alerts Table / Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {filteredAlerts.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <CheckCircle size={40} color="#10b981" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.5rem' }}>
              No Inconsistencies Matching Filters
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              All records for this filter criteria are consistent or have been addressed.
            </p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isHigh = alert.severity === 'High';
            const isUnderReview = alert.reviewStatus === 'Under Review';
            const isResolved = ['Resolved', 'Dismissed'].includes(alert.reviewStatus);

            return (
              <div 
                key={alert.alertId}
                className="glass-panel"
                style={{
                  padding: '1.25rem',
                  borderLeft: isHigh ? '4px solid #f43f5e' : '4px solid #f59e0b',
                  transition: 'transform 0.15s ease, border-color 0.15s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.85rem' }}>
                  {/* Left: Rule and Title */}
                  <div style={{ flex: '1 1 500px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                      <span className={`badge ${isHigh ? 'badge-high' : 'badge-review'}`}>
                        {alert.ruleId} • {alert.severity}
                      </span>

                      <span 
                        onClick={() => onOpenPlotTimeline(alert.plotId)}
                        className="badge badge-subtle font-mono"
                        style={{ cursor: 'pointer', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                        title="Click to view plot timeline"
                      >
                        {alert.plotId}
                      </span>

                      <span className={`badge ${isResolved ? 'badge-ok' : isUnderReview ? 'badge-review' : 'badge-subtle'}`}>
                        <span className={`pulse-dot ${isResolved ? 'pulse-ok' : isUnderReview ? 'pulse-review' : 'pulse-high'}`} />
                        {alert.reviewStatus}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '0.35rem' }}>
                      {alert.ruleTitle}
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.45', marginBottom: '0.65rem' }}>
                      {alert.explanation}
                    </p>

                    {/* Recommendation snippet */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.45rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(15, 23, 42, 0.5)',
                      border: '1px dashed var(--border-subtle)',
                      fontSize: '0.78rem',
                      color: '#cbd5e1'
                    }}>
                      <strong style={{ color: '#fcd34d' }}>Recommendation:</strong>
                      <span>{alert.recommendation}</span>
                    </div>

                    {/* Evidence Tags */}
                    {alert.evidenceRefs?.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.65rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', alignSelf: 'center' }}>
                          Linked Records:
                        </span>
                        {alert.evidenceRefs.map((ev, i) => (
                          <span 
                            key={i} 
                            className="badge badge-subtle font-mono" 
                            style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}
                            title={ev.summary}
                          >
                            {ev.refId}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '170px' }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onInspectAlert(alert)}
                      style={{ width: '100%' }}
                    >
                      <Eye size={14} />
                      <span>Inspect Evidence & Review</span>
                    </button>

                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => onOpenPlotTimeline(alert.plotId)}
                      style={{ width: '100%' }}
                    >
                      <ArrowRight size={14} />
                      <span>Open Plot Timeline</span>
                    </button>

                    {alert.reviewedBy && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textAlign: 'right' }}>
                        Reviewed by: {alert.reviewedBy.split('(')[0]}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
