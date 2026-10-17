import express from 'express';
import { runDetectionEngine } from '../rules/engine.js';

const router = express.Router();

// POST /api/detections/run - Run detection rules against seeded/current sample data
router.post('/run', async (req, res) => {
  try {
    const { plotId, reviewerId, reviewerName } = req.body;
    const result = await runDetectionEngine(plotId || null, {
      reviewerId: reviewerId || 'REV-OFFICER-01',
      reviewerName: reviewerName || 'Authorized Land Officer Tariq Khan'
    });

    res.json({
      success: true,
      message: `Detection run completed. Checked ${result.plotsChecked} plot(s). ${result.alertsFound} inconsistency alert(s) generated/evaluated.`,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
