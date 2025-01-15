import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root", // Replace with your MySQL username
  password: "0123155843", // Replace with your MySQL password
  database: "arkmind_test", // Replace with your MySQL database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
