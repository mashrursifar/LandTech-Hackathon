import assert from 'node:assert';

async function testApi() {
  console.log('--- RUNNING END-TO-END API TEST SUITE ---');

  // 1. Health check
  const healthRes = await fetch('http://localhost:5000/api/health');
  const health = await healthRes.json();
  assert.strictEqual(health.status, 'ok');
  console.log('✓ API Health Check: OK (' + health.database + ')');

  // 2. Plots listing
  const plotsRes = await fetch('http://localhost:5000/api/plots');
  const plotsData = await plotsRes.json();
  assert.strictEqual(plotsData.success, true);
  assert.ok(plotsData.data.length >= 7, 'Should have at least 7 plots');
  console.log(`✓ Plots API: Loaded ${plotsData.data.length} plots with calculated health scores.`);

  // 3. Alerts listing
  const alertsRes = await fetch('http://localhost:5000/api/alerts');
  const alertsData = await alertsRes.json();
  assert.strictEqual(alertsData.success, true);
  assert.ok(alertsData.stats.total > 0, 'Should have active alerts');
  console.log(`✓ Alerts API: ${alertsData.stats.total} total alerts (${alertsData.stats.highPriority} high priority).`);

  // 4. Timeline for PLOT-1042
  const timelineRes = await fetch('http://localhost:5000/api/plots/PLOT-1042/timeline');
  const timelineData = await timelineRes.json();
  assert.strictEqual(timelineData.success, true);
  assert.ok(timelineData.timeline.length >= 3, 'PLOT-1042 should have multiple timeline events (deeds, mutation)');
  console.log(`✓ Timeline API: PLOT-1042 has ${timelineData.timeline.length} chronological timeline events.`);

  // 5. Update Alert Status & Verify Audit Log Generation
  const targetAlert = alertsData.data.find(a => a.plotId === 'PLOT-1042' && a.ruleId === 'R1');
  assert.ok(targetAlert, 'PLOT-1042 should have an R1 alert');

  const patchRes = await fetch(`http://localhost:5000/api/alerts/${targetAlert.alertId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reviewStatus: 'Under Review',
      notes: 'Sub-Registry Volume 42 inspected. Holding second deed conveyance pending registrar hearing.',
      reviewerId: 'REV-OFFICER-01',
      reviewerName: 'Authorized Land Officer Tariq Khan'
    })
  });
  const patchData = await patchRes.json();
  assert.strictEqual(patchData.success, true);
  assert.strictEqual(patchData.data.reviewStatus, 'Under Review');
  console.log(`✓ Status Update API: Alert ${targetAlert.alertId} updated to 'Under Review'.`);

  // 6. Verify Audit Logs Contains the action
  const auditRes = await fetch('http://localhost:5000/api/audit-logs');
  const auditData = await auditRes.json();
  assert.strictEqual(auditData.success, true);
  const latestLog = auditData.data[0];
  assert.strictEqual(latestLog.action, 'ALERT_STATUS_UPDATED');
  console.log(`✓ Audit Log API: Action '${latestLog.action}' logged by '${latestLog.reviewerName}' with timestamp.`);

  // 7. Verify SHA-256 Hash Tool
  const hashRes = await fetch('http://localhost:5000/api/demo/verify-hash', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      deedRef: 'DEED-2026-0042-A',
      documentText: 'SUB-REGISTRY DHANMONDI: Fictional Deed 2026-0042-A between Seller Rafiqul Islam (S-01) and Buyer Anisur Rahman (B-01) for Plot PLOT-1042. Consideration BDT 14,500,000.'
    })
  });
  const hashData = await hashRes.json();
  assert.strictEqual(hashData.isAuthentic, true);
  console.log('✓ SHA-256 Document Integrity API: Verified authentic deed signature match.');

  // Tamper test
  const tamperRes = await fetch('http://localhost:5000/api/demo/verify-hash', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      deedRef: 'DEED-2026-0042-A',
      documentText: 'SUB-REGISTRY DHANMONDI: Fictional Deed 2026-0042-A between Seller Rafiqul Islam (S-01) and Buyer Anisur Rahman (B-01) for Plot PLOT-1042. Consideration BDT 99,999,999.' // Tampered
    })
  });
  const tamperData = await tamperRes.json();
  assert.strictEqual(tamperData.isAuthentic, false);
  console.log('✓ SHA-256 Tamper Detection API: Successfully flagged forged/altered document content.');

  console.log('--- ALL END-TO-END APIS AND BUSINESS LOGIC TESTS PASSED! ---');
}

testApi().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
