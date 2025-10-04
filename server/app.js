import express from "express";
import path from "path";
import fs from "fs/promises";
import { FileOrganizer } from "./FileOrganzer.js"; // fixed typo
import logger from "pino";

const log = logger({
  level: "info",              // "info", "debug", "error", etc.
  transport: {
    target: "pino-pretty",    // only for dev; pretty-print logs
    options: {
      colorize: true
    }
  }
});
const app = express();
const PORT = 3000;

// Correct relative paths from server/app.js
const publicPath = path.resolve("./../public"); // or "./../public" depending on Render root
const jsPath = path.resolve("./../js");





// Serve frontend HTML/CSS

// app.use("/app", express.static(publicPath));  // HTML & CSS served at /app
// app.use("/", express.static(publicPath)); 
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});
// Serve frontend JS

app.use("/js", express.static(jsPath));       // JS served at /js

// Middleware to parse JSON bodies
app.use(express.json());

// API router
const apiRouter = express.Router();

// API route to organize files
apiRouter.post("/organize", async (req, res) => {
  try {
    const { dirPath } = req.body;
    console.log(dirPath)
    if (!dirPath){
       log.warn("No dirPath provided");
       return res.status(400).json({ error: "dirPath is required" });
    } 
    const test = new FileOrganizer(dirPath);
    const result = await test.organizerFolder()

   log.info({ dirPath }, "Organized folder successfully");
    res.json(result);

  } catch (err) {
    log.error({ err }, "Error organizing folder");
    res.status(500).json({ error: err.message });
  }
});

// Mount API router at /api
app.use("/api", apiRouter);

// Start server
app.listen(PORT, () => {
  log.info(`🚀 Server running at http://localhost:${PORT}/app`);
});