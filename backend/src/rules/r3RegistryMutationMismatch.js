/**
 * Rule R3 — Registry/mutation mismatch
 * Condition: The recorded owner or linked deed in mutation data disagrees with the relevant registry/transfer record.
 * Priority: Review
 */
export function checkRegistryMutationMismatch(plot, deeds, transfers, mutations) {
  const alerts = [];
  const plotId = plot.plotId;

  const plotMutations = mutations.filter(m => m.plotId === plotId);
  const plotDeeds = deeds.filter(d => d.plotId === plotId);
  const plotTransfers = transfers.filter(t => t.plotId === plotId);

  // Check each mutation against deed and transfer records
  for (const mutation of plotMutations) {
    const linkedDeed = deeds.find(d => d.deedRef === mutation.linkedDeedRef);

    if (!linkedDeed) {
      alerts.push({
        alertId: `ALERT-R3-NODREED-${plotId}-${mutation.mutationId}`,
        plotId,
        ruleId: 'R3',
        ruleTitle: 'Registry / Mutation Link Mismatch',
        severity: 'Review',
        explanation: `Mutation case ${mutation.caseNumber} references deed '${mutation.linkedDeedRef}', but no corresponding deed record exists in the Sub-Registry database for Plot ${plotId}.`,
        recommendation: 'Requires review. Request physical deed copy or Sub-Registry volume verification to confirm deed validity before issuing revised Khatian.',
        evidenceRefs: [
          {
            type: 'mutation',
            refId: mutation.mutationId,
            label: `Mutation Record ${mutation.caseNumber}`,
            summary: `Owner listed: ${mutation.recordedOwnerName} (${mutation.recordedOwnerId}), Linked Deed: ${mutation.linkedDeedRef}, Status: ${mutation.status}`
          }
        ],
        reviewStatus: 'Open'
      });
      continue;
    }

    // Check if recorded owner in mutation matches the buyer in the linked deed
    if (mutation.recordedOwnerId !== linkedDeed.buyerId) {
      alerts.push({
        alertId: `ALERT-R3-BUYERMISMATCH-${plotId}-${mutation.mutationId}`,
        plotId,
        ruleId: 'R3',
        ruleTitle: 'Registry / Mutation Owner Disagreement',
        severity: 'Review',
        explanation: `Mutation record ${mutation.caseNumber} assigns plot ownership to '${mutation.recordedOwnerName}' (${mutation.recordedOwnerId}), but the referenced registry deed ${linkedDeed.deedRef} legally transferred the property to '${linkedDeed.buyerName}' (${linkedDeed.buyerId}).`,
        recommendation: 'Requires review. Hold e-mutation approval. Re-check the applicant identity against the deed grantee name in the Land Registry archives.',
        evidenceRefs: [
          {
            type: 'mutation',
            refId: mutation.mutationId,
            label: `AC (Land) Mutation ${mutation.caseNumber}`,
            summary: `Claimed Owner: ${mutation.recordedOwnerName} (${mutation.recordedOwnerId}), Linked Deed: ${mutation.linkedDeedRef}`
          },
          {
            type: 'deed',
            refId: linkedDeed.deedRef,
            label: `Sub-Registry Deed ${linkedDeed.deedRef}`,
            summary: `Actual Grantee/Buyer: ${linkedDeed.buyerName} (${linkedDeed.buyerId}), Seller: ${linkedDeed.sellerName}`
          }
        ],
        reviewStatus: 'Open'
      });
    }
  }

  // Also check if an active registered transfer exists whose buyer has NOT been mutated after substantial time,
  // or if the mutation still shows the old seller while a second buyer is attempting registration (Demonstration Scenario!)
  const latestActiveTransfer = plotTransfers.filter(t => t.transferStatus === 'Active').pop();
  if (latestActiveTransfer && plotMutations.length > 0) {
    const latestMutation = plotMutations[plotMutations.length - 1];
    if (latestMutation.recordedOwnerId !== latestActiveTransfer.buyerId && latestMutation.status === 'Approved') {
      // Check if this isn't already flagged
      const alreadyFlagged = alerts.some(a => a.alertId.includes(latestMutation.mutationId));
      if (!alreadyFlagged) {
        alerts.push({
          alertId: `ALERT-R3-LAG-${plotId}-${latestMutation.mutationId}`,
          plotId,
          ruleId: 'R3',
          ruleTitle: 'Registry / Mutation Synchronization Lag',
          severity: 'Review',
          explanation: `Active transfer ${latestActiveTransfer.transferId} records buyer '${latestActiveTransfer.buyerName}' (${latestActiveTransfer.buyerId}), but the latest approved Mutation record ${latestMutation.caseNumber} still reflects '${latestMutation.recordedOwnerName}' (${latestMutation.recordedOwnerId}).`,
          recommendation: 'Recommend hold for human review. Verify whether e-mutation application is pending or if subsequent registration was executed without updating the official record of rights (ROR).',
          evidenceRefs: [
            {
              type: 'transfer',
              refId: latestActiveTransfer.transferId,
              label: `Latest Active Transfer ${latestActiveTransfer.transferId}`,
              summary: `Buyer: ${latestActiveTransfer.buyerName} (${latestActiveTransfer.buyerId}), Deed: ${latestActiveTransfer.deedRef}`
            },
            {
              type: 'mutation',
              refId: latestMutation.mutationId,
              label: `Active Mutation ${latestMutation.caseNumber}`,
              summary: `Still registered in name of: ${latestMutation.recordedOwnerName} (${latestMutation.recordedOwnerId})`
            }
          ],
          reviewStatus: 'Open'
        });
      }
    }
  }

  return alerts;
}
