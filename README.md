### Requirement

Use sqlite-vec to store and search image-related and text data by semantic meaning using OpenAI Embeddings API.

The goal is to quickly find images or text that are similar in meaning, not just by keyword text matching.

This helps improve image suggestion and retrieval features in the AI image generation workflow.

### Notes

1. Use TypeScript (Node.js) for implementation.
2. Use OpenAI Embeddings API to vectorize (convert) text prompts into numeric vectors.
3. Store vectors using sqlite-vec for local semantic search.
4. Test with a small dataset (e.g., using about 100 to 500 rows of data.) for the POC.

#### Related Issues

1. Setup SQLite with [sqlite-vec](https://github.com/asg017/sqlite-vec?tab=readme-ov-file).
2. Connect to [OpenAI Embeddings API](https://platform.openai.com/docs/guides/embeddings).
3. Insert and search vectors in SQLite
