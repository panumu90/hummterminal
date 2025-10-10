import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, Target, CheckCircle2, AlertCircle, Info, AlertTriangle,
  Star, Lightbulb, Rocket, Users, Brain, MessageSquare, Sparkles,
  Calendar, DollarSign, TrendingDown, Zap, Shield
} from 'lucide-react';
import { motion } from "framer-motion";
import { useState } from "react";
import { StrategyChat } from "./StrategyChat";

// Roadmap data structure with extensive narrative fields
const roadmapData = [
  {
    phase: "Nykytilan Brutaali Analyysi",
    timeline: "Nyt",
    category: "Perustila",
    kpis: [
      "Liikevaihto: 2,13 milj. € (-7,7%)",
      "Liikevoitto: -0,2% (-4 870 €)",
      "52 työntekijää",
      "40 385 € per työntekijä"
    ],
    strategicInsight: "Humm Group Oy balanseeroi kannattavuuden rajalla. Liikevaihto laskee, liikevoitto on tappiollinen ja tuottavuus per työntekijä on 27-54% alle optimaalisen tason. Vertailuyritykset kasvavat kaksinumeroisesti ja tekevät terveellisiä tuloksia. Syy ei ole laadun puute vaan rakenteellinen: perinteinen työvoimaintensiivinen malli ei skaalaudu kannattavasti ilman radikaalisti parempaa tuottavuutta.",
    narrativeJustification: "Kilpailijat jotka ovat ottaneet tekoälyn käyttöön näkevät 15-25% tehokkuushyödyt ja voivat tarjota parempaa palvelua samalla tai pienemmällä hinnalla. Liiketoimintamalli on yksiraiteinen: olemme riippuvaisia asiakaspalvelun ulkoistamisesta eikä meillä ole merkittäviä uusia tulonlähteitä. Ilman merkittävää strategista muutosta, parhaan skenaarion mukaan säilymme paikallaan, pahimmassa tapauksessa menetämme asiakkaita kilpailijoille.",
    executiveRecommendation: "Toimintamme on kiireellistä. Meillä on vahva tase ja osaava henkilöstö, mikä antaa mahdollisuuden investoida tulevaisuuteen. AI-transformaatio ei ole vaihtoehto vaan välttämättömyys. Ikkuna toimia on auki, mutta sulkeutuu nopeasti kun kilpailijat ottavat etumatkaa teknologiassa.",
    marketSignals: "Westernacher Consulting Oy kasvaa 192% ja tekee 9,3% liikettulosta. Rakennustieto Oy kasvaa 5,2% tuloksella 7,9%. UiPath:n tutkimus paljastaa että 77% IT-johtajista on valmiita investoimaan agentic AI:hin vuonna 2025.",
    color: "red"
  },
  {
    phase: "30 Ensimmäistä Päivää",
    timeline: "Kk 1",
    category: "Nopeat Voitot",
    kpis: [
      "Ensimmäinen toimiva prototyyppi",
      "50% yksinkertaisista kyselyistä automatisoidaan",
      "Claude Code -kehitysympäristö käytössä",
      "MCP-arkkitehtuuri pystytetty"
    ],
    strategicInsight: "Sen sijaan että aloittaisimme massiivisella suunnitteluvaiheella, aloitamme nopeilla kokeiluilla jotka tuottavat mitattavaa arvoa viikkojen sisällä. Ensimmäinen viikko on intensiivistä uppoutumista: istutaan asiakaspalvelijoiden vieressä, analysoidaan satoja tikettejä, tunnistetaan toistuvat mallit ja kartoitetaan kaikki järjestelmät. Viikon lopussa meillä on lista vähintään 10 automatisoitavasta tehtävästä.",
    narrativeJustification: "Viikolla kaksi rakennetaan ensimmäinen prototyyppi: yksinkertainen MCP-palvelin joka yhdistää tikettijärjestelmään ja sähköpostiin, Claude Sonnet -pohjainen agentti joka lukee tiketit, etsii ratkaisut tietopohjasta ja generoi vastauksia. Tämä rakentuu Claude Coden avulla 2-3 päivässä ilman kokonaista kehitystiimiä. Viikolla kolme testataan prototyyppiä rajatussa ympäristössä todellisilla tiketeillä, kerätään palautetta ja iteroidaan.",
    executiveRecommendation: "Viikon neljä on lanseeraus: otetaan järjestelmä käyttöön valikoiduille asiakaspalvelijoille, kerätään tarkka data säästyneestä ajasta, parantuneista vastausajoista ja asiakastyytyväisyydestä. Ensimmäinen raportti johdolle sisältää kovaa dataa, ei PowerPoint-showta: X tikettejä käsitelty, Y tuntia säästetty, Z% parannus vastausajoissa, euromääräinen hyöty.",
    marketSignals: "Jensen Huang (Nvidia) julisti CES 2025:ssä että AI-agentit edustavat monen biljoonan dollarin mahdollisuutta. McKinsey vahvistaa että vaikka vain 1% yrityksistä on saavuttanut täyden AI-kypsyyden, nämä edelläkävijät kokevat transformatiivisia hyötyjä.",
    color: "orange"
  },
  {
    phase: "Kuukaudet 2-6",
    timeline: "Kk 2-6",
    category: "Skaalaus",
    kpis: [
      "40% yksinkertaisista kyselyistä automatisoidaan",
      "15h/henkilö/viikko säästetty (700h/kk yhteensä)",
      "5-8 maksavaa AI-palveluasiakasta",
      "2,5 milj. € liikevaihto",
      "Liiketulos kääntyy positiiviseksi 2-3%"
    ],
    strategicInsight: "Ensimmäisen 30 päivän nopeat voitot ovat todistaneet että agentic AI toimii. Nyt skaala amme menestyksen koko organisaatioon ja käynnistämme uuden AI-palveluliiketoiminnan. Toisessa kuukaudessa jokainen asiakaspalvelija saa oman agentin joka toimii henkilökohtaisena assistenttina, oppii kunkin työntekijän tyyliin ja preferensseihin. Rakennamme myös proaktiivisen viestintäagentin joka tunnistaa milloin asiakas on ollut pitkään hiljainen tai vuorovaikutus oli negatiivinen.",
    narrativeJustification: "Kolmannessa kuukaudessa lanseeraamme uuden AI-palveluliiketoiminnan: kolme pakettituotetta pienyrityksille. Starter-paketti (500€/kk) on yksinkertainen chatbot, Professional-paketti (1200€/kk) lisää tikettijärjestelmäintegraation, Enterprise-paketti (2500€/kk) sisältää täyden agenttiorkestraation. Allokoimme kaksi ihmistä operatiivisesta asiakaspalvelusta myyntiin - he tuntevat asiakaspalvelun kipupisteet syvällisesti ja voivat autenttiisesti kertoa miten AI ratkaisee ongelmia.",
    executiveRecommendation: "Kuukausina 4-6 rakennaamme lisäagentteja: data- ja raportointiagentti analysoi asiakaskohtaamisia ja generoi viikottaiset raportit, myyntiagentti tunnistaa parhaat liidit ja priorisoi myyjien toimet, laatuagentti kuuntelee puhelut ja antaa reaaliaikaista palautetta. Kuudennen kuukauden lopussa teemme laajan arvioinnin: operatiivinen tehokkuus, asiakastyytyväisyys, taloudellinen vaikutus, uuden liiketoiminnan tila.",
    marketSignals: "Suomen IT-ulkoistus kasvaa 2,6 mrd €:oon vuoteen 2025 (4,2% CAGR). AI-mahdollistetut palvelut kasvavat 27,9% vuosittain Suomessa. Euroopan CX-ulkoistus kasvaa 82 mrd €:oon vuoteen 2033 (13,1% CAGR).",
    color: "yellow"
  },
  {
    phase: "Vuosi 2",
    timeline: "Vuosi 2",
    category: "Pohjoismainen Laajentuminen",
    kpis: [
      "4,5 milj. € liikevaihto (2,5M perus + 1,2M AI-palvelu + 0,8M Pohjoismaat)",
      "Liiketulos 5-6%",
      "58 työntekijää (vain +6 mutta 120% kasvu kapasiteetissa)",
      "40-50 AI-palveluasiakasta",
      "Ruotsi ja Norja operatiivisina"
    ],
    strategicInsight: "Olemme todistaneet että strategia toimii. Nyt on aika kahteen suurempaan liikkeeseen: laajentuminen Ruotsiin ja Norjaan sekä automaation syventäminen lähes täyteen skaalautuvuuteen. Tämä ei ole perinteinen kansainvälistyminen jossa avataan toimistoja - hyödynnämme täysimääräisesti agentteja jotka toimivat ruotsiksi ja norjaksi. LLaMA 4 Maverick ja Claude 4 Sonnet ovat molemmat monikielisiä ja toimivat erinomaisesti Pohjoismaisten kielten kanssa.",
    narrativeJustification: "Ensimmäisellä kvartaalilla käynnistämme Ruotsin operaatiot: ruotsinkieliset chatbotit ja asiakaspalveluagentit toimivat 24/7 täysin autonomisesti 90% tapauksista. Vain monimutkaisimmat eskaloituvat ihmisille. Myynti keskittyy aluksi suomalaisiin yrityksiin joilla on Ruotsin operaatioita. Toisella kvartaalilla rakennamme agenttien välistä orkestrointia: asiakaspalveluagentti konsultoi teknistä asiantuntija-agenttia, myyntiagentti tarkistaa avoimet tarjoukset, kaikki tapahtuu sekunteissa.",
    executiveRecommendation: "Kolmannella kvartaalilla lanseeraamme Norjan markkinoille. Norja on houkutteleva koska vahva palvelukulttuuri ja yritykset ovat valmiita maksamaan laadusta. Investoimme yhden norjalaisen myyntiyhteyshenkilön joka avaa ovia. Neljännellä kvartaalilla maksimoimme skaalautuvuuden: rakennamme täysin automatisoidun onboarding-prosessin uusille asiakkaille. Agentti tekee koko asennuksen 24 tunnissa, ihmisen tarvitsee vain tarkistaa laatu.",
    marketSignals: "Klarna saavutti 73% kasvu liikevaihto/työntekijä -mittarissa AI-investointien ansiosta. Vodafone saavutti 70% automaatioasteen asiakaspalvelussa. Pohjoismainen BPO-markkina kasvaa 15,2 mrd €:oon vuoteen 2029 (3,9% CAGR).",
    color: "blue"
  },
  {
    phase: "Vuosi 3",
    timeline: "Vuosi 3",
    category: "Transformaation Kiihdytys",
    kpis: [
      "7,0 milj. € liikevaihto",
      "Liiketulos 7-8% (noin 500 000 €)",
      "72 työntekijää",
      "60% automaatioaste",
      "10 agenttia → tuottaviin rooleihin",
      "Liikevaihto/työntekijä: 97 222 €"
    ],
    strategicInsight: "Kolmannen vuoden aikana keskitymme kolmeen asiaan: viemme automaation vielä syvemmälle rakentaen agentteja jotka hoitavat kokonaisia prosesseja alusta loppuun (onboardaus, off-boarding, laskutus, reklamaatiot), laajennamme AI-palveluliiketoimintaa uusille asiakassegmenteille (keskisuuret yritykset joiden tarpeet ovat monimutkaisemmat mutta maksavat enemmän), ja laajennamme Tanskaan täydentäen Pohjoismaisen läsnäolon.",
    narrativeJustification: "Olemme oppineet mitä toimii pienyritysten kanssa ja voimme nyt skaalata oppeja. Automaatio ei enää ole yksittäisiä tehtäviä vaan kokonaisia työnkulkuja: asiakas lähettää kysymyksen → agentti analysoi → hakee tietoa useista järjestelmistä → konsultoi muita agentteja → muotoilee ratkaisun → tarjoaa lisämyyntiä → esittää valmiin paketin ihmiselle hyväksyttäväksi. Ihmisen rooli muuttuu ylläpitäjästä valvojaksi ja laadun varmistajaksi.",
    executiveRecommendation: "Vapautunut työaika allokoidaan strategiseen asiakkuudenhallintaan ja konsultointiin. Asiakaspalvelijoista tulee asiakkuusvastaavia jotka rakentavat syvällisiä suhteita ja ymmärtävät liiketoimintaa. Tekninen osaaminen kasvaa: luomme AI trainer -rooleja, joissa ihmiset arvioivat agenttien laatua ja opettavat niitä paremmiksi. Tämä on korkea-arvoista työtä joka rakentaa kestävää kilpailuetua.",
    marketSignals: "McKinseyn analyysi vahvistaa että yritykset jotka investoivat AI-koulutukseen ja henkilöstön uudelleenkoulutukseen saavuttavat 3-4x paremman ROI:n kuin ne jotka pelkästään ostavat teknologiaa. BCG:n tutkimus osoittaa että 74% yrityksistä kamppailee AI-skaalautumisen kanssa - me olemme 26% joukossa joka onnistuu.",
    color: "green"
  },
  {
    phase: "Vuosi 4-5",
    timeline: "Vuosi 4-5",
    category: "Kypsyys ja Markkinajohtajuus",
    kpis: [
      "10,0 milj. € liikevaihto (vuosi 5)",
      "Liiketulos 10% = 1 milj. € (vuosi 5)",
      "100 työntekijää",
      "70% automaatioaste (toimialan johtava)",
      "5x liikevaihto, vain 1,9x henkilöstö",
      "2,54 milj. € kumulatiivinen voitto"
    ],
    strategicInsight: "Neljäntenä vuonna keskitymme kannattavuuden maksimoimiseen. Olemme saavuttaneet koon jossa kiinteät kulut jakautuvat tarpeeksi suurelle pohjalle, joten lisäkasvu pudottaa suoraan katteeseen. Hienosäädämme hinnoittelua molemmissa liiketoiminnoissa, parannamme churn-lukuja investoimalla asiakasmenestykseen, rakennamme upselling-moottorin joka systemaattisesti tarjoaa lisäpalveluita potentiaaliasiakkaille.",
    narrativeJustification: "Viidennen vuoden aikana saavutamme 10 miljoonan euron liikevaihdon ja 10% liiketuloksen. Liikevaihto jakautuu: perinteinen asiakaspalvelu 4M€ (kasvanut maltillisesti mutta kannattavuus parantunut merkittävästi), AI-palvelulinja 3M€ (noin 100 aktiivista asiakasta, 2500€/kk keskihinta), Pohjoismaiset operaatiot 3M€ (jakautuneena Ruotsi/Norja/Tanska). Henkilöstö 100: 35 asiakaspalvelussa, 50 myynnissä/asiakasmenestyksessä, 15 teknologiassa/datassa.",
    executiveRecommendation: "Kilpailuasemamme on ainutlaatuinen: emme ole puhdas teknologiayritys emmekä perinteinen ulkoistaja vaan hybridiyritys joka yhdistää ihmisen empatiaa ja tekoälyn tehokkuutta. Asiakkaat ostavat kumppanuutta jossa he saavat sekä osaavat ihmiset että maailmanluokan teknologian. Tämä on vaikea kopioida koska vaatii sekä syvää substanssiosaamista että vahvaa teknologista osaamista ja kokemusta niiden yhdistämisestä. Olemme rakentaneet 3-5 vuoden kilpailuetua.",
    marketSignals: "Gartner ennustaa että vuoteen 2027 mennessä 25% yrityksistä käyttää AI-agentteja operatiivisessa toiminnassa (vs. 1% 2025). Forrester arvioi että agentic AI -markkina kasvaa 60% CAGR:llä. IDC raportoi että AI-kypsät yritykset kasvavat 50% nopeammin kuin muut.",
    color: "purple"
  }
];

