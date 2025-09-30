import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  TrendingUp,
  Target,
  Rocket,
  Euro,
  Users,
  Brain,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Star,
  BarChart3,
  Bot,
  Cpu,
  Network,
  Award,
  ChevronDown,
  Info,
  GripVertical
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  metrics: {
    current: string;
    target: string;
    impact: string;
  };
  actions: string[];
  technologies: string[];
  risks: string[];
  benchmarks: {
    company: string;
    achievement: string;
  }[];
}

interface RoadmapPhase {
  id: string;
  quarter: string;
  title: string;
  revenue: string;
  margin: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  categories: Category[];
  kpis: {
    name: string;
    current: number;
    target: number;
    unit: string;
    change: string;
  }[];
}

// Sortable Category Component
function SortableCategory({ category, onClick }: { category: Category; onClick: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const Icon = category.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative ${isDragging ? 'z-50' : ''}`}
    >
      <motion.button
        onClick={onClick}
        className={`w-full text-left p-4 rounded-lg bg-gradient-to-r ${category.color} hover:scale-[1.02] transition-all cursor-pointer border border-slate-700/50`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-3">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4 text-white/70 hover:text-white transition-colors" />
          </div>
          <Icon className="w-5 h-5 text-white" />
          <div className="flex-1">
            <h4 className="font-semibold text-white text-sm">{category.name}</h4>
            <p className="text-xs text-white/80 mt-1">{category.description}</p>
          </div>
          <Info className="w-4 h-4 text-white/70" />
        </div>
      </motion.button>
    </div>
  );
}

const StrategicRoadmap = () => {
  const [expandedPhase, setExpandedPhase] = useState<string | null>("phase1");
  const [isEditMode, setIsEditMode] = useState(false);
  const [phases, setPhases] = useState<RoadmapPhase[]>([]);
  const [secretModalOpen, setSecretModalOpen] = useState(false);
  const [streamedText, setStreamedText] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Secret content to stream
  const secretContent = `Tein laskelmat open source - ratkaisu chatwoot + n8n + llm vs SaaS.
Määritin tarkasti kaikki muuttujat ja tein oletuksen, että, jos saavutetaan täysi autonomia ja jäljelle jää human oversight.

Säästöt ovat valtavia. Vaikka toteuttaisiin one-click järjestelmä aluksi, mikä onkin fiksuin tapa -- Agentic AI helpottaa sovelluskehitystä niin, että ainoa järkevä ratkaisu on siirtyä open sourceen.

Ja mielestäni järkevintä olisi käyttää vapautuvat henkilöstöresurssit tekoäly-palvelukokonaisuuksien myyntiin ja panostaa siihen, että myös hummin omat asiakkaat hyötyisivät tästä mahdollisuudesta.

Strategiset lähtökohdat Hummilla on mielestäni saavuttaa 10 miljoonan liikevaihto jo kahdessa vuodessa. Se vaatii vain tulevalta teknologiajohtajalta ymmärrystä siitä miten suuresta potentiaalista tässä on kyse -- vaikka internetistäkin muodostui aikoinaan kupla, oli se silti 'the most disruptive thing in our modern history' tähän teknologiaan perehtyneenä, ammattilaisia kuulleena... Noh, hype sikseen -- Haluan vielä verrata tätä internettiin, koska silloinkin  syntyi paljon www.dotcom - yrityksiä, joilla ei ollut mitään oikeaa arvoa, mutta ne näyttivät oikeilta. Tästä syystä painotan jatkuvaa seurantaa, muuten on säilyä voittajana.`;

  // Typewriter effect
  useEffect(() => {
    if (!secretModalOpen) {
      setStreamedText("");
      return;
    }

    let currentIndex = 0;
    const intervalSpeed = 20; // milliseconds per character
    
    const interval = setInterval(() => {
      if (currentIndex < secretContent.length) {
        setStreamedText(secretContent.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, intervalSpeed);

    return () => clearInterval(interval);
  }, [secretModalOpen]);

  // Initialize phases data
  const phasesData: RoadmapPhase[] = [
    {
      id: "phase1",
      quarter: "2025 Q1-Q2",
      title: "Perusta & Nopeat Voitot",
      revenue: "€2.1M → €2.5M",
      margin: "-0.2% → +8%",
      status: "in-progress",
      kpis: [
        { name: "Liikevaihto", current: 2.1, target: 2.5, unit: "M€", change: "+19%" },
        { name: "Käyttökate", current: -0.2, target: 8, unit: "%", change: "+8.2pp" },
        { name: "Asiakastyytyväisyys", current: 72, target: 80, unit: "%", change: "+11%" },
        { name: "Tehokkuus", current: 100, target: 115, unit: "%", change: "+15%" }
      ],
      categories: [
        {
          id: "efficiency",
          name: "Tehokkuuden Parantaminen",
          description: "Automatisoi manuaaliset prosessit ja optimoi resurssiallokointi AI:n avulla",
          icon: Zap,
          color: "from-amber-500/80 to-orange-600/80",
          metrics: {
            current: "60-70% henkilöstökustannukset liikevaihdosta",
            target: "15-25% parannus operatiivisessa tehokkuudessa",
            impact: "20+ tuntia/viikko säästö tiimiltä"
          },
          actions: [
            "Automatisoi CRM-datasyöttö GPT-4 API:lla → vähennä 30-50% manuaalista työtä",
            "Rakenna ennakoiva resurssimalli (XGBoost/LSTM) → vähennä tyhjiä resursseja 25%",
            "Chatbotit hoitavat 50% yksinkertaisista kyselyistä",
            "Älykkäät järjestelmät priorisoivat ja reitittävät pyynnöt tehokkaammin"
          ],
          technologies: ["GPT-4/Claude API", "XGBoost", "LSTM", "CRM-integraatiot", "Chatbot-alusta"],
          risks: ["Integraatioiden kompleksisuus", "Muutosvastarinta henkilöstössä"],
          benchmarks: [
            { company: "Epassi Group", achievement: "20% vähennys manuaalisessa työssä automaation avulla" },
            { company: "Accountor Group", achievement: "15-20% tuottavuuden parannus AI-ratkaisuilla" }
          ]
        },
        {
          id: "customer-experience",
          name: "Asiakaskokemuksen Kehittäminen",
          description: "Personoitu, reaaliaikainen palvelu 24/7 AI-avusteisella järjestelmällä",
          icon: Users,
          color: "from-blue-500/80 to-cyan-600/80",
          metrics: {
            current: "Ei tietoa asiakastyytyväisyydestä",
            target: "20-30% parannus asiakastyytyväisyydessä",
            impact: "60% vähennys käsittelyajassa, +12 NPS-pistettä"
          },
          actions: [
            "Langchain-pohjainen chatbot Zendesk-integraatiolla → ymmärtää kontekstin",
            "24/7 palvelu monikielisellä tuella → parannus tyytyväisyydessä 20-30%",
            "Personoidut kokemukset asiakashistorian analyysillä",
            "Ennakoiva palvelu: tunnista ongelmat ennen ilmenemistä"
          ],
          technologies: ["Langchain", "Zendesk API", "Sentence Transformers", "Embedding-tech"],
          risks: ["Asiakasluottamus AI:hin", "Tietosuoja (GDPR)"],
          benchmarks: [
            { company: "Epassi", achievement: "Merkittävä parannus asiakastyytyväisyydessä 24/7 mobiilipalvelun ansiosta" },
            { company: "Accountor", achievement: "25% parannus asiakastyytyväisyydessä AI-palveluilla" }
          ]
        },
        {
          id: "mcp-security",
          name: "MCP-Protokolla & Tietoturva",
          description: "Model Context Protocol turvalliseen AI-integraatioon roolipohjaisen pääsynhallinnan kanssa",
          icon: Shield,
          color: "from-emerald-500/80 to-green-600/80",
          metrics: {
            current: "Perustason AI-integraatiot ilman MCP:tä",
            target: "100% turvallinen AI-datavirta MCP:n kautta",
            impact: "GDPR-compliance + 66% asiakkaista huolissaan tietoturvasta"
          },
          actions: [
            "Ota käyttöön MCP roolipohjaisella pääsynhallinnalla (RBAC)",
            "Eksplisiittinen kontekstin rajaus → AI pääsee vain sallittuun dataan",
            "Audit-jäljet kaikista AI-toiminnoista → läpinäkyvyys ja compliance",
            "Vahva autentikointi + TLS-salaus kaikille MCP-kutsuille"
          ],
          technologies: ["MCP (Model Context Protocol)", "OAuth 2.0", "TLS 1.3", "Audit logging", "RBAC"],
          risks: ["Väärinkonfigurointi voi johtaa datan vuotoon", "Monimutkainen toteutus"],
          benchmarks: [
            { company: "Cerbos", achievement: "Fine-grained access control AI-agenteille MCP:n kanssa" },
            { company: "CyberArk", achievement: "MCP-standardi turvalliseen AI-integrointiin" }
          ]
        },
        {
          id: "data-insights",
          name: "Datalähtöiset Innovaatiot",
          description: "Generatiivinen AI ja RAG-arkkitehtuuri uusien palvelumallien luomiseen",
          icon: Brain,
          color: "from-purple-500/80 to-pink-600/80",
          metrics: {
            current: "Perinteinen konsultointi ilman AI-tukea",
            target: "15-20% lisätuloja uusista AI-palveluista",
            impact: "Uudet markkinaraot embedding-analyysillä"
          },
          actions: [
            "Kehitä RAG-arkkitehtuuri (Retrieval-Augmented Generation) omalle datalle",
            "AI generoi räätälöityjä suosituksia: 'Asiakas X tilanne → 3 toimintavaihtoehtoa'",
            "Analysoi asiakaskäyttäytyminen Sentence Transformers -mallilla",
            "Identifioi uudet markkinaraot embedding-teknologialla"
          ],
          technologies: ["RAG (Retrieval-Augmented Generation)", "Vector DBs", "Embeddings", "Claude Sonnet"],
          risks: ["AI-generoitujen suositusten laatu", "Riippuvuus datan laadusta"],
          benchmarks: [
            { company: "McKinsey", achievement: "AI-investointien ROI 20-35% 2-3 vuodessa PKY-yrityksille" },
            { company: "Gartner", achievement: "CX-tekoäly tuottaa 15-30% hyödyt eri mittareissa" }
          ]
        }
      ]
    },
    {
      id: "phase2",
      quarter: "2025 Q3-Q4",
      title: "Skaalautuvuus & Kasvu",
      revenue: "€2.5M → €3.2M",
      margin: "8% → 12%",
      status: "upcoming",
      kpis: [
        { name: "Liikevaihto", current: 2.5, target: 3.2, unit: "M€", change: "+28%" },
        { name: "Käyttökate", current: 8, target: 12, unit: "%", change: "+4pp" },
        { name: "Asiakastyytyväisyys", current: 80, target: 88, unit: "%", change: "+10%" },
        { name: "Automaatioaste", current: 30, target: 50, unit: "%", change: "+67%" }
      ],
      categories: [
        {
          id: "full-automation",
          name: "Täysi Automaatio",
          description: "Ensitason asiakaspalvelu täysin automatisoitu AI-agenttien toimesta",
          icon: Bot,
          color: "from-violet-500/80 to-purple-600/80",
          metrics: {
            current: "50% yksinkertaisista kyselyistä automatisoidut",
            target: "80% ensitason kyselyistä hoidettu ilman ihmistä",
            impact: "Skaalaa 3x ilman henkilöstölisäystä"
          },
          actions: [
            "Kokonaan automatisoitu Tier-1 asiakaspalvelu agentic AI:lla",
            "Multi-agentti-systeemi: erikoistuneet agentit eri tehtäviin",
            "Seamless eskalaatio ihmiselle vain kompleksisissa tapauksissa",
            "Jatkuva oppiminen: AI paranee jokaisesta vuorovaikutuksesta"
          ],
          technologies: ["Agentic AI", "Multi-agent systems", "Reinforcement learning", "Transfer learning"],
          risks: ["Asiakaskokemus voi kärsiä liian nopeasta automaatiosta", "Henkilöstön motivaatio"],
          benchmarks: [
            { company: "Alibaba", achievement: "Virtuaaliassistentit hoitavat 95% asiakasviesteistä kiinalaisten yritysten kesken" }
          ]
        },
        {
          id: "predictive-analytics",
          name: "Ennakoiva Analytiikka",
          description: "Proaktiivinen ongelmanratkaisu ennen asiakkaan yhteydenottoa",
          icon: BarChart3,
          color: "from-rose-500/80 to-red-600/80",
          metrics: {
            current: "Reaktiivinen asiakaspalvelu",
            target: "40% ongelmista ratkaistu ennakoivasti",
            impact: "CES lasku 2.3 → 1.8 (proaktiivinen palvelu)"
          },
          actions: [
            "Streaming-data-analytiikka (Apache Flink) asiakaskäyttäytymisen seuraamiseen",
            "Trigger automaattiset viestit: 'Asiakas hiljainen 7 päivää → lähetä tarjous'",
            "Tunnista toistuvat ongelmat AI:lla ja ehdota ratkaisuja etukäteen",
            "Ennakoiva resurssiallokointi kysyntäpiikkeihin"
          ],
          technologies: ["Apache Flink", "Time-series analysis", "Anomaly detection", "Predictive models"],
          risks: ["False positives voivat ärsyttää asiakkaita", "Datan laatuvaatimukset korkeat"],
          benchmarks: [
            { company: "Nordea", achievement: "Ennakoiva analytiikka vähensi asiakaspoistumaa 15%" }
          ]
        },
        {
          id: "new-products",
          name: "Uudet AI-Palvelutuotteet",
          description: "Lanseeraa AI-as-a-Service -tuotteita muille yrityksille",
          icon: Rocket,
          color: "from-cyan-500/80 to-blue-600/80",
          metrics: {
            current: "Perinteinen konsultointi",
            target: "€0.7M lisäliikevaihto AI-tuotteista",
            impact: "Uusi tulonlähde, parannettu kate"
          },
          actions: [
            "Lanseeraa 'Humm AI Assistant' SaaS-tuote PK-yrityksille",
            "Kehitä valmis RAG-pohjainen järjestelmä helposti räätälöitäväksi",
            "AI-konsultointipalvelu: auta yrityksiä ottamaan AI käyttöön",
            "Lisenssimalli: recurring revenue vs. projektimyynti"
          ],
          technologies: ["SaaS-arkkitehtuuri", "White-label solutions", "API-first design", "Multi-tenancy"],
          risks: ["Markkinan kylläisyys AI-tuotteissa", "Tuotekehityksen aikataulu"],
          benchmarks: [
            { company: "Loihde", achievement: "AI-konsultointi ja SaaS-tuotteet kasvattivat liikevaihtoa 22%" }
          ]
        },
        {
          id: "personalization",
          name: "Hyperpersonointi",
          description: "Jokainen asiakaskohtaaminen räätälöity yksilöllisesti",
          icon: Star,
          color: "from-amber-500/80 to-yellow-600/80",
          metrics: {
            current: "Segmenttipohjainen palvelu",
            target: "100% yksilöllisesti personoidut kohtaamiset",
            impact: "NPS +68 → +82 (World-class)"
          },
          actions: [
            "Real-time customer segmentation streaming-datalla",
            "AI analysoi asiakkaan historian, preferenssit, kontekstin",
            "Dynaaminen sisällön generointi jokaiselle asiakkaalle",
            "Monikielinen, kulttuuriin sopiva viestintä automaattisesti"
          ],
          technologies: ["Real-time segmentation", "Dynamic content generation", "NLP", "Translation AI"],
          risks: ["Privacy concerns", "Liian personoitu voi tuntua tungettelevalta"],
          benchmarks: [
            { company: "Amazon", achievement: "35% liikevaihdosta personoiduista suosituksista" }
          ]
        }
      ]
    },
    {
      id: "phase3",
      quarter: "2026-2027",
      title: "Markkinajohtajuus",
      revenue: "€3.2M → €7.2M",
      margin: "12% → 28%",
      status: "upcoming",
      kpis: [
        { name: "Liikevaihto", current: 3.2, target: 7.2, unit: "M€", change: "+125%" },
        { name: "Käyttökate", current: 12, target: 28, unit: "%", change: "+16pp" },
        { name: "Markkinaosuus", current: 2, target: 8, unit: "%", change: "+300%" },
        { name: "AI-automation", current: 50, target: 85, unit: "%", change: "+70%" }
      ],
      categories: [
        {
          id: "own-models",
          name: "Omat AI-Mallit",
          description: "Kehitä proprietäärejä AI-malleja kilpailueduksi",
          icon: Cpu,
          color: "from-indigo-500/80 to-blue-600/80",
          metrics: {
            current: "Kolmannen osapuolen AI-mallit (OpenAI, Anthropic)",
            target: "Omat fine-tuned mallit CX-domainille",
            impact: "50% alhaisemmat AI-kustannukset, parempi laatu"
          },
          actions: [
            "Fine-tune LLaMA 3 / Mistral omalle CX-datalle",
            "Kehitä domain-specific embeddings asiakaspalveluun",
            "On-premise deployment kriittisille asiakkaille",
            "Continuous learning pipeline: mallit parantuvat automaattisesti"
          ],
          technologies: ["LLaMA 3", "Mistral", "LoRA fine-tuning", "Vector embeddings", "MLOps"],
          risks: ["Korkeat kehityskustannukset", "Tarvitaan huippuosaamista"],
          benchmarks: [
            { company: "Hugging Face", achievement: "Open-source mallit demokratisoivat AI:n PKY-yrityksille" }
          ]
        },
        {
          id: "international",
          name: "Kansainvälinen Laajentuminen",
          description: "Skaalaa AI-palvelut Pohjoismaihin ja Baltian maihin",
          icon: Globe,
          color: "from-teal-500/80 to-emerald-600/80",
          metrics: {
            current: "Vain Suomi",
            target: "5 maata: FI, SE, NO, DK, EE",
            impact: "5x markkinapotentiaali, €4M+ lisämyynti"
          },
          actions: [
            "Monikielinen AI (Ruotsi, Norja, Tanska, Viro)",
            "Lokalisointi kulttuureihin: AI ymmärtää paikallisia erityispiirteitä",
            "Kumppanuudet: integraatiot paikallisten CRM/ERP-järjestelmien kanssa",
            "Compliance: GDPR + paikalliset tietosuojasäännöt"
          ],
          technologies: ["Multilingual NLP", "Localization APIs", "Regional cloud (EU)", "Compliance automation"],
          risks: ["Kulttuurierot", "Regulaatiot vaihtelevat maittain"],
          benchmarks: [
            { company: "Epassi", achievement: "Laajentui 150M€ liikevaihtoon digitaalisten palveluiden avulla" }
          ]
        },
        {
          id: "ecosystem",
          name: "AI-Ekosysteemi",
          description: "Rakenna avoin ekosysteemi kumppaneille ja kehittäjille",
          icon: Network,
          color: "from-fuchsia-500/80 to-purple-600/80",
          metrics: {
            current: "Suljettu järjestelmä",
            target: "50+ kumppania ekosysteemissä",
            impact: "Network effect, ecosystem ARR €2M+"
          },
          actions: [
            "Avaa API:t kolmansille osapuolille (API-first approach)",
            "Marketplace: kumppanit voivat rakentaa AI-plugin-sovelluksia",
            "Developer program: ilmainen tier + maksullinen enterprise",
            "Co-innovation lab: yhteiskehitys suurten asiakkaiden kanssa"
          ],
          technologies: ["API gateway", "GraphQL", "Webhooks", "OAuth 2.0", "Developer portal"],
          risks: ["Quality control kumppanisovellusten osalta", "Kannibalisointi omia tuotteita"],
          benchmarks: [
            { company: "Salesforce AppExchange", achievement: "7000+ kumppanisovellusta, miljardibisnes" }
          ]
        },
        {
          id: "thought-leadership",
          name: "Ajatusjohtajuus",
          description: "Asemoidu CX AI:n edelläkävijäksi Pohjoismaissa",
          icon: Award,
          color: "from-orange-500/80 to-amber-600/80",
          metrics: {
            current: "Tuntematon brändi AI-kentällä",
            target: "Top 3 CX AI -ajatusjohtaja Pohjoismaissa",
            impact: "Inbound leads +200%, premium pricing"
          },
          actions: [
            "Julkaise whitepapers, case studies, tutkimuksia",
            "Speaking engagements konferensseissa (Web Summit, Slush)",
            "LinkedIn-läsnäolo: CTO/Tech Lead jakaa insights viikoittain",
            "Open-source contributiot: rakenna mainetta kehittäjäyhteisössä"
          ],
          technologies: ["Content marketing", "Social media", "Community building", "PR"],
          risks: ["Kilpailijoiden vastareaktio", "Resurssit sisällöntuotantoon"],
          benchmarks: [
            { company: "HubSpot", achievement: "Inbound marketing -ajatusjohtajuudesta SaaS-jätti" }
          ]
        }
      ]
    },
    {
      id: "phase4",
      quarter: "2028+",
      title: "AI-Natiivi Yritys",
      revenue: "€7.2M → €10M+",
      margin: "28% → 32%+",
      status: "upcoming",
      kpis: [
        { name: "Liikevaihto", current: 7.2, target: 10, unit: "M€", change: "+39%" },
        { name: "Käyttökate", current: 28, target: 32, unit: "%", change: "+4pp" },
        { name: "AI-automaatio", current: 85, target: 95, unit: "%", change: "+12%" },
        { name: "ARR", current: 8, target: 9, unit: "M€", change: "+13%" }
      ],
      categories: [
        {
          id: "autonomous-ai",
          name: "Autonomiset AI-Agentit",
          description: "Täysin itsenäiset AI-agentit hoitavat liiketoimintaprosesseja end-to-end",
          icon: Bot,
          color: "from-pink-500/80 to-rose-600/80",
          metrics: {
            current: "85% automaatio",
            target: "95% prosesseista täysin autonomisia",
            impact: "Marginaali 32%+, skaalautuvuus rajaton"
          },
          actions: [
            "Self-improving AI: agentit oppivat ja optimoivat itseään",
            "Multi-modal AI: teksti, kuva, ääni, video yhtenäisesti",
            "Autonomous decision-making rajatuissa konteksteissa",
            "Human-in-the-loop vain kriittisissä päätöksissä"
          ],
          technologies: ["AGI-prototypes", "Multi-modal transformers", "Reinforcement learning", "Autonomous agents"],
          risks: ["Eettiset kysymykset", "Regulation (EU AI Act)"],
          benchmarks: [
            { company: "OpenAI", achievement: "GPT-5 odotetaan lähestyvän AGI-tason kyvykkyyksiä" }
          ]
        },
        {
          id: "ai-native-culture",
          name: "AI-Natiivi Kulttuuri",
          description: "Koko organisaatio rakennettu AI-ensisijaiseksi",
          icon: Brain,
          color: "from-violet-500/80 to-indigo-600/80",
          metrics: {
            current: "AI-avusteinen työkulttuuri",
            target: "AI-native: jokainen prosessi AI-optimoitu",
            impact: "Revenue per employee €192k (vs. €40k nykytila)"
          },
          actions: [
            "Jokainen työntekijä = AI-superintendentti: 10x tuottavuus",
            "AI co-founder: strategiset päätökset AI-avusteisia",
            "Continuous learning: AI kouluttaa henkilöstöä reaaliaikaisesti",
            "Remote-first + AI-tools: globaali talent pool"
          ],
          technologies: ["AI assistants", "Copilot integrations", "Knowledge graphs", "Adaptive learning"],
          risks: ["Riippuvuus AI:sta", "Henkilöstön roolin muutos"],
          benchmarks: [
            { company: "GitHub Copilot", achievement: "55% koodista AI-generoitua, developers 2x tuottavampia" }
          ]
        },
        {
          id: "quantum-ready",
          name: "Kvanttivalmiudet",
          description: "Varaudu kvanttitietokoneiden aikakauteen",
          icon: Zap,
          color: "from-sky-500/80 to-blue-600/80",
          metrics: {
            current: "Klassiset algoritmit",
            target: "Quantum-ready infra ja algoritmit",
            impact: "1000x nopeutus kompleksisissa optimoinneissa"
          },
          actions: [
            "Kvanttiresistentit salausmenetelmät (post-quantum cryptography)",
            "Hybrid quantum-classical algoritmit optimointiin",
            "Kumppanuudet: IBM Quantum, AWS Braket",
            "Koulutus: quantum computing osa tech-osaamista"
          ],
          technologies: ["Quantum algorithms", "Post-quantum crypto", "Hybrid quantum-classical", "Qiskit"],
          risks: ["Teknologia vielä varhainen", "Korkeat kustannukset"],
          benchmarks: [
            { company: "IBM", achievement: "Quantum computers ratkaisevat tiettyjä ongelmia eksponentiaalisesti nopeammin" }
          ]
        },
        {
          id: "sustainability",
          name: "Kestävä AI",
          description: "Ympäristöystävällinen AI-infra ja carbon-neutral toiminta",
          icon: Globe,
          color: "from-green-500/80 to-emerald-600/80",
          metrics: {
            current: "Perinteinen cloud-infra",
            target: "Carbon-neutral AI, 100% renewable energy",
            impact: "ESG-pisteet korkealle, houkuttelee green investors"
          },
          actions: [
            "Green AI: optimoi mallit energiatehokkuuteen",
            "Carbon-neutral data centers (Iceland, Norway)",
            "Efficient inference: pruning, quantization, distillation",
            "Transparency: raportoi AI:n hiilijalanjälki"
          ],
          technologies: ["Model compression", "Green cloud", "Energy monitoring", "Carbon offsetting"],
          risks: ["Viherpesun syytökset", "Kustannukset lyhyellä tähtäimellä"],
          benchmarks: [
            { company: "Google", achievement: "Carbon-neutral since 2007, AI-models optimized for sustainability" }
          ]
        }
      ]
    }
  ];

  // Initialize phases state from data
  useEffect(() => {
    if (phases.length === 0) {
      setPhases(phasesData);
    }
  }, []);

  const statusConfig = {
    completed: {
      color: "border-green-500/50 bg-green-500/5",
      badge: "bg-green-500/10 text-green-400 border-green-500/30"
    },
    "in-progress": {
      color: "border-blue-500/50 bg-blue-500/5",
      badge: "bg-blue-500/10 text-blue-400 border-blue-500/30"
    },
    upcoming: {
      color: "border-slate-600/50 bg-slate-800/20",
      badge: "bg-slate-600/10 text-slate-400 border-slate-600/30"
    }
  };

  const statusLabels = {
    completed: "Valmis",
    "in-progress": "Käynnissä",
    upcoming: "Tulossa"
  };

  // Handle drag end for reordering categories
  const handleDragEnd = (event: DragEndEvent, phaseId: string) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPhases((prevPhases) => {
        return prevPhases.map((phase) => {
          if (phase.id === phaseId) {
            const oldIndex = phase.categories.findIndex((c) => c.id === active.id);
            const newIndex = phase.categories.findIndex((c) => c.id === over.id);
            return {
              ...phase,
              categories: arrayMove(phase.categories, oldIndex, newIndex),
            };
          }
          return phase;
        });
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header - Minimalistic with Edit Button */}
      <div className="text-center space-y-3 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1" />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-slate-300">Strategic Roadmap</span>
          </div>
          <div className="flex-1 flex flex-col items-end gap-2">
            <Button
              onClick={() => setIsEditMode(!isEditMode)}
              size="sm"
              variant={isEditMode ? "default" : "outline"}
              className={isEditMode ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              {isEditMode ? "💾 Tallenna" : "✏️ Muokkaa"}
            </Button>
            
            <Button
              onClick={() => setSecretModalOpen(true)}
              size="sm"
              variant="outline"
              className="group relative overflow-hidden border-purple-500/40 hover:border-purple-400/60 bg-purple-900/10 hover:bg-purple-900/20 text-purple-300 hover:text-purple-200 transition-all duration-200"
              data-testid="secret-ace-button"
            >
              <Star className="w-3 h-3 mr-1.5" />
              Vielä yksi ässä hihassa
            </Button>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-slate-100">
          Humm Group: AI Transformation
        </h1>
        <p className="text-slate-400 text-sm">
          €2.1M → €10M+ | -0.2% → 32% margin | 2025-2028+
        </p>
      </div>

      {/* Roadmap Timeline - Map-like */}
      <div className="relative space-y-6">
        {/* Connection Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-slate-600/30" />

        {phases.map((phase, idx) => {
          const isExpanded = expandedPhase === phase.id;
          const config = statusConfig[phase.status];

          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative"
            >
              {/* Phase Dot on Timeline */}
              <div className="absolute left-8 top-6 w-3 h-3 rounded-full bg-slate-800 border-2 border-blue-400 -translate-x-1/2 z-10" />

              {/* Phase Card */}
              <div className={`ml-16 border rounded-lg ${config.color} backdrop-blur-sm transition-all duration-300`}>
                {/* Phase Header - Clickable */}
                <button
                  onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors rounded-t-lg"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant="outline" className={config.badge}>
                        {phase.quarter}
                      </Badge>
                      <Badge variant="outline" className={config.badge}>
                        {statusLabels[phase.status]}
                      </Badge>
                    </div>
                    <h2 className="text-xl font-semibold text-slate-100">{phase.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Euro className="w-4 h-4" />
                        {phase.revenue}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {phase.margin}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Expandable Content */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-slate-700/50"
                  >
                    {/* KPIs - Compact */}
                    <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                      {phase.kpis.map((kpi) => (
                        <div key={kpi.name} className="text-center space-y-1">
                          <p className="text-xs text-slate-500">{kpi.name}</p>
                          <div className="text-lg font-bold text-slate-200">
                            {kpi.target}{kpi.unit}
                          </div>
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/30 text-xs">
                            {kpi.change}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    {/* Categories - Drag and Drop Grid */}
                    <div className="p-4 pt-0">
                      {isEditMode && (
                        <div className="mb-3 p-2 rounded bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300 flex items-center gap-2">
                          <GripVertical className="w-3 h-3" />
                          Muokkaa järjestystä raahaamalla GripVertical-kuvakkeesta
                        </div>
                      )}
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={(event: DragEndEvent) => handleDragEnd(event, phase.id)}
                      >
                        <SortableContext
                          items={phase.categories.map(c => c.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="grid md:grid-cols-2 gap-3">
                            {phase.categories.map((category) => {
                              const Icon = category.icon;
                              return (
                                <Dialog key={category.id}>
                                  <DialogTrigger asChild>
                                    {isEditMode ? (
                                      <div>
                                        <SortableCategory
                                          category={category}
                                          onClick={() => {}}
                                        />
                                      </div>
                                    ) : (
                                      <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="group relative p-4 rounded-lg bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 transition-all text-left overflow-hidden"
                                      >
                                        {/* Subtle gradient background */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                                        <div className="relative flex items-start gap-3">
                                          <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color}`}>
                                            <Icon className="w-4 h-4 text-white" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-slate-200 text-sm mb-1 line-clamp-1">
                                              {category.name}
                                            </h3>
                                            <p className="text-xs text-slate-400 line-clamp-2">
                                              {category.description}
                                            </p>
                                          </div>
                                          <Info className="w-4 h-4 text-slate-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                      </motion.button>
                                    )}
                                  </DialogTrigger>

                            {/* Category Modal - Same as before */}
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
                              <DialogHeader>
                                <div className="flex items-center gap-4">
                                  <div className={`p-4 rounded-xl bg-gradient-to-br ${category.color}`}>
                                    <Icon className="w-8 h-8 text-white" />
                                  </div>
                                  <div>
                                    <DialogTitle className="text-2xl text-slate-100">{category.name}</DialogTitle>
                                    <DialogDescription className="text-base mt-1 text-slate-400">
                                      {category.description}
                                    </DialogDescription>
                                  </div>
                                </div>
                              </DialogHeader>

                              <Tabs defaultValue="overview" className="mt-6">
                                <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
                                  <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">Overview</TabsTrigger>
                                  <TabsTrigger value="actions" className="data-[state=active]:bg-slate-700">Actions</TabsTrigger>
                                  <TabsTrigger value="tech" className="data-[state=active]:bg-slate-700">Tech</TabsTrigger>
                                  <TabsTrigger value="benchmarks" className="data-[state=active]:bg-slate-700">Benchmarks</TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="space-y-6 mt-6">
                                  <div className="space-y-4">
                                    <h4 className="font-semibold text-lg flex items-center gap-2 text-slate-200">
                                      <BarChart3 className="w-5 h-5 text-blue-400" />
                                      Key Metrics & Impact
                                    </h4>
                                    <div className="grid gap-4">
                                      <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                                        <p className="text-sm font-medium text-blue-400">Current State</p>
                                        <p className="text-slate-300 mt-1">{category.metrics.current}</p>
                                      </div>
                                      <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                                        <p className="text-sm font-medium text-green-400">Target</p>
                                        <p className="text-slate-300 mt-1">{category.metrics.target}</p>
                                      </div>
                                      <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                                        <p className="text-sm font-medium text-purple-400">Expected Impact</p>
                                        <p className="text-slate-300 mt-1">{category.metrics.impact}</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-3">
                                    <h4 className="font-semibold text-lg flex items-center gap-2 text-slate-200">
                                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                                      Risks & Mitigation
                                    </h4>
                                    <div className="space-y-2">
                                      {category.risks.map((risk, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                                          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                          <p className="text-sm text-slate-300">{risk}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="actions" className="space-y-4 mt-6">
                                  <h4 className="font-semibold text-lg flex items-center gap-2 text-slate-200">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    Concrete Actions
                                  </h4>
                                  <div className="space-y-3">
                                    {category.actions.map((action, i) => (
                                      <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                          {i + 1}
                                        </div>
                                        <p className="text-slate-300 text-sm">{action}</p>
                                      </div>
                                    ))}
                                  </div>
                                </TabsContent>

                                <TabsContent value="tech" className="space-y-4 mt-6">
                                  <h4 className="font-semibold text-lg flex items-center gap-2 text-slate-200">
                                    <Cpu className="w-5 h-5 text-purple-400" />
                                    Technologies & Tools
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {category.technologies.map((tech, i) => (
                                      <Badge key={i} className={`bg-gradient-to-r ${category.color} text-white text-sm py-2 px-4 border-0`}>
                                        {tech}
                                      </Badge>
                                    ))}
                                  </div>
                                </TabsContent>

                                <TabsContent value="benchmarks" className="space-y-4 mt-6">
                                  <h4 className="font-semibold text-lg flex items-center gap-2 text-slate-200">
                                    <Award className="w-5 h-5 text-amber-400" />
                                    Industry Benchmarks
                                  </h4>
                                  <div className="space-y-3">
                                    {category.benchmarks.map((benchmark, i) => (
                                      <div key={i} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                                        <div className="flex items-center gap-2 mb-2">
                                          <Award className="w-4 h-4 text-amber-400" />
                                          <span className="font-semibold text-slate-200">{benchmark.company}</span>
                                        </div>
                                        <p className="text-sm text-slate-400">{benchmark.achievement}</p>
                                      </div>
                                    ))}
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </DialogContent>
                          </Dialog>
                                );
                              })}
                            </div>
                          </SortableContext>
                        </DndContext>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer - Compact */}
        <div className="mt-8 p-6 rounded-lg bg-slate-800/30 border border-slate-700/50">
        <div className="grid md:grid-cols-4 gap-4 text-center">
          <div className="space-y-1">
            <Euro className="w-5 h-5 mx-auto text-green-400" />
            <div className="text-xl font-bold text-slate-200">€2.1M → €10M+</div>
            <p className="text-xs text-slate-500">376% kasvu</p>
          </div>
          <div className="space-y-1">
            <TrendingUp className="w-5 h-5 mx-auto text-blue-400" />
            <div className="text-xl font-bold text-slate-200">-0.2% → 32%</div>
            <p className="text-xs text-slate-500">Käyttökate</p>
          </div>
          <div className="space-y-1">
            <Users className="w-5 h-5 mx-auto text-purple-400" />
            <div className="text-xl font-bold text-slate-200">€192k</div>
            <p className="text-xs text-slate-500">Per employee</p>
          </div>
          <div className="space-y-1">
            <Bot className="w-5 h-5 mx-auto text-cyan-400" />
            <div className="text-xl font-bold text-slate-200">95%</div>
            <p className="text-xs text-slate-500">AI-automaatio</p>
          </div>
        </div>
        <p className="text-center text-xs text-slate-500 mt-4 pt-4 border-t border-slate-700/50">
          Data: McKinsey, Gartner, Deloitte, Cerbos, CyberArk + Finnish benchmarks
        </p>
      </div>

      {/* First 30 Days Action Plan - Open Source Focus */}
      <div className="mt-8 p-8 rounded-lg bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-blue-500/20">
            <Rocket className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Ensimmäiset 30 Päivää - Quick Wins</h2>
            <p className="text-slate-400 text-sm mt-1">Open source -ratkaisut, nolla lisähenkilöstötarve</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Week 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">Viikko 1</Badge>
              <span className="text-xs text-slate-500">Päivät 1-7</span>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Tech Stack Audit</p>
                    <p className="text-xs text-slate-400 mt-1">Kartoita nykyiset järjestelmät, API:t ja integraatiot</p>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">n8n Setup (1 päivä)</p>
                    <p className="text-xs text-slate-400 mt-1">Asenna n8n low-code automaatioalusta - ilmainen, self-hosted</p>
                    <div className="flex gap-1 mt-2">
                      <Badge className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Open Source</Badge>
                      <Badge className="text-xs bg-purple-500/10 text-purple-400 border-purple-500/30">€0</Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Quick Win #1: CRM Auto-sync</p>
                    <p className="text-xs text-slate-400 mt-1">n8n workflow: Zendesk → CRM (2h käsityö → 5min automaatio)</p>
                    <p className="text-xs text-green-400 mt-1">💰 Säästö: 10h/viikko</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Week 2-3 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30">Viikot 2-3</Badge>
              <span className="text-xs text-slate-500">Päivät 8-21</span>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Langchain + Open LLM</p>
                    <p className="text-xs text-slate-400 mt-1">Mistral 7B (ilmainen) + RAG lokaaliin dataan</p>
                    <div className="flex gap-1 mt-2">
                      <Badge className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Open Source</Badge>
                      <Badge className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">Self-hosted</Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-start gap-2">
                  <Bot className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Chatbot MVP (n8n + Mistral)</p>
                    <p className="text-xs text-slate-400 mt-1">Ensimmäinen AI-assistentti FAQ:lle - 50% kyselyistä hoidettu</p>
                    <p className="text-xs text-green-400 mt-1">💰 Säästö: 15h/viikko</p>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">MCP Proof-of-Concept</p>
                    <p className="text-xs text-slate-400 mt-1">Turvallinen AI-datavirta RBAC:lla (Cerbos OSS)</p>
                    <div className="flex gap-1 mt-2">
                      <Badge className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Open Source</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Week 4 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30">Viikko 4</Badge>
              <span className="text-xs text-slate-500">Päivät 22-30</span>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-start gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Mittarit & Dashboard</p>
                    <p className="text-xs text-slate-400 mt-1">Grafana (OSS) + InfluxDB: reaaliaikainen seuranta</p>
                    <div className="flex gap-1 mt-2">
                      <Badge className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Open Source</Badge>
                      <Badge className="text-xs bg-purple-500/10 text-purple-400 border-purple-500/30">€0</Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Tiimin Koulutus</p>
                    <p className="text-xs text-slate-400 mt-1">n8n workshop: jokainen voi rakentaa workflowja</p>
                    <p className="text-xs text-amber-400 mt-1">🎯 Tavoite: Demokraattinen automaatio</p>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Johdon Raportti</p>
                    <p className="text-xs text-slate-400 mt-1">30 päivän tulokset: säästöt, KPI:t, seuraavat askeleet</p>
                    <p className="text-xs text-green-400 mt-1">📊 KPI: 25h/viikko säästetty, €0 lisäkustannus</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Summary */}
        <div className="mt-8 p-6 rounded-lg bg-slate-800/30 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Open Source Tech Stack (30 päivää)
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Automaatio</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">n8n</Badge>
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">Temporal</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider">AI/LLM</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30">Mistral 7B</Badge>
                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30">Langchain</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Security</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Cerbos</Badge>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Keycloak</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Monitoring</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30">Grafana</Badge>
                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30">InfluxDB</Badge>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
            <div className="text-sm text-slate-400">
              💡 <span className="font-semibold text-slate-300">Kustannustehokas strategia:</span> Open source + low-code = nopea toteutus pienellä tiimillä
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-green-400">€0</p>
              <p className="text-xs text-slate-500">Lisenssikulut</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secret Ace Modal */}
      <Dialog open={secretModalOpen} onOpenChange={setSecretModalOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] bg-gradient-to-br from-slate-800/98 to-slate-900/98 backdrop-blur-xl border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-white" />
              </div>
              Vielä yksi ässä hihassa
            </DialogTitle>
            <DialogDescription className="text-slate-300 text-base">
              Konkreettinen ROI-analyysi ja strateginen visio 10M€ liikevaihtoon
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[65vh] pr-4">
            <div className="prose prose-invert prose-lg max-w-none">
              <div className="text-slate-200 space-y-4 leading-relaxed whitespace-pre-wrap font-sans">
                {streamedText}
                {streamedText.length < secretContent.length && (
                  <span className="inline-block w-2 h-5 bg-purple-500 animate-pulse ml-1" />
                )}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StrategicRoadmap;