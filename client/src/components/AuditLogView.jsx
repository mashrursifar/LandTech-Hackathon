import { useState, useEffect } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import { useLanguage } from '../lib/i18n.jsx';

function actionTone(action) {
  if (action.includes('STATUS')) return 'ok';
  if (action.includes('DETECTION')) return 'info';
  if (action.includes('RESET')) return 'review';
  return '';
}

export default function AuditLogView() {
  const { t, lang } = useLanguage();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const formatAction = (action) => {
    if (lang === 'bn') {
      if (action.includes('STATUS')) return 'স্ট্যাটাস আপডেট';
      if (action.includes('DETECTION')) return 'সনাক্তকরণ নিয়ম যাচাই';
      if (action.includes('RESET')) return 'ডাটা রিসেট';
    }
    return action.toLowerCase().replace(/_/g, ' ');
  };

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
          <span className="sr-only">{t('search_audit_placeholder')}</span>
          <Search size={15} />
          <input
            type="search"
            className="input"
            placeholder={t('search_audit_placeholder')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </label>
        <span className="toolbar-count">
          <strong>{filteredLogs.length}</strong> {lang === 'bn' ? 'টি এন্ট্রি' : 'entries'}
        </span>
        <button type="button" className="btn btn-secondary" onClick={fetchLogs} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'spin' : ''} />
          <span>{t('btn_refresh')}</span>
        </button>
      </div>

      <section className="card" aria-label="Audit entries">
        {filteredLogs.length === 0 ? (
          <div className="empty-state">
            <span>{loading ? (lang === 'bn' ? 'অডিট লগ লোড হচ্ছে...' : 'Loading audit entries...') : t('no_audit_logs')}</span>
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
