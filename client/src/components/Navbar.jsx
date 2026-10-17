import React from 'react';
import { Shield, MapPin, AlertTriangle, FileText, History, CheckCircle2, RotateCw, Database } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, systemStatus, onRunDetection, onResetData, isRunningDetection }) {
  const navItems = [
    { id: 'dashboard', label: 'Screening Dashboard', icon: AlertTriangle },
    { id: 'registry', label: 'Cadastral Registry', icon: MapPin },
    { id: 'timeline', label: 'Plot History Timeline', icon: History },
    { id: 'audit', label: 'Audit Trail', icon: FileText },
    { id: 'verifier', label: 'Document Integrity (SHA-256)', icon: CheckCircle2 },
  ];

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Top Banner */}
      <div style={{
        padding: '0.4rem 1.5rem',
        background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
        borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.78rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span className="badge badge-ok" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
            LandTech Hackathon 2026
          </span>
          <span style={{ color: 'var(--text-muted)' }}>
            Challenge Track: <strong style={{ color: 'var(--text-main)' }}>Digital Land Records, Verification & Digitization</strong> | Problem P3
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
            <Database size={13} style={{ color: 'var(--accent-emerald)' }} />
            <span>{systemStatus?.database || 'Connecting...'}</span>
          </div>
          <span style={{ color: 'var(--border-medium)' }}>•</span>
          <span style={{ color: '#94a3b8' }}>Prototype Principle: <em style={{ color: '#fcd34d' }}>Explainable Alerts for Human Review</em></span>
        </div>
      </div>

      {/* Main Navbar */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        flexWrap: 'wrap'
      }}>
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
          }}>
            <Shield size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff' }}>
                PLOTGUARD
              </span>
              <span className="badge badge-high" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                Rule-Based Engine
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Land Fraud & Ownership Inconsistency Detection
            </p>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: isActive ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
                  background: isActive ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                  color: isActive ? '#34d399' : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  if (!isActive) e.currentTarget.style.color = '#ffffff';
                  if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                }}
                onMouseLeave={e => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-muted)';
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Global Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button 
            className="btn btn-outline btn-sm"
            onClick={onResetData}
            title="Reset dataset to seeded evaluation benchmark"
            style={{ fontSize: '0.75rem' }}
          >
            <RotateCw size={13} />
            <span>Reset Demo Data</span>
          </button>
          <button 
            className="btn btn-primary btn-sm"
            onClick={onRunDetection}
            disabled={isRunningDetection}
            style={{ fontSize: '0.75rem' }}
          >
            <Shield size={13} />
            <span>{isRunningDetection ? 'Screening...' : 'Run Detection Engine'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
