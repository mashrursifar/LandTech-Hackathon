import React, { useEffect, useState } from 'react';
import { X, FileText, ArrowRightLeft, Landmark, MapPin, Save, History, Scale, LoaderCircle } from 'lucide-react';
import { REVIEW_STATUSES, severityTone } from '../lib/constants';
import { useLanguage } from '../lib/i18n.jsx';

const EVIDENCE_ICON = { deed: FileText, transfer: ArrowRightLeft, mutation: Landmark, plot: MapPin };

export default function EvidenceInspectorModal({ alert, onClose, onStatusUpdated, onOpenPlotTimeline }) {
  const { t, lang } = useLanguage();
  const [reviewStatus, setReviewStatus] = useState(alert.reviewStatus || 'Open');
  const [notes, setNotes] = useState(alert.resolutionNotes || '');
  const [reviewerName, setReviewerName] = useState('Land Officer Tariq Khan');
  const reviewerId = 'REV-KHAN-01';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const tone = severityTone(alert.severity);

  const getStatusLabel = (status) => {
    switch (status) {
      case 'Open': return { label: t('status_open'), hint: t('status_open_hint') };
      case 'Under Review': return { label: t('status_under_review'), hint: t('status_under_review_hint') };
      case 'Resolved': return { label: t('status_resolved'), hint: t('status_resolved_hint') };
      case 'Dismissed': return { label: t('status_dismissed'), hint: t('status_dismissed_hint') };
      default: return { label: status, hint: '' };
    }
  };

  const handleSave = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/alerts/${alert.alertId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewStatus, notes, reviewerId, reviewerName }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: 'ok',
          text: lang === 'bn'
            ? `${reviewStatus} হিসেবে সিদ্ধান্ত সংরক্ষিত এবং অডিট ট্রেইলে যুক্ত হয়েছে।`
            : `Recorded as ${reviewStatus} and written to the audit trail.`
        });
        onStatusUpdated?.(data.data);
      } else {
        setFeedback({ type: 'high', text: data.message || data.error || (lang === 'bn' ? 'আপডেট ব্যর্থ হয়েছে' : 'Update failed') });
      }
    } catch (err) {
      setFeedback({ type: 'high', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="evidence-title"
        onClick={e => e.stopPropagation()}
      >
        <header className="drawer-head">
          <div className="drawer-head-meta">
            <span className="rule-code">{alert.ruleId}</span>
            <span className={`chip chip--${tone}`}>
              {alert.severity === 'High' ? t('filter_high') : t('filter_review')} {lang === 'bn' ? 'ঝুঁকি' : 'severity'}
            </span>
            <span className="mono drawer-id">{alert.alertId}</span>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={lang === 'bn' ? 'প্যানেল বন্ধ করুন' : 'Close evidence panel'}>
            <X size={18} />
          </button>
        </header>

        <div className="drawer-body">
          <section>
            <h2 id="evidence-title" className="drawer-title">{alert.ruleTitle}</h2>
            <p className="drawer-plot">
              {lang === 'bn' ? 'পার্সেল' : 'Parcel'} <span className="mono">{alert.plotId}</span>
            </p>
          </section>

          <section className={`explain explain--${tone}`}>
            <span className="eyebrow">{lang === 'bn' ? 'চিহ্নিত করার কারণ' : 'Why this was flagged'}</span>
            <p className="explain-text">{alert.explanation}</p>
            <div className="explain-rec">
              <span className="eyebrow">{lang === 'bn' ? 'প্রস্তাবিত পদক্ষেপ' : 'Recommended action'}</span>
              <p>{alert.recommendation}</p>
            </div>
          </section>

          <section>
            <div className="section-head">
              <h3 className="section-title">{lang === 'bn' ? 'সংশ্লিষ্ট প্রমাণাদি ও রেকর্ড' : 'Linked evidence'}</h3>
              <span className="card-meta">
                {alert.evidenceRefs?.length || 0} {lang === 'bn' ? 'টি রেকর্ড' : 'records'}
              </span>
            </div>
            <ul className="evidence-list">
              {alert.evidenceRefs?.map((ev, idx) => {
                const Icon = EVIDENCE_ICON[ev.type] || FileText;
                return (
                  <li key={idx} className="evidence">
                    <span className="evidence-icon" aria-hidden="true">
                      <Icon size={15} />
                    </span>
                    <div className="evidence-body">
                      <div className="evidence-top">
                        <span className="evidence-type">{ev.type}</span>
                        <span className="mono evidence-ref">{ev.refId}</span>
                      </div>
                      <p className="evidence-label">{ev.label}</p>
                      <p className="evidence-summary">{ev.summary}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <form className="review-form" onSubmit={handleSave}>
            <div className="section-head">
              <h3 className="section-title">{lang === 'bn' ? 'কর্মকর্তার পর্যালোচনা সিদ্ধান্ত' : 'Officer decision'}</h3>
              <span className="card-meta">{lang === 'bn' ? 'অডিট ট্রেইলে সংরক্ষিত হবে' : 'Logged to audit trail'}</span>
            </div>

            <fieldset className="status-options">
              <legend className="sr-only">{lang === 'bn' ? 'পর্যালোচনা অবস্থা' : 'Review status'}</legend>
              {REVIEW_STATUSES.map(s => {
                const opt = getStatusLabel(s.value);
                return (
                  <label key={s.value} className={`status-option ${reviewStatus === s.value ? 'is-checked' : ''}`}>
                    <input
                      type="radio"
                      name="reviewStatus"
                      value={s.value}
                      checked={reviewStatus === s.value}
                      onChange={() => setReviewStatus(s.value)}
                      className="sr-only"
                    />
                    <span className="status-option-label">{opt.label}</span>
                    <span className="status-option-hint">{opt.hint}</span>
                  </label>
                );
              })}
            </fieldset>

            <div>
              <label className="field-label" htmlFor="review-notes">
                {lang === 'bn' ? 'সিদ্ধান্তের যৌক্তিকতা ও অনুসন্ধান বিবরণী' : 'Rationale and findings'}
              </label>
              <textarea
                id="review-notes"
                className="input"
                rows={3}
                placeholder={lang === 'bn' ? 'সাব-রেজিস্ট্রি বালাম বহি যাচাই, এসিল্যান্ড রেকর্ডপত্র অনুসন্ধান অথবা স্থগিতের কারণ লিখুন...' : 'Sub-Registry volume check, AC Land inquiry notes, or reason for hold'}
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="reviewer-name">
                {lang === 'bn' ? 'পর্যালোচনা কর্মকর্তা' : 'Reviewing officer'}
              </label>
              <input
                id="reviewer-name"
                type="text"
                className="input"
                value={reviewerName}
                onChange={e => setReviewerName(e.target.value)}
              />
            </div>

            {feedback && (
              <p className={`form-feedback form-feedback--${feedback.type}`} role="status">
                {feedback.text}
              </p>
            )}

            <p className="disclaimer">
              <Scale size={13} aria-hidden="true" />
              {lang === 'bn'
                ? 'স্ক্রিনিং ফলাফল কর্মকর্তাদের পর্যালোচনার উদ্দেশ্যে তৈরি। কোনো স্বয়ংক্রিয় আইনি রায় নয়।'
                : 'Screening output for human review. Not an automated legal finding.'}
            </p>
          </form>
        </div>

        <footer className="drawer-foot">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              onClose();
              onOpenPlotTimeline(alert.plotId);
            }}
          >
            <History size={14} />
            <span>{t('btn_view_timeline')}</span>
          </button>
          <button type="button" className="btn btn-primary" disabled={isSubmitting} onClick={handleSave}>
            {isSubmitting ? <LoaderCircle size={14} className="spin" /> : <Save size={14} />}
            <span>{isSubmitting ? (lang === 'bn' ? 'সংরক্ষণ হচ্ছে...' : 'Recording') : (lang === 'bn' ? 'সিদ্ধান্ত সংরক্ষণ করুন' : 'Record decision')}</span>
          </button>
        </footer>
      </div>
    </div>
  );
}
