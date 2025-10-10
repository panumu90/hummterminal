# DASHBOARD REDESIGN PLAN - Humm AI Terminal

**Päivitetty:** 2025-10-11
**Status:** Suunnitteluvaihe
**Tavoite:** Uudelleenrakentaa dashboard ennen deploymenttia

---

## ARKKITEHTUURIN SELVENNYS (Mitä on jo olemassa)

### Chat-komponentit:
1. **ChatInterface** (chat-interface.tsx) - Johdon Co-Pilot (vasen paneeli, 35% width)
2. **TechLeadModal** (home.tsx) - Tech Lead -haastekysymykset (modaalissa)
3. **RAGInterface** (rag-interface.tsx) - Oma välilehti dokumenttianalyysille
4. **StrategyChat** (StrategyChat.tsx) - Strategia-assistentti (strategic-recommendations-panel sisällä)

### Integraatiot:
- **Chatwoot** - Suora REST API -integraatio (chatwoot-client.ts), **ei tarvitse MCP:tä**
  - FRT, CSAT, agent metrics saatavilla suoraan API:sta
- **RAG** - Oma backend (ragRoutes.ts) dokumenttianalyysille

---

## 1. APPLIKAATION RAKENTEEN UUDELLEENSUUNNITTELU

### Ongelmat nykyrakenteessa:

- ✅ **Co-Pilot JO näkyvissä** vasemmalla (35% width) - tämä on hyvä!
- ❌ **Tech Lead sekaannus**: TechLeadModal (chat) vs TechLeadDashboard (metrics) sekoittuvat
- ❌ **Liian monta välilehteä**: 7 välilehteä (overview, cases, dashboard, roadmap, strategy, news, rag)
- ❌ **RAGInterface ja StrategyChat päällekkäisyys** - molemmat tekevät RAG-chattia

### Uusi rakenne (SÄILYTETÄÄN 2-paneelinen, parannetaan):

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER (Sticky): Logo + Quick Actions + Tech Lead CTA          │
├───────────────────────┬──────────────────────────────────────────┤
│                       │                                          │
│  CO-PILOT             │   MAIN DASHBOARD (Tab-based)            │
│  (ChatInterface)      │                                          │
│  Always visible       │   Tabs (vähemmän, selkeämpi):           │
│  35% width            │   1. Live Dashboard (NEW)               │
│                       │   2. Strategic Roadmap                   │
│  - Johdon assistentti │   3. AI Cases & Insights                │
│  - Proaktiivinen      │   4. RAG Document Chat                   │
│  - Strategiset        │                                          │
│    kysymykset         │   65% width                             │
│                       │                                          │
│  Sticky scroll        │   Scrollable content                    │
│                       │                                          │
└───────────────────────┴──────────────────────────────────────────┘
│  FLOATING: Tech Lead Chat Button (bottom-right corner)          │
│  Click → Opens full-screen Tech Lead Modal                      │
└──────────────────────────────────────────────────────────────────┘
```

### Muutokset:

1. **Säilytetään Co-Pilot vasemmalla** - toimii jo hyvin
2. **Tech Lead Chat** → Floating button bottom-right (kuten StrategyChat)
   - Ei vie tilaa
   - Selkeä CTA
   - Avautuu full-screen modaalina
3. **Yhdistetään välilehdet** 7 → 4:
   - **Live Dashboard** (NEW) - KPI:t, makrotalous, metriikat
   - **Strategic Roadmap** - Roadmap + Strategy yhdistetty
   - **AI Cases & Insights** - Cases + News yhdistetty
   - **RAG Document Chat** - Dokumenttianalyysi (säilyy)
4. **Poistetaan päällekkäisyys**:
   - StrategyChat pysyy strategic-recommendations -paneelissa
   - RAGInterface pysyy omana välilehtenään
   - Eri tarkoitukset: Strategy = visio/strategia, RAG = geneerinen dokumenttichat

---

## 2. LIVE KPI DASHBOARD (Datalla johtaminen)

> **"Datalla johtaminen ei ole vain sisäisten mittareiden seurantaa - on ymmärrettävä myös ulkoinen toimintaympäristö."**

### Kriittiset mittarit Hummille:

#### A) ASIAKASPALVELU (Chatwoot REST API)

```typescript
// Endpoint: GET /api/metrics/customer-service
// Backend: Käyttää chatwoot-client.ts metodeja

