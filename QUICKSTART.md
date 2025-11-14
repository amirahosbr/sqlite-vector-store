# Quick Start

## Setup (30 seconds)

```bash
# 1. Install dependencies
npm install

# 2. Set your OpenAI API key
export OPENAI_API_KEY=sk-your-key-here

# 3. Run the demo
npm run demo
```

## What the Demo Does

1. Loads all JSON knowledge graph files from the `data` directory
2. Extracts text from each KG (summary, description, title, or name)
3. Generates embeddings via OpenAI's `text-embedding-3-small` model
4. Stores vectors in SQLite using sqlite-vec
5. Runs 7 semantic search queries
6. Shows the top 10 most similar knowledge graphs for each query

## Expected Output

```
=== SQLite Vector Store POC ===

Initializing database and embedding service...
Found 10 knowledge graph files

--- Indexing Knowledge Graphs ---
✓ food-1.json
✓ food-2.json
... (9 more files)

--- Database Stats ---
Total vectors: 10

--- Semantic Search Demo ---

Query: "i love pizza"
  food-1.json (1.0785)
  food-3.json (1.2654)
  ... (10 results)
```

## Next Steps

1. **Add your own knowledge graphs** - Place JSON files in `/data`
2. **Customize text extraction** - Edit `extractTextFromKnowledgeGraph()` in [src/embeddings.ts](src/embeddings.ts)
3. **Integrate into your app** - Import from `./src/index.ts`

## Cost Estimate

- text-embedding-3-small: ~$0.00002 per 1K tokens
- 100 knowledge graphs (~500 words each): ~$0.001
- Very cheap for POC!

## Key Files

- [src/main.ts](src/main.ts) - Main demo script with database, embeddings, and search logic
- [data/\*.json](data/) - Knowledge graph JSON files

See [SETUP.md](SETUP.md) for detailed documentation.
