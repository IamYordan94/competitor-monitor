import * as cheerio from "cheerio";

export async function scrapeUrl(url: string): Promise<string> {
    try {
        const res = await fetch(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
        }

        const html = await res.text();
        const $ = cheerio.load(html);

        // Remove noise
        $("script").remove();
        $("style").remove();
        $("nav").remove();
        $("footer").remove();
        $("header").remove();
        $("[role='banner']").remove();
        $("[role='navigation']").remove();

        // specific common ad selectors
        $(".ad").remove();
        $(".advertisement").remove();

        // Extract text
        const text = $("body").text().replace(/\s+/g, " ").trim();
        return text;
    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        throw error;
    }
}
