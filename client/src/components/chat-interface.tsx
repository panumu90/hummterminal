import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PulseButton } from "@/components/ui/pulse-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from "framer-motion";
import { Bot, User, Send, TrendingUp, Wrench, MapPin, Target, Zap, DollarSign, Crosshair, Globe, Building, Users, Shield, Database, Workflow, MessageCircle, Phone, Heart, GraduationCap, BookOpen, Cpu, Scale, Star, Maximize2, Minimize2, HelpCircle, FileText, ExternalLink, BarChart3, Rocket } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: number;
  isWelcome?: boolean;
}

type ContextType = "strategic" | "practical" | "finnish" | "planning" | "technical" | "mcp" | "general";

interface QuestionButton {
  id: string;
  question: string;
  category: string;
  icon: typeof Bot;
  color: string;
}

interface TopicArea {
  id: string;
  title: string;
  icon: typeof Bot;
  color: string;
  questions: QuestionButton[];
}

// Pre-written responses for quick questions (no API call)
const preWrittenResponses: Record<string, string> = {
  "faq-10m-goal": `**Miten saavutamme 10M€ liikevaihdon?**

Kolme skenaariota 10M€ tavoitteeseen:

**Vaihtoehto A: Orgaaninen kasvu + AI**
• Kasvata henkilöstö 52 → 150 hlöä
• AI tehostaa tuottavuutta 66% → €67k/hlö
• Tulos: 150 hlöä × €67k = €10M

**Vaihtoehto B: Hybridimalli (suositeltu)**
• 100 ihmistä @ €80k/hlö = €8M
• AI-palvelut (autonomiset agentit) = €2M
• Tulos: €10M, matalammat henkilöstökustannukset

**Vaihtoehto C: AI-first**
• 60 ihmistä @ €100k/hlö = €6M
• AI-pohjaiset palvelut = €4M
• Tulos: €10M, korkein kannattavuus

**Aikataulu**: 24-36 kuukautta onnistuneella AI-implementaatiolla.`,

  "faq-ai-cost-roi": `**Paljonko AI-transformaatio maksaa ja mikä on ROI?**

**Investoinnit:**
• Vuosi 1: €200-500k (teknologia, henkilöstö, koulutus)
• Vuosi 2: €100-200k (skaalaus, optimointi)

**ROI-odotus:**
• Takaisinmaksuaika: 18-24 kuukautta
• Kustannussäästöt: 20-30% vuonna 2
• Tuottavuuden kasvu: 50-66%

**Konkreettiset hyödyt:**
• Operatiiviset kustannukset: -30%
• Asiakaskontaktit/tunti: +13.8%
• Puhelinkäsittely: +45% nopeampi
• Henkilöstön tuottavuus: €41k → €67k/hlö

**Bottom line**: €500k investointi voi tuottaa €1.5-2M lisäarvoa vuodessa.`,

  "faq-ai-start": `**Mistä aloitamme AI-implementaation?**

**Vaihe 1: Lyhyt aikaväli (0-6 kk)**
1. **Pilottiprojekti**: Valitse 1-2 use casea
   • FAQ-chat (nopea voitto)
   • Statustiedustelut (helppo automatisoida)

2. **Teknologiavalinta**: Arvioi alustat
   • OpenAI GPT-4
   • Anthropic Claude
   • Azure OpenAI

3. **Mittaristo**: Määrittele KPI:t
   • Asiakastyytyväisyys
   • Vastausajat
   • Kustannussäästöt
   • Tarkkuus/virheprosentti

4. **Tiimi**: Rekrytoi/kouluta
   • 1-2 AI-kehittäjää
   • Kouluta nykyinen henkilöstö

**Kriittiset menestystekijät:**
• Aloita pienestä, skaalaa nopeasti
• Mittaa kaikkea
• Ota henkilöstö mukaan alusta lähtien
• Asiakaskokemus etusijalle`,

  "faq-ai-use-cases": `**Mitkä ovat AI:n tärkeimmät käyttökohteet Hummille?**

**1. Autonomiset asiakaspalvelu-agentit**
• 24/7 saatavuus ilman henkilöstökustannuksia
• FAQ, statustiedustelut, peruskyselyt
• Potentiaali: 40-60% yhteydenotoista automatisoitavissa

**2. Älykkäät työkalut henkilöstölle**
• AI-assistentit monimutkaisiin tapauksiin
• Automaattinen tiivistelmät ja raportit
• Ehdotukset ratkaisuihin historiadata pohjalta

**3. Ennakoiva asiakaspalvelu**
• AI tunnistaa ongelmia ennen yhteydenottoa
• Proaktiiviset ratkaisut
• Vähentää palvelupyyntöjä 15-25%

**4. Back office -automaatio**
• Laskutus, raportointi, dokumentaatio
• Workflow-automaatio
• Kustannussäästö: 30-40%

**5. Analytics & insights**
• Reaaliaikainen asiakasdata-analyysi
• Trendit ja ennusteet
• Päätöksenteon tuki johdolle

**Prioriteetti**: Aloita kohdista 1 ja 3 (nopeat voitot), sitten 2 ja 4.`,

  "faq-risks": `**Mitkä ovat suurimmat riskit ja miten ne hallitaan?**

**Teknologiariskit:**
❌ Riski: AI-mallien tarkkuus ja luotettavuus
✅ Hallinta: Perusteellinen testaus, ihminen loopissa, jatkuva monitorointi

❌ Riski: Integraatiokompleksisuus
✅ Hallinta: MCP-protokolla, standardoidut rajapinnat, pilotit ensin

❌ Riski: Tietoturva ja GDPR
✅ Hallinta: Roolipohjainen pääsynhallinta, audit trail, compliance-tarkistukset

**Liiketoimintariskit:**
❌ Riski: Asiakasvastarinta AI-palveluille
✅ Hallinta: Hybridimalli (AI + ihminen), selkeä viestintä, valinnanvapaus

❌ Riski: Kilpailijoiden nopea kehitys
✅ Hallinta: Aloita nyt, iteroi nopeasti, jatkuva innovaatio

❌ Riski: Rekrytointihaasteet
✅ Hallinta: Kouluta nykyistä henkilöstöä, partneroinnit, ulkoiset konsultit

**Taloudelliset riskit:**
❌ Riski: ROI-tavoitteiden saavuttaminen
✅ Hallinta: Selkeät mittarit, vaiheistettu investointi, pilotit ennen skaalaa

❌ Riski: Kassavirran hallinta
✅ Hallinta: €200-500k alkuinvestointi, pienet inkrementit, nopeat voitot

**Riskienhallintastrategia**: Fail fast, learn fast, scale fast.`,

  "roi-measurement": `**AI-investoinnin ROI asiakaspalvelussa - Konkreettinen mittaaminen**

Humm Group voi mitata AI-investoinnin arvoa näillä keskeisillä mittareilla:

### 📊 **Suorat kustannussäästöt**
- **Henkilöstökustannukset**: 20-30% vähennys manuaalisen työn automatisoinnin myötä
- **Skaalautuvuus**: 3x liikevaihdon kasvu ilman lineaarista henkilöstölisäystä
- **Nykytila**: €2.1M / 52 hlöä = €40k/hlö → **Tavoite**: €10M / 52 hlöä = €192k/hlö

### ⚡ **Tehokkuushyödyt**
- **Vastausaika**: Keskimäärin 4-6h → alle 30 sekuntia (AI-hoidetut)
- **First Response Time (FRT)**: -85% parannus
- **Tikettien käsittelyaika**: -40-60% kun AI esikäsittelee ja luokittelee
- **Säästetty aika**: 20-25h/viikko per tiimi

### 😊 **Asiakaskokemuksen parannus**
- **CSAT-pistemäärä**: Nykytila 7.2/10 → Tavoite 8.5-9.0/10
- **Customer Effort Score (CES)**: -30% (helpompi asioida)
- **Churn-rate**: -15-20% proaktiivisella asiakaspalvelulla
- **Upsell-mahdollisuudet**: +25% AI-avusteisen personoinnin kautta

### 🎯 **Mitattava ROI-laskenta (Hummille)**
**Investointi vuosi 1:**
- Open source -pohjaiset ratkaisut (n8n, Mistral, Langchain): €0 lisenssit
- Kehitys + toteutus: €50-75k (oma työ tai konsultointi)
- Infrastruktuuri (pilvi): €10-15k/v

**Säästöt vuosi 1:**
- Henkilöstökustannukset: €80-120k (automaatio korvaa 1.5-2 FTE:tä)
- Prosessitehokkuus: €30-50k (nopeutunut käsittely)
- Churn-väheneminen: €40-60k (asiakkaiden pysyvyys)

**➡️ ROI vuosi 1: 150-280% (payback 4-8 kuukautta)**
**➡️ ROI 3 vuotta: 400-600%**

### 📈 **Seurantakojelauta johdolle**
1. **Revenue per Employee**: THE KPI teknologiajohdolle
2. **AI Automation Rate**: Kuinka suuri % tiketeistä hoidetaan täysin automaattisesti
3. **Cost per Ticket**: Yhden tiketin käsittelyn todellinen kustannus
4. **Customer Lifetime Value (CLV)**: AI:n vaikutus asiakkaiden elinkaariarvoon`,

  "cx-trends-2025": `**2025 suurimmat CX-trendit ja AI:n rooli**

### 🎯 **1. Hyperpersonointi (Hyper-personalization)**
- **Mitä**: Jokaiselle asiakkaalle räätälöity kokemus reaaliajassa
- **AI:n rooli**: Analysoi asiakkaan historian, käyttäytymisen ja kontekstin → personoidut suositukset
- **Humm-esimerkki**: AI tunnistaa, että asiakas X avaa aina tiketit maanantaiaamuisin klo 8-9 → proaktiivinen viesti sunnuntai-iltana: "Hei! Huomasimme, että tavallisesti tarvitset apua maanantaiaamuisin. Tässä pikaohjeet..."

### ⚡ **2. Proaktiivinen asiakaspalvelu**
- **Mitä**: Asiakaspalvelu ottaa yhteyttä ennen kuin asiakas huomaa ongelman
- **AI:n rooli**: Ennakoiva analytiikka (predictive analytics) + automaattiset hälytykset
- **Humm-esimerkki**: AI havaitsee, että asiakkaan järjestelmässä on epänormaali virhelokin kasvu → lähettää proaktiivisen viestin ja korjausohjeet ennen kuin asiakas ilmoittaa ongelmasta

### 🤖 **3. Agentic AI (Itsenäiset AI-agentit)**
- **Mitä**: AI-agentit, jotka osaavat ratkaista monimutkaisempia ongelmia itsenäisesti
- **Ero chatbottiin**: Chatbot vastaa kysymyksiin | AI-agentti tekee toimenpiteitä (luo tikettejä, päivittää CRM:ää, aloittaa prosesseja)
- **Humm-esimerkki**: Asiakkaan laskutusongelma → AI-agentti tarkistaa CRM:n, havaitsee virheellisen laskun, korjaa sen automaattisesti ja ilmoittaa asiakkaalle

### 🔮 **4. Ennustava asiakaskokemus (Predictive CX)**
- **Mitä**: AI ennustaa asiakkaiden tarpeita ennen kuin he itse tietävät
- **AI:n rooli**: Koneoppimismallit analysoivat historiaa ja käyttäytymistä
- **Humm-esimerkki**: AI havaitsee kuvion: "Asiakkaat, jotka käyttävät ominaisuutta Y, tarvitsevat 80% todennäköisyydellä apua ominaisuudessa Z 3 päivän sisällä" → proaktiivinen ohjeistus

### 🎤 **5. Multimodaalinen asiakaspalvelu**
- **Mitä**: Asiakkaat voivat vaihtaa kanavaa kesken keskustelun (chat → puhelin → email) ilman toistamista
- **AI:n rooli**: Yhtenäinen kontekstin hallinta + puheentunnistus (ASR) + sentimenttianalyysi
- **Humm-esimerkki**: Asiakas aloittaa chatissa, AI havaitsee turhautumisen sentimenttianalyysilla → tarjoaa puhelinsoiton + siirtää kaikki tiedot agentille automaattisesti

### 🛡️ **6. Privacy-First AI (Tietosuojakeskeinen AI)**
- **Mitä**: Asiakkaat vaativat läpinäkyvyyttä siitä, mitä AI tekee heidän datalleen
- **AI:n rooli**: Selittävä AI (Explainable AI) + MCP-protokolla turvallisiin integraatioihin
- **Humm-esimerkki**: AI:n jokaisen vastauksen yhteydessä näkyy: "Hain tietoa CRM:stä (asiakastiedot), ERP:stä (tilausstatus), ja tukikannasta (ratkaisuhistoria)"

### 📊 **Hummin toimenpiteet 2025**
✅ **Q1 2025**: Hyperpersonointi käyttöön (segmenttikohtaiset AI-mallit)
✅ **Q2 2025**: Proaktiivinen asiakaspalvelu (ennakoivat hälytykset)
✅ **Q3 2025**: Agentic AI (itsenäiset AI-agentit tikettien käsittelyyn)
✅ **Q4 2025**: Multimodaalinen CX (chat + puhelin + email yhtenäisesti)`,

  "reduce-manual-work": `**Automaation vaikutus manuaalisen työn vähentämiseen**

### 🎯 **Hummin nykytilanne**
- **60-70% kustannuksista = henkilöstökulut**
- **52 työntekijää, €2.1M liikevaihto** → €40k/hlö (alhainen tehokkuus)
- **Manuaaliset työvaiheet**: Tikettien luku, luokittelu, reititys, vastausten kirjoittaminen, seuranta

### ⚡ **AI-automaation vaikutus**

#### **1. Tikettien esikäsittely (15-20h/viikko säästöä)**
- **Ennen**: Agentti lukee tiketin, ymmärtää kontekstin, etsii relevantin tiedon
- **AI:n jälkeen**: AI lukee, luokittelee, ja reititys automaattisesti + esitäyttää vastausluonnoksen
- **Säästö**: 5-10 min/tiketti × 200 tiketti/viikko = **16-33 tuntia/viikko**

#### **2. One-click-send vastaukset (10-15h/viikko säästöä)**
- **Ennen**: Agentti kirjoittaa vastauksen tyhjästä, tarkistaa oikeinkirjoituksen, formatoi
- **AI:n jälkeen**: AI luo valmiin vastausluonnoksen → agentti tarkistaa ja klikkaa "Lähetä"
- **Säästö**: 10-15 min/tiketti × 100 tiketti/viikko = **16-25 tuntia/viikko**

#### **3. Itsenäinen AI-agentti (20-30h/viikko säästöä)**
- **Ennen**: Kaikki tiketit vaativat ihmisen
- **AI:n jälkeen**: 40-60% tiketeistä hoidetaan täysin automaattisesti (esim. "Salasanan nollaus", "Tilausstatus", "Laskun kopio")
- **Säästö**: 200 tiketti/viikko × 50% automaatio × 15 min = **25 tuntia/viikko**

#### **4. Proaktiivinen viestintä (5-10h/viikko säästöä)**
- **Ennen**: Asiakkaat lähettävät tikettejä ongelmista
- **AI:n jälkeen**: AI havaitsee ongelmat etukäteen ja lähettää ratkaisut ennen tikettejä
- **Säästö**: -20% tikettien määrä = **10-15 tuntia/viikko**

### 📊 **Yhteensä: 50-80 tuntia/viikko säästöä**
= **2-3 FTE:n verran työtä** ilman henkilöstölisäystä

### 💰 **Taloudelliset hyödyt Hummille**
- **Henkilöstökustannussäästö**: €80-120k/vuosi (2-3 FTE × €40k)
- **Skaalautuvuus**: Voidaan kasvattaa liikevaihtoa €2.1M → €10M ilman vastaavaa henkilöstölisäystä
- **Revenue per Employee**: €40k → €192k (4.8x parannus)

### ✅ **Toteutus Hummille (Open Source -pohjainen)**
1. **n8n**: Low-code automaatioalusta (€0 lisenssit)
2. **Mistral 7B / Llama 3**: Open source LLM:t (€0 lisenssit)
3. **Langchain**: AI-integraatiokehys (€0 lisenssit)
4. **Toteutusaika**: 4-8 viikkoa ensimmäisiin tuloksiin
5. **Kustannus**: €50-75k kehitys + €10-15k/v infrastruktuuri

**➡️ ROI vuosi 1: 150-280%**`,

  "mcp-what-is": `**Model Context Protocol (MCP) - AI:n turvallinen integraatiostandardi**

### 🎯 **Mikä on MCP?**

**Model Context Protocol (MCP)** on Anthropicin kehittämä **avoin standardi**, joka määrittelee turvallisen tavan yhdistää AI-mallit (kuten Claude, GPT-4) yrityksen sisäisiin järjestelmiin (CRM, ERP, tietokannat).

### 🔐 **Miksi MCP on tärkeä?**

#### **Ongelma ilman MCP:tä:**
- AI-mallit tarvitsevat pääsyn yrityksen dataan ollakseen hyödyllisiä
- Perinteisesti: API-avaimet jaetaan suoraan AI-mallille → **turvallisuusriski**
- AI voi vahingossa päästä käsiksi kaikkiin tietoihin, ei vain tarvittaviin

#### **Ratkaisu MCP:llä:**
- **Rajattu pääsy**: AI saa vain ne tiedot, jotka se tarvitsee kyseiseen tehtävään
- **Audit-jäljet**: Kaikki AI:n pyynnöt kirjataan lokiin
- **Roolipohjainen käyttöoikeus**: AI-agentilla on määritelty rooli (esim. "ticket_reader", "crm_writer")

### 📊 **Käytännön esimerkki (Humm Group)**

#### **Ilman MCP:tä (vanha tapa):**
- Asiakas kysyy: "Mikä on tilauksen #12345 status?"
- AI saa pääsyn koko CRM-tietokantaan
- AI voi vahingossa lukea kaikkien asiakkaiden tiedot
- Turvallisuusriski + GDPR-ongelma

#### **MCP:llä (turvallinen tapa):**
- Asiakas kysyy: "Mikä on tilauksen #12345 status?"
- AI pyytää MCP:n kautta: "Hae tilaus #12345"
- MCP tarkistaa: Onko AI:lla oikeus?
- MCP palauttaa vain tilauksen #12345 tiedot
- Loki: "AI-agentti haki tilauksen #12345 klo 14:05"

### 🛡️ **MCP:n turvallisuusominaisuudet**

1. **Least Privilege Principle**: AI saa minimioikeudet
2. **Explicit Permissions**: Jokainen pääsy vaatii luvan
3. **Audit Logging**: Kaikki kirjataan
4. **Data Isolation**: AI ei näe kaikkea dataa kerralla
5. **GDPR-compliant**: Täyttää EU:n tietosuoja-asetuksen

### 🚀 **MCP:n hyödyt Hummille**

✅ **Asiakkaat luottavat enemmän**: "AI ei pääse kaikkiin tietoihin"
✅ **GDPR-vaatimusten täyttäminen**: Audit-jäljet + rajattu pääsy
✅ **Skaalautuvuus**: Helppo lisätä uusia AI-agentteja ilman turvallisuusriskiä
✅ **Integraatioiden hallinta**: Keskitetty tapa yhdistää AI järjestelmiin

### 📈 **MCP käytössä (2025)**

- **Anthropic Claude**: Natiivituki MCP:lle
- **CyberArk**: MCP-pohjainen AI-turvallisuusalusta
- **Cerbos**: Fine-grained access control MCP-agentteille
- **Humm Group**: Käyttöönotto Q1 2025 ✅

### 🎓 **Yhteenveto**

MCP on **välttämätön** standardille, joka:
- Tekee AI-integraatioista turvallisia
- Täyttää GDPR-vaatimukset
- Antaa asiakkaille luottamusta
- Mahdollistaa Hummin skaalautuvuuden ilman turvallisuuskompromisseja`,

  "mcp-security": `**Miten MCP parantaa AI-integraatioiden turvallisuutta?**

### 🔐 **Turvallisuuden tasot MCP:ssä**

#### **1. Kontekstuaalinen pääsyoikeus**
AI ei saa "yleisavaimia" järjestelmiin, vaan rajatun pääsyn per pyyntö:
- ❌ **Ilman MCP**: AI saa pääsyn koko CRM-tietokantaan
- ✅ **MCP:llä**: AI saa haettua vain tietyn asiakkaan tiedot tiettyyn tehtävään

#### **2. Audit-lokitus (Audit Trails)**
Kaikki AI:n toiminnot kirjataan:
- AI-Agent-001: READ Customer 12345 - Success
- AI-Agent-001: UPDATE Ticket 67890 - Success
- AI-Agent-002: READ Customer 99999 - DENIED (no permission)

**Hyöty**: GDPR-auditointi, vianmääritys, turvallisuusseuranta

#### **3. Roolipohjainen pääsy (RBAC)**
Jokainen AI-agentti toimii määritetyllä roolilla:
- **Ticket Classifier**: Voi lukea tikettejä, ei muokata asiakastietoja
- **CRM Assistant**: Voi lukea asiakastietoja, ei poistaa niitä
- **Billing Agent**: Voi lukea laskutustietoja, ei muokata hintoja

#### **4. Eksplisiittiset luvat (Explicit Permissions)**
AI ei oleta mitään - jokainen toiminto vaatii selkeän luvan:

**Esimerkki:**
1. AI pyytää: "Haluan päivittää asiakkaan #12345 sähköpostiosoitteen"
2. MCP tarkistaa:
   - ✓ Onko AI:lla oikeus päivittää asiakastietoja?
   - ✓ Onko kyseessä oikea asiakas?
   - ✓ Onko pyyntö looginen (ei epäilyttävä)?
3. Vasta sitten: Lupa myönnetty

### 🛡️ **MCP vs Perinteinen API-integraatio**

| Ominaisuus | Perinteinen API | MCP |
|------------|----------------|-----|
| **Pääsy** | Kaikki tai ei mitään | Rajattu per pyyntö |
| **Lokitus** | Vaihtelee | Pakollinen |
| **Rollback** | Manuaalinen | Automaattinen |
| **GDPR-compliance** | Haastavaa | Sisäänrakennettu |

### 🚀 **Turvallisuushyödyt Hummille**

✅ **Asiakasluottamus**: "Teillä on MCP-standardi käytössä" → asiakkaat tuntevat olonsa turvallisemmaksi
✅ **Compliance**: GDPR, ISO 27001, SOC 2 helpompaa täyttää
✅ **Riskinhallinta**: Vahingossa tapahtuva datavuoto vaikea
✅ **Skaalautuvuus**: Voit lisätä AI-agentteja ilman turvallisuushuolia`,

  "mcp-automation": `**Mitä hyötyä MCP:stä on asiakaspalvelun automaatiossa?**

### ⚡ **MCP mahdollistaa turvallisen automaation**

#### **1. Tikettiagentit voivat toimia itsenäisesti**
- Ilman MCP:tä: AI voi vain ehdottaa toimenpiteitä
- MCP:llä: AI voi suorittaa toimenpiteitä turvallisesti

**Esimerkki: Salasanan nollaus**
1. Asiakas: "Olen unohtanut salasanani"
2. AI-agentti (MCP:llä):
   - Tarkistaa asiakkaan henkilöllisyyden
   - Lähettää nollauslinkin sähköpostiin
   - Kirjaa toimenpiteen lokiin
   - Ilmoittaa asiakkaalle: "Linkki lähetetty!"
3. Ei ihmisen väliintuloa tarvita

#### **2. Integraatiot CRM:ään, ERP:hen, tukikantoihin**
MCP:n avulla AI voi:
- **Lukea** asiakkaan historiaa CRM:stä
- **Päivittää** tiketin statusta
- **Luoda** uusia tapahtumia (esim. seurantatehtävä)
- **Hakea** relevantteja tietokanta-artikkeleita

**Ilman MCP:tä**: Kaikki manuaalista kopioimista järjestelmästä toiseen

#### **3. Monimutkaiset työnkulut (Workflows)**
MCP mahdollistaa monivaiheisen automaation:

**Esimerkki: Laskutusongelma**
1. Asiakas raportoi laskutusvirheen
2. AI hakee laskun ERP:stä (MCP)
3. AI tarkistaa sopimuksen CRM:stä (MCP)
4. AI havaitsee virheen ja korjaa sen ERP:ssä (MCP)
5. AI luo hyvityslaskun (MCP)
6. AI lähettää vahvistuksen asiakkaalle (MCP)
7. **Kaikki automaattisesti 30 sekunnissa**

### 📊 **Tehokkuushyödyt Hummille**

✅ **40-60% tiketeistä** hoidettavissa täysin automaattisesti
✅ **Säästö: 20-30h/viikko** per tiimi
✅ **Nopeus**: Vastausaika 4-6h → 30 sekuntia
✅ **Skaalautuvuus**: 3x liikevaihto ilman henkilöstölisäystä

### 🎯 **Yhteenveto**

MCP tekee automaatiosta:
- **Turvallista** (rajattu pääsy)
- **Luotettavaa** (audit-lokitus)
- **Skaalautuvaa** (lisää agentteja helposti)
- **GDPR-yhteensopivaa** (tietosuoja rakennettu sisään)`,

  "mcp-access-control": `**Kuinka MCP:n avulla hallitaan AI:n pääsyoikeuksia?**

### 🔐 **Pääsyoikeuksien hallinta MCP:ssä**

#### **1. Vähimmäisoikeuksien periaate (Principle of Least Privilege)**
Jokainen AI-agentti saa vain minimioikeudet tehtävän suorittamiseen:

**Esimerkki:**
- **Tikettien luokitteluagentti**: Voi LUKEA tikettejä, ei MUOKATA
- **Asiakastietoagentti**: Voi LUKEA asiakastietoja, ei POISTAA
- **Laskutusagentti**: Voi LUKEA laskutustietoja, LUODA hyvityslaskuja, ei MUOKATA hintoja

#### **2. Resurssitason rajaus (Resource-Level Permissions)**
AI ei saa pääsyä kaikkiin resursseihin, vain relevantteihin:

**Esimerkki:**
1. AI pyytää: "Hae asiakkaan #12345 tilaushistoria"
2. MCP tarkistaa:
   - ✓ Onko AI:lla oikeus lukea tilaushistoriaa?
   - ✓ Onko asiakkaan #12345 tiedot sallittuja tälle AI-agentille?
   - ✓ Onko pyyntö kontekstissa looginen?
3. Palauttaa vain asiakkaan #12345 tiedot, ei muita

#### **3. Ajallinen rajaus (Time-Based Access)**
AI:n oikeudet voivat olla rajoitettu aikaan:
- **Työaikana (8-17)**: Täydet oikeudet
- **Yöaikana (17-8)**: Vain lukuoikeus, ei muutoksia

#### **4. Kontekstuaalinen rajaus (Contextual Access)**
AI:n oikeudet riippuvat tilanteesta:
- **Rutiinitiketit**: AI voi käsitellä itsenäisesti
- **Herkät aiheet** (esim. riitatilanteet): Vain lukuoikeus → eskalointi ihmiselle

### 🛠️ **Käytännön toteutus Hummilla**

#### **Roolit ja oikeudet:**

**Rooli: Ticket Classifier**
- Role: ticket_classifier
- Oikeudet:
  - Tickets: read, update_tags, update_priority
  - Customers: read
  - CRM: read
  - Audit: write

**Rooli: Billing Agent**
- Role: billing_agent
- Oikeudet:
  - Invoices: read, create_credit_note
  - Customers: read
  - Payments: read
  - Audit: write

### 🚀 **Hyödyt**

✅ **Minimoitu riski**: Vahinkokaan AI-virhe ei voi aiheuttaa suurta vahinkoa
✅ **GDPR-compliance**: AI näkee vain tarvittavat tiedot
✅ **Auditointi**: Kaikki kirjataan lokiin
✅ **Skaalautuvuus**: Helppo lisätä uusia rooleja ja agentteja`,

  "mcp-deep-analysis": `**📊 MCP - Syväanalyysi: Tekninen toteutus ja vaikutus Hummille**

### 🎯 **MCP-arkkitehtuuri (korkean tason)**

\`\`\`
┌─────────────┐
│ AI-Agentti  │ (esim. Claude, GPT-4)
└──────┬──────┘
       │ Pyyntö: "Hae asiakkaan #12345 tiedot"
       ↓
┌─────────────────────────────────────┐
│ MCP Layer (Model Context Protocol) │
│  - Authentication                    │
│  - Authorization                     │
│  - Rate Limiting                     │
│  - Audit Logging                     │
└──────┬──────────────────────────────┘
       │ Validoitu pyyntö
       ↓
┌─────────────────────────────────────┐
│ Backend Systems                     │
│  - CRM (Salesforce, HubSpot)        │
│  - ERP (Netvisor, Procountor)       │
│  - Support (Intercom, Zendesk)      │
└─────────────────────────────────────┘
\`\`\`

### 🔐 **Tekninen toiminta (step-by-step)**

#### **Vaihe 1: AI-pyyntö**
- Action: get_customer
- Resource: customers/12345
- Requester: ai-agent-ticket-001
- Context: ticket_id TICKET-67890, reason: customer_inquiry

#### **Vaihe 2: MCP-validointi**
1. Autentikointi: Onko AI-agentti validi?
2. Autorisointi: Onko AI:lla oikeus?
   - Tarkista rooli: "ticket_classifier"
   - Tarkista resurssi: customers/12345
   - Tarkista toiminto: "read"
3. Rate Limiting: Onko AI tehnyt liian monta pyyntöä?
4. Loki: Kirjaa tapahtuma audit-lokiin

#### **Vaihe 3: Vastaus**
- Status: success
- Data: Customer 12345 (Acme Oy, support@acme.fi, active)
- Audit ID: AUDIT-2025-09-30-140512

### 📊 **MCP:n vaikutus Hummin liiketoimintaan**

#### **1. Kustannussäästöt**
- **Vähennetty manuaalityö**: 20-30h/viikko säästöä
- **Automaatioaste**: 40-60% tiketeistä AI-hoidetut
- **ROI**: 150-280% ensimmäisenä vuonna

#### **2. Turvallisuus ja compliance**
- **GDPR-compliance**: Täytetään EU:n tietosuoja-asetus
- **Audit-jäljet**: Kaikki AI-toiminnot lokitettuja
- **Minimoitu riski**: Rajattu pääsy estää datavuodot

#### **3. Skaalautuvuus**
- **3x liikevaihto**: €2.1M → €7.2M ilman lineaarista henkilöstölisäystä
- **Revenue per employee**: €40k → €192k
- **Asiakastyytyväisyys**: 7.2 → 8.5+

### 🛠️ **Teknologiastack Hummille (MCP-pohjainen)**

**MCP Implementation:**
- **Anthropic MCP SDK**: Natiivituki Claude-mallille
- **Cerbos**: Fine-grained access control
- **OAuth 2.0**: Autentikointi
- **JWT Tokens**: Session management

**Integraatiot:**
- **CRM**: Salesforce/HubSpot (MCP-rajapinta)
- **ERP**: Netvisor/Procountor (MCP-rajapinta)
- **Support**: Intercom/Zendesk (MCP-rajapinta)

### 🎓 **Yhteenveto**

MCP on **kriittinen teknologia** Hummin AI-transformaatiolle:
- ✅ Mahdollistaa turvallisen automaation
- ✅ Täyttää GDPR-vaatimukset
- ✅ Skaalautuu €10M+ liikevaihtoon
- ✅ Antaa asiakkaille luottamusta ("Meillä on MCP-standardi")`,

  "data-quality": `**Asiakastiedon laatu ja suojaaminen AI-projekteissa**

### 🛡️ **Tietosuojan 3 pilaria**

#### **1. Model Context Protocol (MCP) - TÄRKEÄ!**
- **Mitä**: Avoin standardi, joka määrittelee miten AI pääsee käsiksi yritysjärjestelmiin
- **Hyöty**: AI saa vain tarvitsemansa tiedot, ei kaikkea
- **Humm-esimerkki**: AI-agentti voi hakea *yhden asiakkaan* tiedot CRM:stä, ei kaikkien asiakkaiden tietoja

#### **2. Roolipohjainen pääsy (RBAC)**
- **Mitä**: Jokainen AI-agentti saa vain ne oikeudet, jotka sen tehtävän hoitamiseen tarvitaan
- **Periaate**: *Vähimmän oikeuden periaate* (Principle of Least Privilege)
- **Humm-esimerkki**: Tikettien luokitteluagentti voi *lukea* tikettejä, mutta ei *poistaa* tai *muokata* asiakastietoja

#### **3. Audit-jäljet ja läpinäkyvyys**
- **Mitä**: Kaikki AI:n toiminnot kirjataan lokiin
- **Hyöty**: GDPR-vaatimustenmukaisuus + jälkikäteen tarkastettavissa
- **Humm-esimerkki**: "AI-agentti X haki asiakkaan Y osoitetiedot CRM:stä 21.9.2025 klo 14:05 käyttäjän Z pyynnöstä"

### 📊 **Asiakastiedon laadun varmistaminen**

#### **A. Datan validointi**
- **Automaattinen tarkistus**: AI tarkistaa, että asiakkaan sähköposti on oikeassa muodossa, puhelinnumero on validi, jne.
- **Duplikaattien esto**: AI havaitsee, jos sama asiakas yrittää luoda useita tilejä

#### **B. Datan rikastaminen (Data Enrichment)**
- **AI täydentää puuttuvat tiedot**: Esim. yrityksen koko, toimiala, sijainti → haetaan julkisista lähteistä
- **Segmentointi**: AI luokittelee asiakkaat automaattisesti (esim. "Enterprise", "SME", "Startup")

#### **C. Datan siistiminen (Data Cleaning)**
- **AI poistaa virheelliset tiedot**: Esim. testikäyttäjät, botit, duplikaatit
- **Yhdenmukaistaminen**: "Oy", "OY", "Oyj" → "Oy" (yhtenäinen formaatti)

### 🔐 **GDPR-vaatimustenmukaisuus**

#### **1. Tietojen minimointi**
- **Periaate**: AI käsittelee vain *välttämättömät* tiedot
- **Humm-esimerkki**: Jos AI tarvitsee asiakkaan nimen ja sähköpostin, se ei hae myös puhelinnumeroa ja osoitetta

#### **2. Tietojen säilytysaika**
- **Periaate**: AI:n käsittelemä data poistetaan, kun sitä ei enää tarvita
- **Humm-esimerkki**: Chat-keskustelun historia säilytetään 30 päivää, sen jälkeen pseudonymisoidaan tai poistetaan

#### **3. Oikeus tietojen poistamiseen**
- **Periaate**: Asiakas voi pyytää tietojensa poistamista → AI:n pitää "unohtaa" nämä tiedot
- **Tekninen toteutus**: AI-mallit eivät tallenna henkilötietoja pysyvästi (vain viittaukset tietokantaan)`,

  "gdpr-compliance": `**Kuinka vältetään datasiilot ja GDPR-riskit AI-projekteissa?**

### 🛡️ **Datasiilot - AI:n suurin vihollinen**

#### **Mikä on datasiile?**
Tilanne, jossa yrityksen data on hajautettu eri järjestelmiin ilman yhteyttä:
- CRM: Asiakastiedot
- ERP: Laskutustiedot
- Support: Tikettitiedot
- Email: Viestintähistoria

**Ongelma AI:lle**: AI ei saa kokonaiskuvaa → huonot päätökset

### ⚡ **Ratkaisut datasiilojen murtamiseen**

#### **1. Keskitetty datavarasto (Data Lake/Warehouse)**
- **Mitä**: Kaikki data yhteen paikkaan strukturoidussa muodossa
- **Teknologia**: Snowflake, BigQuery, Azure Synapse
- **Humm-toteutus**: PostgreSQL + dbt (open source, halvempi)

#### **2. API-integraatiot MCP:llä**
- **Mitä**: AI hakee dataa reaaliajassa eri järjestelmistä turvallisesti
- **Hyöty**: Ei duplikaattidata, aina ajantasainen tieto
- **MCP takaa**: GDPR-yhteensopiva pääsy

#### **3. Customer Data Platform (CDP)**
- **Mitä**: Yhtenäinen asiakasprofiili kaikesta datasta
- **Esimerkki**: Segment, RudderStack (open source)
- **Humm-hyöty**: 360°-näkymä asiakkaasta

### 🔐 **GDPR-riskien minimointi**

#### **1. Tietosuoja-vaikutusten arviointi (DPIA)**
Ennen AI-projektia:
- ✓ Mitä henkilötietoja AI käsittelee?
- ✓ Miksi niitä tarvitaan?
- ✓ Kuinka kauan niitä säilytetään?
- ✓ Kuka pääsee niihin käsiksi?
- ✓ Miten ne suojataan?

#### **2. Privacy by Design**
- **Periaate**: Tietosuoja suunniteltu alusta alkaen, ei jälkikäteen
- **Humm-esimerkki**:
  - AI-malli ei tallenna henkilötietoja sisäisesti
  - Kaikki tiedot haetaan reaaliajassa MCP:n kautta
  - Audit-lokitus automaattinen

#### **3. Tietojen pseudonymisointi**
- **Mitä**: Henkilötiedot korvataan tunnuksilla
- **Esimerkki**: "Mikko Virtanen" → "USER_12345"
- **Hyöty**: AI voi analysoida dataa ilman henkilötietoja

#### **4. Säilytysaikojen hallinta**
- Chat-historia: 30 päivää, sitten pseudonymisointi
- Audit-lokit: 12 kuukautta, sitten arkistointi
- Asiakastiedot: Aktiivisuuden ajan, sitten poisto/anonymisointi

### ✅ **GDPR-tarkistuslista Hummille**

✅ **Tietosuojaseloste**: Kerrotaan asiakkaille miten AI käyttää dataa
✅ **Suostumus**: Asiakas antaa luvan AI-käsittelyyn
✅ **Oikeus tietojen poistamiseen**: Asiakas voi pyytää "AI:n unohtamaan" tiedot
✅ **Oikeus tietojen siirrettävyyteen**: Data voidaan viedä ulos
✅ **Audit-jäljet**: Kaikki AI-toiminnot lokitettu
✅ **MCP-standardi**: Rajattu pääsy tietoihin

### 🚀 **Tulokset**

✅ **GDPR-compliance**: Vältetään €20M sakot
✅ **Asiakasluottamus**: "Meillä on tietosuoja kunnossa"
✅ **Tehokkuus**: Ei datasiiloja → paremmat AI-tulokset`,

  "hyperpersonalization-trend": `**🎯 Hyperpersonointi mullistaa asiakaskokemuksen - Hummin strateginen mahdollisuus**

### **Mikä on hyperpersonointi?**

Hyperpersonointi on perinteisen personoinnin seuraava evoluutio. Se yhdistää tekoälyn, reaaliaikaisen datan ja syvän kontekstin ymmärryksen luodakseen ainutlaatuisen, juuri sinulle räätälöidyn kokemuksen.

Kyse ei ole enää vain siitä, että AI muistaa nimesi - vaan siitä, että se **ymmärtää sinua**:
- 🤖 **Ennustava älykkyys** - AI tietää mitä tarvitset ennen kuin kysyt
- 📊 **Reaaliaikainen tilannetaju** - Reagoi siihen mitä tapahtuu juuri nyt
- 🎭 **Syväkontekstin hallinta** - Muistaa historian, tunnistaa tunnelman
- ⚡ **Saumaton kokemus** - Ei enää "odottakaa hetki, tarkistan..."

**Käytännön esimerkki Hummille:**

Asiakas Mikko avaa chat-ikkunan. AI tunnistaa välittömästi:
- Historia: Aikaisempi vuorovaikutus, kysymysten tyyppi
- Konteksti: Juuri tehty tilaus, todennäköinen kysymys
- Tunnetila: Nopea kirjoitustyyli → kiireinen, haluaa nopean vastauksen
- Tarve: Todennäköisimmin kysyy toimitusajasta tai seurannasta

AI aloittaa proaktiivisesti: *"Hei Mikko! Näen että tilasit juuri äsken. Toimitusaika on muutama arkipäivä, ja saat seurantakoodin sähköpostiin kun paketti lähtee. Oliko tämä mitä hait vai voinko auttaa jossain muussa?"*

Mikko ei joudu selittämään tilannettaan - järjestelmä jo tietää.

### **💰 Liiketoimintavaikutus Hummille**

**Nykytilanne:**
- Yleispalvelu: Sama kokemus kaikille
- Asiakkaat toistavat tietojaan uudelleen ja uudelleen
- Vastausajat hitaita, koska kontekstin selvittäminen vie aikaa
- Asiakastyytyväisyys hyvä, mutta ei poikkeuksellinen

**Hyperpersonoinnin jälkeen:**
- **Liikevaihdon kasvu**: Merkittävä nousu kun asiakkaat pysyvät ja ostavat enemmän
- **Asiakaspysyvyys**: Huomattava parannus - asiakkaat eivät vaihda kilpailijalle
- **Tyytyväisyys**: Siirrytään "hyvästä" "erinomaiseen" - asiakkaat kertovat muille
- **Upsell-mahdollisuudet**: AI tunnistaa oikeat hetket lisämyynnille luonnollisesti
- **Suositteluindeksi**: Merkittävä nousu - asiakkaat suosittelevat aktiivisesti

**Investoinnin tuotto:**
Hyperpersonointi vaatii alkuinvestoinnin AI-alustaan, datan integrointiin ja järjestelmien yhteensopivuuteen. Tuotto näkyy jo ensimmäisenä vuonna merkittävänä kasvuna asiakastyytyväisyydessä, pysyvyydessä ja myynnissä.

### **🛠️ Teknologiastack hyperpersonointiin**

**1. Data-keruu**
- CRM (asiakashistoria, demografiat)
- Support-järjestelmä (tikettien historia)
- Web analytics (käyttäytyminen sivulla)
- Email/chat-historia

**2. AI-moottorit**
- **Ennustemalli**: Mitä asiakas todennäköisesti kysyy?
- **Sentiment analysis**: Mikä on tunnelma?
- **Recommendation engine**: Mitä ehdottaa?
- **NLP**: Ymmärtää yksilölliset tavat ilmaista asiat

**3. Personointi-logiikka**
- Asiakassegmentit (VIP, uusi, riski-churn, happy)
- Real-time scoring (miten tärkeä yhteydenotto?)
- Konteksti (kellonai ka, laite, kanava)
- A/B-testaus (mikä toimii kenellekin?)

### **📈 Vaiheistettu toteutus Hummille**

**Vaihe 1: Perus-personointi (Q2)**
- Järjestelmä muistaa asiakkaan nimen ja historian
- Agentit näkevät kontekstin välittömästi
- Automaattinen tervehdys mukautettu tilanteen mukaan
- **Alkuinvestointi** AI-työkaluihin ja integraatioihin
- **Tulokset**: Asiakastyytyväisyys ja reagointinopeus paranevat selvästi

**Vaihe 2: Ennakoiva personointi (Q3-Q4)**
- AI alkaa ennustaa mitä asiakas kysyy
- Suositellut vastaukset valmiina agentille
- Proaktiiviset viestit: "Tilauksesi viivästyy, pahoittelut!"
- **Kehitysinvestointi** ennakoiviin malleihin
- **Tulokset**: Tyytyväisyys jatkaa nousuaan, asiakaspysyvyys paranee

**Vaihe 3: Täysi hyperpersonointi (2026)**
- Äänensävy ja viestintätyyli mukautettu jokaiselle
- Kanavavalinnat optimoitu (chat / puhelin / email)
- Upsell-tarjoukset yksilöllisiä ja luonnollisia
- **Skaalausvaihe** - laajennetaan koko asiakaskuntaan
- **Tulokset**: Huippuluokan asiakaskokemus, vahva kilpailuetu

### **🎯 Kilpailuetu**

**Miksi juuri nyt on oikea aika?**
- 🕐 **Aikaikkunan hyödyntäminen**: Kilpailijat eivät vielä tee tätä Suomessa systemaattisesti
- 💪 **Hummin vahvuus**: Tunnette asiakkaanne jo hyvin - rakennusainekset ovat olemassa
- 🚀 **Teknologian kypsyminen**: AI-työkalut ovat nyt saavutettavia ja helppokäyttöisiä
- 📊 **Selkeä mittaaminen**: Vaikutukset näkyvät suoraan tyytyväisyydessä ja liiketoiminnassa

**Todellisia esimerkkejä maailmalta:**
- **Amazon**: 35% myynnistä tulee personoiduista suosituksista
- **Netflix**: 80% katsotusta sisällöstä personoitu
- **Spotify**: Discover Weekly -personointi lisäsi käyttöaikaa 24%
- **Sephora**: Hyperpersonointi nosti konversiota 11%

### **⚠️ Riskit ja haasteet**

**1. Yksityisyys**
- ❌ Riski: "Liian tunkeileva", "Big Brother" -tunne
- ✅ Ratkaisu: Täysi läpinäkyvyys, asiakkaalla aina kontrolli, GDPR-yhteensopivuus

**2. Data-laatu**
- ❌ Riski: Huono data tuottaa huonoja suosituksia
- ✅ Ratkaisu: Data-siivous ensin, ihminen pysyy päätöksenteon ytimessä

**3. Monimutkaisuus**
- ❌ Riski: Liian monimutkainen hallita ja ylläpitää
- ✅ Ratkaisu: Aloitetaan yksinkertaisesta, kasvatetaan orgaanisesti

### **💡 Yhteenveto**

**Hyperpersonointi EI ole tulevaisuutta - se on NYT.**

Hummilla on kaikki edellytykset menestyä:
✅ Vahva asiakasdata jo olemassa
✅ Sitoutuneet asiakkaat jotka luottavat teihin
✅ Motivoitunut tiimi halukas oppimaan
✅ Selkeä kasvutavoite ja visio

**Seuraavat konkreettiset askeleet:**
1. Kartoita olemassa oleva data (CRM, tukijärjestelmä, chat-historiat)
2. Valitse pilottiryhmä uskollisista asiakkaista
3. Rakenna ja testaa prototyyppi nopeasti
4. Mittaa vaikutus systemaattisesti (CSAT, NPS, retention)
5. Skaalaa onnistuneet mallit koko asiakaskuntaan

**Tavoite**: Olla Suomen tunnetuin ja arvostetuin hyperpersonoidun asiakaspalvelun edelläkävijä.`,

  "proactive-service-trend": `**⚡ Proaktiivinen asiakaspalvelu - Vuoden 2025 megatrendi**

### **Mikä on proaktiivinen asiakaspalvelu?**

Perinteinen malli: Asiakas ottaa yhteyttä → Yritys reagoi
**Proaktiivinen malli: Yritys havaitsee ongelman → Ottaa yhteyttä ensin**

**Esimerkki Hummille:**
- AI havaitsee: Asiakkaan laskutus on viivästynyt 2 päivää
- Järjestelmä lähettää automaattisesti: *"Hei Minna! Huomasimme että laskusi on myöhässä. Haluatko että jatketaan maksuaikaa? Klikkaa tästä."*
- Asiakas: Ei tarvinnut soittaa, ongelma ratkaistu ennen kuin se ärsytti

### **📊 Miksi juuri nyt on proaktiivisuuden aika?**

**Kolme muutosvoimaa:**

1. **AI on saavuttanut kypsyystason**
   - Modernit mallit (GPT-4, Claude Sonnet) ymmärtävät kontekstin syvällisesti
   - Ennustemallit ovat luotettavia ja tarkkoja
   - Reaaliaikainen data-analyysi on tehokasta ja saavutettavaa

2. **Asiakkaiden odotukset ovat evoluoituneet**
   - Tottunut Amazonin ja Netflixin ennakoivaan palveluun
   - Turhautuu jos joutuu toistamaan tietojaan
   - Arvostaa yrityksiä jotka "muistavat ja ymmärtävät"

3. **Kilpailuetu on mitattavissa**
   - Proaktiiviset yritykset saavat merkittävästi paremmat asiakastyytyväisyyspisteet
   - Asiakkaiden pysyvyys paranee huomattavasti
   - Lisämyyntimahdollisuudet kasvavat luonnollisesti

### **💰 Liiketoimintavaikutus Hummille**

**Visio: Proaktiivinen palvelu käyttöön tänä vuonna**

**Kustannushyödyt:**
- **Tikettien määrä vähenee**: Ongelmat ratkaistaan ennen kuin asiakas ehtii ottaa yhteyttä
- **Skaalautuvuus**: Kasvu ei vaadi yhtä paljon henkilöstölisäystä
- **Tehokkuus**: Merkittäviä säästöjä vuositasolla

**Tuottohyödyt:**
- **Asiakaspysyvyys paranee**: Asiakkaat pysyvät tyytyväisinä ja uskollisina
- **Lisämyynti kasvaa**: Proaktiiviset tarjoukset oikeaan aikaan
- **Brändi vahvistuu**: "Premium-palvelu" tuo hinnoitteluvoimaa
- **Kokonaisvaikutus**: Merkittävä positiivinen vaikutus liikevaihtoon

**Investoinnin tuotto:**
Alkuinvestointi AI-alustaan, integraatioihin ja testaukseen tuottaa ensimmäisenä vuonna merkittävän tuoton sekä säästöinä että lisätuloina.

### **🛠️ Tekninen toteutus**

**1. Data-lähteet**
- CRM: Asiakkaan historia, segmentit
- Support: Tiketit, chat-historia
- Product: Käyttödata, lokit, virheet
- Finance: Laskutus, maksut, viivästykset

**2. AI-moottorit**
- **Anomaly detection**: Tunnistaa poikkeamat (esim. viivästynyt maksu)
- **Predictive analytics**: Ennustaa churn-riski
- **Sentiment analysis**: Tunnistaa turhautunut asiakas
- **Recommendation engine**: Mitä tarjota proaktiivisesti?

**3. Toimintalogiikka**

Esimerkkejä proaktiivisista triggereistä:
- Jos asiakkaan maksu myöhässä + aikaisemmin ollut ongelmia → Lähetä: "Hei, huomasimme ongelman. Voimme auttaa."
- Jos asiakas ei ole kirjautunut 30 päivään + VIP-asiakas → Lähetä: "Hei, kaipaamme sinua! Tässä -20% koodi."
- Jos asiakkaan käyttö laskenut 40% + turhautunut chat-historia → Soita: "Hei, haluamme varmistaa että kaikki on kunnossa."

### **📈 Vaiheistettu toteutus**

**Vaihe 1: Yksinkertaiset automaatiot (Q2)**
- Automaattinen viesti jos lasku myöhässä
- Proaktiivinen "Kiitos tilauksesta" -vahvistus
- **Alkuinvestointi** perustriggereihin
- **Tulokset**: Tikettimäärä laskee selvästi

**Vaihe 2: AI-ennusteet (Q3-Q4)**
- Churn-riski ennustaminen → Soitto ennen irtisanomista
- Upsell-tilaisuudet → Personoitu tarjous oikeaan aikaan
- **Kehitysinvestointi** ennustaviin malleihin
- **Tulokset**: Tikettimäärä laskee edelleen, pysyvyys paranee

**Vaihe 3: Täysi älyautomaatio (2026)**
- AI päättää autonomisesti milloin ja miten ottaa yhteyttä
- Kanavavalinnat optimoidaan asiakaskohtaisesti (chat / puhelin / email)
- **Ylläpitovaihe** - jatkuva kehitys ja optimointi
- **Tulokset**: Minimaalinen tikettimäärä, maksimaalinen asiakaspysyvyys

### **🎯 Case-esimerkit**

**1. Nordea (Suomi)**
- Proaktiivinen ilmoitus: "Tilisi saldo on alhainen"
- Tulos: 15% vähennys tukipuheluissa

**2. Elisa (Suomi)**
- Proaktiivinen viesti: "Datasi on käytössä 90%, haluatko lisää?"
- Tulos: +18% data-lisäpakettien myynti

**3. Alibaba (Kiina)**
- AI ennustaa asiakkaan kysymyksen ennen chatin avaamista
- Tulos: 95% tiketeistä automatisoitu

**4. Amazon**
- "Tilauksesi viivästyy" - viesti lähetetään ennen kuin asiakas huomaa
- Tulos: 22% parempi CSAT kuin reaktiivinen palvelu

### **⚠️ Sudenkuopat**

**1. "Liian tunkeileva"**
- ❌ Väärä: Lähetetään viestejä liikaa
- ✅ Oikein: Anna asiakkaan valita tiheys (asetukset)

**2. "Väärät ennusteet"**
- ❌ Väärä: AI ehdottaa vääriä asioita → ärsyttää
- ✅ Oikein: Ihminen loopissa, varmista tarkkuus 85%+

**3. "Kallis ylläpito"**
- ❌ Väärä: Monimutkainen järjestelmä → vaikea hallita
- ✅ Oikein: Aloita yksinkertaisista triggereistä, kasvata asteittain

### **💡 Yhteenveto: Miksi Hummin pitää toimia JUURI NYT**

**Aikaikkunan hyödyntäminen:**
- Kilpailijat eivät vielä tee tätä systemaattisesti Suomessa
- Asiakkaat odottavat tätä (tottuneet Amazonin ja Netflixin tasoon)
- Teknologia on saavuttanut kypsyystason ja on saavutettavissa

**Visio vuodelle 2026:**
- Merkittävä osa tiketeistä hoidetaan proaktiivisesti
- Asiakaspysyvyys paranee dramaattisesti
- Asiakastyytyväisyys nousee huippuluokkaan
- Suositteluindeksi kasvaa voimakkaasti

**Seuraavat konkreettiset askeleet:**
1. Listatkaa 10 tärkeintä käyttötapausta (esim. laskun viivästyminen, tilausstatukset)
2. Rakentakaa nopea prototyyppi yhdelle käyttötapaukselle
3. Testatkaa pienellä pilottiryhmällä uskollisia asiakkaita
4. Skaalatkaa onnistuneet mallit koko asiakaskuntaan vaiheittain`,

  "cx-trends-2025-featured": `**📈 2025 suurimmat CX-trendit ja AI:n rooli - Strateginen näkemys**

Olemme 2025 käännekohdassa: AI ei ole enää "kokeilu" vaan "pakollinen". Tässä trendit jotka määrittävät voittajat ja häviäjät:

### **🔥 Top 5 CX-trendit 2025**

#### **1. Hyperpersonointi (AI-pohjainen)**
- **Mitä**: Jokainen asiakas saa ainutlaatuisen, juuri hänelle räätälöidyn kokemuksen
- **AI:n rooli**: Analysoi dataa reaaliajassa, ennustaa tarpeet ennen kysymistä
- **Vaikutus Hummille**: Asiakastyytyväisyys nousee merkittävästi, lisämyynti kasvaa luonnollisesti
- **Esimerkit**: Netflix (personoidut ehdotukset), Spotify (Discover Weekly)

#### **2. Proaktiivinen asiakaspalvelu**
- **Mitä**: Yritys ratkaisee ongelman ennen kuin asiakas edes huomaa sen
- **AI:n rooli**: Tunnistaa anomaliat automaattisesti, lähettää varoituksen ja ratkaisun
- **Vaikutus**: Tukipyyntöjen määrä laskee huomattavasti, asiakaspysyvyys paranee
- **Esimerkit**: Amazon ("Paketti viivästyy"), Nordea ("Tilisi saldo alhainen")

#### **3. Ääni- ja video-AI (uusi kanava)**
- **Mitä**: AI kommunikoi puheella, ei pelkästään tekstillä
- **AI:n rooli**: Reaaliaikainen puheentunnistus, tunneanalyysi, luonnolliset vastaukset
- **Vaikutus**: Puhelut automatisoituvat merkittävästi, odotusajat lyhenevät dramaattisesti
- **Esimerkit**: Google Duplex, ElevenLabs (voice cloning)

#### **4. Emotional AI (tunnepohjainen)**
- **Mitä**: AI tunnistaa asiakkaan tunnetilan ja mukautuu sen mukaan
- **AI:n rooli**: Tunneanalyysi, empatia-painotteiset vastaukset
- **Vaikutus**: Tyytyväisyys kasvaa, eskalointien määrä laskee selvästi
- **Esimerkit**: Hume AI (emotion recognition), Affectiva

#### **5. Autonomiset AI-agentit**
- **Mitä**: AI hoitaa kokonaisia prosesseja itsenäisesti alusta loppuun
- **AI:n rooli**: Ei vain vastaa kysymyksiin, vaan "tekee asioita" (esim. käsittelee palautuksen)
- **Vaikutus**: Valtaosa tiketeistä automatisoituu, skaalautuvuus kasvaa moninkertaiseksi
- **Esimerkit**: Shopify Sidekick, Intercom Fin

### **💡 Miksi nämä trendit ovat KRIITTISIÄ Hummille?**

**Nykytilanne:**
- Asiakastyytyväisyys hyvällä tasolla, mutta ei poikkeuksellinen
- Manuaalinen työ hallitsee operatiivista toimintaa
- Skaalautuminen vaatii merkittäviä henkilöstöresursseja

**Jos Humm EI reagoi muutokseen:**
- Kilpailijat ottavat AI:n käyttöön ja nostavat rimaa
- Asiakkaiden odotukset kasvavat (Amazon, Netflix asettavat standardin)
- Kustannusrakenne ei tue kasvutavoitteita
- **Tulos: Jäädään jälkeen kilpailussa, kasvu hidastuu**

**Jos Humm johtaa muutosta:**
- Hyperpersonointi → Asiakastyytyväisyys nousee merkittävästi
- Proaktiivisuus → Tikettimäärä laskee huomattavasti
- Ääni-AI → Automaatio kasvaa voimakkaasti
- Emotional AI → Asiakaspysyvyys paranee selvästi
- Autonomiset agentit → Skaalautuvuus moninkertaistuu
- **Tulos: Vahva kasvu sekä liikevaihdossa että kannattavuudessa**

### **🛠️ Teknologiastack 2025**

**Frontend (Asiakasrajapinta):**
- **Chat**: OpenAI GPT-4 Turbo / Anthropic Claude
- **Voice**: ElevenLabs (voice synthesis), Whisper (transkriptio)
- **Sentiment**: Hume AI, Azure Cognitive Services

**Backend (AI-moottori):**
- **Orchestration**: LangChain, Semantic Kernel
- **Vector DB**: Pinecone, Weaviate (asiakasdata)
- **Analytics**: Mixpanel, Amplitude (CX-mittarit)

**Integraatiot:**
- **CRM**: Salesforce, HubSpot (asiakashistoria)
- **Support**: Zendesk, Intercom (tiketti-historia)
- **MCP-protokolla**: Turvallinen pääsy dataan

### **📊 Benchmarkit: Mitä kilpailijat tekevät?**

**Suomi:**
- **Elisa**: AI-chat (GPT-4), 40% tiketeistä automatisoitu
- **Nordea**: Proaktiiviset ilmoitukset, -15% tukipyynnöt
- **OP**: Ääni-AI testissä, tavoite 60% automaatio 2026

**Kansainväliset:**
- **Zendesk**: Fin AI → 70-80% tiketeistä autonomisesti
- **Intercom**: Fin AI + Copilot → +40% agent-tuottavuus
- **Shopify**: Sidekick AI-agentti → 3x liikevaihdon kasvu ilman henkilöstölisäystä

**Hummin tilanne:**
- Olemme jäljessä Suomessa
- Mutta: Pienempi organisaatio = ketterämpi
- **Mahdollisuus: Ohittaa suuremmat kilpailijat 12-18 kuukaudessa**

### **🎯 Strateginen roadmap Hummille**

**Q2: Perusta**
- Chat-AI käyttöön (GPT-4 / Claude)
- Yksinkertainen personointi asiakashistorian perusteella
- **Alkuinvestointi** AI-alustaan ja integraatioihin
- **Tavoite**: Merkittävä osa tiketeistä automatisoituu

**Q3-Q4: Skaalaus**
- Hyperpersonointi täyteen käyttöön
- Proaktiivinen palvelu aktivoituu
- Ääni-AI pilotoidaan valituilla asiakkailla
- **Kehitysinvestointi** edistyneempiin ominaisuuksiin
- **Tavoite**: Automaatio kattaa yli puolet operaatioista

**2026: Edelläkävijyys**
- Emotional AI tunnistaa ja reagoi tunnetiloihin
- Autonomiset agentit hoitavat kokonaisia prosesseja
- Ympärivuorokautinen AI-pohjainen palvelu
- **Ylläpito ja jatkokehitys**
- **Tavoite**: Laaja automaatio, voimakas liikevaihdon kasvu**

### **⚠️ Riskit**

**1. Liian nopea skaalaus**
- ❌ Väärä: Kaikki kerralla → chaos
- ✅ Oikein: Vaiheittainen, pilotit ensin

**2. Asiakasvastarinta**
- ❌ Väärä: "AI hoitaa kaiken" → asiakkaat tyytymättömiä
- ✅ Oikein: Hybridimalli (AI + ihminen valittavissa)

**3. Henkilöstön vastarinta**
- ❌ Väärä: "AI korvaa työntekijät" → pelko
- ✅ Oikein: "AI avustaa" → työtyytyväisyys nousee

### **💡 Yhteenveto: Miksi juuri nyt on ratkaiseva hetki**

**Kolme kriittistä tekijää:**

1. **Teknologia on saavuttanut kypsyystason**: GPT-4, Claude, ElevenLabs ja muut ratkaisut ovat tuotantovalmiita ja luotettavia
2. **Asiakkaat odottavat enemmän**: Amazon ja Netflix ovat asettaneet uuden standardin - asiakkaat odottavat samaa kaikilta
3. **Aikaikkunan hyödyntäminen**: Nyt on hetki erottua - ennen kuin kaikki kilpailijat tekevät samaa

**Hummin strateginen valinta:**
- **Polku A**: Odottaminen ja reaktiivinen toiminta → Jäädään jälkeen kilpailussa
- **Polku B**: Proaktiivinen muutosjohtajuus nyt → Edelläkävijäasema markkinalla

**Visio vuodelle 2026:**
- Olla Suomen tunnistetuin modernin asiakaskokemuksen edelläkävijä
- Vahva kasvu sekä liikevaihdossa että kannattavuudessa
- Huippuluokan asiakastyytyväisyys ja -suosittelut

**Seuraavat konkreettiset askeleet:**
1. Valitse yksi pilottitrendi (suositus: Hyperpersonointi tai Proaktiivinen palvelu)
2. Rakenna nopea prototyyppi todellisilla asiakkailla
3. Testaa pienellä pilottiryhmällä uskollisia asiakkaita
4. Mittaa systemaattisesti vaikutukset (tyytyväisyys, pysyvyys, liiketoiminta)
5. Skaalaa onnistuneet mallit asteittain koko asiakaskuntaan`
};

