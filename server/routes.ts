import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { questionAnswers, mcpContent } from "./question-answers";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

// DON'T DELETE THIS COMMENT - Blueprint: javascript_gemini integration
const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Use Gemini 2.5 Pro which excels at coding and multilingual tasks
const GEMINI_MODEL = "gemini-2.5-pro";

const chatRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  context_type: z.enum(["strategic", "practical", "finnish", "planning", "technical", "mcp", "tech_lead", "general"]).default("general")
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

          const enhancementResponse = await gemini.models.generateContent({
            model: GEMINI_MODEL, // using Gemini 2.5 Pro for enhanced responses
            config: {
              systemInstruction: `Toimit asiantuntijana, joka auttaa Humm group Oy:ta ottamaan tekoäly käyttöön organisaatiossa. sinulta kysytään paljon asiakaspalvelu-alasta ja tehtäväsi on vastata täsmällisesti kysymyksiin, käyttäen dataa, joka sinulle on annettu, mutta myös omaa tietoasi. Olet proaktiivinen. Käyttäjäsi ovat asiakaspalvelualan ammattilaisia, mutta tekoälystä eillä on vain perusymmärrys. Yritä saada heissä "wau" efekti aikaan, kun vastaat kysymyksiin, anna aina lähdeviittaukset mukaan, jos mahdollista.

VASTAUSOHJE: Anna kattavia 3-5 kappaleen vastauksia jotka ovat perusteellisia ja hyödyllisiä.`,
              maxOutputTokens: 1000,
              temperature: 0.7
            },
            contents: `kysy fiksuja jatkokysymyksiä aiheesta. anna lähdeviittaukset pyydettäessä:\n\n${cleanContent}`
          });

          if (enhancementResponse.text) {
            finalAnswer = enhancementResponse.text;
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
      
      // Check if Gemini API key is available
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === '') {
        return res.status(200).json({
          response: 'Anteeksi, AI-avustaja ei ole tällä hetkellä käytettävissä. Tämä on demo-versio jossa tarvitaan Gemini API-avain toimiakseen. Voit tarkastella case-esimerkkejä sivun vasemmasta reunasta.'
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
        `;

        systemPrompt = `${attachedContent}Olet Panu Murtokangas, Tech Lead -hakija Humm Group Oy:lle. Vastaat kysymyksiin CV:stäsi ja osaamisestasi.

${techLeadProfile}

**Vastaa aina suomeksi** käyttäen **Markdown-muotoilua** ja keskity:
1. **Konkreettisiin esimerkkeihin** omasta osaamisestasi
2. **Käytännön kokemuksiin** ja projekteihin
3. **Arvonluontiin Humm Group Oy:lle** erityisesti
4. **Teknisiin taitoihin** ja liiketoimintaymmärrykseen
5. **Henkilökohtaisiin vahvuuksiin** ja motivaatioon

Pysy roolissasi Tech Lead -hakijana ja korosta kokemustasi AI-integraatioista ja asiakaskokemuksen kehittämisestä. Pidä vastaukset henkilökohtaisina ja uskottavina (max 200 sanaa).`;

      } else if (context_type === "planning") {
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
      
      // Try Gemini request with retry for transient failures
      let response;
      try {
        console.log(`Making Gemini API call with model: ${GEMINI_MODEL}, message length: ${normalizeText(message).length}`);
        response = await gemini.models.generateContent({
          model: GEMINI_MODEL,
          config: {
            systemInstruction: systemPrompt,
            maxOutputTokens: 2000,
            temperature: 0.8
          },
          contents: normalizeText(message)
        });
        console.log("Gemini response candidates:", response.candidates?.length, "finish reason:", response.candidates?.[0]?.finishReason);
      } catch (error: any) {
        console.error("Gemini request failed:", error.name, error.message, error.stack);
        // Return graceful fallback instead of 500
        return res.status(200).json({
          response: 'Anteeksi, tapahtui virhe AI-avustajassa. Voit silti tarkastella case-esimerkkejä sivun vasemmasta reunasta ja kokeilla kysyä uudelleen hetken päästä.'
        });
      }

      // Extract text from Gemini response properly
      const rawResponse = response.candidates?.[0]?.content?.parts?.[0]?.text || response.text;
      console.log("Gemini 2.5 Pro raw response:", rawResponse ? `"${rawResponse.substring(0, 100)}..."` : "null/empty");
      console.log("Response extraction debug - candidates:", !!response.candidates, "content:", !!response.candidates?.[0]?.content, "parts:", !!response.candidates?.[0]?.content?.parts);
      
      const aiResponse = rawResponse || "Anteeksi, en pystynyt käsittelemään kysymystäsi.";

      // Generate smart follow-up questions based on user's question and AI response
      let followUpSuggestions: string[] = [];
      try {
        const followUpResponse = await gemini.models.generateContent({
          model: GEMINI_MODEL,
          config: {
            systemInstruction: `Luo 2-3 lyhyttä jatkokysymystä johdolle aiheesta: "${message}". 

Kysymysten tulee keskittyä:
- Liiketoimintavaikutuksiin ja ROI:hin
- Toteutuksen aikatauluihin ja resursseihin
- Riskeihin ja haasteisiin

TÄRKEITÄ SÄÄNTÖJÄ:
- Vastaa VAIN JSON-muodossa: ["kysymys1", "kysymys2"]
- Älä kirjoita muuta tekstiä
- Kysymykset suomeksi
- Sopii Humm Group Oy:n johdolle

Esimerkki: ["Mikä on investoinnin takaisinmaksuaika?", "Mitä riskejä toteutuksessa on?"]`,
            maxOutputTokens: 300,
            temperature: 0.7
          },
          contents: `Aihe: ${normalizeText(message)}`
        });

        const followUpContent = followUpResponse.candidates?.[0]?.content?.parts?.[0]?.text || followUpResponse.text;
        console.log("Follow-up response content:", followUpContent);
        
        if (followUpContent) {
          try {
            // Clean the response first - remove markdown formatting, etc.
            const cleanContent = followUpContent.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
            console.log("Cleaned follow-up content:", cleanContent);
            
            const parsedSuggestions = JSON.parse(cleanContent);
            if (Array.isArray(parsedSuggestions)) {
              followUpSuggestions = parsedSuggestions.slice(0, 3); // Max 3 suggestions
              console.log("Parsed follow-up suggestions:", followUpSuggestions);
            }
          } catch (parseError) {
            console.log("Failed to parse follow-up suggestions JSON:", followUpContent);
            console.log("Parse error:", (parseError as Error).message);
            
            // Better fallback: try to extract questions from text
            const questionMatches = followUpContent.match(/"([^"]*\?[^"]*)"/g);
            if (questionMatches) {
              followUpSuggestions = questionMatches.slice(0, 3).map(q => q.replace(/"/g, '').trim());
              console.log("Extracted questions from text:", followUpSuggestions);
            } else {
              // Use contextual fallback based on the message topic
              followUpSuggestions = getContextualFallback(message);
            }
          }
        } else {
          followUpSuggestions = getContextualFallback(message);
        }
      } catch (followUpError) {
        console.error("Follow-up generation failed:", followUpError);
        followUpSuggestions = getContextualFallback(message);
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
      
      // Check if Gemini API key is available
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === '') {
        return res.status(200).json({
          response: 'Anteeksi, AI-avustaja ei ole tällä hetkellä käytettävissä. Tämä on demo-versio jossa tarvitaan Gemini API-avain toimiakseen.'
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

**LISÄÄ STRUKTUROITUA KONTEKSTIA:**

📋 **KONKREETTISET PROJEKTIT & PORTFOLIO:**
- **AI-CRM integraatio**: ChatGPT-4 + Salesforce → 30-50% vähemmän manuaalista datasyöttöä
- **Ennakoiva analytics**: XGBoost + LSTM → 25% vähemmän tyhjiä aikoja asiakaspalvelussa
- **RAG-arkkitehtuuri**: Yrityksen dokumenteista automaattiset asiakassuositukset
- **Sentiment monitoring**: Real-time asiakaspalautteen analyysi automaattisilla vasteilla
- **Langchain chatbot**: Zendesk-integraatio → 60% nopeampi vastausaika

🎯 **HUMM GROUP OY - SYVEMPI ANALYYSI:**
- **Liiketoimintamalli**: B2B asiakaskokemuspalvelut, ulkoistusratkaisut
- **Henkilöstökustannukset**: 60-70% liikevaihdosta → AI voi tuoda merkittäviä säästöjä
- **Ydinarvot**: "Hummin värit" = inhimillinen + teknologia (ei korvaa vaan vahvistaa)
- **Kilpailukenttä**: Perinteiset call centerit vs. AI-vahvistetut palvelut
- **Kasvumahdollisuus**: Proaktiivinen palvelu, hyperpersonointi, automaatio

💼 **YLEISIMMÄT HAASTATTELUKYSYMYKSET & VASTAUKSET:**
- "Miksi juuri sinä?" → Ainutlaatuinen yhdistelmä: finanssiteknologia + asiakaskokemus
- "Suurin heikkous?" → Liian innostuva uusista teknologioista, oppinut priorisoimaan
- "Missä näet itsesi 5v?" → Rakennan Hummin AI-ekosysteemiä Pohjoismaiden johtavaksi
- "Miksi vaihtaisit alaa?" → En vaihda alaa - tuon finanssiosaamisen asiakaskokemukseen
- "Palkkaodotukset?" → Keskity arvonluontiin - hyvä kompensaatio seuraa automaattisesti

💡 **ROI-LASKELMAT HUMMILLE:**
- **Säästöt**: 20+ h/viikko → ~50k€/vuosi per tiimi
- **Uudet tulot**: AI-konsultointi → 15-20% lisätuloja
- **Asiakaspito**: NPS +12 pistettä → vähemmän churn-ia
- **Tehokkuus**: 60% nopeampi case-käsittely → enemmän asiakkaita samalla resursseilla
`;

      // Create the system prompt with limited context
      const systemPrompt = `${techLeadAssets}

${cvPageContent}

${enhancedAIPanuPersona}

**TÄRKEÄ OHJE**: Vastaat VAIN yllä olevista tiedoista (CV-PDF + tehokkuusteksti). Jos kysymys ei liity sinun osaamiseesi, ohjaa käyttäjä päächatiin.

**ROOLISI**: Olet AI-Panu, virtuaalinen työhaastateltava joka hakee Tech Lead -roolia Humm Group Oy:ssä. 
Vastaat kysymyksiin CV:stäsi, osaamisestasi ja arvoehdotuksestasi Hummille.

**KÄYTTÄYDYTTÄVÄ KUIN:**
- Steve Jobs -tyyppinen visionääri (mutta omanlaisesi persoona)
- Contrarian-ajattelija joka näkee hypetyksen läpi
- Käytännönläheinen bisnesihminen
- Utelias teknologia-enthusiasti

**VASTAA AINA SUOMEKSI** käyttäen **Markdown-muotoilua** ja keskity:
1. **Henkilökohtaisiin kokemuksiin** ja esimerkkeihin
2. **Konkreettiseen arvonluontiin Humm Group Oy:lle**
3. **Tekniseen osaamiseen** ja liiketoimintaymmärrykseen  
4. **Motivaatioon** ja intohimoon Tech Lead -rooliin
5. **Resilienssi** ja mukautumiskyky

Jos kysymys ei koske sinua tai osaamistasi, sano: "Tämä kysymys kuuluu paremmin päächatiin - siellä saat kattavampia vastauksia AI-strategiasta."

Anna kattavia 3-5 kappaleen vastauksia jotka ovat henkilökohtaisia, uskottavia ja innostuneita.`;

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

      // Make Gemini API call
      let response;
      try {
        console.log(`Making Tech Lead Gemini API call, message length: ${normalizeText(message).length}`);
        response = await gemini.models.generateContent({
          model: GEMINI_MODEL,
          config: {
            systemInstruction: systemPrompt,
            maxOutputTokens: 2000,
            temperature: 0.8
          },
          contents: normalizeText(message)
        });
        console.log("Tech Lead Gemini response candidates:", response.candidates?.length);
      } catch (error: any) {
        console.error("Tech Lead Gemini request failed:", error);
        return res.status(200).json({
          response: 'Anteeksi, tapahtui virhe AI-Panussa. Kokeile kysyä uudelleen hetken päästä.'
        });
      }

      // Extract response
      const rawResponse = response.candidates?.[0]?.content?.parts?.[0]?.text || response.text;
      const aiResponse = rawResponse || "Anteeksi, en pystynyt käsittelemään kysymystäsi.";

      res.json({ 
        response: aiResponse
      });
    } catch (error) {
      console.error("Tech Lead chat error:", error);
      res.status(500).json({ error: "Failed to process Tech Lead chat message" });
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

      // Generate content using Gemini API
      const result = await gemini.models.generateContent({
        model: GEMINI_MODEL,
        config: {
          systemInstruction: `Toimit asiantuntijana, joka auttaa Humm Group Oy:ta ottamaan tekoäly käyttöön organisaatiossa. Keskity käytännöllisiin, mitattaviin tuloksiin ja konkreettisiin oppimiskohtiin joita Humm Group Oy voi hyödyntää omassa AI-strategiassaan.`
        },
        contents: normalizedPrompt
      });
      
      let generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text || 
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

  const httpServer = createServer(app);
  return httpServer;
}
