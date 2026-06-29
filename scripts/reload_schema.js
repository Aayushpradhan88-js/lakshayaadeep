import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function reloadSchema() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log("Connected to DB.");

    await client.query(`NOTIFY pgrst, 'reload schema'`);

    console.log("Reloaded schema successfully.");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

reloadSchema();
