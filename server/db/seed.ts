import { db } from './database.js';
import { SEED_QUESTIONS } from './seed-data.js';

export function runSeed(force = false) {
  const currentCount = db.getActiveQuestionsCount();
  console.log(`Current active questions in bank: ${currentCount}`);

  if (currentCount >= 20 && !force) {
    console.log(`Database already has ${currentCount} active questions. Seed skipped.`);
    return;
  }

  console.log(`Seeding database with ${SEED_QUESTIONS.length} curated technical questions...`);
  const inserted = db.bulkInsertQuestions(SEED_QUESTIONS);
  console.log(`Successfully seeded ${inserted} questions into the TARS WARS orbital database!`);
}

// If executed directly from CLI
if (process.argv[1]?.includes('seed.ts') || process.argv[1]?.includes('seed.js')) {
  const force = process.argv.includes('--force');
  runSeed(force);
}
