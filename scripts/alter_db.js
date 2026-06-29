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
      ADD COLUMN IF NOT EXISTS screenshot_url TEXT;
    `);

    console.log("Column screenshot_url added to donations table.");
  } catch (err) {
    console.error("Error altering table:", err);
  } finally {
    await client.end();
  }
}

alterTable();
