## 1. Target

- Closes [#1](https://github.com/amirahosbr/sqlite-vector-store/issues/1)

## 2. Specification / Test Plan

Use sqlite-vec to store and search knowledge graph data by semantic meaning using OpenAI Embeddings API.

The goal is to find knowledge graph files that are similar in meaning, not just by keyword text matching.

Knowledge graphs are saved as JSON files in object storage. The vector database is used to resolve the path to the knowledge file based on semantic similarity.

**Core:** semantic understanding of text content to resolve knowledge graph file paths

**Tasks**

1. Setup SQLite with [sqlite-vec](https://github.com/asg017/sqlite-vec?tab=readme-ov-file).
2. Connect to [OpenAI Embeddings API](https://platform.openai.com/docs/guides/embeddings).
3. Insert and search vectors in SQLite.
4. Store minimal metadata alongside vectors.

## 3. Additional Instructions / Notes for Shipping (optional)

1. Use TypeScript (Node.js) for implementation.
2. Use OpenAI Embeddings API to vectorize (convert) text content into numeric vectors.
   - Use `text-embedding-3-small` model (cheapest).
3. Store vectors using sqlite-vec for local semantic search.
4. Test with a small dataset (e.g., using about 100 to 500 rows of data) for the POC.
5. Define the schema (simple schema).
6. Store the vector as binary data.
7. Require an OpenAI API key for embedding requests.

#### Database Schema

| Column          | Type                | Description                       |
| --------------- | ------------------- | --------------------------------- |
| `id`            | INTEGER PRIMARY KEY | Record ID                         |
| `src_file_path` | TEXT                | Path to knowledge graph JSON file |
| `vector`        | BLOB                | Embedded vector from OpenAI       |
| `created_at`    | DATETIME            | Timestamp                         |

## 4. Check before Review Request

- [ ] Self Review : I reviewed changes by myself and approved them.
  - Ensure there is no sensitive information, typos, unrelated changes, or debugging code.
- [ ] Evidence : I attached evidences to prove the changes.
  - Record and attach a demo video. For minor changes, attaching an image is also acceptable.
  - Evidences should be updated to the latest version when further changes are made.

## 5. Evidence

(Attach here before request review)
