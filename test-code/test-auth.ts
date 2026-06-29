// Test Authentication Setup
// Run with: node test-auth.js

import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase/supabase';

console.log('🔐 Testing Authentication Setup');
console.log('===============================');

try {
  console.log('\n📋 Environment Check:');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Found' : '❌ Missing');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Found' : '❌ Missing');
  console.log('NEXT_PUBLIC_SUPER_ADMIN_EMAIL:', process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL ? '✅ Found' : '❌ Missing');

  console.log('\n🔍 Supabase Configuration:');
  if (isSupabaseConfigured()) {
    console.log('✅ Supabase is properly configured');
    
    try {
      const supabase = getSupabaseClient();
      console.log('✅ Supabase client created successfully');
      // @ts-ignore - accessing protected properties for testing purposes
      console.log('🌐 Supabase URL:', supabase['supabaseUrl']);
      // @ts-ignore - accessing protected properties for testing purposes
      console.log('🔑 Anon Key length:', supabase['supabaseKey'].length);
    } catch (err) {
      console.log('❌ Error creating Supabase client:', err instanceof Error ? err.message : err);
    }
  } else {
    console.log('❌ Supabase is not configured');
  }

  console.log('\n🚀 Next Steps:');
  console.log('1. Your development server should be running: npm run dev');
  console.log('2. Visit: http://localhost:3000/login');
  console.log('3. The "Authentication service is not configured" error should be gone');
  console.log('4. You can now login with your super admin credentials');

} catch (error) {
  console.error('❌ Test failed:', error instanceof Error ? error.message : error);
}
