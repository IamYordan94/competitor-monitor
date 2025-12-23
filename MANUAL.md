# Competitor Monitor - Operation Manual

## 1. Environment Setup (The Keys)
You are currently adding your keys to `.env`. Once that is saved, the application has everything it needs to talk to the outside world (Database, OpenAI, Stripe, Resend).

**Do you need to do anything else for SQL?**
**No.** The database schema (tables) has already been pushed to Supabase.
- The application connects automatically using `DATABASE_URL`.
- If you ever change the code structure (add new columns), you would run `npm run db:push` locally, but for now, it's done.

## 2. Automation (The "Robot")
**Do you need to set up Cron or SMS?**
- **Cron**: **No**. The monitoring robot is built into the server (`server/cron.ts`).
  - It wakes up automatically every day at midnight (server time) to check your monitors.
  - You don't need to configure an external cron job on your server.
- **SMS**: We implemented **Email** notifications via Resend. SMS is not active.
- **Worker**: The worker is fully automated. It:
  1.  Downloads the latest version of the website.
  2.  Compares it to the last version in the database.
  3.  Uses AI (GPT-4) to summarize the changes.
  4.  Sends you an email if something important changed.

## 3. How to Run Locally
To test everything before going live:
1.  Open your terminal.
2.  Run `npm run dev`.
3.  Open `http://localhost:5000` in your browser.
4.  You can create a monitor via the API (Postman) or if you built a frontend form.
5.  To force a check *right now* (instead of waiting for midnight), you can trigger the worker manually (if you enabled the test endpoint) or just restart the server (since we added a startup run in `cron.ts` optionally, or just wait for the schedule).

## 4. Going Live (Deployment)
When you deploy to Vercel (or Render/Railway):
1.  Connect your GitHub repository.
2.  **Crucial**: You must Copy-Paste all the variables from your local `.env` into the **Environment Variables** section of your hosting provider.
3.  Deploy!

**That's it. Your money-making machine is ready.**
