import React from 'react';
import { PlayCircle, ShieldCheck, AlertCircle, FileCheck, Info, Sparkles } from 'lucide-react';

export default function DemoScenarioBar({ onSelectPlot, currentSelectedPlotId, onOpenDemoScriptModal }) {
  const scenarios = [
    {
      id: 'PLOT-1042',
      badge: 'DEMO STAR',
      badgeClass: 'badge-high',
      title: 'PLOT-1042: Double-Selling Conflict',
      tag: 'R1 + R3 Lag',
      desc: 'Active deed to B-01, then overlapping active deed to B-02; Mutation still lists B-01.',
      icon: AlertCircle
    },
    {
      id: 'PLOT-2001',
      badge: 'NORMAL',
      badgeClass: 'badge-ok',
      title: 'PLOT-2001: Legitimate Clean Transfer',
      tag: '0 Alerts',
      desc: 'Conveyance to Dr. Shahana Parveen with synchronized mutation; Zero false positives.',
      icon: ShieldCheck
    },
    {
      id: 'PLOT-3005',
      badge: 'CANCELLED',
      badgeClass: 'badge-ok',
      title: 'PLOT-3005: Deed Cancellation Handled',
      tag: 'Smart Disregard',
      desc: 'Defective draft deed cancelled prior to second buyer; System avoids false alarm.',
      icon: FileCheck
    },
    {
      id: 'PLOT-4010',
      badge: 'CONFLICT',
      badgeClass: 'badge-high',
      title: 'PLOT-4010: Seller/Owner Conflict',
      tag: 'R2 Trigger',
      desc: 'Seller S-99 attempts conveyance without documented title or ownership chain.',
      icon: AlertCircle
    },
    {
      id: 'PLOT-5020',
      badge: 'MISMATCH',
      badgeClass: 'badge-review',
      title: 'PLOT-5020: Registry vs Mutation',
      tag: 'R3 Trigger',
      desc: 'Deed registered to Farzana Begum, but Mutation ledger awards parcel to Enamul Haque.',
      icon: AlertCircle
    },
    {
      id: 'PLOT-6030',
      badge: 'DUPLICATE',
      badgeClass: 'badge-high',
      title: 'PLOT-6030: Reused Deed Ref',
      tag: 'R4 Trigger',
      desc: 'Deed volume DEED-DUP-9901 duplicated across multiple transaction instruments.',
      icon: AlertCircle
    },
    {
      id: 'PLOT-7040',
      badge: 'SEQUENCE',
      badgeClass: 'badge-review',
      title: 'PLOT-7040: Broken Dependency',
      tag: 'R5 Trigger',
      desc: 'Derivative sale depends on voided/cancelled parent transfer instrument.',
      icon: AlertCircle
    }
  ];

  return (
    <div style={{
      maxWidth: '1440px',
      margin: '1rem auto 0 auto',
      padding: '0 1.5rem'
    }}>
      <div className="glass-panel" style={{
        padding: '0.85rem 1.25rem',
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(30, 41, 59, 0.6) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399'
            }}>
              <Sparkles size={16} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                HACKATHON DEMO PRESETS & TEST SCENARIOS
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.6rem' }}>
                Click any scenario to immediately load parcel timeline, compare evidence, and test screening rules.
              </span>
            </div>
          </div>

          <button
            onClick={onOpenDemoScriptModal}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.75rem', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#6ee7b7' }}
          >
            <Info size={13} />
            <span>3-Minute Demo Script Guide</span>
          </button>
        </div>

        {/* Horizontal Scenario Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.35rem'
        }}>
          {scenarios.map(s => {
            const isSelected = currentSelectedPlotId === s.id;
            return (
              <div
                key={s.id}
                onClick={() => onSelectPlot(s.id)}
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: isSelected ? 'rgba(16, 185, 129, 0.22)' : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={e => {
                  if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                <span className={`badge ${s.badgeClass}`} style={{ fontSize: '0.62rem', padding: '0.1rem 0.35rem' }}>
                  {s.badge}
                </span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isSelected ? '#34d399' : '#f8fafc' }}>
                      {s.id}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                      [{s.tag}]
                    </span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {s.title.split(':')[1]?.trim() || s.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
