import express from "express";
import path from "path";
import fs from "fs/promises";
import  {FileOrganizer}  from "./File_Organzer.js";
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






// Serve frontend HTML/CSS
const publicPath = path.resolve("../client/public");
app.use("/app", express.static(publicPath));  // HTML & CSS served at /app

// Serve frontend JS
const jsPath = path.resolve("../client/js");
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