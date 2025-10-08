/**
 * RAG API ROUTES
 *
 * OPPITUNTI: REST API Design for RAG
 * -----------------------------------
 * RAG-sovellus tarvitsee kolme keskeistä endpointia:
 *
 * 1. POST /api/rag/upload - Lataa ja prosessoi dokumentteja
 * 2. POST /api/rag/chat - Kysy kysymys RAG-kontekstilla
 * 3. GET /api/rag/documents - Lista dokumenteista
 * 4. DELETE /api/rag/documents/:id - Poista dokumentti
 *
 * ARKKITEHTUURI:
 * User → Express → Document Processor → Vector Store → OpenAI Embeddings
 *      ← JSON ←                       ← AI Response ← OpenAI GPT-4
 */

import type { Express, Request, Response } from "express";
import multer from "multer";
import { vectorStore, type Document } from "./vectorStore.js";
import { processFile } from "./documentProcessor.js";
import Anthropic from "@anthropic-ai/sdk";

/**
 * OPPITUNTI: Multer - File Upload Middleware
 * ------------------------------------------
 * Multer käsittelee multipart/form-data (tiedosto-uploadit)
 * - memoryStorage: Tallenna tiedosto muistiin (Buffer)
 * - diskStorage: Tallenna levylle (production)
 * - S3/Supabase Storage: Tallenna pilveen (tuotanto)
 */
