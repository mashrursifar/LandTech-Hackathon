import React, { useState } from 'react';
import { CheckCircle2, AlertOctagon, Hash, Shield, FileText } from 'lucide-react';
import '../styles/DocumentVerifierView.css';

export default function DocumentVerifierView({ initialDeedRef = 'DEED-2026-0042-A' }) {
  const [deedRef, setDeedRef] = useState(initialDeedRef);
  const [documentText, setDocumentText] = useState(
    'SUB-REGISTRY DHANMONDI: Fictional Deed 2026-0042-A between Seller Rafiqul Islam (S-01) and Buyer Anisur Rahman (B-01) for Plot PLOT-1042. Consideration BDT 14,500,000.'
  );
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const sampleDeeds = [
    {
      ref: 'DEED-2026-0042-A',
      plotId: 'PLOT-1042',
      label: 'Deed 2026-0042-A (PLOT-1042: S-01 to B-01)',
      text: 'SUB-REGISTRY DHANMONDI: Fictional Deed 2026-0042-A between Seller Rafiqul Islam (S-01) and Buyer Anisur Rahman (B-01) for Plot PLOT-1042. Consideration BDT 14,500,000.'
    },
    {
      ref: 'DEED-2026-0042-B',
      plotId: 'PLOT-1042',
      label: 'Deed 2026-0042-B (PLOT-1042: S-01 to B-02 - Conflict)',
      text: 'SUB-REGISTRY DHANMONDI: Fictional Deed 2026-0042-B between Seller Rafiqul Islam (S-01) and Buyer Kamal Hossain (B-02) for Plot PLOT-1042. Consideration BDT 15,200,000.'
    },
    {
      ref: 'DEED-2025-1022-L',
      plotId: 'PLOT-2001',
      label: 'Deed 2025-1022-L (PLOT-2001: S-20 to B-21 - Clean)',
      text: 'SUB-REGISTRY GULSHAN: Fictional Deed 2025-1022-L between Seller Kabir Ahmed (S-20) and Buyer Dr. Shahana Parveen (B-21) for Plot PLOT-2001.'
    }
  ];

  const handleSelectSample = (sample) => {
    setDeedRef(sample.ref);
    setDocumentText(sample.text);
    setVerificationResult(null);
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/demo/verify-hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deedRef, documentText })
      });
      const data = await res.json();
      setVerificationResult(data);
    } catch (err) {
      console.error('Verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const simulateTamper = () => {
    setDocumentText(prev => prev.replace('14,500,000', '19,500,000'));
    setVerificationResult(null);
  };

  return (
    <div className="verifier-container">
      {/* Header */}
      <div className="verifier-header">
        <div className="verifier-header-title-row">
          <h1>Document Cryptographic Hash Verification (SHA-256)</h1>
          <span className="badge badge-success">Extension</span>
        </div>
        <p className="verifier-subtitle">
          Demonstrates cryptographic integrity checking for digitized land deed instruments. Compares the presented document payload against the immutable hash registered in the Sub-Registry archive.
        </p>
      </div>

      <div className="verifier-grid">
        {/* Left Column: Input Form */}
        <div className="verifier-card">
          <div>
            <div className="verifier-card-title">
              <FileText size={16} color="var(--brand-primary)" />
              <span>Document Payload & Reference</span>
            </div>

            {/* Quick Preset Selector */}
            <div className="verifier-form-group">
              <label className="form-label">Select Sample Deed:</label>
              <div className="preset-deed-list">
                {sampleDeeds.map(s => (
                  <button
                    key={s.ref}
                    type="button"
                    onClick={() => handleSelectSample(s)}
                    className={`btn btn-outline preset-deed-btn ${deedRef === s.ref ? 'active' : ''}`}
                  >
                    <Hash size={12} color="var(--brand-primary)" />
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="verifier-form-group">
              <label className="form-label">Registered Deed Identifier:</label>
              <input
                type="text"
                className="input font-mono"
                value={deedRef}
                onChange={e => setDeedRef(e.target.value)}
                placeholder="e.g., DEED-2026-0042-A"
              />
            </div>

            <div className="verifier-form-group">
              <div className="form-label-row">
                <label className="form-label">Document Text Payload:</label>
                <button
                  type="button"
                  onClick={simulateTamper}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', color: '#fda4af' }}
                  title="Alter consideration value to test tamper detection"
                >
                  Simulate Tamper
                </button>
              </div>
              <textarea
                className="input"
                rows="5"
                value={documentText}
                onChange={e => {
                  setDocumentText(e.target.value);
                  setVerificationResult(null);
                }}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleVerify}
            disabled={loading || !deedRef}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            <Shield size={15} />
            <span>{loading ? 'Computing Hash & Auditing...' : 'Verify Cryptographic Hash'}</span>
          </button>
        </div>

        {/* Right Column: Verification Results */}
        <div className="verifier-card">
          <div>
            <div className="verifier-card-title">
              <Hash size={16} color="var(--brand-primary)" />
              <span>Cryptographic Audit Output</span>
            </div>

            {!verificationResult ? (
              <div className="verifier-empty-output">
                <Hash size={28} style={{ margin: '0 auto 0.5rem auto', opacity: 0.4 }} />
                <p style={{ fontSize: '0.825rem' }}>
                  Click "Verify Cryptographic Hash" to audit the digital fingerprint against Sub-Registry archives.
                </p>
              </div>
            ) : (
              <div>
                {/* Result Banner */}
                <div className={`result-banner ${verificationResult.isAuthentic ? 'banner-authentic' : 'banner-tampered'}`}>
                  {verificationResult.isAuthentic ? (
                    <CheckCircle2 size={20} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  ) : (
                    <AlertOctagon size={20} color="var(--color-error)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  )}
                  <div>
                    <div className="banner-status-title">
                      {verificationResult.status}
                    </div>
                    <div className="banner-message">
                      {verificationResult.message}
                    </div>
                  </div>
                </div>

                {/* Hashes Comparison */}
                <div className="hash-comparison-stack font-mono">
                  <div className="hash-display-box">
                    <div className="hash-meta-title">Official Archive Registered Hash:</div>
                    <div className="hash-code code-archive">
                      {verificationResult.registeredHash || 'Not recorded'}
                    </div>
                  </div>

                  <div className="hash-display-box">
                    <div className="hash-meta-title">Calculated Payload SHA-256 Digest:</div>
                    <div className={`hash-code ${verificationResult.isAuthentic ? 'code-authentic' : 'code-tampered'}`}>
                      {verificationResult.submittedHash}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Explanation Footer */}
          <div className="verifier-explanation-note">
            <strong>How this defends land title: </strong>
            Any alteration to deed terms, purchase consideration, or grantee names alters the calculated SHA-256 digest, providing immediate mechanical proof of document tampering.
          </div>
        </div>
      </div>
    </div>
  );
}
