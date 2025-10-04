


import express from "express";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { FileOrganizer } from "./FileOrganzer.js"; // ✅ fixed typo
import logger from "pino";

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(path.dirname(__filename))
console.log(path.resolve(__dirname, "../client/public"))

const log = logger({
  level: "info",
  transport: {
    target: "pino-pretty",
    options: { colorize: true }
  }
});

const app = express();
const PORT = 3000;

// ✅ Correct relative paths
const publicPath = path.resolve(__dirname, "../client/public");
const jsPath = path.resolve(__dirname, "../client/js");

// Serve frontend HTML/CSS/JS
app.use("/app", express.static(publicPath)); // For /app route
app.use("/", express.static(publicPath));    // Root route
app.use("/js", express.static(jsPath));      // Frontend JS

// Middleware
app.use(express.json());

// API router
const apiRouter = express.Router();

// Organize files endpoint
apiRouter.post("/organize", async (req, res) => {
  const { folderName } = req.body;

  if (!folderName) {
    return res.status(400).json({ error: "folderName is required" });
  }

  try {
    const organizer = new FileOrganizer(folderName);
    const result = await organizer.organizeFolder();  // ✅ Correct method name

    if (result.error) return res.status(400).json(result);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Mount API
app.use("/api", apiRouter);

// Start server
app.listen(PORT, () => {
  log.info(`🚀 Server running at http://localhost:${PORT}/app`);
});