const upload = multer({
  storage: multer.memoryStorage(), // Tallenna RAM:iin (PoC)
  limits: {
    fileSize: 10 * 1024 * 1024, // Max 10MB per file
  },
  fileFilter: (req, file, cb) => {
    // Hyväksy vain PDF ja tekstitiedostot
    const allowedMimes = [
      'application/pdf',
      'text/plain',
      'text/markdown',
      'application/json',
    ];

    const allowedExts = ['.pdf', '.txt', '.md', '.json'];
    const ext = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));

    if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Tiedostotyyppi ei tuettu: ${file.mimetype}. Tuetut: PDF, TXT, MD, JSON`));
    }
  },
});

// Anthropic client for RAG responses
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Rekisteröi RAG-endpointit
 */
export function registerRAGRoutes(app: Express) {
  console.log("📚 Registering RAG routes...");

  /**
   * ENDPOINT 1: Upload Document
   *
   * OPPITUNTI: File Upload Flow
   * 1. Multer vastaanottaa tiedoston → req.file
   * 2. Prosessoi tiedosto (PDF parse, chunking)
   * 3. Generoi embeddings
   * 4. Tallenna vector storeen
   *
   * CURL TEST:
   * curl -X POST http://localhost:5000/api/rag/upload \
   *   -F "file=@humm_2024.pdf"
   */
  app.post("/api/rag/upload", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No file uploaded. Use form-data with 'file' field.",
        });
      }

      console.log(`\n📤 Upload received: ${req.file.originalname} (${req.file.size} bytes)`);

      // Prosessoi tiedosto → dokumentit
      const documents = await processFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      // Lisää vector storeen (embeddings automaattisesti)
      await vectorStore.addDocuments(documents);

      // Palauta success
      res.json({
        success: true,
        message: `Successfully processed ${req.file.originalname}`,
        data: {
          filename: req.file.originalname,
          chunks: documents.length,
          totalChars: documents.reduce((sum, d) => sum + d.pageContent.length, 0),
        },
      });
    } catch (error: any) {
      console.error("❌ Upload error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to process document",
      });
    }
  });

  /**
   * ENDPOINT 2: RAG Chat
   *
   * OPPITUNTI: RAG Query Flow
   * 1. Vastaanota käyttäjän kysymys
   * 2. Etsi relevantteja dokumentteja (similarity search)
   * 3. Rakenna prompti: system + retrieved context + user query
   * 4. Lähetä Claude:lle
   * 5. Stream vastaus käyttäjälle
   *
   * CURL TEST:
   * curl -X POST http://localhost:5000/api/rag/chat \
   *   -H "Content-Type: application/json" \
   *   -d '{"message": "Mikä oli Hummin liikevaihto 2024?"}'
   */
  app.post("/api/rag/chat", async (req: Request, res: Response) => {
    try {
      const { message, topK = 5 } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({
          success: false,
          error: "Message is required (string)",
        });
      }

      console.log(`\n💬 RAG Chat query: "${message}"`);

      // 1. Etsi relevantteja dokumentteja
      const results = await vectorStore.similaritySearch(message, topK);

      if (results.length === 0) {
        return res.json({
          success: true,
          response: "En löytänyt relevantteja dokumentteja vastatakseni kysymykseesi. Lataa dokumentteja /api/rag/upload -endpointtiin.",
          sources: [],
        });
      }

      // 2. Rakenna konteksti dokumenteista
      const context = results
        .map((r, i) => {
          return `
[Lähde ${i + 1}: ${r.document.metadata.source}]
${r.document.pageContent}
          `.trim();
        })
        .join("\n\n---\n\n");

      // 3. Lähetä Claude:lle streaming-modessa
      console.log(`📊 Retrieved ${results.length} relevant documents`);
      console.log(`📝 Context length: ${context.length} characters`);

      const systemPrompt = `Olet Humm Group Oy:n AI-assistentti. Vastaa kysymyksiin perustuen annettuun kontekstiin.

TÄRKEÄÄ:
- Käytä VAIN annettua kontekstia vastauksissa
- Viittaa lähteisiin vastauksissasi (esim. "Lähteen 1 mukaan...")
- Jos vastaus ei löydy kontekstista, sano "En löydä vastausta annetuista dokumenteista"
- Ole tarkka numeroiden ja faktojen kanssa
- Vastaa suomeksi

KONTEKSTI:
${context}`;

      // Stream response
      const stream = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        temperature: 0.3, // Matala temp = tarkemmat vastaukset
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        stream: true,
      });

      // Set headers for streaming
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // Stream chunks to client
      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          res.write(`data: ${JSON.stringify({ chunk: event.delta.text })}\n\n`);
        }
      }

      // Send sources at the end
      const sources = results.map(r => ({
        source: r.document.metadata.source,
        similarity: r.similarity,
        chunk: r.document.metadata.chunk,
        preview: r.document.pageContent.substring(0, 150) + "...",
      }));

      res.write(`data: ${JSON.stringify({ sources, done: true })}\n\n`);
      res.end();
    } catch (error: any) {
      console.error("❌ RAG chat error:", error);

      // If streaming hasn't started, send JSON error
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: error.message || "Failed to process chat request",
        });
      } else {
        // If streaming started, send error event
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
      }
    }
  });

  /**
   * ENDPOINT 3: List Documents
   *
   * OPPITUNTI: Document Management
   * - Listaa kaikki vector storeen ladatut dokumentit
   * - Ryhmittele lähteen mukaan
   * - Näytä tilastot
   */
  app.get("/api/rag/documents", (req: Request, res: Response) => {
    try {
      const stats = vectorStore.getStats();
      const documents = vectorStore.getAllDocuments();

      // Ryhmittele lähteen mukaan
      const bySource = new Map<string, Document[]>();
      for (const doc of documents) {
        const source = doc.metadata.source;
        if (!bySource.has(source)) {
          bySource.set(source, []);
        }
        bySource.get(source)!.push(doc);
      }

      const groupedDocs = Array.from(bySource.entries()).map(([source, docs]) => ({
        source,
        chunkCount: docs.length,
        totalChars: docs.reduce((sum, d) => sum + d.pageContent.length, 0),
        uploadedAt: docs[0].metadata.uploadedAt,
        chunks: docs.map(d => ({
          id: d.id,
          preview: d.pageContent.substring(0, 100) + "...",
          chars: d.pageContent.length,
        })),
      }));

      res.json({
        success: true,
        stats,
        documents: groupedDocs,
      });
    } catch (error: any) {
      console.error("❌ List documents error:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  /**
   * ENDPOINT 4: Delete Document
   *
   * OPPITUNTI: Document Lifecycle
   * - Poista dokumentti ID:n perusteella
   * - Tuotannossa: poista myös S3:sta/Pinecone:sta
   */
  app.delete("/api/rag/documents/:id", (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = vectorStore.deleteDocument(id);

      if (deleted) {
        res.json({
          success: true,
          message: `Document ${id} deleted`,
        });
      } else {
        res.status(404).json({
          success: false,
          error: `Document ${id} not found`,
        });
      }
    } catch (error: any) {
      console.error("❌ Delete document error:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  /**
   * ENDPOINT 5: Clear All Documents
   *
   * OPPITUNTI: Bulk Operations
   * - Tyhjennä koko vector store
   * - Hyödyllinen testauksessa
   */
  app.post("/api/rag/clear", (req: Request, res: Response) => {
    try {
      const count = vectorStore.size;
      vectorStore.clear();

      res.json({
        success: true,
        message: `Cleared ${count} documents`,
      });
    } catch (error: any) {
      console.error("❌ Clear documents error:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  console.log("✅ RAG routes registered:");
  console.log("   POST   /api/rag/upload");
  console.log("   POST   /api/rag/chat");
  console.log("   GET    /api/rag/documents");
  console.log("   DELETE /api/rag/documents/:id");
  console.log("   POST   /api/rag/clear");
}
