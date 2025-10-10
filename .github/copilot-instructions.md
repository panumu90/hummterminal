## Quick instructions for AI coding agents

Purpose: Help an AI code-assistant be immediately productive in this repository by pointing to the runtime entrypoints, important files, developer commands, and project-specific conventions.

- Dev / build shortcuts (exact):
  - Start development server: `npm run dev` (runs `tsx client/server/index.ts` and Vite middleware)
  - Build for production: `npm run build` (runs `vite build` and bundles server with `esbuild`)
  - Start production server: `npm run start` (runs `node dist/index.js`)
  - Typecheck: `npm run check`
  - Push DB migrations (drizzle): `npm run db:push`

- Important env vars (check `.env.example`):
  - `ANTHROPIC_API_KEY` — if missing, chat AI endpoints return a demo message. Used in `client/server/routes.ts`.
  - `OPENAI_API_KEY` — required for embeddings / RAG (`client/server/rag/embeddings.ts`).
  - `DATABASE_URL` — required by `drizzle.config.ts` for migrations.
  - `PORT` — server listens on this port (defaults to 5000) in `client/server/index.ts`.

- High-level architecture (single-repo):
  - The server entrypoint is `client/server/index.ts`. It registers routes and either sets up Vite dev middleware (`client/server/vite.ts`) or serves static `dist/public` in production.
  - Frontend lives under `client/src` (aliases via `vite.config.ts`: `@` → `client/src`, `@shared` → `shared`).
  - Shared types and DB schema live under `shared/` (see `shared/schema.ts`).
  - RAG and embeddings live in `client/server/rag/`:
    - `vectorStore.ts` — in-memory singleton vector store (non-persistent PoC).
    - `embeddings.ts` — uses OpenAI `text-embedding-3-small` via LangChain wrapper.
    - `autoImport.ts` / `documentProcessor.ts` — import attached assets into RAG.

- RAG / AI conventions to preserve:
  - Default Anthropic model: `DEFAULT_MODEL_STR = "claude-sonnet-4-20250514"` is declared in `client/server/routes.ts`. Do not change this unless asked.
  - If `OPENAI_API_KEY` is absent, RAG features will not run; the code checks keys and falls back gracefully.
  - `attached_assets/` is considered the primary ground-truth for user-supplied documents; the server caches and prioritizes these (see `client/server/cache.ts` and `client/server/routes.ts` readAttachedAssets logic).
  - PDF parsing is optional: code dynamically imports `pdf-parse`; if not installed, PDFs are noted but skipped.

- Developer patterns and gotchas:
  - Server runs as ESM TypeScript (tsx/esbuild). Dev server runs via `tsx client/server/index.ts` (script `dev`) and uses Vite middleware — edits to server routes require a server restart in some environments.
  - `vectorStore` is in-memory. For persistent RAG, swap to pgvector/Chroma/Pinecone and update auto-import logic.
  - The code contains defensive Unicode-cleaning for Finnish characters — when editing message/response logic prefer preserving `ä/ö/å` as the code does.
  - Logging and short JSON truncation are applied in `client/server/index.ts` for `/api` routes; keep structured JSON responses small to avoid log truncation.

- Files to inspect first when making feature changes:
  - `client/server/routes.ts` — API surface, Anthropic usage, endpoints (`/api/chat`, `/api/questions/:id/answer`, `/api/mcp/content`).
  - `client/server/rag/vectorStore.ts` and `client/server/rag/embeddings.ts` — RAG core and embedding config.
  - `client/server/cache.ts` and `client/server/storage.ts` — caching and in-memory data used across the app.
  - `vite.config.ts` and `client/server/vite.ts` — dev-server behavior, aliases, and production build output (`dist/public`).
  - `drizzle.config.ts` and `shared/schema.ts` — DB migration and schema configuration.

- When editing LLM prompts or behavior:
  - Search for the comment block in `client/server/routes.ts` that instructs Anthropic model preference. It documents the preferred model and should be preserved or updated only with explicit direction from maintainers.
  - For AI-enhancement of static answers see `/api/questions/:questionId/answer` — enhancements are optional and guarded by try/catch; preserve fallbacks.

- Testing & validation notes:
  - Quick smoke: run `npm run dev` then call `POST /api/chat` or GET `/api/cases`.
  - Embeddings tests exist as exported test functions in `client/server/rag/embeddings.ts` and `vectorStore.ts` — you can run them directly (node with ts-node/esbuild context) in dev if `OPENAI_API_KEY` is set.

If anything here is unclear or you'd like more detail on a specific area (RAG pipeline, Anthropic/OpenAI calls, or DB migrations), tell me which part to expand and I will iterate.
