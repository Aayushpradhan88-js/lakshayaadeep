import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function alterTable() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log("Connected to DB.");

    await client.query(`
      ALTER TABLE donations 
      ADD COLUMN IF NOT EXISTS phone TEXT,
      ADD COLUMN IF NOT EXISTS payment_method TEXT,
      ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
      ADD COLUMN IF NOT EXISTS transaction_id TEXT;
    `);

    // Reload schema cache for Supabase PostgREST
    await client.query(`NOTIFY pgrst, reload schema;`);

    console.log("Columns phone, payment_method, status, transaction_id added to donations table.");
  } catch (err) {
    console.error("Error altering table:", err);
  } finally {
    await client.end();
  }
}

alterTable();
