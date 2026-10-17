import React from 'react';
import { X, Clock, Award } from 'lucide-react';
import '../styles/DemoScriptModal.css';

export default function DemoScriptModal({ onClose, onSelectPlot }) {
  const scriptSteps = [
    {
      time: '0:00 – 0:30',
      title: 'The Problem',
      description: 'Explain that conflicting deed, transfer, and mutation entries are difficult to spot manually across paper-heavy sub-registry offices and AC (Land) mutation records.',
      cue: 'Notice how registry records and mutation records historically exist in silos, creating loopholes for double-selling.'
    },
    {
      time: '0:30 – 1:05',
      title: 'Find a Plot',
      plotId: 'PLOT-1042',
      description: 'Open fictional parcel PLOT-1042 (Dhanmondi). Show its recorded owner (Rafiqul Islam S-01) and transaction history.',
      cue: 'Point out Deed 1 (sale to Buyer B-01 Anisur Rahman) followed by an approved Mutation in B-01’s name.'
    },
    {
      time: '1:05 – 1:50',
      title: 'Trigger an Alert',
      description: 'Run detection and demonstrate the Potential Double-Sale alert (R1), showing the two conflicting deed references (Deed A & Deed B) active concurrently.',
      cue: 'Emphasize that PlotGuard links the exact conflicting sample instruments instead of displaying an opaque statistical score.'
    },
    {
      time: '1:50 – 2:25',
      title: 'Inspect Evidence & Workflow',
      description: 'Open the alert, show side-by-side evidence cards, show the mutation record still lists Buyer B-01, and select "Under Review" (Hold for human review) with notes logged to the audit trail.',
      cue: 'Highlight the Human-in-the-Loop principle: the machine flags discrepancies; the authorized officer records the decision.'
    },
    {
      time: '2:25 – 3:00',
      title: 'Impact, Specificity & Limitations',
      plotId: 'PLOT-2001',
      description: 'Show PLOT-2001 (clean transfer) and PLOT-3005 (cancelled deed properly ignored). Explain that PlotGuard flags data inconsistencies rather than making definitive legal fraud judgments.',
      cue: 'Conclude with compliance, auditability, and zero false alarms on legitimate transfers.'
    }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="script-modal-dialog" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="script-modal-header">
          <div className="script-modal-title">
            <Award size={18} color="var(--brand-primary)" />
            <h2>Three-Minute Hackathon Demo Script & Pitch Guide</h2>
          </div>
          <button onClick={onClose} className="modal-close-btn" title="Close guide">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="script-modal-body">
          <div className="script-intro-text">
            Follow this chronological script during your presentation to judges for the <strong>LandTech Innovation Hackathon 2026</strong>:
          </div>

          <div className="script-steps-stack">
            {scriptSteps.map((step, idx) => (
              <div key={idx} className="script-step-card">
                <div className="script-step-header">
                  <div className="script-step-title-group">
                    <span className="badge badge-success font-mono" style={{ fontSize: '0.68rem' }}>
                      <Clock size={11} />
                      {step.time}
                    </span>
                    <span className="script-step-name">{step.title}</span>
                  </div>

                  {step.plotId && (
                    <button
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                      onClick={() => {
                        onSelectPlot(step.plotId);
                        onClose();
                      }}
                    >
                      <span>Jump to {step.plotId}</span>
                    </button>
                  )}
                </div>

                <div className="script-step-desc">{step.description}</div>

                <div className="script-cue-box">
                  💡 <strong>What to say:</strong> "{step.cue}"
                </div>
              </div>
            ))}
          </div>

          <div className="script-principle-box">
            <strong>Important Prototype Principle:</strong> Always clarify to judges that PlotGuard generates explainable screening alerts to assist authorized human officers, rather than making definitive automated legal findings.
          </div>
        </div>
      </div>
    </div>
  );
}
