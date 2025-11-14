# Setup and Usage Guide

## Prerequisites

1. Node.js 18+ installed
2. OpenAI API key

## Installation

1. Install dependencies:

```bash
npm install
```

2. Set up your OpenAI API key:

```bash
export OPENAI_API_KEY=your-api-key-here
```

Or create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
# Edit .env and add your API key
```

## Running the Demo

Run the demo to see semantic search in action:

```bash
npm run demo
```

This will:

1. Initialize the SQLite database with sqlite-vec
2. Load sample knowledge graph files from `/data`
3. Generate embeddings using OpenAI's `text-embedding-3-small` model
4. Store vectors in the database
5. Perform semantic searches with various queries
6. Display the most similar knowledge graphs for each query

## Project Structure

```
sqlite-vector-store/
├── src/
│   ├── database.ts      # VectorDatabase class with sqlite-vec
│   ├── embeddings.ts    # EmbeddingService and text extraction
│   ├── demo.ts          # Demo script
│   └── index.ts         # Main exports
├── data/
│   ├── sample-kg-*.json # Sample knowledge graphs
│   └── vectors.db       # SQLite database (created on first run)
└── package.json
```

## Using the Library

### Basic Usage

```typescript
import {
  VectorDatabase,
  EmbeddingService,
  extractTextFromKnowledgeGraph,
} from "./src";

// Initialize
const db = new VectorDatabase("./data/vectors.db");
const embeddingService = new EmbeddingService(process.env.OPENAI_API_KEY!);

// Load a knowledge graph
const kg = JSON.parse(fs.readFileSync("path/to/kg.json", "utf-8"));

// Extract text and generate embedding
const text = extractTextFromKnowledgeGraph(kg);
const embedding = await embeddingService.embed(text);

// Store in database
const id = db.insertVector("path/to/kg.json", embedding);

// Search
const queryEmbedding = await embeddingService.embed("your search query");
const results = db.search(queryEmbedding, 10); // top 10 results

// Results contain: id, src_file_path, distance, created_at
results.forEach((result) => {
  console.log(`${result.src_file_path}: ${result.distance}`);
});
```

### API Reference

#### VectorDatabase

- `constructor(dbPath: string)` - Initialize database
- `insertVector(filePath: string, embedding: number[]): number` - Insert vector
- `search(queryEmbedding: number[], limit: number): SearchResult[]` - Search similar vectors
- `getCount(): number` - Get total vector count
- `getAllFilePaths(): string[]` - Get all indexed file paths
- `close(): void` - Close database connection

#### EmbeddingService

- `constructor(apiKey: string)` - Initialize with OpenAI API key
- `embed(text: string): Promise<number[]>` - Generate embedding for text
- `embedBatch(texts: string[]): Promise<number[][]>` - Batch embed multiple texts

#### Utility Functions

- `extractTextFromKnowledgeGraph(kg: any): string` - Extract searchable text from KG JSON

## Customizing Text Extraction

The `extractTextFromKnowledgeGraph` function in [src/embeddings.ts](src/embeddings.ts) extracts text from knowledge graph JSON. Customize this based on your KG structure:

```typescript
export function extractTextFromKnowledgeGraph(kg: any): string {
  // Add your custom extraction logic here
  // For example, extract specific fields or concatenate all text
  const parts: string[] = [];

  if (kg.myCustomField) parts.push(kg.myCustomField);
  // ... more extraction logic

  return parts.join(" ");
}
```

## Database Schema

### knowledge_vectors table

| Column        | Type                | Description                     |
| ------------- | ------------------- | ------------------------------- |
| id            | INTEGER PRIMARY KEY | Auto-increment ID               |
| src_file_path | TEXT                | Path to knowledge graph file    |
| vector        | BLOB                | Embedding vector (Float32Array) |
| created_at    | DATETIME            | Timestamp                       |

### vec_knowledge virtual table

- Used by sqlite-vec for efficient vector similarity search
- Contains embeddings as 1536-dimensional float vectors

## Notes

- Embeddings are 1536-dimensional (text-embedding-3-small model)
- Vectors are stored as Float32Array in BLOB format
- Search uses cosine similarity via sqlite-vec
- Database is created automatically on first run

## Troubleshooting

**Error: OPENAI_API_KEY is required**

- Make sure you've set the environment variable or created a `.env` file

**Error loading sqlite-vec extension**

- Ensure `sqlite-vec` package is installed: `npm install sqlite-vec`
- Check that your Node.js version is 18+

**Search returns no results**

- Verify vectors are inserted: Check `db.getCount()`
- Ensure query embedding has same dimensions (1536)
