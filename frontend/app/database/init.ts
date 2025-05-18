// database/init.ts
import { db } from "../../lib/db";

async function createTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("Tabel users berhasil dibuat (jika belum ada).");
}

createTable()
  .then(() => process.exit())
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
