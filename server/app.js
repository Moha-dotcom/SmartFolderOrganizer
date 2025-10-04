// import express from "express";
// import path from "path";
// import fs from "fs/promises";
// import { FileOrganizer } from "./FileOrganzer.js"; // fixed typo
// import logger from "pino";

// const log = logger({
//   level: "info",              // "info", "debug", "error", etc.
//   transport: {
//     target: "pino-pretty",    // only for dev; pretty-print logs
//     options: {
//       colorize: true
//     }
//   }
// });
// const app = express();
// const PORT = 3000;

// // Correct relative paths from server/app.js
// const publicPath = path.resolve(__dirname, "../client/public");
// const jsPath = path.resolve(__dirname, "../client/js");



// // Serve frontend HTML/CSS

// app.use("/app", express.static(publicPath));  // HTML & CSS served at /app
// app.use("/", express.static(publicPath)); 
// // Serve frontend JS

// app.use("/js", express.static(jsPath));       // JS served at /js

// // Middleware to parse JSON bodies
// app.use(express.json());

// // API router
// const apiRouter = express.Router();

// // API route to organize files
// apiRouter.post("/organize", async (req, res) => {
//   try {
//     const { dirPath } = req.body;
//     console.log(dirPath)
//     if (!dirPath){
//        log.warn("No dirPath provided");
//        return res.status(400).json({ error: "dirPath is required" });
//     } 
//     const test = new FileOrganizer(dirPath);
//     const result = await test.organizerFolder()

//    log.info({ dirPath }, "Organized folder successfully");
//     res.json(result);

//   } catch (err) {
//     log.error({ err }, "Error organizing folder");
//     res.status(500).json({ error: err.message });
//   }
// });

// // Mount API router at /api
// app.use("/api", apiRouter);

// // Start server
// app.listen(PORT, () => {
//   log.info(`🚀 Server running at http://localhost:${PORT}/app`);
// });


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
  try {
    const { dirPath } = req.body;

    if (!dirPath) {
      log.warn("No dirPath provided");
      return res.status(400).json({ error: "dirPath is required" });
    }

    const organizer = new FileOrganizer(dirPath);
    const result = await organizer.organizerFolder();

    log.info({ dirPath }, "Organized folder successfully");
    res.json(result);
  } catch (err) {
    log.error({ err }, "Error organizing folder");
    res.status(500).json({ error: err.message });
  }
});

// Mount API
app.use("/api", apiRouter);

// Start server
app.listen(PORT, () => {
  log.info(`🚀 Server running at http://localhost:${PORT}/app`);
});