Mittarit (Live data Chatwootista):
- **FRT (First Response Time)** - avg_first_response_time
  - API: getConversationStats({ type: 'account' })
  - Visualisointi: Card + trendikaavio (7d/30d)
  - Tavoite: < 2h (värikoodaus: 🟢 < 2h, 🟡 2-4h, 🔴 > 4h)

- **CSAT (Customer Satisfaction)** - keskiarvo ratingsista
  - API: getCSATReports({ since: '30d' })
  - Visualisointi: Progress bar + tähdet (1-5)
  - Tavoite: > 4.5/5.0

- **CES (Customer Effort Score)** - asiakkaan vaivannäkö
  - Chatwoot custom attributes tai kysely-integraatio
  - Tavoite: < 3.0/7.0 (matala = hyvä)

- **Resolution Rate** - resolutions_count / conversations_count
  - API: getConversationStats()
  - Visualisointi: Donut chart
  - Tavoite: > 85%

- **Active Agents** - availability_status === 'online'
  - API: listAgents() → filter by availability_status
  - Visualisointi: Badge + lista
  - Live-päivitys: polling 30s välein
```

#### B) TALOUS & KASVU (Mock → Myöhemmin CRM integraatio)

```typescript
// Endpoint: GET /api/metrics/financial
// Backend: Mock data (myöhemmin HubSpot/Salesforce API)

Mittarit:
- **ARR (Annual Recurring Revenue)** - 2.13M€ (current)
  - Ennuste: Linear regression 3/6/12kk
  - Visualisointi: Big number + trendikaavio
  - Tavoite: 10M€ (2030)

- **MRR (Monthly Recurring Revenue)** - ARR / 12
  - Kasvuprosentti vs. edellinen kuukausi
  - Visualisointi: Card + sparkline

- **Revenue per Employee** - ARR / headcount
  - Nyky: 40 385€ (low)
  - Tavoite: 100 000€ (healthy BPO)
  - Visualisointi: Gauge chart

- **Gross Margin %** - liikevoittoprosentti
  - Nyky: -0.2% (tappiollinen)
  - Tavoite: 10% (vuosi 5)
```

#### C) HENKILÖSTÖ & TUOTTAVUUS (Mock → Myöhemmin HR system)

```typescript
// Endpoint: GET /api/metrics/employees
// Backend: Mock data

Mittarit:
- **Headcount** - 52 työntekijää
  - Jako: Customer Service, Sales, Tech, Admin
  - Visualisointi: Stacked bar

- **Active Employees** - aktiiviset työntekijät nyt
  - Integraatio: Chatwoot agent status
  - Visualisointi: Real-time badge (e.g. "38/52 online")

- **Utilization Rate** - aktiivisten % kaikista
  - Tavoite: > 75%
  - Visualisointi: Progress bar

- **AI-Assisted Tasks** - automaatioprosentti
  - Mock: 15% → Tavoite: 60%
  - Visualisointi: Progress bar + trendikaavio
```

#### D) MYYNTI (Mock → Myöhemmin CRM)

```typescript
// Endpoint: GET /api/metrics/sales-pipeline

Mittarit:
- **Pending Sales** - avoimet myyntitilaukset
  - €value + lukumäärä
  - Visualisointi: Card + lista top 5 deals

- **New Customers (30d)** - uudet asiakkaat viimeisen 30 päivän aikana
  - Trendi vs. edellinen kuukausi
  - Visualisointi: Card + sparkline

- **Churn Rate %** - asiakkaiden poistuma
  - Tavoite: < 5% vuosittain
  - Visualisointi: Gauge chart

