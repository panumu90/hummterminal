# ROADMAP AI INPUT - Dynaaminen muokkaus

## 🎯 Mikä se on?

Roadmap-osiossa on **AI-powered input kenttä** jolla käyttäjä voi dynaamisesti muokata roadmappia luonnollisella kielellä.

## 📊 Nykyinen toteutus (Frontend)

### UI-komponentti (`strategic-roadmap.tsx`)

```typescript
// State management
const [aiInput, setAiInput] = useState("");
const [isProcessing, setIsProcessing] = useState(false);
const [aiResponse, setAiResponse] = useState("");
const [phases, setPhases] = useState<RoadmapPhase[]>([]);

// Handler function
const handleAiSubmit = async () => {
  if (!aiInput.trim() || isProcessing) return;

  setIsProcessing(true);

  const response = await fetch('/api/ai/roadmap-update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: aiInput,           // ← Käyttäjän input
      currentRoadmap: phases     // ← Nykyinen roadmap data
    }),
  });

  const data = await response.json();

  // Päivitetään roadmap AI:n ehdotuksilla
  if (data.updatedPhases) {
    setPhases(data.updatedPhases);
  }

  setAiResponse(data.explanation);
  setIsProcessing(false);
};
```

### UI:

```tsx
<textarea
  value={aiInput}
  onChange={(e) => setAiInput(e.target.value)}
  placeholder="Esim: 'Lisää ESG-tavoitteet jokaiseen vaiheeseen' tai 'Nopea 18kk roadmap'"
  className="w-full min-h-[120px] p-4 bg-slate-800/50 border border-slate-700 rounded-lg"
/>

<Button onClick={handleAiSubmit} disabled={!aiInput.trim() || isProcessing}>
  {isProcessing ? "Prosessoidaan..." : "Päivitä AI:lla"}
</Button>
```

### Quick Actions (Esimerkkikomennot):

```tsx
<button onClick={() => setAiInput("Lisää uusin GPT-5 teknologia kaikkiin vaiheisiin")}>
  💡 Päivitä AI-teknologiat
</button>

<button onClick={() => setAiInput("Tee aikajanasta aggressiivisempi, tavoite 2 vuotta aiemmin")}>
  ⚡ Aggressiivisempi aikataulu
</button>

<button onClick={() => setAiInput("Lisää kestävyys ja ESG-tavoitteet jokaiseen vaiheeseen")}>
  🌱 ESG-fokus
</button>

<button onClick={() => setAiInput("Analysoi riskit ja lisää mitigaatiostrategiat")}>
  🛡️ Riskianalyysi
</button>
```

---

## ⚠️ ONGELMA: Backend puuttuu!

### Tarvittava endpoint:

```
POST /api/ai/roadmap-update
```

**Input:**
```json
{
  "prompt": "Lisää ESG-tavoitteet jokaiseen vaiheeseen",
  "currentRoadmap": [
    {
      "id": "q1-2025",
      "quarter": "Q1 2025",
      "title": "Foundation & Infrastructure",
      "revenue": "2.5M€",
      "margin": "18%",
      "categories": [...],
      "kpis": [...]
    },
    ...
  ]
}
```

**Output:**
```json
{
  "updatedPhases": [
    {
      // AI:n päivittämä roadmap
      // Samat kentät kuin input, mutta muokattu
    }
  ],
  "explanation": "Lisäsin ESG-tavoitteet jokaiseen vaiheeseen: Q1:ssä hiilijalanjäljen mittaus, Q2:ssa vihreän energian siirtymä..."
}
```

---

## ✅ RATKAISU: Toteutetaan backend

### Vaihtoehto 1: **Yksinkertainen (stub)**

Mock-implementaatio joka palauttaa saman roadmapin + selityksen:

```typescript
// routes.ts
app.post("/api/ai/roadmap-update", async (req, res) => {
  const { prompt, currentRoadmap } = req.body;

  // Simple stub - palauta sama roadmap
  res.json({
    updatedPhases: currentRoadmap,
    explanation: `Sain komennon: "${prompt}". Backend-toteutus tulossa pian!`
  });
});
```

**Edut:**
- ✅ UI toimii heti
- ✅ Ei tarvitse AI:ta
- ✅ Nopea testata

**Haitat:**
- ❌ Ei oikeasti muokkaa roadmappia

---

### Vaihtoehto 2: **AI-powered (suositeltu)**

Käytetään Claude:a analysoimaan promptia ja päivittämään roadmappia:

```typescript
// routes.ts
app.post("/api/ai/roadmap-update", async (req, res) => {
  const { prompt, currentRoadmap } = req.body;

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.json({
      updatedPhases: currentRoadmap,
      explanation: "AI-toiminto vaatii ANTHROPIC_API_KEY:n"
    });
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const systemPrompt = `Olet strateginen bisnesanalyytikko. Saat roadmap-datan JSON-muodossa ja käyttäjän muokkauspyynnön.

TEHTÄVÄ:
- Analysoi käyttäjän pyyntö
- Päivitä roadmap-dataa vastaavasti
- Palauta päivitetty JSON + selitys muutoksista

TÄRKEÄÄ:
- Säilytä JSON-rakenne täsmälleen samana
- Päivitä vain relevantit kentät
- Ole konkreettinen ja realistinen
- Käytä suomea selityksessä`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    temperature: 0.7,
    system: systemPrompt,
    messages: [{
      role: "user",
      content: `NYKYINEN ROADMAP:
