/**
 * Rule R1 — Potential double-selling
 * Condition: The same plot has two overlapping active sale/transfer records that have not been cancelled or superseded.
 * Priority: High
 */
export function checkDoubleSelling(plot, deeds, transfers) {
  const alerts = [];
  const plotId = plot.plotId;

  // Filter transfers for this plot that are in an active or pending state
  const activeTransfers = transfers.filter(t => 
    t.plotId === plotId && 
    ['Active', 'Pending'].includes(t.transferStatus)
  );

  // Filter deeds for this plot that are active (Registered or Pending)
  const activeDeeds = deeds.filter(d => 
    d.plotId === plotId && 
    ['Registered', 'Pending', 'Draft'].includes(d.status)
  );

  // Group by distinct buyers to find conflicting concurrent claims
  const distinctBuyerTransfers = [];
  const seenBuyers = new Set();

  for (const t of activeTransfers) {
    if (!seenBuyers.has(t.buyerId)) {
      seenBuyers.add(t.buyerId);
      distinctBuyerTransfers.push(t);
    }
  }

  // If there are multiple active transfers with different buyers on the same plot
  if (distinctBuyerTransfers.length > 1) {
    const evidenceRefs = distinctBuyerTransfers.map(t => {
      const relatedDeed = activeDeeds.find(d => d.deedRef === t.deedRef);
      return {
        type: 'transfer',
        refId: t.transferId,
        label: `Transfer ${t.transferId} (Deed: ${t.deedRef})`,
        summary: `Buyer: ${t.buyerName} (${t.buyerId}), Seller: ${t.sellerName} (${t.sellerId}), Status: ${t.transferStatus}, Date: ${t.transferDate}`
      };
    });

    // Also include deed refs in evidence
    distinctBuyerTransfers.forEach(t => {
      const d = activeDeeds.find(item => item.deedRef === t.deedRef);
      if (d) {
        evidenceRefs.push({
          type: 'deed',
          refId: d.deedRef,
          label: `Deed Record ${d.deedRef}`,
          summary: `Registered on ${d.deedDate} at ${d.registrationOffice}. Value: BDT ${d.deedValueBDT?.toLocaleString() || 'N/A'}`
        });
      }
    });

    alerts.push({
      alertId: `ALERT-R1-${plotId}-${Date.now().toString().slice(-4)}`,
      plotId,
      ruleId: 'R1',
      ruleTitle: 'Potential Double-Selling Conflict',
      severity: 'High',
      explanation: `Plot ${plotId} has multiple overlapping active transfer/deed records without cancellation or superseded endorsement. Buyer ${distinctBuyerTransfers[0].buyerName} (${distinctBuyerTransfers[0].buyerId}) and Buyer ${distinctBuyerTransfers[1].buyerName} (${distinctBuyerTransfers[1].buyerId}) both have active purchase instruments recorded concurrently.`,
      recommendation: 'Hold for human review. Verify with Sub-Registry archives to check whether Deed 1 was formally cancelled or if Deed 2 was fraudulently executed without revoking the prior registration.',
      evidenceRefs,
      reviewStatus: 'Open'
    });
  }

  return alerts;
}
