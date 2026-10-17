import React, { useEffect } from 'react';
import { X, ChevronRight } from 'lucide-react';

const STEPS = [
  {
    time: '0:00',
    title: 'The problem',
    description: 'Conflicting deed, transfer, and mutation entries are hard to spot manually across paper-heavy sub-registry offices and AC (Land) records.',
    cue: 'Registry and mutation records exist in silos, which creates loopholes for double-selling.',
  },
  {
    time: '0:30',
    title: 'Find a plot',
    plotId: 'PLOT-1042',
    description: 'Open PLOT-1042 (Dhanmondi). Show the recorded owner, Rafiqul Islam (S-01), and its transaction history.',
    cue: 'Deed A sells to B-01, followed by an approved mutation in B-01’s name.',
  },
  {
    time: '1:05',
    title: 'Trigger an alert',
    description: 'Run the rules and show the R1 double-sale alert linking two concurrently active deeds.',
    cue: 'PlotGuard links the exact conflicting instruments instead of an opaque score.',
  },
  {
    time: '1:50',
    title: 'Inspect evidence',
    description: 'Open the alert, walk through linked evidence, mark it Under review, and add notes that land in the audit trail.',
    cue: 'The machine flags discrepancies; the authorized officer records the decision.',
  },
  {
    time: '2:25',
    title: 'Specificity and limits',
    plotId: 'PLOT-2001',
    description: 'Show PLOT-2001 (clean) and PLOT-3005 (cancelled deed correctly ignored). PlotGuard flags inconsistencies, not legal fraud.',
    cue: 'Auditable, explainable, and no false alarms on legitimate transfers.',
  },
];

export default function DemoScriptModal({ onClose, onSelectPlot }) {
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="overlay overlay--center" onClick={onClose}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="guide-title" onClick={e => e.stopPropagation()}>
        <header className="drawer-head">
          <div>
            <h2 id="guide-title" className="card-title">Three-minute demo walkthrough</h2>
            <p className="card-meta">LandTech Innovation Hackathon 2026</p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close walkthrough">
            <X size={18} />
          </button>
        </header>

        <ol className="guide-steps">
          {STEPS.map((step, i) => (
            <li key={step.title} className="guide-step">
              <span className="guide-num mono">{String(i + 1).padStart(2, '0')}</span>
              <div className="guide-body">
                <div className="guide-head">
                  <h3 className="guide-title">{step.title}</h3>
                  <span className="mono muted guide-time">{step.time}</span>
                </div>
                <p className="guide-desc">{step.description}</p>
                <p className="guide-cue">{`“${step.cue}”`}</p>
                {step.plotId && (
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => {
                      onSelectPlot(step.plotId);
                      onClose();
                    }}
                  >
                    Open {step.plotId}
                    <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
