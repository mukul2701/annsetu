require('dotenv').config();
const { db } = require('./config/db');

async function seed() {
  console.log('🌾 [AnnSetu Seeder] Seeding agricultural database...');
  await db.resetSeed();
  console.log('✅ [AnnSetu Seeder] Database seeded with 4 users, 8 produce listings, 8 live mandi rates, sample orders and inquiries!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ [AnnSetu Seeder Error]:', err);
  process.exit(1);
});
