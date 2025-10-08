/**
 * IN-MEMORY VECTOR STORE
 *
 * OPPITUNTI: Mitä on Vector Store?
 * --------------------------------
 * Vector Store tallentaa dokumentteja ja niiden embedding-vektoreita.
 * Se osaa etsiä "samankaltaisia" dokumentteja cosine similarity -laskulla.
 *
 * TUOTANTOVAIHTOEHDOT:
 * - Pinecone (helpoin, managed service)
 * - Weaviate (open source, self-hosted)
 * - pgvector (PostgreSQL extensio, kustannustehokas)
 * - Chroma (kevyt, local-first)
 *
 * MIKSI IN-MEMORY PoC:ssa?
 * - Nopea prototypoida
 * - Ei ulkoisia riippuvuuksia
 * - Toimii paikallisesti
 * - Helppo debugata
 *
 * RAJOITUKSET:
 * - Data katoaa serverin uudelleenkäynnistyksessä
 * - Ei skaalaudu tuhansiin dokumentteihin
 * - Ei hajautettua hakua
 */

import { embedText, cosineSimilarity } from "./embeddings.js";

/**
 * Dokumentti-interface
 *
 * OPPITUNTI: Metadata
 * - pageContent: Varsinainen teksti (näytetään AI:lle)
 * - metadata: Lisätiedot (esim. lähde, päivämäärä, author)
 * - embedding: 1536-ulotteinen vektori (semanttinen esitys)
 * - id: Uniikki tunniste
 */
export interface Document {
  id: string;
  pageContent: string; // Tekstisisältö
  metadata: {
    source: string; // Mistä tiedostosta?
    page?: number; // Mikä sivu (jos PDF)?
    chunk?: number; // Mikä osa dokumenttia?
    uploadedAt: string; // Milloin ladattu?
    [key: string]: any; // Muut metadata-kentät
  };
  embedding?: number[]; // Vektori (lisätään embedoinnin jälkeen)
}

/**
 * Haku

tulos metadata:lla
 */
export interface SearchResult {
  document: Document;
  similarity: number; // 0-1, kuinka relevantti
}

/**
 * In-Memory Vector Store
 *
 * OPPITUNTI: Singleton Pattern
 * - Koko appissa yksi yhteinen dokumenttivarasto
 * - Estää duplikaatit ja säästää muistia
 */
class InMemoryVectorStore {
  private documents: Map<string, Document> = new Map();
  private static instance: InMemoryVectorStore;

  private constructor() {
    console.log("🗄️ InMemoryVectorStore initialized");
  }

  /**
   * Singleton-instanssi
   */
  static getInstance(): InMemoryVectorStore {
    if (!InMemoryVectorStore.instance) {
      InMemoryVectorStore.instance = new InMemoryVectorStore();
    }
    return InMemoryVectorStore.instance;
  }

  /**
   * Lisää dokumentti storeen
   *
   * OPPITUNTI: Automaattinen embedointi
   * - Embedding tehdään automaattisesti jos puuttuu
   * - Tallentaa embeddingit cacheen (ei tarvitse laskea uudestaan)
   */
  async addDocument(doc: Document): Promise<void> {
    // Generoi embedding jos puuttuu
    if (!doc.embedding) {
      console.log(`📊 Generating embedding for document: ${doc.id}`);
      doc.embedding = await embedText(doc.pageContent);
    }

    this.documents.set(doc.id, doc);
    console.log(`✅ Document added: ${doc.id} (${doc.pageContent.length} chars)`);
  }

  /**
   * Lisää useita dokumentteja kerralla (batch)
   *
   * OPPITUNTI: Batch-operaatiot
   * - 10x nopeampi kuin yksi kerrallaan
   * - OpenAI API tukee batch-embeddingeja
   */
  async addDocuments(docs: Document[]): Promise<void> {
    console.log(`📚 Adding ${docs.length} documents in batch...`);
    const startTime = Date.now();

    // Embed kaikki dokumentit kerralla (tehokas!)
    const textsToEmbed = docs
      .filter(d => !d.embedding)
      .map(d => d.pageContent);

    if (textsToEmbed.length > 0) {
      const { embedTexts } = await import("./embeddings.js");
      const embeddings = await embedTexts(textsToEmbed);

      let embedIndex = 0;
      for (const doc of docs) {
        if (!doc.embedding) {
          doc.embedding = embeddings[embedIndex++];
        }
        this.documents.set(doc.id, doc);
      }
    } else {
      // Kaikilla on jo embedding
      for (const doc of docs) {
        this.documents.set(doc.id, doc);
      }
    }

    const duration = Date.now() - startTime;
    console.log(`✅ ${docs.length} documents added in ${duration}ms`);
  }

