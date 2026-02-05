import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, db } from "./storage";
import { insertScoreSchema, players } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Get random players for a new game (must be before :id route)
  app.get("/api/players/random", async (req, res) => {
    try {
      const count = parseInt(req.query.count as string) || 10;
      const pack = (req.query.pack as string) || 'modern';
      const players = await storage.getRandomPlayers(count, pack);
      res.json(players);
    } catch (error) {
      console.error("Error fetching random players:", error);
      res.status(500).json({ error: "Failed to fetch players" });
    }
  });

  // Search players by name
  app.get("/api/players/search", async (req, res) => {
    try {
      const query = (req.query.q as string) || "";
      const requestedLimit = parseInt(req.query.limit as string) || 20;
      const limit = Math.min(Math.max(1, requestedLimit), 50);
      
      if (!query.trim()) {
        return res.json([]);
      }
      
      const players = await storage.searchPlayersByName(query, limit);
      res.json(players);
    } catch (error) {
      console.error("Error searching players:", error);
      res.status(500).json({ error: "Failed to search players" });
    }
  });

  // Get player by ID (must be after specific routes like /random and /search)
  app.get("/api/players/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid player ID" });
      }
      
      const player = await storage.getPlayerById(id);
      if (!player) {
        return res.status(404).json({ error: "Player not found" });
      }
      
      res.json(player);
    } catch (error) {
      console.error("Error fetching player:", error);
      res.status(500).json({ error: "Failed to fetch player" });
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

  // Import icon pack players (admin endpoint)
  app.post("/api/admin/import-pack", async (req, res) => {
    try {
      const { packId, players: packPlayers } = req.body;
      
      if (!packId || !packPlayers || !Array.isArray(packPlayers)) {
        return res.status(400).json({ error: "Invalid request body" });
      }
      
      const playerData = packPlayers.map((p: any) => {
        const birthDate = new Date(p.birthDate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        return {
          name: p.name,
          fullName: p.name,
          birthDate: p.birthDate,
          age,
          nationality: p.nationality,
          team: p.team || 'Retired',
          position: p.position,
          overallRating: 85,
          imageUrl: null,
          pack: packId,
        };
      });
      
      // Insert in batches
      const batchSize = 20;
      for (let i = 0; i < playerData.length; i += batchSize) {
        const batch = playerData.slice(i, i + batchSize);
        await db.insert(players).values(batch);
      }
      
      res.json({ success: true, imported: playerData.length });
    } catch (error) {
      console.error("Error importing pack:", error);
      res.status(500).json({ error: "Failed to import pack" });
    }
  });

  return httpServer;
}
