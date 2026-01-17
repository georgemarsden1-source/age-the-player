import { db } from "../server/storage";
import { players } from "../shared/schema";
import { isNull, eq } from "drizzle-orm";

const WIKIDATA_SPARQL_URL = "https://query.wikidata.org/sparql";
const RATE_LIMIT_MS = 1200;

interface WikidataResult {
  player: { value: string };
  playerLabel: { value: string };
  image?: { value: string };
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function searchByLabel(name: string): Promise<string | null> {
  const sparqlQuery = `
    SELECT ?player ?playerLabel ?image WHERE {
      ?player wdt:P106 wd:Q937857 .
      ?player rdfs:label "${name.replace(/"/g, '\\"')}"@en .
      OPTIONAL { ?player wdt:P18 ?image . }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
    LIMIT 5
  `;

  try {
    const response = await fetch(WIKIDATA_SPARQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/sparql-results+json",
        "User-Agent": "AgeThePlayer/1.0 (Football Quiz App; contact@example.com)",
      },
      body: `query=${encodeURIComponent(sparqlQuery)}`,
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.log("    Rate limited, waiting 60 seconds...");
        await sleep(60000);
        return searchByLabel(name);
      }
      return null;
    }

    const data = await response.json();
    const results = data.results?.bindings as WikidataResult[];

    for (const result of results || []) {
      if (result.image?.value) {
        return result.image.value;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function searchByContains(name: string): Promise<string | null> {
  const sparqlQuery = `
    SELECT ?player ?playerLabel ?image WHERE {
      ?player wdt:P106 wd:Q937857 .
      ?player rdfs:label ?label .
      FILTER(LANG(?label) = "en")
      FILTER(CONTAINS(LCASE(?label), "${name.toLowerCase().replace(/"/g, '\\"')}"))
      OPTIONAL { ?player wdt:P18 ?image . }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
    LIMIT 3
  `;

  try {
    const response = await fetch(WIKIDATA_SPARQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/sparql-results+json",
        "User-Agent": "AgeThePlayer/1.0 (Football Quiz App; contact@example.com)",
      },
      body: `query=${encodeURIComponent(sparqlQuery)}`,
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.log("    Rate limited, waiting 60 seconds...");
        await sleep(60000);
        return searchByContains(name);
      }
      return null;
    }

    const data = await response.json();
    const results = data.results?.bindings as WikidataResult[];

    for (const result of results || []) {
      if (result.image?.value) {
        return result.image.value;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

function getSearchNames(fullName: string, shortName: string): string[] {
  const names: string[] = [];
  
  names.push(shortName);
  
  if (fullName !== shortName) {
    names.push(fullName);
  }
  
  const parts = shortName.split(" ");
  if (parts.length >= 2) {
    names.push(`${parts[0]} ${parts[parts.length - 1]}`);
  }
  
  return [...new Set(names)];
}

async function findPlayerImage(
  fullName: string,
  shortName: string
): Promise<string | null> {
  const searchNames = getSearchNames(fullName, shortName);
  
  for (const name of searchNames) {
    const result = await searchByLabel(name);
    if (result) return result;
    await sleep(RATE_LIMIT_MS);
  }
  
  const result = await searchByContains(shortName);
  if (result) return result;
  
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
    console.log(
      `[${i + 1}/${playersWithoutImages.length}] ${player.name}`
    );

    try {
      const imageUrl = await findPlayerImage(player.fullName, player.name);

      if (imageUrl) {
        await db
          .update(players)
          .set({ imageUrl })
          .where(eq(players.id, player.id));
        
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
