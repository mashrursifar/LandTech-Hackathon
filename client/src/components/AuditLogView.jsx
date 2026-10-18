import { useState, useEffect } from 'react';
import { RefreshCw, Search } from 'lucide-react';

function actionTone(action) {
  if (action.includes('STATUS')) return 'ok';
  if (action.includes('DETECTION')) return 'info';
  if (action.includes('RESET')) return 'review';
  return '';
}

function formatAction(action) {
  return action.toLowerCase().replace(/_/g, ' ');
}

export default function AuditLogView() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = () => {
    setLoading(true);
    fetch('/api/audit-logs?limit=100')
      .then(res => res.json())
      .then(data => {
        if (data.success) setLogs(data.data);
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
    <div className="page">
      <div className="toolbar">
        <label className="search-field">
          <span className="sr-only">Search audit trail</span>
          <Search size={15} />
          <input
            type="search"
            className="input"
            placeholder="Search officer, action, plot, or deed"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </label>
        <span className="toolbar-count">
          <strong>{filteredLogs.length}</strong> entries
        </span>
        <button type="button" className="btn btn-secondary" onClick={fetchLogs} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      <section className="card" aria-label="Audit entries">
        {filteredLogs.length === 0 ? (
          <div className="empty-state">
            <span>{loading ? 'Loading audit entries' : 'No entries match this search.'}</span>
          </div>
        ) : (
          <ol className="audit-list">
            {filteredLogs.map(log => {
              const tone = actionTone(log.action);
              const date = new Date(log.timestamp);
              return (
                <li key={log.logId} className="audit-row">
                  <div className="audit-time">
                    <time className="mono" dateTime={log.timestamp}>
                      {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </time>
                    <span className="mono muted">
                      {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <span className={`audit-marker tone-dot ${tone ? `tone-dot--${tone}` : ''}`} aria-hidden="true" />
                  <div className="audit-body">
                    <div className="audit-head">
                      <span className="audit-action">{formatAction(log.action)}</span>
                      <span className="audit-by">
                        by {log.reviewerName || 'System'} <span className="mono muted">{log.reviewerId}</span>
                      </span>
                    </div>
                    <p className="audit-details">{log.details}</p>
                    {log.newState?.reviewStatus && (
                      <p className="audit-diff">
                        Status set to <strong>{log.newState.reviewStatus}</strong>
                      </p>
                    )}
                    {log.affectedRecordRefs?.length > 0 && (
                      <div className="audit-refs">
                        {log.affectedRecordRefs.map(ref => (
                          <span key={ref} className="chip mono">{ref}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </div>
  );
}
