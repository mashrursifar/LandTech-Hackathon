import express from 'express';
import { store } from '../store.js';

const router = express.Router();

// GET /api/alerts - List alerts with optional status/severity/plot filters
router.get('/', async (req, res) => {
  try {
    const { plotId, severity, reviewStatus, ruleId } = req.query;
    const alerts = await store.getAlerts({ plotId, severity, reviewStatus, ruleId });

    // Compute summary stats
    const total = alerts.length;
    const highPriority = alerts.filter(a => a.severity === 'High').length;
    const openReviews = alerts.filter(a => a.reviewStatus === 'Open').length;
    const underReview = alerts.filter(a => a.reviewStatus === 'Under Review').length;
    const resolved = alerts.filter(a => ['Resolved', 'Dismissed'].includes(a.reviewStatus)).length;

    res.json({
      success: true,
      stats: {
        total,
        highPriority,
        openReviews,
        underReview,
        resolved
      },
      data: alerts
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/alerts/:alertId - Get single alert with evidence details
router.get('/:alertId', async (req, res) => {
  try {
    const { alertId } = req.params;
    const alert = await store.getAlertById(alertId);
    if (!alert) {
      return res.status(404).json({ success: false, message: `Alert '${alertId}' not found` });
    }

    const plot = await store.getPlotById(alert.plotId);
    res.json({ success: true, data: { alert, plot } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/alerts/:alertId/status - Update review status and create audit log
router.patch('/:alertId/status', async (req, res) => {
  try {
    const { alertId } = req.params;
    const { reviewStatus, notes, reviewerId, reviewerName } = req.body;

    const allowedStatuses = ['Open', 'Under Review', 'Resolved', 'Dismissed'];
    if (!allowedStatuses.includes(reviewStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid reviewStatus. Allowed: ${allowedStatuses.join(', ')}`
      });
    }

    const updated = await store.updateAlertStatus(
      alertId,
      reviewStatus,
      notes,
      reviewerId || 'REV-OFFICER-01',
      reviewerName || 'Authorized Land Officer Tariq Khan'
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: `Alert '${alertId}' not found` });
    }

    res.json({
      success: true,
      message: `Alert '${alertId}' status updated to '${reviewStatus}'`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
