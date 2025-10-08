# CHAT DATA SEPARATION ARCHITECTURE

## 📊 Nykyiset chatit ja niiden data

### 1. **Main Chat** (`/api/chat`) - Johdon Co-Pilot
**Endpoint:** `POST /api/chat`
**Käyttökohde:** Humm Groupin johdon strateginen assistentti
**Toiminta:**
- ✅ **Voi käyttää LLM:n omaa tietoa** (maailmantieto, yleinen liiketoimintaosaaminen)
- ✅ **Täydentää dokumenteista** (Hummin spesifiset luvut ja strategia)
- ✅ **Proaktiivinen neuvonta** (tunnistaa mahdollisuuksia ja riskejä)

**Data:**
- `cachedData.cases` - AI case studies
- `cachedData.trends` - AI trendit
- `cachedData.attachedAssets` - Hummin dokumentit (1500 chars/file)
- Claude:n oma tieto - Yleinen liiketoiminta- ja teknologia-osaaminen

**Esimerkkejä:**
- "Mikä on Hummin liikevaihto?" → Vastaa dokumenteista
- "Miten ROI lasketaan AI-investoinnille?" → Käyttää omaa tietoaan + Hummin dataa
- "Mikä on paras tapa implementoida RAG?" → Yleinen teknologia-osaaminen

---

### 2. **Tech Lead Chat** (`/api/tech-lead-chat`) - CV Showcase
**Endpoint:** `POST /api/tech-lead-chat`
**Käyttökohde:** Tech Lead CV ja osaamisen esittely
**Toiminta:**
- ✅ **Voi käyttää LLM:n omaa tietoa** (teknologia-osaaminen, trendit)
- ✅ **Täydentää CV:stä ja strategiadokumentista** (henkilökohtaiset saavutukset)
- ✅ **Keskustelee hakijan osaamisesta** (yhdistää CV + yleinen tieto)

**Data:**
- **VAIN** 2 tiettyä tiedostoa:
  - `Me (1)_1758989917194.pdf` (Tech Lead CV)
  - `Pasted-1-Tehokkuuden-parantaminen...txt` (Strategiadokumentti)
- Claude:n oma tieto - Teknologia- ja liiketoimintaosaaminen
- ❌ Ei muita attached_assets tiedostoja

**Erottelu:** Hard-coded tiedostolista (`specificFiles` array)

**Esimerkkejä:**
- "Mikä on hakijan kokemus AI:sta?" → Vastaa CV:stä
- "Mitä RAG tarkoittaa?" → Käyttää omaa tietoaan
- "Miksi valitsisin sinut Tech Leadiksi?" → Yhdistää CV + yleinen osaaminen

---

### 3. **Live Chat** (`/api/live-chat`)
**Endpoint:** `POST /api/live-chat`
**Käyttökohde:** Live-operaattorin vastaukset
**Data:**
- Ei AI:ta, suora yhteys operaattoriin
- Ei käytä dokumentteja

---

### 4. **RAG Chat** (`/api/rag/chat`) - Pure Document Q&A
**Endpoint:** `POST /api/rag/chat`
**Käyttökohde:** Dokumentti-intelligence (vain faktat, ei tulkintaa)
**Toiminta:**
- ❌ **EI käytä LLM:n omaa tietoa** - vastaa VAIN dokumentteihin perustuen
- ✅ **Tarkat viittaukset lähteisiin** - jokainen väite dokumentoitu
- ✅ **Semantic search** - löytää relevantin tiedon tuhansista sivuista
- ⚠️ **Sanoo "en tiedä"** jos vastaus ei löydy dokumenteista

**Data:**
- **Vector Store** - Kaikki RAG:iin ladatut dokumentit (täysimääräisesti!)
- Auto-import: Hummin dokumentit attached_assets:ista (paitsi Tech Lead CV)
- Manual upload: Käyttäjän lataamat tiedostot
- ❌ EI Claude:n omaa tietoa

**System Prompt:**
```
Käytä VAIN annettua kontekstia vastauksissa
Jos vastaus ei löydy kontekstista, sano "En löydä vastausta annetuista dokumenteista"
```

**Esimerkkejä:**
- "Mikä oli Hummin liikevaihto 2024?" → Vastaa dokumentista tai "En tiedä"
- "Mitä RAG tarkoittaa?" → "En löydä vastausta annetuista dokumenteista" (ei omaa tietoa)
- "Mikä on MCP-protokolla?" → Vastaa jos MCP-dokumentti on ladattu

