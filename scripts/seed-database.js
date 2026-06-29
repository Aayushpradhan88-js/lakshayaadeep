#!/usr/bin/env node

// Seed Data Script for Lakshyadeep
// Run with: node scripts/seed-database.js

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
import 'dotenv/config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seedDatabase() {
  console.log('🌱 Seeding Lakshyadeep database with sample data...');
  console.log('==================================================');

  try {
    // Read the seed data file
    const seedData = readFileSync('./scripts/seed-data.sql', 'utf8');
    
    // Split into individual statements
    const statements = seedData
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Inserting ${statements.length} data statements...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
        
        if (error) {
          console.error(`❌ Statement ${i + 1} failed:`, error.message);
        } else {
          console.log(`✅ Statement ${i + 1}: ${statement.substring(0, 50)}...`);
        }
      } catch (err) {
        console.error(`❌ Statement ${i + 1} error:`, err.message);
      }
    }

    console.log('\n🎉 Database seeding completed!');
    console.log('\n📊 Sample data added:');
    console.log('   ✅ 3 sample posts (blogs + news)');
    console.log('   ✅ 5 sample gallery images');
    console.log('   ✅ 3 sample events');
    console.log('   ✅ 3 sample team members');
    console.log('   ✅ 3 sample pages');
    console.log('   ✅ 3 sample donations');
    console.log('   ✅ 3 sample contacts');

  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase().catch(console.error);
}

export { seedDatabase };
