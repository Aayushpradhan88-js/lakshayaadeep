# Our Team workflow

This document explains how the **public** `Our Team` page is controlled from the **super admin dashboard**.

## Data model

- **Table**: `team_members`
  - `name`, `role`, `bio`, `image_url`
  - `is_active`: publish/unpublish control for public display
  - `display_order`: ordering priority (lower shows first)

## Storage (photos)

- **Bucket**: `media` (public)
- **Upload path**: `team/<timestamp>-<random>.<ext>`
- After upload, the dashboard stores the **public URL** into `team_members.image_url`.

## Admin workflow (super admin)

1. Go to **Dashboard → Team Members** at `/dashboard/team`.
2. **Upload Photo** (optional)
   - Choose an image → it uploads to the `media` bucket and fills `image_url`.
3. Fill member details:
   - **Name** (required)
   - Role, bio (optional)
   - **Active (published)** toggle
   - **Display Order**
4. Click **Add Member** / **Update Member**.
5. Reorder members:
   - Drag the grip handle to reorder (saves automatically), or use Up/Down buttons.
6. Publish control:
   - Use the **Published / Unpublished** button on each card.

## Public workflow

- The public page is `/our-team` (`app/our-team/page.tsx`)
- It queries:
  - `team_members` filtered by `is_active = true`
  - sorted by `display_order ASC`, then `name ASC`

## Required Supabase setup

1. Run the SQL migration that adds team columns:
   - `database/migrations/20260401_team_members_publish_and_order.sql`
2. Ensure the `media` bucket exists and allows authenticated uploads.
   - If needed, apply/update policies so authenticated users can `insert/update/delete` objects in `media`.

