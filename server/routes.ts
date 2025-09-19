import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";
import { z } from "zod";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "sk-placeholder",
  fetch: (url, init) => {
    // Sanitize all headers to ASCII to prevent ByteString conversion errors
    const headers = new Headers(init?.headers || {});
    headers.forEach((value, key) => {
      const asciiKey = key.replace(/[^\x00-\x7F]/g, '');
      const asciiValue = String(value).replace(/[^\x00-\x7F]/g, '');
      if (asciiKey !== key) {
        headers.delete(key);
      }
      headers.set(asciiKey, asciiValue);
    });
    return fetch(url, { ...init, headers });
  }
});

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const GPT_MODEL = "gpt-5";

const chatRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  context_type: z.enum(["strategic", "practical", "finnish", "planning", "general"]).default("general")
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

  // Get category summary
  app.get("/api/categories/:category/summary", async (req, res) => {
    try {
      const { category } = req.params;
      const cases = await storage.getAllCases();
      const trends = await storage.getAllTrends();
      
      let summary = "";
      
      // Finnish AI Trends Categories
      if (category === "autonomous-agents") {
        const agentTrends = trends.filter(t => t.category === "autonomous_agents");
        summary = "🤖 **Autonomiset AI-agentit tehostavat asiakaspalvelua**\n\n" +
          "• AI-agentit tulevat tavanomaisiksi osaksi asiakaspalvelua\n" +
          "• Integroituvat asiakasviestintaalustoihin hoitamaan yksinkertaisia kyselyitä\n" +
          "• Lyhentävät jonotusaikoja ja mahdollistavat hyperpersoonoidun tuen\n" +
          "• Monista kuluttajista tulee AI-kanavan 'natiiveja'\n\n" +
          "💡 Yrityksillä ilman toimivaa AI-palvelukanavaa on riski asiakasuskollisuuden heikkenemiseen.";
      } else if (category === "ai-investments") {
        summary = "💰 **AI-investointien tuotto-odotukset kypsyvät**\n\n" +
          "• 49% AI-johtajista odottaa tuloksia 1-3 vuodessa\n" +
          "• 44% odottaa tuloksia 3-5 vuodessa\n" +
          "• Hype on laantumassa ja johtajat painottavat realistisempia mittareita\n" +
          "• Ennakoiva AI tulee takaisin generatiivisen AI:n rinnalle\n\n" +
          "⚠️ Jopa 30% AI-projekteista saatetaan hylätä huonon datan tai kustannusten vuoksi.";
      } else if (category === "hyperpersonalization") {
        summary = "🎯 **Hyperpersoonallistaminen ja datan laatu**\n\n" +
          "• Generatiivinen AI ja monimodaaliset mallit mahdollistavat yksilöllisen vuorovaikutuksen\n" +
          "• Analysoidaan ostotietoja, selaushistoriaa ja tunnesävyä\n" +
          "• Palvelut ovat entistä henkilökohtaisempia ja tehokkaampia\n" +
          "• Datan laatu on kriittinen menestyksen edellytys\n\n" +
          "📊 AI ei pysty tarjoamaan täyttä asiakasymmärrystä, jos data on hajaantuneena eri järjestelmiin.";
      } else if (category === "proactive-service") {
        summary = "🔮 **Proaktiivinen kanavien yli ulottuva palvelu**\n\n" +
          "• Siirtyminen reaktiivisesta proaktiiviseen asiakkaan ilahduttamiseen\n" +
          "• AI yhdistää eri järjestelmiä tarjoamaan ajantasaista apua\n" +
          "• Reaaliaikainen kanavien välinen näkyvyys mahdollistaa sentimentin ymmärtämisen\n" +
          "• Esim. lentoyhtiöt rebookaavat lennot automaattisesti\n\n" +
          "🎪 Intentional channel strategies ovat välttämättömiä menestymiselle.";
      }
      
      // Case Study Categories
      else if (category === "finnish-cases") {
        const finnishCases = cases.filter(c => c.country === "Suomi" || c.country === "Suomi/Pohjoismaat");
        summary = "🇫🇮 **Suomalaiset AI-asiakaspalvelutoteutukset**\n\n" +
          finnishCases.map(c => 
            `**${c.company}** (${c.industry})\n` +
            `${c.description}\n` +
            `${Array.isArray(c.key_metrics) ? c.key_metrics.map((m: any) => `• ${m.label}: ${m.value}`).join('\n') : ''}\n`
          ).join('\n') +
          "\n🌟 Suomalaiset yritykset ovat ottaneet AI:n hyvin käyttöön asiakaspalvelussa.";
      } else if (category === "international-cases") {
        const intlCases = cases.filter(c => c.country !== "Suomi" && c.country !== "Suomi/Pohjoismaat");
        summary = "🌍 **Kansainväliset AI-toteutukset**\n\n" +
          intlCases.slice(0, 4).map(c => 
            `**${c.company}** (${c.country}, ${c.industry})\n` +
            `${c.description}\n` +
            `${Array.isArray(c.key_metrics) ? c.key_metrics.map((m: any) => `• ${m.label}: ${m.value}`).join('\n') : ''}\n`
          ).join('\n') +
          "\n🚀 Globaalit johtajat näyttävät tietä AI-asiakaspalvelussa.";
      } else if (category === "by-industry") {
        const industries = Array.from(new Set(cases.map(c => c.industry)));
        summary = "🏭 **AI-toteutukset toimialoittain**\n\n" +
          industries.map(industry => {
            const industryCases = cases.filter(c => c.industry === industry);
            return `**${industry}**: ${industryCases.length} toteutusta\n` +
              industryCases.slice(0, 2).map(c => `• ${c.company}: ${c.solution_name}`).join('\n');
          }).join('\n\n') +
          "\n\n📈 AI soveltuu monille eri toimialoille.";
      }
      
      if (!summary) {
        return res.status(404).json({ error: "Category not found" });
      }
      
      res.json({ summary });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category summary" });
    }
  });

  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, context_type } = chatRequestSchema.parse(req.body);
      console.log("Received message:", message, "Context:", context_type);
      
      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-placeholder') {
        return res.status(200).json({
          response: 'Anteeksi, AI-avustaja ei ole tällä hetkellä käytettävissä. Tämä on demo-versio jossa tarvitaan OpenAI API-avain toimiakseen. Voit tarkastella case-esimerkkejä sivun vasemmasta reunasta.'
        });
      }
      
      // Get context data based on selected context type
      const cases = await storage.getAllCases();
      const trends = await storage.getAllTrends();
      const normalizeText = (text: string) => {
        // Targeted normalization to prevent ByteString errors while preserving Finnish
        return text
          // Replace Unicode punctuation and symbols
          .replace(/[\u2013\u2014\u2212]/g, '-')   // em-dash, en-dash, minus sign
          .replace(/[\u201C\u201D]/g, '"')        // smart quotes
          .replace(/[\u2018\u2019]/g, "'")        // smart apostrophes
          .replace(/[\u2026]/g, '...')          // ellipsis
          .replace(/[\u00A0\u202F]/g, ' ')       // non-breaking spaces
          .replace(/[\u2000-\u206F]/g, ' ')      // general punctuation
          // Keep Finnish characters ä, ö, å essential for Finnish content quality
          // Only remove other problematic characters that cause ByteString issues
          .replace(/\s+/g, ' ')                // Normalize whitespace
          .trim();
      };
      
      // Create content based on context type
      let systemPrompt = "";
      
      if (context_type === "strategic") {
        // Use comprehensive Finnish AI trend data from storage
        const strategicTrends = trends.filter(t => 
          t.category === "autonomous_agents" || 
          t.category === "ai_investments" || 
          t.category === "hyperpersonalization" || 
          t.category === "proactive_service" ||
          t.category === "human_ai_collaboration" ||
          t.category === "business_impact"
        );
        
        const trendsContent = strategicTrends.map(t => {
          const title = normalizeText(t.title);
          const description = normalizeText(t.description);
          const keyPoints = Array.isArray(t.key_points) ? 
            (t.key_points as string[]).map(p => normalizeText(p)).join("; ") : "";
          return `${title}: ${description} - ${keyPoints}`;
        }).join("\n\n");
        
        systemPrompt = `You are an AI expert helping humm.fi team understand 2025 AI trends in customer experience.

You have comprehensive Finnish market analysis from latest research:

${trendsContent}

Always respond in Finnish and focus on:
1. 2025 AI trends and future developments
2. Strategic implications for businesses
3. Market opportunities and innovations
4. Implementation roadmaps
5. Technology evolution predictions

Keep answers strategic and forward-looking (max 200 words).`;
        
      } else if (context_type === "practical") {
        const compactCases = cases.map(c => {
          const company = normalizeText(c.company);
          const country = normalizeText(c.country);
          const industry = normalizeText(c.industry);
          const metrics = Array.isArray(c.key_metrics) ? c.key_metrics.map((m: any) => `${m.label}: ${m.value}`).join(", ") : "";
          return `${company} (${country}, ${industry}): ${metrics}. ${normalizeText(c.full_text.substring(0, 300))}...`;
        }).join('\n\n');
        
        systemPrompt = `You are an AI expert helping humm.fi team understand practical AI implementations.

You have 6 proven case studies:

${compactCases}

Always respond in Finnish and focus on:
1. Concrete implementation steps
2. Technical details and technologies used
3. Measurable results and cost savings
4. Learning points from real deployments
5. Practical tips for similar implementations

Keep answers practical and actionable (max 200 words).`;
        
      } else if (context_type === "finnish") {
        const finnishCases = cases.filter(c => c.country === "Suomi" || c.country === "Suomi/Pohjoismaat");
        const otherCases = cases.filter(c => c.country !== "Suomi" && c.country !== "Suomi/Pohjoismaat");
        
        const finnishContent = finnishCases.map(c => 
          `${normalizeText(c.company)}: ${normalizeText(c.description)} - Tulokset: ${Array.isArray(c.key_metrics) ? c.key_metrics.map((m: any) => `${m.label}: ${m.value}`).join(", ") : ""}`
        ).join("\n\n");
        
        const globalContent = otherCases.map(c => 
          `${normalizeText(c.company)} (${normalizeText(c.country)}): ${normalizeText(c.description.substring(0, 150))}...`
        ).join("\n\n");
        
        systemPrompt = `You are an AI expert helping humm.fi understand AI implementations specifically for Finnish market.

Suomalaiset esimerkit:
${finnishContent}

Kansainväliset vertailukohteet:
${globalContent}

Always respond in Finnish and focus on:
1. How these solutions work in Finnish market context
2. Comparison between Finnish and international approaches
3. Cultural and regulatory considerations for Finland
4. Market-specific opportunities and challenges
5. Recommendations for Finnish companies

Keep answers Finland-focused (max 200 words).`;
        
      } else if (context_type === "planning") {
        const planningTrends = trends.filter(t => t.category === "automation" || t.category === "strategic");
        const trendsContent = planningTrends.map(t => 
          `${normalizeText(t.title)}: ${Array.isArray(t.key_points) ? (t.key_points as string[]).slice(0, 2).map(p => normalizeText(p)).join("; ") : ""}`
        ).join("\n\n");
        
        const keyLearnings = cases.map(c => 
          `${normalizeText(c.company)}: ${Array.isArray(c.learning_points) ? c.learning_points.map(p => normalizeText(p)).slice(0, 2).join("; ") : ""}`
        ).join("\n\n");
        
        systemPrompt = `You are an AI strategic advisor helping humm.fi plan their next steps in AI customer service.

2025 Trends:
${trendsContent}

Key Learnings from Cases:
${keyLearnings}

Always respond in Finnish and focus on:
1. Strategic recommendations specifically for humm.fi
2. Implementation roadmap and priorities
3. Resource requirements and timeline
4. Risk assessment and mitigation strategies
5. Success metrics and KPIs to track

Keep answers strategic and actionable for humm.fi (max 200 words).`;
        
      } else {
        // general context - mix of everything
        const topTrends = trends.slice(0, 2).map(t => `${normalizeText(t.title)}: ${normalizeText(t.description)}`).join("\n\n");
        const topCases = cases.slice(0, 3).map(c => `${normalizeText(c.company)}: ${normalizeText(c.description)}`).join("\n\n");
        
        systemPrompt = `You are an AI expert helping humm.fi team understand AI customer service implementations.

Top Trends:
${topTrends}

Example Cases:
${topCases}

Always respond in Finnish and provide balanced information about AI customer service implementations, trends, and practical applications.

Keep answers informative but concise (max 200 words).`;
      }

      // Final sanitization of systemPrompt before OpenAI call
      // Targeted sanitization to prevent ByteString errors while preserving Finnish
      systemPrompt = systemPrompt
        .replace(/[\u2013\u2014\u2212]/g, '-')     // en-dash, em-dash, minus sign
        .replace(/[\u201C\u201D]/g, '"')          // smart quotes  
        .replace(/[\u2018\u2019]/g, "'")          // smart apostrophes
        .replace(/[\u2026]/g, '...')            // ellipsis
        .replace(/[\u2022]/g, '-')             // bullet points to safe ASCII dash
        // Keep Finnish characters ä, ö, å as they are essential for Finnish content
        // Only remove other problematic Unicode that causes ByteString issues
        .replace(/\s+/g, ' ')                // normalize whitespace
        .trim();
      
      // Debug logging for encoding issues (temporary)
      if (context_type === 'strategic') {
        const problematicChars = [];
        for (let i = 0; i < systemPrompt.length; i++) {
          const charCode = systemPrompt.codePointAt(i);
          if (charCode && charCode > 127) {
            problematicChars.push({ index: i, char: systemPrompt[i], code: charCode });
          }
        }
        if (problematicChars.length > 0) {
          console.log('Non-ASCII chars found in strategic systemPrompt:', problematicChars);
        }
      }
      
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
