import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function updateRLS() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log("Connected to DB.");

    await client.query(`
      DROP POLICY IF EXISTS "Public read donations" ON donations;
      CREATE POLICY "Public read donations" ON donations FOR SELECT USING (true);
    `);

    console.log("RLS policy updated for donations table.");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

updateRLS();
