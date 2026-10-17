import React, { useState, useEffect } from 'react';
import { 
  History, FileText, ArrowRightLeft, Building2, AlertTriangle, 
  ArrowLeft, Hash, ExternalLink, User 
} from 'lucide-react';
import '../styles/PlotTimelineView.css';

export default function PlotTimelineView({ 
  plotId, 
  onBack, 
  onInspectAlert, 
  onVerifyDeedHash,
  onSelectAnotherPlot,
  allPlots
}) {
  const [timelineData, setTimelineData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!plotId) return;
    setLoading(true);
    fetch(`/api/plots/${plotId}/timeline`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTimelineData(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching timeline:', err);
        setLoading(false);
      });
  }, [plotId]);

  if (loading) {
    return (
      <div className="timeline-view-container" style={{ textAlign: 'center', padding: '3rem 0' }}>
        <div className="status-dot dot-success" style={{ width: '16px', height: '16px', margin: '0 auto 1rem auto' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading chronological parcel timeline...</p>
      </div>
    );
  }

  if (!timelineData) {
    return (
      <div className="timeline-view-container" style={{ textAlign: 'center', padding: '3rem 0' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Plot '{plotId}' not found.</p>
        <button className="btn btn-outline" onClick={onBack} style={{ marginTop: '1rem' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const { plot, timeline, activeAlerts } = timelineData;

  return (
    <div className="timeline-view-container">
      {/* Top Navigation */}
      <div className="timeline-nav-toolbar">
        <button className="btn btn-outline btn-sm" onClick={onBack}>
          <ArrowLeft size={13} />
          <span>Back to Dashboard</span>
        </button>

        {/* Parcel Switcher */}
        <div className="plot-switcher-group">
          <span className="switcher-label">Switch Parcel:</span>
          <select 
            value={plotId} 
            onChange={e => onSelectAnotherPlot(e.target.value)}
            className="input switcher-select"
          >
            {allPlots.map(p => (
              <option key={p.plotId} value={p.plotId}>
                {p.plotId} ({p.mouza})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Parcel Summary Banner */}
      <div className="timeline-hero-card">
        <div className="hero-details-row">
          <div>
            <div className="hero-title-group">
              <span className="hero-plot-id">{plot.plotId}</span>
              <span className="badge badge-success">{plot.mouza}</span>
              <span className="badge badge-neutral">{plot.sampleArea}</span>
            </div>
            <div className="hero-cadastral-specs">
              Khatian: <strong>{plot.khatianNumber}</strong> | Dag No: <strong>{plot.dagNumber}</strong> | Sub-District: {plot.subDistrict}, {plot.district}
            </div>
          </div>

          {/* Recorded Owner */}
          <div className="hero-owner-pill">
            <div className="hero-owner-avatar">
              <User size={16} />
            </div>
            <div>
              <div className="hero-owner-role">Recorded Legal Owner</div>
              <div className="hero-owner-name">
                {plot.currentRecordedOwner?.name} ({plot.currentRecordedOwner?.id})
              </div>
            </div>
          </div>
        </div>

        {/* Active Inconsistency Notice */}
        {activeAlerts?.length > 0 && (
          <div className="hero-alert-banner">
            <div className="hero-alert-left">
              <AlertTriangle size={16} color="var(--color-high)" />
              <div>
                <span className="hero-alert-title">
                  {activeAlerts.length} Inconsistency Alert(s) Detected for this Parcel
                </span>
                <span className="hero-alert-tags">
                  [{activeAlerts.map(a => `${a.ruleId}`).join(', ')}]
                </span>
              </div>
            </div>

            <button 
              className="btn btn-danger btn-sm"
              onClick={() => onInspectAlert(activeAlerts[0])}
            >
              <span>Inspect Conflict Evidence</span>
              <ExternalLink size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Chronological Timeline Section */}
      <div className="timeline-header-row">
        <div className="timeline-section-title">
          <History size={16} color="var(--brand-primary)" />
          <span>Chronological Conveyance & Mutation Timeline</span>
        </div>
        <div className="timeline-count-badge">
          {timeline.length} Recorded Instruments (Oldest to Newest)
        </div>
      </div>

      {/* Visual Timeline Nodes */}
      <div className="timeline-track-container">
        <div className="timeline-vertical-line" />

        <div className="timeline-events-stack">
          {timeline.map((event) => {
            const isDeed = event.type === 'deed';
            const isTransfer = event.type === 'transfer';
            const isMutation = event.type === 'mutation';

            const isCancelled = ['Cancelled', 'Rejected'].includes(event.status);
            const isPending = ['Pending', 'Draft'].includes(event.status);

            const pinClass = isCancelled ? 'pin-cancelled' : isPending ? 'pin-warning' : 'pin-success';
            const cardAccentClass = isCancelled ? 'card-accent-cancelled' : isPending ? 'card-accent-warning' : 'card-accent-success';

            return (
              <div key={event.id} className="timeline-entry">
                {/* Node Icon Pin */}
                <div className={`timeline-node-pin ${pinClass}`}>
                  {isDeed && <FileText size={14} />}
                  {isTransfer && <ArrowRightLeft size={14} />}
                  {isMutation && <Building2 size={14} />}
                </div>

                {/* Event Card */}
                <div className={`timeline-event-card ${cardAccentClass}`}>
                  <div className="timeline-event-header">
                    <div>
                      <div className="timeline-meta-badges">
                        <span className="badge badge-neutral">
                          {event.date}
                        </span>
                        <span className="badge badge-neutral font-mono">
                          {event.type}
                        </span>
                        <span className={`badge ${isCancelled ? 'badge-high' : isPending ? 'badge-warning' : 'badge-success'}`}>
                          {event.status}
                        </span>
                      </div>
                      <div className="timeline-event-title">{event.title}</div>
                    </div>

                    {isDeed && event.documentHash && (
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => onVerifyDeedHash(event.refId)}
                        title="Open in Document Cryptographic Hash Verifier"
                      >
                        <Hash size={12} color="var(--brand-primary)" />
                        <span>Verify Hash</span>
                      </button>
                    )}
                  </div>

                  <div className="timeline-event-desc">{event.description}</div>

                  {event.office && (
                    <div className="timeline-meta-jurisdiction">
                      <span>Authority: </span>
                      <strong>{event.office}</strong>
                    </div>
                  )}

                  {event.documentHash && (
                    <div className="timeline-hash-row font-mono">
                      <span className="hash-label">SHA-256:</span>
                      <span className="hash-value">{event.documentHash}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
