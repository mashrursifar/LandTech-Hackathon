import { checkDoubleSelling } from './r1DoubleSelling.js';
import { checkSellerOwnerConflict } from './r2SellerOwnerConflict.js';
import { checkRegistryMutationMismatch } from './r3RegistryMutationMismatch.js';
import { checkDuplicateDeedReference } from './r4DuplicateDeedRef.js';
import { checkInconsistentTransferSequence } from './r5InconsistentTransferSequence.js';
import { store } from '../store.js';

/**
 * Runs the deterministic detection engine across plots or a single plot.
 * @param {string|null} targetPlotId - If specified, runs only for this plot.
 * @param {object} reviewerContext - Reviewer or system context for audit logging.
 */
export async function runDetectionEngine(targetPlotId = null, reviewerContext = { reviewerId: 'SYS-ENGINE', reviewerName: 'Automated Detection Engine' }) {
  const plots = targetPlotId ? [await store.getPlotById(targetPlotId)].filter(Boolean) : await store.getPlots();
  const allDeeds = await store.getDeeds();
  const allTransfers = await store.getTransfers();
  const allMutations = await store.getMutations();

  const generatedAlerts = [];

  for (const plot of plots) {
    const r1 = checkDoubleSelling(plot, allDeeds, allTransfers);
    const r2 = checkSellerOwnerConflict(plot, allDeeds, allTransfers);
    const r3 = checkRegistryMutationMismatch(plot, allDeeds, allTransfers, allMutations);
    const r4 = checkDuplicateDeedReference(plot, allDeeds, allTransfers);
    const r5 = checkInconsistentTransferSequence(plot, allDeeds, allTransfers);

    const plotAlerts = [...r1, ...r2, ...r3, ...r4, ...r5];

    for (const alertData of plotAlerts) {
      // Check existing status to preserve manual reviewer actions (Under Review, Resolved, etc.)
      const existing = await store.getAlertById(alertData.alertId);
      if (existing) {
        alertData.reviewStatus = existing.reviewStatus;
        alertData.resolutionNotes = existing.resolutionNotes;
        alertData.reviewedBy = existing.reviewedBy;
        alertData.reviewedAt = existing.reviewedAt;
      }
      const saved = await store.saveAlert(alertData);
      generatedAlerts.push(saved);
    }
  }

  // Audit log detection engine run
  await store.addAuditLog({
    action: 'DETECTION_ENGINE_RUN',
    reviewerId: reviewerContext.reviewerId || 'SYS-ENGINE',
    reviewerName: reviewerContext.reviewerName || 'Automated Detection Engine',
    timestamp: new Date(),
    affectedRecordRefs: plots.map(p => p.plotId),
    details: `Detection engine executed for ${plots.length} plot(s). Generated/refreshed ${generatedAlerts.length} alert(s) across rules R1-R5.`
  });

  return {
    plotsChecked: plots.length,
    alertsFound: generatedAlerts.length,
    alerts: generatedAlerts
  };
}
