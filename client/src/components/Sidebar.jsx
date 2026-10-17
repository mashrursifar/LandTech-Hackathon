import React from 'react';
import { ShieldCheck, Inbox, Map, History, ScrollText, Fingerprint, BookOpen, X } from 'lucide-react';
import { SCENARIOS } from '../lib/constants';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Alert queue', icon: Inbox },
  { id: 'registry', label: 'Parcel registry', icon: Map },
  { id: 'timeline', label: 'Plot timeline', icon: History },
  { id: 'audit', label: 'Audit trail', icon: ScrollText },
  { id: 'verifier', label: 'Deed verifier', icon: Fingerprint },
];

export default function Sidebar({
  activeTab,
  onNavigate,
  onSelectPlot,
  selectedPlotId,
  openCount,
  onOpenGuide,
  isOpen,
  onClose,
}) {
  return (
    <>
      <div className={`sidebar-scrim ${isOpen ? 'is-open' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside className={`sidebar ${isOpen ? 'is-open' : ''}`} aria-label="Primary">
        <div className="sidebar-brand">
          <button type="button" className="brand" onClick={() => onNavigate('dashboard')}>
            <span className="brand-mark">
              <ShieldCheck size={17} strokeWidth={2.2} />
            </span>
            <span className="brand-text">
              <span className="brand-name">PlotGuard</span>
              <span className="brand-tag">Land record screening</span>
            </span>
          </button>
          <button type="button" className="icon-btn sidebar-close" onClick={onClose} aria-label="Close navigation">
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-section">
          <span className="eyebrow sidebar-label">Workspace</span>
          <ul className="nav-list">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`nav-link ${isActive ? 'is-active' : ''}`}
                    onClick={() => onNavigate(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                    {item.id === 'dashboard' && openCount > 0 && (
                      <span className="nav-count">{openCount}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-section sidebar-section--grow">
          <span className="eyebrow sidebar-label">Sample scenarios</span>
          <ul className="scenario-list">
            {SCENARIOS.map(s => {
              const isActive = activeTab === 'timeline' && selectedPlotId === s.id;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    className={`scenario-link ${isActive ? 'is-active' : ''}`}
                    onClick={() => onSelectPlot(s.id)}
                  >
                    <span className={`tone-dot tone-dot--${s.tone}`} aria-hidden="true" />
                    <span className="mono scenario-id">{s.id}</span>
                    <span className="scenario-tag">{s.tag}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="sidebar-footer">
          <button type="button" className="guide-btn" onClick={onOpenGuide}>
            <BookOpen size={15} />
            <span>Demo walkthrough</span>
          </button>
          <p className="sidebar-note">LandTech Innovation Hackathon 2026 · Track P3</p>
        </div>
      </aside>
    </>
  );
}
