// src/models/database.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

// Open a connection to the same DB file we created in initDB.js
const dbPath = path.resolve("./data/teams_clone.db");

// Open the database connection using async/await
const dbPromise = open({
  filename: dbPath,
  driver: sqlite3.Database,
});

// Test connection (optional)
async function testConnection() {
  try {
    const db = await dbPromise;
    await db.get("SELECT 1");
    console.log("✅ Connected to SQLite database.");
  } catch (err) {
    console.error("❌ Error connecting to SQLite:", err);
  }
}

testConnection();

// Export the database connection for use in other files
export default dbPromise;