---

## 📋 Vertailu: Chatien erot

| Ominaisuus | Main Chat | Tech Lead Chat | RAG Chat |
|------------|-----------|----------------|----------|
| **LLM:n oma tieto** | ✅ Kyllä | ✅ Kyllä | ❌ Ei |
| **Dokumentit** | Humm-data (1500 chars) | CV + strategia | Kaikki ladatut (täydet) |
| **Käyttötarkoitus** | Johdon neuvonta | Hakijan esittely | Faktatarkistus |
| **Vastaustapa** | Proaktiivinen + tulkinta | Keskusteleva | Vain dokumentit |
| **Esimerkki** | "Miten ROI lasketaan?" → Yleinen tieto + Hummin data | "Miksi sinä?" → CV + osaaminen | "Mikä liikevaihto?" → Dokumentti tai "en tiedä" |

**OPPITUNTI: Koska käyttää mitäkin?**

- **Main Chat** = Strateginen neuvonta (yhdistää yleinen tieto + yrityksen data)
- **Tech Lead Chat** = Henkilön esittely (yhdistää CV + teknologia-osaaminen)
- **RAG Chat** = Tarkat faktat dokumenteista (ei arvailua, vain lähteet)

---

## ⚠️ ONGELMA: Data sekaantuminen

### Nykyinen tilanne:

```
attached_assets/
├── Me (1).pdf                    → Tech Lead Chat (✅ oikein)
├── Tehokkuuden-parantaminen.txt  → Tech Lead Chat (✅ oikein)
├── Humm_financial_2024.pdf       → Main Chat (✅ oikein)
├── cx_ai_trend_report.pdf        → Main Chat (✅ oikein)
└── ... 20 muuta tiedostoa        → Main Chat + RAG Auto-import
```

**RISKI:**
```
RAG Auto-import lataa KAIKKI tiedostot
→ Tech Lead CV sekaantuu yleiseen RAG-chattiin
→ Käyttäjä voi kysyä "Kuka on Teemu?" RAG:ista
→ Saa vastauksen Tech Lead CV:stä
```

---

## ✅ RATKAISU: Metadata-based filtering

### Ehdotus 1: **Document Tags (suositeltu)**

Lisätään metadata `tags` kenttä jokaiseen dokumenttiin:

```typescript
interface Document {
  id: string;
  pageContent: string;
  metadata: {
    source: string;
    tags: string[];  // ← UUSI!
    // ... muut kentät
  };
  embedding?: number[];
}
```

**Käyttö:**

```typescript
// Tech Lead -tiedostot tagitaan
await vectorStore.addDocuments([
  {
    id: "cv-chunk-1",
    pageContent: "...",
    metadata: {
      source: "Me (1).pdf",
      tags: ["tech-lead", "private"],  // ← Vain Tech Lead Chatille
    }
  }
]);

// Yleiset tiedostot
await vectorStore.addDocuments([
  {
    id: "humm-chunk-1",
    pageContent: "...",
    metadata: {
      source: "Humm_financial_2024.pdf",
      tags: ["public", "humm-data"],  // ← Main Chat + RAG Chat
    }
  }
]);

// RAG Chat: Hae vain "public" tagilla
const results = await vectorStore.similaritySearch(
  "Mikä oli liikevaihto?",
  5,
  { tags: ["public"] }  // ← Filter
);
```

---

### Ehdotus 2: **Separate Vector Stores**

Luo erilliset vector storet:

```typescript
// Singleton → Multiple instances
export const publicVectorStore = new InMemoryVectorStore();
export const techLeadVectorStore = new InMemoryVectorStore();
export const privateVectorStore = new InMemoryVectorStore();
```

**Käyttö:**

```typescript
// Tech Lead Chat
const results = await techLeadVectorStore.similaritySearch(query);

// RAG Chat
const results = await publicVectorStore.similaritySearch(query);
```

**Edut:**
- ✅ Täysi eristys
- ✅ Ei vahingossa leaks

**Haitat:**
- ❌ Enemmän muistia
- ❌ Monimutkaisempi hallinta

---

### Ehdotus 3: **Smart Auto-Import with Exclusions**

