import cron from "node-cron";
import { runWorker } from "./worker";

export function setupCronJobs() {
    console.log("Setting up cron jobs...");

    // Run every day at midnight (or any schedule)
    // "0 0 * * *" = midnight
    // For testing/demo, maybe every hour? "0 * * * *"
    // Let's stick to daily as requested.
    cron.schedule("0 0 * * *", () => {
        console.log("Running scheduled worker task...");
        runWorker().catch((err) => console.error("Worker failed:", err));
    });

    // Also expose a function to run it immediately on startup if configured
    // runWorker(); 
}
