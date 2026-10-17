import React, { useState, useEffect } from 'react';
import { RefreshCw, UserCheck, Search, Clock } from 'lucide-react';
import '../styles/AuditLogView.css';

export default function AuditLogView() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = () => {
    setLoading(true);
    fetch('/api/audit-logs?limit=100')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLogs(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching audit logs:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(l => {
    const s = searchTerm.toLowerCase();
    return (
      l.action.toLowerCase().includes(s) ||
      l.details.toLowerCase().includes(s) ||
      l.reviewerName?.toLowerCase().includes(s) ||
      l.reviewerId?.toLowerCase().includes(s) ||
      l.affectedRecordRefs?.some(r => r.toLowerCase().includes(s))
    );
  });

  return (
    <div className="audit-view-container">
      {/* Header */}
      <div className="audit-header-row">
        <div>
          <h1>Screening Audit Trail & Log</h1>
          <p className="audit-subtitle">
            Immutable chronological record of detection runs, officer status modifications, and evidence inspections ensuring full accountability.
          </p>
        </div>

        <button className="btn btn-outline btn-sm" onClick={fetchLogs} disabled={loading}>
          <RefreshCw size={13} className={loading ? 'pulse-dot' : ''} />
          <span>Refresh Trail</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="audit-toolbar">
        <div className="audit-search-wrapper">
          <Search size={14} className="audit-search-icon" />
          <input
            type="text"
            className="input audit-search-input"
            placeholder="Search audit trail by Officer, Action, Plot, or Deed ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="audit-count-badge">
          Entries Logged: <strong>{filteredLogs.length}</strong>
        </div>
      </div>

      {/* Log Entries Table */}
      <div className="audit-table-wrapper">
        <table className="audit-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Authorized Reviewer</th>
              <th>Affected Records</th>
              <th>Audit Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="5" className="audit-empty-row">
                  {loading ? 'Retrieving audit logs...' : 'No audit entries found matching search filter.'}
                </td>
              </tr>
            ) : (
              filteredLogs.map(log => {
                const isDetection = log.action.includes('DETECTION');
                const isStatusUpdate = log.action.includes('STATUS');

                const badgeClass = isStatusUpdate ? 'badge-success' : isDetection ? 'badge-warning' : 'badge-neutral';

                return (
                  <tr key={log.logId}>
                    <td>
                      <div className="audit-time-cell">
                        <Clock size={12} color="var(--accent-emerald)" />
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    </td>

                    <td>
                      <span className={`badge ${badgeClass}`}>
                        {log.action}
                      </span>
                    </td>

                    <td>
                      <div className="audit-reviewer-cell">
                        <UserCheck size={14} color="var(--accent-cyan)" />
                        <div>
                          <div className="audit-reviewer-name">
                            {log.reviewerName || 'System'}
                          </div>
                          <div className="audit-reviewer-id">
                            {log.reviewerId}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {log.affectedRecordRefs?.map((ref, idx) => (
                          <span key={idx} className="badge badge-neutral font-mono" style={{ fontSize: '0.68rem', padding: '0.1rem 0.35rem' }}>
                            {ref}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="audit-details-cell">
                      <div>{log.details}</div>
                      {log.newState && (
                        <div className="audit-diff-note">
                          Status changed to: <strong>{log.newState.reviewStatus}</strong>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
