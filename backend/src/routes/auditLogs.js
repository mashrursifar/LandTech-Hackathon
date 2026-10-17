import express from 'express';
import { store } from '../store.js';

const router = express.Router();

// GET /api/audit-logs - Show recent review actions
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const logs = await store.getAuditLogs(limit);
    res.json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
