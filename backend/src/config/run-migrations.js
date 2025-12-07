import { pool } from "../config/database";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    const sqlPath = path.join(__dirname, "migrations", "schema.sql");

    const sql = fs.readFileSync(sqlPath, "utf8");

    console.log("🚀 Executando migrations...");
    await pool.query(sql);

    console.log("✅ Migrations executadas com sucesso!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erro ao executar migrations:", err);
    process.exit(1);
  }
}

runMigration();