- **Deal Velocity** - keskimääräinen myyntisykli (päivää)
  - Tavoite: < 45 päivää
  - Visualisointi: Card + benchmark
```

### Backend API -rakenne:

```typescript
// client/server/routes.ts - lisää endpointit:

app.get('/api/metrics/customer-service', async (req, res) => {
  const chatwoot = getChatwootClient();
  if (!chatwoot) return res.status(503).json({ error: 'Chatwoot not configured' });

  const stats = await chatwoot.getConversationStats(accountId, { since: '7d' });
  const csatReports = await chatwoot.getCSATReports(accountId, { since: '30d' });
  const agents = await chatwoot.listAgents(accountId);

  return res.json({
    frt: stats.avg_first_response_time,
    csat: calculateAvgCSAT(csatReports),
    resolutionRate: (stats.resolutions_count / stats.conversations_count) * 100,
    activeAgents: agents.filter(a => a.availability_status === 'online').length,
    totalAgents: agents.length
  });
});

app.get('/api/metrics/financial', async (req, res) => {
  // Mock data (myöhemmin CRM)
  return res.json({
    arr: 2130000,
    mrr: 177500,
    revenuePerEmployee: 40385,
    grossMargin: -0.2,
    forecast: generateForecast() // Linear regression
  });
});

app.get('/api/metrics/employees', async (req, res) => {
  // Mock data (myöhemmin HR system)
  return res.json({
    headcount: 52,
    byDepartment: { cs: 35, sales: 10, tech: 5, admin: 2 },
    activeNow: 38,
    utilization: 78,
    aiAssistedTasks: 15
  });
});

app.get('/api/metrics/sales-pipeline', async (req, res) => {
  // Mock data (myöhemmin CRM)
  return res.json({
    pendingDeals: { count: 12, value: 450000 },
    newCustomers30d: 3,
    churnRate: 2.5,
    dealVelocity: 45
  });
});
```

### Visualisointi Live Dashboardilla:

```
┌───────────────────────────────────────────────────────────┐
│  LIVE KPI DASHBOARD                                       │
├───────────────────────────────────────────────────────────┤
│  ┌─────────────┬─────────────┬─────────────┬──────────┐  │
│  │ ARR         │ MRR         │ FRT         │ CSAT     │  │
│  │ €2.13M      │ €177.5K     │ 1.8h 🟢     │ 4.2 ⭐   │  │
│  │ +5% ↗       │ +3% ↗       │ -15min ↗    │ -0.3 ↘   │  │
│  └─────────────┴─────────────┴─────────────┴──────────┘  │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │ ARR TREND & FORECAST                               │  │
│  │ [Trendikaavio: viimeiset 12kk + ennuste 6kk]      │  │
│  │  2.5M ┤                                  ╱ (forecast) │
│  │  2.0M ┤              ╱──╲              ╱            │  │
│  │  1.5M ┤         ╱──╱    ╲──╱                       │  │
│  │       └──────────────────────────────────          │  │
│  │         Jan  Mar  May  Jul  Sep  Nov  Jan (2026)  │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌──────────────────────┬────────────────────────────┐  │
│  │ ACTIVE EMPLOYEES     │ PENDING SALES              │  │
│  │ 38/52 online (73%)   │ 12 deals, €450K total      │  │
│  │ CS: 28, Sales: 8     │ Top: Acme Corp (€120K)     │  │
│  └──────────────────────┴────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
```

---

## 3. MAKROTALOUSMITTARIT (Macro Indicators)

### Lisättävä Live Dashboard -välilehden alareunaan:

#### Osakemarkkinat (AI & Tech Leaders)

```typescript
// API: Alpha Vantage (ilmainen API key: alphavantage.co/support/#api-key)
// Endpoint: GET /api/metrics/market-data

Osakkeet:
- **NVDA** (Nvidia) - AI-infrastruktuuri
- **GOOGL** (Google) - AI-kehitys, Gemini
- **MSFT** (Microsoft) - Azure AI, Copilot
- **META** (Meta) - LLaMA, AI research

