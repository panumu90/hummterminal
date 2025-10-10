# "Kysy Panulta" - AI Strategy Chat

## 📚 Yleiskatsaus

"Kysy Panulta" on interaktiivinen AI-chat-widget joka vastaa kysymyksiin **Hummin AI-transformaatiostrategiasta** käyttäen **Claude 4.5 Sonnet** -mallia ja **RAG (Retrieval-Augmented Generation)** -teknologiaa.

## ✨ Ominaisuudet

### 1. **Älykkäät Vastaukset**
- Ensisijaisesti perustuu **humm-complete-strategy.md** -dokumenttiin
- Vastaa myös tech-lead-rooliin ja sovelluksen teemoihin liittyviin kysymyksiin
- Käyttää Claude 4.5 Sonnet -mallia korkeaan vastaustenlaatuun

### 2. **RAG-pohjainen Haku**
- **Vector Store** hakee relevantteja dokumenttiosioita semanttisesti
- **Cosine Similarity** -haku löytää parhaat vastaukset
- **Streaming-vastaukset** näyttävät tekstin reaaliajassa

### 3. **Käyttöliittymä**
- 💬 **Moderni chat-UI** tyylitelty AICommandInput:in mukaan
- 📱 **Responsiivinen** - toimii mobiilissa ja desktopissa
- 🎨 **Glassmorphism** ja Framer Motion -animaatiot
- ⚡ **Typewriter-efekti** placeholder-teksteissä
- 💡 **Ehdotuskysymykset** animoiduilla hover-efekteillä

### 4. **Esimerkkikysymyksiä**
- "Mikä on tarvittava vuosibudjetti?"
- "Mikä on 5. vuoden ROI?"
- "Mitkä ovat keskeisimmät riskit?"
- "Miten agentic AI eroaa perinteisestä AI:sta?"
- "Mitä teknologioita strategia käyttää?"
- "Kuinka henkilöstö koulutetaan?"

## 🚀 Käyttöönotto

### 1. **Automaattinen Dokumentin Lataus**

Serveri lataa automaattisesti `humm-complete-strategy.md`:n käynnistyessään:

```typescript
// client/server/rag/autoImport.ts
// Priorisoi humm-complete-strategy.md ensimmäiseksi
const prioritizedFiles = supportedFiles.sort((a, b) => {
  if (a === 'humm-complete-strategy.md') return -1;
  if (b === 'humm-complete-strategy.md') return 1;
  return 0;
});
```

### 2. **Varmista OPENAI_API_KEY**

RAG-järjestelmä tarvitsee OpenAI API:n embeddings-mallia:

```bash
# .env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

### 3. **Käynnistä Serveri**

```bash
npm run dev
```

Serveri:
1. ✅ Lataa `humm-complete-strategy.md` → Vector Store
2. ✅ Prosessoi dokumentin chunkeihin (2000 chars/chunk)
3. ✅ Generoi embeddings OpenAI:n `text-embedding-3-small` -mallilla
4. ✅ Tallentaa in-memory vector storeen

### 4. **Avaa Strategiasivu**

Navigoi sovelluksessa strategia-sivulle jossa näet:
- 📊 **Kriittinen Konteksti** -osio ylhäällä
- 🗺️ **Strateginen Roadmap** tabs-näkymillä
- 💬 **"Kysy Panulta" -widget** oikeassa alakulmassa (oletuksena auki)

## 🛠️ Tekninen Arkkitehtuuri

### Frontend (React + TypeScript)

```
client/src/components/
├── StrategyChat.tsx              # Chat-widget komponentti
└── strategic-recommendations-panel.tsx  # Integroi chatin
```

**StrategyChat.tsx** - Ominaisuudet:
- ✅ Streaming-vastaukset (`EventSource`-tyyppinen SSE)
- ✅ Message history (User/Assistant)
- ✅ Typewriter-efekti placeholder-teksteissä
- ✅ Expand/Collapse -toiminto
- ✅ Framer Motion -animaatiot

### Backend (Express + LangChain + Anthropic)

```
client/server/rag/
├── ragRoutes.ts          # POST /api/rag/chat endpoint
├── vectorStore.ts        # In-memory vector store
├── embeddings.ts         # OpenAI embeddings wrapper
├── documentProcessor.ts  # Chunking logic
└── autoImport.ts         # Auto-load humm-complete-strategy.md
```

**RAG Flow:**

```
User Query
    ↓
[Vector Store] - Similarity Search (cosine) → Top 5 chunks
    ↓
[Build Context] - Combine relevant chunks
    ↓
[Claude 4.5 Sonnet] - Generate streaming response
    ↓
[SSE Stream] - Send chunks to frontend
    ↓
