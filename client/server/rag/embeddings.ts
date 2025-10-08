/**
 * RAG EMBEDDINGS UTILITY
 *
 * Tämä moduuli hoitaa tekstin muuntamisen vektoreiksi (embeddings).
 *
 * KONSEPTI:
 * --------
 * Embeddings ovat tekstin numeerisia esityksiä, jotka tallentavat semanttisen merkityksen.
 * Esim: "koira" ja "pentu" ovat lähellä toisiaan vektoriavaruudessa.
 *
 * MIKSI OpenAI text-embedding-3-small?
 * - Nopea ja halpa (0.02$ per 1M tokenia)
 * - 1536 dimensiota (hyvä tasapaino laadun ja nopeuden välillä)
 * - Tukee monia kieliä (myös suomi)
 *
 * VAIHTOEHDOT tuotantoon:
 * - text-embedding-3-large (3072 dim, parempi laatu, 2x kalliimpi)
 * - Voyage AI (parempi koodin ymmärtämiseen)
 * - E5-multilingual (ilmainen, self-hosted)
 */

import { OpenAIEmbeddings } from "@langchain/openai";

/**
 * Embedding-konfiguraatio
 *
 * OPPITUNTI: Miksi cached singleton?
 * - OpenAI-yhteys on kallis luoda uudelleen
 * - Singleton-pattern varmistaa yhden instanssin koko appissa
 */
let embeddingsInstance: OpenAIEmbeddings | null = null;

export function getEmbeddings(): OpenAIEmbeddings {
  if (!embeddingsInstance) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY puuttuu ympäristömuuttujista. " +
        "Lisää se .env-tiedostoon tai Replit Secrets."
      );
    }

    embeddingsInstance = new OpenAIEmbeddings({
      modelName: "text-embedding-3-small",
      openAIApiKey: apiKey,
      // Batch-koko: montako tekstiä embedoidaan kerralla
      // Suurempi = nopeampi mutta enemmän muistia
      batchSize: 512,
    });

    console.log("✅ Embeddings initialized: text-embedding-3-small");
  }

  return embeddingsInstance;
}

/**
 * Embed yksittäinen teksti
 *
 * @example
 * const vector = await embedText("Hummin liikevaihto 2024");
 * // Returns: [0.23, -0.45, ..., 0.12] (1536 numeroa)
 */
export async function embedText(text: string): Promise<number[]> {
  const embeddings = getEmbeddings();
  const result = await embeddings.embedQuery(text);

  console.log(`📊 Embedded text (${text.length} chars) → ${result.length} dimensions`);

  return result;
}

/**
 * Embed lista tekstejä kerralla (tehokkaampi)
 *
 * OPPITUNTI: Batching
 * - OpenAI API tukee max 2048 input kerralla
 * - Batch-embedding on 3-5x nopeampi kuin yksittäiset kutsut
 * - Säästää API-kutsuja ja rahaa
 */
export async function embedTexts(texts: string[]): Promise<number[][]> {
  const embeddings = getEmbeddings();

  console.log(`📊 Batch embedding ${texts.length} texts...`);
  const startTime = Date.now();

  const results = await embeddings.embedDocuments(texts);

  const duration = Date.now() - startTime;
  console.log(`✅ Batch completed in ${duration}ms (${Math.round(duration / texts.length)}ms per text)`);

  return results;
}

/**
 * Laske cosine similarity kahden vektorin välillä
 *
 * OPPITUNTI: Cosine Similarity
 * - Mittaa kahden vektorin välistä kulmaa
 * - Arvo 0-1: 1 = identtiset, 0 = täysin eri
 * - Parempi kuin euklidinen etäisyys tekstille
 *
 * Kaava: similarity = (A · B) / (||A|| * ||B||)
 *
 * @example
 * const sim = cosineSimilarity(
 *   [0.5, 0.8, 0.1],  // "koira"
 *   [0.6, 0.7, 0.2]   // "pentu"
 * );
 * // Returns: 0.95 (erittäin samankaltaiset!)
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error(`Vector dimensions don't match: ${vecA.length} vs ${vecB.length}`);
  }

  // Dot product: A · B = sum(a_i * b_i)
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  // Magnitude: ||A|| = sqrt(sum(a_i^2))
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  // Avoid division by zero
  if (normA === 0 || normB === 0) {
    return 0;
  }

  // Cosine similarity
  return dotProduct / (normA * normB);
}

/**
 * TESTAUS: Kokeile embeddings-toimintoja
 *
 * Aja: node -r esbuild-register client/server/rag/embeddings.ts
 */
export async function testEmbeddings() {
  console.log("\n🧪 EMBEDDINGS TEST\n");

  const texts = [
    "Hummin liikevaihto oli 2.1 miljoonaa euroa vuonna 2024",
    "Humm Group Oy:n revenue 2024 was €2.1M",
    "Koira juoksee puistossa",
  ];

  console.log("1️⃣ Embedding 3 tekstiä...\n");
  const vectors = await embedTexts(texts);

  console.log("\n2️⃣ Vektorien koot:");
  vectors.forEach((v, i) => {
    console.log(`   Text ${i + 1}: ${v.length} dimensions`);
    console.log(`   First 5 values: [${v.slice(0, 5).map(n => n.toFixed(3)).join(", ")}...]`);
  });

  console.log("\n3️⃣ Cosine Similarity -vertailu:");
  console.log(`   Teksti 1 vs 2 (sama asia, eri kieli): ${cosineSimilarity(vectors[0], vectors[1]).toFixed(4)}`);
  console.log(`   Teksti 1 vs 3 (eri aihe):             ${cosineSimilarity(vectors[0], vectors[2]).toFixed(4)}`);
  console.log(`   Teksti 2 vs 3 (eri aihe):             ${cosineSimilarity(vectors[1], vectors[2]).toFixed(4)}`);

  console.log("\n✅ Test completed!");
  console.log("\n📚 OPPITUNTI:");
  console.log("   - Samankaltaiset tekstit → korkea similarity (>0.8)");
  console.log("   - Eri aiheet → matala similarity (<0.5)");
  console.log("   - Kieli ei haittaa semanttista ymmärrystä!");
}

// Aja testi jos tiedosto suoritetaan directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testEmbeddings().catch(console.error);
}
