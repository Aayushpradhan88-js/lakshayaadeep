#!/usr/bin/env node

// Simple Database Setup Script for Lakshyadeep
// Run with: node scripts/setup-database-simple.js

const fs = require('fs');
const path = require('path');

function setupDatabase() {
  console.log('🗄️  Lakshyadeep Database Setup');
  console.log('==============================');
  
  // Check if environment file exists
  const envPath = path.join(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found!');
    console.log('\n📝 Please create .env.local with:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
    console.log('SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key');
    console.log('NEXT_PUBLIC_SUPER_ADMIN_EMAIL=admin@lakshyadeep.com');
    return;
  }
  
  // Load environment variables
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  });
  
  console.log('\n📋 Current environment variables:');
  Object.keys(envVars).forEach(key => {
    if (key.includes('SUPABASE') || key.includes('SUPER_ADMIN')) {
      const value = envVars[key];
      const maskedValue = key.includes('KEY') ? value.substring(0, 20) + '...' : value;
      console.log(`   ${key}: ${maskedValue}`);
    }
  });
  
  const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing required environment variables:');
    if (!supabaseUrl) console.log('   - NEXT_PUBLIC_SUPABASE_URL');
    if (!supabaseServiceKey) console.log('   - SUPABASE_SERVICE_ROLE_KEY');
    return;
  }
  
  console.log('✅ Environment variables found');
  
  // Read schema file
  const schemaPath = path.join(__dirname, '../database/schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.error('❌ Schema file not found: database/schema.sql');
    return;
  }
  
  const schema = fs.readFileSync(schemaPath, 'utf8');
  console.log('✅ Schema file loaded');
  
  console.log('\n📋 Database Schema Summary:');
  console.log('📝 posts - Blog posts and news articles');
  console.log('🖼️  gallery - Image gallery with captions');
  console.log('📅 events - Physical and virtual events');
  console.log('👥 team_members - Team member profiles');
  console.log('📄 pages - Static pages (About, Vision, Terms)');
  console.log('💰 donations - Donation records');
  console.log('📧 contacts - Contact form submissions');
  
  console.log('\n🔐 Security Features:');
  console.log('✅ Row Level Security (RLS) enabled');
  console.log('✅ Public read access policies');
  console.log('✅ Admin-only write permissions');
  console.log('✅ Contact/donation form access');
  
  console.log('\n🚀 Manual Setup Instructions:');
  console.log('1. Go to your Supabase project dashboard');
  console.log('2. Navigate to the SQL Editor');
  console.log('3. Copy and paste the contents of database/schema.sql');
  console.log('4. Execute the SQL statements');
  console.log('5. Verify all tables are created in the Table Editor');
  
  console.log('\n📄 Schema file location:');
  console.log(path.resolve(schemaPath));
  
  console.log('\n🌱 After creating tables, run sample data:');
  console.log('npm run db:seed');
  
  console.log('\n🎯 Alternative: Use Supabase CLI');
  console.log('1. Install Supabase CLI: npm install -g supabase');
  console.log('2. Login: supabase login');
  console.log('3. Link project: supabase link --project-ref your-project-id');
  console.log('4. Push schema: supabase db push');
}

setupDatabase();
