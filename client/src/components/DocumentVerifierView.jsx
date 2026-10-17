import React, { useState } from 'react';
import { CheckCircle2, AlertOctagon, Hash, Shield, FileText, ArrowRight, RefreshCw, Copy, Check } from 'lucide-react';

export default function DocumentVerifierView({ initialDeedRef = 'DEED-2026-0042-A' }) {
  const [deedRef, setDeedRef] = useState(initialDeedRef);
  const [documentText, setDocumentText] = useState(
    'SUB-REGISTRY DHANMONDI: Fictional Deed 2026-0042-A between Seller Rafiqul Islam (S-01) and Buyer Anisur Rahman (B-01) for Plot PLOT-1042. Consideration BDT 14,500,000.'
  );
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Document Cryptographic Hash Verification (SHA-256)
          </h1>
          <span className="badge badge-ok">Architecture Extension</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Demonstrates cryptographic integrity checking for digitized land deed instruments. Compares the presented document payload against the immutable hash registered in the Sub-Registry archive.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
        {/* Left Column: Input Form */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} color="var(--accent-emerald)" />
            <span>Document Payload & Reference</span>
          </h2>

          {/* Quick Preset Selector */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>
              Quick Preset Deed:
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {sampleDeeds.map(s => (
                <button
                  key={s.ref}
                  onClick={() => handleSelectSample(s)}
                  className="btn btn-outline btn-sm"
                  style={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    background: deedRef === s.ref ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    borderColor: deedRef === s.ref ? 'var(--accent-emerald)' : 'var(--border-subtle)',
                    fontSize: '0.78rem'
                  }}
                >
                  <Hash size={13} color="var(--accent-emerald)" />
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
              Registered Deed Identifier:
            </label>
            <input
              type="text"
              className="input font-mono"
              value={deedRef}
              onChange={e => setDeedRef(e.target.value)}
              placeholder="e.g., DEED-2026-0042-A"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Document Text Payload (To Be Verified):
              </label>
              <button
                type="button"
                onClick={simulateTamper}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', color: '#fda4af' }}
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
              style={{ fontSize: '0.85rem', resize: 'vertical' }}
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={handleVerify}
            disabled={loading || !deedRef}
            style={{ width: '100%' }}
          >
            <Shield size={16} />
            <span>{loading ? 'Computing Hash & Auditing...' : 'Verify Cryptographic Hash Integrity'}</span>
          </button>
        </div>

        {/* Right Column: Verification Results */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Hash size={18} color="#38bdf8" />
              <span>Cryptographic Audit Output</span>
            </h2>

            {!verificationResult ? (
              <div style={{
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                color: 'var(--text-muted)',
                background: 'rgba(15, 23, 42, 0.4)',
                borderRadius: 'var(--radius-sm)',
                border: '1px dashed var(--border-subtle)'
              }}>
                <Hash size={32} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
                <p style={{ fontSize: '0.85rem' }}>
                  Click "Verify Cryptographic Hash Integrity" to audit the digital fingerprint against Sub-Registry archives.
                </p>
              </div>
            ) : (
              <div>
                {/* Result Banner */}
                <div style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '1.25rem',
                  background: verificationResult.isAuthentic ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                  border: verificationResult.isAuthentic ? '1px solid #10b981' : '1px solid #f43f5e',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}>
                  {verificationResult.isAuthentic ? (
                    <CheckCircle2 size={24} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  ) : (
                    <AlertOctagon size={24} color="#f43f5e" style={{ flexShrink: 0, marginTop: '2px' }} />
                  )}
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: verificationResult.isAuthentic ? '#6ee7b7' : '#fda4af' }}>
                      {verificationResult.status}
                    </div>
                    <p style={{ fontSize: '0.825rem', color: '#f8fafc', marginTop: '0.2rem', lineHeight: '1.4' }}>
                      {verificationResult.message}
                    </p>
                  </div>
                </div>

                {/* Hashes Comparison */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ padding: '0.75rem', background: 'rgba(15, 23, 42, 0.7)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Official Archive Registered Hash:
                    </div>
                    <div className="font-mono" style={{ fontSize: '0.75rem', color: '#38bdf8', wordBreak: 'break-all' }}>
                      {verificationResult.registeredHash || 'Not recorded'}
                    </div>
                  </div>

                  <div style={{ padding: '0.75rem', background: 'rgba(15, 23, 42, 0.7)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Calculated Payload SHA-256 Digest:
                    </div>
                    <div 
                      className="font-mono" 
                      style={{ 
                        fontSize: '0.75rem', 
                        color: verificationResult.isAuthentic ? '#34d399' : '#f43f5e', 
                        wordBreak: 'break-all' 
                      }}
                    >
                      {verificationResult.submittedHash}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Explanation Footer */}
          <div style={{
            marginTop: '1.5rem',
            padding: '0.85rem',
            background: 'rgba(0, 0, 0, 0.25)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            color: 'var(--text-dim)',
            lineHeight: 1.4
          }}>
            <strong style={{ color: 'var(--text-muted)' }}>How this defends land title: </strong>
            Any alteration to deed terms, purchase consideration, or grantee names alters the calculated SHA-256 digest, providing immediate mechanical proof of document tampering.
          </div>
        </div>
      </div>
    </div>
  );
}
