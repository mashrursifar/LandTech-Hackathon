/**
 * Rule R4 — Duplicate deed reference
 * Condition: The same deed reference is attached to multiple distinct transaction records or different plots.
 * Priority: High
 */
export function checkDuplicateDeedReference(plot, deeds, transfers) {
  const alerts = [];
  const plotId = plot.plotId;

  // Find all transfers referencing deeds for this plot
  const plotTransfers = transfers.filter(t => t.plotId === plotId);

  // Check if any deed used in this plot is also used in other plots or multiple distinct transfers
  const deedUsageMap = new Map();

  for (const t of transfers) {
    if (!deedUsageMap.has(t.deedRef)) {
      deedUsageMap.set(t.deedRef, []);
    }
    deedUsageMap.get(t.deedRef).push(t);
  }

  for (const t of plotTransfers) {
    const usages = deedUsageMap.get(t.deedRef) || [];
    // If deed is attached to more than one distinct plot or duplicate transfer IDs
    const distinctPlots = [...new Set(usages.map(u => u.plotId))];
    const distinctBuyers = [...new Set(usages.map(u => u.buyerId))];

    if (distinctPlots.length > 1 || distinctBuyers.length > 1) {
      const alreadyAdded = alerts.some(a => a.alertId.includes(t.deedRef));
      if (!alreadyAdded) {
        alerts.push({
          alertId: `ALERT-R4-${plotId}-${t.deedRef}`,
          plotId,
          ruleId: 'R4',
          ruleTitle: 'Duplicate Deed Reference Re-use',
          severity: 'High',
          explanation: `Deed reference '${t.deedRef}' is attached to ${usages.length} distinct transaction records across plots [${distinctPlots.join(', ')}]. A deed volume and serial identifier must be unique to a single parcel transfer.`,
          recommendation: 'Hold for human review immediately. Flag potential forged deed number reuse or clerical volume indexing collision.',
          evidenceRefs: usages.map(u => ({
            type: 'transfer',
            refId: u.transferId,
            label: `Transfer ${u.transferId} on Plot ${u.plotId}`,
            summary: `Deed Ref: ${u.deedRef}, Parties: ${u.sellerName} -> ${u.buyerName}, Date: ${u.transferDate}, Status: ${u.transferStatus}`
          })),
          reviewStatus: 'Open'
        });
      }
    }
  }

  return alerts;
}
