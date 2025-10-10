/**
 * AUTO-IMPORT ATTACHED ASSETS TO RAG
 *
 * OPPITUNTI: Miksi automaattinen import?
 * --------------------------------------
 * Nykyinen attached_assets-systeemi lataa tiedostot cacheen,
 * mutta rajoittaa ne 1500 merkkiin per tiedosto.
 *
 * RAG-systeemillä voimme:
 * 1. Ladata KOKO tiedosto (ei 1500 merkki rajoitusta)
 * 2. Pilkkoa automaattisesti chunkeihin
 * 3. Tehdä semanttisen haun
 *
 * FLOW:
 * Server käynnistyy → initializeCache() → autoImportAttachedAssets()
 * → attached_assets/*.{pdf,txt,md} → RAG vector store
 */

import { promises as fs } from 'fs';
import path from 'path';
import { vectorStore } from './vectorStore.js';
import { processFile } from './documentProcessor.js';

/**
 * TECH LEAD EXCLUSION LIST
 *
 * OPPITUNTI: Data Separation
 * ---------------------------
 * Tech Lead Chat käyttää vain tiettyjä tiedostoja (CV, strategia).
 * Nämä tiedostot EI SAA näkyä:
 * - Main Chat:issa (johdon co-pilot)
 * - RAG Chat:issa (julkinen dokumentti-intelligence)
 *
 * Main Chat on Humm Groupin johdon työkalu joka:
 * - Analysoi taloudellisia lukuja
 * - Tarjoaa strategisia suosituksia
 * - Auttaa AI-implementaatiossa
 * → EI SAA sisältää henkilökohtaista Tech Lead CV:tä!
 */
const TECH_LEAD_EXCLUSIVE_FILES = [
  'Me (1)_1758989917194.pdf',  // Tech Lead CV
  'Pasted-1-Tehokkuuden-parantaminen-Konkreettiset-toimenpiteet-Automatisoi-manuaaliset-prosessit-Integ-1758990330096_1758990330096.txt'  // Tech Lead strategia
];

/**
 * Lataa attached_assets-tiedostot RAG-vektoristoreen
 *
 * OPPITUNTI: Automaattinen pre-loading with exclusions
 * - Käyttäjän ei tarvitse ladata tiedostoja manuaalisesti
 * - Kaikki olemassa olevat dokumentit ovat heti haettavissa
 * - PAITSI Tech Lead -tiedostot (ne ovat vain Tech Lead Chat:issa)
 * - Päivittyy automaattisesti kun serveri käynnistetään
 */
export async function autoImportAttachedAssets(): Promise<void> {
  // Tarkista onko OPENAI_API_KEY asetettu
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('xxx')) {
    console.log("⚠️ OPENAI_API_KEY puuttuu - ohitetaan attached_assets auto-import");
    console.log("   Aseta OPENAI_API_KEY .env-tiedostoon käyttääksesi RAG-toimintoja");
    return;
  }

  try {
    console.log("\n📚 Auto-importing attached_assets to RAG vector store...");
    const startTime = Date.now();

    const assetsDir = path.join(process.cwd(), 'attached_assets');

    // Tarkista onko hakemisto olemassa
    try {
      await fs.access(assetsDir);
    } catch {
      console.log("📁 No attached_assets directory found - skipping auto-import");
      return;
    }

    // Lue kaikki tiedostot
    const files = await fs.readdir(assetsDir);
    const supportedFiles = files.filter(f =>
      f.endsWith('.txt') ||
      f.endsWith('.md') ||
      f.endsWith('.json') ||
      f.endsWith('.pdf')
    );

    if (supportedFiles.length === 0) {
      console.log("📁 No supported files in attached_assets - skipping auto-import");
      return;
    }

    console.log(`📁 Found ${supportedFiles.length} files to import`);

    let successCount = 0;
    let errorCount = 0;
    let totalChunks = 0;

    // Prosessoi tiedostot prioriteetin mukaan (humm-complete-strategy.md ensin)
    const prioritizedFiles = supportedFiles.sort((a, b) => {
      if (a === 'humm-complete-strategy.md') return -1;
      if (b === 'humm-complete-strategy.md') return 1;
      return 0;
    });

    // Prosessoi jokainen tiedosto
    for (const filename of prioritizedFiles) {
      // Skip Tech Lead exclusive files
      if (TECH_LEAD_EXCLUSIVE_FILES.includes(filename)) {
        console.log(`   ⏭️ Skipping ${filename} (Tech Lead exclusive - not for Main Chat or RAG)`);
        continue;
      }

      try {
        const filePath = path.join(assetsDir, filename);

        // Lue tiedosto
        const buffer = await fs.readFile(filePath);

        // Tunnista MIME type
        let mimeType = 'text/plain';
        if (filename.endsWith('.pdf')) {
          mimeType = 'application/pdf';
        } else if (filename.endsWith('.json')) {
          mimeType = 'application/json';
        } else if (filename.endsWith('.md')) {
          mimeType = 'text/markdown';
        }

        // Prosessoi tiedosto → chunkit → embeddings → vector store
        const documents = await processFile(buffer, filename, mimeType);

        // Tarkista onko tiedosto jo vector storessa
        const existingDocs = vectorStore.getAllDocuments();
        const alreadyExists = existingDocs.some(doc =>
          doc.metadata.source === filename
        );

        if (alreadyExists) {
          console.log(`   ⏭️ Skipping ${filename} (already in vector store)`);
          continue;
        }

        // Lisää vector storeen
        await vectorStore.addDocuments(documents);

        successCount++;
        totalChunks += documents.length;
        console.log(`   ✅ Imported ${filename} (${documents.length} chunks)`);

      } catch (error: any) {
        errorCount++;
        console.error(`   ❌ Failed to import ${filename}:`, error.message);
      }
    }

    const duration = Date.now() - startTime;

    console.log(`\n✅ Auto-import completed in ${duration}ms`);
    console.log(`   📊 Success: ${successCount} files, ${totalChunks} chunks`);
    if (errorCount > 0) {
      console.log(`   ⚠️ Errors: ${errorCount} files failed`);
    }

    // Näytä tilastot
    const stats = vectorStore.getStats();
    console.log(`   📈 Total in vector store: ${stats.documentCount} chunks from ${Object.keys(stats.sources).length} sources`);

  } catch (error) {
    console.error("❌ Auto-import failed:", error);
  }
}

/**
 * OPPITUNTI: Milloin kutsua tätä?
 *
 * Kaksi vaihtoehtoa:
 *
 * 1. Server käynnistyksen yhteydessä (suositeltu):
 *    - Pro: Kaikki dokumentit heti käytettävissä
 *    - Con: Hidastaa käynnistystä (~5-10s)
 *
 * 2. Lazy loading (ensimmäisellä RAG-kyselyllä):
 *    - Pro: Nopea käynnistys
 *    - Con: Ensimmäinen kysely hidas
 *
 * Tuotannossa: Käytä erillistä batch-prosessia joka ajaa öisin
 */
