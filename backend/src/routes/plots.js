import express from 'express';
import { store } from '../store.js';

const router = express.Router();

// GET /api/plots - List or search sample plots
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const plots = await store.getPlots({ search });
    
    // Enrich with alert counts and latest status
    const allAlerts = await store.getAlerts();
    const enrichedPlots = plots.map(plot => {
      const plotAlerts = allAlerts.filter(a => a.plotId === plot.plotId);
      const highAlerts = plotAlerts.filter(a => a.severity === 'High');
      const openAlerts = plotAlerts.filter(a => a.reviewStatus === 'Open');
      return {
        ...plot,
        totalAlerts: plotAlerts.length,
        highSeverityAlerts: highAlerts.length,
        openAlerts: openAlerts.length,
        healthStatus: highAlerts.length > 0 ? 'High Inconsistency' : openAlerts.length > 0 ? 'Under Review' : 'Consistent'
      };
    });

    res.json({ success: true, count: enrichedPlots.length, data: enrichedPlots });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/plots/:plotId - Get plot details and linked records
router.get('/:plotId', async (req, res) => {
  try {
    const { plotId } = req.params;
    const plot = await store.getPlotById(plotId);
    if (!plot) {
      return res.status(404).json({ success: false, message: `Plot '${plotId}' not found` });
    }

    const deeds = await store.getDeeds(plotId);
    const transfers = await store.getTransfers(plotId);
    const mutations = await store.getMutations(plotId);
    const alerts = await store.getAlerts({ plotId });

    res.json({
      success: true,
      data: {
        plot,
        deeds,
        transfers,
        mutations,
        alerts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/plots/:plotId/timeline - Get chronological plot history
router.get('/:plotId/timeline', async (req, res) => {
  try {
    const { plotId } = req.params;
    const plot = await store.getPlotById(plotId);
    if (!plot) {
      return res.status(404).json({ success: false, message: `Plot '${plotId}' not found` });
    }

    const deeds = await store.getDeeds(plotId);
    const transfers = await store.getTransfers(plotId);
    const mutations = await store.getMutations(plotId);
    const alerts = await store.getAlerts({ plotId });

    // Build unified chronological timeline events
    const timeline = [];

    // Deed events
    deeds.forEach(d => {
      timeline.push({
        id: `event-deed-${d.deedRef}`,
        type: 'deed',
        date: d.deedDate,
        title: `Deed Registered: ${d.deedRef}`,
        status: d.status,
        description: `Conveyance from ${d.sellerName} (${d.sellerId}) to ${d.buyerName} (${d.buyerId}). Consideration: BDT ${d.deedValueBDT?.toLocaleString()}`,
        office: d.registrationOffice,
        refId: d.deedRef,
        documentHash: d.documentHash,
        sampleContent: d.sampleDocumentContent,
        raw: d
      });
    });

    // Transfer events
    transfers.forEach(t => {
      timeline.push({
        id: `event-tr-${t.transferId}`,
        type: 'transfer',
        date: t.transferDate,
        title: `Transfer Instrument: ${t.transferId}`,
        status: t.transferStatus,
        description: `Transfer filed for deed ${t.deedRef}. Buyer: ${t.buyerName}, Seller: ${t.sellerName}`,
        dependsOn: t.dependsOnTransferId,
        refId: t.transferId,
        raw: t
      });
    });

    // Mutation events
    mutations.forEach(m => {
      timeline.push({
        id: `event-mut-${m.mutationId}`,
        type: 'mutation',
        date: m.mutationDate,
        title: `AC (Land) Mutation: ${m.caseNumber}`,
        status: m.status,
        description: `Recorded Title Owner: ${m.recordedOwnerName} (${m.recordedOwnerId}) under Khatian ${m.khatianNumber}. Dakhila: ${m.dakhilaNumber || 'N/A'}`,
        office: m.acLandOffice,
        refId: m.mutationId,
        linkedDeedRef: m.linkedDeedRef,
        raw: m
      });
    });

    // Sort chronologically
    timeline.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      success: true,
      plotId,
      plot,
      timeline,
      activeAlerts: alerts
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
