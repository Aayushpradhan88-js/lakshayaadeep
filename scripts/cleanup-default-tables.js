#!/usr/bin/env node

// Clean up default Supabase tables that we don't need
// Run with: node scripts/cleanup-default-tables.js

import { createClient } from '@supabase/supabase-js';
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

async function cleanupDefaultTables() {
  console.log('🧹 Cleaning up default Supabase tables...');
  console.log('=====================================');

  try {
    // List of default tables to remove
    const tablesToRemove = [
      '_admin_activity_logs',
      '_dev_test_user'
    ];

    for (const tableName of tablesToRemove) {
      try {
        console.log(`🗑️  Removing table: ${tableName}`);
        
        // Drop the table if it exists
        const { error } = await supabase.rpc('exec_sql', {
          sql_query: `DROP TABLE IF EXISTS "${tableName}" CASCADE;`
        });

        if (error) {
          console.log(`⚠️  Could not remove ${tableName}: ${error.message}`);
        } else {
          console.log(`✅ Successfully removed ${tableName}`);
        }
      } catch (err) {
        console.log(`⚠️  Error removing ${tableName}: ${err.message}`);
      }
    }

    console.log('\n🎉 Cleanup completed!');
    console.log('\n📋 Your Lakshyadeep tables remain:');
    console.log('   ✅ posts (blogs + news)');
    console.log('   ✅ gallery');
    console.log('   ✅ events');
    console.log('   ✅ team_members');
    console.log('   ✅ pages');
    console.log('   ✅ donations');
    console.log('   ✅ contacts');

  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  }
}

cleanupDefaultTables();
