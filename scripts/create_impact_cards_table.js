const { Client } = require("pg");
const { readFileSync } = require("fs");
const { join } = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

async function createImpactCardsTable() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error(
      "Missing DATABASE_URL. Run supabase/migrations/20260720_create_impact_cards.sql in the SQL Editor, or add DATABASE_URL and run:\n  npm run db:impact-cards",
    );
    process.exit(1);
  }

  const sql = readFileSync(
    join(__dirname, "../supabase/migrations/20260720_create_impact_cards.sql"),
    "utf8",
  );

  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log("Connected to database.");
    await client.query(sql);
    console.log("impact_cards table, policies, and seed rows are ready.");
  } catch (err) {
    console.error("Error creating impact_cards table:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createImpactCardsTable();
