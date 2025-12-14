import { db } from "./storage";
import { players } from "@shared/schema";
import { readFileSync } from "fs";
import { parse } from "csv-parse/sync";
import { sql } from "drizzle-orm";

async function seedPlayers() {
  try {
    console.log("Reading Transfermarkt CSV file...");
    const csvContent = readFileSync("attached_assets/transfermarkt_players.csv", "utf-8");
    
    console.log("Parsing CSV...");
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    console.log(`Found ${records.length} players in CSV`);

    // Map to database format
    const playerData = records.map((record: any) => ({
      name: record.name,
      fullName: record.name,
      birthDate: record.birth_date,
      age: parseInt(record.age),
      nationality: record.nationality,
      team: record.team,
      position: record.position,
      overallRating: 80, // Default rating since not in Transfermarkt data
      imageUrl: null,
    }));

    console.log(`Preparing to seed ${playerData.length} players into database...`);
    
    // Clear existing players
    console.log("Clearing existing players...");
    await db.delete(players);
    
    // Insert in batches
    const batchSize = 50;
    for (let i = 0; i < playerData.length; i += batchSize) {
      const batch = playerData.slice(i, i + batchSize);
      await db.insert(players).values(batch);
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(playerData.length / batchSize)}`);
    }

    console.log("✅ Database seeded successfully with Transfermarkt data!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedPlayers();
