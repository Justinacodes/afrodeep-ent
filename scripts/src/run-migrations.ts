import { runMigrations } from 'stripe-replit-sync';
import path from 'path';
import { fileURLToPath } from 'url';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

console.log('Running stripe-replit-sync migrations...');

try {
  await runMigrations({ databaseUrl });
  console.log('Migrations complete!');
} catch (err: any) {
  console.error('Migration error:', err.message);
  process.exit(1);
}
