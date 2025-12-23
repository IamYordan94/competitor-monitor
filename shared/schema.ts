import { pgTable, text, serial, integer, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  stripeCustomerId: text("stripe_customer_id"),
  subscriptionStatus: text("subscription_status").default("free"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const monitors = pgTable("monitors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  url: text("url").notNull(),
  name: text("name"),
  frequency: integer("frequency").default(24), // checks per day, or hours interval? Assumed hours for now or specific cron syntax
  status: text("status").default("active"), // active, paused, error
  lastChecked: timestamp("last_checked"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const snapshots = pgTable("snapshots", {
  id: serial("id").primaryKey(),
  monitorId: integer("monitor_id").notNull().references(() => monitors.id),
  contentHash: text("content_hash"),
  cleanContent: text("clean_content"), // Store raw text for comparison
  summary: text("summary"),
  diffDescription: text("diff_description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  subscriptionStatus: true,
});

export const insertMonitorSchema = createInsertSchema(monitors).pick({
  url: true,
  name: true,
  frequency: true,
  status: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMonitor = z.infer<typeof insertMonitorSchema>;
export type Monitor = typeof monitors.$inferSelect;
export type Snapshot = typeof snapshots.$inferSelect;
