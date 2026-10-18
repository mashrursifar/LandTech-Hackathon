import React from 'react';
import { ShieldCheck, Inbox, Map, History, ScrollText, Fingerprint, BookOpen, X } from 'lucide-react';
import { SCENARIOS } from '../lib/constants';
import { useLanguage } from '../lib/i18n.jsx';

const NAV_ITEMS = [
  { id: 'dashboard', key: 'nav_dashboard', icon: Inbox },
  { id: 'registry', key: 'nav_registry', icon: Map },
  { id: 'timeline', key: 'nav_timeline', icon: History },
  { id: 'audit', key: 'nav_audit', icon: ScrollText },
  { id: 'verifier', key: 'nav_verifier', icon: Fingerprint },
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
  const { t } = useLanguage();

  const getScenarioLabel = (tag) => {
    switch (tag) {
      case 'Double-sale': return t('scenario_double_sale');
      case 'Clean transfer': return t('scenario_clean_transfer');
      case 'Cancelled deed': return t('scenario_cancelled_deed');
      case 'Seller conflict': return t('scenario_seller_conflict');
      case 'Mutation mismatch': return t('scenario_mutation_mismatch');
      case 'Duplicate deed': return t('scenario_duplicate_deed');
      case 'Broken chain': return t('scenario_broken_chain');
      default: return tag;
    }
  };

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
              <span className="brand-name">{t('brand_name')}</span>
              <span className="brand-tag">{t('brand_tag')}</span>
            </span>
          </button>
          <button type="button" className="icon-btn sidebar-close" onClick={onClose} aria-label="Close navigation">
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-section">
          <span className="eyebrow sidebar-label">{t('workspace')}</span>
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
                    <span>{t(item.key)}</span>
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
          <span className="eyebrow sidebar-label">{t('sample_scenarios')}</span>
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
                    <span className="scenario-tag">{getScenarioLabel(s.tag)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="sidebar-footer">
          <button type="button" className="guide-btn" onClick={onOpenGuide}>
            <BookOpen size={15} />
            <span>{t('demo_walkthrough')}</span>
          </button>
          <p className="sidebar-note">{t('hackathon_track')}</p>
        </div>
      </aside>
    </>
  );
}
