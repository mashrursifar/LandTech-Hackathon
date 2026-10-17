import React, { useState, useEffect } from 'react';
import { 
  History, FileText, ArrowRightLeft, Building2, AlertTriangle, 
  CheckCircle, ArrowLeft, Shield, Hash, ExternalLink, User 
} from 'lucide-react';

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
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '3rem', textAlign: 'center' }}>
        <div className="pulse-dot pulse-ok" style={{ width: '20px', height: '20px', margin: '0 auto 1rem auto' }} />
        <p style={{ color: 'var(--text-muted)' }}>Loading chronological parcel timeline...</p>
      </div>
    );
  }

  if (!timelineData) {
    return (
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Plot '{plotId}' not found.</p>
        <button className="btn btn-outline" onClick={onBack} style={{ marginTop: '1rem' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const { plot, timeline, activeAlerts } = timelineData;

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Top Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button className="btn btn-outline btn-sm" onClick={onBack}>
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </button>

        {/* Parcel Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Switch Parcel:</span>
          <select 
            value={plotId} 
            onChange={e => onSelectAnotherPlot(e.target.value)}
            className="input"
            style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
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
      <div className="glass-panel" style={{
        padding: '1.5rem',
        marginBottom: '1.5rem',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.7) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
              <h1 style={{ fontSize: '1.6rem', color: '#ffffff', margin: 0 }}>
                {plot.plotId}
              </h1>
              <span className="badge badge-ok">
                {plot.mouza}
              </span>
              <span className="badge badge-subtle">
                {plot.sampleArea}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Khatian: <strong style={{ color: '#fff' }}>{plot.khatianNumber}</strong> | Dag No: <strong style={{ color: '#fff' }}>{plot.dagNumber}</strong> | Sub-District: {plot.subDistrict}, {plot.district}
            </p>
          </div>

          {/* Recorded Owner pill */}
          <div style={{
            padding: '0.65rem 1rem',
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-emerald)'
            }}>
              <User size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Official Recorded Title Owner
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                {plot.currentRecordedOwner?.name} ({plot.currentRecordedOwner?.id})
              </div>
            </div>
          </div>
        </div>

        {/* Active Inconsistency Notice */}
        {activeAlerts?.length > 0 && (
          <div style={{
            marginTop: '1.25rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <AlertTriangle size={18} color="#f43f5e" />
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fda4af' }}>
                  {activeAlerts.length} Inconsistency Alert(s) Detected for this Parcel
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                  {activeAlerts.map(a => `${a.ruleId} (${a.severity})`).join(', ')}
                </span>
              </div>
            </div>

            <button 
              className="btn btn-danger btn-sm"
              onClick={() => onInspectAlert(activeAlerts[0])}
            >
              <span>Inspect Conflict Evidence</span>
              <ExternalLink size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Chronological Timeline Section */}
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={18} color="var(--accent-emerald)" />
          <span>Chronological Conveyance & Mutation Timeline</span>
        </h2>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
          {timeline.length} Recorded Instruments (Oldest to Newest)
        </span>
      </div>

      {/* Visual Timeline Nodes */}
      <div style={{ position: 'relative', paddingLeft: '2.5rem', marginTop: '1.5rem' }}>
        {/* Continuous vertical timeline guide line */}
        <div style={{
          position: 'absolute',
          left: '18px',
          top: '12px',
          bottom: '12px',
          width: '2px',
          background: 'linear-gradient(180deg, #10b981 0%, rgba(255, 255, 255, 0.15) 100%)'
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {timeline.map((event, idx) => {
            const isDeed = event.type === 'deed';
            const isTransfer = event.type === 'transfer';
            const isMutation = event.type === 'mutation';

            const isCancelled = ['Cancelled', 'Rejected'].includes(event.status);
            const isPending = ['Pending', 'Draft'].includes(event.status);

            const iconBg = isCancelled 
              ? 'rgba(244, 63, 94, 0.2)' 
              : isPending 
              ? 'rgba(245, 158, 11, 0.2)' 
              : 'rgba(16, 185, 129, 0.2)';

            const iconColor = isCancelled ? '#f43f5e' : isPending ? '#fbbf24' : '#10b981';

            return (
              <div key={event.id} style={{ position: 'relative' }}>
                {/* Timeline Node Icon Circle */}
                <div style={{
                  position: 'absolute',
                  left: '-2.5rem',
                  top: '0.5rem',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#0f172a',
                  border: `2px solid ${iconColor}`,
                  boxShadow: `0 0 12px ${iconColor}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2
                }}>
                  {isDeed && <FileText size={16} color={iconColor} />}
                  {isTransfer && <ArrowRightLeft size={16} color={iconColor} />}
                  {isMutation && <Building2 size={16} color={iconColor} />}
                </div>

                {/* Event Card */}
                <div className="glass-panel" style={{
                  padding: '1.25rem',
                  borderLeft: `3px solid ${iconColor}`,
                  background: isCancelled ? 'rgba(244, 63, 94, 0.04)' : 'rgba(17, 24, 39, 0.8)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                        <span className="badge badge-subtle" style={{ fontSize: '0.72rem' }}>
                          {event.date}
                        </span>
                        <span className="badge badge-subtle font-mono" style={{ textTransform: 'uppercase', fontSize: '0.72rem' }}>
                          {event.type}
                        </span>
                        <span className={`badge ${isCancelled ? 'badge-high' : isPending ? 'badge-review' : 'badge-ok'}`}>
                          {event.status}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.05rem', color: '#ffffff', margin: 0 }}>
                        {event.title}
                      </h3>
                    </div>

                    {isDeed && event.documentHash && (
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => onVerifyDeedHash(event.refId)}
                        style={{ fontSize: '0.72rem' }}
                      >
                        <Hash size={12} color="var(--accent-emerald)" />
                        <span>Verify Hash Integrity</span>
                      </button>
                    )}
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.75rem', lineHeight: '1.45' }}>
                    {event.description}
                  </p>

                  {/* Office / Metadata pill */}
                  {event.office && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span>Jurisdiction Authority:</span>
                      <strong style={{ color: 'var(--text-muted)' }}>{event.office}</strong>
                    </div>
                  )}

                  {/* Cryptographic hash snippet */}
                  {event.documentHash && (
                    <div style={{
                      marginTop: '0.65rem',
                      padding: '0.45rem 0.65rem',
                      background: 'rgba(0, 0, 0, 0.35)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.72rem',
                      color: 'var(--text-dim)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      overflowX: 'auto'
                    }}>
                      <strong style={{ color: 'var(--accent-emerald)' }}>SHA-256:</strong>
                      <span className="font-mono" style={{ color: '#94a3b8' }}>{event.documentHash}</span>
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
