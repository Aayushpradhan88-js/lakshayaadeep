import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function countDonations() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    const res = await client.query('SELECT COUNT(*) FROM donations;');
    console.log(`Donations count: ${res.rows[0].count}`);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

countDonations();
