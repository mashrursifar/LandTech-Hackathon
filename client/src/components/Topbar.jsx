import React from 'react';
import { Menu, Sun, Moon, RotateCcw, Play, LoaderCircle } from 'lucide-react';

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
        <span className="status-pill" title={systemStatus?.database || 'Connecting'}>
          <span className={`tone-dot ${isOnline ? 'tone-dot--ok' : systemStatus ? 'tone-dot--high' : ''}`} aria-hidden="true" />
          <span className="status-pill-text">
            {systemStatus ? (isOnline ? 'Engine online' : 'Offline') : 'Connecting'}
          </span>
        </span>

        <button
          type="button"
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <button type="button" className="btn btn-secondary topbar-reset" onClick={onResetData}>
          <RotateCcw size={14} />
          <span>Reset data</span>
        </button>

        <button type="button" className="btn btn-primary" onClick={onRunDetection} disabled={isRunningDetection}>
          {isRunningDetection ? <LoaderCircle size={14} className="spin" /> : <Play size={14} />}
          <span>{isRunningDetection ? 'Running rules' : 'Run rules R1–R5'}</span>
        </button>
      </div>
    </header>
  );
}
