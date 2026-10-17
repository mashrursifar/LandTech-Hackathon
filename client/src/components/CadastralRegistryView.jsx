import React, { useState } from 'react';
import { Search, MapPin, User, ArrowRight } from 'lucide-react';
import '../styles/CadastralRegistryView.css';

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
    <div className="registry-container">
      {/* Header */}
      <div className="registry-header">
        <h1>Cadastral Land Registry (Sample Parcels)</h1>
        <p className="registry-subtitle">
          Fictional cadastral registry records modeled on Bangladesh Land Administration terminology (Khatian, Dag, Mouza, Sub-Registry deeds, and AC Land mutations).
        </p>
      </div>

      {/* Search Bar */}
      <div className="registry-search-bar">
        <div className="registry-search-wrapper">
          <Search size={15} className="registry-search-icon" />
          <input
            type="text"
            className="input registry-search-input"
            placeholder="Search by Plot ID (e.g., PLOT-1042), Mouza (e.g., Dhanmondi), Khatian, Dag, or Owner..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="registry-count-label">
          Parcels in Register: <strong>{plots.length}</strong>
        </div>
      </div>

      {/* Grid of Plots */}
      <div className="registry-grid">
        {filteredPlots.map(plot => {
          const hasHigh = plot.highSeverityAlerts > 0;
          const hasAlerts = plot.totalAlerts > 0;

          const borderClass = hasHigh ? 'card-border-high' : hasAlerts ? 'card-border-warning' : 'card-border-success';

          return (
            <div 
              key={plot.plotId}
              className={`parcel-card ${borderClass}`}
            >
              <div>
                {/* Top Badge Row */}
                <div className="parcel-top-row">
                  <span className="badge badge-neutral font-mono">
                    {plot.plotId}
                  </span>

                  <span className={`badge ${hasHigh ? 'badge-high' : hasAlerts ? 'badge-warning' : 'badge-success'}`}>
                    {hasHigh ? 'High Conflict' : hasAlerts ? 'Review Needed' : 'Consistent'}
                  </span>
                </div>

                {/* Mouza & District */}
                <div className="parcel-mouza-title">
                  <MapPin size={15} color="var(--brand-primary)" />
                  <span>{plot.mouza}</span>
                </div>

                <div className="parcel-sublocation">
                  {plot.subDistrict}, {plot.district} • {plot.landCategory}
                </div>

                {/* Cadastral Meta Grid */}
                <div className="parcel-cadastral-meta-grid">
                  <div>
                    <div className="cadastral-cell-label">Khatian No.</div>
                    <div className="cadastral-cell-val">{plot.khatianNumber}</div>
                  </div>
                  <div>
                    <div className="cadastral-cell-label">Dag (Plot) No.</div>
                    <div className="cadastral-cell-val">{plot.dagNumber}</div>
                  </div>
                  <div>
                    <div className="cadastral-cell-label">Parcel Area</div>
                    <div className="cadastral-cell-val" style={{ color: 'var(--brand-primary)' }}>{plot.sampleArea}</div>
                  </div>
                  <div>
                    <div className="cadastral-cell-label">Inconsistencies</div>
                    <div className="cadastral-cell-val" style={{ color: hasHigh ? 'var(--color-high)' : hasAlerts ? 'var(--color-warning)' : 'var(--color-success)' }}>
                      {plot.totalAlerts} Flagged
                    </div>
                  </div>
                </div>

                {/* Recorded Owner */}
                <div className="parcel-owner-group">
                  <div className="owner-avatar-circle">
                    <User size={15} />
                  </div>
                  <div className="owner-info-text">
                    <div className="owner-role-label">Recorded Legal Owner:</div>
                    <div className="owner-fullname">
                      {plot.currentRecordedOwner?.name}
                    </div>
                  </div>
                </div>

                {plot.notes && (
                  <div className="parcel-note-text">
                    "{plot.notes}"
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                className="btn btn-outline parcel-action-btn"
                onClick={() => onOpenPlotTimeline(plot.plotId)}
              >
                <span>View Parcel Timeline</span>
                <ArrowRight size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