Visualisointi:
- Kompakti card-grid
- Real-time hinta + päivän muutos %
- Värikoodaus: 🟢 positive, 🔴 negative
```

#### Talousmuuttujat (Economic Indicators)

```typescript
// API: Fred API (Federal Reserve Economic Data)
// Endpoint: GET /api/metrics/economic-indicators

Mittarit:
- **Fed Funds Rate** - 4.50% (current)
  - Vaikutus: Korkeampi korko → vähemmän investointeja
- **EUR/USD** - 1.08
  - Vaikutus: Valuuttakurssi vaikuttaa kansainväliseen liiketoimintaan
- **EU Inflation Rate** - 2.5%
  - Vaikutus: Inflaatio nostaa palkkoja ja hintoja
```

#### AI-toimialan mittarit (AI Industry Metrics)

```typescript
// Manuaalinen data / scraping / raportit

Mittarit:
- **Enterprise AI Adoption** - 45% (kasvaa)
  - Lähde: Gartner/McKinsey raportit
- **LLM Pricing Trend** - Claude 4.5 Sonnet ($3/MTok input)
  - Trendi: Hinnat laskevat (hyvä Hummille)
- **AI VC Investment** - $15B (Q1 2025)
  - Trendi: Rahoitus kasvaa → markkina laajenee
```

### Sijoitus dashboardille:

```
┌─────────────────────────────────────────────────────────┐
│  [KPI Cards ylhäällä]                                   │
│  [Trendikaaviot keskellä]                               │
├─────────────────────────────────────────────────────────┤
│  MACRO INDICATORS (uusi osio alhaalla)                  │
│  ┌─────────────┬──────────────┬──────────────────────┐ │
│  │ Tech Stocks │ Economic     │ AI Industry Trends   │ │
│  │             │ Indicators   │                      │ │
│  │ NVDA +2.4%  │ Fed: 4.50%   │ Adoption: 45%        │ │
│  │ GOOGL +1.2% │ EUR/USD:1.08 │ LLM Price: ↓ 20%    │ │
│  │ MSFT +0.8%  │ Inflation:2.5│ VC Investment: $15B  │ │
│  │ META +1.8%  │              │                      │ │
│  └─────────────┴──────────────┴──────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Miksi tärkeää?

> **"Fed-korko vaikuttaa asiakkaiden investointihalukkuuteen, AI-osakkeet kertovat markkinauskon suuntaan, ja toimialan trendit paljastavat kilpailuaseman."**

- **Fed Funds Rate ↑** → Yritykset investoivat vähemmän → Vaikeampi myydä AI-palveluita
- **AI osakkeet ↑** → Markkina uskoo AI:hin → Hyvä myyntiympäristö Hummille
- **LLM hinnat ↓** → Halvempi operatiivinen kustannus → Parempi kannattavuus
- **AI Adoption ↑** → Kilpailu kiristyy → Ensimmäisten liikkujien etu korostuu

---

## 4. AGENTTIEN JA MCP:N HYÖDYNTÄMINEN (PÄIVITETTY)

### Nykyiset chat-komponentit (EI agentit):

- **ChatInterface** - Johdon Co-Pilot
- **TechLeadModal** - Tech Lead chat
- **RAGInterface** - Dokumenttichat
- **StrategyChat** - Strategia-assistentti

### MCP:n rooli (Backend-palvelut, EI chatit):

#### A) **Metrics Agent** (MCP server)

```typescript
// MCP Server: @humm/metrics-mcp-server
// Käyttötarkoitus: Co-Pilot voi hakea live-dataa keskustelun aikana

Tools:
- get_customer_service_metrics() → Chatwoot API
- get_financial_metrics() → ARR, MRR, Revenue/Employee
- get_employee_metrics() → Headcount, utilization, active now
- get_sales_pipeline() → Pending deals, churn, velocity
- calculate_forecast(metric, timeframe) → Ennusteet (linear regression)
- detect_anomaly(metric) → "CSAT laski 15% viikossa!"

Esimerkki käytöstä:
User kysyy Co-Pilotilta: "Mikä on meidän CSAT tällä hetkellä?"
→ Co-Pilot kutsuu MCP tool: get_customer_service_metrics()
→ Saa vastauksen: { csat: 4.2, trend: "down", change: -0.3 }
→ Vastaa: "CSAT on 4.2/5.0, laskussa 0.3 pistettä viimeisen viikon aikana.
           Suosittelen tarkastelemaan viimeisimpiä negatiivisia palautteita..."
```