// Agentic AI modal content
const agenticAIContent = `
## MIKSI AGENTIC AI ON GAME-CHANGER JUURI HUMMILLE

Perinteinen keskustelu tekoälystä liiketoiminnassa keskittyy usein chatbotteihin ja automaattisiin vastauksiin. Tämä on agentic AI:n ensimmäinen aalto joka on jo commodisoitumassa. Me rakennamme toisen aallon päälle: **autonomisiin tekoälyagentteihin** jotka eivät vain vastaa kysymyksiin vaan suorittavat kokonaisia työnkulkuja alusta loppuun itsenäisesti, oppivat ja parantuvat jatkuvasti ja orkestraavat toimintoja yli järjestelmärajojen.

### Markkinatrendit Vahvistavat Kiireellisyyden

UiPath:n tuore tutkimus tammikuulta 2025 paljastaa että:
- **90% IT-johtajista** näkee liiketoimintaprosesseja jotka agentic AI parantaisi merkittävästi
- **77%** on valmiita investoimaan agentic AI:hin vuonna 2025
- **37%** käyttää sitä jo jollakin tasolla

Nvidia:n toimitusjohtaja Jensen Huang julisti CES 2025 -tapahtumassa että AI-agentit edustavat **monen biljoonan dollarin** liiketoimintamahdollisuutta. McKinseyn analyysi vahvistaa että vaikka vain yksi prosentti yrityksistä on saavuttanut täyden AI-kypsyyden, nämä edelläkävijät kokevat transformatiivisia hyötyjä. Olemme historiallisessa hetkessä jossa teknologia on kypsää mutta kilpailu ei ole vielä sulkenut ikkunaa.

### Miksi Juuri Humm Hyötyy Eniten?

**1. Toimialan soveltuvuus:** Asiakaspalvelun ulkoistus ja asiakaskokemuksen konsultointi on täynnä strukturoituja toistettavia prosesseja jotka ovat agenttien vahvuusaluetta. Tikettien käsittely, asiakaskyselyihin vastaaminen, tiedon haku järjestelmistä, raporttien luonti ovat tehtäviä jotka voidaan automatisoida korkealla onnistumisasteella.

**2. Optimaalinen koko:** Olemme tarpeeksi pieniä ollaksemme ketteriä mutta tarpeeksi suuria saadaksemme merkittävää hyötyä automaatiosta. 52 työntekijän organisaatio voi liikkua nopeasti ilman byrokraattisia päätöksentekoprosesseja.

**3. Markkina-etu:** Suomenkielinen markkina jossa kilpailijat ovat hitaita antaa meille aikaetua rakentaa osaaminen ennen kuin markkinoille tulee kansainvälisiä pelureita. Voimme olla Pohjoismaiden ensimmäisiä jotka todella hallitsevat agentic AI:n asiakaspalvelussa.

### Kolme Mullistavaa Muutosta

**1. Kapasiteetin kaksinkertaistuminen:** Voimme hoitaa kaksi kertaa enemmän asiakaskyselyjä samalla henkilöstömäärällä kun agentit hoitavat rutiinit ja ihmiset keskittyvät monimutkaisiin tapauksiin jotka vaativat empatiaa luovuutta ja ongelmanratkaisua.

**2. 24/7 palvelu ilman yövuoroja:** Voimme tarjota ympärivuorokautista palvelua ilman yövuoroja kun agentit ovat aina hereillä. Tämä parantaa asiakaskokemusta radikaalisti ja luo kilpailuetua.

**3. Jatkuva oppiminen ja parantuminen:** Voimme kerätä ja analysoida jokaisesta asiakaskohtaamisesta oppeja tavalla joka ei ole inhimillisesti mahdollista ja jatkuvasti parantaa sekä agenttien että ihmisten suorituskykyä. Nämä kolme muutosta yhdessä luovat kilpailuedun jota on vaikea kopioida.

### Teknologian Kypsyys Nyt

Vuonna 2025 olemme saavuttaneet kriittisen pisteen:
- **Claude 4 Sonnet** tarjoaa empaattisen sävyn ja pitkän kontekstin käsittelyn
- **LLaMA 4 Maverick** (400B parametria) tarjoaa miljoonan tokenin kontekstin ja open source -vapauden
- **Model Context Protocol (MCP)** mahdollistaa turvallisen integraation ilman satoja erillisiä liitäntöjä
- **Claude Code** -tyyppiset työkalut mahdollistavat että yksi Tech Lead tuottaa 5-10 kehittäjän tulokset

Tämä teknologiafilosofia antaa meille **neljä konkreettista etua:**

1. **Kustannustehokkuus:** Open source -mallit maksavat murto-osan kaupallisista ja voimme skaalata joustavasti
2. **Joustavuus:** Voimme vaihtaa malleja tai toimittajia lennossa ilman vendor lock-inia
3. **Oman osaamisen rakentaminen:** Opimme syvällisesti teknologian ja voimme opettaa asiakkaille
4. **Innovaationopeus:** Voimme kokeilla uusia malleja heti kun ne tulevat saataville

---

**Johtopäätös:** Agentic AI ei ole tulevaisuuden teknologia - se on tämän päivän kilpailuetu. Yritykset jotka toimivat nyt rakentavat 3-5 vuoden etumatkaa. Yritykset jotka odottavat joutuvat kalliiseen kiinni ottamiseen.
`;

