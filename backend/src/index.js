import express from "express";
import cors from "cors";
import helmet from "helmet";
import itemRoute from "./routes/item.route.js";
import mysql from 'mysql2';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(itemRoute);

const connection = mysql.createConnection({
  host: "localhost",
  user: "root", // Replace with your MySQL username
  password: "0123155843", // Replace with your MySQL password
  database: "arkmind_test", // Replace with your MySQL database name
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Connected to the database");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
