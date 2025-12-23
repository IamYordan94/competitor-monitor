import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

// Initialize Resend only if key is present
let resend: Resend | null = null;
if (apiKey) {
    resend = new Resend(apiKey);
}

export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
    if (!resend) {
        console.log(`[Email Mock] To: ${to}, Subject: ${subject}`);
        console.log("----------------------------------------------------");
        console.log(html);
        console.log("----------------------------------------------------");
        return { success: true, mock: true };
    }

    try {
        const data = await resend.emails.send({
            from: "Competitor Monitor <onboarding@resend.dev>", // Default Resend testing domain
            to,
            subject,
            html,
        });
        return { success: true, data };
    } catch (error) {
        console.error("Failed to send email:", error);
        return { success: false, error };
    }
}
