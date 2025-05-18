import mysql from "mysql2/promise";

export const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // kosongkan kalau default XAMPP
  database: "hris_cmlabs", // Ganti sesuai nama database kamu
});