#### B) **Chatwoot Connector** (VALINNAINEN - suora REST API riittää)

```typescript
// HUOM: Chatwoot toimii hyvin suoralla REST API:lla (chatwoot-client.ts)
// MCP hyöty: Co-Pilot voi tehdä monimutkaisempia kyselyitä ilman erillistä koodia

Tools (jos halutaan):
- search_conversations(query, filters) → Etsi keskusteluja
- get_agent_performance(agent_id, timeframe) → Agentin suorituskyky
- assign_conversation(conv_id, agent_id) → Ohjaa tiketti
- bulk_update_conversations(filters, updates) → Massapäivitykset

PÄÄTÖS: Tämä EI ole välttämätön aluksi - suora REST API riittää
useimmille tarpeille. Voidaan lisätä myöhemmin jos tarve.
```

#### C) **Data Analysis Agent** (MCP server)

```typescript
// MCP Server: @humm/data-analysis-mcp-server
// Käyttötarkoitus: Edistyksellinen data-analytiikka ja ennusteet

Tools:
- time_series_forecast(data, periods, method)
  → ARIMA/Prophet ennusteet (parempia kuin linear regression)

- correlation_analysis(metric1, metric2)
  → "FRT korreloi CSAT:n kanssa -0.78 (vahva negatiivinen)"

- cohort_analysis(customers, timeframe)
  → "Tammikuun asiakkaat: churn 5%, keskiosto €12k"

- what_if_scenario(assumptions)
  → "Jos CSAT nousee 0.5, ARR kasvaa ~12% (Monte Carlo simulaatio)"

- anomaly_detection(metrics, sensitivity)
  → "FRT nousi 45min (3 std dev) klo 14:00 - selvitä syy"

Esimerkki käytöstä:
User: "Jos palkkaamme 2 lisää agenttia, miten FRT muuttuu?"
→ Co-Pilot kutsuu: what_if_scenario({ agents: +2 })
→ Agentti laskee mallin:
   - Nykyinen FRT: 1.8h
   - Avoimet tiketit: 45
   - Agentit nyt: 38 → 40
   - Ennuste: FRT laskee ~25min (1.8h → 1.4h)
→ Co-Pilot vastaa: "Kahden lisäagentin palkkaamisella FRT laskisi arviolta
   1.8h → 1.4h (25min parannus). Kustannus: €90k/vuosi. ROI..."
```

### MCP-konfiguraatio (.claude/mcp-config.json):

```json
{
  "mcpServers": {
    "metrics-analyzer": {
      "command": "node",
      "args": ["./mcp-servers/metrics-analyzer.js"],
      "env": {
        "CHATWOOT_API_URL": "${CHATWOOT_API_URL}",
        "CHATWOOT_API_TOKEN": "${CHATWOOT_API_TOKEN}",
        "CHATWOOT_ACCOUNT_ID": "${CHATWOOT_ACCOUNT_ID}"
      }
    },
    "data-analysis": {
      "command": "python",
      "args": ["./mcp-servers/data_analysis_server.py"],
      "env": {
        "PYTHONPATH": "./mcp-servers"
      }
    }
  }
}
```

### TÄRKEÄ EI-MCP-integraatio:

- **Chatwoot** - Säilyy suorana REST API -integraationa (chatwoot-client.ts)
  - Nopea, luotettava, ei ylimääräistä kompleksisuutta
  - MCP vain jos tarvitaan erittäin monimutkaisia kyselyitä Co-Pilotissa
  - **Päätös: Ei MCP:tä Chatwootille aluksi, lisätään vain jos tarve**

