import React, { useState } from 'react';
import { Search, MapPin, ChevronRight } from 'lucide-react';
import { useLanguage } from '../lib/i18n.jsx';

export default function CadastralRegistryView({ plots, onOpenPlotTimeline }) {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState('');

  const healthOf = (plot) => {
    if (plot.highSeverityAlerts > 0) return { tone: 'high', label: t('health_high_conflict') };
    if (plot.totalAlerts > 0) return { tone: 'review', label: t('health_needs_review') };
    return { tone: 'ok', label: t('health_consistent') };
  };

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
          <span className="sr-only">{t('search_parcels_placeholder')}</span>
          <Search size={15} />
          <input
            type="search"
            className="input"
            placeholder={t('search_parcels_placeholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </label>
        <span className="toolbar-count">
          {t('parcels_count', { filtered: filteredPlots.length, total: plots.length })}
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
                  <dt>{t('label_khatian')}</dt>
                  <dd className="mono">{plot.khatianNumber}</dd>
                </div>
                <div>
                  <dt>{t('label_dag')}</dt>
                  <dd className="mono">{plot.dagNumber}</dd>
                </div>
                <div className="parcel-specs-wide">
                  <dt>{t('label_area')}</dt>
                  <dd>{plot.sampleArea}</dd>
                </div>
              </dl>

              <div className="parcel-owner">
                <span className="eyebrow">{t('label_owner')}</span>
                <span className="parcel-owner-name">
                  {plot.currentRecordedOwner?.name}
                  <span className="mono parcel-owner-id">{plot.currentRecordedOwner?.id}</span>
                </span>
              </div>

              <div className="parcel-foot">
                <span className="parcel-alerts">
                  {plot.totalAlerts === 0
                    ? (lang === 'bn' ? 'কোনো সতর্কতা নেই' : 'No alerts')
                    : `${plot.totalAlerts} ${lang === 'bn' ? 'টি সতর্কতা' : `alert${plot.totalAlerts > 1 ? 's' : ''}`}`}
                </span>
                <button type="button" className="link-btn" onClick={() => onOpenPlotTimeline(plot.plotId)}>
                  {t('btn_view_timeline')}
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
