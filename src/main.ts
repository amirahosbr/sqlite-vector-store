import dotenv from "dotenv";
import OpenAI from "openai";
import Database from "better-sqlite3";
import * as sqliteVec from "sqlite-vec";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

const __dirName = "./data/vectors.db";
const dataDir = "./data";

// Setup
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) throw new Error("OPENAI_API_KEY is required");

const db = new Database(__dirName);
const openai = new OpenAI({ apiKey });

// Initialize database
sqliteVec.load(db);
db.exec(`
  CREATE TABLE IF NOT EXISTS knowledge (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    src_file_path TEXT NOT NULL UNIQUE,
    vector BLOB NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);
db.exec(`
  CREATE VIRTUAL TABLE IF NOT EXISTS vec_knowledge
  USING vec0(
    knowledge_id INTEGER PRIMARY KEY,
    embedding FLOAT[1536]
  );
`);

// Index knowledge graphs
async function indexKnowledgeGraphs(dataDir: string) {
  const files = fs
    .readdirSync(dataDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(dataDir, f));

  for (const filePath of files) {
    const kg = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Generate embedding from summary or description
    const text = kg.summary || kg.description || kg.title || kg.name || "";
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    const embedding = new Float32Array(response.data[0].embedding);

    // Check if exists
    const existing = db
      .prepare("SELECT id FROM knowledge WHERE src_file_path = ?")
      .get(filePath) as { id: number } | undefined;

    let rowId: number;
    if (existing) {
      // Update existing
      db.prepare("UPDATE knowledge SET vector = ? WHERE id = ?").run(
        embedding,
        existing.id
      );
      db.prepare("DELETE FROM vec_knowledge WHERE knowledge_id = ?").run(
        existing.id
      );
      rowId = existing.id;
    } else {
      // Insert new
      const result = db
        .prepare("INSERT INTO knowledge (src_file_path, vector) VALUES (?, ?)")
        .run(filePath, embedding);
      rowId = Number(result.lastInsertRowid);
    }

    // Store embedding for search (use explicit integer cast)
    const stmt = db.prepare(
      `INSERT INTO vec_knowledge (knowledge_id, embedding) VALUES (${rowId}, ?)`
    );
    stmt.run(embedding);

    // const displayName = kg.summary || kg.description || kg.title || kg.name || path.basename(filePath);
    console.log(`✓ ${path.basename(filePath)}`);
  }
}

// Search by similarity
async function search(query: string, limit: number = 3) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });
  const queryEmbedding = new Float32Array(response.data[0].embedding);

  const results = db
    .prepare(
      `
        SELECT k.src_file_path, v.distance
        FROM vec_knowledge v
        LEFT JOIN knowledge k ON k.id = v.knowledge_id
        WHERE v.embedding MATCH ?
        AND k = ?
        ORDER BY v.distance
      `
    )
    .all(queryEmbedding, limit);

  return results;
}

// Main function
const main = async (): Promise<void> => {
  console.log("=== SQLite Vector Store POC ===\n");

  console.log("Initializing database and embedding service...");
  // Database and OpenAI already initialized above

  const kgFiles = fs
    .readdirSync(dataDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(dataDir, f));

  console.log(`Found ${kgFiles.length} knowledge graph files\n`);

  console.log("--- Indexing Knowledge Graphs ---");
  await indexKnowledgeGraphs(dataDir);

  console.log(`\n--- Database Stats ---`);
  const count = db.prepare("SELECT COUNT(*) as count FROM knowledge").get() as {
    count: unknown;
  };
  console.log(
    `Total vectors: ${typeof count.count === "number" ? count.count : 0}`
  );

  console.log("\n--- Semantic Search Demo ---\n");

  const queries = [
    "i love pizza",
    "i love desserts",
    "i love cakes",
    "i hate pizza",
    "i love cat",
    "i ride a bike",
    "pizza and cakes are delicious",
    "cloud computing is a technology",
    "i use react for my website",
    "which gender can get hypertension?",
  ];

  for (const query of queries) {
    console.log(`\nQuery: "${query}"`);
    const results = await search(query, 10); // top 10 results
    results.forEach((r) => {
      const row = r as { src_file_path: string; distance: number };
      console.log(
        `  ${path.basename(row.src_file_path)} (${row.distance.toFixed(4)})`
      );
    });
  }

  db.close();
  console.log("\n=== Demo Complete ===");
};

main();
