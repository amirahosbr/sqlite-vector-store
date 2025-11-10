### Requirement

Use sqlite-vec to store and search text or image-related by semantic meaning using OpenAI Embeddings API.

The goal is to quickly find text or images that are similar in meaning, not just by keyword text matching.

This helps improve text or image suggestion and retrieval features in the AI image generation workflow.

core: semantic understanding of image + text prompts

### Notes

1. Use TypeScript (Node.js) for implementation.
2. Use OpenAI Embeddings API to vectorize (convert) text prompts into numeric vectors.
   - use text `text-embedding-3-small` model (cheapest).
3. Store vectors using sqlite-vec for local semantic search.
4. Test with a small dataset (e.g., using about 100 to 500 rows of data.) for the POC.
5. Define the schema (simple schema).
6. Store the vector as binary data.
7. Require an OpenAI API key for embedding requests.

### Schema

| Column       | Type                | Description                  |
| ------------ | ------------------- | ---------------------------- |
| `id`         | INTEGER PRIMARY KEY | Record ID                    |
| `prompt`     | TEXT                | Original text prompt         |
| `vector`     | BLOB                | Embedded vector from OpenAI  |
| `image_url`  | TEXT                | Image path or URL (optional) |
| `created_at` | DATETIME            | Timestamp                    |

#### Related Issues

1. Setup SQLite with [sqlite-vec](https://github.com/asg017/sqlite-vec?tab=readme-ov-file).
2. Connect to [OpenAI Embeddings API](https://platform.openai.com/docs/guides/embeddings).
3. Insert and search vectors in SQLite
4. Decide how images are represented — URLs, file paths, base64, or metadata only. (file paths probably the best fit)
5. Define what metadata to store alongside vectors (e.g., creator, tags, model version). (minimal)
6. Other alternatives to OpenAI Embeddings API?
