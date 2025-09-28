import { promises as fs } from 'fs';
import path from 'path';

interface CacheData {
  cases: any[];
  trends: any[];
  attachedAssets: string;
  lastUpdated: number;
}

let cache: CacheData | null = null;

/**
 * Reads and caches static data from attached_assets, cases, and trends
 * This eliminates slow file I/O on each API request
 */
export async function initializeCache(): Promise<void> {
  console.log("🚀 Initializing server-side cache...");
  
  try {
    const startTime = Date.now();
    
    // Read attached assets
    const attachedAssets = await readAttachedAssets();
    
    // Load cases data (static for now)
    const cases = await loadCasesData();
    
    // Load trends data (static for now)  
    const trends = await loadTrendsData();
    
    cache = {
      cases,
      trends,
      attachedAssets,
      lastUpdated: Date.now()
    };
    
    const loadTime = Date.now() - startTime;
    console.log(`✅ Cache initialized successfully in ${loadTime}ms`);
    console.log(`📁 Cached ${cases.length} cases, ${trends.length} trends, ${attachedAssets.length} chars of assets`);
    
  } catch (error) {
    console.error("❌ Failed to initialize cache:", error);
    // Set empty cache to prevent crashes
    cache = {
      cases: [],
      trends: [],
      attachedAssets: "",
      lastUpdated: Date.now()
    };
  }
}

/**
 * Gets cached data - much faster than file I/O
 */
export function getCachedData(): CacheData {
  if (!cache) {
    console.warn("⚠️ Cache not initialized, returning empty data");
    return {
      cases: [],
      trends: [],
      attachedAssets: "",
      lastUpdated: 0
    };
  }
  return cache;
}

/**
 * Force refresh cache (useful for development)
 */
export async function refreshCache(): Promise<void> {
  console.log("🔄 Refreshing cache...");
  await initializeCache();
}

/**
 * Read attached assets and cache them
 */
async function readAttachedAssets(): Promise<string> {
  try {
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
        console.log(`📁 Caching attached_assets: ${supportedFiles.length} files found (${supportedFiles.join(', ')})`);
        
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
                console.log(`📋 PDF cached: ${f} (${content.length} characters)`);
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
}

/**
 * Load cases data - in production this could come from database
 */
async function loadCasesData(): Promise<any[]> {
  // For now, return static cases data with all required fields for CaseCard
  // In production, this could read from database or files
  return [
    {
      "id": "alibaba",
      "company": "Alibaba",
      "country": "Kiina", 
      "industry": "E-commerce & Cloud",
      "category": "AI Asiakaspalvelu",
      "icon": "🛒",
      "solution_name": "AI-powered customer service",
      "description": "Alibaba käyttää tekoälyä asiakaspalvelussaan vastatakseen miljooniin kysymyksiin vuodessa. Heidän AI-järjestelmänsä osaa ratkaista 95% asiakkaiden ongelmista ilman ihmisen väliintuloa.",
      "key_metrics": [
        {
          "type": "time",
          "value": "< 1s",
          "label": "Vastausaika"
        },
        {
          "type": "percentage", 
          "value": "95%",
          "label": "Ratkaisuaste"
        },
        {
          "type": "savings",
          "value": "70%",
          "label": "Säästöt"
        }
      ],
      "learning_points": [
        "Tekoäly pystyy käsittelemään 95% asiakaskysymyksistä itsenäisesti",
        "Merkittävät kustannussäästöt henkilöstökuluissa",
        "Asiakastyytyväisyys nousi automatisoidun palvelun myötä",
        "Skaalautuvuus mahdollistaa miljoonien kysymysten käsittelyn"
      ],
      "metrics": {
        "response_time": "< 1 sekunti", 
        "resolution_rate": "95%",
        "cost_savings": "70%",
        "customer_satisfaction": "4.8/5"
      },
      "implementation": {
        "duration": "18 kuukautta",
        "team_size": "25 henkilöä", 
        "technology": ["Natural Language Processing", "Machine Learning", "Cloud Computing"],
        "challenges": ["Kielien moninaisuus", "Skaalautuvuus", "Integraatio legacy-järjestelmiin"]
      }
    }
    // More cases would be loaded here...
  ];
}

/**
 * Load trends data - in production this could come from database
 */
async function loadTrendsData(): Promise<any[]> {
  // For now, return static trends data
  // In production, this could read from database or files
  return [
    {
      "id": "autonomous_agents_2024",
      "title": "Autonomiset AI-agentit vallankumouksessaan asiakaspalvelussa",
      "category": "autonomous_agents",
      "summary": "AI-agentit kehittyvät itsenäisiksi ongelmanratkaisijoiksi",
      "content": "Vuonna 2024 autonomiset AI-agentit ovat mullistamassa asiakaspalvelua..."
    }
    // More trends would be loaded here...
  ];
}