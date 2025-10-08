/**
 * DOCUMENT PROCESSOR
 *
 * OPPITUNTI: Miksi tarvitaan chunking?
 * ------------------------------------
 * AI-malleilla on rajallinen konteksti:
 * - GPT-4: 128k tokenia = ~300 sivua tekstiä
 * - Mutta: paras tarkkuus < 10k tokenia
 * - Ratkaisu: Pilko dokumentti pienempiin osiin
 *
 * CHUNKING STRATEGIAT:
 * 1. Fixed-size: 500 sanaa per chunk (yksinkertainen)
 * 2. Recursive: Kokeile eri separaattoreita (\n\n, \n, ., " ")
 * 3. Semantic: Pilko merkityksellisiin osiin (paragit, otsikot)
 *
 * MIKSI OVERLAP?
 * - Estää kontekstin katoamisen chunk-rajoilla
 * - Esim: "...liikevaihto oli | 2.1M euroa..."
 *          chunk 1 ↑       chunk 2 ↑
 * - Overlap varmistaa molemmat chunkit sisältävät koko lauseen
 */

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import type { Document } from "./vectorStore.js";
import pdfParse from "pdf-parse";

/**
 * Chunking-konfiguraatio
 *
 * OPPITUNTI: Parametrit
 * - chunkSize: Chunkin maksimikoko merkeissä
 * - chunkOverlap: Kuinka paljon chunkit menevät päällekkäin
 * - separators: Missä järjestyksessä kokeillaan pilkkoa tekstiä
 *
 * TUOTANTO-OPTIMOINNIT:
 * - Pienet chunkit (500-1000): Tarkempi haku, mutta enemmän chunkeja
 * - Isot chunkit (2000-4000): Vähemmän API-kutsuja, mutta epätarkempi
 */
export interface ChunkingConfig {
  chunkSize: number;
  chunkOverlap: number;
  separators?: string[];
}

const DEFAULT_CONFIG: ChunkingConfig = {
  chunkSize: 2000, // ~500 sanaa
  chunkOverlap: 200, // 10% overlap
  separators: ["\n\n", "\n", ". ", " ", ""], // Kokeile tässä järjestyksessä
};

/**
 * Pilko teksti chunkeihin
 *
 * OPPITUNTI: RecursiveCharacterTextSplitter
 * - LangChain:n sisäänrakennettu splitter
 * - Kokeilee separaattoreita järjestyksessä
 * - Varmistaa ettei ylitä chunkSize:a
 * - Lisää overlap automaattisesti
 */
export async function chunkText(
  text: string,
  config: ChunkingConfig = DEFAULT_CONFIG
): Promise<string[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: config.chunkSize,
    chunkOverlap: config.chunkOverlap,
    separators: config.separators,
  });

  const chunks = await splitter.splitText(text);

  console.log(
    `📄 Chunked text: ${text.length} chars → ${chunks.length} chunks ` +
    `(avg ${Math.round(text.length / chunks.length)} chars/chunk)`
  );

  return chunks;
}

/**
 * Parsoi PDF-tiedosto tekstiksi
 *
 * OPPITUNTI: PDF Parsing
 * - pdf-parse poimii tekstin PDF:stä
 * - Ei toimi skannatuille PDF:ille (tarvitsisi OCR:n)
 * - Palauttaa myös metadataa (sivumäärä, info jne.)
 */
export async function parsePDF(buffer: Buffer): Promise<{
  text: string;
  numPages: number;
  info?: any;
}> {
  const data = await pdfParse(buffer);

  console.log(`📋 PDF parsed: ${data.numpages} pages, ${data.text.length} characters`);

  return {
    text: data.text,
    numPages: data.numpages,
    info: data.info,
  };
}

/**
 * Prosessoi PDF → Chunkit → Dokumentit
 *
 * OPPITUNTI: End-to-end prosessi
 * 1. Parsoi PDF tekstiksi
 * 2. Pilko tekstin chunkeihin
 * 3. Luo Document-objektit metadata:lla
 * 4. Palauta valmiit dokumentit vector storea varten
 */
export async function processPDF(
  buffer: Buffer,
  filename: string,
  config: ChunkingConfig = DEFAULT_CONFIG
): Promise<Document[]> {
  console.log(`\n🔄 Processing PDF: ${filename}`);

  // 1. Parsoi PDF
  const { text, numPages, info } = await parsePDF(buffer);

  // 2. Chunkkaa teksti
  const chunks = await chunkText(text, config);

  // 3. Luo dokumentit
  const documents: Document[] = chunks.map((chunk, index) => ({
    id: `${filename}-chunk-${index}`,
    pageContent: chunk,
    metadata: {
      source: filename,
      chunk: index,
      totalChunks: chunks.length,
      uploadedAt: new Date().toISOString(),
      numPages,
      pdfInfo: info,
    },
  }));

  console.log(`✅ Created ${documents.length} documents from ${filename}`);

  return documents;
}