// MCP (Model Context Protocol) - TÄRKEÄ!
const mcpQuestions: QuestionButton[] = [
  {
    id: "mcp-what-is",
    question: "Mikä on MCP?",
    category: "mcp",
    icon: HelpCircle,
    color: "bg-emerald-500"
  },
  {
    id: "mcp-security",
    question: "Miten MCP parantaa AI-integraatioiden turvallisuutta?",
    category: "mcp",
    icon: Shield,
    color: "bg-emerald-500"
  },
  {
    id: "mcp-automation",
    question: "Mitä hyötyä MCP:stä on asiakaspalvelun automaatiossa?",
    category: "mcp",
    icon: Cpu,
    color: "bg-emerald-500"
  },
  {
    id: "mcp-access-control",
    question: "Kuinka MCP:n avulla hallitaan AI:n pääsyoikeuksia?",
    category: "mcp",
    icon: Scale,
    color: "bg-emerald-500"
  },
  {
    id: "mcp-deep-analysis",
    question: "📊 Syväanalyysi MCP",
    category: "mcp",
    icon: FileText,
    color: "bg-emerald-500"
  }
];

const topicAreas: TopicArea[] = [
  {
    id: "leadership-faq",
    title: "⭐ Suositut kysymykset johdolle",
    icon: Star,
    color: "bg-gradient-to-r from-blue-600 to-emerald-600",
    questions: [
      {
        id: "faq-10m-goal",
        question: "Miten saavutamme 10M€ liikevaihdon?",
        category: "leadership",
        icon: Target,
        color: "bg-blue-600"
      },
      {
        id: "faq-ai-cost-roi",
        question: "Paljonko AI-transformaatio maksaa ja mikä on ROI?",
        category: "leadership",
        icon: DollarSign,
        color: "bg-emerald-600"
      },
      {
        id: "faq-ai-start",
        question: "Mistä aloitamme AI-implementaation?",
        category: "leadership",
        icon: Rocket,
        color: "bg-purple-600"
      },
      {
        id: "faq-ai-use-cases",
        question: "Mitkä ovat AI:n tärkeimmät käyttökohteet Hummille?",
        category: "leadership",
        icon: Zap,
        color: "bg-orange-600"
      },
      {
        id: "faq-risks",
        question: "Mitkä ovat suurimmat riskit ja miten ne hallitaan?",
        category: "leadership",
        icon: Shield,
        color: "bg-red-600"
      }
    ]
  },
  {
    id: "trends-2025",
    title: "🚀 Trendit 2025",
    icon: TrendingUp,
    color: "bg-gradient-to-r from-purple-600 to-orange-600",
    questions: [
      {
        id: "hyperpersonalization-trend",
        question: "🎯 Kuinka hyperpersonointi mullistaa asiakaskokemuksen 2025?",
        category: "general",
        icon: Target,
        color: "bg-purple-600"
      },
      {
        id: "proactive-service-trend",
        question: "⚡ Miksi proaktiivinen asiakaspalvelu on vuoden 2025 megatrendi?",
        category: "general",
        icon: Zap,
        color: "bg-orange-600"
      },
      {
        id: "cx-trends-2025-featured",
        question: "📊 2025 suurimmat CX-trendit ja AI:n rooli",
        category: "general",
        icon: BarChart3,
        color: "bg-blue-600"
      }
    ]
  },
  {
    id: "strategy-roi",
    title: "Strategia & ROI",
    icon: TrendingUp,
    color: "bg-slate-600",
    questions: [
      {
        id: "roi-measurement",
        question: "Miten AI-investoinnista saa mitattavaa arvoa asiakaspalvelussa?",
        category: "strategy-roi",
        icon: DollarSign,
        color: "bg-slate-600"
      },
      {
        id: "cx-trends-2025",
        question: "Mitkä ovat vuoden 2025 suurimmat CX-trendit?",
        category: "strategy-roi",
        icon: TrendingUp,
        color: "bg-slate-600"
      }
    ]
  },
  {
    id: "data-privacy",
    title: "Data & tietosuoja",
    icon: Database,
    color: "bg-purple-500",
    questions: [
      {
        id: "data-quality",
        question: "Miten varmistetaan, että asiakasdata pysyy laadukkaana ja suojattuna?",
        category: "data-privacy",
        icon: Shield,
        color: "bg-purple-500"
      },
      {
        id: "gdpr-compliance",
        question: "Kuinka vältetään datasiilot ja GDPR-riskit AI-projekteissa?",
        category: "data-privacy",
        icon: Scale,
        color: "bg-purple-500"
      }
    ]
  },
  {
    id: "automation-workflows",
    title: "Automaatio & työnkulut",
    icon: Workflow,
    color: "bg-green-500",
    questions: [
      {
        id: "reduce-manual-work",
        question: "Miten automaatio voi vähentää manuaalista työtä asiakaspalvelussa?",
        category: "automation-workflows",
        icon: Workflow,
        color: "bg-green-500"
      },
      {
        id: "ticket-classification",
        question: "Mitä hyötyä on AI:sta tikettien luokittelussa ja reitityksessä?",
        category: "automation-workflows",
        icon: Target,
        color: "bg-green-500"
      }
    ]
  },
  {
    id: "bots-agents",
    title: "Botit & agentit",
    icon: Bot,
    color: "bg-orange-500",
    questions: [
      {
        id: "bot-vs-agent",
        question: "Mikä ero on chatbotilla ja AI-agentilla?",
        category: "bots-agents",
        icon: Bot,
        color: "bg-orange-500"
      },
      {
        id: "escalation-timing",
        question: "Milloin kannattaa eskaloida botti-asiakaspalvelusta ihmiselle?",
        category: "bots-agents",
        icon: Users,
        color: "bg-orange-500"
      }
    ]
  },
  {
    id: "voice-phone",
    title: "Ääni & puhelin",
    icon: Phone,
    color: "bg-pink-500",
    questions: [
      {
        id: "asr-sentiment",
        question: "Miten puheentunnistus (ASR) ja sentimenttianalyysi voivat parantaa puhelinpalvelua?",
        category: "voice-phone",
        icon: Phone,
        color: "bg-pink-500"
      },
      {
        id: "call-summary",
        question: "Kuinka automaattinen yhteenveto helpottaa agentin työtä puhelun jälkeen?",
        category: "voice-phone",
        icon: MessageCircle,
        color: "bg-pink-500"
      }
    ]
  },
  {
    id: "hyperpersonalization",
    title: "Hyperpersoonallistaminen",
    icon: Heart,
    color: "bg-red-500",
    questions: [
      {
        id: "realtime-recommendations",
        question: "Miten AI voi tarjota asiakkaille räätälöityjä suosituksia reaaliajassa?",
        category: "hyperpersonalization",
        icon: Crosshair,
        color: "bg-red-500"
      },
      {
        id: "proactive-communication",
        question: "Kuinka proaktiivinen viestintä lisää asiakastyytyväisyyttä?",
        category: "hyperpersonalization",
        icon: Zap,
        color: "bg-red-500"
      }
    ]
  },
  {
    id: "agent-quality",
    title: "Agenttien laatu & koulutus",
    icon: GraduationCap,
    color: "bg-indigo-500",
    questions: [
      {
        id: "quality-assessment",
        question: "Miten AI voi arvioida ja parantaa asiakaspalvelijan laatua?",
        category: "agent-quality",
        icon: Star,
        color: "bg-indigo-500"
      },
      {
        id: "agent-assist-training",
        question: "Voiko agent-assist toimia myös koulutusvälineenä?",
        category: "agent-quality",
        icon: GraduationCap,
        color: "bg-indigo-500"
      }
    ]
  },
  {
    id: "case-library",
    title: "Case-kirjasto",
    icon: BookOpen,
    color: "bg-cyan-500",
    questions: [
      {
        id: "successful-cases",
        question: "Mitä voimme oppia onnistuneista AI-caseista asiakaspalvelussa?",
        category: "case-library",
        icon: BookOpen,
        color: "bg-cyan-500"
      },
      {
        id: "failed-projects",
        question: "Miksi osa AI-projekteista epäonnistuu CX:ssä?",
        category: "case-library",
        icon: Target,
        color: "bg-cyan-500"
      }
    ]
  },
  {
    id: "technology-integrations",
    title: "Teknologia & integraatiot",
    icon: Cpu,
    color: "bg-teal-500",
    questions: [
      {
        id: "required-technologies",
        question: "Mitä teknologioita tarvitaan AI:n integrointiin asiakaspalveluun?",
        category: "technology-integrations",
        icon: Cpu,
        color: "bg-teal-500"
      },
      {
        id: "platform-integration",
        question: "Miten Intercom, CRM ja CCaaS voidaan yhdistää tekoälyn avulla?",
        category: "technology-integrations",
        icon: Globe,
        color: "bg-teal-500"
      }
    ]
  },
  {
    id: "governance-ethics",
    title: "Hallintamalli & eettisyys",
    icon: Scale,
    color: "bg-slate-500",
    questions: [
      {
        id: "ethical-ai",
        question: "Miten varmistetaan tekoälyn eettinen käyttö asiakaspalvelussa?",
        category: "governance-ethics",
        icon: Scale,
        color: "bg-slate-500"
      },
      {
        id: "decision-responsibility",
        question: "Kuka vastaa tekoälyn tekemistä päätöksistä CX-yrityksessä?",
        category: "governance-ethics",
        icon: Users,
        color: "bg-slate-500"
      }
    ]
  }
];

