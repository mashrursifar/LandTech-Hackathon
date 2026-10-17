import React from 'react';
import { X, Clock, CheckCircle, Shield, Award, HelpCircle } from 'lucide-react';

export default function DemoScriptModal({ onClose, onSelectPlot }) {
  const scriptSteps = [
    {
      time: '0:00 – 0:30',
      title: 'The Problem',
      action: 'Set the context',
      description: 'Explain that conflicting deed, transfer, and mutation entries are difficult to spot manually across paper-heavy sub-registry offices and AC (Land) mutation records.',
      cue: 'Notice how registry records and mutation records historically exist in silos, creating loopholes for double-selling.'
    },
    {
      time: '0:30 – 1:05',
      title: 'Find a Plot',
      action: 'Click PLOT-1042',
      plotId: 'PLOT-1042',
      description: 'Open fictional parcel PLOT-1042 (Dhanmondi). Show its recorded owner (Rafiqul Islam S-01) and transaction history.',
      cue: 'Point out Deed 1 (sale to Buyer B-01 Anisur Rahman) followed by an approved Mutation in B-01’s name.'
    },
    {
      time: '1:05 – 1:50',
      title: 'Trigger an Alert',
      action: 'Run Detection Engine',
      description: 'Run detection and demonstrate the Potential Double-Sale alert (R1), showing the two conflicting deed references (Deed A & Deed B) active concurrently.',
      cue: 'Emphasize that PlotGuard links the exact conflicting sample instruments instead of displaying an opaque statistical score.'
    },
    {
      time: '1:50 – 2:25',
      title: 'Inspect Evidence & Workflow',
      action: 'Click "Inspect Evidence"',
      description: 'Open the alert, show side-by-side evidence cards, show the mutation record still lists Buyer B-01, and select "Under Review" (Hold for human review) with notes logged to the audit trail.',
      cue: 'Highlight the Human-in-the-Loop principle: the machine flags discrepancies; the authorized officer records the decision.'
    },
    {
      time: '2:25 – 3:00',
      title: 'Impact, Specificity & Limitations',
      action: 'Show PLOT-2001 and PLOT-3005',
      plotId: 'PLOT-2001',
      description: 'Show PLOT-2001 (clean transfer) and PLOT-3005 (cancelled deed properly ignored). Explain that PlotGuard flags data inconsistencies rather than making definitive legal fraud judgments.',
      cue: 'Conclude with compliance, auditability, and zero false alarms on legitimate transfers.'
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: '780px' }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.95)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Award size={20} color="var(--accent-emerald)" />
            <h2 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0 }}>
              Three-Minute Hackathon Demo Script & Pitch Guide
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Follow this chronological script during your presentation to judges for the <strong>LandTech Innovation Hackathon 2026</strong>:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {scriptSteps.map((step, idx) => (
              <div 
                key={idx}
                style={{
                  padding: '1rem',
                  background: 'rgba(15, 23, 42, 0.7)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-ok font-mono" style={{ fontSize: '0.72rem' }}>
                      <Clock size={12} />
                      {step.time}
                    </span>
                    <strong style={{ fontSize: '0.95rem', color: '#ffffff' }}>
                      {step.title}
                    </strong>
                  </div>

                  {step.plotId && (
                    <button
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.72rem' }}
                      onClick={() => {
                        onSelectPlot(step.plotId);
                        onClose();
                      }}
                    >
                      <span>Jump to {step.plotId}</span>
                    </button>
                  )}
                </div>

                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0 }}>
                  {step.description}
                </p>

                <div style={{
                  marginTop: '0.25rem',
                  padding: '0.4rem 0.65rem',
                  background: 'rgba(16, 185, 129, 0.08)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  color: '#6ee7b7'
                }}>
                  💡 <strong>What to say:</strong> "{step.cue}"
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '0.5rem',
            padding: '0.85rem',
            background: 'rgba(244, 63, 94, 0.08)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.78rem',
            color: '#fda4af'
          }}>
            <strong>Important Prototype Principle:</strong> Always clarify to judges that PlotGuard generates explainable screening alerts to assist authorized human officers, rather than making definitive automated legal findings.
          </div>
        </div>
      </div>
    </div>
  );
}
