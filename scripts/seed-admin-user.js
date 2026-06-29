import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!supabaseUrl || !supabaseServiceKey || !adminEmail || !adminPassword) {
  console.error('❌ Missing required environment variables in .env');
  console.log('Ensure you have:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  console.log('- ADMIN_EMAIL');
  console.log('- ADMIN_PASSWORD');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seedAdminUser() {
  console.log(`🌱 Seeding admin user: ${adminEmail}...`);

  try {
    // Check if user already exists
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      throw listError;
    }

    const existingUser = users.find(u => u.email === adminEmail);

    if (existingUser) {
      console.log('✅ Admin user already exists. Updating password...');
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { password: adminPassword, email_confirm: true }
      );
      if (updateError) throw updateError;
      console.log('✨ Password updated successfully!');
    } else {
      console.log('Creating new admin user...');
      const { error: createError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true
      });
      if (createError) throw createError;
      console.log('✨ Admin user created successfully!');
    }

    console.log('\n==================================================');
    console.log('Credentials:');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('==================================================');

  } catch (error) {
    console.error('❌ Failed to seed admin user:', error.message);
    process.exit(1);
  }
}

seedAdminUser();