  /**
   * Etsi samankaltaisia dokumentteja
   *
   * OPPITUNTI: Similarity Search
   * 1. Muunna kysymys vektoriksi (embedding)
   * 2. Laske cosine similarity kaikkiin dokumentteihin
   * 3. Järjestä tulokset similarity:n mukaan
   * 4. Palauta top K tulosta
   *
   * @param query Hakukysely (luonnollinen kieli)
   * @param topK Montako tulosta palautetaan (default: 5)
   * @param filter Metadata-filter (esim. { source: "humm_2024.pdf" })
   */
  async similaritySearch(
    query: string,
    topK: number = 5,
    filter?: Partial<Document["metadata"]>
  ): Promise<SearchResult[]> {
    console.log(`🔍 Searching for: "${query}" (top ${topK})`);
    const startTime = Date.now();

    // 1. Embed kysymys
    const queryEmbedding = await embedText(query);

    // 2. Laske similarity kaikkiin dokumentteihin
    const results: SearchResult[] = [];

    for (const [id, doc] of this.documents) {
      // Tarkista filter
      if (filter) {
        let matchesFilter = true;
        for (const [key, value] of Object.entries(filter)) {
          if (doc.metadata[key] !== value) {
            matchesFilter = false;
            break;
          }
        }
        if (!matchesFilter) continue;
      }

      // Laske similarity
      if (doc.embedding) {
        const similarity = cosineSimilarity(queryEmbedding, doc.embedding);
        results.push({ document: doc, similarity });
      }
    }

    // 3. Järjestä similarity:n mukaan (korkein ensin)
    results.sort((a, b) => b.similarity - a.similarity);

    // 4. Palauta top K
    const topResults = results.slice(0, topK);

    const duration = Date.now() - startTime;
    console.log(`✅ Found ${topResults.length} results in ${duration}ms`);
    topResults.forEach((r, i) => {
      console.log(
        `   ${i + 1}. ${r.document.metadata.source} ` +
        `(similarity: ${r.similarity.toFixed(4)}) ` +
        `- "${r.document.pageContent.substring(0, 60)}..."`
      );
    });

    return topResults;
  }

  /**
   * Hae dokumentti ID:llä
   */
  getDocument(id: string): Document | undefined {
    return this.documents.get(id);
  }

  /**
   * Hae kaikki dokumentit
   */
  getAllDocuments(): Document[] {
    return Array.from(this.documents.values());
  }

  /**
   * Poista dokumentti
   */
  deleteDocument(id: string): boolean {
    const deleted = this.documents.delete(id);
    if (deleted) {
      console.log(`🗑️ Document deleted: ${id}`);
    }
    return deleted;
  }

  /**
   * Tyhjennä kaikki dokumentit
   */
  clear(): void {
    const count = this.documents.size;
    this.documents.clear();
    console.log(`🗑️ Cleared ${count} documents`);
  }

  /**
   * Dokumenttien määrä
   */
  get size(): number {
    return this.documents.size;
  }

  /**
   * Tilastot
   */
  getStats() {
    const docs = Array.from(this.documents.values());
    const totalChars = docs.reduce((sum, d) => sum + d.pageContent.length, 0);
    const avgChars = docs.length > 0 ? Math.round(totalChars / docs.length) : 0;

    // Ryhmittele lähteiden mukaan
    const sources = new Map<string, number>();
    for (const doc of docs) {
      const source = doc.metadata.source;
      sources.set(source, (sources.get(source) || 0) + 1);
    }

    return {
      documentCount: docs.length,
      totalCharacters: totalChars,
      averageCharacters: avgChars,
      sources: Object.fromEntries(sources),
    };
  }
}

/**
 * Exporttaa singleton-instanssi
 */
export const vectorStore = InMemoryVectorStore.getInstance();

/**
 * TESTAUS: Kokeile vector storen toimintoja
 */
export async function testVectorStore() {
  console.log("\n🧪 VECTOR STORE TEST\n");

  // 1. Lisää testidokumentteja
  console.log("1️⃣ Adding test documents...\n");

  const testDocs: Document[] = [
    {
      id: "doc-1",
      pageContent: "Humm Group Oy:n liikevaihto vuonna 2024 oli 2.1 miljoonaa euroa. Käyttökate oli 15% ja tulos oli positiivinen.",
      metadata: {
        source: "humm_financial_2024.pdf",
        page: 1,
        uploadedAt: new Date().toISOString(),
      },
    },
    {
      id: "doc-2",
      pageContent: "Asiakastyytyväisyys nousi 7.2:sta 8.5:een. Tärkeimmät parannuskohteet ovat vasteajat ja proaktiivisuus.",
      metadata: {
        source: "humm_cx_report_2024.pdf",
        page: 3,
        uploadedAt: new Date().toISOString(),
      },
    },
    {
      id: "doc-3",
      pageContent: "AI-transformaation tavoitteena on automatisoida 40% rutiinitehtävistä ja parantaa asiakaskokemusta 25%.",
      metadata: {
        source: "humm_ai_strategy.pdf",
        page: 5,
        uploadedAt: new Date().toISOString(),
      },
    },
    {
      id: "doc-4",
      pageContent: "Koiran hoito-ohjeita: Kävely 2-3 kertaa päivässä, ruokinta säännöllisesti, eläinlääkäri vuosittain.",
      metadata: {
        source: "random_dog_manual.pdf",
        page: 1,
        uploadedAt: new Date().toISOString(),
      },
    },
  ];

  await vectorStore.addDocuments(testDocs);

  // 2. Tilastot
  console.log("\n2️⃣ Stats:");
  console.log(JSON.stringify(vectorStore.getStats(), null, 2));

  // 3. Haut
  console.log("\n3️⃣ Search tests:\n");

  const queries = [
    "Mikä oli Hummin liikevaihto 2024?",
    "Miten asiakastyytyväisyys kehittyi?",
    "Mitä AI-transformaatiolla tavoitellaan?",
    "Koiran ruokinta",
  ];

  for (const query of queries) {
    console.log(`\n📝 Query: "${query}"`);
    const results = await vectorStore.similaritySearch(query, 2);

    if (results.length === 0) {
      console.log("   No results found");
    }
  }

  console.log("\n✅ Test completed!");
  console.log("\n📚 OPPITUNTI:");
  console.log("   - Relevantti dokumentti löytyy vaikka kysymys on eri sanoilla");
  console.log("   - Ei-relevantti dokumentti (koira) saa matalan similarity-scoren");
  console.log("   - Tämä on RAG:in ydin: semanttinen haku!");
}

// Aja testi jos tiedosto suoritetaan directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testVectorStore().catch(console.error);
}
