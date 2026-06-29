# Clean Up Default Supabase Tables

## 🧹 Remove Unwanted Default Tables

Your database setup was successful, but Supabase creates some default tables that we don't need. Here's how to remove them manually:

## 📋 Tables to Remove

- `_admin_activity_logs` - Supabase admin logging
- `_dev_test_user` - Development test user table

## 🔧 Manual Removal Steps

### Step 1: Go to SQL Editor

1. **Open your Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/qvsvuvyaxwkxeakuhvei
   ```

2. **Navigate to SQL Editor** (in the left sidebar)

### Step 2: Execute Cleanup SQL

Copy and paste this SQL into the editor and run it:

```sql
-- Remove default Supabase tables we don't need
DROP TABLE IF EXISTS "_admin_activity_logs" CASCADE;
DROP TABLE IF EXISTS "_dev_test_user" CASCADE;
```

### Step 3: Verify Cleanup

1. **Go to Table Editor** (in the left sidebar)
2. **Confirm only these tables remain:**
   - ✅ posts
   - ✅ gallery
   - ✅ events
   - ✅ team_members
   - ✅ pages
   - ✅ donations
   - ✅ contacts

## 📊 Your Final Database Structure

After cleanup, your database should only contain the Lakshyadeep tables:

```
Lakshyadeep Database
├── posts (blogs + news articles)
├── gallery (images with captions)
├── events (physical and virtual events)
├── team_members (team profiles)
├── pages (static content pages)
├── donations (donation records)
└── contacts (contact form submissions)
```

## 🚀 Next Steps

After cleanup, you can:

1. **Add sample data:**
   ```bash
   npm run db:seed
   ```

2. **Start your application:**
   ```bash
   npm run dev
   ```

3. **Test your dashboard:**
   - Visit: http://localhost:3000/login
   - Login with your super admin credentials

## ✅ Benefits of Cleanup

- **Cleaner database structure** - Only tables you need
- **Better performance** - No unnecessary logging overhead
- **Simpler management** - Easier to understand and maintain
- **Security** - No development artifacts in production

## 🆘 If Tables Don't Exist

If you get "table doesn't exist" errors, that's perfect! It means the tables were already removed or never created. Your database is clean and ready to use.

---

**Your Lakshyadeep database is now clean and optimized!** 🎉
