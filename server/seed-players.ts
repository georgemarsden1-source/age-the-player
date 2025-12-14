import { db } from "./storage";
import { players } from "@shared/schema";
import { readFileSync } from "fs";
import { parse } from "csv-parse/sync";

function calculateAge(birthDateString: string): number {
  const today = new Date('2025-12-14');
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

async function seedPlayers() {
  try {
    console.log("Reading CSV file...");
    const csvContent = readFileSync("attached_assets/fifa_players_1765732230710.csv", "utf-8");
    
    console.log("Parsing CSV...");
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    console.log(`Found ${records.length} players in CSV`);

    // Filter for top players (rating >= 80) and clean data
    const topPlayers = records
      .filter((record: any) => {
        const rating = parseInt(record.overall_rating);
        return rating >= 80 && record.birth_date && record.name;
      })
      .slice(0, 200) // Take top 200 players
      .map((record: any) => ({
        name: record.name,
        fullName: record.full_name,
        birthDate: record.birth_date,
        age: calculateAge(record.birth_date),
        nationality: record.nationality,
        team: record.national_team || "Unknown",
        position: record.positions?.split(',')[0] || "Unknown",
        overallRating: parseInt(record.overall_rating),
        imageUrl: null, // Will use stock images on frontend
      }));

    console.log(`Seeding ${topPlayers.length} top players into database...`);
    
    // Insert in batches to avoid overwhelming the database
    const batchSize = 50;
    for (let i = 0; i < topPlayers.length; i += batchSize) {
      const batch = topPlayers.slice(i, i + batchSize);
      await db.insert(players).values(batch);
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(topPlayers.length / batchSize)}`);
    }

    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedPlayers();