const contextConfig = {
  strategic: {
    label: "Strategiset trendit",
    icon: TrendingUp,
    color: "bg-slate-600 hover:bg-slate-700",
    description: "2025 AI-trendit ja tulevaisuuden näkymät"
  },
  practical: {
    label: "Käytännön toteutus",
    icon: Wrench,
    color: "bg-green-500 hover:bg-green-600",
    description: "Konkreettiset case-esimerkit ja tulokset"
  },
  finnish: {
    label: "Suomalainen näkökulma",
    icon: MapPin,
    color: "bg-orange-500 hover:bg-orange-600",
    description: "Soveltaminen Suomen markkinoilla"
  },
  planning: {
    label: "Strateginen suunnittelu",
    icon: Target,
    color: "bg-purple-500 hover:bg-purple-600",
    description: "Humm.fi:n seuraavat askeleet"
  },
  technical: {
    label: "Tekninen toteutus",
    icon: Cpu,
    color: "bg-emerald-500 hover:bg-emerald-600",
    description: "MCP ja teknologiset ratkaisut"
  },
  mcp: {
    label: "Model Context Protocol",
    icon: Shield,
    color: "bg-emerald-600 hover:bg-emerald-700",
    description: "MCP-spesifinen tieto ja ohjeistus"
  },
  general: {
    label: "Yleinen",
    icon: Bot,
    color: "bg-gray-500 hover:bg-gray-600",
    description: "Yleiset kysymykset"
  }
};

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      content: "**Tervetuloa Hummin Johdon Co-Pilotiin!** 🚀\n\nOlen proaktiivinen AI-assistentti, joka on suunniteltu tukemaan Humm Groupin johtoa strategisessa päätöksenteossa, taloudellisessa analyysissa ja AI-implementaatiossa.\n\n**Mitä voin tehdä sinulle:**\n- 📊 Analysoida taloudellisia lukuja ja KPI:ta (liikevaihto, käyttökate, kannattavuus)\n- 🎯 Tarjota strategisia suosituksia perustuen dataan ja benchmarkeihin\n- 🤖 Auttaa AI-implementaation suunnittelussa ja priorisoinnissa\n- 🔒 Neuvoa MCP-protokollassa ja tietoturva-asioissa\n- 💡 Tunnistaa mahdollisuuksia ja riskejä proaktiivisesti",
      isUser: false,
      timestamp: Date.now()
    },
    {
      content: "Alla olevista teemoista löydät valmiita kysymyksiä eri aihepiireistä. Voit myös kirjoittaa oman kysymyksesi suoraan - olen koulutettu ymmärtämään Hummin liiketoimintaa, taloudellista tilannetta ja kehitystarpeita syvällisesti.",
      isUser: false,
      timestamp: Date.now() + 1
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [selectedContext, setSelectedContext] = useState<ContextType>("general");
  const [isExpanded, setIsExpanded] = useState(false);
  const [mcpModalOpen, setMcpModalOpen] = useState(false);
  const [followUpSuggestions, setFollowUpSuggestions] = useState<string[]>([]);
  const [placeholderText, setPlaceholderText] = useState("Kysy mitä tahansa AI-asiakaspalvelusta johdolle...");

  // Striimaavat placeholder-kysymykset
  const rotatingQuestions = [
    "Kysy mitä tahansa AI-asiakaspalvelusta johdolle...",
    "Mikä on ROI AI-investoinnille asiakaspalvelussa?",
    "Millä aikataululla voimme toteuttaa AI-asiakaspalvelun?",
    "Mitä riskejä AI-asiakaspalvelussa on?",
    "Kuinka paljon AI-asiakaspalvelu maksaa?",
    "Mitä teknisiä vaatimuksia AI-toteutuksella on?",
    "Kuinka integroida AI olemassa oleviin järjestelmiin?",
    "Mitä tietoturvaseikkoja AI-käyttöönotossa tulee huomioida?",
    "Kuinka mitata AI-asiakaspalvelun menestystä?",
    "Millaista osaamista AI-projekti vaatii tiimiltä?"
  ];

  // Optimized placeholder rotation - avoid unnecessary re-renders
  useEffect(() => {
    if (inputValue) return; // Don't rotate when user is typing
    
    const interval = setInterval(() => {
      setPlaceholderText(prev => {
        const currentIndex = rotatingQuestions.indexOf(prev);
        const nextIndex = (currentIndex + 1) % rotatingQuestions.length;
        return rotatingQuestions[nextIndex];
      });
    }, 4000); // Increased interval to reduce render frequency

    return () => clearInterval(interval);
  }, [inputValue]); // Removed rotatingQuestions dependency to prevent unnecessary re-renders
  
  // New modal state for AI responses
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [modalMessages, setModalMessages] = useState<ChatMessage[]>([]);
  const [modalInputValue, setModalInputValue] = useState("");
  const [modalFollowUpSuggestions, setModalFollowUpSuggestions] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [currentQuestionContext, setCurrentQuestionContext] = useState<ContextType>("general");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modalMessagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const questionMutation = useMutation({
    mutationFn: async (questionId: string) => {
      const response = await apiRequest("GET", `/api/questions/${questionId}/answer?enhance=true`);
      return response.json();
    },
    onSuccess: (data, questionId) => {
      setMessages(prev => [...prev, {
        content: data.answer,
        isUser: false,
        timestamp: Date.now()
      }]);
      // Set context based on question type
      if (questionId.includes('mcp-') || questionId.includes('required-technologies') || questionId.includes('platform-integration')) {
        setSelectedContext('technical');
      } else if (questionId.includes('roi-') || questionId.includes('cx-trends') || questionId.includes('strategy')) {
        setSelectedContext('strategic');
      } else if (questionId.includes('successful-cases') || questionId.includes('failed-projects') || questionId.includes('automation') || questionId.includes('bot-')) {
        setSelectedContext('practical');
      } else if (questionId.includes('finnish') || questionId.includes('suomalainen')) {
        setSelectedContext('finnish');
      } else {
        setSelectedContext('general');
      }
    },
    onError: () => {
      toast({
        title: "Virhe",
        description: "Vastauksen lataaminen epäonnistui.",
        variant: "destructive"
      });
    }
  });

  const handleQuestionClick = (questionId: string) => {
    // Special handling for MCP deep analysis - open modal instead of chat
    if (questionId === "mcp-deep-analysis") {
      setMcpModalOpen(true);
      return;
    }

    // Find question text
    const allQuestions = [
      ...mcpQuestions,
      ...topicAreas.flatMap(topic => topic.questions)
    ];
    const question = allQuestions.find(q => q.id === questionId);

    if (question) {
      // Determine context based on question category
      const isMcpQuestion = question.id.includes('mcp-') || question.question.toLowerCase().includes('mcp');
      const contextType = isMcpQuestion ? 'mcp' :
                         question.category.includes('roi') || question.category.includes('strategy') ? 'strategic' :
                         question.category.includes('automation') || question.category.includes('practical') ? 'practical' : 'general';

      // Set up modal with proactive welcome message
      setCurrentQuestion(question.question);
      setCurrentQuestionContext(contextType);

      // Add welcome message and user question
      setModalMessages([
        {
          content: "👋 **Tervetuloa!**\n\nYmmärrän että kysyt: **" + question.question.toLowerCase() + "**\n\nAnna minun analysoida tämä Hummin näkökulmasta ja tarjota konkreettisia vastauksia...",
          isUser: false,
          isWelcome: true,
          timestamp: Date.now()
        },
        {
          content: question.question,
          isUser: true,
          timestamp: Date.now() + 100
        }
      ]);

      setModalInputValue("");
      setModalFollowUpSuggestions([]);
      setAiModalOpen(true);

      console.log("Question clicked:", question.question, "ID:", question.id, "Context:", contextType);

      // Check if we have a pre-written response
      if (preWrittenResponses[questionId]) {
        // Use pre-written response with streaming effect and follow-up suggestions
        simulateStreamingResponseWithFollowUp(preWrittenResponses[questionId], questionId);
      } else {
        // Fall back to API call for questions without pre-written responses
        modalChatMutation.mutate({ message: question.question, context_type: contextType });
      }
    }
  };

  // Simulate streaming text effect for pre-written responses
  const simulateStreamingResponse = (fullResponse: string) => {
    // Add empty AI message that will be filled character by character
    setModalMessages(prev => [...prev, {
      content: "",
      isUser: false,
      timestamp: Date.now()
    }]);

    let currentIndex = 0;
    const charsPerTick = 20; // Characters to add per interval

    const interval = setInterval(() => {
      currentIndex += charsPerTick;

      if (currentIndex >= fullResponse.length) {
        // Streaming complete
        clearInterval(interval);
        setModalMessages(prev => {
          const newMessages = [...prev];
          if (newMessages.length > 0) {
            newMessages[newMessages.length - 1] = {
              content: fullResponse,
              isUser: false,
              timestamp: Date.now()
            };
          }
          return newMessages;
        });
      } else {
        // Update with partial content
        setModalMessages(prev => {
          const newMessages = [...prev];
          if (newMessages.length > 0) {
            newMessages[newMessages.length - 1] = {
              content: fullResponse.substring(0, currentIndex),
              isUser: false,
              timestamp: Date.now()
            };
          }
          return newMessages;
        });
      }
    }, 25); // 25ms interval for smooth streaming effect

    // Cleanup function
    return () => clearInterval(interval);
  };

  // Simulate streaming with follow-up suggestions
  const simulateStreamingResponseWithFollowUp = (fullResponse: string, questionId: string) => {
    // Add empty AI message that will be filled character by character
    setModalMessages(prev => [...prev, {
      content: "",
      isUser: false,
      timestamp: Date.now()
    }]);

    let currentIndex = 0;
    const charsPerTick = 20;

    const interval = setInterval(() => {
      currentIndex += charsPerTick;

      if (currentIndex >= fullResponse.length) {
        clearInterval(interval);
        setModalMessages(prev => {
          const newMessages = [...prev];
          if (newMessages.length > 0) {
            newMessages[newMessages.length - 1] = {
              content: fullResponse,
              isUser: false,
              timestamp: Date.now()
            };
          }
          return newMessages;
        });

        // Add follow-up suggestions after streaming completes
        const followUps = getFollowUpQuestions(questionId);
        setTimeout(() => {
          setModalFollowUpSuggestions(followUps);
        }, 500);
      } else {
        setModalMessages(prev => {
          const newMessages = [...prev];
          if (newMessages.length > 0) {
            newMessages[newMessages.length - 1] = {
              content: fullResponse.substring(0, currentIndex),
              isUser: false,
              timestamp: Date.now()
            };
          }
          return newMessages;
        });
      }
    }, 25);

    return () => clearInterval(interval);
  };

  // Get contextual follow-up questions based on the original question
  const getFollowUpQuestions = (questionId: string): string[] => {
    const followUpMap: Record<string, string[]> = {
      "hyperpersonalization-trend": [
        "Miten voimme käytännössä toteuttaa hyperpersonointia Hummilla?",
        "Millaista dataa tarvitsemme hyperpersonointiin?",
        "Mikä on hyperpersonoinnin ROI ensimmäisenä vuonna?",
        "Mitkä ovat suurimmat riskit hyperpersonoinnissa?"
      ],
      "proactive-service-trend": [
        "Miten tunnistamme asiakkaiden tarpeet ennen yhteydenottoa?",
        "Mitä teknologioita tarvitaan proaktiiviseen palveluun?",
        "Kuinka paljon proaktiivinen palvelu vähentää tukipyyntöjä?",
        "Miten mittaamme proaktiivisen palvelun onnistumista?"
      ],
      "cx-trends-2025-featured": [
        "Mitkä CX-trendeistä ovat kriittisimpiä Hummille?",
        "Miten pysymme kilpailijoiden edellä CX:ssä?",
        "Mitä CX-investointeja pitäisi priorisoida?",
        "Kuinka AI muuttaa CX-strategiaamme?"
      ],
      "roi-measurement": [
        "Mitä KPI:ta pitää seurata AI-investoinnissa?",
        "Kuinka nopeasti näemme ROI:n AI-projektista?",
        "Mitkä ovat hidden costit AI-implementaatiossa?",
        "Miten vertaamme eri AI-ratkaisujen ROI:ta?"
      ],
      "reduce-manual-work": [
        "Mitkä prosessit kannattaa automatisoida ensimmäisenä?",
        "Kuinka paljon automaatio maksaa vs. säästää?",
        "Miten henkilöstö reagoi automaatioon?",
        "Mitä automaation jälkeen tapahtuu vapautuneelle ajalle?"
      ],
      "data-quality": [
        "Miten parannamme data-laatua ennen AI-projektia?",
        "Mitä GDPR vaatii AI-käytössä?",
        "Miten varmistamme datan turvallisuuden?",
        "Kuka vastaa datan laadusta organisaatiossa?"
      ]
    };

    return followUpMap[questionId] || [
      "Kerro lisää tästä aiheesta",
      "Mitkä ovat seuraavat askeleet?",
      "Mitä riskejä tähän liittyy?",
      "Kuinka paljon tämä maksaa?"
    ];
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Removed auto-scroll to bottom to prevent annoying behavior when clicking buttons
  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);
  
  useEffect(() => {
    if (modalMessagesEndRef.current) {
      modalMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [modalMessages]);

  const chatMutation = useMutation({
    mutationFn: async (data: { message: string, context_type?: ContextType }) => {
      const response = await apiRequest("POST", "/api/chat", { 
        message: data.message || data,
        context_type: data.context_type || selectedContext
      });
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Chat response received:", data.response);
      console.log("Follow-up suggestions received:", data.followUpSuggestions);
      console.log("Has markdown headers:", data.response.includes('##') || data.response.includes('###'));
      console.log("Has markdown bold:", data.response.includes('**'));
      setMessages(prev => [...prev, {
        content: data.response,
        isUser: false,
        timestamp: Date.now()
      }]);
      // Set follow-up suggestions
      setFollowUpSuggestions(data.followUpSuggestions || []);
    },
    onError: () => {
      toast({
        title: "Virhe",
        description: "Viestin lähettäminen epäonnistui. Yritä uudelleen.",
        variant: "destructive"
      });
    }
  });

  // Modal chat mutation for AI responses in modal
  const modalChatMutation = useMutation({
    mutationFn: async (data: { message: string, context_type?: ContextType }) => {
      const response = await apiRequest("POST", "/api/chat", { 
        message: data.message || data,
        context_type: data.context_type || currentQuestionContext
      });
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Modal chat response received:", data.response);
      console.log("Modal follow-up suggestions received:", data.followUpSuggestions);
      
      // Add AI response to modal messages
      setModalMessages(prev => [...prev, {
        content: data.response,
        isUser: false,
        timestamp: Date.now()
      }]);
      
      // Update modal follow-up suggestions
      if (data.followUpSuggestions && Array.isArray(data.followUpSuggestions)) {
        setModalFollowUpSuggestions(data.followUpSuggestions);
      }
    },
    onError: (error) => {
      console.error("Modal chat error:", error);
      setModalMessages(prev => [...prev, {
        content: "Anteeksi, en pystynyt käsittelemään kysymystäsi.",
        isUser: false,
        timestamp: Date.now()
      }]);
      toast({
        title: "Virhe",
        description: "Vastauksen lataaminen epäonnistui.",
        variant: "destructive"
      });
    }
  });

  const handleSend = () => {
    const message = inputValue.trim();
    if (!message || chatMutation.isPending) return;

    // Add user message
    setMessages(prev => [...prev, {
      content: message,
      isUser: true,
      timestamp: Date.now()
    }]);

    setInputValue("");
    // Clear previous follow-up suggestions when sending new message
    setFollowUpSuggestions([]);
    chatMutation.mutate({ message: message });
  };

  const handleFollowUpClick = (suggestion: string) => {
    if (chatMutation.isPending) return;

    // Add user message
    setMessages(prev => [...prev, {
      content: suggestion,
      isUser: true,
      timestamp: Date.now()
    }]);

    // Clear follow-up suggestions immediately when one is clicked
    setFollowUpSuggestions([]);
    chatMutation.mutate({ message: suggestion });
  };

  // Modal chat functions
  const handleModalSend = () => {
    const message = modalInputValue.trim();
    if (!message || modalChatMutation.isPending) return;

    // Add user message to modal
    setModalMessages(prev => [...prev, {
      content: message,
      isUser: true,
      timestamp: Date.now()
    }]);

    setModalInputValue("");
    setModalFollowUpSuggestions([]);
    modalChatMutation.mutate({ message: message, context_type: currentQuestionContext });
  };

  const handleModalFollowUpClick = (suggestion: string) => {
    if (modalChatMutation.isPending) return;

    // Add user message to modal
    setModalMessages(prev => [...prev, {
      content: suggestion,
      isUser: true,
      timestamp: Date.now()
    }]);

    setModalFollowUpSuggestions([]);
    modalChatMutation.mutate({ message: suggestion, context_type: currentQuestionContext });
  };

  const handleModalKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleModalSend();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full">
      <Card className="overflow-hidden shadow-xl border-0 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm" data-testid="chat-interface">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold" data-testid="chat-title">Hummin Johdon Co-Pilot</h3>
              <p className="text-xs opacity-90">Proaktiivinen AI-assistentti strategiseen päätöksentekoon</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpanded}
            className="text-primary-foreground hover:bg-primary-foreground/20 p-1"
            data-testid="expand-button"
            title={isExpanded ? "Pienennä chat" : "Laajenna chat"}
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>



        {/* Chat Messages */}
        <div className={`overflow-y-auto p-6 space-y-6 transition-all duration-300 bg-slate-950/20 ${
          isExpanded ? 'h-[calc(100vh-16rem)]' : 'h-96'
        }`} data-testid="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className="chat-message" data-testid={`message-${index}`}>
              <div className={`flex items-start space-x-3 ${message.isUser ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 ${message.isUser ? 'bg-secondary' : 'bg-primary'} rounded-full flex items-center justify-center flex-shrink-0`}>
                  {message.isUser ? (
                    <User className="h-4 w-4 text-secondary-foreground" />
                  ) : (
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  )}
                </div>
                <div className={`${message.isUser ? 'bg-primary text-primary-foreground max-w-xs' : 'bg-muted max-w-2xl'} rounded-lg p-3`}>
                  <div className={`text-sm ${message.isUser ? '' : 'text-foreground'}`}>
                    {message.isUser ? (
                      <span className="whitespace-pre-wrap">{message.content}</span>
                    ) : (
                      <div className="max-w-none text-gray-100">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({children}) => <h1 className="text-lg font-bold mb-2 text-white">{children}</h1>,
                            h2: ({children}) => <h2 className="text-base font-semibold mb-2 text-white">{children}</h2>,
                            h3: ({children}) => <h3 className="text-sm font-medium mb-1 text-gray-100">{children}</h3>,
                            p: ({children}) => <p className="mb-2 last:mb-0 text-gray-100">{children}</p>,
                            ul: ({children}) => <ul className="list-disc pl-4 mb-2 text-gray-100">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal pl-4 mb-2 text-gray-100">{children}</ol>,
                            li: ({children}) => <li className="mb-1 text-gray-100">{children}</li>,
                            strong: ({children}) => <strong className="font-semibold text-white">{children}</strong>,
                            em: ({children}) => <em className="italic text-gray-200">{children}</em>,
                            code: ({children}) => <code className="bg-slate-700 text-gray-100 px-1 py-0.5 rounded text-xs">{children}</code>,
                            blockquote: ({children}) => <blockquote className="border-l-2 border-slate-500 pl-3 italic text-gray-200">{children}</blockquote>
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {chatMutation.isPending && (
            <div className="chat-message animate-in fade-in-0 duration-300" data-testid="loading-message">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary-foreground animate-pulse" />
                </div>
                <div className="bg-muted rounded-lg p-3 max-w-2xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <p className="text-sm text-muted-foreground">AI miettii vastausta...</p>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                    <Skeleton className="h-3 w-3/5" />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          
          <div ref={messagesEndRef} />
        </div>

        {/* Follow-up Suggestions - Above Input */}
        {followUpSuggestions.length > 0 && (
          <div className="border-t border-border bg-slate-800/30 p-4" data-testid="follow-up-suggestions-input">
            <p className="text-sm font-medium mb-3 text-slate-200">💡 Suositellut jatkokysymykset johdolle:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {followUpSuggestions.map((suggestion, index) => (
                <PulseButton
                  key={index}
                  variant="outline"
                  size="sm"
                  pulse="subtle"
                  className="text-left h-auto py-3 px-4 justify-start whitespace-normal bg-slate-700/50 hover:bg-slate-600/50 text-slate-100 border-slate-600 hover:border-slate-500 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
                  style={{animationDelay: `${index * 100}ms`}}
                  onClick={() => handleFollowUpClick(suggestion)}
                  loading={chatMutation.isPending}
                  data-testid={`follow-up-input-${index}`}
                >
                  <span className="text-xs leading-relaxed">{suggestion}</span>
                </PulseButton>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input */}
        <div className="border-t border-border p-6 bg-slate-900/30">
          <div className="flex space-x-4">
            <Input
              type="text"
              placeholder={placeholderText}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={chatMutation.isPending}
              className="flex-1 h-12 text-base bg-slate-800/50 border-slate-600 focus:border-primary text-slate-100 placeholder:text-slate-400"
              data-testid="chat-input"
            />
            <PulseButton
              onClick={handleSend}
              loading={chatMutation.isPending}
              disabled={!inputValue.trim()}
              size="lg"
              pulse="subtle"
              className="h-12 px-6"
              data-testid="send-button"
            >
              <Send className="h-5 w-5" />
            </PulseButton>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>💼 Räätälöidyt vastaukset Humm Group Oy:n johdolle</span>
            <div className="flex space-x-2">
              <Badge 
                variant="secondary" 
                className="cursor-pointer hover:opacity-80 bg-slate-700 text-slate-200"
                onClick={() => setInputValue("Millä aikataululla voimme toteuttaa AI-asiakaspalvelun?")}
                data-testid="example-timeline"
              >
                Aikataulu
              </Badge>
              <Badge 
                variant="secondary" 
                className="cursor-pointer hover:opacity-80 bg-slate-700 text-slate-200"
                onClick={() => setInputValue("Mikä on ROI AI-investoinnille asiakaspalvelussa?")}
                data-testid="example-roi"
              >
                ROI & Hyödyt
              </Badge>
            </div>
          </div>
        </div>

        {/* MCP Section - TÄRKEÄ! */}
        <div className={`border-t border-border bg-emerald-950 transition-all duration-300 ${
          isExpanded ? 'max-h-0 overflow-hidden opacity-0 p-0' : 'p-4 pb-6 max-h-none opacity-100'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-emerald-600" />
            <h4 className="text-sm font-semibold text-emerald-100">Model Context Protocol (MCP) - TÄRKEÄ!</h4>
          </div>
          <p className="text-xs text-emerald-300 mb-3">
            MCP mahdollistaa turvallisen AI-integraation yritysjärjestelmiin
          </p>
          <div className="grid grid-cols-1 gap-2">
            {mcpQuestions.map((question) => {
              const IconComponent = question.icon;
              return (
                <PulseButton
                  key={question.id}
                  variant="outline"
                  size="sm"
                  pulse="subtle"
                  className="h-auto p-3 text-xs text-left justify-start border-emerald-800 hover:bg-emerald-900 hover:border-emerald-700 text-emerald-50 hover:text-white"
                  onClick={() => handleQuestionClick(question.id)}
                  loading={questionMutation.isPending}
                  disabled={questionMutation.isPending}
                  data-testid={`question-${question.id}`}
                >
                  <IconComponent className="h-4 w-4 mr-2 text-emerald-600 flex-shrink-0" />
                  <span className="leading-tight">{question.question}</span>
                </PulseButton>
              );
            })}
          </div>
        </div>

        {/* Suositut kysymykset - Featured */}
        <div className={`border-t border-border transition-all duration-300 ${
          isExpanded ? 'max-h-0 overflow-hidden opacity-0 p-0' : 'p-6 opacity-100'
        }`}>
          <h4 className="text-base font-semibold mb-4 text-white">🎯 Suositut kysymykset johdolle</h4>
          <div className="space-y-3">
            {/* Top 6 featured questions - hyperpersonalization and proactivity first */}
            <PulseButton
              variant="outline"
              size="lg"
              pulse="subtle"
              className="w-full h-auto p-4 text-left justify-start bg-slate-700/30 hover:bg-slate-600/50 text-slate-100 border-slate-600 hover:border-purple-500 transition-all duration-200"
              onClick={() => handleQuestionClick("hyperpersonalization-trend")}
              disabled={questionMutation.isPending}
              data-testid="featured-question-personalization"
            >
              <Target className="h-5 w-5 mr-3 text-purple-400 flex-shrink-0" />
              <div>
                <div className="font-medium">Kuinka hyperpersonointi mullistaa asiakaskokemuksen?</div>
                <div className="text-xs text-slate-400 mt-1">Personalisaation tulevaisuus</div>
              </div>
            </PulseButton>

            <PulseButton
              variant="outline"
              size="lg"
              pulse="subtle"
              className="w-full h-auto p-4 text-left justify-start bg-slate-700/30 hover:bg-slate-600/50 text-slate-100 border-slate-600 hover:border-orange-500 transition-all duration-200"
              onClick={() => handleQuestionClick("proactive-service-trend")}
              disabled={questionMutation.isPending}
              data-testid="featured-question-proactive"
            >
              <Zap className="h-5 w-5 mr-3 text-orange-400 flex-shrink-0" />
              <div>
                <div className="font-medium">Miksi proaktiivinen asiakaspalvelu on vuoden 2025 megatrendi?</div>
                <div className="text-xs text-slate-400 mt-1">Ennakoiva asiakaspalvelu</div>
              </div>
            </PulseButton>
            
            <PulseButton
              variant="outline"
              size="lg"
              pulse="subtle"
              className="w-full h-auto p-4 text-left justify-start bg-slate-700/30 hover:bg-slate-600/50 text-slate-100 border-slate-600 hover:border-blue-500 transition-all duration-200"
              onClick={() => handleQuestionClick("cx-trends-2025-featured")}
              disabled={questionMutation.isPending}
              data-testid="featured-question-trends"
            >
              <BarChart3 className="h-5 w-5 mr-3 text-blue-400 flex-shrink-0" />
              <div>
                <div className="font-medium">2025 suurimmat CX-trendit ja AI:n rooli</div>
                <div className="text-xs text-slate-400 mt-1">Strateginen näkemys tulevaisuudesta</div>
              </div>
            </PulseButton>
            
            <PulseButton
              variant="outline"
              size="lg"
              pulse="subtle"
              className="w-full h-auto p-4 text-left justify-start bg-slate-700/30 hover:bg-slate-600/50 text-slate-100 border-slate-600 hover:border-green-500 transition-all duration-200"
              onClick={() => handleQuestionClick("roi-measurement")}
              disabled={questionMutation.isPending}
              data-testid="featured-question-roi"
            >
              <DollarSign className="h-5 w-5 mr-3 text-green-400 flex-shrink-0" />
              <div>
                <div className="font-medium">Miten AI-investoinnista saa mitattavaa arvoa?</div>
                <div className="text-xs text-slate-400 mt-1">ROI ja konkreettiset hyödyt</div>
              </div>
            </PulseButton>

            <PulseButton
              variant="outline"
              size="lg"
              pulse="subtle"
              className="w-full h-auto p-4 text-left justify-start bg-slate-700/30 hover:bg-slate-600/50 text-slate-100 border-slate-600 hover:border-red-500 transition-all duration-200"
              onClick={() => handleQuestionClick("reduce-manual-work")}
              disabled={questionMutation.isPending}
              data-testid="featured-question-automation"
            >
              <Workflow className="h-5 w-5 mr-3 text-red-400 flex-shrink-0" />
              <div>
                <div className="font-medium">Miten automaatio voi vähentää manuaalista työtä?</div>
                <div className="text-xs text-slate-400 mt-1">Prosessien tehostaminen</div>
              </div>
            </PulseButton>

            <PulseButton
              variant="outline"
              size="lg"
              pulse="subtle"
              className="w-full h-auto p-4 text-left justify-start bg-slate-700/30 hover:bg-slate-600/50 text-slate-100 border-slate-600 hover:border-cyan-500 transition-all duration-200"
              onClick={() => handleQuestionClick("data-quality")}
              disabled={questionMutation.isPending}
              data-testid="featured-question-data"
            >
              <Shield className="h-5 w-5 mr-3 text-cyan-400 flex-shrink-0" />
              <div>
                <div className="font-medium">Miten asiakasdata pysyy laadukkaana ja suojattuna?</div>
                <div className="text-xs text-slate-400 mt-1">Tietosuoja ja laatuvaatimukset</div>
              </div>
            </PulseButton>
          </div>

          {/* More topics toggle */}
          <div className="mt-4 pt-4 border-t border-slate-600/50">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-slate-300 hover:text-white hover:bg-slate-700/50"
              onClick={toggleExpanded}
              data-testid="toggle-more-questions"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Näytä lisää aiheita ({topicAreas.length} kategoriaa)
            </Button>
          </div>
        </div>

        {/* Extended questions view */}
        <div className={`border-t border-border transition-all duration-300 ${
          isExpanded ? 'p-6 max-h-96 overflow-y-auto opacity-100' : 'max-h-0 overflow-hidden opacity-0 p-0'
        }`}>
          <div className="space-y-4">
            {topicAreas.slice(0, 6).map((topic) => {
              const TopicIcon = topic.icon;
              return (
                <div key={topic.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TopicIcon className={`h-4 w-4 ${topic.color.replace('bg-', 'text-')}`} />
                    <h5 className="text-sm font-medium text-white">{topic.title}</h5>
                  </div>
                  <div className="grid grid-cols-1 gap-2 ml-6">
                    {topic.questions.slice(0, 2).map((question) => {
                      const QuestionIcon = question.icon;
                      return (
                        <Button
                          key={question.id}
                          variant="ghost"
                          size="sm"
                          className="h-auto p-3 text-xs text-left justify-start hover:bg-slate-700/50 text-slate-300 hover:text-white"
                          onClick={() => handleQuestionClick(question.id)}
                          disabled={questionMutation.isPending}
                          data-testid={`question-${question.id}`}
                        >
                          <QuestionIcon className="h-3 w-3 mr-2 text-slate-400 flex-shrink-0" />
                          <span className="leading-tight">{question.question}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-600/50">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-slate-400 hover:text-slate-200"
              onClick={toggleExpanded}
              data-testid="collapse-questions"
            >
              <Minimize2 className="h-4 w-4 mr-2" />
              Piilota lisäkysymykset
            </Button>
          </div>
        </div>
      </Card>

      {/* MCP Deep Analysis Button */}
      <div className="mt-6 mb-8">
        <Dialog open={mcpModalOpen} onOpenChange={setMcpModalOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full bg-emerald-950 border-emerald-800 hover:bg-emerald-900 text-emerald-300"
              data-testid="mcp-deep-analysis-button"
            >
              <FileText className="h-4 w-4 mr-2" />
              Syväanalyysi MCP
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-emerald-300 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Model Context Protocol (MCP) - Syväanalyysi
              </DialogTitle>
              <DialogDescription>
                Kattava analyysi MCP:n käytöstä ja tietoturvaeduista AI-integraatioissa
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[70vh] pr-4">
              <div className="space-y-6">
                {/* Johdanto */}
                <section>
                  <h3 className="text-lg font-semibold mb-3 text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Mikä on MCP ja miksi sitä tarvitaan?
                  </h3>
                  <div className="max-w-none text-gray-100">
                    <p className="mb-3 text-gray-100">
                      <strong className="text-white">Model Context Protocol (MCP)</strong> on avoin standardi, joka määrittelee tavan liittää suuria kielimalleja ja tekoälyagentteja ulkoisiin tieto- ja työkalulähteisiin. Sen avulla AI-avustajat eivät enää ole eristyksissa vain omien koulutusdatojensa varassa, vaan ne voivat päästä käsiksi reaaliaikaiseen tietoon ja järjestelmiin turvallisesti.
                    </p>
                    <p className="mb-3 text-gray-100">
                      MCP toimii kuin eräänlainen erikoistunut API-rajapinta tekoälylle: AI-agentti voi sen kautta "keskustella" yrityksen tietokantojen, sovellusten tai palveluiden kanssa yhtenäisellä tavalla. Tämä avaa uusia käyttömahdollisuuksia – esimerkiksi AI voi hakea tietoa yrityksen sisäisistä järjestelmistä, päivittää tietueita tai suorittaa toimintoja.
                    </p>
                    <div className="bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-3">
                      <p className="text-sm text-yellow-100">
                        <strong className="text-yellow-50">Huomio:</strong> MCP on vain rajapinta – se itsessään ei sisällä automaattisesti turvamekanismeja kuten autentikointia tai pääsynhallintaa. Organisaation tehtävä on päättää, mitkä "ovet ovat auki ja kenelle".
                      </p>
                    </div>
                  </div>
                </section>

                {/* Käyttöhyödyt */}
                <section>
                  <h3 className="text-lg font-semibold mb-3 text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    MCP:n hyödyt käytön näkökulmasta
                  </h3>
                  <div className="max-w-none text-gray-100">
                    <p className="mb-3 text-gray-100">
                      Käyttöympäristön kannalta MCP:n suurin etu on, että se parantaa tekoälyn kykyä antaa relevantteja vastauksia ja suorittaa tehtäviä käyttämällä organisaation omaa dataa ja työkaluja.
                    </p>
                    
                    <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold mb-2 text-white">Käytännön esimerkki: Asiakaspalveluchatbot</h4>
                      <p className="text-sm mb-2 text-gray-100">
                        MCP:n avulla asiakaspalvelubot voi hakea tietoa useista lähteistä asiakkaan kysymyksen ratkaisemiseksi:
                      </p>
                      <ul className="text-sm list-disc pl-4 space-y-1 text-gray-100">
                        <li>Tarkistaa tilauksen tilan ERP-järjestelmästä</li>
                        <li>Hakee tuotetietoja tietokannasta</li>
                        <li>Luo tukipyynnön tiketöintijärjestelmään</li>
                        <li>Aloittaa palautusprosessin automaattisesti</li>
                      </ul>
                    </div>

                    <p className="mb-3 text-gray-100">
                      <strong className="text-white">Organisaation hyödyt:</strong> Rutiinitehtävät hoituvat automatisoidusti, henkilöstö voi keskittyä vaativampiin tehtäviin, ja AI:n toimet perustuvat ajantasaiseen ja oikeaan tietoon.
                    </p>
                  </div>
                </section>

                {/* Tietoturva */}
                <section>
                  <h3 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Tietoturva ja pääsynhallinta
                  </h3>
                  <div className="max-w-none text-gray-100">
                    <p className="mb-4 text-gray-100">
                      MCP:n tuoma voimakas integraatiokyky asettaa tietoturvalle erityisvaatimuksia. Koska AI-agentti voi MCP:n kautta toimia ikään kuin käyttäjänä eri järjestelmissä, on välttämätöntä varmistaa asianmukainen pääsynhallinta.
                    </p>

                    <div className="grid gap-4 mb-4">
                      <div className="bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 text-red-200 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          1. Roolipohjainen pääsy (RBAC)
                        </h4>
                        <p className="text-sm mb-2 text-red-100">
                          AI-agentille annetaan vain ne oikeudet, jotka sen tehtävän hoitamiseen tarvitaan – ei enempää. Periaatteena on <strong className="text-red-50">vähimmän oikeuden periaate</strong>.
                        </p>
                        <p className="text-sm text-red-100">
                          <em>Esimerkki:</em> Asiakaspalvelubotin MCP-palvelin voidaan toteuttaa niin, että botti pystyy hakemaan vain kyseisen asiakkaan tiedot CRM:stä, ei koskaan muiden asiakkaiden tietoja.
                        </p>
                      </div>

                      <div className="bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 text-orange-200 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          2. Eksplisiittinen kontekstin rajaus
                        </h4>
                        <p className="text-sm mb-2 text-orange-100">
                          Tekoälylle syötetään vain kulloinkin tarpeellinen tieto tai päästään käsiksi vain rajattuun resurssiin. Konteksti voidaan rajata tiettyyn asiakkaaseen, tukipyyntöön tai tehtäväalueeseen.
                        </p>
                        <p className="text-sm text-orange-100">
                          <em>Hyöty:</em> AI ei voi vahingossakaan lipsauttaa tietoja kontekstin ulkopuolelta, koska se ei pääse niihin käsiksi.
                        </p>
                      </div>

                      <div className="bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 text-purple-200 flex items-center gap-2">
                          <Database className="h-4 w-4" />
                          3. Audit-jäljet ja valvonta
                        </h4>
                        <p className="text-sm mb-2 text-purple-100">
                          Kaikesta AI:n toiminnasta jää läpinäkyvä loki. Järjestelmä kirjaa ylös kuka/mikä agentti teki mitä, mihin aikaan, ja oliko toimi sallittu.
                        </p>
                        <p className="text-sm text-purple-100">
                          <em>Esimerkki lokimerkinnästä:</em> "AI-agentti X haki asiakkaan Y osoitetiedot CRM:stä 21.9.2025 klo 14:05 käyttäjän Z pyynnöstä"
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                      <h4 className="font-semibold mb-2 text-white">Lisäturvatoimet:</h4>
                      <ul className="text-sm list-disc pl-4 space-y-1 text-gray-100">
                        <li>Autentikointi ja salaus (TLS-suojatut MCP-kutsut)</li>
                        <li>Syötevalidointi (estää haitallisten syötteiden johdattelun)</li>
                        <li>Nopeusrajoitukset (estetään ylikuormitus)</li>
                        <li>Hätätapauksien esto (työkalujen valkolistat, hälytykset)</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Sääntely ja luottamus */}
                <section>
                  <h3 className="text-lg font-semibold mb-3 text-slate-400 flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    Sääntely- ja luottamusnäkökulma
                  </h3>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="mb-3">
                      MCP:n käyttöönotto merkitsee uudenlaista vastuuta sääntelyn noudattamisesta ja interessiryhmien luottamuksen säilyttämisestä. Koska AI pääsee käsiksi potentiaalisesti arkaluonteiseen dataan, läpinäkyvyys ja kontrolli korostuvat.
                    </p>

                    <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold mb-2 text-white">GDPR ja vaatimustenmukaisuus</h4>
                      <p className="text-sm mb-2">
                        EU:n GDPR edellyttää, että henkilötietoja käsitellään asianmukaisin suojamekanismein ja vain käyttötarkoituksiinsa rajatusti. MCP:n roolipohjainen pääsy ja kontekstin rajaus tukevat näitä vaatimuksia.
                      </p>
                      <p className="text-sm">
                        <strong>Compliance-periaate:</strong> Jokainen tekoälytoiminto on nähtävä kuin mikä tahansa liiketoimintatapahtuma, joka pitää tarvittaessa voida tarkastaa jälkikäteen.
                      </p>
                    </div>

                    <div className="bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 text-green-200">Asiakkaiden luottamus</h4>
                      <p className="text-sm mb-2">
                        Tutkimusten mukaan jopa 66% asiakkaista on huolissaan tietosuojasta asioidessaan tekoälyä hyödyntävien palveluiden kanssa.
                      </p>
                      <p className="text-sm">
                        <strong>Ratkaisu:</strong> Läpinäkyvä viestintä siitä, mitä tietoja AI haki asiakkaan kysymyksen ratkaisemiseksi ja että sillä ei ole pääsyä mihinkään muuhun.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Johtopäätökset */}
                <section>
                  <h3 className="text-lg font-semibold mb-3 text-white flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Johtopäätökset
                  </h3>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="mb-3">
                      Model Context Protocol tarjoaa uuden tehokkaan tavan integroida tekoäly osaksi yrityksen tietojärjestelmiä ja prosesseja. Sen avulla AI pystyy hyödyntämään vain haluttua osajoukkoa tietoa tuottaakseen parempia vastauksia ja hoitaakseen tehtäviä automaattisesti.
                    </p>
                    
                    <div className="bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 text-emerald-100">MCP:n arvon kaksijako:</h4>
                      <div className="text-sm space-y-2">
                        <p><strong>Mahdollistaja:</strong> Tuo tekoälyn osaksi arkea ennennäkemättömillä tavoilla</p>
                        <p><strong>Hallinnan työväline:</strong> Tarjoaa keinot rajata ja seurata tekoälyn toimintaa</p>
                      </div>
                    </div>

                    <p className="mt-4">
                      <strong>Lopputulos:</strong> Hyödyntämällä MCP:tä vastuullisesti organisaatiot voivat nousta tekoälyn seuraavalle tasolle ilman, että kontrolli tai luottamus karkaa käsistä.
                    </p>
                  </div>
                </section>

                {/* Lähteet */}
                <section>
                  <h3 className="text-lg font-semibold mb-3 text-white flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Lähteet ja lisätietoa
                  </h3>
                  <div className="text-xs text-white space-y-2">
                    <div>
                      <p className="font-medium">Keskeiset lähteet:</p>
                      <ul className="list-disc pl-4 mt-1 space-y-1">
                        <li>Anthropic: Introducing the Model Context Protocol</li>
                        <li>CyberArk: What is Model Context Protocol (MCP)?</li>
                        <li>Cerbos: MCP Authorization with Fine-Grained Access Control</li>
                        <li>Zenity: Securing the Model Context Protocol</li>
                        <li>USDM: The Model Context Protocol in Life Sciences</li>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      
      {/* AI Response Modal */}
      <Dialog open={aiModalOpen} onOpenChange={setAiModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-primary flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Assistentti
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {currentQuestion}
            </DialogDescription>
          </DialogHeader>
          
          {/* Modal Chat Messages */}
          <ScrollArea className="h-[60vh] pr-4 border rounded-lg">
            <div className="p-4 space-y-4">
              {modalMessages.map((message, index) => (
                <div key={index} className="chat-message" data-testid={`modal-message-${index}`}>
                  <div className={`flex items-start space-x-3 ${message.isUser ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 ${message.isUser ? 'bg-secondary' : 'bg-primary'} rounded-full flex items-center justify-center flex-shrink-0`}>
                      {message.isUser ? (
                        <User className="h-4 w-4 text-secondary-foreground" />
                      ) : (
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      )}
                    </div>
                    <div className={`${message.isUser ? 'bg-primary text-primary-foreground max-w-xs' : 'bg-muted max-w-2xl'} rounded-lg p-3`}>
                      <div className={`text-sm ${message.isUser ? '' : 'text-foreground'}`}>
                        {message.isUser ? (
                          <span className="whitespace-pre-wrap">{message.content}</span>
                        ) : (
                          <div className="max-w-none text-gray-100">
                            <ReactMarkdown 
                              remarkPlugins={[remarkGfm]}
                              components={{
                                h1: ({children}) => <h1 className="text-lg font-bold mb-2 text-white">{children}</h1>,
                                h2: ({children}) => <h2 className="text-base font-semibold mb-2 text-white">{children}</h2>,
                                h3: ({children}) => <h3 className="text-sm font-medium mb-1 text-gray-100">{children}</h3>,
                                p: ({children}) => <p className="mb-2 last:mb-0 text-gray-100">{children}</p>,
                                ul: ({children}) => <ul className="list-disc pl-4 mb-2 text-gray-100">{children}</ul>,
                                ol: ({children}) => <ol className="list-decimal pl-4 mb-2 text-gray-100">{children}</ol>,
                                li: ({children}) => <li className="mb-1 text-gray-100">{children}</li>,
                                strong: ({children}) => <strong className="font-semibold text-white">{children}</strong>,
                                em: ({children}) => <em className="italic text-gray-200">{children}</em>,
                                code: ({children}) => <code className="bg-slate-700 text-gray-100 px-1 py-0.5 rounded text-xs">{children}</code>,
                                blockquote: ({children}) => <blockquote className="border-l-2 border-slate-500 pl-3 italic text-gray-200">{children}</blockquote>
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {modalChatMutation.isPending && (
                <div className="chat-message" data-testid="modal-loading-message">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary-foreground animate-pulse" />
                    </div>
                    <div className="bg-muted rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-muted-foreground">Kirjoittaa...</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Modal Follow-up Suggestions */}
              {modalFollowUpSuggestions.length > 0 && (
                <div className="chat-message" data-testid="modal-follow-up-suggestions">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <div className="bg-accent/50 rounded-lg p-3 max-w-2xl">
                      <p className="text-sm font-medium mb-2 text-accent-foreground">Jatkokysymyksiä:</p>
                      <div className="space-y-2">
                        {modalFollowUpSuggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-left h-auto py-2 px-3 justify-start whitespace-normal bg-background/80 hover:bg-background text-foreground"
                            onClick={() => handleModalFollowUpClick(suggestion)}
                            data-testid={`modal-follow-up-${index}`}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={modalMessagesEndRef} />
            </div>
          </ScrollArea>
          
          {/* Modal Chat Input */}
          <div className="border-t border-border p-4 bg-background">
            <div className="flex space-x-3">
              <Input
                type="text"
                placeholder="Jatka keskustelua..."
                value={modalInputValue}
                onChange={(e) => setModalInputValue(e.target.value)}
                onKeyPress={handleModalKeyPress}
                disabled={modalChatMutation.isPending}
                className="flex-1"
                data-testid="modal-chat-input"
              />
              <Button
                onClick={handleModalSend}
                disabled={modalChatMutation.isPending || !modalInputValue.trim()}
                size="icon"
                data-testid="modal-send-button"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              <span>Kysy tarkentavia kysymyksiä aiheesta tai valitse jatkokysymys yllä olevista ehdotuksista.</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>

      {/* Quick Stats */}
      <Card className="mt-6" data-testid="quick-stats">
        <CardContent className="p-4">
          <h4 className="font-semibold text-foreground mb-3">Yhteenveto tuloksista</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Keskimääräinen automaatioaste</span>
              <span className="font-semibold text-foreground" data-testid="stat-automation">60-95%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Vastausajan parannus</span>
              <span className="font-semibold text-foreground" data-testid="stat-response">Tunneista sekunteihin</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Asiakastyytyväisyys</span>
              <span className="font-semibold text-foreground" data-testid="stat-satisfaction">+10pp keskimäärin</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Saatavuus</span>
              <span className="font-semibold text-foreground" data-testid="stat-availability">24/7</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact CTA - Sophisticated Recruitment Actions */}
      <Card className="mt-6 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-slate-900/40 border-blue-500/30" data-testid="contact-cta">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <h4 className="text-lg font-bold text-white mb-2">Kiinnostuitko?</h4>
            <p className="text-sm text-slate-300">
              Haluatko keskustella Tech Lead -roolista tai AI-strategiasta tarkemmin?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Email Contact Button */}
            <motion.a
              href="mailto:your.email@example.com?subject=Tech Lead -rooli Humm Groupissa&body=Hei,%0D%0A%0D%0ATämä portfolio-demo vaikutti mielenkiintoiselta. Haluaisin keskustella lisää Tech Lead -roolista ja AI-strategiasta.%0D%0A%0D%0ATerveisin,"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="block"
            >
              <Card className="h-full bg-gradient-to-br from-blue-600 to-blue-700 border-blue-400/50 hover:border-blue-300 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-blue-500/50">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <h5 className="font-semibold text-white mb-1">Lähetä viesti</h5>
                  <p className="text-xs text-blue-100">
                    Avaa sähköposti ja kerro lisää tarpeistanne
                  </p>
                </CardContent>
              </Card>
            </motion.a>

            {/* Job Offer Button with Confetti */}
            <motion.button
              onClick={() => {
                // Trigger confetti animation
                const duration = 3 * 1000;
                const animationEnd = Date.now() + duration;
                const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

                function randomInRange(min: number, max: number) {
                  return Math.random() * (max - min) + min;
                }

                const interval: any = setInterval(function() {
                  const timeLeft = animationEnd - Date.now();

                  if (timeLeft <= 0) {
                    return clearInterval(interval);
                  }

                  const particleCount = 50 * (timeLeft / duration);

                  // Create confetti effect using emoji particles
                  const confettiElement = document.createElement('div');
                  confettiElement.innerHTML = '🎉';
                  confettiElement.style.position = 'fixed';
                  confettiElement.style.fontSize = '24px';
                  confettiElement.style.left = `${randomInRange(0, 100)}%`;
                  confettiElement.style.top = `${randomInRange(0, 50)}%`;
                  confettiElement.style.opacity = '0';
                  confettiElement.style.transition = 'all 1s ease-out';
                  confettiElement.style.pointerEvents = 'none';
                  confettiElement.style.zIndex = '9999';
                  document.body.appendChild(confettiElement);

                  setTimeout(() => {
                    confettiElement.style.opacity = '1';
                    confettiElement.style.transform = `translate(${randomInRange(-200, 200)}px, ${randomInRange(100, 400)}px) rotate(${randomInRange(0, 360)}deg)`;
                  }, 10);

                  setTimeout(() => {
                    confettiElement.remove();
                  }, 1000);
                }, 250);

                // Show success toast
                toast({
                  title: "🎊 Erinomainen valinta!",
                  description: "Otan yhteyttä sinuun pian. Kiitos mielenkiinnosta!",
                  duration: 5000,
                });
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full"
            >
              <Card className="h-full bg-gradient-to-br from-emerald-600 to-emerald-700 border-emerald-400/50 hover:border-emerald-300 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-emerald-500/50">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 relative">
                    <Rocket className="h-6 w-6 text-white" />
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  </div>
                  <h5 className="font-semibold text-white mb-1">Tee työtarjous</h5>
                  <p className="text-xs text-emerald-100">
                    Aloitetaan yhteistyö heti! 🚀
                  </p>
                </CardContent>
              </Card>
            </motion.button>
          </div>

          {/* Additional Info */}
          <div className="mt-4 pt-4 border-t border-slate-700/50 text-center">
            <p className="text-xs text-slate-400">
              <span className="font-medium text-slate-300">Odotan innolla</span> mahdollisuutta viedä Hummin AI-strategiaa eteenpäin
            </p>
            <p className="text-xs text-slate-500 mt-1">
              📍 Helsinki | 💼 Tech Lead | 🤖 AI-strategia | 🔐 MCP-ekspertti
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
 
