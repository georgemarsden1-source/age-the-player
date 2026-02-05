import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  fullName: text("full_name").notNull(),
  birthDate: text("birth_date").notNull(),
  age: integer("age").notNull(),
  nationality: text("nationality").notNull(),
  team: text("team"),
  position: text("position").notNull(),
  overallRating: integer("overall_rating").notNull(),
  imageUrl: text("image_url"),
  pack: text("pack").default("modern"),
});

export const scores = pgTable("scores", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  totalScore: integer("total_score").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPlayerSchema = createInsertSchema(players).omit({ id: true });
export const insertScoreSchema = createInsertSchema(scores).omit({ id: true, createdAt: true });

export type Player = typeof players.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Score = typeof scores.$inferSelect;
export type InsertScore = z.infer<typeof insertScoreSchema>;
