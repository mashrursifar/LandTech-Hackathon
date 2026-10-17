import { connectDB } from '../db.js';
import { store } from '../store.js';
import { getSeedData } from './seedData.js';
import { runDetectionEngine } from '../rules/engine.js';

export async function initializeAndSeed(autoRunDetection = true) {
  await connectDB();
  const seed = getSeedData();
  await store.seedData(seed);
  console.log(`[Seed] Seeded ${seed.plots.length} plots, ${seed.deeds.length} deeds, ${seed.transfers.length} transfers, ${seed.mutations.length} mutations.`);

  if (autoRunDetection) {
    const result = await runDetectionEngine(null, { reviewerId: 'SYS-INIT', reviewerName: 'System Bootstrap' });
    console.log(`[Seed] Detection Engine initialized: ${result.alertsFound} alerts registered.`);
  }

  return { success: true };
}

// If run directly via node
if (process.argv[1]?.endsWith('seedRunner.js')) {
  initializeAndSeed(true)
    .then(() => {
      console.log('Seeding completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}
