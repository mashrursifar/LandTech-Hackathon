import React, { useState } from 'react';
import { CircleCheck, OctagonAlert, Fingerprint, LoaderCircle, Pencil } from 'lucide-react';

const SAMPLE_DEEDS = [
  {
    ref: 'DEED-2026-0042-A',
    note: 'PLOT-1042 · S-01 to B-01',
    text: 'SUB-REGISTRY DHANMONDI: Fictional Deed 2026-0042-A between Seller Rafiqul Islam (S-01) and Buyer Anisur Rahman (B-01) for Plot PLOT-1042. Consideration BDT 14,500,000.',
  },
  {
    ref: 'DEED-2026-0042-B',
    note: 'PLOT-1042 · S-01 to B-02, conflicting',
    text: 'SUB-REGISTRY DHANMONDI: Fictional Deed 2026-0042-B between Seller Rafiqul Islam (S-01) and Buyer Kamal Hossain (B-02) for Plot PLOT-1042. Consideration BDT 15,200,000.',
  },
  {
    ref: 'DEED-2025-1022-L',
    note: 'PLOT-2001 · S-20 to B-21, clean',
    text: 'SUB-REGISTRY GULSHAN: Fictional Deed 2025-1022-L between Seller Kabir Ahmed (S-20) and Buyer Dr. Shahana Parveen (B-21) for Plot PLOT-2001.',
  },
];

export default function DocumentVerifierView({ initialDeedRef = 'DEED-2026-0042-A' }) {
  const initial = SAMPLE_DEEDS.find(d => d.ref === initialDeedRef) || SAMPLE_DEEDS[0];
  const [deedRef, setDeedRef] = useState(initialDeedRef);
  const [documentText, setDocumentText] = useState(initial.text);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectSample = sample => {
    setDeedRef(sample.ref);
    setDocumentText(sample.text);
    setResult(null);
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/demo/verify-hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deedRef, documentText }),
      });
      setResult(await res.json());
    } catch (err) {
      console.error('Verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const simulateTamper = () => {
    setDocumentText(prev => {
      if (/\d{2},\d{3},\d{3}/.test(prev)) {
        return prev.replace(/\d{2},\d{3},\d{3}/, m => (m.startsWith('19') ? '24' : '19') + m.slice(2));
      }
      return prev + ' [MODIFIED: Unauthorized boundary amendment clause added.]';
    });
    setResult(null);
  };

  return (
    <div className="verifier">
      <section className="card verifier-input" aria-labelledby="verifier-input-title">
        <div className="card-header">
          <h2 id="verifier-input-title" className="card-title">Document payload</h2>
        </div>
        <div className="verifier-form">
          <fieldset>
            <legend className="field-label">Sample deed</legend>
            <div className="deed-options">
              {SAMPLE_DEEDS.map(s => (
                <button
                  key={s.ref}
                  type="button"
                  className={`deed-option ${deedRef === s.ref ? 'is-active' : ''}`}
                  onClick={() => selectSample(s)}
                  aria-pressed={deedRef === s.ref}
                >
                  <span className="mono deed-option-ref">{s.ref}</span>
                  <span className="deed-option-note">{s.note}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <label className="field-label" htmlFor="deed-ref">Registered deed identifier</label>
            <input
              id="deed-ref"
              type="text"
              className="input mono"
              value={deedRef}
              onChange={e => {
                setDeedRef(e.target.value);
                setResult(null);
              }}
            />
          </div>

          <div>
            <div className="label-row">
              <label className="field-label" htmlFor="deed-text">Document text</label>
              <button type="button" className="btn btn-ghost btn-sm" onClick={simulateTamper}>
                <Pencil size={13} />
                <span>Simulate tamper</span>
              </button>
            </div>
            <textarea
              id="deed-text"
              className="input mono deed-text"
              rows={6}
              value={documentText}
              onChange={e => {
                setDocumentText(e.target.value);
                setResult(null);
              }}
            />
          </div>

          <button type="button" className="btn btn-primary verifier-submit" onClick={handleVerify} disabled={loading || !deedRef}>
            {loading ? <LoaderCircle size={15} className="spin" /> : <Fingerprint size={15} />}
            <span>{loading ? 'Computing digest' : 'Verify SHA-256 hash'}</span>
          </button>
        </div>
      </section>

      <section className="card verifier-output" aria-labelledby="verifier-output-title" aria-live="polite">
        <div className="card-header">
          <h2 id="verifier-output-title" className="card-title">Integrity result</h2>
        </div>

        <div className="verifier-result">
          {!result ? (
            <div className="empty-state">
              <Fingerprint size={28} style={{ color: 'var(--text-3)' }} />
              <strong>No check run yet</strong>
              <span>Compare the document digest with the hash registered in the Sub-Registry archive.</span>
            </div>
          ) : (
            <>
              <div className={`verdict verdict--${result.isAuthentic ? 'ok' : 'high'}`}>
                {result.isAuthentic ? <CircleCheck size={22} /> : <OctagonAlert size={22} />}
                <div>
                  <p className="verdict-title">{result.status}</p>
                  <p className="verdict-text">{result.message}</p>
                </div>
              </div>

              <dl className="hash-compare">
                <div>
                  <dt>Registered archive hash</dt>
                  <dd className="mono">{result.registeredHash || 'Not recorded'}</dd>
                </div>
                <div>
                  <dt>Computed payload digest</dt>
                  <dd className={`mono ${result.isAuthentic ? 'hash-ok' : 'hash-bad'}`}>{result.submittedHash}</dd>
                </div>
              </dl>
            </>
          )}
        </div>

        <p className="verifier-note">
          Any change to deed terms, consideration, or party names changes the SHA-256 digest, giving mechanical proof of tampering.
        </p>
      </section>
    </div>
  );
}
