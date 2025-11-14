# SQLite Vector Store

A semantic search system for knowledge graphs using SQLite with [sqlite-vec](https://github.com/asg017/sqlite-vec) and OpenAI embeddings. Find knowledge graph files by semantic meaning, not just keyword matching.

## Overview

This project enables semantic search over knowledge graphs stored as JSON files. Instead of traditional text matching, it uses vector embeddings to find knowledge graphs that are similar in meaning to your query.

Knowledge graphs are saved as JSON files in object storage. The vector database is used to resolve the path to the knowledge file based on semantic similarity.

**Key Features:**

- Store and search knowledge graphs by semantic similarity
- Uses OpenAI's `text-embedding-3-small` model for cost-effective embeddings
- Local SQLite database with sqlite-vec extension
- TypeScript implementation with Node.js

## Quick Start

See [QUICKSTART.md](QUICKSTART.md) for detailed setup instructions.

```bash
# Install dependencies
npm install

# Set your OpenAI API key
export OPENAI_API_KEY=sk-your-key-here

# Run
npm run demo
```

## How It Works

### Understanding Embeddings

1. **Embedding vector** is a long list of numbers that represents the meaning of text, image, or data → `"apple fruit"` → `[0.12, -0.44, ..., 0.05]`. The closer the vectors, the more similar meanings.

2. **sqlite-vec** is a vector extension for SQLite — it can store these numeric vectors and search by semantic similarity. Cannot be plain text because it only matches exact words, not meaning.

3. **sqlite-vec** returns the distance between vectors → smaller = more similar meaning (typically 0.0 – 1.5).

4. **Two ways to measure similarity** between embeddings:
   - **Cosine distance**: Checks if vectors point the same way → suitable for text (used for meaning)
   - **Euclidean distance**: Measures straight-line space between points → not suitable for text (used for images/maps)

### Database Schema

| Column          | Type                | Description                       |
| --------------- | ------------------- | --------------------------------- |
| `id`            | INTEGER PRIMARY KEY | Record ID                         |
| `src_file_path` | TEXT                | Path to knowledge graph JSON file |
| `vector`        | BLOB                | Embedded vector from OpenAI       |
| `created_at`    | DATETIME            | Timestamp                         |

## Glossary

| Term          | What It Means                                              | Example              |
| ------------- | ---------------------------------------------------------- | -------------------- |
| **Embedding** | A list of numbers that **means** the text                  | `[0.12, -0.44, ...]` |
| **Vector**    | Same as embedding — just the list of numbers               | `[0.12, -0.44, ...]` |
| **Distance**  | How **different** two vectors are (smaller = more similar) | `0.087`              |

## Project Structure

- `src/database.ts` - SQLite + sqlite-vec integration
- `src/embeddings.ts` - OpenAI API + text extraction
- `src/demo.ts` - Demo script
- `data/` - Sample knowledge graph JSON files

## Requirements

- Node.js
- OpenAI API key
- SQLite with sqlite-vec extension (installed via npm)

## Related Links

- Repository: https://github.com/amirahosbr/sqlite-vector-store
- sqlite-vec: https://github.com/asg017/sqlite-vec
- OpenAI Embeddings API: https://platform.openai.com/docs/guides/embeddings
