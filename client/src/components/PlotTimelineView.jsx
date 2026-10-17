import React, { useState, useEffect } from 'react';
import { FileText, ArrowRightLeft, Landmark, CircleCheck, ArrowLeft, Fingerprint, LoaderCircle, ChevronRight } from 'lucide-react';
import { severityTone } from '../lib/constants';

const TYPE_ICON = { deed: FileText, transfer: ArrowRightLeft, mutation: Landmark };

function eventTone(status) {
  if (['Cancelled', 'Rejected'].includes(status)) return 'high';
  if (['Pending', 'Draft'].includes(status)) return 'review';
  return 'ok';
}

export default function PlotTimelineView({ plotId, onBack, onInspectAlert, onVerifyDeedHash, onSelectAnotherPlot, allPlots }) {
  const [timelineData, setTimelineData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!plotId) return;
    setLoading(true);
    fetch(`/api/plots/${plotId}/timeline`)
      .then(res => res.json())
      .then(data => {
        setTimelineData(data.success ? data : null);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching timeline:', err);
        setLoading(false);
      });
  }, [plotId]);

  const toolbar = (
    <div className="toolbar">
      <button type="button" className="btn btn-ghost btn-sm" onClick={onBack}>
        <ArrowLeft size={14} />
        <span>Alert queue</span>
      </button>
      <label className="toolbar-switch">
        <span className="sr-only">Select parcel</span>
        <select className="input" value={plotId} onChange={e => onSelectAnotherPlot(e.target.value)}>
          {allPlots.map(p => (
            <option key={p.plotId} value={p.plotId}>
              {p.plotId} · {p.mouza}
            </option>
          ))}
        </select>
      </label>
    </div>
  );

  if (loading && !timelineData) {
    return (
      <div className="page">
        {toolbar}
        <div className="card empty-state">
          <LoaderCircle size={22} className="spin" />
          <span>Loading parcel timeline</span>
        </div>
      </div>
    );
  }

  if (!timelineData) {
    return (
      <div className="page">
        {toolbar}
        <div className="card empty-state">
          <strong>Plot {plotId} not found</strong>
        </div>
      </div>
    );
  }

  const { plot, timeline, activeAlerts } = timelineData;

  return (
    <div className="page">
      {toolbar}

      <section className="card plot-hero" aria-labelledby="plot-hero-title">
        <div>
          <span className="eyebrow">{plot.district} · {plot.subDistrict}</span>
          <h2 id="plot-hero-title" className="plot-hero-title">
            <span className="mono">{plot.plotId}</span>
            <span className="plot-hero-mouza">{plot.mouza}</span>
          </h2>
        </div>
        <dl className="plot-hero-specs">
          <div><dt>Khatian</dt><dd className="mono">{plot.khatianNumber}</dd></div>
          <div><dt>Dag</dt><dd className="mono">{plot.dagNumber}</dd></div>
          <div><dt>Area</dt><dd>{plot.sampleArea}</dd></div>
          <div>
            <dt>Recorded owner</dt>
            <dd>
              {plot.currentRecordedOwner?.name}{' '}
              <span className="mono muted">{plot.currentRecordedOwner?.id}</span>
            </dd>
          </div>
        </dl>
      </section>

      <div className="timeline-grid">
        <section className="card" aria-labelledby="timeline-title">
          <div className="card-header">
            <h2 id="timeline-title" className="card-title">Record history</h2>
            <span className="card-meta">{timeline.length} instruments, oldest first</span>
          </div>
          <ol className="timeline">
            {timeline.map(event => {
              const Icon = TYPE_ICON[event.type] || FileText;
              const tone = eventTone(event.status);
              return (
                <li key={event.id} className={`tl-item tl-item--${tone}`}>
                  <span className="tl-node" aria-hidden="true">
                    <Icon size={14} />
                  </span>
                  <div className="tl-body">
                    <div className="tl-head">
                      <time className="mono tl-date" dateTime={event.date}>{event.date}</time>
                      <span className="tl-type">{event.type}</span>
                      <span className={`chip chip--${tone}`}>{event.status}</span>
                    </div>
                    <h3 className="tl-title">{event.title}</h3>
                    <p className="tl-desc">{event.description}</p>
                    {event.office && <p className="tl-office">{event.office}</p>}
                    {event.documentHash && (
                      <div className="tl-hash">
                        <span className="mono tl-hash-value" title={event.documentHash}>
                          sha256:{event.documentHash}
                        </span>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => onVerifyDeedHash(event.refId)}>
                          <Fingerprint size={13} />
                          <span>Verify</span>
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <aside className="card timeline-alerts" aria-labelledby="plot-alerts-title">
          <div className="card-header">
            <h2 id="plot-alerts-title" className="card-title">Active alerts</h2>
            <span className="card-meta">{activeAlerts?.length || 0}</span>
          </div>
          {activeAlerts?.length ? (
            <ul className="mini-alerts">
              {activeAlerts.map(a => {
                const tone = severityTone(a.severity);
                return (
                  <li key={a.alertId}>
                    <button type="button" className={`mini-alert mini-alert--${tone}`} onClick={() => onInspectAlert(a)}>
                      <span className="rule-code">{a.ruleId}</span>
                      <span className="mini-alert-body">
                        <span className="mini-alert-title">{a.ruleTitle}</span>
                        <span className="mini-alert-meta">{a.severity} · {a.reviewStatus}</span>
                      </span>
                      <ChevronRight size={15} className="mini-alert-chev" />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="empty-state">
              <CircleCheck size={22} />
              <strong>No active alerts</strong>
              <span>Deed, transfer, and mutation records agree.</span>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
