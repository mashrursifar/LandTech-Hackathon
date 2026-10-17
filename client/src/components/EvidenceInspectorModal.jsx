import React, { useState } from 'react';
import { X, CheckCircle, FileText, Save, History, Scale } from 'lucide-react';
import '../styles/EvidenceInspectorModal.css';

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
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-dialog" 
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="modal-top-bar">
          <div className="modal-badge-group">
            <span className={`badge ${isHigh ? 'badge-high' : 'badge-warning'}`}>
              {alert.ruleId} • {alert.severity} Priority
            </span>
            <span className="badge badge-neutral font-mono" style={{ color: 'var(--brand-primary)' }}>
              {alert.plotId}
            </span>
            <span className="modal-alert-id font-mono">
              {alert.alertId}
            </span>
          </div>

          <button 
            onClick={onClose}
            className="modal-close-btn"
            title="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="modal-scroll-body">
          {/* Title & Principle Notice */}
          <div className="alert-headline-group">
            <h2>{alert.ruleTitle}</h2>
            <div className="screening-tag-banner">
              <Scale size={13} />
              <span>Screening Output — Flags Inconsistency for Authorized Human Review (Not Automated Legal Finding)</span>
            </div>
          </div>

          {/* Explanation Box */}
          <div className={`explanation-container ${isHigh ? 'border-high' : 'border-warning'}`}>
            <div className="explanation-box-header">
              Why this case requires human inspection:
            </div>
            <div className="explanation-body-text">
              {alert.explanation}
            </div>

            <div className="recommendation-box">
              <strong>Recommended Action: </strong>
              <span>{alert.recommendation}</span>
            </div>
          </div>

          {/* Side-by-Side Evidence Comparison Cards */}
          <div>
            <div className="evidence-section-header">
              <FileText size={15} color="var(--brand-primary)" />
              <span>Conflicting Instruments & Linked Evidence ({alert.evidenceRefs?.length || 0})</span>
            </div>

            <div className="evidence-comparison-grid">
              {alert.evidenceRefs?.map((ev, idx) => (
                <div key={idx} className="evidence-card">
                  <div className="evidence-card-top">
                    <span className="badge badge-neutral font-mono" style={{ fontSize: '0.68rem' }}>
                      {ev.type?.toUpperCase()}
                    </span>
                    <span className="evidence-ref-id font-mono">
                      {ev.refId}
                    </span>
                  </div>

                  <div className="evidence-card-title">{ev.label}</div>
                  <div className="evidence-card-summary">{ev.summary}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Review Decision Workflow Box */}
          <form 
            onSubmit={handleSaveStatus}
            className="reviewer-decision-form"
          >
            <div className="decision-form-header">
              <CheckCircle size={15} color="var(--brand-primary)" />
              <span>Authorized Officer Review Action & Audit Certification</span>
            </div>

            {feedbackMsg && (
              <div className={`decision-feedback-banner ${feedbackMsg.type === 'success' ? 'feedback-success' : 'feedback-error'}`}>
                {feedbackMsg.text}
              </div>
            )}

            <div className="form-row-2col">
              <div>
                <label className="field-label">Review Status:</label>
                <select 
                  value={reviewStatus} 
                  onChange={e => setReviewStatus(e.target.value)}
                  className="input"
                >
                  <option value="Open">Open (Pending Inspection)</option>
                  <option value="Under Review">Under Review (Hold for Registry Inquiry)</option>
                  <option value="Resolved">Resolved (Ownership Verified & Synchronized)</option>
                  <option value="Dismissed">Dismissed (Clerical Note / Exception Justified)</option>
                </select>
              </div>

              <div>
                <label className="field-label">Reviewer Credential:</label>
                <input
                  type="text"
                  className="input"
                  value={reviewerName}
                  onChange={e => setReviewerName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-field-group">
              <label className="field-label">Verification Rationale & Audit Findings:</label>
              <textarea
                className="input"
                rows="3"
                placeholder="Enter Sub-Registry volume verification, AC Land inquiry notes, or reasons for hold/resolution..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="form-actions-row">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  onClose();
                  onOpenPlotTimeline(alert.plotId);
                }}
              >
                <History size={13} />
                <span>View Parcel Timeline</span>
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                <Save size={14} />
                <span>{isSubmitting ? 'Recording...' : 'Record Review Action to Audit Log'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
