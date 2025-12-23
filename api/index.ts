import "dotenv/config";
import express from "express";
import { createServer } from "http";

const app = express();

// Raw body for Stripe webhooks
declare module "http" {
    interface IncomingMessage {
        rawBody: Buffer;
    }
}

app.use(
    express.json({
        verify: (req, _res, buf) => {
            req.rawBody = buf;
        },
    })
);
app.use(express.urlencoded({ extended: false }));

// Import and register routes
import { registerRoutes } from "../server/routes";

const httpServer = createServer(app);

// Register all API routes
registerRoutes(httpServer, app);

// Export for Vercel
export default app;