---

## TOTEUTUSJÄRJESTYS (PRIORISOITU)

### VAIHE 1: Live Dashboard perusrakenne (3-4h)
**Prioriteetti: KORKEA**

1. Luo uusi `LiveDashboard.tsx` komponentti
   - KPI-kortit: ARR, MRR, FRT, CSAT, Active Agents
   - Trendikaaviot (Recharts/Chart.js)
   - Grid-layout responsiivinen
2. Lisää metrics API endpointit backendiin (`client/server/routes.ts`)
   - `/api/metrics/financial` (mock data aluksi)
   - `/api/metrics/employees` (mock data)
   - `/api/metrics/sales-pipeline` (mock data)
3. Testaa mock-datalla

**Deliverable:** Toimiva Live Dashboard mock-datalla

---

### VAIHE 2: Chatwoot-integraatio (2-3h)
**Prioriteetti: KORKEA**

1. Testaa `chatwoot-client.ts` toimivuus
   - Tarkista .env credentials (CHATWOOT_API_URL, CHATWOOT_API_TOKEN, CHATWOOT_ACCOUNT_ID)
   - Testaa healthCheck()
2. Lisää `/api/metrics/customer-service` endpoint
   - FRT (avg_first_response_time)
   - CSAT (getCSATReports → calculate average)
   - Active agents (listAgents → filter by availability_status)
   - Resolution rate
3. Live-päivitys (polling 30s välein frontendissa)
4. Error handling (jos Chatwoot ei vastaa → fallback)

**Deliverable:** Live FRT, CSAT, Active Agents -metriikat dashboardilla

---

### VAIHE 3: Makrotalousmittarit (2h)
**Prioriteetti: KESKITASO**

1. Alpha Vantage API -integraatio
   - Rekisteröidy: alphavantage.co
   - Lisää endpoint: `/api/metrics/market-data`
   - Hae NVDA, GOOGL, MSFT, META hinnat
2. Economic indicators (Fred API tai manuaalinen)
   - Fed Funds Rate
   - EUR/USD
   - EU Inflation
3. Lisää "Macro Indicators" -osio Live Dashboardin alareunaan
   - 3 saraketta: Tech Stocks | Economic | AI Trends
   - Kompakti visualisointi

**Deliverable:** Makrotalousmittarit näkyvissä dashboardilla

---

### VAIHE 4: Rakenteen refaktorointi (2-3h)
**Prioriteetti: KESKITASO (ennen deploymenttia)**

1. Yhdistä välilehdet 7 → 4
   - **Live Dashboard** (uusi)
   - **Strategic Roadmap** (Roadmap + Strategy yhdistetty)
   - **AI Cases & Insights** (Cases + News yhdistetty)
   - **RAG Document Chat** (säilyy ennallaan)
2. Tech Lead Chat → floating button (bottom-right)
   - Poista "dashboard" välilehti
   - Lisää floating CTA button (kuten StrategyChat)
   - Avautuu full-screen modaalina
3. Siivoa päällekkäisyydet
   - Varmista: StrategyChat ≠ RAGInterface
   - Dokumentoi selkeästi ero README:ssä

**Deliverable:** Selkeä 4-välilehteinen rakenne

---

### VAIHE 5: MCP Metrics Agent (4-6h, VALINNAINEN)
**Prioriteetti: MATALA (voidaan tehdä myöhemmin)**

1. Luo `mcp-servers/metrics-analyzer.js`
   - Implementoi MCP protocol
   - Tools: get_customer_service_metrics, get_financial_metrics, etc.
2. Integro Co-Pilottiin (ChatInterface)
   - Lisää MCP client
   - Testaa: "Mikä on CSAT tällä hetkellä?"
3. Luo `mcp-servers/data_analysis_server.py` (Python)
   - Time-series forecasting (Prophet/ARIMA)
   - What-if scenarios
   - Correlation analysis

**Deliverable:** Co-Pilot osaa hakea live-metriikat keskustelun aikana

---

