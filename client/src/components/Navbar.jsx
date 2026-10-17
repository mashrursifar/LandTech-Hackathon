import React from 'react';
import { Shield, MapPin, AlertTriangle, FileText, History, CheckCircle2, RotateCw, Database } from 'lucide-react';
import '../styles/Navbar.css';

export default function Navbar({ activeTab, setActiveTab, systemStatus, onRunDetection, onResetData, isRunningDetection }) {
  const navItems = [
    { id: 'dashboard', label: 'Screening Dashboard', icon: AlertTriangle },
    { id: 'registry', label: 'Cadastral Registry', icon: MapPin },
    { id: 'timeline', label: 'Plot Timeline', icon: History },
    { id: 'audit', label: 'Audit Trail', icon: FileText },
    { id: 'verifier', label: 'SHA-256 Verifier', icon: CheckCircle2 },
  ];

  return (
    <header className="plotguard-header">
      <div className="navbar-inner">
        {/* Brand Group */}
        <div 
          className="navbar-brand"
          onClick={() => setActiveTab('dashboard')}
          title="Return to Dashboard"
        >
          <div className="brand-icon">
            <Shield size={18} />
          </div>
          <div className="brand-text-group">
            <span className="brand-title">PLOTGUARD</span>
            <span className="badge badge-neutral brand-badge">P3 Prototype</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="navbar-menu">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Global Action Tools */}
        <div className="navbar-actions">
          <div className="db-status-pill" title="Backend & Database status">
            <Database size={12} color="var(--accent-emerald)" />
            <span>{systemStatus?.database || 'Ready'}</span>
          </div>

          <button 
            className="btn btn-outline action-btn-reset"
            onClick={onResetData}
            title="Reset dataset to seeded benchmark evaluation state"
          >
            <RotateCw size={13} />
            <span>Reset Demo</span>
          </button>

          <button 
            className="btn btn-primary action-btn-run"
            onClick={onRunDetection}
            disabled={isRunningDetection}
            title="Run detection rules R1-R5 across all parcels"
          >
            <Shield size={13} />
            <span>{isRunningDetection ? 'Screening...' : 'Run Rules'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
