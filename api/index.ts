import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";
import { createServer } from "http";
import path from "path";
import fs from "fs";

const app = express();

declare module "http" {
    interface IncomingMessage {
        rawBody: unknown;
    }
}

app.use(
    express.json({
        verify: (req, _res, buf) => {
            req.rawBody = buf;
        },
    }),
);

app.use(express.urlencoded({ extended: false }));

// Serve static files from the client build
const distPath = path.join(process.cwd(), "dist", "public");
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
}

const httpServer = createServer(app);

// Register API routes
registerRoutes(httpServer, app).then(() => {
    // SPA fallback - serve index.html for all non-API routes
    app.use("*", (_req, res) => {
        const indexPath = path.join(distPath, "index.html");
        if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
        } else {
            res.status(404).send("Not found");
        }
    });
});

export default app;