/**
 * Prosessoi tekstitiedosto → Chunkit → Dokumentit
 */
export async function processText(
  text: string,
  filename: string,
  config: ChunkingConfig = DEFAULT_CONFIG
): Promise<Document[]> {
  console.log(`\n🔄 Processing text file: ${filename}`);

  // Chunkkaa teksti
  const chunks = await chunkText(text, config);

  // Luo dokumentit
  const documents: Document[] = chunks.map((chunk, index) => ({
    id: `${filename}-chunk-${index}`,
    pageContent: chunk,
    metadata: {
      source: filename,
      chunk: index,
      totalChunks: chunks.length,
      uploadedAt: new Date().toISOString(),
    },
  }));

  console.log(`✅ Created ${documents.length} documents from ${filename}`);

  return documents;
}

/**
 * Automaattinen tiedostotyyppi-tunnistus ja prosessointi
 */
export async function processFile(
  fileBuffer: Buffer,
  filename: string,
  mimeType?: string,
  config?: ChunkingConfig
): Promise<Document[]> {
  // Tunnista tiedostotyyppi
  const isPDF = filename.toLowerCase().endsWith('.pdf') ||
                mimeType === 'application/pdf';

  if (isPDF) {
    return processPDF(fileBuffer, filename, config);
  } else {
    // Oletetaan tekstitiedosto
    const text = fileBuffer.toString('utf-8');
    return processText(text, filename, config);
  }
}

/**
 * TESTAUS: Kokeile document processor
 */
export async function testDocumentProcessor() {
  console.log("\n🧪 DOCUMENT PROCESSOR TEST\n");

  // 1. Testi: Chunkkaus
  console.log("1️⃣ Text chunking test:\n");

  const longText = `
Humm Group Oy on suomalainen asiakaspalveluratkaisu-yhtiö, joka on perustettu vuonna 2018.

Yrityksen liikevaihto vuonna 2024 oli 2.1 miljoonaa euroa. Käyttökate oli 15% ja nettotulos oli positiivinen ensimmäistä kertaa yrityksen historiassa. Tämä oli merkittävä saavutus, sillä kasvuyhtiöt usein tekevät tappiota alkuvuosina investoidessaan tulevaisuuteen.

Asiakastyytyväisyys nousi vuoden aikana merkittävästi. CSAT-luku parani 7.2:sta 8.5:een, mikä on 18% parannus. Tärkeimmät kehityskohteet ovat vasteaikojen lyhentäminen ja proaktiivisuuden parantaminen asiakaspalvelussa.

AI-transformaation tavoitteena on automatisoida 40% rutiinitehtävistä vuoden 2025 loppuun mennessä. Tavoitteena on myös parantaa asiakaskokemusta 25% ja vähentää tukipyyntöjen määrää 30%. Nämä tavoitteet ovat kunnianhimoisia mutta saavutettavissa oikealla teknologialla ja toteutuksella.

Yritys työllistää tällä hetkellä 25 henkilöä ja suunnittelee kasvattavansa henkilöstöä 40:een vuoden 2025 loppuun mennessä. Avainrekrytoinnit keskittyvät tekniseen osaamiseen ja AI-spesialisteihin.
  `.trim();

  const chunks = await chunkText(longText, {
    chunkSize: 300,
    chunkOverlap: 50,
  });

  console.log(`Original text: ${longText.length} characters`);
  console.log(`Chunks created: ${chunks.length}\n`);

  chunks.forEach((chunk, i) => {
    console.log(`Chunk ${i + 1} (${chunk.length} chars):`);
    console.log(`"${chunk.substring(0, 100)}..."\n`);
  });

  // 2. Testi: Tekstitiedoston prosessointi
  console.log("\n2️⃣ Text file processing test:\n");

  const documents = await processText(longText, "humm_overview_2024.txt", {
    chunkSize: 300,
    chunkOverlap: 50,
  });

  console.log(`\nCreated documents:`);
  documents.forEach((doc, i) => {
    console.log(`\n  Document ${i + 1}:`);
    console.log(`    ID: ${doc.id}`);
    console.log(`    Content: "${doc.pageContent.substring(0, 80)}..."`);
    console.log(`    Metadata: ${JSON.stringify(doc.metadata, null, 6)}`);
  });

  console.log("\n✅ Test completed!");
  console.log("\n📚 OPPITUNTI:");
  console.log("   - Chunking pilkkoo pitkät tekstit hallittaviin osiin");
  console.log("   - Overlap varmistaa kontekstin säilymisen");
  console.log("   - Metadata auttaa jäljittämään lähteet");
}

// Aja testi jos tiedosto suoritetaan directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testDocumentProcessor().catch(console.error);
}
