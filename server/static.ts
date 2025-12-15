import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // In production bundle, __dirname is the dist folder
  const distPath = path.resolve(__dirname, "public");
  
  console.log(`[static] Serving static files from: ${distPath}`);
  console.log(`[static] Directory exists: ${fs.existsSync(distPath)}`);
  
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist - but NOT for API routes
  app.use("*", (req, res, next) => {
    // Skip API routes - they should 404 properly
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
