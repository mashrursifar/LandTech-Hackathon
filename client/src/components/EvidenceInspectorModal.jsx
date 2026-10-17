import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle, AlertTriangle, FileText, ArrowRightLeft, User, Building2, Save, History, Scale } from 'lucide-react';

export default function EvidenceInspectorModal({ 
  alert, 
  onClose, 
  onStatusUpdated,
  onOpenPlotTimeline 
}) {
  const [reviewStatus, setReviewStatus] = useState(alert.reviewStatus || 'Open');
  const [notes, setNotes] = useState(alert.resolutionNotes || '');
  const [reviewerName, setReviewerName] = useState('Authorized Land Officer Tariq Khan');
  const [reviewerId, setReviewerId] = useState('REV-KHAN-01');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  if (!alert) return null;

  const isHigh = alert.severity === 'High';

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch(`/api/alerts/${alert.alertId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewStatus,
          notes,
          reviewerId,
          reviewerName
        })
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMsg({ type: 'success', text: `Status updated to '${reviewStatus}' and logged to immutable audit trail.` });
        if (onStatusUpdated) onStatusUpdated(data.data);
      } else {
        setFeedbackMsg({ type: 'error', text: data.message || 'Update failed' });
      }
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: '850px' }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.9)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className={`badge ${isHigh ? 'badge-high' : 'badge-review'}`}>
              {alert.ruleId} • {alert.severity} Priority
            </span>
            <span className="badge badge-subtle font-mono" style={{ color: '#34d399' }}>
              {alert.plotId}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              Alert ID: {alert.alertId}
            </span>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.25rem'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Title & Principle Notice */}
          <div>
            <h2 style={{ fontSize: '1.35rem', color: '#ffffff', marginBottom: '0.45rem' }}>
              {alert.ruleTitle}
            </h2>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              fontSize: '0.72rem',
              color: '#67e8f9'
            }}>
              <Scale size={13} />
              <span>Screening Rule Output — Flags Inconsistency for Authorized Human Review (Not Automated Legal Proof)</span>
            </div>
          </div>

          {/* Explanation Box */}
          <div style={{
            padding: '1rem',
            background: 'rgba(17, 24, 39, 0.9)',
            borderLeft: isHigh ? '3px solid #f43f5e' : '3px solid #f59e0b',
            borderRadius: 'var(--radius-sm)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Why this case requires human inspection:
            </div>
            <p style={{ fontSize: '0.9rem', color: '#f8fafc', lineHeight: 1.5 }}>
              {alert.explanation}
            </p>

            <div style={{
              marginTop: '0.85rem',
              padding: '0.65rem 0.85rem',
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: 'var(--radius-sm)',
              border: '1px dashed var(--border-medium)',
              fontSize: '0.8rem',
              color: '#fcd34d'
            }}>
              <strong>Recommended Action: </strong>
              <span>{alert.recommendation}</span>
            </div>
          </div>

          {/* Side-by-Side Evidence Comparison Cards */}
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={16} color="var(--accent-emerald)" />
              <span>Conflicting Instruments & Linked Evidence ({alert.evidenceRefs?.length || 0})</span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: alert.evidenceRefs?.length > 1 ? 'repeat(auto-fit, minmax(280px, 1fr))' : '1fr',
              gap: '0.85rem'
            }}>
              {alert.evidenceRefs?.map((ev, idx) => (
                <div 
                  key={idx}
                  style={{
                    padding: '1rem',
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-sm)',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span className="badge badge-subtle font-mono" style={{ fontSize: '0.72rem' }}>
                      {ev.type?.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>
                      {ev.refId}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.35rem' }}>
                    {ev.label}
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {ev.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Review Decision Workflow Box */}
          <form 
            onSubmit={handleSaveStatus}
            style={{
              padding: '1.25rem',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(15, 23, 42, 0.8) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={16} color="var(--accent-emerald)" />
              <span>Authorized Officer Review Action & Audit Certification</span>
            </div>

            {feedbackMsg && (
              <div style={{
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1rem',
                fontSize: '0.8rem',
                background: feedbackMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                border: feedbackMsg.type === 'success' ? '1px solid #10b981' : '1px solid #f43f5e',
                color: feedbackMsg.type === 'success' ? '#6ee7b7' : '#fda4af'
              }}>
                {feedbackMsg.text}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: 600 }}>
                  Review Status:
                </label>
                <select 
                  value={reviewStatus} 
                  onChange={e => setReviewStatus(e.target.value)}
                  className="input"
                  style={{ fontSize: '0.85rem' }}
                >
                  <option value="Open">Open (Pending Inspection)</option>
                  <option value="Under Review">Under Review (Hold for Registry Audit)</option>
                  <option value="Resolved">Resolved (Ownership Verified & Synchronized)</option>
                  <option value="Dismissed">Dismissed (Clerical Note / Exception Justified)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: 600 }}>
                  Reviewer Credential:
                </label>
                <input
                  type="text"
                  className="input"
                  value={reviewerName}
                  onChange={e => setReviewerName(e.target.value)}
                  style={{ fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: 600 }}>
                Verification Rationale & Audit Findings:
              </label>
              <textarea
                className="input"
                rows="3"
                placeholder="Enter Sub-Registry volume verification, AC Land inquiry notes, or reasons for hold/resolution..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                style={{ resize: 'vertical', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  onClose();
                  onOpenPlotTimeline(alert.plotId);
                }}
              >
                <History size={13} />
                <span>View Full Parcel Timeline</span>
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                <Save size={15} />
                <span>{isSubmitting ? 'Recording...' : 'Record Review Action to Audit Log'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
