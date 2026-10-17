import React, { useState } from 'react';
import { Search, MapPin, User, FileText, ArrowRight, ShieldCheck, AlertTriangle, Layers, Calendar } from 'lucide-react';

export default function CadastralRegistryView({ plots, onOpenPlotTimeline }) {
  const [search, setSearch] = useState('');

  const filteredPlots = plots.filter(p => {
    const s = search.toLowerCase();
    return (
      p.plotId.toLowerCase().includes(s) ||
      p.mouza.toLowerCase().includes(s) ||
      p.currentRecordedOwner?.name?.toLowerCase().includes(s) ||
      p.khatianNumber.toLowerCase().includes(s) ||
      p.dagNumber.toLowerCase().includes(s)
    );
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
          Cadastral Land Registry (Sample Parcels)
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Fictional cadastral registry records modeled on Bangladesh Land Administration terminology (Khatian, Dag, Mouza, Sub-Registry deeds, and AC Land mutations).
        </p>
      </div>

      {/* Search Bar */}
      <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            className="input"
            placeholder="Search by Plot ID (e.g., PLOT-1042), Mouza (e.g., Dhanmondi), Khatian, Dag, or Owner..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>
        <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          Parcels in Register: <strong>{plots.length}</strong>
        </div>
      </div>

      {/* Grid of Plots */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '1.25rem'
      }}>
        {filteredPlots.map(plot => {
          const hasHigh = plot.highSeverityAlerts > 0;
          const hasAlerts = plot.totalAlerts > 0;

          return (
            <div 
              key={plot.plotId}
              className="glass-panel"
              style={{
                padding: '1.35rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderTop: hasHigh ? '3px solid #f43f5e' : hasAlerts ? '3px solid #f59e0b' : '3px solid #10b981',
                transition: 'transform 0.15s ease'
              }}
            >
              <div>
                {/* Top Badge Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge badge-subtle font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>
                    {plot.plotId}
                  </span>

                  <span className={`badge ${hasHigh ? 'badge-high' : hasAlerts ? 'badge-review' : 'badge-ok'}`}>
                    {hasHigh ? 'High Inconsistency' : hasAlerts ? 'Requires Review' : 'Consistent Record'}
                  </span>
                </div>

                {/* Mouza & District */}
                <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={16} color="var(--accent-emerald)" />
                  <span>{plot.mouza}</span>
                </h3>

                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.85rem' }}>
                  {plot.subDistrict}, {plot.district} • {plot.landCategory}
                </p>

                {/* Survey IDs (Khatian & Dag) */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '0.85rem'
                }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Khatian No.</div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#f8fafc' }}>{plot.khatianNumber}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Dag (Plot) No.</div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#f8fafc' }}>{plot.dagNumber}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Parcel Area</div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#38bdf8' }}>{plot.sampleArea}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Inconsistencies</div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: hasHigh ? '#f43f5e' : hasAlerts ? '#f59e0b' : '#10b981' }}>
                      {plot.totalAlerts} Flagged
                    </div>
                  </div>
                </div>

                {/* Recorded Owner */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-emerald)'
                  }}>
                    <User size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Recorded Legal Owner:</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>
                      {plot.currentRecordedOwner?.name}
                    </div>
                  </div>
                </div>

                {plot.notes && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '1rem' }}>
                    "{plot.notes}"
                  </p>
                )}
              </div>

              {/* Action Button */}
              <button
                className="btn btn-outline"
                onClick={() => onOpenPlotTimeline(plot.plotId)}
                style={{ width: '100%', justifyContent: 'space-between' }}
              >
                <span>View Parcel History Timeline</span>
                <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
