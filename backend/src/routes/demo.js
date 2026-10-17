import express from 'express';
import crypto from 'crypto';
import { initializeAndSeed } from '../seed/seedRunner.js';
import { store } from '../store.js';

const router = express.Router();

// POST /api/demo/reset - Reset seeded data and initial detection run
router.post('/reset', async (req, res) => {
  try {
    await initializeAndSeed(true);
    await store.addAuditLog({
      action: 'DEMO_DATASET_RESET',
      reviewerId: 'SYS-DEMO-RESET',
      reviewerName: 'Hackathon Evaluator',
      timestamp: new Date(),
      affectedRecordRefs: ['ALL_PLOTS', 'ALL_DEEDS'],
      details: 'Demonstration dataset re-seeded to initial benchmark state for live evaluation.'
    });

    res.json({
      success: true,
      message: 'Demo dataset reset successfully. Ready for evaluation walkthrough.'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/verify/hash - SHA-256 document hash verification extension
router.post('/verify-hash', async (req, res) => {
  try {
    const { deedRef, documentText, providedHash } = req.body;
    
    if (!deedRef) {
      return res.status(400).json({ success: false, message: 'deedRef is required' });
    }

    const deed = await store.getDeedByRef(deedRef);
    if (!deed) {
      return res.status(404).json({ success: false, message: `Deed '${deedRef}' not found in registry archives.` });
    }

    let calculatedHash = null;
    if (documentText) {
      calculatedHash = crypto.createHash('sha256').update(documentText).digest('hex');
    } else if (providedHash) {
      calculatedHash = providedHash.trim().toLowerCase();
    }

    const expectedHash = deed.documentHash?.toLowerCase();
    const isTamperFree = expectedHash && calculatedHash ? expectedHash === calculatedHash : false;

    res.json({
      success: true,
      deedRef,
      registeredHash: expectedHash,
      submittedHash: calculatedHash,
      isAuthentic: isTamperFree,
      status: isTamperFree ? 'VERIFIED_AUTHENTIC' : 'TAMPER_OR_HASH_MISMATCH',
      message: isTamperFree 
        ? 'Document cryptographic signature matches Sub-Registry archive hash perfectly.' 
        : 'Warning: Hash discrepancy detected. The presented document content does not match the archive registered hash.'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
