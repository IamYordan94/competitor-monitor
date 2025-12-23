import OpenAI from "openai";

// If key is missing, we just won't initialize the client properly or we handle it in the function.
const apiKey = process.env.OPENAI_API_KEY;

let openai: OpenAI | null = null;
if (apiKey) {
    openai = new OpenAI({ apiKey });
}

export async function generateUpdateSummary(
    oldText: string,
    newText: string,
): Promise<{ summary: string; diffDescription: string }> {
    if (!openai) {
        console.warn("OPENAI_API_KEY not found. Skipping AI summary.");
        return {
            summary: "AI summary unavailable (API Key missing).",
            diffDescription: "Changes detected but not analyzed.",
        };
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o", // or gpt-3.5-turbo
            messages: [
                {
                    role: "system",
                    content:
                        "You are a competitor analysis bot. Compare the 'Yesterday' content with 'Today' content and highlight significant changes (pricing, features, headlines). Ignore minor wording changes.",
                },
                {
                    role: "user",
                    content: `Yesterday:\n${oldText.slice(0, 2000)}\n\nToday:\n${newText.slice(0, 2000)}`,
                },
            ],
        });

        const content = response.choices[0].message.content || "No summary generated.";
        return {
            summary: content,
            diffDescription: "AI Analysis Complete",
        };
    } catch (error) {
        console.error("OpenAI API Error:", error);
        return {
            summary: "Error generating summary.",
            diffDescription: "AI Analysis Failed",
        };
    }
}
