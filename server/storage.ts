import { users, monitors, snapshots, type User, type InsertUser, type Monitor, type InsertMonitor, type Snapshot } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUserSubscription(userId: number, status: string, stripeCustomerId?: string): Promise<User>;
  createUser(user: InsertUser): Promise<User>;

  // Monitors
  createMonitor(monitor: InsertMonitor & { userId: number }): Promise<Monitor>;
  getMonitorsByUserId(userId: number): Promise<Monitor[]>;
  getMonitor(id: number): Promise<Monitor | undefined>;
  deleteMonitor(id: number): Promise<void>;

  // Snapshots
  addSnapshot(snapshot: typeof snapshots.$inferInsert): Promise<Snapshot>;
  getLatestSnapshot(monitorId: number): Promise<Snapshot | undefined>;
  getAllActiveMonitors(): Promise<Monitor[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    // Note: Schema 'email' is optional? Let's assume it is there.
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserSubscription(userId: number, status: string, stripeCustomerId?: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ subscriptionStatus: status, stripeCustomerId: stripeCustomerId || undefined })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async createMonitor(monitor: InsertMonitor & { userId: number }): Promise<Monitor> {
    const [newMonitor] = await db.insert(monitors).values(monitor).returning();
    return newMonitor;
  }

  async getMonitorsByUserId(userId: number): Promise<Monitor[]> {
    return db.select().from(monitors).where(eq(monitors.userId, userId));
  }

  async getMonitor(id: number): Promise<Monitor | undefined> {
    const [monitor] = await db.select().from(monitors).where(eq(monitors.id, id));
    return monitor;
  }

  async deleteMonitor(id: number): Promise<void> {
    await db.delete(monitors).where(eq(monitors.id, id));
  }

  async addSnapshot(snapshot: typeof snapshots.$inferInsert): Promise<Snapshot> {
    const [newSnapshot] = await db.insert(snapshots).values(snapshot).returning();
    return newSnapshot;
  }

  async getLatestSnapshot(monitorId: number): Promise<Snapshot | undefined> {
    const [snapshot] = await db
      .select()
      .from(snapshots)
      .where(eq(snapshots.monitorId, monitorId))
      .orderBy(desc(snapshots.createdAt))
      .limit(1);

    return snapshot;
  }

  async getAllActiveMonitors(): Promise<Monitor[]> {
    return db.select().from(monitors).where(eq(monitors.status, "active"));
  }
}

export const storage = new DatabaseStorage();
