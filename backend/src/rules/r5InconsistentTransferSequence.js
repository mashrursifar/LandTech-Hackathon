/**
 * Rule R5 — Inconsistent transfer sequence
 * Condition: A later transfer depends on an earlier transfer that is unresolved, invalid, cancelled, or inconsistent.
 * Priority: Review
 */
export function checkInconsistentTransferSequence(plot, deeds, transfers) {
  const alerts = [];
  const plotId = plot.plotId;

  const plotTransfers = transfers.filter(t => t.plotId === plotId);

  for (const transfer of plotTransfers) {
    if (transfer.dependsOnTransferId) {
      const priorTransfer = transfers.find(t => t.transferId === transfer.dependsOnTransferId);

      // Check if prior transfer is missing entirely
      if (!priorTransfer) {
        alerts.push({
          alertId: `ALERT-R5-MISSINGPRIOR-${plotId}-${transfer.transferId}`,
          plotId,
          ruleId: 'R5',
          ruleTitle: 'Broken Chain of Title Dependency',
          severity: 'Review',
          explanation: `Transfer ${transfer.transferId} explicitly depends on upstream transfer '${transfer.dependsOnTransferId}', but no such upstream record exists in the repository.`,
          recommendation: 'Requires review. Trace missing parent conveyance deed in historical district registry records.',
          evidenceRefs: [
            {
              type: 'transfer',
              refId: transfer.transferId,
              label: `Dependent Transfer ${transfer.transferId}`,
              summary: `Buyer: ${transfer.buyerName}, Depends on: ${transfer.dependsOnTransferId}`
            }
          ],
          reviewStatus: 'Open'
        });
        continue;
      }

      // Check if prior transfer was cancelled, rejected, or remains unresolved
      if (['Cancelled', 'Rejected'].includes(priorTransfer.transferStatus)) {
        alerts.push({
          alertId: `ALERT-R5-INVALIDPARENT-${plotId}-${transfer.transferId}`,
          plotId,
          ruleId: 'R5',
          ruleTitle: 'Transfer Founded on Voided / Cancelled Conveyance',
          severity: 'Review',
          explanation: `Transfer ${transfer.transferId} is predicated on parent transfer ${priorTransfer.transferId}, which was marked '${priorTransfer.transferStatus}' due to cancellation or administrative defect.`,
          recommendation: 'Hold for human review. Verify whether title defect in parent deed invalidates subsequent derivative title transfer.',
          evidenceRefs: [
            {
              type: 'transfer',
              refId: transfer.transferId,
              label: `Dependent Transfer ${transfer.transferId}`,
              summary: `Buyer: ${transfer.buyerName}, Claimed via parent: ${priorTransfer.transferId}`
            },
            {
              type: 'transfer',
              refId: priorTransfer.transferId,
              label: `Parent Transfer ${priorTransfer.transferId}`,
              summary: `Status is '${priorTransfer.transferStatus}', Deed: ${priorTransfer.deedRef}`
            }
          ],
          reviewStatus: 'Open'
        });
      }

      // Check date sequence sanity
      if (new Date(transfer.transferDate) < new Date(priorTransfer.transferDate)) {
        alerts.push({
          alertId: `ALERT-R5-CHRONO-${plotId}-${transfer.transferId}`,
          plotId,
          ruleId: 'R5',
          ruleTitle: 'Chronological Sequence Inversion',
          severity: 'Review',
          explanation: `Transfer ${transfer.transferId} is dated (${transfer.transferDate}), prior to the execution date (${priorTransfer.transferDate}) of its prerequisite parent transfer ${priorTransfer.transferId}.`,
          recommendation: 'Requires review. Check for potential clerical date entry typographical error or backdated document drafting.',
          evidenceRefs: [
            {
              type: 'transfer',
              refId: transfer.transferId,
              label: `Later Transfer ${transfer.transferId}`,
              summary: `Transfer Date: ${transfer.transferDate}`
            },
            {
              type: 'transfer',
              refId: priorTransfer.transferId,
              label: `Parent Transfer ${priorTransfer.transferId}`,
              summary: `Parent Transfer Date: ${priorTransfer.transferDate}`
            }
          ],
          reviewStatus: 'Open'
        });
      }
    }
  }

  return alerts;
}
