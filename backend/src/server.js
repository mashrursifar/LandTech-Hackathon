import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isDbConnected } from './db.js';
import { store } from './store.js';
import { initializeAndSeed } from './seed/seedRunner.js';

import plotsRouter from './routes/plots.js';
import alertsRouter from './routes/alerts.js';
import detectionsRouter from './routes/detections.js';
import auditLogsRouter from './routes/auditLogs.js';
import demoRouter from './routes/demo.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ensure DB and seed are ready before handling requests in serverless environments
app.use(async (req, res, next) => {
  try {
    await initApp();
  } catch (err) {
    console.error('[PlotGuard] App initialization error:', err);
  }
  next();
});

// Routes
app.use('/api/plots', plotsRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/detections', detectionsRouter);
app.use('/api/audit-logs', auditLogsRouter);
app.use('/api/demo', demoRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'PlotGuard Land Fraud & Ownership Inconsistency Detection Engine',
    database: isDbConnected() ? 'MongoDB Connected' : 'In-Memory Dynamic Store Active',
    timestamp: new Date().toISOString()
  });
});

// Initialization for serverless and local execution
let initialized = false;
let initPromise = null;

export async function initApp() {
  if (initialized) return;
  if (!initPromise) {
    initPromise = (async () => {
      await connectDB();
      const existingPlots = await store.getPlots();
      if (existingPlots.length === 0) {
        console.log('[PlotGuard] Seeding initial land registry demo scenario records...');
        await initializeAndSeed(true);
      } else {
        const existingAlerts = await store.getAlerts();
        if (existingAlerts.length === 0) {
          const { runDetectionEngine } = await import('./rules/engine.js');
          await runDetectionEngine();
        }
      }
      initialized = true;
    })();
  }
  return initPromise;
}

// Start listening only when run directly (not inside Vercel serverless)
if (!process.env.VERCEL) {
  initApp().then(() => {
    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🛡️  PLOTGUARD API SERVER RUNNING ON PORT ${PORT}`);
      console.log(`   Health check: http://localhost:${PORT}/api/health`);
      console.log(`   Database: ${isDbConnected() ? 'MongoDB' : 'In-Memory Fallback'}`);
      console.log(`=======================================================`);
    });
  }).catch(err => {
    console.error('[PlotGuard] Failed to start server:', err);
  });
}

export default app;
