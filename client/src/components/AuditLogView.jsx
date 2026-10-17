import React, { useState, useEffect } from 'react';
import { FileText, Shield, Clock, RefreshCw, UserCheck, Search, Filter } from 'lucide-react';

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
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span>Screening Audit Trail & Log</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Immutable chronological record of detection runs, officer status modifications, and evidence inspections ensuring full accountability.
          </p>
        </div>

        <button className="btn btn-outline btn-sm" onClick={fetchLogs} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'pulse-dot' : ''} />
          <span>Refresh Trail</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-panel" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.25rem', display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            className="input"
            placeholder="Search audit trail by Officer, Action, Plot, or Deed ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Entries Logged: <strong>{filteredLogs.length}</strong>
        </div>
      </div>

      {/* Log Entries Table */}
      <div className="glass-panel" style={{ overflowX: 'auto', padding: '0.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-dim)' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Timestamp</th>
              <th style={{ padding: '0.75rem 1rem' }}>Action</th>
              <th style={{ padding: '0.75rem 1rem' }}>Authorized Reviewer</th>
              <th style={{ padding: '0.75rem 1rem' }}>Affected Records</th>
              <th style={{ padding: '0.75rem 1rem' }}>Audit Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  {loading ? 'Retrieving audit logs...' : 'No audit entries found matching search filter.'}
                </td>
              </tr>
            ) : (
              filteredLogs.map(log => {
                const isDetection = log.action.includes('DETECTION');
                const isStatusUpdate = log.action.includes('STATUS');

                return (
                  <tr 
                    key={log.logId}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={12} color="var(--accent-emerald)" />
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    </td>

                    <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                      <span className={`badge ${isStatusUpdate ? 'badge-ok' : isDetection ? 'badge-review' : 'badge-subtle'}`} style={{ fontSize: '0.7rem' }}>
                        {log.action}
                      </span>
                    </td>

                    <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <UserCheck size={14} color="#38bdf8" />
                        <div>
                          <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.8rem' }}>
                            {log.reviewerName || 'System'}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                            {log.reviewerId}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                        {log.affectedRecordRefs?.map((ref, idx) => (
                          <span key={idx} className="badge badge-subtle font-mono" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>
                            {ref}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                      {log.details}
                      {log.newState && (
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                          Status changed to: <strong style={{ color: '#34d399' }}>{log.newState.reviewStatus}</strong>
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
