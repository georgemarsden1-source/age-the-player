import { db } from "../server/storage";
import { players } from "../shared/schema";
import { eq } from "drizzle-orm";

const WIKIDATA_API = "https://www.wikidata.org/w/api.php";

const PLAYER_MAPPINGS: Record<string, string> = {
  "Mohamed  Salah Ghaly": "Mohamed Salah",
  "Carlos Henrique Venancio Casimiro": "Casemiro",
  "Marcos  Aoás Corrêa": "Marquinhos footballer",
  "Ederson Santana de Moraes": "Ederson Moraes",
  "Luiz Frello Filho Jorge": "Jorginho footballer",
  "José Manuel  Reina Páez": "Pepe Reina",
  "João Mário Naval Costa Eduardo": "João Mário",
  "Felipe  Anderson Pereira Gomes": "Felipe Anderson",
  "Matteo Politano": "Matteo Politano",
  "Frederico R. de Paula Santos": "Fred Manchester United",
  "Dante Bonfim da Costa Santos": "Dante footballer",
  "Sergio  Asenjo Andrés": "Sergio Asenjo",
  "Sergio Roberto Carnicer": "Sergi Roberto",
  "손흥민 孙兴慜": "Son Heung-min",
  "乾 貴士": "Takashi Inui",
  "香川 真司": "Shinji Kagawa",
};

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJSON(url: string): Promise<any> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "AgeThePlayer/1.0 (Football Quiz App)" },
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    clearTimeout(timeout);
    return null;
  }
}

async function searchWikidata(searchName: string): Promise<string | null> {
  const searchUrl = `${WIKIDATA_API}?action=wbsearchentities&search=${encodeURIComponent(searchName)}&language=en&type=item&limit=5&format=json`;
  const data = await fetchJSON(searchUrl);
  
  if (!data?.search?.length) return null;
  
  for (const result of data.search) {
    const desc = (result.description || "").toLowerCase();
    if (desc.includes("football") || desc.includes("soccer") || desc.includes("player") || desc.includes("goalkeeper")) {
      const entityId = result.id;
      const imageUrl = await getEntityImage(entityId);
      if (imageUrl) return imageUrl;
    }
  }
  
  return null;
}

async function getEntityImage(entityId: string): Promise<string | null> {
  const url = `${WIKIDATA_API}?action=wbgetclaims&entity=${entityId}&property=P18&format=json`;
  const data = await fetchJSON(url);
  
  const claims = data?.claims?.P18;
  if (!claims?.length) return null;
  
  const filename = claims[0]?.mainsnak?.datavalue?.value;
  if (!filename) return null;
  
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`;
}

async function main() {
  console.log("Fetching images for specific missing players...\n");

  let updated = 0;
  let notFound = 0;

  for (const [fullName, searchName] of Object.entries(PLAYER_MAPPINGS)) {
    console.log(`Searching: ${searchName} (${fullName})`);

    const result = await db
      .select()
      .from(players)
      .where(eq(players.fullName, fullName))
      .limit(1);

    if (!result.length) {
      console.log(`  ! Player not found in database\n`);
      continue;
    }

    const player = result[0];
    
    if (player.imageUrl) {
      console.log(`  - Already has image\n`);
      continue;
    }

    const imageUrl = await searchWikidata(searchName);

    if (imageUrl) {
      await db.update(players).set({ imageUrl }).where(eq(players.id, player.id));
      console.log(`  ✓ Found: ${imageUrl.substring(0, 60)}...\n`);
      updated++;
    } else {
      console.log(`  ✗ Not found\n`);
      notFound++;
    }

    await sleep(2000);
  }

  console.log("=== Summary ===");
  console.log(`Updated: ${updated}`);
  console.log(`Not found: ${notFound}`);
}

main()
  .then(() => {
    console.log("\nDone!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
