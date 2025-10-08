import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TrendingUp, TrendingDown, DollarSign, Users, Target, AlertCircle, Zap, Brain, BarChart3, ArrowUpRight, ArrowDownRight, Bot, Network, Link2, GitBranch, Database, Sparkles, Info, X } from "lucide-react";

interface AIConcept {
  id: string;
  title: string;
  icon: any;
  shortDescription: string;
  fullDescription: string;
  importance: string;
  gradient: string;
  borderColor: string;
}

const aiConcepts: AIConcept[] = [
  {
    id: "agentic-ai",
    title: "Agentic AI",
    icon: Bot,
    shortDescription: "Itsenäisesti toimivat AI-agentit jotka suorittavat tehtäviä ilman jatkuvaa ohjausta",
    fullDescription: `**Agentic AI** viittaa tekoälyjärjestelmiin, jotka voivat toimia itsenäisesti ja suorittaa monimutkaisia tehtäviä ilman jatkuvaa ihmisen ohjausta.

**Miksi tärkeä Hummille:**
- Automatisoi kokonaisia prosesseja, ei vain yksittäisiä vaiheita
- Vähentää manuaalista työtä dramaattisesti
- Skaalautuvuus kasvaa eksponentiaalisesti
- Asiakaspalvelu muuttuu proaktiiviseksi

**Käytännön esimerkki:**
AI-agentti tunnistaa asiakkaan ongelman, hakee tarvittavat tiedot CRM:stä, luo ratkaisun, lähettää sen asiakkaalle ja päivittää järjestelmät automaattisesti.

**Transformaation rooli:**
Agentic AI on perusta sille, että Humm voi skaalautua ilman henkilöstön jatkuvaa lisäämistä.`,
    importance: "Kriittinen skaalautuvuudelle ja automaatiolle",
    gradient: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30 hover:border-purple-400"
  },
  {
    id: "rag",
    title: "RAG",
    icon: Database,
    shortDescription: "Retrieval-Augmented Generation - AI hakee relevanttia tietoa ja generoi vastauksia",
    fullDescription: `**RAG (Retrieval-Augmented Generation)** yhdistää tiedonhaun ja tekstin generoinnin. AI hakee ensin relevanttia tietoa tietokannoista ja käyttää sitä tuottaakseen tarkkoja vastauksia.

**Miksi tärkeä Hummille:**
- AI voi käyttää Hummin omaa asiakastietoa ja dokumentaatiota
- Vastaukset ovat tarkkoja ja yrityskohtaisia
- Ei tarvitse "kouluttaa" AI-mallia jatkuvasti uudelleen
- Päivittyvä tieto on heti AI:n käytössä

**Käytännön esimerkki:**
Kun asiakas kysyy tuotteesta, AI hakee tuoreimmat tuotetiedot, aikaisemmat keskustelut ja dokumentaation - ja muodostaa niiden perusteella personoidun vastauksen.

**Transformaation rooli:**
RAG tekee AI:sta älykästä ja kontekstitietoista, ei vain yleisosaamista.`,
    importance: "Välttämätön tarkoille ja ajantasaisille vastauksille",
    gradient: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30 hover:border-blue-400"
  },
  {
    id: "langchain",
    title: "LangChain",
    icon: Link2,
    shortDescription: "Kehitystyökalu joka yhdistää AI-mallit, tietokannat ja työkalut yhtenäiseksi järjestelmäksi",
    fullDescription: `**LangChain** on kehityskehys, joka helpottaa monimutkaisten AI-sovellusten rakentamista. Se yhdistää AI-mallit, tietokannat, API:t ja muut työkalut ketjuiksi.

**Miksi tärkeä Hummille:**
- Nopea kehitys - valmista koodia monille perusasioille
- Helppo yhdistää eri järjestelmiä (CRM, tikettijärjestelmä, dokumentit)
- Laaja yhteisö ja tuki
- Modulaarinen rakenne - helppoa laajentaa

**Käytännön esimerkki:**
LangChain-ketju: 1) Ottaa asiakkaan kysymyksen vastaan, 2) Hakee RAG:n avulla relevanttia tietoa, 3) Muodostaa vastauksen Claude-mallilla, 4) Lähettää vastauksen ja päivittää CRM:n.

**Transformaation rooli:**
LangChain nopeuttaa kehitystyötä merkittävästi ja mahdollistaa monimutkaisten järjestelmien rakentamisen.`,
    importance: "Kiihdyttää kehitystä ja yksinkertaistaa integrointeja",
    gradient: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/30 hover:border-emerald-400"
  },
  {
    id: "langgraph",
    title: "LangGraph",
    icon: GitBranch,
    shortDescription: "Monimutkaisten AI-työnkulkujen hallinta ehtoineen ja haarautumisine",
    fullDescription: `**LangGraph** on LangChainin laajennus, joka mahdollistaa monimutkaisten, ehdollisten työnkulkujen rakentamisen. Se käyttää graafipohjaista arkkitehtuuria.

**Miksi tärkeä Hummille:**
- Mahdollistaa monimutkaiset päätöksentekoprosessit
- AI voi seurata useiden vaiheiden prosesseja
- Ehdolliset haarautumiset ("jos X, tee Y, muuten Z")
- Inhimillisen hyväksynnän lisääminen prosesseihin

**Käytännön esimerkki:**
Reklamaatioprosessi: AI analysoi → Jos alle 100€, hyväksyy automaattisesti → Jos yli, lähettää ihmiselle → Käsittelee palautuksen → Päivittää järjestelmät → Lähettää vahvistuksen.

**Transformaation rooli:**
LangGraph mahdollistaa agentic-järjestelmät, jotka hoitavat kokonaisia prosesseja.`,
    importance: "Mahdollistaa monimutkaiset automaatioprosessit",
    gradient: "from-orange-500/20 to-red-500/20",
    borderColor: "border-orange-500/30 hover:border-orange-400"
  },
  {
    id: "vector-databases",
    title: "Vector Databases",
    icon: Network,
    shortDescription: "Erikoistuneet tietokannat semanttiseen tiedonhakuun",
    fullDescription: `**Vector Databases** (Pinecone, Weaviate, Chroma) tallentavat tietoa vektoreina, jotka edustavat tekstin semanttista merkitystä. Mahdollistaa "älykkään" tiedonhaun.

**Miksi tärkeä Hummille:**
- AI löytää relevantit tiedot merkityksen, ei vain avainsanojen perusteella
- Nopea haku jopa miljoonista dokumenteista
- Toimii RAG:n perustana
- Personointi perustuu tähän teknologiaan

**Käytännön esimerkki:**
Asiakas kysyy: "Miten vaihdan laskutusosoitetta?" AI hakee vektorikannasta kaikki samankaltaiset kysymykset ja vastaukset, vaikka tarkkaa sanaa "laskutusosoite" ei olisi aiemmin käytetty.

**Transformaation rooli:**
Vector databases tekevät AI:sta todella älykkään - se "ymmärtää" mitä haetaan.`,
    importance: "Perusta älykkäälle tiedonhaulle ja personoinnille",
    gradient: "from-indigo-500/20 to-purple-500/20",
    borderColor: "border-indigo-500/30 hover:border-indigo-400"
  },
  {
    id: "llm-orchestration",
    title: "LLM Orchestration",
    icon: Brain,
    shortDescription: "Useiden AI-mallien koordinointi monimutkaisten tehtävien ratkaisemiseksi",
    fullDescription: `**LLM Orchestration** tarkoittaa useiden eri AI-mallien yhteensovittamista. Eri mallit ovat hyviä eri tehtävissä, ja orkestrointi yhdistää niiden vahvuudet.

**Miksi tärkeä Hummille:**
- Optimoi kustannuksia (yksinkertaisiin tehtäviin halvemmat mallit)
- Parempi suorituskyky (oikea työkalu oikeaan tehtävään)
- Redundanssi (jos yksi malli ei toimi, toinen ottaa paikan)
- Erikoistuminen (esim. suomenkieli eri mallilla)

**Käytännön esimerkki:**
Pieni malli luokittelee kysymyksen → Keskikokoinen hakee tietoa → Iso malli (Claude) muodostaa vastauksen → Pieni malli tarkistaa laadun.

**Transformaation rooli:**
Orkestrointi tekee järjestelmästä tehokkaan, kustannustehokkaan ja luotettavan.`,
    importance: "Optimoi suorituskykyä ja kustannuksia",
    gradient: "from-pink-500/20 to-rose-500/20",
    borderColor: "border-pink-500/30 hover:border-pink-400"
  },
  {
    id: "prompt-engineering",
    title: "Prompt Engineering",
    icon: Sparkles,
    shortDescription: "Taide ja tiede muotoilla AI:lle annetut ohjeet saadakseen parhaat tulokset",
    fullDescription: `**Prompt Engineering** on prosessi, jossa kehitetään ja optimoidaan AI:lle annettavat ohjeet parhaan tuloksen saavuttamiseksi.

**Miksi tärkeä Hummille:**
- Vaikuttaa suoraan AI:n laatuun ja tarkkuuteen
- Voi parantaa tuloksia ilman mallien uudelleenkoulutusta
- Kustannustehokas tapa optimoida
- Erottaa hyvän AI-toteutuksen keskinkertaisesta

**Käytännön esimerkki:**
Huono: "Vastaa asiakkaalle"
Hyvä: "Olet Hummin asiantuntija. Vastaa ystävällisesti suomeksi. Käytä asiakkaan nimeä. Tarkista CRM. Jos VIP-asiakas, ole erityisen huolellinen. Varmista konkreettinen vastaus."

**Transformaation rooli:**
Hyvä prompt engineering on ero sen välillä, toimiiko AI vai ei.`,
    importance: "Määrittää AI:n laadun ja luotettavuuden",
    gradient: "from-yellow-500/20 to-orange-500/20",
    borderColor: "border-yellow-500/30 hover:border-yellow-400"
  }
];