## YHTEENVETO TYÖMÄÄRÄSTÄ

| Vaihe | Prioriteetti | Aika | Status |
|-------|-------------|------|--------|
| 1. Live Dashboard perusrakenne | KORKEA | 3-4h | ⬜ Ei aloitettu |
| 2. Chatwoot-integraatio | KORKEA | 2-3h | ⬜ Ei aloitettu |
| 3. Makrotalousmittarit | KESKITASO | 2h | ⬜ Ei aloitettu |
| 4. Rakenteen refaktorointi | KESKITASO | 2-3h | ⬜ Ei aloitettu |
| 5. MCP Metrics Agent | MATALA (valinnainen) | 4-6h | ⬜ Ei aloitettu |
| **YHTEENSÄ (ilman MCP)** | | **9-12h** | |
| **YHTEENSÄ (MCP mukana)** | | **13-18h** | |

---

## DEPLOYMENT CHECKLIST

### Ennen deploymenttia:

- [ ] Kaikki metrics endpointit testattu
- [ ] Chatwoot credentials .env:ssä
  - [ ] CHATWOOT_API_URL
  - [ ] CHATWOOT_API_TOKEN
  - [ ] CHATWOOT_ACCOUNT_ID
- [ ] Alpha Vantage API key .env:ssä
  - [ ] ALPHA_VANTAGE_API_KEY
- [ ] Mobile-responsiivisuus testattu
  - [ ] iPhone SE (375px)
  - [ ] iPad (768px)
  - [ ] Desktop (1920px)
- [ ] Error handling kaikille API-kutsuille
  - [ ] Chatwoot ei vastaa → fallback
  - [ ] Alpha Vantage rate limit → cache
- [ ] Loading states kaikille
  - [ ] Skeleton loaders
  - [ ] Spinner live-datalle
- [ ] Performance optimoitu
  - [ ] Lazy loading (React.lazy)
  - [ ] Code splitting (routes)
  - [ ] Memoization (useMemo, useCallback)
- [ ] Dokumentaatio päivitetty
  - [ ] README.md
  - [ ] API endpoints dokumentoitu
  - [ ] Environment variables listattuna

### Deployment-ympäristö:

- [ ] Environment variables asetettu (Vercel/Railway)
- [ ] Build toimii tuotannossa (`npm run build`)
- [ ] Database migraatiot (jos tarpeen)
- [ ] CORS-asetukset oikein
- [ ] API rate limits huomioitu

---

## JATKOKEHITYS (Post-MVP)

### Tulevaisuuden integraatiot:

1. **CRM-integraatio** (HubSpot/Salesforce)
   - ARR, MRR, Pending Sales todellisella datalla
   - Deal velocity, churn rate
2. **HR-järjestelmä** (BambooHR/Personio)
   - Headcount, utilization, työaika
3. **Accounting** (Netvisor/Procountor)
   - Gross margin, cash flow, runway
4. **Advanced MCP Agents**
   - Predictive analytics
   - Automated alerts (Slack/Teams)
   - Natural language to SQL (kysele dataa luonnollisella kielellä)

---

## MUISTIINPANOT & PÄÄTÖKSET

**2025-10-11:**
- Päätös: Chatwoot pysyy suorana REST API -integraationa (ei MCP:tä aluksi)
- Päätös: MCP Metrics Agent valinnainen (prioriteetti matala)
- Päätös: Live Dashboard korkealla prioriteetilla (kriittinen johdolle)
- Päätös: Rakenteen refaktorointi ennen deploymenttia (sekaannus Tech Lead chat vs dashboard)

**Seuraavat askeleet:**
1. Katso suunnitelma huomenna tarkemmin
2. Priorisoi vaiheet 1-4 (9-12h)
3. Aloita Live Dashboard perusrakenteesta
4. Testaa Chatwoot-integraatio aikaisin (jos credentialit puuttuvat, mock-data)

---

**Suunnitelman laatija:** Claude (Sonnet 4.5)
**Hyväksyjä:** -
**Seuraava review:** 2025-10-12
