import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL === "1";
const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.OPENAI_API_KEY;

// Log environment for debugging
console.log("Environment:", {
  isProduction,
  isVercel,
  dirname: __dirname,
  cwd: process.cwd()
});

let vite;
if (!isProduction) {
  const { createServer } = await import("vite");
  // Configure Vite middleware for development
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
  });
  app.use(vite.middlewares);
} else {
  // In production, serve static files
  const staticPath = path.join(process.cwd(), 'client/client/dist/client');
  console.log(`Serving static files from: ${staticPath}`);
  app.use(express.static(staticPath));
}

// API route for token generation
app.get("/token", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-realtime-preview-2024-12-17",
          voice: "verse",
        }),
      },
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Token generation error:", error);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

// Debug route to show file system structure
app.get("/debug", (req, res) => {
  try {
    const filesList = {};
    const pathsToCheck = [
      './',
      './client',
      './client/dist',
      './client/dist/client',
      path.join(process.cwd(), 'client/dist/client')
    ];
    
    for (const p of pathsToCheck) {
      try {
        filesList[p] = fs.existsSync(p) ? fs.readdirSync(p) : 'Directory not found';
      } catch (e) {
        filesList[p] = `Error: ${e.message}`;
      }
    }
    
    res.json({
      env: {
        isProduction,
        isVercel,
        dirname: __dirname,
        cwd: process.cwd(),
        nodeEnv: process.env.NODE_ENV
      },
      files: filesList
    });
  } catch (e) {
    console.error("Debug route error:", e);
    res.status(500).json({ error: e.message });
  }
});

// Render the React client
app.use("*", async (req, res, next) => {
  const url = req.originalUrl;

  try {
    let template, render;
    
    if (!isProduction) {
      // Development mode - use Vite's SSR
      template = await vite.transformIndexHtml(
        url,
        fs.readFileSync("./client/index.html", "utf-8"),
      );
      const entry = await vite.ssrLoadModule("./client/entry-server.jsx");
      render = entry.render;
    } else {
      // Production mode - use built files
      const indexPath = path.join(process.cwd(), 'client/client/dist/client/index.html');
      console.log(`Reading index.html from: ${indexPath} (exists: ${fs.existsSync(indexPath)})`);
      
      try {
        template = fs.readFileSync(indexPath, 'utf-8');
      } catch (err) {
        console.error(`Error reading index.html: ${err.message}`);
        return res.status(500).send(`Failed to read index.html: ${err.message}`);
      }
      
      try {
        const serverEntryPath = path.join(process.cwd(), 'client/client/dist/server/index.js');
        console.log(`Importing server entry from: ${serverEntryPath} (exists: ${fs.existsSync(serverEntryPath)})`);
        const serverEntry = await import(serverEntryPath);
        render = serverEntry.render;
      } catch (err) {
        console.error(`Error importing server entry: ${err.message}`);
        return res.status(500).send(`Failed to load server entry: ${err.message}`);
      }
    }

    const appHtml = await render(url);
    const html = template.replace(`<!--ssr-outlet-->`, appHtml?.html);
    
    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (e) {
    if (!isProduction && vite) {
      vite.ssrFixStacktrace(e);
    }
    console.error("Error rendering the app:", e);
    next(e);
  }
});

// Don't call app.listen in serverless environments like Vercel
if (!isVercel) {
  app.listen(port, () => {
    console.log(`Express server running on *:${port}`);
  });
}

// For Vercel serverless environment
export default app;
