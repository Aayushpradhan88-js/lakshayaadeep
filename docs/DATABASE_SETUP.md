# Database Setup for Lakshyadeep

This guide will help you set up the complete database schema for the Lakshyadeep agricultural platform.

## 📋 Database Schema Overview

The database includes 7 main tables:

1. **posts** - Blog posts and news articles
2. **gallery** - Image gallery with captions
3. **events** - Physical and virtual events
4. **team_members** - Team member profiles
5. **pages** - Static pages (About, Vision, Terms)
6. **donations** - Donation records
7. **contacts** - Contact form submissions

## 🔧 Setup Instructions

### 1. Environment Configuration

Add these variables to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Super Admin Configuration
NEXT_PUBLIC_SUPER_ADMIN_EMAIL=admin@lakshyadeep.com
```

> **Note:** You can get the Service Role Key from your Supabase project settings under API keys.

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Database Schema

```bash
npm run db:setup
```

This will execute the complete schema creation including:
- ✅ All 7 tables with proper constraints
- ✅ Row Level Security (RLS) enabled
- ✅ Security policies for public read access
- ✅ Admin-only write permissions for authenticated users

### 4. Seed Sample Data (Optional)

```bash
npm run db:seed
```

This will add sample data to test your application:
- 3 blog posts and news articles
- 5 gallery images
- 3 events (physical and virtual)
- 3 team members
- 3 static pages
- 3 donation records
- 3 contact submissions

## 🔐 Security Policies

### Public Access
- **Read access** to all content tables (posts, gallery, events, team, pages)
- **Insert access** for contact forms and donations

### Admin Access
- **Full CRUD operations** for authenticated users on all content tables
- **Row Level Security** ensures data protection

## 📊 Table Structures

### posts
```sql
- id (uuid, primary key)
- title (text, required)
- content (text)
- type (blog/news, required)
- image_url (text)
- published (boolean, default true)
- created_at (timestamp)
```

### gallery
```sql
- id (uuid, primary key)
- image_url (text, required)
- caption (text)
- created_at (timestamp)
```

### events
```sql
- id (uuid, primary key)
- title (text, required)
- description (text)
- type (physical/virtual, required)
- location (text)
- event_date (timestamp)
- image_url (text)
- created_at (timestamp)
```

### team_members
```sql
- id (uuid, primary key)
- name (text, required)
- role (text)
- image_url (text)
- bio (text)
- is_active (boolean, default true) -- publish/unpublish control for public site
- display_order (integer, default 0) -- controls ordering on public Our Team page
- updated_at (timestamp)
  - **Note:** This column is automatically maintained via a database trigger (`update_updated_at_column`) on EVERY update. Developers do not need to set this manually in application code.
```

### pages
```sql
- id (uuid, primary key)
- slug (text, unique, required)
- title (text)
- content (text)
```

### donations
```sql
- id (uuid, primary key)
- name (text)
- email (text)
- amount (numeric, required)
- message (text)
- created_at (timestamp)
```

### contacts
```sql
- id (uuid, primary key)
- name (text)
- email (text)
- message (text)
- created_at (timestamp)
```

## 🚀 Testing the Setup

After running the setup, you can test the database by:

1. **Starting the application:**
   ```bash
   npm run dev
   ```

2. **Visiting the dashboard:**
   - Navigate to `http://localhost:3000/login`
   - Login with your super admin credentials
   - Access the dashboard to manage content

3. **Testing public access:**
   - The public API endpoints should return data for all content tables
   - Contact and donation forms should accept submissions

## 🔧 Manual Setup (Alternative)

If the automated setup doesn't work, you can manually execute the SQL:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database/schema.sql`
4. Execute the SQL statements
5. Optionally run `scripts/seed-data.sql` for sample data

## 📝 Notes

- The database uses UUID primary keys for better security and scalability
- All tables have Row Level Security enabled
- Timestamps are stored in UTC with timezone information
- The schema is designed to be flexible and extensible

## 🆘 Troubleshooting

### Common Issues

1. **Permission Denied Error**
   - Ensure you're using the Service Role Key, not the Anon Key
   - Check that the user has admin privileges in Supabase

2. **SQL Execution Failed**
   - Try running the SQL statements manually in the Supabase SQL Editor
   - Check for any syntax errors or missing extensions

3. **Environment Variables Not Found**
   - Verify your `.env.local` file exists and contains all required variables
   - Restart your development server after updating environment variables

### Getting Help

If you encounter issues:

1. Check the Supabase logs in your project dashboard
2. Verify all environment variables are correctly set
3. Ensure your Supabase project is active and not paused
4. Try running the setup scripts with verbose logging

---

**Ready to go!** Your Lakshyadeep database is now set up with a complete schema, security policies, and sample data. 🎉
