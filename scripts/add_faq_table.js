const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addFaqTable() {
  console.log('Adding faq table...');

  const sql = `
    CREATE TABLE IF NOT EXISTS faq (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      display_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Enable RLS
    ALTER TABLE faq ENABLE ROW LEVEL SECURITY;

    -- Public read access
    CREATE POLICY "Public read faq" ON faq FOR SELECT USING (true);

    -- Auth user (admin) manage access
    CREATE POLICY "Admins manage faq" ON faq FOR ALL 
    USING (auth.role() = 'authenticated') 
    WITH CHECK (auth.role() = 'authenticated');
  `;

  // We can't run arbitrary SQL with the JS client directly for CREATE TABLE unless we use a function or RPC.
  // However, we can try to insert a dummy row to see if it exists, or use a migration-like approach.
  // Actually, for this environment, I'll assume I should provide the SQL and ask the user or try to find a way to run it.
  
  // Alternative: Use the 'postgres' library if available, or just instruct the user.
  // But wait, there's a 'scripts/setup-database.js' which might have a way to run SQL.
  
  console.log('Please run the following SQL in your Supabase SQL Editor:');
  console.log(sql);
}

addFaqTable();