${JSON.stringify(currentRoadmap, null, 2)}

KÄYTTÄJÄN PYYNTÖ:
${prompt}

Palauta JSON-muodossa:
{
  "updatedPhases": [...päivitetty roadmap...],
  "explanation": "Selitys muutoksista suomeksi"
}`
    }]
  });

  // Parsitaan AI:n vastaus
  const responseText = message.content[0].type === 'text'
    ? message.content[0].text
    : '';

  // Yritetään parsia JSON
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      res.json(result);
    } else {
      throw new Error("No JSON found in response");
    }
  } catch (e) {
    // Fallback: palauta alkuperäinen + selitys
    res.json({
      updatedPhases: currentRoadmap,
      explanation: responseText
    });
  }
});
```

**Edut:**
- ✅ Oikeasti muokkaa roadmappia
- ✅ Ymmärtää luonnollista kieltä
- ✅ Luo realistisia päivityksiä

**Haitat:**
- ❌ Vaatii ANTHROPIC_API_KEY:n
- ❌ API-kustannukset (~$0.01 per päivitys)
- ❌ Monimutkaisempi (JSON parsing)

---

## 🎯 Käyttötapaukset

### 1. Teknologia-päivitys
**Input:** "Lisää GPT-5 ja Claude Opus 4 kaikkiin AI-kategorioihin"
**Output:** Päivittää `technologies` arrayt jokaisessa kategoriassa

### 2. Aikataulu-muutos
**Input:** "Tee aikajanasta aggressiivisempi, tavoite 2 vuotta aiemmin"
**Output:** Muuttaa `quarter` kentät (Q1 2025 → Q1 2024, jne.)

### 3. ESG-fokus
**Input:** "Lisää kestävyys ja ESG-tavoitteet jokaiseen vaiheeseen"
**Output:** Lisää uusia `categories` tai päivittää `metrics` ESG-mittareihin

### 4. Riski-analyysi
**Input:** "Analysoi riskit ja lisää mitigaatiostrategiat"
**Output:** Päivittää `risks` arrayt realistisilla riskeillä + mitigaatiot

### 5. Revenue-skenaario
**Input:** "Konservatiivisempi revenue forecast, -30% kaikista tavoitteista"
**Output:** Päivittää `revenue` ja `margin` kentät

---

## 🔧 Implementaatio-ohje

### Step 1: Luo backend endpoint

Lisää `routes.ts`:ään:

```typescript
import Anthropic from "@anthropic-ai/sdk";

app.post("/api/ai/roadmap-update", async (req, res) => {
  // Vaihtoehto 2 koodi tähän (katso yllä)
});
```

### Step 2: Testaa

```bash
curl -X POST http://localhost:5000/api/ai/roadmap-update \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Lisää ESG-tavoitteet",
    "currentRoadmap": [...]
  }'
```

### Step 3: Frontend toimii automaattisesti!

UI on jo valmis - kun backend vastaa oikealla JSON-muodolla, roadmap päivittyy dynaamisesti.

---

## 💡 Tulevaisuuden parannukset

### 1. Version History
Tallenna jokainen AI-päivitys historiaan:

```typescript
interface RoadmapVersion {
  id: string;
  timestamp: Date;
  prompt: string;
  changes: string;
  roadmap: RoadmapPhase[];
}

// Käyttäjä voi:
// - Undo/Redo
// - Vertailla versioita
// - Palauttaa vanhemman version
```

### 2. Smart Suggestions
AI ehdottaa itse parannuksia:

```typescript
// AI analysoi roadmapin ja ehdottaa:
const suggestions = [
  "💡 Revenue-tavoitteet vaikuttavat liian optimistisilta - harkitse konservatiivisempaa lähestymistä",
  "⚠️ Q2:ssa on liikaa samanaikaisia projekteja - jakautuuko resurssi riittävästi?",
  "✅ ESG-tavoitteet puuttuvat - kilpailijat ovat jo edellä tässä"
];
```

### 3. Drag & Drop Integration
Yhdistä AI-input ja drag-and-drop:

```typescript
// Käyttäjä voi:
// 1. Vetää kategorian toiseen vaiheeseen (drag & drop)
// 2. AI päivittää automaattisesti dependencies ja aikataulut
```

---

## 📚 OPPITUNTI

**Roadmap AI Input on konkreettinen esimerkki siitä miten AI voi:**
- ✅ Vähentää manuaalista työtä (ei tarvitse editoida JSON:ia käsin)
- ✅ Parantaa käyttökokemusta (luonnollinen kieli vs. lomakkeet)
- ✅ Tuoda liiketoiminta-arvoa (nopeat "what-if" skenaariot)

**Tämä demonstroi Tech Lead -osaamista:**
- Yhdistää AI:n ja käyttöliittymän saumattomasti
- Ymmärtää liiketoimintatarpeita (roadmap-suunnittelu)
- Rakentaa skaalautuvia ratkaisuja (JSON-pohjainen arkkitehtuuri)

---

## ❓ Mitä haluat tehdä?

**A)** Toteutan Vaihtoehto 1 (stub) - nopea, toimii heti
**B)** Toteutan Vaihtoehto 2 (AI-powered) - täysi toiminnallisuus
**C)** Jätän sinulle tehtäväksi myöhemmin
