import { db } from "../server/storage";
import { players } from "../shared/schema";
import { isNull, eq } from "drizzle-orm";

const WIKIDATA_API = "https://www.wikidata.org/w/api.php";
const COMMONS_API = "https://commons.wikimedia.org/w/api.php";
const RATE_LIMIT_MS = 3000;

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

async function searchWikidata(name: string): Promise<string | null> {
  const searchUrl = `${WIKIDATA_API}?action=wbsearchentities&search=${encodeURIComponent(name)}&language=en&type=item&limit=5&format=json`;
  const data = await fetchJSON(searchUrl);
  
  if (!data?.search?.length) return null;
  
  for (const result of data.search) {
    const desc = (result.description || "").toLowerCase();
    if (desc.includes("football") || desc.includes("soccer") || desc.includes("player")) {
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

function getSearchVariations(fullName: string, shortName: string): string[] {
  const variations: string[] = [shortName];
  
  if (fullName !== shortName) {
    variations.push(fullName);
  }
  
  const parts = shortName.split(" ");
  if (parts.length >= 2) {
    variations.push(`${parts[0]} ${parts[parts.length - 1]}`);
  }
  
  return [...new Set(variations)];
}

async function findPlayerImage(fullName: string, shortName: string): Promise<string | null> {
  const variations = getSearchVariations(fullName, shortName);
  
  for (const name of variations) {
    const result = await searchWikidata(name);
    if (result) return result;
    await sleep(1000);
  }
  
  return null;
}

async function main() {
  console.log("Fetching players without images...");
  
  const playersWithoutImages = await db
    .select()
    .from(players)
    .where(isNull(players.imageUrl));

  console.log(`Found ${playersWithoutImages.length} players without images\n`);

  let updated = 0;
  let notFound = 0;

  for (let i = 0; i < playersWithoutImages.length; i++) {
    const player = playersWithoutImages[i];
    console.log(`[${i + 1}/${playersWithoutImages.length}] ${player.name}`);

    try {
      const imageUrl = await findPlayerImage(player.fullName, player.name);

      if (imageUrl) {
        await db.update(players).set({ imageUrl }).where(eq(players.id, player.id));
        console.log(`  ✓ Found!`);
        updated++;
      } else {
        console.log(`  ✗ Not found`);
        notFound++;
      }
    } catch (error) {
      console.log(`  ! Error`);
      notFound++;
    }

    await sleep(RATE_LIMIT_MS);
  }

  console.log("\n=== Summary ===");
  console.log(`Images found: ${updated}`);
  console.log(`Not found: ${notFound}`);
  console.log(`Success rate: ${((updated / (updated + notFound)) * 100).toFixed(1)}%`);
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
