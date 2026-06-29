const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

async function createFaqTable() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log("Connected to DB.");

    await client.query(`
      CREATE TABLE IF NOT EXISTS faq (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log("FAQ table created.");

    // Check if policies already exist before creating them
    const policies = await client.query(`
      SELECT policyname FROM pg_policies WHERE tablename = 'faq';
    `);
    const policyNames = policies.rows.map(p => p.policyname);

    if (!policyNames.includes('Public read faq')) {
      await client.query(`
        ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Public read faq" ON faq FOR SELECT USING (true);
      `);
      console.log("Public read policy added.");
    }

    if (!policyNames.includes('Admins manage faq')) {
      await client.query(`
        CREATE POLICY "Admins manage faq" ON faq FOR ALL 
        USING (auth.role() = 'authenticated') 
        WITH CHECK (auth.role() = 'authenticated');
      `);
      console.log("Admin manage policy added.");
    }

  } catch (err) {
    console.error("Error creating FAQ table:", err);
  } finally {
    await client.end();
  }
}

createFaqTable();
