import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { eq, asc, sql, count, ilike } from "drizzle-orm";
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
import { readFileSync, existsSync } from "fs";
import { parse } from "csv-parse/sync";
import path from "path";

const { Pool } = pg;

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize Drizzle ORM
export const db = drizzle(pool);

// Auto-seed players if database is empty
export async function ensurePlayersSeeded(): Promise<void> {
  try {
    const result = await db.select({ count: count() }).from(players);
    const playerCount = result[0]?.count || 0;
    
    if (playerCount > 0) {
      console.log(`[seed] Database has ${playerCount} players, skipping seed`);
      return;
    }

    console.log("[seed] No players found, auto-seeding database...");
    
    // Try multiple paths for the CSV file
    const possiblePaths = [
      path.resolve(__dirname, "data/players.csv"),  // Production: dist/data/players.csv
      path.resolve(process.cwd(), "dist/data/players.csv"),
      path.resolve(process.cwd(), "attached_assets/transfermarkt_players.csv"),  // Development
    ];
    
    let csvPath: string | null = null;
    for (const p of possiblePaths) {
      if (existsSync(p)) {
        csvPath = p;
        break;
      }
    }
    
    if (!csvPath) {
      console.error("[seed] Could not find player CSV file");
      return;
    }
    
    console.log(`[seed] Reading from: ${csvPath}`);
    const csvContent = readFileSync(csvPath, "utf-8");
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    const playerData = records.map((record: any) => ({
      name: record.name,
      fullName: record.name,
      birthDate: record.birth_date,
      age: parseInt(record.age),
      nationality: record.nationality,
      team: record.team,
      position: record.position,
      overallRating: 80,
      imageUrl: record.image_url || null,
    }));

    // Insert in batches
    const batchSize = 50;
    for (let i = 0; i < playerData.length; i += batchSize) {
      const batch = playerData.slice(i, i + batchSize);
      await db.insert(players).values(batch);
    }
    
    console.log(`[seed] Successfully seeded ${playerData.length} players`);
  } catch (error) {
    console.error("[seed] Error during auto-seed:", error);
  }
}

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Player methods
  getRandomPlayers(count: number, pack?: string): Promise<Player[]>;
  getPlayerById(id: number): Promise<Player | undefined>;
  searchPlayersByName(query: string, limit?: number): Promise<Player[]>;
  
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
  async getRandomPlayers(count: number, pack?: string): Promise<Player[]> {
    if (pack && pack !== 'all') {
      const result = await db
        .select()
        .from(players)
        .where(eq(players.pack, pack))
        .orderBy(sql`RANDOM()`)
        .limit(count);
      return result;
    }
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

  async searchPlayersByName(query: string, limit: number = 20): Promise<Player[]> {
    const result = await db
      .select()
      .from(players)
      .where(ilike(players.name, `%${query}%`))
      .orderBy(asc(players.name))
      .limit(limit);
    return result;
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