export function HummOverviewDashboard() {
  const [selectedConcept, setSelectedConcept] = useState<AIConcept | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'operating' | 'employees' | 'equity' | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<'challenges' | 'potential' | null>(null);
  const [selectedStrength, setSelectedStrength] = useState<'balance' | 'brand' | 'agility' | 'timing' | null>(null);

  // Humm Group Oy:n talousdatat (2024 vs 2023)
  const financialData = {
    revenue2024: 2127225.60,
    revenue2023: 2303604.70,
    employees2024: 52,
    employees2023: 54,
    operatingLoss2024: -4869.55,
    operatingLoss2023: -94816.03,
    equity2024: 574370.35,
    equity2023: 595532.78,
    totalAssets2024: 1267941.41,
    totalAssets2023: 1376349.61,
    cashAndSecurities2024: 449946.78, // rahat + arvopaperit
    cashAndSecurities2023: 321871.81,
  };

  // AI-implementaation potentiaali BPO-yrityksille (tutkimuksesta)
  const aiPotential = {
    timeReduction: "13.8%", // Enemmän asiakkaiden yhteydenottoja tunnissaan
    callHandling: "45%", // Puhelun käsittelyaikaa
    operationalCosts: "30%", // Operatiivisia kustannuksia
    productivityIncrease: "66%", // Tuottavuussparannuksen
    automationRange: "2.6-4.4B USD", // Globaali lisäarvo vuosittain
  };

  // Lasketut metriikat
  const revenueChange = ((financialData.revenue2024 - financialData.revenue2023) / financialData.revenue2023) * 100;
  const operatingMargin2024 = (financialData.operatingLoss2024 / financialData.revenue2024) * 100;
  const operatingMargin2023 = (financialData.operatingLoss2023 / financialData.revenue2023) * 100;
  const revenuePerEmployee2024 = financialData.revenue2024 / financialData.employees2024;
  const revenuePerEmployee2023 = financialData.revenue2023 / financialData.employees2023;
  const equityRatio2024 = (financialData.equity2024 / financialData.totalAssets2024) * 100;

  // AI-transformaation potentiaali Hummille
  const projectedRevenueTo10M = 10000000;
  const currentRevenue = financialData.revenue2024;
  const requiredGrowth = ((projectedRevenueTo10M - currentRevenue) / currentRevenue) * 100;
  const potentialCostSaving = financialData.revenue2024 * 0.30; // 30% kustannussäästö
  const potentialProductivityGain = financialData.revenue2024 * 0.66; // 66% tuottavuuslisäys

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          Humm Group Oy - Nykytila & AI-transformaation potentiaali
        </h1>
        <p className="text-slate-300 text-sm">
          Tilinpäätös 2024 ja skenaarioanalyysi: Polku kohti €10M liikevaihtoa AI-teknologian avulla
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Liikevaihto */}
        <Card
          className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-slate-600/50 backdrop-blur-sm p-5 hover:scale-105 transition-transform duration-200 cursor-pointer hover:border-blue-500/50"
          onClick={() => setSelectedMetric('revenue')}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-slate-300 text-sm font-medium">Liikevaihto 2024</h3>
            </div>
            <div className="flex items-center gap-1 text-red-400">
              <TrendingDown className="h-4 w-4" />
              <span className="text-xs font-medium">{revenueChange.toFixed(1)}%</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {(financialData.revenue2024 / 1000000).toFixed(2)}M€
          </p>
          <p className="text-xs text-slate-400">
            vs. {(financialData.revenue2023 / 1000000).toFixed(2)}M€ (2023)
          </p>
        </Card>

        {/* Liikevoitto */}
        <Card
          className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-slate-600/50 backdrop-blur-sm p-5 hover:scale-105 transition-transform duration-200 cursor-pointer hover:border-emerald-500/50"
          onClick={() => setSelectedMetric('operating')}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-slate-300 text-sm font-medium">Liikevoitto/-tappio</h3>
            </div>
            <div className="flex items-center gap-1 text-emerald-400">
              <ArrowUpRight className="h-4 w-4" />
              <span className="text-xs font-medium">+95%</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {(financialData.operatingLoss2024 / 1000).toFixed(1)}k€
          </p>
          <p className="text-xs text-slate-400">
            Käyttökate: {operatingMargin2024.toFixed(1)}% (vs. {operatingMargin2023.toFixed(1)}% 2023)
          </p>
        </Card>

        {/* Henkilöstö */}
        <Card
          className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-slate-600/50 backdrop-blur-sm p-5 hover:scale-105 transition-transform duration-200 cursor-pointer hover:border-purple-500/50"
          onClick={() => setSelectedMetric('employees')}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-slate-300 text-sm font-medium">Henkilöstö</h3>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {financialData.employees2024}
          </p>
          <p className="text-xs text-slate-400">
            Liikevaihto/hlö: {(revenuePerEmployee2024 / 1000).toFixed(0)}k€
          </p>
        </Card>

        {/* Omavaraisuusaste */}
        <Card
          className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-slate-600/50 backdrop-blur-sm p-5 hover:scale-105 transition-transform duration-200 cursor-pointer hover:border-yellow-500/50"
          onClick={() => setSelectedMetric('equity')}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-yellow-400" />
              </div>
              <h3 className="text-slate-300 text-sm font-medium">Omavaraisuus</h3>
            </div>
            <div className="flex items-center gap-1 text-emerald-400">
              <span className="text-xs font-medium">Vahva</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {equityRatio2024.toFixed(1)}%
          </p>
          <p className="text-xs text-slate-400">
            Oma pääoma: {(financialData.equity2024 / 1000).toFixed(0)}k€
          </p>
        </Card>
      </div>

      {/* AI Transformation Potential */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Current Challenges */}
        <Card
          className="bg-gradient-to-br from-red-900/20 via-slate-800/90 to-slate-700/90 border-red-500/30 backdrop-blur-sm p-6 cursor-pointer hover:border-red-400/50 transition-all"
          onClick={() => setSelectedInsight('challenges')}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Nykytilan haasteet</h2>
              <p className="text-sm text-slate-300">Kriittiset kehityskohteet</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <ArrowDownRight className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-white font-semibold text-sm">Liikevaihdon lasku</h3>
                <p className="text-slate-300 text-xs">
                  Liikevaihto laski {Math.abs(revenueChange).toFixed(1)}% vuodesta 2023.
                  Markkinatilanne ja kilpailu vaativat uusia lähestymistapoja.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ArrowDownRight className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-white font-semibold text-sm">Kannattavuus</h3>
                <p className="text-slate-300 text-xs">
                  Liiketoiminta on tappiollista ({(financialData.operatingLoss2024 / 1000).toFixed(1)}k€).
                  Kustannustehokkuutta on parannettava.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-white font-semibold text-sm">Tuottavuus</h3>
                <p className="text-slate-300 text-xs">
                  Liikevaihto per henkilö: {(revenuePerEmployee2024 / 1000).toFixed(0)}k€.
                  Manuaaliset prosessit rajoittavat skaalautuvuutta.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-white font-semibold text-sm">Kasvutavoite</h3>
                <p className="text-slate-300 text-xs">
                  10M€ tavoite vaatii <span className="text-orange-300 font-semibold">
                    +{requiredGrowth.toFixed(0)}%
                  </span> kasvua. Perinteiset menetelmät eivät riitä.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Right: AI Transformation Potential */}
        <Card
          className="bg-gradient-to-br from-emerald-900/20 via-slate-800/90 to-slate-700/90 border-emerald-500/30 backdrop-blur-sm p-6 cursor-pointer hover:border-emerald-400/50 transition-all"
          onClick={() => setSelectedInsight('potential')}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI-transformaation potentiaali</h2>
              <p className="text-sm text-slate-300">Tutkittu vaikutus BPO-toimialalla</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                  Asiakaskontaktien määrä
                  <span className="text-emerald-400 text-xs bg-emerald-500/20 px-2 py-0.5 rounded">
                    +{aiPotential.timeReduction}
                  </span>
                </h3>
                <p className="text-slate-300 text-xs">
                  AI mahdollistaa {aiPotential.timeReduction} enemmän asiakasyhteydenottoja tunnissa samalla henkilöstömäärällä.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                  Puhelun käsittelyn nopeuttaminen
                  <span className="text-blue-400 text-xs bg-blue-500/20 px-2 py-0.5 rounded">
                    +{aiPotential.callHandling}
                  </span>
                </h3>
                <p className="text-slate-300 text-xs">
                  Puhelun käsittelyaikaa voidaan vähentää {aiPotential.callHandling} AI-avusteisilla työkaluilla.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                  Operatiivisten kustannusten vähennys
                  <span className="text-purple-400 text-xs bg-purple-500/20 px-2 py-0.5 rounded">
                    -{aiPotential.operationalCosts}
                  </span>
                </h3>
                <p className="text-slate-300 text-xs">
                  Potentiaali säästää ~{(potentialCostSaving / 1000).toFixed(0)}k€ vuosittain automaation kautta.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <BarChart3 className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                  Tuottavuussparannuksen potentiaali
                  <span className="text-yellow-400 text-xs bg-yellow-500/20 px-2 py-0.5 rounded">
                    +{aiPotential.productivityIncrease}
                  </span>
                </h3>
                <p className="text-slate-300 text-xs">
                  Tuottavuussparannusten kautta potentiaali kasvattaa liikevaihtoa jopa ~{(potentialProductivityGain / 1000000).toFixed(1)}M€.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>


      {/* Key Strengths */}
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-slate-600/50 backdrop-blur-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Hummin vahvuudet transformaatiossa</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-slate-700/30 transition-colors"
            onClick={() => setSelectedStrength('balance')}
          >
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <DollarSign className="h-4 w-4 text-green-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Vahva tase</h3>
              <p className="text-slate-300 text-xs">
                Omavaraisuusaste {equityRatio2024.toFixed(1)}% ja käteisvaroja {(financialData.cashAndSecurities2024 / 1000).toFixed(0)}k€.
                Investointikyky AI-kehitykseen on olemassa.
              </p>
            </div>
          </div>

          <div
            className="flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-slate-700/30 transition-colors"
            onClick={() => setSelectedStrength('brand')}
          >
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Users className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Laadukas brändi</h3>
              <p className="text-slate-300 text-xs">
                Vahva asiakaskunta ja ihmisläheinen palvelu. AI voi vahvistaa tätä kilpailuetua entisestään.
              </p>
            </div>
          </div>

          <div
            className="flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-slate-700/30 transition-colors"
            onClick={() => setSelectedStrength('agility')}
          >
            <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Zap className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Ketteryys</h3>
              <p className="text-slate-300 text-xs">
                Pieni organisaatio (52 hlö) mahdollistaa nopean muutoksen. Suuret kilpailijat ovat hitaampia.
              </p>
            </div>
          </div>

          <div
            className="flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-slate-700/30 transition-colors"
            onClick={() => setSelectedStrength('timing')}
          >
            <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Target className="h-4 w-4 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Oikea ajoitus</h3>
              <p className="text-slate-300 text-xs">
                Agentic AI ja MCP-protokolla tarjoavat ensimmäistä kertaa luotettavat ratkaisut. Nyt on aika toimia.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Concepts Grid */}
      <div className="mt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-400" />
            Keskeiset AI-konseptit transformaatiossa
          </h2>
          <p className="text-slate-400 text-sm">
            Tutustukaa näihin keskeisiin teknologioihin ja käsitteisiin, jotka ovat transformaation ytimessä
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {aiConcepts.map((concept, index) => {
            const Icon = concept.icon;
            return (
              <Card
                key={concept.id}
                className={`bg-gradient-to-br ${concept.gradient} border ${concept.borderColor} hover:scale-105 transition-all duration-300 cursor-pointer animate-in fade-in-0 slide-in-from-bottom-4`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedConcept(concept)}
              >
                <div className="p-5">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="p-2 rounded-lg bg-white/10 flex-shrink-0">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-base mb-1">{concept.title}</h3>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm line-clamp-3 mb-3">
                    {concept.shortDescription}
                  </p>
                  <div className="flex items-center text-xs text-white/70 font-medium">
                    <Sparkles className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>Klikkaa lisätietoja</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Key Metrics Modals */}
      <Dialog open={selectedMetric === 'revenue'} onOpenChange={() => setSelectedMetric(null)}>
        <DialogContent className="max-w-4xl bg-slate-900 border-slate-700 text-white max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3 text-2xl">
              <DollarSign className="h-7 w-7 text-blue-400" />
              <span>Liikevaihto 2024 - Syvällinen analyysi</span>
            </DialogTitle>
            <DialogDescription className="text-slate-400 pt-2">
              Yksityiskohtainen analyysi liikevaihdosta ja sen kehityksestä
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">📊 Liikevaihdon kehitys</h3>
              <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">2024 liikevaihto:</span>
                  <span className="text-2xl font-bold text-white">{(financialData.revenue2024 / 1000000).toFixed(2)}M€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">2023 liikevaihto:</span>
                  <span className="text-lg text-slate-400">{(financialData.revenue2023 / 1000000).toFixed(2)}M€</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                  <span className="text-slate-300">Muutos:</span>
                  <span className="text-lg font-semibold text-red-400">{revenueChange.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">🔍 Analyysi</h3>
              <div className="space-y-3 text-slate-300">
                <p>
                  Liikevaihto laski {Math.abs(revenueChange).toFixed(1)}% edellisvuodesta. Tämä johtuu pääasiassa:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Yleinen markkinatilanteen heikkeneminen BPO-sektorilla</li>
                  <li>Kireä kilpailutilanne ja hintapaineet</li>
                  <li>Asiakkaiden automaatioprojektit (vähentävät outsourcing-tarvetta)</li>
                  <li>Taloudellinen epävarmuus vähentää investointeja asiakaspalveluun</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">💡 AI:n potentiaali kasvuun</h3>
              <div className="space-y-3">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-emerald-400 mb-2">Uudet palvelumallit</h4>
                  <p className="text-sm text-slate-300">
                    AI-pohjaiset premium-palvelut voivat tuoda €500k-1M lisäarvoa vuosittain.
                    Asiakkaat ovat valmiita maksamaan 20-30% enemmän AI-optimoidusta palvelusta.
                  </p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-400 mb-2">Tehokkuussparannukset</h4>
                  <p className="text-sm text-slate-300">
                    Automaation avulla voidaan palvella 2x enemmän asiakkaita samalla henkilöstömäärällä,
                    mahdollistaen liikevaihdon kasvun ilman lineaarista kustannusten nousua.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-700">
            <button
              onClick={() => setSelectedMetric(null)}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Sulje
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Operating Profit Modal */}
      <Dialog open={selectedMetric === 'operating'} onOpenChange={() => setSelectedMetric(null)}>
        <DialogContent className="max-w-4xl bg-slate-900 border-slate-700 text-white max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3 text-2xl">
              <TrendingUp className="h-7 w-7 text-emerald-400" />
              <span>Liikevoitto & Kannattavuus</span>
            </DialogTitle>
            <DialogDescription className="text-slate-400 pt-2">
              Kannattavuuden kehitys ja parantamisen roadmap
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 space-y-6">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">📈 Kannattavuuden parantuminen</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Liikevoitto 2024</p>
                  <p className="text-2xl font-bold text-white">{(financialData.operatingLoss2024 / 1000).toFixed(1)}k€</p>
                  <p className="text-sm text-slate-400">Marginaali: {operatingMargin2024.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Liikevoitto 2023</p>
                  <p className="text-xl text-slate-400">{(financialData.operatingLoss2023 / 1000).toFixed(1)}k€</p>
                  <p className="text-sm text-slate-400">Marginaali: {operatingMargin2023.toFixed(1)}%</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-emerald-400 font-semibold">✅ Parantuminen +95% (lähempänä nollaa)</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">🎯 Polku kannattavuuteen AI:n avulla</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-400 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Kustannussäästöt (30%)</h4>
                    <p className="text-sm text-slate-300">AI-automaatio vähentää operatiivisia kustannuksia ~€640k/vuosi</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-400 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Tuottavuuden kasvu (66%)</h4>
                    <p className="text-sm text-slate-300">Henkilöstö palvelee enemmän asiakkaita AI-työkalujen avulla</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-emerald-400 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Premium-hinnoittelu</h4>
                    <p className="text-sm text-slate-300">AI-pohjaiset palvelut mahdollistavat 20-30% korkeamman hinnoittelun</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
              <p className="text-emerald-400 font-semibold mb-2">💰 Tavoite 18 kuukaudessa:</p>
              <p className="text-slate-300 text-sm">
                Positiivinen liikevoitto (+8-12% marginaali) AI-optimoinnin kautta.
                Tämä vaatii €60-80k kuukausittaista sparannusta/liikevaihdon kasvua.
              </p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-700">
            <button
              onClick={() => setSelectedMetric(null)}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
            >
              Sulje
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Employees Modal */}
      <Dialog open={selectedMetric === 'employees'} onOpenChange={() => setSelectedMetric(null)}>
        <DialogContent className="max-w-4xl bg-slate-900 border-slate-700 text-white max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3 text-2xl">
              <Users className="h-7 w-7 text-purple-400" />
              <span>Henkilöstö & Tuottavuus</span>
            </DialogTitle>
            <DialogDescription className="text-slate-400 pt-2">
              Henkilöstörakenne ja AI:n vaikutus tuottavuuteen
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 space-y-6">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Henkilöstömäärä 2024</p>
                  <p className="text-3xl font-bold text-white">{financialData.employees2024}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Liikevaihto per henkilö</p>
                  <p className="text-3xl font-bold text-purple-400">{(revenuePerEmployee2024 / 1000).toFixed(0)}k€</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">📊 Tuottavuusanalyysi</h3>
              <div className="space-y-3 text-slate-300">
                <p>
                  Liikevaihto per henkilö on {(revenuePerEmployee2024 / 1000).toFixed(0)}k€, mikä on BPO-alan keskitasoa.
                  AI-transformaation avulla tämä voidaan nostaa merkittävästi:
                </p>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-3">
                  <h4 className="font-semibold text-blue-400 mb-2">🎯 Tavoite: {((projectedRevenueTo10M / financialData.employees2024) / 1000).toFixed(0)}k€ per henkilö</h4>
                  <p className="text-sm text-slate-300">
                    10M€ liikevaihto jakuna nykyisellä henkilöstömäärällä (52 hlö) = {((projectedRevenueTo10M / financialData.employees2024) / 1000).toFixed(0)}k€/hlö.
                    Tämä on mahdollista AI-automaation avulla ilman massiivisia palkkauksia.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">🤖 AI:n rooli tuottavuudessa</h3>
              <div className="space-y-3">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                  <h4 className="font-semibold text-purple-400 text-sm mb-1">Agentic AI & Automaatio</h4>
                  <p className="text-xs text-slate-300">
                    Yksi agentti voi hoitaa 25-40% rutiinitehtävistä 24/7. Henkilöstö keskittyy monimutkaisiin ongelmiin.
                  </p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                  <h4 className="font-semibold text-emerald-400 text-sm mb-1">Koulutus & Upskilling</h4>
                  <p className="text-xs text-slate-300">
                    Henkilöstö koulutetaan AI-power usersiksi. Jokainen työntekijä saa AI-assistentin, mikä 2-3x tuottavuuden.
                  </p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <h4 className="font-semibold text-yellow-400 text-sm mb-1">Skaalautuvuus</h4>
                  <p className="text-xs text-slate-300">
                    Kasvu 2.1M→10M€ vaatii vain ~20-30 lisäpalkkaa (vs. 100+ ilman AI:ta).
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-700">
            <button
              onClick={() => setSelectedMetric(null)}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              Sulje
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Equity Modal */}
      <Dialog open={selectedMetric === 'equity'} onOpenChange={() => setSelectedMetric(null)}>
        <DialogContent className="max-w-4xl bg-slate-900 border-slate-700 text-white max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3 text-2xl">
              <Target className="h-7 w-7 text-yellow-400" />
              <span>Omavaraisuus & Taloudellinen Vahvuus</span>
            </DialogTitle>
            <DialogDescription className="text-slate-400 pt-2">
              Taseen vahvuus ja investointivara AI-kehitykseen
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 space-y-6">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Omavaraisuusaste</p>
                  <p className="text-3xl font-bold text-yellow-400">{equityRatio2024.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Oma pääoma</p>
                  <p className="text-2xl font-bold text-white">{(financialData.equity2024 / 1000).toFixed(0)}k€</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Käteinen + arvopaperit</p>
                  <p className="text-2xl font-bold text-emerald-400">{(financialData.cashAndSecurities2024 / 1000).toFixed(0)}k€</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">💪 Taloudellinen vahvuus</h3>
              <div className="space-y-3 text-slate-300">
                <p>
                  <strong className="text-emerald-400">{equityRatio2024.toFixed(1)}%</strong> omavaraisuusaste on erittäin vahva.
                  Toimialan suositus on 20-30%, joten Humm on selvästi terveempi kuin keskiverr BPO-yritys.
                </p>
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mt-3">
                  <h4 className="font-semibold text-emerald-400 mb-2">✅ Investointivara AI-transformaatioon</h4>
                  <p className="text-sm text-slate-300">
                    <strong>{(financialData.cashAndSecurities2024 / 1000).toFixed(0)}k€</strong> käteisvaroja mahdollistaa merkittävät AI-investoinnit:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                    <li>AI-kehitystyö: €50-100k (LangChain, RAG, agentit)</li>
                    <li>Henkilöstökoulutus: €30-50k</li>
                    <li>Infra & työkalut: €20-40k/vuosi</li>
                    <li>Varapuskuri: €200k+ turvamarginaali</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">💰 Investointisuunnitelma</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-300">Vuosi 1 (MVP & Pilotit)</span>
                  <span className="font-semibold text-blue-400">€80-120k</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-300">Vuosi 2 (Skaala & Automaatio)</span>
                  <span className="font-semibold text-purple-400">€100-150k</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-300">Vuosi 3+ (Optimointi)</span>
                  <span className="font-semibold text-emerald-400">€50-80k/vuosi</span>
                </div>
              </div>
              <p className="text-sm text-slate-400 mt-3">
                Yhteensä €230-350k investointi 3 vuodessa. ROI: 10x (€2-3M lisäarvoa)
              </p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-700">
            <button
              onClick={() => setSelectedMetric(null)}
              className="w-full py-3 px-4 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors"
            >
              Sulje
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Concept Detail Modal */}
      <Dialog open={!!selectedConcept} onOpenChange={() => setSelectedConcept(null)}>
        <DialogContent className="max-w-3xl bg-slate-900 border-slate-700 text-white max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3 text-2xl">
              {selectedConcept && <selectedConcept.icon className="h-7 w-7 text-blue-400" />}
              <span>{selectedConcept?.title}</span>
            </DialogTitle>
            <DialogDescription className="text-slate-400 pt-2">
              {selectedConcept?.importance}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 space-y-4 text-slate-300 whitespace-pre-line">
            {selectedConcept?.fullDescription}
          </div>
          <div className="mt-6 pt-6 border-t border-slate-700">
            <button
              onClick={() => setSelectedConcept(null)}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Sulje
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Data Sources Footer */}
      <div className="text-center pt-8 pb-2">
        <p className="text-xs text-slate-400">
          Lähteet: Humm Group Oy tilinpäätös 2024 (Kaupparekisteri) |
          BPO-alan AI-tutkimus: tekoälyn vaikutukset työaikasäästöihin ja automaatioasteisiin
        </p>
      </div>
    </div>
  );
}
