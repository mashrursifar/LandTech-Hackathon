/**
 * Rule R2 — Seller/owner conflict
 * Condition: The seller in a new transfer does not match the latest recorded owner in the available sample history.
 * Priority: High / Review
 */
export function checkSellerOwnerConflict(plot, deeds, transfers) {
  const alerts = [];
  const plotId = plot.plotId;

  const plotTransfers = transfers
    .filter(t => t.plotId === plotId)
    .sort((a, b) => new Date(a.transferDate) - new Date(b.transferDate));

  if (plotTransfers.length === 0) return alerts;

  // Determine baseline recorded owner
  let latestOwnerId = plot.currentRecordedOwner?.id;
  let latestOwnerName = plot.currentRecordedOwner?.name;

  for (const transfer of plotTransfers) {
    // If the seller does not match current known owner
    if (latestOwnerId && transfer.sellerId !== latestOwnerId) {
      // Ignore if transfer is already cancelled or rejected
      if (['Cancelled', 'Rejected'].includes(transfer.transferStatus)) {
        continue;
      }

      alerts.push({
        alertId: `ALERT-R2-${plotId}-${transfer.transferId}`,
        plotId,
        ruleId: 'R2',
        ruleTitle: 'Seller / Recorded Owner Inconsistency',
        severity: 'High',
        explanation: `Transfer ${transfer.transferId} lists seller '${transfer.sellerName}' (${transfer.sellerId}), but the recorded legitimate owner of plot ${plotId} in the official record was '${latestOwnerName}' (${latestOwnerId}). No prior chain of title documents this seller's acquisition.`,
        recommendation: 'Requires review. Cross-check mutation records, inheritance/heirship certificates (Waris Sanad), or power of attorney before permitting registration endorsement.',
        evidenceRefs: [
          {
            type: 'transfer',
            refId: transfer.transferId,
            label: `Flagged Transfer ${transfer.transferId}`,
            summary: `Seller claimed: ${transfer.sellerName} (${transfer.sellerId}) selling to ${transfer.buyerName} (${transfer.buyerId}) on ${transfer.transferDate}`
          },
          {
            type: 'plot',
            refId: plotId,
            label: `Plot Master Record ${plotId}`,
            summary: `Officially recorded owner: ${latestOwnerName} (${latestOwnerId}), Khatian: ${plot.khatianNumber}, Mouza: ${plot.mouza}`
          }
        ],
        reviewStatus: 'Open'
      });
    }

    // Update who the owner became if this transfer was completed/active
    if (['Active', 'Registered'].includes(transfer.transferStatus)) {
      latestOwnerId = transfer.buyerId;
      latestOwnerName = transfer.buyerName;
    }
  }

  return alerts;
}
