import React, { useState } from 'react';
import { Search, MapPin, ChevronRight } from 'lucide-react';

function healthOf(plot) {
  if (plot.highSeverityAlerts > 0) return { tone: 'high', label: 'High conflict' };
  if (plot.totalAlerts > 0) return { tone: 'review', label: 'Needs review' };
  return { tone: 'ok', label: 'Consistent' };
}

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
    <div className="page">
      <div className="toolbar">
        <label className="search-field">
          <span className="sr-only">Search parcels</span>
          <Search size={15} />
          <input
            type="search"
            className="input"
            placeholder="Search plot ID, mouza, khatian, dag, or owner"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </label>
        <span className="toolbar-count">
          <strong>{filteredPlots.length}</strong> of {plots.length} parcels
        </span>
      </div>

      <ul className="parcel-grid">
        {filteredPlots.map(plot => {
          const health = healthOf(plot);
          return (
            <li key={plot.plotId} className="card parcel">
              <div className="parcel-head">
                <span className="mono parcel-id">{plot.plotId}</span>
                <span className={`chip chip--${health.tone}`}>
                  <span className={`tone-dot tone-dot--${health.tone}`} aria-hidden="true" />
                  {health.label}
                </span>
              </div>

              <div>
                <h3 className="parcel-mouza">
                  <MapPin size={15} aria-hidden="true" />
                  {plot.mouza}
                </h3>
                <p className="parcel-loc">
                  {plot.subDistrict}, {plot.district} · {plot.landCategory}
                </p>
              </div>

              <dl className="parcel-specs">
                <div>
                  <dt>Khatian</dt>
                  <dd className="mono">{plot.khatianNumber}</dd>
                </div>
                <div>
                  <dt>Dag</dt>
                  <dd className="mono">{plot.dagNumber}</dd>
                </div>
                <div className="parcel-specs-wide">
                  <dt>Area</dt>
                  <dd>{plot.sampleArea}</dd>
                </div>
              </dl>

              <div className="parcel-owner">
                <span className="eyebrow">Recorded owner</span>
                <span className="parcel-owner-name">
                  {plot.currentRecordedOwner?.name}
                  <span className="mono parcel-owner-id">{plot.currentRecordedOwner?.id}</span>
                </span>
              </div>

              <div className="parcel-foot">
                <span className="parcel-alerts">
                  {plot.totalAlerts === 0 ? 'No alerts' : `${plot.totalAlerts} alert${plot.totalAlerts > 1 ? 's' : ''}`}
                </span>
                <button type="button" className="link-btn" onClick={() => onOpenPlotTimeline(plot.plotId)}>
                  View timeline
                  <ChevronRight size={14} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
