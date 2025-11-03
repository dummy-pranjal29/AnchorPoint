import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

import app from "./app.js";
import connectDB from "./db/database.js";

const port = process.env.PORT || 3000;

console.log("Attempting to connect to the database...");

connectDB()
  .then(() => {
    console.log("Database connection successful, starting server...");
    app.listen(port, () => {
      console.log(`Example app listening on port http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
    process.exit(1);
  });
