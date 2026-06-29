# Environment Setup for Lakshyadeep

## Required Environment Variables

Create a `.env.local` file in the frontend directory with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Super Admin Configuration
NEXT_PUBLIC_SUPER_ADMIN_EMAIL=admin@lakshyadeep.com
```

## Where to Get These Keys

1. **Go to your Supabase Project Dashboard**
2. **Navigate to Project Settings** (gear icon in left sidebar)
3. **Go to API section**
4. **Copy these values:**
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Public Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Role Key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

⚠️ **Important:** The Service Role Key has admin privileges - never expose it in client-side code!

## Setup Instructions

### Option 1: Manual Setup (Recommended)

1. **Create your Supabase project** at https://supabase.com
2. **Get your API keys** from Project Settings → API
3. **Create `.env.local`** with the keys above
4. **Go to SQL Editor** in your Supabase dashboard
5. **Copy and paste** the contents of `database/schema.sql`
6. **Execute the SQL** to create all tables
7. **Run sample data** (optional): `npm run db:seed`

### Option 2: Automated Setup

```bash
# Install dependencies
npm install

# Create database schema
npm run db:setup

# Add sample data
npm run db:seed

# Start development server
npm run dev
```

## Troubleshooting

### "No tables found" Issue

If you only see an admin activity table, it means the schema wasn't properly executed. Here's how to fix it:

1. **Check your Supabase dashboard** → Table Editor
2. **If tables are missing**, manually run the schema:
   - Go to SQL Editor
   - Paste contents of `database/schema.sql`
   - Execute all statements

3. **Verify tables exist**:
   - posts
   - gallery
   - events
   - team_members
   - pages
   - donations
   - contacts

### Common Issues

- **Missing SUPABASE_SERVICE_ROLE_KEY**: Get it from Project Settings → API
- **Permission denied**: Use Service Role Key, not Anon Key
- **SQL execution fails**: Run statements individually in SQL Editor

## Features Implemented

- ✅ Beautiful login page with gradient background
- ✅ Email and password input fields
- ✅ Remember me checkbox
- ✅ Super admin email validation
- ✅ Supabase authentication integration
- ✅ Error handling and loading states
- ✅ Responsive design
- ✅ Form validation
- ✅ Redirect to dashboard after login
- ✅ Clean and focused login interface
- ✅ Complete database schema with 7 tables
- ✅ Row Level Security policies
- ✅ TypeScript database client
- ✅ Sample data for testing

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create a new project
   - Get your project URL and anon key from project settings

2. **Configure Environment**
   - Copy the template above to `.env.local`
   - Replace the placeholder values with your actual Supabase credentials
   - Set the super admin email to the email address that should have admin access

3. **Run the Application**
   ```bash
   npm run dev
   ```

## Super Admin Access

Only the email specified in `NEXT_PUBLIC_SUPER_ADMIN_EMAIL` will be able to access the dashboard. Make sure this email exists in your Supabase auth users.

## Features Implemented

- ✅ Beautiful login page matching the provided design
- ✅ Super admin authentication with email validation
- ✅ Forgot password functionality
- ✅ Google/Facebook OAuth buttons (ready for implementation)
- ✅ Responsive design with Tailwind CSS
- ✅ Error handling and loading states
- ✅ Form validation
- ✅ Redirect to dashboard after successful login
