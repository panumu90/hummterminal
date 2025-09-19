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
      
      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-placeholder') {
        return res.status(200).json({
          response: 'Anteeksi, AI-avustaja ei ole tällä hetkellä käytettävissä. Tämä on demo-versio jossa tarvitaan OpenAI API-avain toimiakseen. Voit tarkastella case-esimerkkejä sivun vasemmasta reunasta.'
        });
      }
      
      // Get all cases for context with minimal normalization
      const cases = await storage.getAllCases();
      const normalizeText = (text: string) => {
        // Only normalize problematic characters that cause header encoding issues
        return text
          .replace(/[\u2013\u2014]/g, '-')   // Replace em-dash and en-dash with regular dash
          .replace(/[\u201C\u201D]/g, '"')  // Replace smart quotes with regular quotes
          .replace(/[\u2018\u2019]/g, "'")  // Replace smart apostrophes with regular apostrophes
          .replace(/\s+/g, ' ')            // Normalize whitespace
          .trim();
      };
      
      const casesContext = cases.map(c => 
        `${normalizeText(c.company)} (${normalizeText(c.country)}, ${normalizeText(c.industry)}): ${normalizeText(c.full_text)}`
      ).join('\n\n');

      // Create compact case summaries to avoid encoding issues while preserving context
      const compactCases = cases.map(c => {
        const company = normalizeText(c.company);
        const country = normalizeText(c.country);
        const industry = normalizeText(c.industry);
        // Extract key metrics and benefits from full text (first 300 chars to keep prompt manageable)
        const summary = normalizeText(c.full_text.substring(0, 300));
        return `${company} (${country}, ${industry}): ${summary}...`;
      }).join('\n\n');

      const systemPrompt = `You are an AI expert helping humm.fi team understand successful AI customer service implementations.

You have information about these 6 successful cases:

${compactCases}

Always respond in Finnish and focus on:
1. Practical implementation tips for humm.fi
2. Technical details from the cases
3. Cost savings and benefits mentioned
4. Learning points and challenges
5. Applicability to Finnish companies

If the question is not related to these cases, tell that you can only help with these 6 AI customer service implementations.

Keep answers informative but concise (max 200 words).`;

      // Try OpenAI request with retry for transient failures
      let response;
      try {
        response = await openai.chat.completions.create({
          model: GPT_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: normalizeText(message) }
          ],
          max_tokens: 500,
        });
      } catch (error: any) {
        console.error("OpenAI request failed:", error.name, error.message);
        // Return graceful fallback instead of 500
        return res.status(200).json({
          response: 'Anteeksi, tapahtui virhe AI-avustajassa. Voit silti tarkastella case-esimerkkejä sivun vasemmasta reunasta ja kokeilla kysyä uudelleen hetken päästä.'
        });
      }

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