export function StrategicRecommendationsPanel() {
  const [isAgenticModalOpen, setIsAgenticModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true); // Chat widget auki oletuksena

  return (
    <ScrollArea className="h-full bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10">

        {/* Critical Context Header - Always Visible */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-red-900/30 via-orange-900/20 to-red-900/30 border-2 border-red-500/30 backdrop-blur-xl shadow-2xl"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-400/40">
              <AlertTriangle className="h-7 w-7 text-red-400" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Kriittinen Konteksti: Markkina-asema ja Kiireellisyys
              </h2>
              <p className="text-red-200/80 text-sm sm:text-base">
                Humm Group Oy:n nykyinen tilanne vaatii välitöntä toimintaa
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-white/10 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-400" />
                Nykyinen Taloudellinen Todellisuus
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between p-3 rounded-lg bg-slate-800/40">
                  <span className="text-slate-300">Liikevaihto 2024:</span>
                  <span className="font-bold text-red-300">2,13 milj. € (-7,7%)</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-slate-800/40">
                  <span className="text-slate-300">Työntekijät:</span>
                  <span className="font-bold text-white">52 kokoaikaista</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-slate-800/40">
                  <span className="text-slate-300">Liikevoittomarginaali:</span>
                  <span className="font-bold text-red-300">-0,2% (-21 000 €)</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-slate-800/40">
                  <span className="text-slate-300">€/työntekijä:</span>
                  <span className="font-bold text-orange-300">40 385 € (27-54% alle opt.)</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-white/10 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-400" />
                Markkinavertailut Paljastavat Tilanteen Vakavuuden
              </h3>
              <ul className="space-y-2 text-sm text-slate-200">
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 mt-1">→</span>
                  <span>Pohjoismainen agenttikustannus: <strong className="text-white">22 200 € vuodessa</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 mt-1">→</span>
                  <span>Terve BPO-tavoite: <strong className="text-white">2,5-4x agenttikustannus</strong> liikevaihtona per työntekijä</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1 font-bold">⚠</span>
                  <span><strong className="text-red-300">Kuilu-analyysi: Humm toimii 1,8x kertoimella vs. tarvittava 3-4x</strong></span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-900/20 to-blue-900/20 border border-emerald-500/20 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                Markkinamahdollisuuden Koko
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-200">
                <div>
                  <div className="font-semibold text-emerald-300 mb-1">Suomen IT-ulkoistus:</div>
                  <div>2,6 mrd € vuoteen 2025 (4,2% CAGR)</div>
                </div>
                <div>
                  <div className="font-semibold text-blue-300 mb-1">Euroopan CX-ulkoistus:</div>
                  <div>82 mrd € vuoteen 2033 (13,1% CAGR)</div>
                </div>
                <div>
                  <div className="font-semibold text-purple-300 mb-1">Pohjoismainen BPO:</div>
                  <div>15,2 mrd € vuoteen 2029 (3,9% CAGR)</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="font-bold text-emerald-300 mb-1 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    AI-mahdollistetut palvelut:
                  </div>
                  <div className="text-emerald-200 font-semibold">Kasvavat 27,9% vuosittain Suomessa</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Strategy Content with Tabs */}
        <Tabs defaultValue="narrative" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-900/60 border border-white/10 p-1">
            <TabsTrigger value="narrative" className="data-[state=active]:bg-blue-600/80">
              <Lightbulb className="h-4 w-4 mr-2" />
              Strateginen Narratiivi
            </TabsTrigger>
            <TabsTrigger value="operational" className="data-[state=active]:bg-purple-600/80">
              <Rocket className="h-4 w-4 mr-2" />
              Operatiivinen Suunnitelma
            </TabsTrigger>
          </TabsList>

          {/* Strategic Narrative View */}
          <TabsContent value="narrative" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Executive Summary Card */}
              <Card className="p-6 sm:p-8 bg-gradient-to-br from-slate-900/60 to-blue-900/40 border-2 border-blue-500/30 backdrop-blur-xl">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-400/40">
                    <Star className="h-7 w-7 text-blue-400" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      Executive Summary: Miksi, Mitä ja Miten
                    </h2>
                    <Badge variant="outline" className="text-blue-300 border-blue-400/50">
                      Strateginen Visio
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4 text-slate-200 leading-relaxed">
                  <p className="text-base sm:text-lg">
                    Humm Group Oy on tänään <strong className="text-white">2,1 miljoonan euron liikevaihdon yritys</strong> joka
                    balanseeroi kannattavuuden rajalla. Meillä on vahva tase, 52 osaavaa työntekijää ja vakiintunut
                    asiakaskunta, mutta kasvumme on pysähtynyt ja operatiivinen tehokkuutemme jää jälkeen markkinoiden
                    parhaista. Tämä strategia kuvaa <span className="text-emerald-300 font-semibold">konkreettisen ja realistisen polun
                    jolla kasvamme viisinkertaisiksi viidessä vuodessa</span> hyödyntämällä agentic AI:ta tavalla joka ei
                    vaadi massiivisia etukäteisinvestointeja tai suurta kehitysorganisaatiota.
                  </p>

                  <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-500/30">
                    <h3 className="text-lg font-bold text-emerald-300 mb-3 flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Ydinajatus
                    </h3>
                    <p className="text-base">
                      Automatisoimme <strong className="text-white">40-50% nykyisistä rutiinitehtävistä</strong> agentic AI:lla,
                      allokoimme vapautuneet henkilöstöresurssit uuteen AI-palveluliiketoimintaan joka palvelee pienyrityksiä
                      ja laajennamme samanaikaisesti Pohjoismaihin teknologian mahdollistamana. Tämä luo kolme tulonlähdettä:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                      <div className="p-3 rounded-lg bg-slate-900/60 border border-white/10">
                        <div className="text-2xl font-bold text-emerald-300 mb-1">4M€</div>
                        <div className="text-xs text-slate-300">Tehostunut perusliiketoiminta</div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-900/60 border border-white/10">
                        <div className="text-2xl font-bold text-blue-300 mb-1">3M€</div>
                        <div className="text-xs text-slate-300">Uusi AI-palvelulinja</div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-900/60 border border-white/10">
                        <div className="text-2xl font-bold text-purple-300 mb-1">3M€</div>
                        <div className="text-xs text-slate-300">Pohjoismaiset operaatiot</div>
                      </div>
                    </div>
                  </div>

                  <p className="text-base">
                    Kriittinen menestystekijämme on <strong className="text-white">nopeus ilman kompromisseja laadussa</strong>.
                    Sen sijaan että rakentaisimme vuosia kehitysorganisaatiota, aloitamme heti <span className="text-blue-300 font-semibold">Claude
                    Code -tyyppisillä AI-kehitystyökaluilla</span> joiden avulla yksikin Tech Lead voi tuottaa tuloksia jotka
                    vaatisivat perinteisesti 5-10 hengen tiimin.
                  </p>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-900/20 border border-blue-500/30">
                    <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-100">
                      <strong>Tärkeä huomio:</strong> Tämä ei ole teknologiavisio vaan liiketoimintasuunnitelma jossa
                      jokaisella toimella on mitattava ROI ja selkeä aikataulu. Ensimmäinen 30 päivää keskittyy nopeisiin
                      voittoihin jotka rakentavat luottamusta ja rahoittavat seuraavia vaiheita.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Agentic AI CTA Button */}
              <Dialog open={isAgenticModalOpen} onOpenChange={setIsAgenticModalOpen}>
                <DialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className="w-full p-6 h-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-2 border-purple-400/50 text-lg font-bold"
                      size="lg"
                    >
                      <Brain className="h-6 w-6 mr-3" />
                      Miksi Agentic AI on Game-Changer Juuri Hummille?
                      <Sparkles className="h-5 w-5 ml-3" />
                    </Button>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-purple-900/50 border-2 border-purple-500/30">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                      <Brain className="h-7 w-7 text-purple-400" />
                      Agentic AI: Strateginen Kilpailuetu
                    </DialogTitle>
                    <DialogDescription className="text-slate-300 text-base">
                      Syvällinen analyysi siitä miksi agentic AI on transformatiivinen mahdollisuus Hummille
                    </DialogDescription>
                  </DialogHeader>
                  <div className="prose prose-invert max-w-none mt-4">
                    {agenticAIContent.split('\n').map((paragraph, idx) => {
                      if (paragraph.startsWith('##')) {
                        return (
                          <h2 key={idx} className="text-2xl font-bold text-white mt-6 mb-4">
                            {paragraph.replace('##', '').trim()}
                          </h2>
                        );
                      } else if (paragraph.startsWith('###')) {
                        return (
                          <h3 key={idx} className="text-xl font-semibold text-blue-300 mt-5 mb-3">
                            {paragraph.replace('###', '').trim()}
                          </h3>
                        );
                      } else if (paragraph.startsWith('**') && paragraph.includes(':**')) {
                        return (
                          <h4 key={idx} className="text-lg font-semibold text-emerald-300 mt-4 mb-2">
                            {paragraph.replace(/\*\*/g, '').trim()}
                          </h4>
                        );
                      } else if (paragraph.startsWith('- ')) {
                        return (
                          <li key={idx} className="text-slate-200 ml-4 mb-2">
                            {paragraph.replace('- ', '').replace(/\*\*/g, '').trim()}
                          </li>
                        );
                      } else if (paragraph.startsWith('---')) {
                        return <hr key={idx} className="my-6 border-slate-700" />;
                      } else if (paragraph.trim()) {
                        return (
                          <p key={idx} className="text-slate-200 mb-4 leading-relaxed">
                            {paragraph.trim()}
                          </p>
                        );
                      }
                      return null;
                    })}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Roadmap Cards - Narrative Focus */}
              {roadmapData.map((phase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className={`p-6 bg-gradient-to-br from-slate-900/80 to-${phase.color}-900/20 border-2 border-${phase.color}-500/30 backdrop-blur-xl hover:shadow-xl hover:shadow-${phase.color}-500/20 transition-all duration-300`}>
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className={`text-${phase.color}-300 border-${phase.color}-400/50`}>
                            {phase.timeline}
                          </Badge>
                          <Badge className={`bg-${phase.color}-600/20`}>
                            {phase.category}
                          </Badge>
                        </div>
                        <h3 className="text-2xl font-bold text-white">{phase.phase}</h3>
                      </div>
                      <div className={`p-3 rounded-xl bg-${phase.color}-500/20 border border-${phase.color}-400/40`}>
                        <Calendar className={`h-6 w-6 text-${phase.color}-400`} />
                      </div>
                    </div>

                    {/* Strategic Insight */}
                    <div className="mb-4 p-4 rounded-lg bg-slate-800/40 border border-white/10">
                      <h4 className="text-sm font-bold text-blue-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        Strateginen Oivallus
                      </h4>
                      <p className="text-slate-200 text-sm leading-relaxed">
                        {phase.strategicInsight}
                      </p>
                    </div>

                    {/* Narrative Justification */}
                    <div className="mb-4 p-4 rounded-lg bg-slate-800/40 border border-white/10">
                      <h4 className="text-sm font-bold text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Narratiivinen Perustelu
                      </h4>
                      <p className="text-slate-200 text-sm leading-relaxed">
                        {phase.narrativeJustification}
                      </p>
                    </div>

                    {/* Executive Recommendation */}
                    <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-500/30">
                      <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Johdon Suositus
                      </h4>
                      <p className="text-slate-200 text-sm leading-relaxed">
                        {phase.executiveRecommendation}
                      </p>
                    </div>

                    {/* Market Signals */}
                    <div className="mb-4 p-4 rounded-lg bg-slate-800/40 border border-orange-500/30">
                      <h4 className="text-sm font-bold text-orange-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Markkinasignaalit
                      </h4>
                      <p className="text-slate-200 text-sm leading-relaxed">
                        {phase.marketSignals}
                      </p>
                    </div>

                    {/* KPIs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {phase.kpis.map((kpi, kpiIndex) => (
                        <div key={kpiIndex} className="flex items-start gap-2 p-2 rounded bg-slate-900/40">
                          <CheckCircle2 className={`h-4 w-4 text-${phase.color}-400 flex-shrink-0 mt-0.5`} />
                          <span className="text-xs text-slate-300">{kpi}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          {/* Operational Plan View */}
          <TabsContent value="operational" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {roadmapData.map((phase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className={`p-6 bg-gradient-to-br from-slate-900/80 to-${phase.color}-900/20 border-2 border-${phase.color}-500/30 backdrop-blur-xl`}>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <Badge variant="outline" className={`text-${phase.color}-300 border-${phase.color}-400/50 mb-2`}>
                          {phase.timeline}
                        </Badge>
                        <h3 className="text-2xl font-bold text-white">{phase.phase}</h3>
                      </div>
                      <div className={`p-3 rounded-xl bg-${phase.color}-500/20 border border-${phase.color}-400/40`}>
                        <Rocket className={`h-6 w-6 text-${phase.color}-400`} />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-400" />
                        Keskeiset Tavoitteet (KPIs)
                      </h4>
                      {phase.kpis.map((kpi, kpiIndex) => (
                        <div key={kpiIndex} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/60 border border-white/10 hover:border-white/20 transition-colors">
                          <CheckCircle2 className={`h-5 w-5 text-${phase.color}-400 flex-shrink-0 mt-0.5`} />
                          <span className="text-sm text-slate-200 font-medium">{kpi}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Strategy Chat Widget */}
        <StrategyChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

        {/* Floating button to reopen chat if closed */}
        {!isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <Button
              onClick={() => setIsChatOpen(true)}
              className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-2xl hover:shadow-purple-500/50 transition-all"
            >
              <MessageSquare className="h-6 w-6 text-white" />
            </Button>
          </motion.div>
        )}

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 p-8 rounded-3xl bg-gradient-to-br from-emerald-900/40 to-blue-900/40 border-2 border-emerald-500/40 backdrop-blur-xl text-center"
        >
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-400/40">
              <Rocket className="h-8 w-8 text-emerald-400" strokeWidth={2.5} />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Polku Menestykseen On Kirkas
          </h2>
          <p className="text-slate-200 text-base sm:text-lg mb-6 max-w-3xl mx-auto leading-relaxed">
            Humm Group Oy:llä on edessään valinta joka määrittää yrityksen tulevaisuuden vuosikymmeneksi eteenpäin.
            Voimme tarttua historialliseen mahdollisuuteen ja muuttua teknologiajohtavaksi asiakaskokemuksen
            kumppaniksi joka yhdistää ihmisen parhaat puolet ja tekoälyn voiman.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Badge variant="outline" className="text-emerald-300 border-emerald-400/50 text-sm px-4 py-2">
              <DollarSign className="h-4 w-4 mr-1" />
              €10M tavoite 2030
            </Badge>
            <Badge variant="outline" className="text-blue-300 border-blue-400/50 text-sm px-4 py-2">
              <Users className="h-4 w-4 mr-1" />
              100 työntekijää
            </Badge>
            <Badge variant="outline" className="text-purple-300 border-purple-400/50 text-sm px-4 py-2">
              <TrendingUp className="h-4 w-4 mr-1" />
              20% liikevoitto
            </Badge>
          </div>
          <p className="text-white font-bold text-xl mt-6">
            Aloitetaan nyt. Rakennetaan yhdessä Hummin tulevaisuus.
          </p>
        </motion.div>
      </div>
    </ScrollArea>
  );
}
