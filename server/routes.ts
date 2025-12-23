import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMonitorSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Monitors Endpoints
  app.get("/api/monitors", async (req, res) => {
    // TODO: Phase 3 Real Auth
    const userId = parseInt(req.query.userId as string) || 1;
    const monitors = await storage.getMonitorsByUserId(userId);
    res.json(monitors);
  });

  app.delete("/api/monitors/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteMonitor(id);
    res.status(204).send();
  });

  app.post("/api/monitors", async (req, res) => {
    try {
      const userId = parseInt(req.body.userId) || 1;

      // 1. Check Limit
      const existing = await storage.getMonitorsByUserId(userId);
      if (existing.length >= 5) {
        return res.status(403).json({ message: "Limit reached (Max 5)." });
      }

      // 2. Check Duplicate
      const data = insertMonitorSchema.parse(req.body);
      const duplicate = existing.find(m => m.url === data.url);
      if (duplicate) {
        return res.json(duplicate); // Return existing instead of erroring, idempotent
      }

      const monitor = await storage.createMonitor({ ...data, userId });
      res.json(monitor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(error.issues);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  // Placeholder for triggering "worker" manually
  app.post("/api/test/scrape", async (req, res) => {
    try {
      // In production, Vercel Cron hits this. 
      // We can add a simple security check here if we want (e.g. secret header)
      const { runWorker } = await import("./worker");

      // Fire and forget (or await if you want logs in Vercel)
      await runWorker();

      res.json({ message: "Scrape worker executed successfully" });
    } catch (error) {
      console.error("Worker failed:", error);
      res.status(500).json({ message: "Worker failed" });
    }
  });

  app.post("/api/checkout", async (req, res) => {
    const { email, urls } = req.body;

    if (!email || !urls || !Array.isArray(urls)) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    try {
      // 1. Check if user exists
      let user = await storage.getUserByEmail(email);
      let userId: number;

      if (user) {
        // If user exists and is subscribed, return 409 conflict so frontend can show prompt
        if (user.subscriptionStatus === "active") {
          return res.status(409).json({ hasActiveSubscription: true });
        }
        userId = user.id;
      } else {
        // Create temp user (or just use email for checkout and create on webhook)
        // For now, let's create a user
        user = await storage.createUser({
          username: email, // Use email as username
          password: "placeholder-pwd-managed-by-auth-link",
          email: email,
          subscriptionStatus: "incomplete"
        });
        userId = user.id;
      }

      // DEV BYPASS: If no valid Stripe key, skip payment
      const isDevMode = !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes("placeholder");

      // 2. CHECK LIMIT (Existing + New)
      const existing = await storage.getMonitorsByUserId(userId);
      const totalPotential = existing.length + urls.length;
      if (totalPotential > 5) {
        const remaining = 5 - existing.length;
        return res.status(403).json({
          message: `Limit exceeded. You have ${existing.length} monitors. You can only add ${remaining > 0 ? remaining : 0} more on your current plan.`
        });
      }

      if (isDevMode) {
        console.log("[DEV MODE] Bypassing Stripe Checkout");

        for (const url of urls) {
          await storage.createMonitor({
            userId,
            url,
            name: url,
            frequency: 24,
            status: "active"
          });
        }
        return res.json({ url: `/success?session_id=dev_bypass&email=${email}&userId=${userId}` });
      }

      // 3. Create monitors (Pending)
      for (const url of urls) {
        await storage.createMonitor({
          userId,
          url,
          name: url,
          frequency: 24,
          status: "pending_payment"
        });
      }

      const { createCheckoutSession } = await import("./stripe");
      const session = await createCheckoutSession(userId, email);
      res.json({ url: session.url });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });

  app.get("/api/checkout/verify", async (req, res) => {
    const sessionId = req.query.session_id as string;
    if (!sessionId) return res.status(400).json({ message: "No session_id" });

    // Handle dev bypass
    if (sessionId === "dev_bypass") {
      return res.json({ success: true, status: "active" });
    }

    try {
      const { stripe } = await import("./stripe");
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === "paid" && session.metadata?.userId) {
        const userId = parseInt(session.metadata.userId);
        const email = session.customer_details?.email || session.customer_email;

        const { storage } = await import("./storage");
        await storage.updateUserSubscription(userId, "active", session.customer as string);

        // STRICT SECURITY: Send Magic Link now
        if (email) {
          const { generateLoginToken } = await import("./auth");
          const { sendEmail } = await import("./mail");

          const token = generateLoginToken(userId, email);
          const link = `${req.protocol}://${req.get("host")}/api/auth/verify?token=${token}`;

          await sendEmail({
            to: email,
            subject: "Access your Competitor Monitor Dashboard",
            html: `<p>Payment received! Access your dashboard here: <a href="${link}">${link}</a></p>`
          });
          console.log(`[Security] Magic Link sent to ${email} after payment.`);
        }

        return res.json({ success: true, status: "active" });
      }

      res.json({ success: false, status: session.payment_status });
    } catch (error) {
      console.error("Verification failed:", error);
      res.status(500).json({ message: "Verification failed" });
    }
  });

  // Auth endpoints
  // NEW: Matched to Replit frontend
  app.post("/api/send-magic-link", async (req, res) => {
    const email = req.body.email;
    if (!email) return res.status(400).json({ message: "Email required" });

    // Look up user
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      const { generateLoginToken } = await import("./auth");
      const { sendEmail } = await import("./mail");

      const token = generateLoginToken(user.id, email);
      const link = `${req.protocol}://${req.get("host")}/api/auth/verify?token=${token}`;

      await sendEmail({
        to: email,
        subject: "Manage your Competitor Monitor",
        html: `<p>Click here to login: <a href="${link}">${link}</a></p>`
      });

      res.json({ message: "Magic link sent" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to send magic link" });
    }
  });

  app.get("/api/auth/verify", async (req, res) => {
    const token = req.query.token as string;
    if (!token) return res.status(400).send("Missing token");

    const { verifyLoginToken } = await import("./auth");
    const session = verifyLoginToken(token);

    if (!session) return res.status(401).send("Invalid or expired token");

    // Start session (using basic express-session or cookie)
    // For this prototype, we'll just return success JSON or redirect to frontend.
    // req.session.userId = session.userId; // if we had session setup

    res.send(`Logged in as ${session.email}. You can close this window.`);
  });

  // Stripe Webhook
  app.post("/api/webhooks/stripe", express.raw({ type: "application/json" }), async (req, res) => {
    const signature = req.headers["stripe-signature"];
    const body = req.rawBody; // Use rawBody from middlewares

    if (!signature) {
      return res.status(400).send("Missing stripe-signature header");
    }

    try {
      const { handleWebhook } = await import("./stripe");
      await handleWebhook(body, signature as string);
      res.json({ received: true });
    } catch (err: any) {
      console.error(err);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  });

  return httpServer;
}
