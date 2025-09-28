import type { Express } from "express";
import Anthropic from '@anthropic-ai/sdk';
import { z } from "zod";
import { getCachedData } from "./cache";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const DEFAULT_MODEL_STR = "claude-sonnet-4-20250514";

const chatRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  context_type: z.enum(["strategic", "practical", "finnish", "planning", "technical", "mcp", "tech_lead", "general"]).default("general")
});

export function registerStreamingRoutes(app: Express) {
  // Streaming chat endpoint
  app.post("/api/chat-stream", async (req, res) => {
    try {
      const { message, context_type } = chatRequestSchema.parse(req.body);
      
      // Set SSE headers
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      });

      // Check if Anthropic API key is available
      if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === '') {
        res.write(`data: ${JSON.stringify({
          type: 'error',
          message: 'AI-avustaja ei ole käytettävissä demo-versiossa.'
        })}\n\n`);
        res.end();
        return;
      }

      const normalizeText = (text: string) => {
        if (!text || typeof text !== 'string') return '';
        return text
          .replace(/[^\x00-\x7F]/g, (char) => {
            const replacements: Record<string, string> = {
              "\u2013": "-", "\u2014": "-", "\u2018": "'", "\u2019": "'",
              "\u201C": '"', "\u201D": '"', "\u2026": "...", "\u00A0": " ",
              "ä": "ä", "ö": "ö", "å": "å", "Ä": "Ä", "Ö": "Ö", "Å": "Å"
            };
            return replacements[char] || "";
          })
          .replace(/\s+/g, ' ')
          .trim();
      };

      // Get context data
      const cachedData = getCachedData();
      const cases = cachedData.cases;

      // Build system prompt based on context
      let systemPrompt = `Toimit asiantuntijana, joka auttaa Humm Group Oy:ta ottamaan tekoäly käyttöön asiakaspalvelussa. Vastaa suomeksi ja keskity käytännöllisiin, mitattaviin tuloksiin.

TÄRKEÄÄ: Vastaa AINA JSON-muodossa:
{
  "response": "Kattava 3-5 kappaleen vastaus...",
  "followUpQuestions": ["Jatkokysymys1?", "Jatkokysymys2?"]
}`;

      if (context_type === "strategic") {
        systemPrompt += `\n\nFokus: Strateginen päätöksenteko ja johtaminen. Anna konkreettisia suosituksia Humm Group Oy:n johdolle.`;
      }

      // Create streaming request
      const stream = await anthropic.messages.create({
        model: DEFAULT_MODEL_STR,
        max_tokens: 2500,
        temperature: 0.8,
        system: systemPrompt,
        messages: [{ role: 'user', content: normalizeText(message) }],
        stream: true
      });

      let fullResponse = '';

      // Handle streaming response
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          const text = (chunk.delta as any).text;
          fullResponse += text;
          
          // Send chunk to client
          res.write(`data: ${JSON.stringify({
            type: 'chunk',
            text: text
          })}\n\n`);
        }
      }

      // Parse final response and send follow-up questions
      try {
        const cleanContent = fullResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        const structuredResponse = JSON.parse(cleanContent);
        
        if (structuredResponse.followUpQuestions) {
          res.write(`data: ${JSON.stringify({
            type: 'follow_up',
            questions: structuredResponse.followUpQuestions.slice(0, 3)
          })}\n\n`);
        }
      } catch (parseError) {
        // Send fallback follow-up questions
        res.write(`data: ${JSON.stringify({
          type: 'follow_up',
          questions: [
            "Mikä on AI-toteutuksen takaisinmaksuaika?",
            "Mitä riskejä AI-käyttöönotossa tulee huomioida?"
          ]
        })}\n\n`);
      }

      // End stream
      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      res.end();

    } catch (error) {
      console.error("Streaming chat error:", error);
      res.write(`data: ${JSON.stringify({
        type: 'error',
        message: 'Virhe käsiteltäessä viestiä'
      })}\n\n`);
      res.end();
    }
  });
}