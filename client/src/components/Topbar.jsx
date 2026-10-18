import React from 'react';
import { Menu, Sun, Moon, RotateCcw, Play, LoaderCircle } from 'lucide-react';
import { useLanguage } from '../lib/i18n.jsx';

export default function Topbar({
  title,
  subtitle,
  systemStatus,
  theme,
  onToggleTheme,
  onRunDetection,
  onResetData,
  isRunningDetection,
  onOpenMenu,
}) {
  const { lang, toggleLang, t } = useLanguage();
  const isOnline = systemStatus?.status === 'ok';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button type="button" className="icon-btn topbar-menu" onClick={onOpenMenu} aria-label="Open navigation">
          <Menu size={18} />
        </button>
        <div className="topbar-titles">
          <h1 className="topbar-title">{title}</h1>
          <p className="topbar-subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="topbar-actions">
        <span className="status-pill" title={systemStatus?.database || t('connecting')}>
          <span className={`tone-dot ${isOnline ? 'tone-dot--ok' : systemStatus ? 'tone-dot--high' : ''}`} aria-hidden="true" />
          <span className="status-pill-text">
            {systemStatus ? (isOnline ? t('engine_online') : t('engine_offline')) : t('connecting')}
          </span>
        </span>

        <button
          type="button"
          className="lang-toggle-btn"
          onClick={toggleLang}
          title={t('lang_toggle_title')}
          aria-label={t('lang_toggle_title')}
        >
          <span className={`lang-badge ${lang === 'en' ? 'is-active' : ''}`}>EN</span>
          <span className="lang-sep">/</span>
          <span className={`lang-badge ${lang === 'bn' ? 'is-active' : ''}`}>বাং</span>
        </button>

        <button
          type="button"
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? t('theme_to_light') : t('theme_to_dark')}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <button type="button" className="btn btn-secondary topbar-reset" onClick={onResetData}>
          <RotateCcw size={14} />
          <span>{t('reset_data')}</span>
        </button>

        <button type="button" className="btn btn-primary" onClick={onRunDetection} disabled={isRunningDetection}>
          {isRunningDetection ? <LoaderCircle size={14} className="spin" /> : <Play size={14} />}
          <span>{isRunningDetection ? t('running_rules') : t('run_rules')}</span>
        </button>
      </div>
    </header>
  );
}
