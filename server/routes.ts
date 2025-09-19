import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";
import { z } from "zod";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "sk-placeholder"
});

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const GPT_MODEL = "gpt-5";

const chatRequestSchema = z.object({
  message: z.string().min(1).max(1000)
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all cases
  app.get("/api/cases", async (req, res) => {
    try {
      const cases = await storage.getAllCases();
      res.json(cases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cases" });
    }
  });

  // Get case by ID
  app.get("/api/cases/:id", async (req, res) => {
    try {
      const case_ = await storage.getCaseById(req.params.id);
      if (!case_) {
        return res.status(404).json({ error: "Case not found" });
      }
      res.json(case_);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch case" });
    }
  });

  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = chatRequestSchema.parse(req.body);
      console.log("Received message:", message);
      
      // Get all cases for context and sanitize for ASCII
      const cases = await storage.getAllCases();
      const sanitizeText = (text: string) => {
        return text
          .replace(/[–—]/g, '-')           // en-dash, em-dash to hyphen
          .replace(/[""]/g, '"')           // smart quotes to regular quotes
          .replace(/['']/g, "'")           // smart apostrophes to regular apostrophes
          .replace(/[^\x00-\x7F]/g, '?')   // Replace any non-ASCII chars with ?
          .normalize('NFD')                // Decompose accented characters
          .replace(/[\u0300-\u036f]/g, '') // Remove accents
          .replace(/\s+/g, ' ')            // Normalize whitespace
          .trim();
      };
      
      const casesContext = cases.map(c => 
        `${sanitizeText(c.company)} (${sanitizeText(c.country)}, ${sanitizeText(c.industry)}): ${sanitizeText(c.full_text)}`
      ).join('\n\n');

      const systemPrompt = `You are an AI expert helping humm.fi team understand successful AI customer service implementations. Always respond in Finnish and focus on practical implementation tips, technical details, cost savings and benefits. Keep answers informative but concise (max 200 words).`;

      const response = await openai.chat.completions.create({
        model: GPT_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: sanitizeText(message) }
        ],
        max_completion_tokens: 500,
      });

      const aiResponse = response.choices[0].message.content || "Anteeksi, en pystynyt käsittelemään kysymystäsi.";

      // Save chat message
      await storage.saveChatMessage({
        message,
        response: aiResponse,
        timestamp: Date.now()
      });

      res.json({ response: aiResponse });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // Get chat history
  app.get("/api/chat/history", async (req, res) => {
    try {
      const history = await storage.getChatHistory();
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
