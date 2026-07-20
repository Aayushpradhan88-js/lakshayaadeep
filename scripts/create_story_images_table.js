const { Client } = require("pg");
const { readFileSync } = require("fs");
const { join } = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

async function createStoryImagesTable() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error(
      "Missing DATABASE_URL. Add it to .env.local, then run:\n  node scripts/create_story_images_table.js",
    );
    console.error(
      "\nOr run supabase/migrations/20260720_create_story_images.sql in the Supabase SQL Editor.",
    );
    process.exit(1);
  }

  const sql = readFileSync(
    join(__dirname, "../supabase/migrations/20260720_create_story_images.sql"),
    "utf8",
  );

  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log("Connected to database.");
    await client.query(sql);
    console.log("story_images table and policies are ready.");
  } catch (err) {
    console.error("Error creating story_images table:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createStoryImagesTable();
