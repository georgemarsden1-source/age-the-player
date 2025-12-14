import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScoreSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Get random players for a new game
  app.get("/api/players/random", async (req, res) => {
    try {
      const count = parseInt(req.query.count as string) || 10;
      const players = await storage.getRandomPlayers(count);
      res.json(players);
    } catch (error) {
      console.error("Error fetching random players:", error);
      res.status(500).json({ error: "Failed to fetch players" });
    }
  });

  // Submit a score
  app.post("/api/scores", async (req, res) => {
    try {
      const validatedData = insertScoreSchema.parse(req.body);
      const score = await storage.createScore(validatedData);
      res.json(score);
    } catch (error) {
      console.error("Error submitting score:", error);
      res.status(400).json({ error: "Invalid score data" });
    }
  });

  // Get leaderboard
  app.get("/api/scores/leaderboard", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const topScores = await storage.getTopScores(limit);
      res.json(topScores);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  return httpServer;
}
