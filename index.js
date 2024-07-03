import express from "express";
import consign from "consign";
import path from "path";
import fs from "fs";

const PORT = 3000;
const app = express();

app.set("json spaces", 4);

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const folderPath = path.join(__dirname, "uploads/images"); // Replace 'uploads/images' with your folder name

if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, { recursive: true });
  console.log(`Folder created.`);
} else {
  console.log(`Folder already exists.`);
}

// Serve static files from the uploads/images directory
app.use("/uploads/images", express.static(folderPath));

consign({ verbose: false })
  .include("libs/config.js")
  .then("db.js")
  .then("auth.js")
  .then("libs/middlewares.js")
  .then("routes")
  .then("libs/boot.js")
  .into(app);

export default app;