Muokataan `autoImport.ts`:

```typescript
const TECH_LEAD_EXCLUSIONS = [
  'Me (1)_1758989917194.pdf',
  'Pasted-1-Tehokkuuden-parantaminen-Konkreettiset-toimenpiteet-Automatisoi-manuaaliset-prosessit-Integ-1758990330096_1758990330096.txt'
];

export async function autoImportAttachedAssets() {
  const files = await fs.readdir(assetsDir);

  for (const filename of files) {
    // Skip Tech Lead files
    if (TECH_LEAD_EXCLUSIONS.includes(filename)) {
      console.log(`⏭️ Skipping ${filename} (Tech Lead exclusive)`);
      continue;
    }

    // Import to RAG
    await vectorStore.addDocuments(documents);
  }
}
```

**Edut:**
- ✅ Yksinkertainen
- ✅ Toimii heti

**Haitat:**
- ❌ Hard-coded lista
- ❌ Ei skaalaudu

---

## 🎯 SUOSITUS: Yhdistelmäratkaisu

**1. Käytä Metadata Tags (Ehdotus 1)**
- Joustava, skaalautuva
- Ei tarvitse erilliset storet

**2. Auto-Import with Smart Tagging**

```typescript
// autoImport.ts
const FILE_TAGS: Record<string, string[]> = {
  'Me (1)_1758989917194.pdf': ['tech-lead', 'private'],
  'Tehokkuuden-parantaminen...txt': ['tech-lead', 'private'],
  // Kaikki muut saavat 'public' tagin
};

export async function autoImportAttachedAssets() {
  for (const filename of files) {
    const tags = FILE_TAGS[filename] || ['public', 'humm-data'];

    const documents = await processFile(buffer, filename, mimeType);

    // Lisää tags jokaiseen chunkiin
    documents.forEach(doc => {
      doc.metadata.tags = tags;
    });

    await vectorStore.addDocuments(documents);
  }
}
```

**3. Filter RAG Queries**

```typescript
// ragRoutes.ts - /api/rag/chat
app.post("/api/rag/chat", async (req, res) => {
  const { message, topK = 5 } = req.body;

  // Hae VAIN public dokumentit
  const results = await vectorStore.similaritySearch(
    message,
    topK,
    { tags: ['public'] }  // ← Älä näytä Tech Lead CV:tä!
  );

  // ... rest of code
});
```

---

## 📋 Implementation Checklist

- [ ] Lisää `tags: string[]` Document metadata interfaceen
- [ ] Päivitä `vectorStore.similaritySearch()` tukemaan tag-filtteröintiä
- [ ] Lisää `FILE_TAGS` mapping `autoImport.ts`:ään
- [ ] Päivitä `autoImportAttachedAssets()` lisäämään tagit
- [ ] Lisää tag-filter RAG Chat endpointiin
- [ ] Testaa että Tech Lead CV ei näy RAG:issa
- [ ] Dokumentoi tagien käyttö README:ssa

---

## 🔒 Turvallisuus

**Tärkeää:**
- Tech Lead CV sisältää henkilökohtaista dataa
- **EI SAA** näkyä julkisessa RAG:issa
- **EI SAA** sekaantua Hummin liiketoimintadataan

**Testaus:**
```bash
# Bad: Tech Lead CV löytyy RAG:ista
curl -X POST /api/rag/chat -d '{"message":"Kuka on Teemu?"}'
→ Ei saisi palauttaa CV:tä!

# Good: Vain Hummin data löytyy
curl -X POST /api/rag/chat -d '{"message":"Mikä on Hummin liikevaihto?"}'
→ Palauttaa Hummin finanssidataa ✅
```

---

## 💡 Tulevaisuus: Per-user Document Collections

**Skaalautuva ratkaisu:**

```typescript
interface Document {
  metadata: {
    source: string;
    tags: string[];
    ownerId?: string;     // ← Käyttäjäkohtainen data
    visibility: 'public' | 'private' | 'shared';
  };
}

// Käyttäjä voi ladata omia dokumentteja
// → Vain hän näkee ne RAG:issa
```

**Use case:**
- Hummin työntekijä lataa yrityksen sisäisiä dokumentteja
- Tech Lead lataa CV:nsä
- Julkiset dokumentit kaikkien saatavilla

→ **Multi-tenant RAG system** 🚀
