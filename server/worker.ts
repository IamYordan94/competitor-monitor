import { storage } from "./storage";
import { scrapeUrl } from "./scraper";
import { generateUpdateSummary } from "./openai";
import { createHash } from "crypto";
import { sendEmail } from "./mail";

// Simple hash to detect content changes
function hashContent(content: string): string {
    return createHash("md5").update(content).digest("hex");
}

export async function runWorker() {
    console.log("Worker starting...");
    const monitors = await storage.getAllActiveMonitors();
    console.log(`Found ${monitors.length} active monitors.`);

    for (const monitor of monitors) {
        console.log(`Checking ${monitor.url}...`);
        try {
            const currentText = await scrapeUrl(monitor.url);
            const currentHash = hashContent(currentText);

            const lastSnapshot = await storage.getLatestSnapshot(monitor.id);

            if (!lastSnapshot || lastSnapshot.contentHash !== currentHash) {
                console.log(`Change detected for ${monitor.url}`);

                // Generate summary if we have previous content (and it's not a fresh monitor)
                let summary = "Initial snapshot";
                let diffDescription = "Monitoring started";

                if (lastSnapshot && lastSnapshot.cleanContent) {
                    const analysis = await generateUpdateSummary(lastSnapshot.cleanContent, currentText);
                    summary = analysis.summary;
                    diffDescription = analysis.diffDescription;
                }

                await storage.addSnapshot({
                    monitorId: monitor.id,
                    contentHash: currentHash,
                    cleanContent: currentText,
                    summary: summary,
                    diffDescription: diffDescription,
                });

                // Notify user
                const user = await storage.getUser(monitor.userId);
                if (user && user.email) {
                    await sendEmail({
                        to: user.email,
                        subject: `Change Detected: ${monitor.name || monitor.url}`,
                        html: `
                            <h2>Change Detected on ${monitor.name || monitor.url}</h2>
                            <p><strong>Summary:</strong> ${summary}</p>
                            <p><strong>Details:</strong> ${diffDescription}</p>
                            <a href="${monitor.url}">Visit Site</a>
                        `
                    });
                    console.log(`Email sent to ${user.email}`);
                }
            } else {
                console.log(`No change for ${monitor.url}`);
            }
        } catch (error) {
            console.error(`Error checking ${monitor.url}:`, error);
            // Optional: Update monitor status to 'error' or log it
        }
    }
    console.log("Worker finished.");
}