User sees answer in real-time
```

## 📊 Käytetyt Teknologiat

| Teknologia | Käyttö |
|------------|--------|
| **Claude 4.5 Sonnet** | AI-vastausten generointi (Anthropic) |
| **OpenAI Embeddings** | `text-embedding-3-small` - semanttinen haku |
| **LangChain** | Document processing, text splitting |
| **Cosine Similarity** | Relevanssin laskenta vector storeen |
| **Server-Sent Events (SSE)** | Streaming-vastaukset |
| **Framer Motion** | Chat-animaatiot |
| **Tailwind + shadcn/ui** | Tyylittely |

## 🎨 UI-Komponentit

### **StrategyChat.tsx**

```typescript
interface StrategyChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StrategyChat({ isOpen, onClose }: StrategyChatProps)
```

**Tyylit:**
- 🎨 Glassmorphism (`backdrop-blur-xl`)
- 🌈 Gradient-taustat (`from-purple-900/95 to-blue-900/95`)
- ✨ Hover-efektit ehdotuskysymyksissä
- 💬 Chat-bubbles (User = emerald/blue, Assistant = slate/purple)
- 🔄 Typewriter placeholder-teksti

## 📝 Esimerkkikäyttö

### **Käyttäjä kysyy:**
> "Mikä on tarvittava vuosibudjetti?"

### **RAG hakee:**
```
Lähde 1: humm-complete-strategy.md (chunk 15)
"Ensimmäisen kolmen vuoden aikana Humm investoi yhteensä noin 1,2 miljoonaa euroa AI-transformaatioon..."

Lähde 2: humm-complete-strategy.md (chunk 28)
"Kolmen vuoden kumulatiivinen hyöty on 7,7 miljoonaa euroa..."
```

### **Claude vastaa:**
> "AI-transformaation kokonaisbudjetti on **1,2 miljoonaa euroa** kolmen ensimmäisen vuoden aikana. Tämä jakautuu seuraavasti:
> - **Henkilöstökulut:** 600 000 € (Tech Lead + kasvava teknologiatiimi)
> - **Teknologia ja infrastruktuuri:** 300 000 € (pilvipalvelut, API-kustannukset)
> - **Koulutus:** 150 000 €
> - **Konsultointi:** 150 000 €
>
> Investoinnin ROI on yli **500%** ja takaisinmaksuaika alle **18 kuukautta**."

## 🐛 Debuggaus

### **Tarkista Vector Store Status**

```bash
curl http://localhost:5000/api/rag/documents
```

Vastaus:
```json
{
  "success": true,
  "stats": {
    "documentCount": 42,
    "totalCharacters": 125678,
    "averageCharacters": 2992,
    "sources": {
      "humm-complete-strategy.md": 42
    }
  }
}
```

### **Testaa RAG-kyselyä**

```bash
curl -X POST http://localhost:5000/api/rag/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Mikä on 5. vuoden liikevaihto?"}'
```

### **Loki-viestit:**

```
📚 Auto-importing attached_assets to RAG vector store...
   ✅ Imported humm-complete-strategy.md (42 chunks)

💬 RAG Chat query: "Mikä on 5. vuoden liikevaihto?"
📊 Retrieved 5 relevant documents
📝 Context length: 8945 characters
```

## 🔒 Tietoturva

- ✅ **Vector Store in-memory** - data ei tallennu levylle
- ✅ **GDPR-yhteensopiva** - ei henkilötietoja embeddingeissä
- ✅ **API-avaimet .env:ssä** - ei commitoida repoon
- ✅ **CORS-suojaus** - vain sallitut originit

## 📈 Tulevaisuuden Parannukset

1. **Pinecone/Weaviate** - Tuotanto-vector store (persistentti)
2. **Conversation Memory** - Muista aiemmat keskustelut
3. **Multi-turn Dialogue** - Kontekstuaaliset jatkokysymykset
4. **Source Citations** - Näytä lähteet inline-linkkeinä
5. **Feedback Loop** - 👍/👎 vastausten laadun parantamiseksi

## 📚 Dokumentaatio

- [RAG Routes](client/server/rag/ragRoutes.ts) - API-endpointit
- [Vector Store](client/server/rag/vectorStore.ts) - Similarity search
- [Auto Import](client/server/rag/autoImport.ts) - Dokumenttien lataus
- [Strategy Chat](client/src/components/StrategyChat.tsx) - Chat-UI

---

**Luotu:** Lokakuu 2025
**Teknologia:** React, TypeScript, Claude 4.5 Sonnet, OpenAI Embeddings, LangChain
**Käyttötarkoitus:** Humm Group Oy:n AI-transformaatiostrategian interaktiivinen esittely
