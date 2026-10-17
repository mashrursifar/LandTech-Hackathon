import assert from 'node:assert';
import { checkDoubleSelling } from '../rules/r1DoubleSelling.js';
import { checkSellerOwnerConflict } from '../rules/r2SellerOwnerConflict.js';
import { checkRegistryMutationMismatch } from '../rules/r3RegistryMutationMismatch.js';
import { checkDuplicateDeedReference } from '../rules/r4DuplicateDeedRef.js';
import { checkInconsistentTransferSequence } from '../rules/r5InconsistentTransferSequence.js';
import { getSeedData } from '../seed/seedData.js';

console.log('--- RUNNING PLOTGUARD DETECTION RULE TEST SUITE ---');

const seed = getSeedData();

// TEST 1: Rule R1 Double Selling on PLOT-1042
{
  const plot = seed.plots.find(p => p.plotId === 'PLOT-1042');
  const alerts = checkDoubleSelling(plot, seed.deeds, seed.transfers);
  assert.ok(alerts.length > 0, 'R1 should detect double-selling on PLOT-1042');
  assert.strictEqual(alerts[0].ruleId, 'R1');
  assert.strictEqual(alerts[0].severity, 'High');
  assert.ok(alerts[0].explanation.includes('overlapping active transfer'));
  console.log('✓ TEST 1 PASSED: Rule R1 detects double-selling on PLOT-1042');
}

// TEST 2: Rule R1 Specification - Legitimate plot PLOT-2001 does NOT trigger R1
{
  const plot = seed.plots.find(p => p.plotId === 'PLOT-2001');
  const alerts = checkDoubleSelling(plot, seed.deeds, seed.transfers);
  assert.strictEqual(alerts.length, 0, 'R1 should NOT flag single legitimate transfer PLOT-2001');
  console.log('✓ TEST 2 PASSED: Rule R1 does not false-positive on legitimate PLOT-2001');
}

// TEST 3: Rule R1 Specification - Cancelled deed plot PLOT-3005 does NOT trigger R1
{
  const plot = seed.plots.find(p => p.plotId === 'PLOT-3005');
  const alerts = checkDoubleSelling(plot, seed.deeds, seed.transfers);
  assert.strictEqual(alerts.length, 0, 'R1 should NOT flag plot where prior transfer was cancelled');
  console.log('✓ TEST 3 PASSED: Rule R1 respects deed cancellation and avoids false positive on PLOT-3005');
}

// TEST 4: Rule R2 Seller/Owner Conflict on PLOT-4010
{
  const plot = seed.plots.find(p => p.plotId === 'PLOT-4010');
  const alerts = checkSellerOwnerConflict(plot, seed.deeds, seed.transfers);
  assert.ok(alerts.length > 0, 'R2 should detect seller who is not recorded owner on PLOT-4010');
  assert.strictEqual(alerts[0].ruleId, 'R2');
  console.log('✓ TEST 4 PASSED: Rule R2 detects seller/owner conflict on PLOT-4010');
}

// TEST 5: Rule R3 Registry/Mutation Mismatch on PLOT-5020
{
  const plot = seed.plots.find(p => p.plotId === 'PLOT-5020');
  const alerts = checkRegistryMutationMismatch(plot, seed.deeds, seed.transfers, seed.mutations);
  assert.ok(alerts.length > 0, 'R3 should detect mutation owner mismatch on PLOT-5020');
  assert.strictEqual(alerts[0].ruleId, 'R3');
  console.log('✓ TEST 5 PASSED: Rule R3 detects registry/mutation discrepancy on PLOT-5020');
}

// TEST 6: Rule R4 Duplicate Deed Reference on PLOT-6030
{
  const plot = seed.plots.find(p => p.plotId === 'PLOT-6030');
  const alerts = checkDuplicateDeedReference(plot, seed.deeds, seed.transfers);
  assert.ok(alerts.length > 0, 'R4 should detect reused deed reference on PLOT-6030');
  assert.strictEqual(alerts[0].ruleId, 'R4');
  console.log('✓ TEST 6 PASSED: Rule R4 detects duplicate deed reference reuse on PLOT-6030');
}

// TEST 7: Rule R5 Inconsistent Transfer Sequence on PLOT-7040
{
  const plot = seed.plots.find(p => p.plotId === 'PLOT-7040');
  const alerts = checkInconsistentTransferSequence(plot, seed.deeds, seed.transfers);
  assert.ok(alerts.length > 0, 'R5 should detect dependency on cancelled transfer on PLOT-7040');
  assert.strictEqual(alerts[0].ruleId, 'R5');
  console.log('✓ TEST 7 PASSED: Rule R5 detects dependency on cancelled prior transfer on PLOT-7040');
}

console.log('--- ALL 7 PLOTGUARD DETECTION TESTS PASSED SUCCESSFULLY! ---');
