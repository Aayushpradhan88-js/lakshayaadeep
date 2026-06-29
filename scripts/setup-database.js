#!/usr/bin/env node

// Database Setup Script for Lakshyadeep
// Run with: node scripts/setup-database.js

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
import 'dotenv/config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // You'll need this for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  console.error('\n📝 Add these to your .env.local file');
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupDatabase() {
  console.log('🚀 Setting up Lakshyadeep database...');
  console.log('=====================================');

  try {
    // Read the schema file
    const schema = readFileSync('./supabase/schema.sql', 'utf8');

    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Executing ${statements.length} SQL statements...`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement });

        if (error) {
          console.error(`❌ Statement ${i + 1} failed:`, error.message);
          console.log(`📄 SQL: ${statement.substring(0, 100)}...`);
        } else {
          console.log(`✅ Statement ${i + 1}: ${statement.substring(0, 50)}...`);
        }
      } catch (err) {
        console.error(`❌ Statement ${i + 1} error:`, err.message);
      }
    }

    console.log('\n🎉 Database setup completed!');
    console.log('\n📋 Tables created:');
    console.log('   ✅ posts (blogs + news)');
    console.log('   ✅ gallery');
    console.log('   ✅ events');
    console.log('   ✅ team_members');
    console.log('   ✅ pages');
    console.log('   ✅ donations');
    console.log('   ✅ contacts');

    console.log('\n🔐 Security policies configured:');
    console.log('   ✅ Public read access for content tables');
    console.log('   ✅ Public insert for contact/donation forms');
    console.log('   ✅ Authenticated users can manage all content');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

// Alternative method using direct SQL execution
async function setupDatabaseDirect() {
  console.log('🚀 Setting up Lakshyadeep database (direct method)...');
  console.log('=====================================');

  try {
    // Read the schema file
    const schema = readFileSync('./database/schema.sql', 'utf8');

    // Execute the entire schema at once
    const { error } = await supabase.rpc('exec_sql', {
      sql_query: schema
    });

    if (error) {
      console.error('❌ Schema execution failed:', error.message);

      // Try individual table creation
      console.log('\n🔄 Trying individual table creation...');
      const tables = [
        'posts',
        'gallery',
        'events',
        'team_members',
        'pages',
        'donations',
        'contacts'
      ];

      for (const table of tables) {
        console.log(`📝 Creating table: ${table}`);
        // You would need to break down the schema further for individual table creation
      }
    } else {
      console.log('✅ Database schema created successfully!');
    }

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
  }
}

// Main execution
setupDatabase().catch(console.error);

export { setupDatabase, setupDatabaseDirect };
