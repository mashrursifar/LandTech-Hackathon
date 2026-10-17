import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle, Clock, Search, ArrowRight, Eye, Shield, AlertOctagon } from 'lucide-react';
import '../styles/DashboardView.css';

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
    <div className="dashboard-container">
      {/* Page Title & Top Actions */}
      <div className="dashboard-header">
        <div className="dashboard-title-group">
          <h1>Screening & Inconsistency Dashboard</h1>
          <p className="dashboard-subtitle">
            Deterministic rule-based screening engine evaluating fictional land deed registrations, transfers, and mutation records. Highlights explainable anomalies for authorized land verification officers.
          </p>
        </div>

        <div>
          <button 
            className="btn btn-primary"
            onClick={onRunDetection}
            disabled={isRunningDetection}
          >
            <Shield size={15} />
            <span>{isRunningDetection ? 'Executing Rules...' : 'Run All Rules (R1–R5)'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        {/* Card 1: Total */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Inconsistencies</span>
            <AlertTriangle size={16} color="var(--color-warning)" />
          </div>
          <div className="stat-value">{stats?.total || 0}</div>
          <div className="stat-footer-text">Across {plots?.length || 0} parcels screened</div>
          <div className="stat-border-bar bar-total" />
        </div>

        {/* Card 2: High Severity */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">High-Priority</span>
            <AlertOctagon size={16} color="var(--color-high)" />
          </div>
          <div className="stat-value stat-value-high">{stats?.highPriority || 0}</div>
          <div className="stat-footer-text">Double-sales & duplicate deeds</div>
          <div className="stat-border-bar bar-high" />
        </div>

        {/* Card 3: Open Reviews */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Open Reviews</span>
            <Clock size={16} color="var(--color-warning)" />
          </div>
          <div className="stat-value stat-value-warning">{stats?.openReviews || 0}</div>
          <div className="stat-footer-text">Awaiting officer inspection</div>
          <div className="stat-border-bar bar-warning" />
        </div>

        {/* Card 4: Under Review */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Under Review</span>
            <ShieldAlert size={16} color="var(--accent-cyan)" />
          </div>
          <div className="stat-value">{stats?.underReview || 0}</div>
          <div className="stat-footer-text">Held for archive inquiry</div>
          <div className="stat-border-bar bar-info" />
        </div>

        {/* Card 5: Resolved */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Resolved / Closed</span>
            <CheckCircle size={16} color="var(--color-success)" />
          </div>
          <div className="stat-value stat-value-success">{stats?.resolved || 0}</div>
          <div className="stat-footer-text">Audited & certified</div>
          <div className="stat-border-bar bar-success" />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="filter-toolbar">
        {/* Search */}
        <div className="search-box-wrapper">
          <Search size={14} className="search-icon-inside" />
          <input
            type="text"
            className="input search-input-field"
            placeholder="Search by Plot ID, Rule (R1-R5), or keyword..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Severity */}
        <div className="filter-group">
          <span className="filter-group-label">Severity:</span>
          <select 
            value={severityFilter} 
            onChange={e => setSeverityFilter(e.target.value)}
            className="input filter-select"
          >
            <option value="ALL">All Severities</option>
            <option value="High">High Severity</option>
            <option value="Review">Requires Review</option>
          </select>
        </div>

        {/* Status */}
        <div className="filter-group">
          <span className="filter-group-label">Status:</span>
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            className="input filter-select"
          >
            <option value="ALL">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Under Review">Under Review</option>
            <option value="Resolved">Resolved</option>
            <option value="Dismissed">Dismissed</option>
          </select>
        </div>

        {/* Rule */}
        <div className="filter-group">
          <span className="filter-group-label">Rule:</span>
          <select 
            value={ruleFilter} 
            onChange={e => setRuleFilter(e.target.value)}
            className="input filter-select"
          >
            <option value="ALL">All Rules (R1-R5)</option>
            <option value="R1">R1: Potential Double-Selling</option>
            <option value="R2">R2: Seller/Owner Conflict</option>
            <option value="R3">R3: Registry/Mutation Mismatch</option>
            <option value="R4">R4: Duplicate Deed Reference</option>
            <option value="R5">R5: Inconsistent Sequence</option>
          </select>
        </div>

        <div className="filter-count-label">
          Showing <strong>{filteredAlerts.length}</strong> of {alerts.length}
        </div>
      </div>

      {/* Alerts List */}
      <div className="alerts-list">
        {filteredAlerts.length === 0 ? (
          <div className="empty-state-box">
            <CheckCircle size={36} color="var(--color-success)" style={{ margin: '0 auto 0.75rem auto' }} />
            <div className="empty-state-title">No Inconsistencies Matching Filters</div>
            <div className="empty-state-desc">All records for this filter criteria are consistent or addressed.</div>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isHigh = alert.severity === 'High';
            const isUnderReview = alert.reviewStatus === 'Under Review';
            const isResolved = ['Resolved', 'Dismissed'].includes(alert.reviewStatus);

            return (
              <div 
                key={alert.alertId}
                className={`alert-card ${isHigh ? 'border-high' : 'border-warning'}`}
              >
                <div className="alert-card-inner">
                  {/* Left Column */}
                  <div className="alert-content-left">
                    <div className="alert-meta-row">
                      <span className={`badge ${isHigh ? 'badge-high' : 'badge-warning'}`}>
                        {alert.ruleId} • {alert.severity}
                      </span>

                      <span 
                        onClick={() => onOpenPlotTimeline(alert.plotId)}
                        className="badge plot-link-chip"
                        title="Click to view chronological timeline for this parcel"
                      >
                        {alert.plotId}
                      </span>

                      <span className={`badge ${isResolved ? 'badge-success' : isUnderReview ? 'badge-warning' : 'badge-neutral'}`}>
                        <span className={`status-dot ${isResolved ? 'dot-success' : isUnderReview ? 'dot-warning' : 'dot-high'}`} />
                        {alert.reviewStatus}
                      </span>
                    </div>

                    <div className="alert-card-title">{alert.ruleTitle}</div>

                    <div className="alert-card-explanation">{alert.explanation}</div>

                    {/* Recommendation Snippet */}
                    <div className="alert-recommendation-panel">
                      <span className="recommendation-prefix">Recommended:</span>
                      <span>{alert.recommendation}</span>
                    </div>

                    {/* Linked Record Evidence Tags */}
                    {alert.evidenceRefs?.length > 0 && (
                      <div className="evidence-tag-list">
                        <span className="evidence-label-text">Linked Records:</span>
                        {alert.evidenceRefs.map((ev, i) => (
                          <span 
                            key={i} 
                            className="badge badge-neutral font-mono"
                            title={ev.summary}
                          >
                            {ev.refId}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Actions */}
                  <div className="alert-actions-right">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onInspectAlert(alert)}
                    >
                      <Eye size={13} />
                      <span>Inspect Evidence</span>
                    </button>

                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => onOpenPlotTimeline(alert.plotId)}
                    >
                      <ArrowRight size={13} />
                      <span>Parcel Timeline</span>
                    </button>

                    {alert.reviewedBy && (
                      <div className="reviewer-stamp-text">
                        Audited by: {alert.reviewedBy.split('(')[0]}
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
