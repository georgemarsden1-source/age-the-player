import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { eq, asc, sql } from "drizzle-orm";
import { 
  type User, 
  type InsertUser,
  type Player,
  type InsertPlayer,
  type Score,
  type InsertScore,
  users,
  players,
  scores
} from "@shared/schema";

const { Pool } = pg;

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize Drizzle ORM
export const db = drizzle(pool);

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Player methods
  getRandomPlayers(count: number): Promise<Player[]>;
  getPlayerById(id: number): Promise<Player | undefined>;
  
  // Score methods
  createScore(score: InsertScore): Promise<Score>;
  getTopScores(limit: number): Promise<Score[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Player methods
  async getRandomPlayers(count: number): Promise<Player[]> {
    const result = await db
      .select()
      .from(players)
      .orderBy(sql`RANDOM()`)
      .limit(count);
    return result;
  }

  async getPlayerById(id: number): Promise<Player | undefined> {
    const result = await db.select().from(players).where(eq(players.id, id)).limit(1);
    return result[0];
  }

  // Score methods
  async createScore(insertScore: InsertScore): Promise<Score> {
    const result = await db.insert(scores).values(insertScore).returning();
    return result[0];
  }

  async getTopScores(limit: number): Promise<Score[]> {
    return await db
      .select()
      .from(scores)
      .orderBy(asc(scores.totalScore))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
