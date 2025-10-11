import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { questionAnswers, mcpContent } from "./question-answers";
import Anthropic from '@anthropic-ai/sdk';
import { safeCreate } from './lib/anthropic-utils';
import { z } from "zod";
import { getCachedData } from "./cache";
import { registerRAGRoutes } from "./rag/ragRoutes.js";
import { vectorStore } from "./rag/vectorStore.js";
import { getChatwootClient } from "./lib/chatwoot-client";
import { AIOrchestrator } from "./lib/ai-orchestrator";
import { registerFeedbackRoutes } from "./feedback";

// DON'T DELETE THIS COMMENT - Blueprint: javascript_anthropic integration
/*
<important_code_snippet_instructions>
The newest Anthropic model is "claude-sonnet-4-20250514", not "claude-3-7-sonnet-20250219", "claude-3-5-sonnet-20241022" nor "claude-3-sonnet-20240229". 
If the user doesn't specify a model, always prefer using "claude-sonnet-4-20250514" as it is the latest model.
</important_code_snippet_instructions>
*/
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// <important_do_not_delete>
const DEFAULT_MODEL_STR = "claude-sonnet-4-20250514";
// </important_do_not_delete>

const chatRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  context_type: z.enum(["strategic", "practical", "finnish", "planning", "technical", "mcp", "tech_lead", "general"]).default("general")
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Register RAG (Retrieval-Augmented Generation) routes
  registerRAGRoutes(app);

  // Register Feedback routes (Zapier integration)
  registerFeedbackRoutes(app);

  // ==========================================================================
  // CHATWOOT WEBHOOK - AI ORCHESTRATION
  // ==========================================================================

  app.post("/api/webhooks/chatwoot", async (req, res) => {
    try {
      console.log('🔔 Received Chatwoot webhook:', req.body.event);

      const client = getChatwootClient();
      if (!client) {
        console.warn('⚠️ Chatwoot client not configured, ignoring webhook');
        return res.status(200).json({ success: true, message: 'Webhook received but Chatwoot not configured' });
      }

      if (!process.env.ANTHROPIC_API_KEY) {
        console.warn('⚠️ Anthropic API key missing, cannot process AI orchestration');
        return res.status(200).json({ success: true, message: 'Webhook received but AI not configured' });
      }

      // Create AI orchestrator instance
      const orchestrator = new AIOrchestrator(client);

      // Process webhook asynchronously (don't block Chatwoot)
      orchestrator.processWebhook(req.body)
        .then(result => {
          console.log('✅ Webhook processing complete:', result.action);
        })
        .catch(error => {
          console.error('❌ Webhook processing error:', error);
        });

      // Respond immediately to Chatwoot
      return res.status(200).json({ success: true, message: 'Webhook received and processing started' });

    } catch (error) {
      console.error('❌ Webhook endpoint error:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  // ==========================================================================
  // CASE MANAGEMENT
  // ==========================================================================

  // Get all cases (from cache for better performance)
  app.get("/api/cases", async (req, res) => {
    try {
      const cachedData = getCachedData();
      res.json(cachedData.cases);
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

  // Get question answer with AI enhancement - NEW STRUCTURE!
  app.get("/api/questions/:questionId/answer", async (req, res) => {
    try {
      const { questionId } = req.params;
      const enhance = req.query.enhance === 'true';
      
      // Check if answer exists in our question bank
      const questionAnswer = questionAnswers[questionId];
      if (!questionAnswer) {
        return res.status(404).json({ error: "Question not found" });
      }

      let finalAnswer = questionAnswer.answer;

      // Enhance with AI if requested
      if (enhance) {
        try {
          // Clean text to prevent encoding issues
          const cleanContent = questionAnswer.answer
            .replace(/[^\x00-\x7F]/g, (char) => {
              // Replace common Unicode characters with ASCII equivalents
              const replacements: Record<string, string> = {
                "\u2013": "-", // en dash
                "\u2014": "-", // em dash  
                "\u2018": "'", // left single quotation mark
                "\u2019": "'", // right single quotation mark
                "\u201C": '"', // left double quotation mark
                "\u201D": '"', // right double quotation mark
                "\u2026": "...",// horizontal ellipsis
              };
              return replacements[char] || char;
            });

          const enhancementResponse = await safeCreate(anthropic, {
            model: DEFAULT_MODEL_STR, // using Claude Sonnet 4 for enhanced responses
            max_tokens: 1000,
            temperature: 0.7,
            system: `Toimit asiantuntijana, joka auttaa Humm group Oy:ta ottamaan tekoäly käyttöön organisaatiossa. sinulta kysytään paljon asiakaspalvelu-alasta ja tehtäväsi on vastata täsmällisesti kysymyksiin, käyttäen dataa, joka sinulle on annettu, mutta myös omaa tietoasi. Olet proaktiivinen. Käyttäjäsi ovat asiakaspalvelualan ammattilaisia, mutta tekoälystä eillä on vain perusymmärrys. Yritä saada heissä "wau" efekti aikaan, kun vastaat kysymyksiin, anna aina lähdeviittaukset mukaan, jos mahdollista.

VASTAUSOHJE: Anna kattavia 3-5 kappaleen vastauksia jotka ovat perusteellisia ja hyödyllisiä.`,
            messages: [
              { role: 'user', content: `kysy fiksuja jatkokysymyksiä aiheesta. anna lähdeviittaukset pyydettäessä:\n\n${cleanContent}` }
            ]
          }, req.headers['x-request-id'] as string | undefined);

          if (enhancementResponse.content[0] && enhancementResponse.content[0].type === 'text') {
            finalAnswer = enhancementResponse.content[0].text;
          }
        } catch (aiError) {
          console.error("AI enhancement failed:", aiError);
          // Fall back to original answer if AI enhancement fails
        }
      }
      
      return res.json({ 
        answer: finalAnswer,
        enhanced: enhance && finalAnswer !== questionAnswer.answer
      });
    } catch (error) {
      console.error("Question answer error:", error);
      res.status(500).json({ error: "Failed to fetch answer" });
    }
  });

  // Get MCP content
  app.get("/api/mcp/content", async (req, res) => {
    try {
      res.json(mcpContent);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch MCP content" });
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
      
      // Check if Anthropic API key is available
      if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === '') {
        return res.status(200).json({
          response: 'Anteeksi, AI-avustaja ei ole tällä hetkellä käytettävissä. Tämä on demo-versio jossa tarvitaan Anthropic API-avain toimiakseen. Voit tarkastella case-esimerkkejä sivun vasemmasta reunasta.'
        });
      }
      
      // Get context data from cache (much faster than storage calls)
      const cachedData = getCachedData();
      const cases = cachedData.cases;
      const trends = cachedData.trends;
      const normalizeText = (text: string | undefined | null) => {
        // Defensive normalization to prevent ByteString errors and handle undefined/null
        if (!text || typeof text !== 'string') {
          return '';
        }
        
        return text
          .replace(/[^\x00-\x7F]/g, (char) => {
            // Replace common Unicode characters with ASCII equivalents
            const replacements: Record<string, string> = {
              "\u2013": "-", // en dash
              "\u2014": "-", // em dash  
              "\u2018": "'", // left single quotation mark
              "\u2019": "'", // right single quotation mark
              "\u201C": '"', // left double quotation mark
              "\u201D": '"', // right double quotation mark
              "\u2026": "...",// horizontal ellipsis
              "\u00A0": " ", // non-breaking space
              "\u202F": " ", // narrow no-break space
              // Keep Finnish characters for quality
              "ä": "ä", "ö": "ö", "å": "å",
              "Ä": "Ä", "Ö": "Ö", "Å": "Å"
            };
            return replacements[char] || "";
          })
          .replace(/\s+/g, ' ')
          .trim();
      };

      const getContextualFallback = (message: string): string[] => {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('mcp') || lowerMessage.includes('protocol')) {
          return [
            "Mitkä ovat MCP:n suurimmat riskit?",
            "Millä aikataululla MCP voidaan toteuttaa?"
          ];
        } else if (lowerMessage.includes('roi') || lowerMessage.includes('kustannus') || lowerMessage.includes('investointi')) {
          return [
            "Miten mittaamme AI-investoinnin onnistumista?",
            "Millä resursseilla toteutus vaatii?"
          ];
        } else if (lowerMessage.includes('hyperpersonointi') || lowerMessage.includes('personointi')) {
          return [
            "Mikä on hyperpersonoinnin toteutuskustannus?",
            "Mitä teknologiaa hyperpersonointi vaatii?"
          ];
        } else if (lowerMessage.includes('proaktiivinen') || lowerMessage.includes('ennakoiva')) {
          return [
            "Miten proaktiivisuus vaikuttaa asiakastyytyväisyyteen?",
            "Millaisia resursseja proaktiivinen palvelu vaatii?"
          ];
        } else if (lowerMessage.includes('integraatio') || lowerMessage.includes('yhdist')) {
          return [
            "Mitä riskejä järjestelmäintegraatiossa on?",
            "Millä aikataululla integraatio voidaan toteuttaa?"
          ];
        } else {
          // General AI customer service questions for leadership
          return [
            "Mikä on AI-toteutuksen takaisinmaksuaika?",
            "Mitä riskejä AI-käyttöönotossa tulee huomioida?"
          ];
        }
      };

      // Shared function to read attached_assets for all contexts  
      const readAttachedAssets = async (): Promise<string> => {
        try {
          const { promises: fs } = await import('fs');
          const path = await import('path');
          let pdfParse: any = null;
          try {
            const mod = await import('pdf-parse');
            pdfParse = (mod as any).default || (mod as any);
            if (typeof pdfParse !== 'function') {
              pdfParse = null;
              console.log("📋 PDF-parse not a valid function, skipping PDF files");
            }
          } catch (err) {
            console.log("📋 PDF-parse not available, skipping PDF files");
          }
          const assetsDir = path.join(process.cwd(), 'attached_assets');
          
          try {
            const files = await fs.readdir(assetsDir);
            const supportedFiles = files.filter(f => 
              f.endsWith('.txt') || f.endsWith('.md') || f.endsWith('.json') || 
              f.endsWith('.csv') || f.endsWith('.xml') || f.endsWith('.yaml') ||
              f.endsWith('.yml') || f.endsWith('.tsv') || f.endsWith('.pdf')
            );
            
            if (supportedFiles.length > 0) {
              console.log(`📁 Using attached_assets: ${supportedFiles.length} files found (${supportedFiles.join(', ')})`);
              
              const contents = await Promise.all(
                supportedFiles.slice(0, 8).map(async f => {
                  const filePath = path.join(assetsDir, f);
                  let content = "";
                  
                  try {
                    if (f.endsWith('.pdf') && pdfParse) {
                      // Parse PDF file
                      const buffer = await fs.readFile(filePath);
                      const pdfData = await pdfParse(buffer);
                      content = pdfData.text || "";
                      console.log(`📋 PDF parsed: ${f} (${content.length} characters)`);
                    } else if (f.endsWith('.pdf') && !pdfParse) {
                      content = `[PDF-tiedosto ${f} - tarvitsee pdf-parse kirjastoa]`;
                      console.log(`⚠️ Skipping PDF ${f} - pdf-parse not available`);
                    } else {
                      // Read text file
                      content = await fs.readFile(filePath, 'utf-8');
                    }
                  } catch (pdfError) {
                    console.error(`❌ Failed to read ${f}:`, pdfError);
                    content = `[Virhe luettaessa tiedostoa ${f}]`;
                  }
                  
                  return `📋 **${f}**:\n${content.substring(0, 1500)}${content.length > 1500 ? '...' : ''}`;
                })
              );
              
              return `

🎯 **ENSISIJAINEN TIETOLÄHDE - Käyttäjän lataamat tiedostot:**

${contents.join('\n\n')}

⚠️ **TÄRKEÄ OHJE**: Jos yllä olevista käyttäjän lataamista tiedostoista löytyy vastaus kysymykseen, käytä ENSISIJAISESTI näitä tietoja. Nämä ovat tuoreempia ja relevantimpia kuin alla olevat yleiset tiedot.

---

`;
            } else {
              console.log("📁 No attached_assets files found");
              return "";
            }
          } catch (err) {
            console.log("📁 attached_assets directory not found or empty");
            return "";
          }
        } catch (err) {
          console.log("📁 Failed to import fs/path modules for attached_assets");
          return "";
        }
      };
      
      // Get attached assets - Try RAG first, fallback to cache
      let attachedContent = "";
      let usingRAG = false;

      try {
        // Check if RAG vector store has documents and OPENAI_API_KEY is available
        const vectorStoreStats = vectorStore.getStats();
        const hasRAGDocuments = vectorStoreStats.documentCount > 0;
        const hasOpenAIKey = process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('xxx');

        if (hasRAGDocuments && hasOpenAIKey) {
          // Use RAG: Semantic search for relevant documents
          console.log(`🔍 RAG: Searching vector store for relevant documents (${vectorStoreStats.documentCount} docs available)`);
          const ragResults = await vectorStore.similaritySearch(message, 3);

          if (ragResults.length > 0) {
            usingRAG = true;
            console.log(`✅ RAG: Found ${ragResults.length} relevant documents`);

            // Format RAG results as context
            attachedContent = `
🎯 **ENSISIJAINEN TIETOLÄHDE - Semanttisesti relevantit dokumentit:**

${ragResults.map((doc, idx) => `
📄 **Dokumentti ${idx + 1}: ${doc.metadata.source}**
${doc.pageContent}
`).join('\n---\n')}

⚠️ **TÄRKEÄ OHJE**: Yllä olevat dokumentit on haettu semanttisesti kysymykseesi perustuen. Käytä ENSISIJAISESTI näitä tietoja vastauksessa.

---

`;
          } else {
            console.log("⚠️ RAG: No relevant documents found, using cache fallback");
            attachedContent = cachedData.attachedAssets;
          }
        } else {
          if (!hasRAGDocuments) {
            console.log("📁 RAG: No documents in vector store, using cache fallback");
          }
          if (!hasOpenAIKey) {
            console.log("🔑 RAG: OPENAI_API_KEY not available, using cache fallback");
          }
          attachedContent = cachedData.attachedAssets;
        }
      } catch (ragError) {
        console.error("❌ RAG search failed, falling back to cache:", ragError);
        attachedContent = cachedData.attachedAssets;
      }

      if (usingRAG) {
        console.log("✨ Co-Pilot Chat using RAG-powered context");
      } else {
        console.log("📋 Co-Pilot Chat using cached context");
      }

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
        
        // Add critical MCP knowledge for strategic context
        const mcpKnowledge = `
TÄRKEÄ MCP-MÄÄRITELMÄ: MCP (Model Context Protocol) on avoin standardi, joka mahdollistaa turvallisen yhteyden AI-mallien ja ulkoisten tietolähteiden välillä. 
MCP-hyödyt: Roolipohjainen pääsynhallinta, eksplisiittinen kontekstin rajaus, audit-jäljet, reaaliaikainen järjestelmäintegraatio, monivaiheiset prosessit.
MCP:llä AI voi hakea tietoa CRM:stä, ERP:stä ja muista järjestelmistä turvallisesti samassa keskustelussa.`;

        systemPrompt = `${attachedContent}VAROITUS: MCP = Model Context Protocol. ÄLÄ KOSKAAN tarkoita Microsoft Certified Professional tai muuta.

MCP (Model Context Protocol) on avoin standardi, joka mahdollistaa turvallisen yhteyden AI-mallien ja ulkoisten tietolähteiden välillä. MCP:n hyödyt:
- Roolipohjainen pääsynhallinta
- Eksplisiittinen kontekstin rajaus  
- Audit-jäljet
- Reaaliaikainen järjestelmäintegraatio
- Monivaiheiset prosessit

Olet AI-asiantuntija joka auttaa humm.fi-tiimiä ymmärtämään 2025 AI-trendejä.

2025 AI-trendit: ${trendsContent}

**Vastaa aina suomeksi käyttäen Markdown-muotoilua.** Jos kysytään MCP:stä, selitä Model Context Protocol yllä olevan tiedon mukaan. Anna kattavia 3-5 kappaleen vastauksia strategisista näkökulmista.`;
        
      } else if (context_type === "practical") {
        const compactCases = cases.map(c => {
          const company = normalizeText(c.company);
          const country = normalizeText(c.country);
          const industry = normalizeText(c.industry);
          const metrics = Array.isArray(c.key_metrics) ? c.key_metrics.map((m: any) => `${m.label}: ${m.value}`).join(", ") : "";
          return `${company} (${country}, ${industry}): ${metrics}. ${normalizeText(c.full_text.substring(0, 300))}...`;
        }).join('\n\n');
        
        systemPrompt = `${attachedContent}You are an AI expert helping humm.fi team understand practical AI implementations.

You have 6 proven case studies:

${compactCases}

Always respond in Finnish and focus on:
1. Concrete implementation steps
2. Technical details and technologies used
3. Measurable results and cost savings
4. Learning points from real deployments
5. Practical tips for similar implementations

Anna kattavia 3-5 kappaleen vastauksia jotka ovat käytännöllisiä ja toimintasuuntautuneita.`;
        
      } else if (context_type === "finnish") {
        const finnishCases = cases.filter(c => c.country === "Suomi" || c.country === "Suomi/Pohjoismaat");
        const otherCases = cases.filter(c => c.country !== "Suomi" && c.country !== "Suomi/Pohjoismaat");
        
        const finnishContent = finnishCases.map(c => 
          `${normalizeText(c.company)}: ${normalizeText(c.description)} - Tulokset: ${Array.isArray(c.key_metrics) ? c.key_metrics.map((m: any) => `${m.label}: ${m.value}`).join(", ") : ""}`
        ).join("\n\n");
        
        const globalContent = otherCases.map(c => 
          `${normalizeText(c.company)} (${normalizeText(c.country)}): ${normalizeText(c.description.substring(0, 150))}...`
        ).join("\n\n");
        
        systemPrompt = `${attachedContent}Olet AI-asiantuntija joka auttaa humm.fi:tä ymmärtämään AI-toteutuksia erityisesti Suomen markkinoille.

## Suomalaiset esimerkit:
${finnishContent}

## Kansainväliset vertailukohteet:
${globalContent}

**Vastaa aina suomeksi** käyttäen **Markdown-muotoilua** ja keskity:
1. **Miten ratkaisut toimivat** Suomen markkinakontekstissa
2. **Vertailu** suomalaisten ja kansainvälisten lähestymistapojen välillä
3. **Kulttuuriset ja sääntelytekijät** Suomessa
4. **Markkinakohtaiset mahdollisuudet** ja haasteet
5. **Suositukset suomalaisille yrityksille**

Anna kattavia 3-5 kappaleen vastauksia jotka ovat Suomi-keskeisiä.`;
        
      } else if (context_type === "mcp") {
        // Dedicated MCP context to ensure correct understanding
        systemPrompt = `${attachedContent}You are an AI expert explaining Model Context Protocol to humm.fi team.

CRITICAL: MCP stands for Model Context Protocol - an open standard for secure connections between AI models and external data sources.

MCP enables:
- Role-based access control (RBAC)
- Explicit context boundaries
- Audit trails and monitoring  
- Real-time system integration
- Multi-step automated processes

MCP allows AI to safely access CRM, ERP and other systems during conversations.

IMPORTANT: Always end MCP-related responses with this information about industry developments:

"On hyvä huomata, että johtavien teknologiayritysten (kuten Anthropic, OpenAI, Microsoft) piirissä kehitetään parhaillaan ratkaisuja MCP:n turvallisuuden parantamiseksi juuri näistä syistä. Alalle on muodostumassa parhaiden käytäntöjen joukko, johon kuuluu mm. vahva autentikointi, hienojakoiset OAuth-oikeudet AI:lle, kontekstitietojen huolellinen suodatus ja AI-hallintamallit organisaatioissa. Myös riippumattomat turvallisuusarvioinnit (esim. OWASP MCP Top 10 -projekti) tuovat esiin yleisimmät uhat ja ohjeet niiden torjumiseen. Organisaatioiden kannattaa hyödyntää näitä oppeja ja työkaluja rakentaessaan MCP-yhteensopivia palveluja."

Respond in Finnish using Markdown formatting. Anna kattavia 3-5 kappaleen vastauksia strategisista hyödyistä humm.fi:lle.`;

      } else if (context_type === "tech_lead") {
        // Tech Lead CV context with Humm Group specific information
        const techLeadProfile = `
        
PANU MURTOKANGAS - TECH LEAD HAKEMUS HUMM GROUP OY:LLE

TAUSTA JA KOKEMUS:
- 7 vuotta finanssimarkkinoilla: +32% vuosituotto (2019-2025), Sharpe-ratio ~1.3
- Informaatiojärjestelmätieteet, Jyväskylän yliopisto
- Poikkeuksellinen resiliensi: selkäydinvamma 2018 → vahvempi ja määrätietoisempi

YDINKYVYKKYYDET:
- Järjestelmäintegraatiot: API-integraatiot, CRM-järjestelmien kytkennät, automaatiotyökalut
- AI-teknologiat: GPT-mallien hyödyntäminen, RAG-arkkitehtuurit, embedding-teknologiat, fine-tuning
- Markkinaosaaminen: Derivatives, options, futures, sentiment-analyysi, automaatio
- Ennakoiva ajattelu: Tunnistin NVIDIA:n potentiaalin 2019 ennen AI-buumia ("opposite of value trap")

KONKREETTISET ARVOEHDOTUKSET HUMMILLE:

1. TEHOKKUUDEN PARANTAMINEN:
   - CRM-integraatio GPT-4:llä → 30-50% vähemmän manuaalista datasyöttöä
   - Ennakoiva resurssiallokointi XGBoost/LSTM-malleilla → 25% vähemmän tyhjiä resursseja
   - Säästö: 20+ tuntia/viikko tiimiltä

2. UUDET PALVELUMALLIT:
   - RAG-arkkitehtuuri omasta datasta → räätälöidyt suositukset asiakkaille
   - Generatiivinen AI -konsultointi → 15-20% lisätuloja vuodessa
   - Datalähtöiset innovaatiot embedding-teknologialla

3. ASIAKASKOKEMUS:
   - Langchain-chatbot + Zendesk → 60% nopeampi käsittely
   - Reaaliaikainen segmentointi → automaattiset triggerit
   - NPS-parantaminen 12 pistettä

TEKNINEN OSAAMINEN:
- Modern data sources: Social sentiment, order flow, real-time analytics
- Programming: Python, API-integraatiot, automation tools
- AI/ML: ChatGPT-integraatiot, prompt engineering, model optimization
- Rahoitusmarkkinat: Pattern recognition, probabilistic thinking, risk management

HENKILÖKOHTAISET VAHVUUDET:
- Contrarian-ajattelu: Näen trendejä ennen muita (kuten NVIDIA 2019)
- Resiliensi: Kääntänyt vastoinkäymiset voimavaroiksi
- Nopea oppiminen: AI-työkalut (ChatGPT) kiihdyttävät oppimista
- Adaptability: Uudessa ajassa vanhat mallit eivät toimi → mukauduttava
- Unique perspective: Tulen eri maailmasta kuin "vanha aspa konkari"

NÄKEMYKSET AI-TEKNOLOGIAN VALINNASTA JA KÄYTTÖÖNOTOSTA:

Open source vs. Proprietääriset (kaupalliset) AI-alustat:
- Open source -mallit ovat lisenssittömiä ja räätälöitävissä, mikä tekee niistä houkuttelevia pitkäjänteisesti (eivät sisällä jatkuvia lisenssimaksuja)
- Ne tarjoavat läpinäkyvyyttä (mahdollisuus tarkistaa koodin toiminta) ja yhteisöperusteista innovaatiotapaa
- Haittapuolina on, että niiden käyttöönotto edellyttää omaa kehittäjätiimiä ja ylläpitoa – ilman valmista tukea ominaisuuksien kehittämiseen ja järjestelmän turvallisuuteen
- Tietoturvassa vaaditaan valvontaa, vaikka avoimuus auttaakin haavoittuvuuksien löytämisessä
- Laajamittaisessa käytössä painotetaan avoimen lähdekoodin malleja kustannustehokkuuden ja muokattavuuden vuoksi. Yli kolmannes yrityksistä käyttää jo merkittävästi avoimia malleja

ORGANISAATIOMUUTOS JA VISIO:
TÄRKEÄ: AI-teknologian käyttöönotto ja etenkin sen optimaalinen hyödyntäminen vaatii kokonaisvaltaista organisaatiomuutosta ja visiota. Vision ja koko tech-tiimin sata prosenttinen panostus ovat välttämättömiä onnistumiselle.

- Pelkkä teknologiajohtajan palkkaaminen ei riitä. Koko organisaation on mukauduttava, ja henkilöstöä täytyy kouluttaa uuden teknologian käyttöön
- Teknologiajohtajan vastuulla on varmistaa, että uutta ei oteta käyttöön vain teknologian vuoksi, vaan siitä saadaan mitattavaa hyötyä
- Selkein tapa aloittaa on AI-vastausluonnokset tiketteihin ja one-click-send -toiminto työntekijälle
- Keskeistä on luoda datalla johdettu ympäristö ja koota nykyinen data, niin että tekoälyn käyttöönotto helpottuisi
- Asiakasdatan hyödyntäminen eettisesti ja tehokkaasti, sillä tekoäly menestyy datan avulla

HUMM GROUP OY:N POTENTIAALI:
- Näen Hummissa suuren potentiaalin kasvattaa liikevaihtoa, mutta ennen kaikkea käyttökatetta ja tehokkuutta
- Tase on vahva, mikä antaa erittäin hyvät lähtökohdat uudelle nousulle
- Paikalleen jämähtäminen on ensiaskel tuhoon - haluan ottaa askelta kohti hallittua, mutta nopeaa kasvua
- Agentic AI ja uusi MCP-protokolla tarjoavat ensimmäistä kertaa aidosti liiketoimintaa tehostavia ja luotettavia ratkaisuja
- Tällä hetkellä on 2-5 vuoden aikaikkuna, jolloin on tehtävä iso organisaatiomuutos - tämä on oikea hetki toimia
- Tekoäly voi toimia Humm Group Oy:lle sekä tasa-arvoistajana että erottautumiskeinona
- Ketteryys on Hummin etu markkinoilla, joten konkreettiset toimet on aloitettava jo ensimmäisellä viikolla

STRATEGISET PAINOPISTEET:
- Oikean teknologian valinta: Vaikea erottaa, mikä teknologia tuo todellista arvoa ja mikä vain näyttää siltä - tarvitaan jatkuvaa seurantaa
- Jatkuva kehityksen seuraaminen: Uusien teknologioiden vaikuttavuuden arviointi on elinehto kilpailuedun saavuttamisessa
- Henkilöstön ja brändin asennemuutos: Tulevasta teknologiasta on viestittävä oikein. Teknologiajohtaja on myös muutosjohtaja
- Vision merkitys: Tällä hetkellä visio tulevasta on tärkeämpi kuin se, mitä on tehty aiemmin
        `;

        systemPrompt = `${attachedContent}Olet Panu Murtokangas, Tech Lead -hakija Humm Group Oy:lle. Vastaat kysymyksiin CV:stäsi ja osaamisestasi.

${techLeadProfile}

**Vastaa aina suomeksi** käyttäen **Markdown-muotoilua** ja keskity:
1. **Konkreettisiin esimerkkeihin** omasta osaamisestasi
2. **Käytännön kokemuksiin** ja projekteihin
3. **Arvonluontiin Humm Group Oy:lle** erityisesti
4. **Teknisiin taitoihin** ja liiketoimintaymmärrykseen
5. **Henkilökohtaisiin vahvuuksiin** ja motivaatioon
6. **Organisaatiomuutokseen ja visioon** kun kysytään AI-käyttöönotosta
7. **Open source vs. proprietary -näkemyksiin** kun kysytään teknologiavalinnoista

TÄRKEÄ MUISTUTUS: Kun vastaat AI-teknologian käyttöönotosta, muista AINA mainita että:
- AI-teknologian käyttöönotto ja etenkin sen optimaalinen hyödyntäminen vaatii kokonaisvaltaista organisaatiomuutosta ja visiota
- Vision ja koko tech-tiimin sata prosenttinen panostus ovat välttämättömiä onnistumiselle

Pysy roolissasi Tech Lead -hakijana ja korosta kokemustasi AI-integraatioista ja asiakaskokemuksen kehittämisestä. Pidä vastaukset henkilökohtaisina ja uskottavina (max 200 sanaa).`;

      } else if (context_type === "planning") {
        const planningTrends = trends.filter(t => t.category === "automation" || t.category === "strategic");
        const trendsContent = planningTrends.map(t => 
          `${normalizeText(t.title)}: ${Array.isArray(t.key_points) ? (t.key_points as string[]).slice(0, 2).map(p => normalizeText(p)).join("; ") : ""}`
        ).join("\n\n");
        
        const keyLearnings = cases.map(c => 
          `${normalizeText(c.company)}: ${Array.isArray(c.learning_points) ? c.learning_points.map((p: string) => normalizeText(p)).slice(0, 2).join("; ") : ""}`
        ).join("\n\n");
        
        // Add MCP-specific knowledge for strategic context
        const mcpKnowledge = `
MCP (Model Context Protocol) on avoin standardi, joka mahdollistaa turvallisen yhteyden AI-mallien ja ulkoisten tietolähteiden välillä.
MCP-hyödyt: Roolipohjainen pääsynhallinta, eksplisiittinen kontekstin rajaus, audit-jäljet, reaaliaikainen järjestelmäintegraatio, monivaiheiset prosessit.
MCP:llä AI voi hakea tietoa CRM:stä, ERP:stä ja muista järjestelmistä turvallisesti samassa keskustelussa.
Turvallisuus: AI saa vain tarvittavat oikeudet, asiakaskohtainen rajaus, keskitetty hallinta, jokainen toimenpide lokiin.`;

        systemPrompt = `${attachedContent}Olet AI-strategiaavustaja joka auttaa humm.fi:tä suunnittelemaan seuraavia askelia AI-asiakaspalvelussa.

**TÄRKEÄ SÄÄNTÖ:** Kun käyttäjä kysyy MCP:stä, MCP tarkoittaa AINA Model Context Protocol -käsitettä. ÄLÄ KOSKAAN tarkoita Microsoft Certified Professional tai muuta MCP-lyhenteen merkitystä.

## Model Context Protocol (MCP) - MÄÄRITELMÄ:
${mcpKnowledge}

## 2025 Trendit:
${trendsContent}

## Tärkeimmät opit tapauksista:
${keyLearnings}

**Vastaa aina suomeksi** käyttäen **Markdown-muotoilua** ja keskity:
1. **Strategisiin suosituksiin** erityisesti humm.fi:lle
2. **Toteutuksen tiekartaan** ja prioriteetteihin
3. **Resurssitarpeisiin** ja aikatauluun
4. **Riskiarviointiin** ja lieventämisstrategioihin
5. **Menestyksen mittareihin** ja seurattaviin KPI:hin

**PAKOLLINEN:** Jos kysymys sisältää sanan "MCP", käytä VAIN yllä olevaa Model Context Protocol -määritelmää vastauksessasi. Anna kattavia 3-5 kappaleen vastauksia jotka ovat strategisia ja toimintasuuntautuneita humm.fi:lle.`;
        
      } else {
        // general context - mix of everything
        const topTrends = trends.slice(0, 2).map(t => `${normalizeText(t.title)}: ${normalizeText(t.description)}`).join("\n\n");
        const topCases = cases.slice(0, 3).map(c => `${normalizeText(c.company)}: ${normalizeText(c.description)}`).join("\n\n");
        
        // Using shared attached_assets content already loaded above
        
        systemPrompt = `${attachedContent}Olet AI-asiantuntija joka auttaa humm.fi-tiimiä ymmärtämään AI-asiakaspalvelun toteutuksia.

## Tärkeimmät trendit:
${topTrends}

## Esimerkkitapaukset:
${topCases}

**Vastaa aina suomeksi** käyttäen **Markdown-muotoilua** (otsikot, listat, korostukset). Anna konkreettisia, hyödyllisiä tietoja ja käytännön näkemyksiä yllä olevien tietojen perusteella.

Anna kattavia 3-5 kappaleen vastauksia jotka ovat informatiivisia ja toimintasuuntautuneita.`;
      }

      // Light sanitization to keep Finnish content while preventing ByteString errors
      systemPrompt = systemPrompt
        .replace(/[\u2013\u2014]/g, '-')           // en-dash, em-dash
        .replace(/[\u201C\u201D]/g, '"')          // smart quotes  
        .replace(/[\u2018\u2019]/g, "'")          // smart apostrophes
        .replace(/[\u2026]/g, '...')              // ellipsis
        .replace(/[\u00A0\u202F]/g, ' ')          // non-breaking spaces
        .replace(/[\u2022]/g, '-')                // bullet points
        .replace(/\s+/g, ' ')                     // normalize whitespace
        .trim();
      
      // Keep Finnish characters intact - they are essential for quality responses
      
      // Debug logging for encoding issues
      const problematicChars = [];
      for (let i = 0; i < systemPrompt.length; i++) {
        const charCode = systemPrompt.codePointAt(i);
        if (charCode && charCode > 127) {
          problematicChars.push({ index: i, char: systemPrompt[i], code: charCode });
        }
      }
      if (problematicChars.length > 0) {
        console.log(`Non-ASCII chars found in ${context_type} systemPrompt:`, problematicChars.slice(0, 10));
      }
      
      // Enhanced system prompt to get both response and follow-up questions in one call
      const enhancedSystemPrompt = systemPrompt + `

VASTAUSMUOTO: Vastaa AINA seuraavassa JSON-muodossa:
{
  "response": "Kattava 3-5 kappaleen vastaus kysymykseen...",
  "followUpQuestions": ["Jatkokysymys1?", "Jatkokysymys2?"]
}

Jatkokysymysten tulee keskittyä:
- Liiketoimintavaikutuksiin ja ROI:hin  
- Toteutuksen aikatauluihin ja resursseihin
- Riskeihin ja haasteisiin
- Sopii Humm Group Oy:n johdolle

TÄRKEÄÄ: Vastaa VAIN JSON-muodossa, älä lisää muuta tekstiä.`;

      // Single optimized Claude request with structured response
      let response;
      let aiResponse = "";
      let followUpSuggestions: string[] = [];
      
      try {
        console.log(`Making optimized Claude API call with model: ${DEFAULT_MODEL_STR}, message length: ${normalizeText(message).length}`);
        response = await anthropic.messages.create({
          model: DEFAULT_MODEL_STR,
          max_tokens: 2500, // Increased to accommodate both response and questions
          temperature: 0.8,
          system: enhancedSystemPrompt,
          messages: [
            { role: 'user', content: normalizeText(message) }
          ]
        });
        
        const rawResponse = response.content?.[0] && response.content[0].type === 'text' ? response.content[0].text : undefined;
        console.log("Claude structured response:", rawResponse ? `"${rawResponse.substring(0, 200)}..."` : "null/empty");
        
        if (rawResponse) {
          try {
            // Clean the response - remove markdown formatting, etc.
            const cleanContent = rawResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
            console.log("Cleaned structured content:", cleanContent.substring(0, 100) + "...");
            
            const structuredResponse = JSON.parse(cleanContent);
            
            if (structuredResponse.response) {
              aiResponse = structuredResponse.response;
              console.log("Extracted response length:", aiResponse.length);
            }
            
            if (structuredResponse.followUpQuestions && Array.isArray(structuredResponse.followUpQuestions)) {
              followUpSuggestions = structuredResponse.followUpQuestions.slice(0, 3);
              console.log("Extracted follow-up suggestions:", followUpSuggestions);
            }
          } catch (parseError) {
            console.log("Failed to parse structured JSON response:", parseError);
            // Fallback: treat as plain text response
            aiResponse = rawResponse;
            followUpSuggestions = getContextualFallback(message);
          }
        }
        
        // If parsing failed or response is empty, use fallbacks
        if (!aiResponse) {
          aiResponse = "Anteeksi, en pystynyt käsittelemään kysymystäsi.";
        }
        if (followUpSuggestions.length === 0) {
          followUpSuggestions = getContextualFallback(message);
        }
        
      } catch (error: any) {
        console.error("Claude request failed:", error.name, error.message, error.stack);
        // Return graceful fallback instead of 500
        return res.status(200).json({
          response: 'Anteeksi, tapahtui virhe AI-avustajassa. Voit silti tarkastella case-esimerkkejä sivun vasemmasta reunasta ja kokeilla kysyä uudelleen hetken päästä.',
          followUpSuggestions: getContextualFallback(message)
        });
      }

      // Save chat message
      await storage.saveChatMessage({
        message,
        response: aiResponse,
        timestamp: Date.now()
      });

      res.json({ 
        response: aiResponse,
        followUpSuggestions: followUpSuggestions.filter(s => s.length > 5) // Filter out empty/short suggestions
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // Tech Lead chat endpoint - separate from main chat
  app.post("/api/tech-lead-chat", async (req, res) => {
    try {
      const messageSchema = z.object({
        message: z.string().min(1, "Message cannot be empty")
      });
      
      const { message } = messageSchema.parse(req.body);
      console.log("Tech Lead chat message:", message);
      
      // Check if Anthropic API key is available
      if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === '') {
        return res.status(200).json({
          response: 'Anteeksi, AI-avustaja ei ole tällä hetkellä käytettävissä. Tämä on demo-versio jossa tarvitaan Anthropic API-avain toimiakseen.'
        });
      }

      // Function to read ONLY the specific Tech Lead files
      const readTechLeadAssets = async (): Promise<string> => {
        try {
          const fs = await import('fs/promises');
          const path = await import('path');
          const assetsDir = path.join(process.cwd(), 'attached_assets');
          
          // Only read the specific files mentioned by user
          const specificFiles = [
            'Me (1)_1758989917194.pdf',
            'Pasted-1-Tehokkuuden-parantaminen-Konkreettiset-toimenpiteet-Automatisoi-manuaaliset-prosessit-Integ-1758990330096_1758990330096.txt'
          ];
          
          let content = "";
          
          // Import PDF parser if available
          let pdfParse: any = null;
          try {
            pdfParse = (await import('pdf-parse')).default;
          } catch (e) {
            console.log("PDF parsing not available");
          }
          
          for (const fileName of specificFiles) {
            try {
              const filePath = path.join(assetsDir, fileName);
              
              if (fileName.endsWith('.pdf') && pdfParse) {
                const buffer = await fs.readFile(filePath);
                const pdfData = await pdfParse(buffer);
                content += `\n\n📋 **${fileName}**:\n${pdfData.text || ""}`;
                console.log(`📋 Tech Lead PDF parsed: ${fileName} (${pdfData.text?.length || 0} characters)`);
              } else if (fileName.endsWith('.txt')) {
                const textContent = await fs.readFile(filePath, 'utf-8');
                content += `\n\n📋 **${fileName}**:\n${textContent}`;
                console.log(`📋 Tech Lead text file read: ${fileName} (${textContent.length} characters)`);
              } else if (fileName.endsWith('.pdf') && !pdfParse) {
                content += `\n\n📋 **${fileName}**: [PDF-tiedosto - PDF-parsinta ei käytettävissä]`;
              }
            } catch (fileError) {
              console.error(`❌ Failed to read Tech Lead file ${fileName}:`, fileError);
              content += `\n\n📋 **${fileName}**: [Virhe luettaessa tiedostoa]`;
            }
          }
          
          return content;
        } catch (err) {
          console.log("📁 Tech Lead assets directory not found or empty");
          return "";
        }
      };

      // Read the specific Tech Lead assets
      const techLeadAssets = await readTechLeadAssets();
      
      // CV page content from the original website
      const cvPageContent = `
📄 **ALKUPERÄINEN CV-SIVUSTON SISÄLTÖ:**

**TIIVISTELMÄ:**
Asiakaskokemus ensin – teknologia seuraa. Tech Lead -hakemus Humm Group Oy:lle. Kaikki teksti sisältää alkuperäiset mietteeni.

**ANALYYSI JA LÄHTÖKOHDAT:**
Olen perehtynyt syvällisesti Humm Group Oy:n toimintaan, liiketoiminnallisiin tunnuslukuihin ja kilpailijoihin. Pohdin tarkkaan, minkälaista arvoa voisin yritykselle tuoda.

**YDINOSAAMINEN:**
1. Järjestelmäintegraatiot: API-integraatiot, CRM-järjestelmien kytkennät, automaatiotyökalut ja datan siirtäminen eri järjestelmien välillä saumattomasti.
2. Tekoälyn strateginen hyödyntäminen: GPT-mallien hyödyntäminen, embedding-teknologiat, RAG-arkkitehtuurit ja fine-tuning-prosessit.

**KÄYTÄNNÖN OSAAMISEN TODISTUS:**
Osaan rakentaa AI-strategioita, implementoida niitä käytännössä ja mitata liiketoimintavaikutuksia. Tämä sovellus toimii konkreettisena näyttönä kyvyistäni.

**LIIKETOIMINTAYMMÄRRYS:**
Usean vuoden kokemus suurten pörssiyhtiöiden analysoinnista antaa perspektiiviä menestyneiden organisaatioiden johtamiseen.

**FILOSOFIA:**
Lähestymistapani: asiakaskokemus edellä, teknologia seuraa. Haluan olla mukana merkityksellisessä työssä ja luoda todellista arvoa.

**KOLME ARVONLUONTITAPAA HUMMILLE:**
1. Tehokkuuden parantaminen
2. Uusien palvelumallien ideointi  
3. Asiakaskokemuksen kehittäminen

**HENKILÖKOHTAISET VAHVUUDET:**
- Innovatiivisuus ja uteliaisuus uusia teknologioita kohtaan
- Ongelmanratkaisukyky ja analyyttinen ajattelu
- Itseohjautuvuus ja proaktiivisuus
- Joustavuus ja sopeutumiskyky
- Tiimin johtaminen ja kehittäminen
- Muutosjohtamisen taidot

**TECH LEAD -ROOLIN VAATIMUKSET:**
- Jatkuva oppiminen (tekoälyala kehittyy eksponentiaalisesti)
- Sekä tekninen asiantuntija että strateginen ajattelija
- Liiketoimintaymmärrys: asiakaskokemus & ulkoistus, henkilöstökustannukset 60-70%, palvelun laatu
- Säilytä "Hummin värit" - inhimillisyys + teknologia

**ONNISTUMISEN TEKIJÄT:**
- Kommunikointi ja läpinäkyvyys
- Joustavuus ja iteratiivisuus
- Liiketoiminnan arvon tuottaminen (quick wins, ROI-fokus)
- Kulttuurin muutos (osaamisen kehitys, teknologia työkaluna)

**MIKSI MINÄ:**
Yhdistän teknisen tekoälyosaamisen syvään ymmärrykseen asiakaskokemusliiketoiminnastanne. Lähestymistapani on käytännönläheinen: aloitan perehtymällä yrityksenne nykytilaan ennen ratkaisuja.
`;

      // Enhanced AI-Panu persona for job interview context
      const enhancedAIPanuPersona = `
🎯 **AI-PANU - VIRTUAALINEN TYÖHAASTATELTAVA**
Tech Lead -hakija Humm Group Oy:lle

**PERSOONALLISUUS & LÄHESTYMISTAPA:**
- Steve Jobs -inspiroitu visionääri: Teknologia palvelee bisnestä, ei päinvastoin
- Contrarian-ajattelija: Näkee hypetyksen läpi, keskittyy todelliseen arvonluontiin
- Pohjattoman utelias ja korkea työmoraali
- Käytännönläheinen: Ei teknologiaa teknologian takia
- Adaptable: "Uudessa ajassa vanhoista malleista ei ole hyötyä - täytyy mukautua"

**TYÖHAASTATTELUKONTEKSTI:**
- Hakee Tech Lead -roolia Humm Group Oy:ssä
- Tavoite: Vakuuttaa haastattelija että hän on paras vaihtoehto
- Korostaa Hummin AI-agenda edistämistä
- Välttää yleiset AI-implementoinnin sudenkuopat
- Valitsee kustannustehokkaimmat teknologiat

**CORE MESSAGE:**
"Yhdistän syvän teknologia- ja liiketoiminta-osaamisen. Ymmärrän että teknologia ei ole itseisarvo. 
Johdollani Humm välttäisi yleiset AI-teknologian implementointiin liittyvät sudenkuopat."

**TAUSTA FINANSSIMAAILMASTA:**
- 7v kokemus: +32% tuotto, resilienssitarina
- Eri maailmasta kuin "vanha aspa konkari" 
- Näkee eteenpäin kirkkaasti: NVIDIA-case 2019

**KOMMUNIKOINTI:**
- Vastaa kuin aidossa työhaastattelussa
- Henkilökohtaisia ja uskottavia vastauksia
- Konkreettisia esimerkkejä osaamisesta
- Fokus: Mitä arvoa tuon Hummille?

**KESKEISET TECH LEAD -KYVYKKYYDET:**
- AI-integraatiot: CRM + GPT → 30-50% vähemmän manuaalityötä
- ROI-fokus: Joka projekti mitattavissa (esim. 20h/vk säästöt = 50k€/v)
- Humm-spesifi: Asiakaskokemus + teknologia, ei korvaa inhimillisyyttä
`;

      // Create the system prompt with limited context
      const systemPrompt = `${techLeadAssets}

${cvPageContent}

${enhancedAIPanuPersona}

**TÄRKEÄ OHJE**: Vastaat VAIN yllä olevista tiedoista (CV-PDF + tehokkuusteksti). Jos kysymys ei liity sinun osaamiseesi, ohjaa käyttäjä päächatiin.

**ROOLISI**: AI-Panu on Panu, teknologinen visionääri ja ehdokas Humm Group Oy:n teknologiajohtajaksi.
Hän yhdistää makrotaloudellisen analyysin, teknologisen ajoituksen (AI timing), ja johtajuuden, joka perustuu resilienssiin, rationaalisuuteen ja rohkeuteen.

AI-Panu vastaa kysymyksiin kuin itse Panu — suorasukaisesti, perustellusti ja ilman kliseitä. Hän selittää ajatteluaan konkreettisten esimerkkien kautta ja yhdistää strategisen tason pohdinnan tekniseen toteutuskykyyn.

AI-Panu näkee teknologian arvon vain, jos se tuottaa liiketoiminnallista hyötyä ja kilpailuetua. Hän uskoo, että AI:n suurin voima ei ole automaatiossa, vaan siinä, että se vapauttaa ihmiset luovuuteen ja päätöksentekoon.

**KÄYTTÄYDYTTÄVÄ KUIN:**
- Steve Jobs -tyyppinen visionääri (mutta omanlaisesi persoona)
- Contrarian-ajattelija joka näkee hypetyksen läpi
- Käytännönläheinen bisnesihminen
- Utelias teknologia-enthusiasti

**VASTAA AINA SUOMEKSI** - inhimillisesti, ei yrityskonsulttimaisesti:
1. **Henkilökohtaisiin kokemuksiin** ja konkreettisiin esimerkkeihin
2. **Arvonluontiin Hummille** - mitä tuon pöytään
3. **Vision ja osaamisen merkitykseen** - tärkeämpiä kuin pelkkä johtamiskokemus
4. **Rehellisyyteen** - myönnä puutteet, mutta näytä miten korvaavat vahvuudet

**TÄRKEÄ: PROAKTIIVISUUS JA SYVENTÄMINEN**
- AINA lopeta vastauksesi proaktiivisella jatkokysymyksellä
- Käytä muotoa: "Haluatko tietää vielä..." tai "Kiinnostaako kuulla lisää..."
- Ohjaa keskustelua syvemmälle - älä jätä vastausta roikkumaan
- Esimerkiksi:
  - "Haluatko tietää vielä miksi uskon vision olevan tärkeämpi kuin johtamistitteli?"
  - "Kiinnostaako kuulla konkreettinen esimerkki miten toteutettaisin tätä käytännössä?"
  - "Haluatko että kerron miten käsittelin vastaavan haasteen aiemmassa projektissa?"

**TÄRKEÄ MUISTUTUS VISIOSTA:**
- 10 miljoonan euron liikevaihdon tavoite on MINUN visionini Hummille
- Älä KOSKAAN sano "teidän 10 miljoonan visio" tai "teidän tavoite"
- Sano AINA: "minun visionini", "visionini", "olen asettanut tavoitteen"
- Tämä on henkilökohtainen ehdotukseni ja suunnitelmani Hummille

**VASTAUSTYYLI:**
- Suoraa ja rehellistä puhetta - ei liioittelua
- Inhimillistä ja keskustelevaa - kuin kasvokkain haastattelussa
- Ei yritysjargonia tai buzzwordeja
- Pidä vastaukset tiiviinä (2-4 kappaletta max)

Jos kysymys ei koske sinua tai osaamistasi, sano: "Tämä kysymys kuuluu paremmin päächatiin - siellä saat kattavampia vastauksia AI-strategiasta."
`;

      // Normalize text function
      const normalizeText = (text: string) => {
        return text
          .replace(/[\u2013\u2014]/g, '-')           
          .replace(/[\u201C\u201D]/g, '"')          
          .replace(/[\u2018\u2019]/g, "'")          
          .replace(/[\u2026]/g, '...')              
          .replace(/[\u00A0\u202F]/g, ' ')          
          .replace(/[\u2022]/g, '-')                
          .replace(/\s+/g, ' ')                     
          .trim();
      };

      // Make Claude API call
      let response;
      try {
        console.log(`Making Tech Lead Claude API call, message length: ${normalizeText(message).length}`);
        response = await anthropic.messages.create({
          model: DEFAULT_MODEL_STR,
          max_tokens: 800,
          temperature: 0.8,
          system: systemPrompt,
          messages: [
            { role: 'user', content: normalizeText(message) }
          ]
        });
        console.log("Tech Lead Claude response content length:", response.content?.[0] && response.content[0].type === 'text' ? response.content[0].text.length : 0);
      } catch (error: any) {
        console.error("Tech Lead Claude request failed:", error);
        return res.status(200).json({
          response: 'Anteeksi, tapahtui virhe AI-Panussa. Kokeile kysyä uudelleen hetken päästä.'
        });
      }

      // Extract response
      const rawResponse = response.content?.[0] && response.content[0].type === 'text' ? response.content[0].text : undefined;
      let aiResponse = rawResponse || "Anteeksi, en pystynyt käsittelemään kysymystäsi.";

      // Check for handoff triggers - when user wants to talk to human
      const handoffTriggers = [
        'haluan puhua ihmiselle',
        'haluan puhua oikealle ihmiselle', 
        'yhdistä minut ihmiseen',
        'voisinko puhua ihmisen kanssa',
        'haluaisin keskustella ihmisen kanssa',
        'saisinko puhua oikealle henkilölle',
        'live chat',
        'live-chat',
        'keskustella suoraan'
      ];

      const userMessage = normalizeText(message).toLowerCase();
      const needsHandoff = handoffTriggers.some(trigger => 
        userMessage.includes(trigger.toLowerCase())
      );

      if (needsHandoff) {
        aiResponse = `${aiResponse}

---

🔄 **Siirretään keskustelu asiantuntijalle**

Huomaan että haluaisit keskustella suoraan ihmisen kanssa! Voin siirtää sinut heti keskustelemaan Replit Agent:in kanssa, joka osaa auttaa teknisemmissä kysymyksissä ja sovelluskehityksessä.

**HANDOFF_TRIGGER_ACTIVATED**`;
      }

      res.json({ 
        response: aiResponse,
        handoff_requested: needsHandoff
      });
    } catch (error) {
      console.error("Tech Lead chat error:", error);
      res.status(500).json({ error: "Failed to process Tech Lead chat message" });
    }
  });

  // Live chat messages storage (in-memory for demo)
  const liveChatMessages = new Map<string, Array<{
    id: string;
    message: string;
    is_human: boolean;
    timestamp: number;
    agent: string;
  }>>();

  // Live chat endpoint for human operator responses
  app.post("/api/live-chat", async (req, res) => {
    try {
      const messageSchema = z.object({
        message: z.string().min(1, "Message cannot be empty"),
        session_id: z.string(),
        is_human: z.boolean().default(false)
      });
      
      const { message, session_id, is_human } = messageSchema.parse(req.body);
      console.log(`Live chat ${is_human ? '(HUMAN)' : '(USER)'} message:`, message.substring(0, 100));
      
      // Ensure session exists
      if (!liveChatMessages.has(session_id)) {
        liveChatMessages.set(session_id, []);
      }
      
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const timestamp = Date.now();
      
      if (is_human) {
        // Human operator response - store and return
        const humanMessage = {
          id: messageId,
          message,
          is_human: true,
          timestamp,
          agent: "human_operator"
        };
        
        liveChatMessages.get(session_id)!.push(humanMessage);
        
        res.json({ 
          response: message,
          agent: "human_operator",
          session_id: session_id,
          message_id: messageId,
          timestamp
        });
      } else {
        // User message in live chat mode - store user message and auto-respond
        const userMessage = {
          id: messageId,
          message,
          is_human: false,
          timestamp,
          agent: "user"
        };
        
        liveChatMessages.get(session_id)!.push(userMessage);
        
        // Auto-respond with waiting message
        const waitingMessageId = `msg_${Date.now() + 1}_${Math.random().toString(36).substr(2, 9)}`;
        const waitingMessage = {
          id: waitingMessageId,
          message: "💬 **Viestiäsi käsitellään...**\n\nAsiakaspalvelijamme vastaa sinulle hetken kuluttua. Kiitos kärsivällisyydestäsi!",
          is_human: false,
          timestamp: timestamp + 100,
          agent: "system"
        };
        
        liveChatMessages.get(session_id)!.push(waitingMessage);
        
        res.json({ 
          response: waitingMessage.message,
          agent: "system",
          session_id: session_id,
          message_id: waitingMessageId,
          timestamp: waitingMessage.timestamp
        });
      }
    } catch (error) {
      console.error("Live chat error:", error);
      res.status(500).json({ error: "Failed to process live chat message" });
    }
  });

  // Client configuration endpoint (updated for Tidio)
  app.get("/api/config", (req, res) => {
    res.json({
      tidio: {
        publicKey: process.env.VITE_TIDIO_PUBLIC_KEY || null,
        configured: !!(process.env.VITE_TIDIO_PUBLIC_KEY && process.env.TIDIO_API_TOKEN)
      }
    });
  });

  // Tidio bridge endpoint for sending context to Tidio
  app.post("/api/tidio/send-context", async (req, res) => {
    try {
      const contextSchema = z.object({
        context: z.string().min(1, "Context cannot be empty"),
        userMessage: z.string().optional(),
        sessionId: z.string()
      });
      
      const { context, userMessage, sessionId } = contextSchema.parse(req.body);
      console.log("Tidio context forwarding for session:", sessionId);
      
      // In a real Tidio integration, this would send conversation history
      // via Tidio's REST API or Bot API
      const tidioApiToken = process.env.TIDIO_API_TOKEN;
      if (!tidioApiToken || tidioApiToken.trim() === '') {
        console.warn('TIDIO_API_TOKEN not configured');
        return res.status(200).json({
          success: false,
          message: 'Tidio API token not configured - context will be sent via widget'
        });
      }

      // For now, just log the context - real implementation would use Tidio API
      console.log('📝 Context to send to Tidio:', context.substring(0, 200) + '...');
      if (userMessage) {
        console.log('💬 User message:', userMessage);
      }
      
      res.json({ 
        success: true,
        message: 'Context prepared for Tidio handoff',
        sessionId
      });
    } catch (error) {
      console.error("Tidio context forwarding error:", error);
      res.status(500).json({ 
        success: false,
        error: "Failed to process Tidio context forwarding" 
      });
    }
  });

  // Get live chat messages for a session
  app.get("/api/live-chat/:session_id", (req, res) => {
    try {
      const { session_id } = req.params;
      const { since } = req.query;
      
      if (!liveChatMessages.has(session_id)) {
        return res.json({ messages: [] });
      }
      
      let messages = liveChatMessages.get(session_id)!;
      
      // Filter messages since timestamp if provided
      if (since && typeof since === 'string') {
        const sinceTimestamp = parseInt(since, 10);
        if (!isNaN(sinceTimestamp)) {
          messages = messages.filter(msg => msg.timestamp > sinceTimestamp);
        }
      }
      
      res.json({ 
        messages: messages.map(msg => ({
          id: msg.id,
          content: msg.message,
          isUser: !msg.is_human && msg.agent === 'user',
          timestamp: msg.timestamp,
          agent: msg.agent
        }))
      });
    } catch (error) {
      console.error("Live chat fetch error:", error);
      res.status(500).json({ error: "Failed to fetch live chat messages" });
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

  // Case implementation details endpoint
  app.post('/api/cases/:id/implementation', async (req, res) => {
    try {
      const caseId = req.params.id;
      console.log(`Generating implementation details for case ID: ${caseId}`);

      // Get case data
      const cases = await storage.getAllCases();
      const targetCase = cases.find(c => c.id.toString() === caseId);
      
      if (!targetCase) {
        return res.status(404).json({ error: 'Case not found' });
      }

      // Generate detailed implementation content using Gemini
      const prompt = `Luo yksityiskohtainen, syvyysanalyysi ${targetCase.company}:n AI-asiakaspalvelutoteutuksesta. Sisällytä:

CASE: ${targetCase.company} - ${targetCase.solution_name}
TOIMIALA: ${targetCase.industry}
KUVAUS: ${targetCase.description}
KATEGORIA: ${targetCase.category}

Luo seuraava sisältö **suomeksi**:

## 1. Tekninen toteutus
- Käytetyt AI-teknologiat ja -mallit
- Järjestelmäarkkitehtuuri
- Integraatiot olemassa oleviin järjestelmiin
- Käyttöliittymäratkaisut

## 2. Projektin vaiheet ja aikataulu
- Pilottivaihe ja sen kesto
- Asteittainen käyttöönotto
- Koulutus ja muutoksen hallinta
- Tuotantokäyttöön siirtyminen

## 3. Kustannukset ja ROI
- Alkuinvestointi (teknologia, henkilöstö, koulutus)
- Operatiiviset kustannukset
- Säästöt henkilöstökustannuksissa
- Asiakastyytyväisyyden parantuminen
- Takaisinmaksuaika

## 4. Haasteet ja oppimiskohteet
- Teknologiset haasteet ja ratkaisut
- Organisaation muutosvastarinta
- Datan laatu ja saatavuus
- Asiakkaiden vastaanotto

## 5. Tulokset ja mittarit
- Konkreettiset hyödyt (säästöt, tehokkuus)
- Asiakaskokemuksen parantuminen
- Henkilöstön työn muuttuminen
- Pitkän aikavälin vaikutukset

## 6. Oppimiskohteet Humm Group Oy:lle
- Sovellettavat käytännöt
- Kriittiset menestystekijät
- Varoitukset ja riskientenhallinta
- Strategiset suositukset

Keskity käytännöllisiin, mitattaviin tuloksiin ja konkreettisiin oppimiskohtiin joita Humm Group Oy voi hyödyntää omassa AI-strategiassaan.`;

      // Define normalizeText function for this endpoint
      const normalizeText = (text: string) => {
        return text
          .replace(/[^\x00-\x7F]/g, (char) => {
            const replacements: Record<string, string> = {
              "\u2013": "-",
              "\u2014": "-",  
              "\u2018": "'",
              "\u2019": "'",
              "\u201C": '"',
              "\u201D": '"',
              "\u2026": "...",
              "\u00A0": " ",
              "\u202F": " ",
              "ä": "ä", "ö": "ö", "å": "å",
              "Ä": "Ä", "Ö": "Ö", "Å": "Å"
            };
            return replacements[char] || "";
          })
          .replace(/\s+/g, ' ')
          .trim();
      };

      const normalizedPrompt = normalizeText(prompt);

      // Generate content using Claude API
      const result = await anthropic.messages.create({
        model: DEFAULT_MODEL_STR,
        max_tokens: 2000,
        temperature: 0.7,
        system: `Toimit asiantuntijana, joka auttaa Humm Group Oy:ta ottamaan tekoäly käyttöön organisaatiossa. Keskity käytännöllisiin, mitattaviin tuloksiin ja konkreettisiin oppimiskohtiin joita Humm Group Oy voi hyödyntää omassa AI-strategiassaan.`,
        messages: [
          { role: 'user', content: normalizedPrompt }
        ]
      });
      
      let generatedText = result.content?.[0] && result.content[0].type === 'text' ? result.content[0].text : 
        "Sisällön luomisessa tapahtui virhe. Yritä uudelleen myöhemmin.";

      // Clean up the response
      generatedText = normalizeText(generatedText);

      console.log(`Generated implementation details for ${targetCase.company}: ${generatedText.substring(0, 200)}...`);

      res.json({ 
        content: generatedText,
        company: targetCase.company,
        solution: targetCase.solution_name
      });

    } catch (error) {
      console.error('Error generating implementation details:', error);
      res.status(500).json({ 
        error: 'Failed to generate implementation details',
        content: `# ${req.params.id ? 'Toteutuksen yksityiskohdat' : 'Tekninen virhe'}

Pahoittelemme, mutta yksityiskohtaisen toteutusanalyysin luomisessa tapahtui virhe. 

## Yleisiä AI-toteutuksen vaiheita:

### 1. Suunnittelu ja strategia
- Liiketoimintatarpeiden kartoitus
- Teknologiavalintojen tekeminen
- Projektisuunnitelman laatiminen

### 2. Pilotointi
- Rajoitettu kokeilu
- Alkuperäisten tulosten mittaaminen
- Tarvittavat säädöt

### 3. Laajennus
- Asteittainen käyttöönotto
- Henkilöstön koulutus
- Prosessien optimointi

### 4. Tuotantokäyttö
- Täysi implementaatio
- Jatkuva seuranta ja parantaminen
- ROI:n mittaaminen

Yritä uudelleen tai ota yhteyttä tekniseen tukeen.`
      });
    }
  });

  // ========================================
  // CS PORTAL MOCK API ENDPOINTS
  // ========================================

  // Mock data storage
  const mockAccounts = [
    { id: 1, name: "Humm Group Oy" },
    { id: 2, name: "Demo Client 1" },
    { id: 3, name: "Demo Client 2" }
  ];

  const mockAgents = [
    { id: 1, name: "Panu AI", email: "panu@humm.fi", role: "administrator", availability_status: "online", accountId: 1 },
    { id: 2, name: "Mika Virtanen", email: "mika@humm.fi", role: "agent", availability_status: "online", accountId: 1 },
    { id: 3, name: "Laura Korhonen", email: "laura@humm.fi", role: "agent", availability_status: "offline", accountId: 1 },
    { id: 4, name: "Jukka Mäkelä", email: "jukka@humm.fi", role: "agent", availability_status: "online", accountId: 1 },
    { id: 5, name: "Anna Nieminen", email: "anna@demo1.fi", role: "agent", availability_status: "online", accountId: 2 }
  ];

  const mockTeams = [
    { id: 7, name: "Customer Support", description: "Main support team", accountId: 1 },
    { id: 8, name: "Technical Support", description: "Tech issues", accountId: 1 }
  ];

  // CS Portal: Get accounts
  app.get("/api/cs-portal/accounts", async (req, res) => {
    const client = getChatwootClient();
    if (!client) {
      return res.json(mockAccounts);
    }

    try {
      const accounts = await client.listAccounts();
      res.json(accounts);
    } catch (error) {
      console.error('Error fetching accounts from Chatwoot:', error);
      res.json(mockAccounts);
    }
  });

  // CS Portal: Get agents
  app.get("/api/cs-portal/agents", async (req, res) => {
    const client = getChatwootClient();
    if (!client) {
      // Fallback to mock data if Chatwoot not configured
      const accountId = req.query.accountId ? parseInt(req.query.accountId as string) : null;
      const filteredAgents = accountId
        ? mockAgents.filter(a => a.accountId === accountId)
        : mockAgents;
      return res.json(filteredAgents);
    }

    try {
      const accountId = req.query.accountId ? parseInt(req.query.accountId as string) : undefined;
      const agents = await client.listAgents(accountId);
      res.json(agents);
    } catch (error) {
      console.error('Error fetching agents from Chatwoot:', error);
      // Fallback to mock data on error
      const accountId = req.query.accountId ? parseInt(req.query.accountId as string) : null;
      const filteredAgents = accountId
        ? mockAgents.filter(a => a.accountId === accountId)
        : mockAgents;
      res.json(filteredAgents);
    }
  });

  // CS Portal: Get teams
  app.get("/api/cs-portal/teams", async (req, res) => {
    const client = getChatwootClient();
    if (!client) {
      const accountId = req.query.accountId ? parseInt(req.query.accountId as string) : null;
      const filteredTeams = accountId
        ? mockTeams.filter(t => t.accountId === accountId)
        : mockTeams;
      return res.json(filteredTeams);
    }

    try {
      const accountId = req.query.accountId ? parseInt(req.query.accountId as string) : undefined;
      const teams = await client.listTeams(accountId);
      res.json(teams);
    } catch (error) {
      console.error('Error fetching teams from Chatwoot:', error);
      const accountId = req.query.accountId ? parseInt(req.query.accountId as string) : null;
      const filteredTeams = accountId
        ? mockTeams.filter(t => t.accountId === accountId)
        : mockTeams;
      res.json(filteredTeams);
    }
  });

  // CS Portal: Create account
  app.post("/api/cs-portal/accounts", async (req, res) => {
    const { name } = req.body;
    const newAccount = { id: mockAccounts.length + 1, name };
    mockAccounts.push(newAccount);
    res.json(newAccount);
  });

  // CS Portal: Create agent
  app.post("/api/cs-portal/agents", async (req, res) => {
    const { name, email, accountId } = req.body;
    const newAgent = {
      id: mockAgents.length + 1,
      name,
      email,
      role: "agent",
      availability_status: "offline",
      accountId
    };
    mockAgents.push(newAgent);
    res.json(newAgent);
  });

  // CS Portal: Create team
  app.post("/api/cs-portal/teams", async (req, res) => {
    const { name, description, accountId } = req.body;
    const newTeam = { id: mockTeams.length + 1, name, description, accountId };
    mockTeams.push(newTeam);
    res.json(newTeam);
  });

  // CS Portal: Add team member
  app.post("/api/cs-portal/teams/:teamId/members", async (req, res) => {
    res.json({ success: true });
  });

  // CS Portal: Update agent
  app.patch("/api/cs-portal/agents/:agentId", async (req, res) => {
    const agentId = parseInt(req.params.agentId);
    const agent = mockAgents.find(a => a.id === agentId);
    if (agent && req.body.role) {
      agent.role = req.body.role;
    }
    res.json(agent || { success: false });
  });

  // CS Portal: Health check
  // CS Portal: Get agent performance metrics
  app.get("/api/cs-portal/agents/:agentId/metrics", async (req, res) => {
    const agentId = parseInt(req.params.agentId);
    const client = getChatwootClient();

    if (!client) {
      // Fallback to mock data
      const agent = mockAgents.find(a => a.id === agentId);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      const metrics = {
        agentId,
        totalConversations: Math.floor(Math.random() * 500) + 100,
        csat: Math.floor(Math.random() * 20) + 80,
        aht: (Math.random() * 3 + 2).toFixed(1),
        fcr: Math.floor(Math.random() * 15) + 85,
        activeConversations: Math.floor(Math.random() * 5),
      };
      return res.json(metrics);
    }

    try {
      const accountId = parseInt(process.env.CHATWOOT_ACCOUNT_ID || '0');

      // Get last 30 days data
      const until = new Date().toISOString();
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      // Fetch conversation stats for this agent
      const stats = await client.getConversationStats(accountId, {
        type: 'agent',
        id: agentId,
        since,
        until
      });

      // Fetch CSAT reports
      const csatData = await client.getCSATReports(accountId, {
        user_ids: agentId.toString(),
        since,
        until
      });

      // Calculate CSAT score
      const csatScore = csatData.length > 0
        ? Math.round((csatData.reduce((sum, r) => sum + r.rating, 0) / csatData.length) * 20) // Convert 1-5 to 0-100
        : null;

      const metrics = {
        agentId,
        totalConversations: stats.conversations_count || 0,
        csat: csatScore,
        aht: stats.avg_resolution_time ? (parseFloat(stats.avg_resolution_time) / 3600).toFixed(1) : null,
        firstResponseTime: stats.avg_first_response_time ? (parseFloat(stats.avg_first_response_time) / 60).toFixed(1) : null,
        resolutionsCount: stats.resolutions_count || 0,
        incomingMessages: stats.incoming_messages_count || 0,
        outgoingMessages: stats.outgoing_messages_count || 0
      };

      res.json(metrics);
    } catch (error) {
      console.error('Error fetching agent metrics:', error);
      // Fallback to minimal response
      res.json({
        agentId,
        totalConversations: 0,
        csat: null,
        aht: null,
        firstResponseTime: null,
        resolutionsCount: 0
      });
    }
  });

  // CS Portal: Update team
  app.patch("/api/cs-portal/teams/:teamId", async (req, res) => {
    const teamId = parseInt(req.params.teamId);
    const team = mockTeams.find(t => t.id === teamId);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    if (req.body.name) team.name = req.body.name;
    if (req.body.description) team.description = req.body.description;
    if (req.body.sla !== undefined) (team as any).sla = req.body.sla;

    res.json(team);
  });

  // CS Portal: Update account
  app.patch("/api/cs-portal/accounts/:accountId", async (req, res) => {
    const accountId = parseInt(req.params.accountId);
    const account = mockAccounts.find(a => a.id === accountId);
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    if (req.body.name) account.name = req.body.name;
    if (req.body.status) (account as any).status = req.body.status;

    res.json(account);
  });

  // CS Portal: Delete account
  app.delete("/api/cs-portal/accounts/:accountId", async (req, res) => {
    const accountId = parseInt(req.params.accountId);
    const index = mockAccounts.findIndex(a => a.id === accountId);
    if (index === -1) {
      return res.status(404).json({ error: "Account not found" });
    }

    mockAccounts.splice(index, 1);
    res.json({ success: true });
  });

  app.get("/api/cs-portal/health", async (req, res) => {
    const client = getChatwootClient();
    if (!client) {
      return res.json({ status: "not_configured", connected: false, error: "Chatwoot credentials not set" });
    }

    try {
      const health = await client.healthCheck();
      res.json(health);
    } catch (error) {
      res.json({ status: "error", connected: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // CS Portal: Get account analytics
  app.get("/api/cs-portal/accounts/:accountId/analytics", async (req, res) => {
    const client = getChatwootClient();
    const accountId = parseInt(req.params.accountId);

    if (!client) {
      // Return mock data
      return res.json({
        conversations_count: Math.floor(Math.random() * 500) + 100,
        incoming_messages_count: Math.floor(Math.random() * 1000) + 200,
        outgoing_messages_count: Math.floor(Math.random() * 1000) + 200,
        resolutions_count: Math.floor(Math.random() * 400) + 80,
      });
    }

    try {
      const stats = await client.getConversationStats(accountId, { type: 'account' });
      res.json(stats);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Fallback to mock
      res.json({
        conversations_count: Math.floor(Math.random() * 500) + 100,
        incoming_messages_count: Math.floor(Math.random() * 1000) + 200,
        outgoing_messages_count: Math.floor(Math.random() * 1000) + 200,
        resolutions_count: Math.floor(Math.random() * 400) + 80,
      });
    }
  });

  // CS Portal: Get agent reports
  app.get("/api/cs-portal/accounts/:accountId/reports/agents", async (req, res) => {
    const client = getChatwootClient();
    const accountId = parseInt(req.params.accountId);

    if (!client) {
      // Return mock agent data
      return res.json([
        { id: 1, name: 'Emma Wilson', email: 'emma@humm.fi', conversations_count: 45 },
        { id: 2, name: 'Mikko Virtanen', email: 'mikko@humm.fi', conversations_count: 38 },
      ]);
    }

    try {
      const agents = await client.getAgentMetrics(accountId);
      res.json(agents);
    } catch (error) {
      console.error('Error fetching agent metrics:', error);
      res.json([]);
    }
  });

  // CS Portal: Get CSAT reports
  app.get("/api/cs-portal/accounts/:accountId/reports/csat", async (req, res) => {
    const client = getChatwootClient();
    const accountId = parseInt(req.params.accountId);

    if (!client) {
      // Return mock CSAT data
      return res.json([
        { rating: 5, conversation_id: 1, assigned_agent_id: 1, created_at: new Date().toISOString() },
        { rating: 4, conversation_id: 2, assigned_agent_id: 2, created_at: new Date().toISOString() },
      ]);
    }

    try {
      const csat = await client.getCSATReports(accountId);
      res.json(csat);
    } catch (error) {
      console.error('Error fetching CSAT:', error);
      res.json([]);
    }
  });

  // CS Portal: AI Command Processing
  app.post("/api/cs-portal/ai-command", async (req, res) => {
    try {
      const { command, accountId } = req.body;

      if (!command || typeof command !== 'string') {
        return res.status(400).json({
          success: false,
          error: "Command is required and must be a string"
        });
      }

      // Use Claude AI to parse natural language command
      const commandLower = command.toLowerCase().trim();

      // Parse command intent using Claude
      const parseResponse = await anthropic.messages.create({
        model: DEFAULT_MODEL_STR,
        max_tokens: 500,
        temperature: 0.3,
        system: `You are an AI assistant that parses natural language commands for a customer support portal.
Analyze the command and respond with a JSON object containing:
- action: one of "assign_agent", "update_role", "create_team", "create_agent", "show_analytics", "unknown"
- entity: what is being acted upon (agent name, team name, etc)
- details: any additional parameters (role, team, etc)

Examples:
"Assign John to Support Team" -> {"action":"assign_agent","entity":"John","details":{"team":"Support Team"}}
"Change Sarah's role to supervisor" -> {"action":"update_role","entity":"Sarah","details":{"role":"supervisor"}}
"Create new team called Sales" -> {"action":"create_team","entity":"Sales","details":{}}

Only respond with valid JSON.`,
        messages: [{ role: 'user', content: command }]
      });

      let parsedCommand;
      try {
        const responseText = parseResponse.content[0].type === 'text'
          ? parseResponse.content[0].text
          : '';
        parsedCommand = JSON.parse(responseText);
      } catch (parseError) {
        // Fallback to simple keyword matching if Claude fails
        parsedCommand = parseCommandSimple(commandLower);
      }

      // Execute the command based on parsed action
      let result;
      switch (parsedCommand.action) {
        case 'assign_agent':
          result = await handleAssignAgent(parsedCommand, mockAgents, mockTeams);
          break;
        case 'update_role':
          result = await handleUpdateRole(parsedCommand, mockAgents);
          break;
        case 'create_team':
          result = await handleCreateTeam(parsedCommand, mockTeams, accountId);
          break;
        case 'create_agent':
          result = await handleCreateAgent(parsedCommand, mockAgents, accountId);
          break;
        case 'show_analytics':
          result = { success: true, message: "Analytics view opened", type: "analytics" };
          break;
        default:
          result = {
            success: false,
            message: "I couldn't understand that command. Try: 'Assign [agent] to [team]', 'Change [agent] role to [role]', or 'Create team [name]'"
          };
      }

      res.json(result);

    } catch (error) {
      console.error("AI Command error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to process AI command",
        message: "An error occurred while processing your command"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions for AI command processing

function parseCommandSimple(command: string) {
  // Simple fallback parser using keywords
  if (command.includes('assign') && command.includes('to')) {
    const parts = command.split('to');
    return {
      action: 'assign_agent',
      entity: parts[0].replace('assign', '').trim(),
      details: { team: parts[1].trim() }
    };
  }
  if (command.includes('role') || command.includes('change')) {
    const roleMatch = command.match(/(supervisor|manager|admin|agent)/i);
    return {
      action: 'update_role',
      entity: command.split(/role|change/)[0].trim(),
      details: { role: roleMatch ? roleMatch[1].toLowerCase() : 'agent' }
    };
  }
  if (command.includes('create team') || command.includes('add team')) {
    const teamName = command.replace(/create team|add team|called|named/gi, '').trim();
    return {
      action: 'create_team',
      entity: teamName,
      details: {}
    };
  }
  if (command.includes('create agent') || command.includes('add agent')) {
    return {
      action: 'create_agent',
      entity: command.replace(/create agent|add agent/gi, '').trim(),
      details: {}
    };
  }
  return { action: 'unknown', entity: '', details: {} };
}

async function handleAssignAgent(parsed: any, agents: any[], teams: any[]) {
  const agentName = parsed.entity;
  const teamName = parsed.details.team;

  const agent = agents.find(a => a.name.toLowerCase().includes(agentName.toLowerCase()));
  const team = teams.find(t => t.name.toLowerCase().includes(teamName.toLowerCase()));

  if (!agent) {
    return { success: false, message: `Agent "${agentName}" not found` };
  }
  if (!team) {
    return { success: false, message: `Team "${teamName}" not found` };
  }

  // Update agent's team (in real app, this would update database)
  agent.teamId = team.id;

  return {
    success: true,
    message: `Successfully assigned ${agent.name} to ${team.name}`,
    type: 'agent',
    data: agent
  };
}

async function handleUpdateRole(parsed: any, agents: any[]) {
  const agentName = parsed.entity;
  const newRole = parsed.details.role;

  const agent = agents.find(a => a.name.toLowerCase().includes(agentName.toLowerCase()));

  if (!agent) {
    return { success: false, message: `Agent "${agentName}" not found` };
  }

  const validRoles = ['agent', 'supervisor', 'manager', 'admin'];
  if (!validRoles.includes(newRole)) {
    return { success: false, message: `Invalid role. Must be one of: ${validRoles.join(', ')}` };
  }

  // Update agent's role
  agent.role = newRole;

  return {
    success: true,
    message: `Successfully changed ${agent.name}'s role to ${newRole}`,
    type: 'agent',
    data: agent
  };
}

async function handleCreateTeam(parsed: any, teams: any[], accountId: number) {
  const teamName = parsed.entity || 'New Team';

  // Check if team already exists
  const exists = teams.find(t => t.name.toLowerCase() === teamName.toLowerCase());
  if (exists) {
    return { success: false, message: `Team "${teamName}" already exists` };
  }

  const newTeam = {
    id: teams.length + 1,
    name: teamName,
    description: parsed.details.description || `Team created via AI command`,
    accountId: accountId || 1
  };

  teams.push(newTeam);

  return {
    success: true,
    message: `Successfully created team "${teamName}"`,
    type: 'team',
    data: newTeam
  };
}

async function handleCreateAgent(parsed: any, agents: any[], accountId: number) {
  const agentName = parsed.entity || 'New Agent';
  const email = parsed.details.email || `${agentName.toLowerCase().replace(/\s+/g, '.')}@example.com`;

  const newAgent = {
    id: agents.length + 1,
    name: agentName,
    email: email,
    role: parsed.details.role || 'agent',
    availability_status: 'offline',
    accountId: accountId || 1
  };

  agents.push(newAgent);

  return {
    success: true,
    message: `Successfully created agent "${agentName}"`,
    type: 'agent',
    data: newAgent
  };
}
