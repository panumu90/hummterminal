import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { questionAnswers, mcpContent } from "./question-answers";
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

// Use GPT-3.5-turbo which should be available on most API keys
const GPT_MODEL = "gpt-3.5-turbo";

const chatRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  context_type: z.enum(["strategic", "practical", "finnish", "planning", "technical", "mcp", "general"]).default("general")
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

          const enhancementResponse = await openai.chat.completions.create({
            model: GPT_MODEL, // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
            messages: [
              {
                role: "system",
                content: `Toimi asiantuntijana, joka auttaa humm.fi yritystä ottamaan tekoäly käyttöön organisaatiossa.
Tiivistä olennainen niin, että vastaus on:
- Helppo lukea
- Informatiivinen
- Enintään 120 sanaa`
              },
              {
                role: "user", 
                content: `kysy fiksuja jatkokysymyksiä aiheesta. anna lähdeviittaukset pyydettäessä:\n\n${cleanContent}`
              }
            ],
            max_completion_tokens: 300,
          });

          if (enhancementResponse.choices[0].message.content) {
            finalAnswer = enhancementResponse.choices[0].message.content;
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
        // Aggressive normalization to prevent ByteString errors
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
      
      // Read attached assets for all contexts
      const attachedContent = await readAttachedAssets();
      
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

**Vastaa aina suomeksi käyttäen Markdown-muotoilua.** Jos kysytään MCP:stä, selitä Model Context Protocol yllä olevan tiedon mukaan. Keskity strategisiin näkökulmiin (max 200 sanaa).`;
        
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

Pidä vastaukset Suomi-keskeisinä (max 200 sanaa).`;
        
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

"Johtavat teknologiayritykset (Anthropic, OpenAI, Microsoft) kehittävät parhaillaan MCP:n turvallisuutta vahvalla autentikoinnilla ja AI-hallintamalleilla. Organisaatioiden kannattaa seurata näitä kehityssuuntia."

Respond in Finnish using Markdown formatting. Focus on strategic benefits for humm.fi (max 200 words).`;

      } else if (context_type === "planning" || context_type === "strategic") {
        const planningTrends = trends.filter(t => t.category === "automation" || t.category === "strategic");
        const trendsContent = planningTrends.map(t => 
          `${normalizeText(t.title)}: ${Array.isArray(t.key_points) ? (t.key_points as string[]).slice(0, 2).map(p => normalizeText(p)).join("; ") : ""}`
        ).join("\n\n");
        
        const keyLearnings = cases.map(c => 
          `${normalizeText(c.company)}: ${Array.isArray(c.learning_points) ? c.learning_points.map(p => normalizeText(p)).slice(0, 2).join("; ") : ""}`
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

**PAKOLLINEN:** Jos kysymys sisältää sanan "MCP", käytä VAIN yllä olevaa Model Context Protocol -määritelmää vastauksessasi. Pidä vastaukset strategisina ja toimintasuuntautuneina humm.fi:lle (max 200 sanaa).`;
        
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

Pidä vastaukset informatiivisina ja toimintasuuntautuneina (max 200 sanaa).`;
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
      
      // Try OpenAI request with retry for transient failures
      let response;
      try {
        response = await openai.chat.completions.create({
          model: GPT_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: normalizeText(message) }
          ],
          max_completion_tokens: 500,
        });
      } catch (error: any) {
        console.error("OpenAI request failed:", error.name, error.message);
        // Return graceful fallback instead of 500
        return res.status(200).json({
          response: 'Anteeksi, tapahtui virhe AI-avustajassa. Voit silti tarkastella case-esimerkkejä sivun vasemmasta reunasta ja kokeilla kysyä uudelleen hetken päästä.'
        });
      }

      const rawResponse = response.choices[0].message.content;
      console.log("GPT-5 raw response:", rawResponse ? `"${rawResponse.substring(0, 100)}..."` : "null/empty");
      
      const aiResponse = rawResponse || "Anteeksi, en pystynyt käsittelemään kysymystäsi.";

      // Generate smart follow-up questions based on user's question and AI response
      let followUpSuggestions: string[] = [];
      try {
        const followUpResponse = await openai.chat.completions.create({
          model: GPT_MODEL,
          messages: [
            {
              role: "system",
              content: `Analysoi käyttäjän kysymystä ja AI:n vastausta. Luo 2-3 älykästä, relevanttia jatkokysymystä jotka:
- Syventävät aihetta
- Ovat käytännöllisiä ja hyödyllisiä
- Keskittyvät AI:n käyttöönottoon ja toteutukseen
- Sopivat humm.fi:n asiantuntijatarpeisiin

Vastaa vain JSON-muodossa: ["kysymys1", "kysymys2", "kysymys3"]`
            },
            {
              role: "user",
              content: `Käyttäjän kysymys: "${normalizeText(message)}"
AI:n vastaus: "${aiResponse.substring(0, 200)}..."`
            }
          ],
          max_completion_tokens: 200,
        });

        const followUpContent = followUpResponse.choices[0].message.content;
        if (followUpContent) {
          try {
            const parsedSuggestions = JSON.parse(followUpContent);
            if (Array.isArray(parsedSuggestions)) {
              followUpSuggestions = parsedSuggestions.slice(0, 3); // Max 3 suggestions
            }
          } catch (parseError) {
            console.log("Failed to parse follow-up suggestions JSON:", followUpContent);
            // Fallback: extract questions from text
            const lines = followUpContent.split('\n').filter(line => 
              line.trim().length > 10 && 
              (line.includes('?') || line.toLowerCase().includes('kuinka') || line.toLowerCase().includes('mitä'))
            );
            followUpSuggestions = lines.slice(0, 3).map(line => line.replace(/^[^a-zA-Zäöå]*/, '').trim());
          }
        }
      } catch (followUpError) {
        console.error("Follow-up generation failed:", followUpError);
        // Provide fallback suggestions based on common AI topics
        const fallbackSuggestions = [
          "Mitä teknologiaa tarvitaan AI-agenttien integrointiin?",
          "Miten arvioidaan AI-toteutuksen ROI:ta?",
          "Millaisia riskejä AI-käyttöönotossa tulee huomioida?"
        ];
        followUpSuggestions = fallbackSuggestions.slice(0, 2);
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
