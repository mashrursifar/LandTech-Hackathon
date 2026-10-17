import React from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';
import '../styles/DemoScenarioBar.css';

export default function DemoScenarioBar({ onSelectPlot, currentSelectedPlotId, onOpenDemoScriptModal }) {
  const scenarios = [
    { id: 'PLOT-1042', badgeClass: 'badge-high', label: 'PLOT-1042', tag: 'Double-Sale (R1)' },
    { id: 'PLOT-2001', badgeClass: 'badge-success', label: 'PLOT-2001', tag: 'Legitimate (0)' },
    { id: 'PLOT-3005', badgeClass: 'badge-success', label: 'PLOT-3005', tag: 'Cancelled Deed' },
    { id: 'PLOT-4010', badgeClass: 'badge-high', label: 'PLOT-4010', tag: 'Seller Conflict (R2)' },
    { id: 'PLOT-5020', badgeClass: 'badge-warning', label: 'PLOT-5020', tag: 'Mutation Mismatch (R3)' },
    { id: 'PLOT-6030', badgeClass: 'badge-high', label: 'PLOT-6030', tag: 'Duplicate Deed (R4)' },
    { id: 'PLOT-7040', badgeClass: 'badge-warning', label: 'PLOT-7040', tag: 'Broken Chain (R5)' },
  ];

  return (
    <div className="scenario-bar-wrapper">
      <div className="scenario-bar-panel">
        <div className="scenario-bar-header">
          <Sparkles size={14} color="var(--brand-primary)" />
          <span className="scenario-header-label">Quick Scenarios:</span>
        </div>

        <div className="scenario-chips-scroll">
          {scenarios.map(s => {
            const isSelected = currentSelectedPlotId === s.id;
            return (
              <div
                key={s.id}
                onClick={() => onSelectPlot(s.id)}
                className={`scenario-chip ${isSelected ? 'selected' : ''}`}
                title={`Jump to ${s.id}: ${s.tag}`}
              >
                <span className={`badge ${s.badgeClass}`} style={{ fontSize: '0.62rem', padding: '0.05rem 0.35rem' }}>
                  {s.id.split('-')[1]}
                </span>
                <span className="chip-plot-id">{s.label}</span>
                <span className="chip-tag">• {s.tag}</span>
              </div>
            );
          })}
        </div>

        <button
          onClick={onOpenDemoScriptModal}
          className="btn btn-outline script-guide-btn"
          title="Open Hackathon 3-minute pitch walkthrough"
        >
          <HelpCircle size={13} />
          <span>Demo Pitch Guide</span>
        </button>
      </div>
    </div>
  );
}
