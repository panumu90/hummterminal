import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { PageHeader } from "@/components/page-header";
import { CaseCard } from "@/components/case-card";
import { ChatInterface } from "@/components/chat-interface";
import { HummAILogo } from "@/components/humm-ai-logo";

// Lazy load heavy components (only loaded when tab is opened)
const TechLeadDashboard = lazy(() => import("@/components/tech-lead-dashboard"));
const StrategicRoadmap = lazy(() => import("@/components/strategic-roadmap"));
const NewsFeed = lazy(() => import("@/components/news-feed"));
const HummOverviewDashboard = lazy(() => import("@/components/humm-overview-dashboard").then(m => ({ default: m.HummOverviewDashboard })));
const StrategicRecommendationsPanel = lazy(() => import("@/components/strategic-recommendations-panel").then(m => ({ default: m.StrategicRecommendationsPanel })));
const CSPortalModal = lazy(() => import("@/components/cs-portal-modal").then(m => ({ default: m.CSPortalModal })));
const RAGInterface = lazy(() => import("@/components/rag-interface").then(m => ({ default: m.RAGInterface })));
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PulseButton } from "@/components/ui/pulse-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Bot, Building, Rocket, Users, TrendingUp, BarChart, User, Send, Star, Target, Briefcase, Code, Activity, DollarSign, Newspaper, Building2, ChevronDown, ChevronUp, Brain } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Case } from "@/lib/types";

interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: number;
}

// Pre-written responses for Tech Lead featured questions
const techLeadPreWrittenResponses: Record<string, string> = {
  "inflektiopiste": `Se ei ole intuitio — se on analyysin ja historian yhdistelmä.

Vuonna 2019 tein ensimmäisen sijoitukseni Nvidiaan. Tuolloin Wall Streetin konsensus oli selvä: Nvidia on peliyhtiö, joka tekee näytönohjaimia. Mutta kun katsoin syvemmälle, näin jotain muuta. Näin infrastruktuurin, joka mahdollistaisi seuraavan teknologisen harppauksen. Ei siksi, että olisin ollut fiksumpi kuin muut, vaan siksi, että olin valmis kyseenalaistamaan vallitsevan narratiivin ja katsomaan eteenpäin.

**Mikä erottaa inflektiopisteen hypestä?**

Inflektiopiste ei ole teknologia, joka puhuttaa konferensseissa. Se on teknologia, joka ratkaisee todellisen, mitattavan ongelman ja jonka käyttöönottokynnys on riittävän matala, että se skaalautuu nopeasti.

NVIDIA 2019 ei ollut hype, koska:
- Data-aika kasvoi eksponentiaalisesti
- Pilvipalvelut tarvitsivat laskentatehoa
- Kukaan muu ei pystynyt kilpailemaan tehossa

AI nyt 2024-2025 ei ole hype, koska:
- Teknologia on käyttövalmis (ei enää labra-vaiheessa)
- ROI on mitattavissa kuukausissa (ei vuosissa)
- Työkalut ovat saatavilla kaikille (ei enää vain jättiyrityksille)

**Miten tunnistan sen käytännössä?**

Ensinnäkin: seuraan mitä parhaat tekevät, en mitä useimmat sanovat. Jensen Huang (NVIDIA) ei puhu hypestä — hän rakentaa infrastruktuuria. Sam Altman (OpenAI) ei myy tulevaisuutta — hän julkaisee toimivia työkaluja. Nämä ovat signaaleja.

Toiseksi: testaan itse. En usko PowerPoint-esityksiin. Rakennan prototyyppejä, mittaan tuloksia, ja katson toimiiko se. Jos teknologia ei ratkaise ongelmaa paremmin kuin nykyinen tapa, se ei ole inflektiopiste — se on hype.

Kolmanneksi: kysyn: onko tämä defensiivinen vai offensiivinen liike? Jos yritys ottaa teknologian käyttöön, koska "kaikki muutkin tekevät niin", se on defensiivinen. Jos yritys ottaa sen käyttöön, koska se luo kilpailuedun, jota muut eivät pysty kopioimaan nopeasti, se on offensiivinen. Inflektiopisteet syntyvät offensiivisista liikkeistä.

**Miksi tämä on kriittistä Hummille?**

Koska olemme juuri nyt siinä ikkunassa, jossa ensimmäiset liikkujat saavat suhteettoman suuren edun. 12 kuukauden päästä AI-pohjaiset työkalut ovat kaikilla. Mutta organisaatiot, jotka ovat rakentaneet prosessinsa, datansa ja kulttuurinsa AI-natiiviiksi jo nyt, ovat 24 kuukautta edellä kilpailijoita.

Tämä ei ole arvaus. Tämä on sama dynamiikka, jonka näin NVIDIA:n kohdalla. Ja sama dynamiikka, jonka näin Internetin murroksessa 2000-luvun alussa. Teknologia itsessään ei ole inflektiopiste. Inflektiopiste on hetki, jolloin teknologia, liiketoimintamalli ja markkinan valmius kohtaavat.

Me olemme siinä hetkessä juuri nyt.`,

  "18-kuukautta": `Tavoite on mitattava: puolittaa käsittelyajat ja nostaa asiakastyytyväisyys merkittävästi 18 kuukaudessa.

Tämä ei ole optimistinen arvaus. Se on laskennallinen seuraus siitä, että prosessit rakennetaan AI-natiiveiksi alusta alkaen.

**Mitä AI-transformaatio oikeasti tarkoittaa?**

AI-transformaatio ei ole teknologian käyttöönottoa teknologian vuoksi. Se on liiketoiminnan perustavanlaatuinen uudelleenrakentaminen tavalla, joka tuottaa mitattavaa arvoa yritykselle ja sen asiakkaille.

Konkreettisesti tämä tarkoittaa kolmea asiaa:

**1. Data muuttuu kilpailukyvyksi**

Agentic AI ja RAG-teknologia mahdollistavat sen, että hajallaan oleva tieto – sähköpostit, asiakastiedustelut, dokumentit, hiljainen tieto – muuttuu haettavaksi, käytettäväksi ja sovellettavaksi tiedoksi.

Kun asiantuntija saa vastauksen kysymykseen 30 sekunnissa 30 minuutin sijaan, organisaatio on ottanut kymmenkertaisen harppauksen tuottavuudessa. Mutta tämä vaatii systemaattista työtä: dataa ei voi vain syöttää malliin ja olettaa, että magia tapahtuu.

Tarvitaan arkkitehtuuri, prosessit, ja ymmärrys siitä, mitä dataa tarvitaan, missä muodossa, ja miten sitä käytetään.

**2. Autonomia vapauttaa ihmiset tekemään sitä, missä he ovat parhaita**

LangChain ja LangGraph mahdollistavat monimutkaisten työpolkujen rakentamisen, joissa AI hoitaa rutiinit ja ihmiset keskittyvät ongelmanratkaisuun.

Aspassa tämä voisi tarkoittaa, että yksinkertaiset asiakastiedustelut käsitellään automaattisesti 24/7, mutta monimutkaiset tilanteet eskaloidaan asiantuntijalle – ei tyhjästä, vaan täydellä kontekstilla varustettuna.

Asiantuntija ei käytä aikaa tiedon keräämiseen, vaan ratkaisun rakentamiseen. Tämä ei ole tulevaisuutta. Teknologia on olemassa nyt.

**3. Koko organisaatio muuttuu oppivaksi**

Tämä on kriittisin ja vaikein osa. Jos AI-osaaminen keskittyy pieneen tiimiin, transformaatio epäonnistuu. Mutta jos koko henkilöstö – myös aspassa työskentelevät – oppii käyttämään uusinta teknologiaa osana jokapäiväistä työtä, koko organisaatio on valmis, kun teknologia ottaa seuraavan harppauksen.

Ja se tulee ottamaan. Nopeus, jolla AI kehittyy, tarkoittaa, että kilpailuetu ei synny siitä, että ottaa käyttöön tämän päivän työkalut. Se syntyy siitä, että organisaatio pystyy omaksumaan huomisen työkalut nopeammin kuin kilpailijat.

**Konkreettiset mittarit 18 kuukaudessa:**
- Keskimääräiset käsittelyajat: -50%
- Asiakastyytyväisyys (CSAT): Merkittävä nousu
- Henkilöstön tuottavuus: +66%
- Autonomisten prosessien osuus: 40-60%

Tämä ei ole teoria. Se on toteutettavissa – jos se tehdään oikein.`,

  "demo-todiste": `Rakensin toimivan demon siitä, mitä puhun.

En puhu vain teoriasta tai konsepteista. Olen rakentanut toimivan sovelluksen, joka osoittaa, miten AI voi ratkaista todellisia ongelmia aspassa. Tämä ei ole teknologian tähden tehty projekti. Se on todiste siitä, että ymmärrän sekä teknologian että liiketoiminnan riittävän syvällisesti yhdistääkseni ne tavalla, joka tuottaa arvoa.

**Mitä demo tekee?**

Demo on täysipainoinen AI-assistentti, joka:
- Käyttää RAG-teknologiaa (Retrieval-Augmented Generation) hakeakseen tietoa dokumenteista
- Yhdistää LangChain + GPT-4:n älykkääseen kontekstin hallintaan
- Simuloi todellista asiakaspalveluskenaariota

Mutta tärkein anti ei ole teknologia — se on **liiketoimintalogiikka**. Demo ei ole rakennettu näyttämään, miten hienoa teknologia on. Se on rakennettu näyttämään, miten teknologia ratkaisee Hummin liiketoimintahaasteen: hajallaan olevan tiedon, manuaaliset prosessit, ja skaalautuvuuden rajoitteet.

**Miksi tämä on todiste?**

Koska kuka tahansa voi sanoa: "Meidän pitäisi ottaa AI käyttöön." Harvempi osaa sanoa: "Näin se tehdään — ja tässä on toimiva prototyyppi."

Tämä on tapa, jolla teknologiajohtajan tulisi lähestyä ongelmia:
1. **Ymmärrä liiketoimintahaaste** (mikä on todellinen pullonkaula?)
2. **Tunnista teknologia, joka ratkaisee sen** (ei päinvastoin)
3. **Rakenna prototyyppi** (älä osta lisenssejä ennen kuin tiedät, toimiiko)
4. **Mittaa tulokset** (onko tämä investointi vai kuluerä?)

Demo on todiste siitä, että osaan tehdä kaikki neljä vaihetta. Ja se on todiste siitä, että olen valmis näyttämään omistautumiseni visiolleni jo ennen kuin minua on palkattu.

**Mitä tämä tarkoittaa Hummille?**

Se tarkoittaa, että en tule ensimmäisenä päivänä tyhjin käsin ja sano: "No, aloitetaanpa suunnittelemaan." Tulen valmiiksi rakennettuna visiolla, toimivalla prototyypillä, ja selkeällä roadmapilla siitä, miten tämä skaalautuu koko organisaatioon.

Teknologiajohtaja, joka ei osaa rakentaa, on projektipäällikkö. Teknologiajohtaja, joka osaa rakentaa mutta ei ymmärrä liiketoimintaa, on hyvä koodari väärässä roolissa. Teknologiajohtaja, joka yhdistää molemmat, on kilpailuetu.

Minä olen se kolmas.`,

  "90-paivaa": `Ensimmäiset 90 päivää määrittävät, onnistuuko transformaatio vai ei.

**Päivät 1-30: Kartoita data, ymmärrä pullonkaulat**

En aloita ratkaisuista. Aloitan kuuntelemisesta. Ensimmäinen 30 päivää on datan, prosessien ja ihmisten ymmärtämistä.

Konkreettiset toimet:
- **Haastattele 20 ihmistä**: asiakaspalvelijat, johtoportaa, keskitason esimiehiä
- **Kartoita prosessit**: missä menee aikaa? Missä on manuaalista työtä? Missä on turhautumista?
- **Tunnista data**: missä se on? Missä muodossa? Kuka sitä käyttää? Kuka sitä tarvitsee mutta ei saa?
- **Valitse 1 quick win**: pieni pilottiprojekti, joka on toteutettavissa 60 päivässä ja tuottaa mitattavaa arvoa

Tavoite ei ole korjata kaikkea. Tavoite on ymmärtää, mikä on kriittisin pullonkaula, joka jos ratkaistaan, avaa tien seuraaville ratkaisuille.

**Päivät 31-60: Rakenna pilotti, todista arvo**

Nyt rakennetaan. Ei täydellistä ratkaisua, vaan toimiva pilotti, joka todistaa konseptin.

Esimerkki: FAQ-automaatio
- Kerää 200 yleisintä kysymystä ja vastaukset
- Rakenna RAG-pohjainen chat, joka osaa vastata niihin
- Testaa 10 ihmisellä viikon ajan
- Mittaa: kuinka monta kysymystä ratkesi ilman ihmisen apua? Kuinka nopeasti? Oliko vastaus oikea?

Jos tämä onnistuu: skaalaa. Jos ei: opi miksi, korjaa, testaa uudelleen.

Tämä on tapa, jolla teknologia-pilotit pitäisi tehdä: nopea, mitattava, opettavainen.

**Päivät 61-90: Skaalaa, opi, valmistele seuraava aalto**

Nyt pilotti on toiminnassa. Seuraava vaihe on:
- Laajentaa pilotin käyttöä (FAQ → asiakastiedustelut → sisäinen tiedonhaku)
- Mitata tulokset ja esittää ne johdolle
- Rakentaa roadmap seuraaville 6 kuukaudelle
- Aloittaa henkilöstön koulutus (AI ei ole uhka, se on työkalu)

**Miksi tämä toimii?**

Koska se ei ole "big bang" -lähestyminen. Se ei ole: "Rakennetaan 18 kuukaudessa kokonainen ratkaisu ja toivotaan että se toimii." Se on: "Rakennetaan 60 päivässä jotain pientä, todistetaan että se toimii, opitaan siitä, ja tehdään seuraava askel."

Tämä on tapa, jolla parhaat teknologiatiimit toimivat. Iteratiivisesti, mittaavasti, oppien.

Ja tämä on tapa, jolla aion johtaa Hummin AI-transformaatiota.`,

  "build-vs-buy": `Lähtökohta on aina sama: osta vakio, rakenna kilpailuetu.

**Zendesk AI: Nopea käyttöönotto, kallis skaalautuvuus**

Zendesk AI on valmis ratkaisu. Se toimii, se on tuettu, ja se on käytössä tuhansilla yrityksillä. Mutta:
- Se maksaa. Paljon. Kun käyttäjämäärä kasvaa, kustannukset kasvavat lineaarisesti.
- Se on geneerinen. Zendesk ei tunne Hummin dataa, prosesseja, tai erityistarpeita syvällisesti.
- Se on lukittu. Et voi muokata sitä vapaasti. Et voi integroida sitä mihin tahansa. Et omista dataa samalla tavalla.

**Plussat:**
- Nopea käyttöönotto (viikkoja, ei kuukausia)
- Ei tarvitse rakentaa infrastruktuuria
- Tuki ja ylläpito mukana

**Miinukset:**
- Korkeat kustannukset pitkällä aikavälillä
- Rajallinen räätälöitävyys
- Vendor lock-in

**N8N + Custom GPT: Halpa, joustava, oma kontrolli**

N8N on no-code/low-code automaatiotyökalu. Se on avoimen lähdekoodin, ja se integroituu mihin tahansa. Yhdistettynä GPT-4:ään (tai Claudeen, tai mihin tahansa LLM:ään) saat:
- Täyden hallinnan työnkulkuihin
- Alhaiset kustannukset (maksat vain API-kutsuista, ei per-user lisenssistä)
- Vapaan datan omistajuuden

Mutta:
- Se vaatii rakentamista. Ei valmista pakettia.
- Se vaatii ylläpitoa. Sinun tiimisi vastaa siitä, että se toimii.
- Se vaatii osaamista. Ei voi ulkoistaa toiselle firmalle.

**Plussat:**
- Alhaiset kustannukset skaalautuessa
- Täysi räätälöitävyys
- Ei vendor lock-in

**Miinukset:**
- Vaatii kehitystyötä
- Vaatii sisäistä osaamista
- Ei valmista tukea

**Suositukseni: Hybrid-malli**

Osta Zendesk ydintyökaluiksi (tikettijärjestelmä, CRM-integraatiot, perusautomaatiot). Mutta älä osta Zendesk AI:ta. Sen sijaan:

1. Rakenna custom-ratkaisut N8N + GPT:llä sellaisiin tarpeisiin, jotka ovat kriittisiä Hummille mutta joita Zendesk ei ratkaise tarpeeksi hyvin.
2. Käytä Zendeskiä käyttöliittymänä, mutta N8N:ää älyn taustalla.
3. Säästä 60-70% kustannuksista verrattuna Zendesk AI:hin, ja saat paremman ratkaisun Hummin tarpeisiin.

**Päätöksenteon logiikka:**

Jos teknologia ei ole kilpailuetusi lähde, osta se. Jos se on, rakenna se. Zendeskin tiketöintijärjestelmä ei ole kilpailuetu – kaikilla on se. Mutta AI, joka ymmärtää Hummin prosessit, datan ja asiakkaat syvällisesti, on kilpailuetu.

Siksi: Osta Zendesk. Rakenna AI.`,

  "kayttokate-kpi": `Teknologiajohtajan tärkein tehtävä ei ole rakentaa koodia, vaan kannattavuutta.

En valitsisi käyttökatetta. Ei siksi, että se olisi epärelevantti, vaan siksi, että se kertoo lopputuloksen – ei syytä siihen.

Teknologiajohtajan KPI:n täytyy mitata arvonluontia, ei kirjanpidollista tulosta. Siksi asettaisin keskiöön kolme mittaria:

**1. Tuottavuuden kasvu per henkilö**

Kuinka paljon enemmän saamme aikaan ilman lisäresursseja? Tämä on kriittisin mittari, koska se kertoo, tuottaako teknologia todellista arvoa vai onko se vain kustannuserä.

Jos henkilöstön tuottavuus kasvaa 50-66%, kuten tavoitteeni on, se tarkoittaa, että voimme:
- Palvella enemmän asiakkaita ilman lisähenkilöstöä
- Tai: palvella samaa määrää asiakkaita paremmalla laadulla ja nopeammin

Molemmat vaihtoehdot parantavat kannattavuutta. Mutta ilman mittausta emme tiedä, toimiiko se.

**2. Automaatioaste**

Kuinka suuri osa prosesseista toimii ilman manuaalista kosketusta?

Jos rakennamme järjestelmän, joka automatisoi 40-60% yksinkertaisista asiakastiedusteluista, se vapauttaa henkilöstön tekemään sitä työtä, jossa ihminen on korvaamaton: monimutkaisten ongelmien ratkaisu, empatia, luova ajattelu.

Automaatioaste ei ole itseisarvo. Mutta se on indikaattori siitä, toimiiko AI oikeasti vai onko se vain lisätyökalu työkalulaatikossa.

**3. AI ROI**

Jokaisen AI-implementaation mitattava tuotto suhteessa kustannukseen.

Jos investoimme €200k ensimmäisenä vuonna, mutta se tuottaa €500k lisäarvoa (ajan säästö, kustannusten lasku, asiakastyytyväisyyden nousu → asiakaspysyvyys), ROI on 150%. Se on hyvä.

Jos investoimme €200k, mutta emme näe mitattavaa arvoa, projekti lopetetaan. Ei jatketa "koska olemme jo aloittaneet".

**Miksi nämä kolme?**

Koska ne yhdessä kertovat, onko teknologia investointi – vai vain kuluerä.

- Tuottavuus mittaa tehoa.
- Automaatioaste mittaa skaalautuvuutta.
- ROI mittaa kannattavuutta.

Ja ne kaikki vaikuttavat suoraan käyttökatteeseen. Mutta toisin kuin käyttökate, nämä mittarit kertovat **miksi** kate paranee ja **mitä** meidän pitää tehdä parantaaksemme sitä entisestään.

**Bottom line:**

Teknologiajohtajan, joka keskittyy vain käyttökatteeseen, on helppoa leikata kustannuksia. Mutta se ei rakenna kilpailuetua. Teknologiajohtaja, joka keskittyy tuottavuuteen, automaatioon ja ROI:hin, rakentaa organisaation, joka on tehokkaampi, skaalautuvampi ja kannattavampi – ja se näkyy käyttökatteessa automaattisesti.`,

  "makrotalous": `AI on teknologia, mutta sen vaikutus on makrotaloudellinen.

Seitsemän vuotta päiväkaupankäynnissä ei opettanut minulle vain sitä, miten yritykset tekevät rahaa. Se opetti minulle, miten teknologia ja talous vaikuttavat toisiinsa tavalla, jota useimmat eivät näe.

**Ajoitus on kaikki kaikessa**

Paras teknologia väärällä hetkellä polttaa rahaa. Hyvä teknologia oikealla hetkellä luo kilpailuedun, jota on vaikea kopioida.

NVIDIA 2019 oli oikea ajoitus, koska:
- Data-aika oli juuri räjähtämässä
- Pilvipalvelut tarvitsivat laskentatehoa
- Kilpailijoilla ei ollut vastaavaa ratkaisua valmiina

AI nyt 2024-2025 on oikea ajoitus Hummille, koska:
- Teknologia on kypsää (ei enää labra-vaiheessa)
- Kustannukset ovat laskeneet (GPT-4 API on murto-osa siitä, mitä se oli vuosi sitten)
- Kilpailijoilla ei ole vielä vastaavia ratkaisuja

**Makrotalous määrittää, mihin kannattaa investoida**

Kun talous kasvaa, voit investoida pitkän aikavälin projekteihin, joiden ROI näkyy vuosien päästä. Kun talous hidastuu, sinun täytyy keskittyä projekteihin, joiden ROI näkyy kuukausissa.

Juuri nyt olemme tilanteessa, jossa:
- Yritykset etsivät kustannussäästöjä (AI automatisoi)
- Yritykset etsivät kilpailuetuja (AI differentoi)
- Yritykset etsivät skaalautuvuutta ilman lineaarista henkilöstölisäystä (AI skaalautuu)

Tämä ei ole sattumaa. Tämä on makrotaloudellinen todellisuus, joka tekee juuri tästä hetkestä täydellisen AI-transformaatiolle.

**Teknologia ei ole itseisarvo**

Tämä on tärkein oppi makrotaloudesta. Teknologia on työkalu. Jos se ei ratkaise liiketoimintaongelmaa, se on turha.

Siksi en lähesty AI:ta kysymyksellä: "Mitä hienoa voimme rakentaa?" Lähestyn sitä kysymyksellä: "Mikä on pullonkaula, joka hidastaa Hummin kasvua tai heikentää kannattavuutta – ja voiko AI ratkaista sen?"

Jos vastaus on kyllä: rakennetaan. Jos vastaus on ei: ei rakenneta.

**Konkreettinen esimerkki:**

Kun arvioin Build vs. Buy -päätöstä (Zendesk AI vs. N8N custom), en kysy vain: "Kumpi on parempi teknologia?" Kysyn: "Kumpi on parempi liiketoimintapäätös tässä makrotaloudellisessa ympäristössä?"

Jos olemme tilanteessa, jossa kassavirta on kriittinen: osta Zendesk, koska se on nopea käyttöönotto. Jos olemme tilanteessa, jossa kilpailuetu on kriittinen ja meillä on aikaa rakentaa: rakenna N8N custom.

Teknologiapäätökset eivät ole teknologiapäätöksiä. Ne ovat liiketoimintapäätöksiä, joihin vaikuttaa makrotalous, kilpailutilanne, ja resurssit.

Ja siksi ymmärrykseni makrotaloudesta ei ole "kiva bonus" – se on välttämätön taito, joka erottaa hyvän teknologiajohtajan erinomaisesta.`,

  "resilienssi": `Resilienssi ei ole sana, jonka voi oppia kirjasta.

Vuonna 2018 väkivalta aiheutti osittaisen neliraajahalvauksen. Fyysinen todellisuuteni muuttui peruuttamattomasti. Jouduin rakentamaan koko elämäni – ja työskentelytapani – täysin uudelleen. Ei ollut B-suunnitelmaa. Ei valinnaisia polkuja. Vain yksi vaihtoehto: sopeutua tai epäonnistua.

Se opetti minulle kolme asiaa, jotka suoraan soveltuvat organisaation transformaatioon:

**1. Kun vanhat tavat eivät toimi, on pakko innovoida**

Ei ole mukavuusaluetta, johon vetäytyä. Kun keho ei toimi kuten ennen, sinun on löydettävä uusia tapoja tehdä kaikki. Ei voi sanoa: "Tämä on liian vaikeaa." On pakko löytää tapa.

Organisaatiossa sama pätee. Kun vanhat prosessit eivät skaalaudu, kun manuaalinen työ ei pysy kasvun tahdissa, kun kilpailijat ohittavat, ei voi sanoa: "Näin olemme aina tehneet." On pakko muuttua.

Minulla on henkilökohtainen todiste siitä, että pystyn muuttumaan radikaalisti kun se on välttämätöntä. Ja organisaatiotransformaatio vaatii täsmälleen samaa kykyä.

**2. Kriisi paljastaa, mikä on oikeasti tärkeää**

Kun resurssit ovat rajalliset – aika, energia, raha – sinun on pakko priorisoida. Ei ole varaa tehdä asioita, jotka eivät tuota arvoa.

Kun jouduin rakentamaan työskentely-urani uudelleen, minun oli kysyttävä: Mikä on oikeasti tärkeää? Mikä tuottaa arvoa? Mikä on vain "nice to have"?

Tämä on sama kysymys, joka teknologiajohtajan pitää kysyä joka päivä: Mikä projekti on kriittinen? Mikä on vain hype? Mihin kannattaa investoida resursseja?

Resilienssi opettaa armotonta priorisointia. Ja se on täsmälleen sitä, mitä AI-transformaatio vaatii.

**3. Sopeutuminen ei ole valinta, se on ainoa vaihtoehto**

Sam Altman, OpenAI:n toimitusjohtaja, on sanonut, että tärkeimmät ominaisuudet tulevaisuuden työelämässä ovat sopeutumiskyky ja resilienssi.

Minulla on molempien äärimmäinen todiste. En vain puhu sopeutumiskyvystä – olen elänyt sen joka päivä viimeiset kuusi vuotta.

**Mitä tämä tarkoittaa johtamiselle?**

Olen perheetön, vaimoton ja lapseton. Käytän kaiken hereillä oloaikani tähän työhön. Tämä ei ole uhka työn ja elämän tasapainolle – se on tietoinen valinta siitä, että haluan olla siellä, missä tehdään jotain merkityksellistä.

Kun organisaatio kohtaa kriisin – ja AI-transformaatio on kriisi, koska se muuttaa kaiken – tarvitaan johtaja, joka ei lannista. Joka näkee muutoksen mahdollisuutena, ei uhkana. Ja joka on valmis tekemään mitä tahansa saadakseen sen toimimaan.

Olen se johtaja. En siksi, että sanon olevani, vaan siksi, että olen jo todistanut olevani.`,

  "ai-native": `AI-native organisaatio ei ole paikka, jossa on ChatGPT-lisenssit.

Se on organisaatio, jossa AI on rakennettu prosesseihin, kulttuuriin ja päätöksentekoon alusta alkaen. Useimmat epäonnistuvat siinä, koska ne yrittävät asentaa AI:n olemassa oleviin prosesseihin sen sijaan, että rakentaisivat prosessit AI-natiiveiksi.

**Mikä on AI-native organisaatio?**

AI-native organisaatio tarkoittaa kolmea asiaa:

**1. Data on strukturoitu ja haettavissa**

Jos data on hajallaan, sitä ei voi käyttää. RAG-teknologia vaatii, että data on indeksoitu ja haettavissa. Tämä tarkoittaa, että organisaation täytyy:
- Keskittää data yhteen paikkaan (tai ainakin integroida järjestelmät keskenään)
- Strukturoida data tavalla, jota AI ymmärtää
- Varmistaa, että data on laadukasta (roskaa sisään, roskaa ulos)

**2. Prosessit on rakennettu automaatiota varten**

Ei voi automatisoida kaaosta. Jos prosessit eivät ole selkeitä, AI ei voi hoitaa niitä. Tämä tarkoittaa, että:
- Prosessit dokumentoidaan (mitä tehdään, missä järjestyksessä, millä datalla)
- Päätöksentekopisteet tunnistetaan (milloin tarvitaan ihminen, milloin AI riittää)
- Työkalut integroidaan (AI ei ole erillinen työkalu, se on osa työnkulkua)

**3. Kulttuuri on oppiva, ei pelkäävä**

Suurin syy, miksi AI-transformaatiot epäonnistuvat, ei ole teknologia. Se on henkilöstö, joka vastustaa muutosta, koska pelkää, että AI korvaa heidät.

AI-native organisaatiossa henkilöstö ymmärtää, että AI ei ole uhka – se on työkalu, joka vapauttaa heidät tekemään sitä, missä he ovat parhaita: luova ajattelu, empatia, monimutkaisten ongelmien ratkaisu.

**Miksi useimmat epäonnistuvat?**

Koska ne tekevät AI-transformaation väärin päin. Ne:
1. Ostavat ChatGPT-lisenssit
2. Sanovat henkilöstölle: "Käyttäkää tätä"
3. Ihmettelevät, miksei mikään muutu

Oikea tapa on:
1. Tunnista pullonkaulit (mikä hidastaa? Mikä on manuaalista? Mikä turhautuu?)
2. Rakenna ratkaisu, joka ratkaisee sen (ei geneerinen AI, vaan spesifi AI tälle ongelmalle)
3. Testaa, mittaa, opi (onko tämä parempi kuin vanha tapa? Jos ei, miksi ei?)
4. Skaalaa (kun se toimii pienessä mittakaavassa, laajenna sitä)

**Konkreettinen esimerkki:**

Hummin tapauksessa AI-native tarkoittaisi:
- Asiakastiedustelut tulevat → AI tarkistaa: onko tämä yksinkertainen kysymys? Jos on, vastaa automaattisesti. Jos ei, lähetä asiantuntijalle kontekstilla.
- Asiantuntija ei aloita tyhjästä. Hänellä on kaikki relevantti data valmiiksi haettuna. Hän ei käytä aikaa tiedon keräämiseen – hän käyttää sen ratkaisun rakentamiseen.
- Ratkaisu dokumentoidaan automaattisesti, jotta AI oppii siitä seuraavaa kertaa varten.

Tämä on AI-native. Ei erillisiä työkaluja – integroitu työnkulku, jossa AI on osa prosessia, ei lisätyökalu sen päälle.

**Bottom line:**

AI-native ei ole projekti. Se on kulttuuri, prosessit, ja arkkitehtuuri, jotka on rakennettu AI:lle alusta alkaen. Ja useimmat epäonnistuvat siinä, koska ne yrittävät tehdä sen jälkikäteen.

Humm ei tee sitä virhettä – jos minä johdan transformaatiota.`,

  "luottamus-30-paivaa": `En puhumalla, vaan näyttämällä.

Luottamus ansaitaan teoilla, ei sanoilla. Ensimmäiset 30 päivää ovat kriittiset, koska ne määrittävät, onko uusi teknologiajohtaja "vain toinen konsultti" vai joku, joka oikeasti ymmärtää ja tuottaa arvoa.

**Miten ansaitsen johdon luottamuksen?**

**1. En lupaa liikaa**

Ensimmäinen virhe, jonka uusi johtaja tekee, on luvata: "18 kuukaudessa rakennamme täydellisen AI-järjestelmän." Se kuulostaa hyvältä. Mutta kun se ei toteudu, luottamus on poissa.

Minä sanon: "30 päivässä kartoitan pullonkaulat. 60 päivässä rakennan pilotin, joka todistaa, että tämä toimii. 90 päivässä meillä on mitattavaa dataa siitä, kannattaako jatkaa."

Tämä on realistinen. Ja se on mitattavissa. Ja kun se toteutuu, johto näkee, että sanani pitävät.

**2. Keskityn liiketoiminta-arvoon, en teknologiaan**

Johto ei välitä siitä, käytänkö LangChainä vai jotain muuta. He välittävät siitä, parantuuko kannattavuus, kasvaako liikevaihto, ja pysyvätkö asiakkaat tyytyväisinä.

Siksi ensimmäinen 30 päivää keskittyy kysymykseen: "Mikä on suurin liiketoimintahaaste, joka hidastaa kasvua tai heikentää kannattavuutta?"

Kun johto näkee, että ymmärrän liiketoiminnan ensin ja teknologian toisena, he luottavat siihen, että teen oikeita päätöksiä.

**3. Tuon tuloksia nopeasti**

Johto ei voi odottaa 18 kuukautta nähdäkseen, toimiiko tämä. He tarvitsevat nopeita voittoja.

Siksi ensimmäinen 60 päivää sisältää pilotin, joka:
- On pieni (ei massiivinen projekti, joka vie kaikki resurssit)
- On mitattavissa (säästääkö tämä aikaa? Rahaa? Parantaako tyytyväisyyttä?)
- On skaalattavissa (jos tämä toimii, voidaanko se laajentaa?)

Kun johto näkee ensimmäisen pilotin onnistuvan ja tuottavan mitattavaa arvoa, he uskovat, että loput projektistakin onnistuvat.

**Miten ansaitsen tiimin luottamuksen?**

**1. Kuuntelen ensin**

Tiimi tietää, missä ongelmat ovat. He tekevät työtä joka päivä. He tietävät, mikä hidastaa, mikä turhautuu, ja mikä ei toimi.

Ensimmäinen 30 päivää sisältää 20 haastattelua. En tule sanomaan: "Näin me teemme nyt." Tulen kysymään: "Mikä on suurin ongelma, jonka kohtaat päivittäin?"

Kun tiimi näkee, että kuuntelen heitä, he luottavat siihen, että rakennan ratkaisuja, jotka todella auttavat heitä – en vain hienoja demoja johtoportaalle.

**2. En korvaa ihmisiä**

Suurin pelko AI-transformaatiossa on: "Korvaako tämä minut?" Jos tiimi uskoo, että AI tarkoittaa irtisanomisia, transformaatio epäonnistuu.

Siksi sanon suoraan ensimmäisenä päivänä: "AI ei ole täällä korvaamaan ketään. Se on täällä vapauttamaan teidät tekemään sitä työtä, missä te olette korvaamattomia: luova ajattelu, empatia, monimutkaisten ongelmien ratkaisu."

Ja todistan sen rakentamalla ratkaisuja, jotka automatisoivat rutiinit – mutta vaativat ihmisen siellä, missä ihminen on paras.

**3. Teen itse sen, mitä pyydän muilta tekemään**

Jos pyydän tiimiä oppimaan uusia työkaluja, opin ne itse ensin. Jos pyydän heitä testaamaan pilottia, testaan sen itse ensin. Jos pyydän heitä antamaan palautetta, kuuntelen sen ja toimin sen mukaan.

Johtaja, joka ei tee itse sitä, mitä pyytää muilta, ei ansaitse kunnioitusta. Johtaja, joka tekee, ansaitsee.

**Bottom line:**

Luottamus ansaitaan näyttämällä, ei puhumalla. Ensimmäiset 30 päivää ovat kuuntelua, seuraavat 30 päivää rakentamista, ja seuraavat 30 päivää todistamista.

Ja kun johto ja tiimi näkevät, että sanoni pitävät, tulokseni ovat mitattavissa, ja motivaationi on aito, luottamus tulee – koska se on ansaittu.`
};

// Tech Lead Modal Component
function TechLeadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [jobApplicationOpen, setJobApplicationOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [followUpSuggestions] = useState<string[]>([
    "Ei johtamiskokemusta - miksi uskot pärjääväsi?",
    "Vanhemmat kehittäjät kyseenalaistavat päätöksesi - mitä teet?",
    "Miten erottaudut sadoista muista hakijoista?",
    "Ensimmäinen tekninen päätös epäonnistuu - reagointisi?",
    "Tiimi vastustaa AI-muutosta - strategiasi?",
    "Miksi Hummin pitäisi ottaa riski kokemattomasta johtajasta?"
  ]);
  const { toast } = useToast();

  const techLeadChatMutation = useMutation({
    mutationFn: async (data: { message: string }) => {
      const response = await apiRequest("POST", "/api/tech-lead-chat", { 
        message: data.message
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        content: data.response,
        isUser: false,
        timestamp: Date.now()
      }]);
    },
    onError: () => {
      toast({
        title: "Virhe",
        description: "Viestin lähettäminen epäonnistui. Yritä uudelleen.",
        variant: "destructive"
      });
    }
  });

  const handleSend = () => {
    const message = inputValue.trim();
    if (!message || techLeadChatMutation.isPending) return;

    setMessages(prev => [...prev, {
      content: message,
      isUser: true,
      timestamp: Date.now()
    }]);

    setInputValue("");
    techLeadChatMutation.mutate({ message });
  };

  // Simulate streaming text effect for pre-written responses
  const simulateStreamingResponse = (fullResponse: string) => {
    // Add empty AI message that will be filled character by character
    setMessages(prev => [...prev, {
      content: "",
      isUser: false,
      timestamp: Date.now()
    }]);

    let currentIndex = 0;
    const charsPerTick = 20; // Characters to add per interval

    const interval = setInterval(() => {
      if (currentIndex < fullResponse.length) {
        const chunkEnd = Math.min(currentIndex + charsPerTick, fullResponse.length);
        const newChunk = fullResponse.slice(currentIndex, chunkEnd);
        currentIndex = chunkEnd;

        setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          const lastMessageIndex = newMessages.length - 1;

          if (lastMessageIndex >= 0 && !newMessages[lastMessageIndex].isUser) {
            newMessages[lastMessageIndex] = {
              ...newMessages[lastMessageIndex],
              content: fullResponse.slice(0, currentIndex)
            };
          }

          return newMessages;
        });
      } else {
        clearInterval(interval);
      }
    }, 25); // 25ms interval for smooth streaming effect
  };

  // Helper function to match question to response key
  const getResponseKey = (question: string): string | null => {
    // Disabled - always use API for consistent, up-to-date responses
    return null;
  };

  const handleExampleClick = (question: string) => {
    if (techLeadChatMutation.isPending) return;

    setMessages(prev => [...prev, {
      content: question,
      isUser: true,
      timestamp: Date.now()
    }]);

    // Hide suggestions after clicking
    setShowSuggestions(false);

    // Check if we have a pre-written response for this question
    const responseKey = getResponseKey(question);
    if (responseKey && techLeadPreWrittenResponses[responseKey]) {
      // Use pre-written response with streaming effect
      simulateStreamingResponse(techLeadPreWrittenResponses[responseKey]);
    } else {
      // Fall back to API call for questions without pre-written responses
      techLeadChatMutation.mutate({ message: question });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Optimized greeting function to avoid dependency on mutation object
  const sendGreeting = useCallback(() => {
    if (!techLeadChatMutation.isPending) {
      setHasGreeted(true);
      techLeadChatMutation.mutate({
        message: "Tervehdi käyttäjää AI-Panuna ja esittäydy lyhyesti Humm Group Oy:n Tech Lead -hakijana. Mainitse että elämän haasteet ovat opettaneet sinulle sinnikkyyden ja määrätietoisuuden, jotka ovat kriittisiä ominaisuuksia teknologia-johtajuudessa. Kerro että olet tutustunut heidän toimintaansa perusteellisesti ja olet valmis vastaamaan kysymyksiin €10M visiosta ja teknologia-strategiasta."
      });
    }
  }, [techLeadChatMutation]);

  // Send automatic greeting when modal opens
  useEffect(() => {
    if (isOpen && !hasGreeted) {
      sendGreeting();
    }
  }, [isOpen, hasGreeted, sendGreeting]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-5xl max-h-[95vh] bg-gradient-to-br from-slate-900/98 via-slate-800/98 to-slate-900/98 backdrop-blur-xl border border-slate-600/30 shadow-2xl p-0 overflow-hidden">
        {/* Compact Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-700/50 bg-slate-800/40 backdrop-blur-sm">
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="block">Tech Lead - Panu Murtokangas</span>
              <span className="text-xs font-normal text-slate-400 block mt-0.5">
                CV-chat: Keskustele taustastani ja visiostani
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-[calc(95vh-120px)] relative">
          {/* Main Chat Area with Conditional Layout */}
          <div className="flex-1 overflow-hidden relative">
            {messages.length === 0 ? (
              /* WELCOME STATE - Empty chat with prominent question cards */
              <div className="h-full overflow-y-auto px-6 py-8">
                <div className="max-w-4xl mx-auto">
                  {/* Welcome Hero Section */}
                  <div className="text-center mb-12 animate-in fade-in-0 slide-in-from-top-4 duration-700">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/30 animate-in zoom-in-50 duration-500">
                      <Bot className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">
                      Tervetuloa keskustelemaan
                    </h2>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
                      Olen Panu, hakemassa Tech Lead -roolia Humm Group Oy:öön.
                      Kysy minulta mitä tahansa visiostani, osaamisestani tai strategiastani.
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 text-slate-300 text-sm">
                      <Star className="h-4 w-4 text-yellow-400" />
                      Aloita valitsemalla kysymys tai kirjoittamalla omaasi
                    </div>
                  </div>

                  {/* Featured Question Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {followUpSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleExampleClick(suggestion)}
                        disabled={techLeadChatMutation.isPending}
                        className="group relative p-5 rounded-xl bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/60 transition-all duration-300 text-left hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 animate-in fade-in-0 slide-in-from-bottom-4"
                        style={{ animationDelay: `${index * 50}ms`, animationDuration: '600ms' }}
                        data-testid={`tech-lead-welcome-${index}`}
                      >
                        {/* Question Icon */}
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Target className="h-5 w-5 text-blue-400" />
                        </div>

                        {/* Question Text */}
                        <p className="text-slate-200 text-sm font-medium leading-relaxed group-hover:text-white transition-colors">
                          {suggestion}
                        </p>

                        {/* Hover Indicator */}
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Send className="h-3 w-3 text-blue-400" />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                </div>
              </div>
            ) : (
              /* CHAT STATE - Active conversation */
              <ScrollArea className="h-full px-6 py-6">
                <div className="max-w-4xl mx-auto space-y-6">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-in fade-in-0 slide-in-from-bottom-2 duration-500`}
                    >
                      <div className={`flex items-start gap-3 max-w-[85%] ${message.isUser ? 'flex-row-reverse' : ''}`}>
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-xl ${message.isUser ? 'bg-gradient-to-br from-blue-500 to-blue-700' : 'bg-gradient-to-br from-slate-600 to-slate-700'} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                          {message.isUser ? (
                            <User className="h-5 w-5 text-white" />
                          ) : (
                            <Bot className="h-5 w-5 text-white" />
                          )}
                        </div>

                        {/* Message Bubble */}
                        <div className={`${
                          message.isUser
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20'
                            : 'bg-slate-800/60 backdrop-blur-sm text-slate-100 border border-slate-700/50 shadow-xl'
                        } rounded-2xl px-5 py-4`}>
                          {message.isUser ? (
                            <p className="text-base leading-relaxed">{message.content}</p>
                          ) : (
                            <div className="text-base leading-relaxed prose prose-invert prose-slate max-w-none">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  h1: ({children}) => <h1 className="text-xl font-bold mb-3 mt-2 text-white">{children}</h1>,
                                  h2: ({children}) => <h2 className="text-lg font-semibold mb-2 mt-3 text-white">{children}</h2>,
                                  h3: ({children}) => <h3 className="text-base font-medium mb-2 mt-2 text-slate-100">{children}</h3>,
                                  p: ({children}) => <p className="mb-3 last:mb-0 text-slate-100">{children}</p>,
                                  ul: ({children}) => <ul className="list-disc pl-5 mb-3 space-y-1 text-slate-100">{children}</ul>,
                                  ol: ({children}) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-slate-100">{children}</ol>,
                                  li: ({children}) => <li className="text-slate-100">{children}</li>,
                                  strong: ({children}) => <strong className="font-semibold text-white">{children}</strong>,
                                  em: ({children}) => <em className="italic text-slate-200">{children}</em>,
                                  code: ({children}) => <code className="bg-slate-700/80 text-blue-300 px-1.5 py-0.5 rounded text-sm">{children}</code>
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Loading State */}
                  {techLeadChatMutation.isPending && (
                    <div className="flex justify-start animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
                      <div className="flex items-start gap-3 max-w-[85%]">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Bot className="h-5 w-5 text-white animate-pulse" />
                        </div>
                        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl px-5 py-4 shadow-xl">
                          <div className="flex items-center gap-3">
                            <div className="flex gap-1.5">
                              <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce"></div>
                              <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                            <span className="text-sm text-slate-300">Mietin vastausta...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Floating Suggestions Chip (only visible after first message) */}
          {messages.length > 0 && (
            <div className="absolute bottom-20 left-0 right-0 flex justify-center px-6 pointer-events-none z-10">
              <div className="pointer-events-auto">
                <button
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 hover:border-blue-500/50 text-slate-300 hover:text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium">Esimerkkikysymykset</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showSuggestions ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          )}

          {/* Suggestions Overlay (Mobile-friendly bottom sheet style) */}
          {showSuggestions && messages.length > 0 && (
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm z-20 animate-in fade-in-0 duration-300"
              onClick={() => setShowSuggestions(false)}
            >
              <div
                className="absolute bottom-0 left-0 right-0 max-h-[70vh] bg-slate-800/95 backdrop-blur-xl border-t border-slate-700/50 rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom-full duration-500"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Handle Bar */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-12 h-1.5 bg-slate-600 rounded-full"></div>
                </div>

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <h3 className="text-lg font-semibold text-white">Esimerkkikysymykset</h3>
                    </div>
                    <button
                      onClick={() => setShowSuggestions(false)}
                      className="w-8 h-8 rounded-lg bg-slate-700/50 hover:bg-slate-700 flex items-center justify-center transition-colors"
                    >
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Questions List */}
                <ScrollArea className="max-h-[calc(70vh-100px)]">
                  <div className="px-6 py-4 space-y-2">
                    {followUpSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleExampleClick(suggestion)}
                        disabled={techLeadChatMutation.isPending}
                        className="w-full text-left p-4 rounded-xl bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600/50 hover:border-blue-500/50 text-slate-200 hover:text-white transition-all duration-300 hover:scale-[1.01] group"
                        data-testid={`tech-lead-suggestion-${index}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Target className="h-4 w-4 text-blue-400" />
                          </div>
                          <p className="text-sm font-medium leading-relaxed flex-1">
                            {suggestion}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

          {/* Bottom Input Area - Glassmorphic Fixed */}
          <div className="flex-shrink-0 border-t border-slate-700/50 bg-slate-800/40 backdrop-blur-xl px-6 py-4">
            <div className="max-w-4xl mx-auto space-y-3">
              {/* Input Row */}
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="Kysy minulta mitä tahansa Tech Lead -roolista..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={techLeadChatMutation.isPending}
                  className="flex-1 h-12 bg-slate-700/50 backdrop-blur-sm border-slate-600/50 focus:border-blue-500/50 focus:bg-slate-700/70 text-slate-100 placeholder:text-slate-400 rounded-xl px-4 transition-all duration-300"
                  data-testid="tech-lead-chat-input"
                />
                <PulseButton
                  onClick={handleSend}
                  loading={techLeadChatMutation.isPending}
                  disabled={!inputValue.trim()}
                  pulse="subtle"
                  className="h-12 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
                  data-testid="tech-lead-send-button"
                >
                  <Send className="h-5 w-5" />
                </PulseButton>
              </div>

              {/* Job Application Button */}
              <PulseButton
                onClick={() => setJobApplicationOpen(true)}
                variant="outline"
                className="w-full h-11 bg-gradient-to-r from-blue-600/10 to-purple-600/10 hover:from-blue-600/20 hover:to-purple-600/20 border-blue-500/30 hover:border-blue-500/50 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                pulse="subtle"
                data-testid="job-application-button"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Työhakemus
              </PulseButton>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Job Application Modal */}
      <Dialog open={jobApplicationOpen} onOpenChange={setJobApplicationOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl border-slate-600/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-white" />
              </div>
              Työhakemus: Tech Lead - Panu Murtokangas
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              Humm Group Oy:n teknologiajohtajan rooli ja visio
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[70vh] pr-4">
            <div className="prose prose-invert prose-sm max-w-none">
              <div className="text-slate-200 space-y-6">
                <section>
                  <h2 className="text-xl font-bold text-white mb-3">Nykytila ja potentiaali</h2>
                  <p className="mb-3">
                    Näen Hummissa suuren potentiaalin kasvattaa liikevaihtoa, mutta ennen kaikkea käyttökatetta ja tehokkuutta. Se lienee teknologiajohtajan tehtävän ydin.
                  </p>
                  <p className="mb-3">
                    Hummilla on selkeästi vahva liiketoimintaosaaminen sekä myynti- ja markkinointitaidot, sillä se on onnistunut saamaan isoja asiakkuuksia, vaikka markkina Suomessa on rajallinen eikä kunnollista talouskasvua ole pitkään aikaan nähty.
                  </p>
                  <p className="mb-3">
                    Humm on kilpailijoihinsa nähden pieni organisaatio, mutta se on brändännyt itsensä hyvin. Palveluiden keskiössä ovat laatu ja ihmisläheisyys. Yrityksen tulos on kuitenkin heikentynyt viime vuosina, eikä merkittävää kasvua ole tullut.
                  </p>
                  <p className="mb-3 font-semibold text-blue-400">
                    Paikalleen jämähtäminen on ensiaskel tuhoon. Haluan todella päästä ottamaan askelta kohti hallittua, mutta nopeaa kasvua.
                  </p>
                  <p className="mb-3">
                    Tase on kuitenkin vahva, mikä antaa erittäin hyvät lähtökohdat uudelle nousulle. Kilpailija-analyysi viittaa siihen, että tavanomainen asiakaspalvelun ulkoistusbisnes on hiipumassa.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-white mb-3">Teknologiajohtajan rooli kasvun mahdollistajana</h2>
                  <p className="mb-3">
                    Teknologiajohtajan roolia Hummin tulevaisuuden kannalta ei voi riittävästi korostaa. Hummilla on kaikki lähtökohdat nostaa liikevaihto 10 miljoonan euron tasolle ja parantaa samalla kannattavuutta – kyllä, kymmenen miljoonaa, luit oikein.
                  </p>
                  <p className="mb-3">
                    Mikäli Humm on valmis nousemaan seuraavalle tasolle, sen aika on nyt. On käytävä läpi jokaikinen pullonkaula ja otettava uusi teknologia vastaan hallitusti. Samalla on mukauduttava uusien innovaatioiden syntyyn ja rakennettava dynaaminen roadmap: <span className="font-bold text-blue-400">"Humm to 10 million in five years."</span>
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-white mb-3">Oikea hetki toimia</h2>
                  <p className="mb-3">
                    Humm on ottamassa nyt oikeaa askelta oikeaan aikaan.
                  </p>
                  <p className="mb-3">
                    Agentic AI ja uusi MCP-protokolla tarjoavat ensimmäistä kertaa aidosti liiketoimintaa tehostavia ja luotettavia ratkaisuja asiakaspalvelualalle.
                  </p>
                  <p className="mb-3 font-semibold">
                    Tällä hetkellä on 2–5 vuoden aikaikkuna, jolloin on tehtävä iso organisaatiomuutos:
                  </p>
                  <ul className="list-disc pl-6 mb-3 text-slate-200">
                    <li>2 vuotta sitten muutos olisi ollut liian aikainen</li>
                    <li>2 vuoden päästä se olisi jo liian myöhäinen</li>
                  </ul>
                  <p className="mb-3">
                    Tekoäly voi toimia Humm Group Oy:lle sekä tasa-arvoistajana että erottautumiskeinona. Suuremmat kilpailijat liikkuvat hitaasti ja pienemmiltä toimijoilta puuttuu osaaminen – tämä avaa Hummille mahdollisuuden tarjota ketterästi räätälöityjä, kehittyneitä ratkaisuja Suomen markkinoilla. Paikallisen kielen ja kulttuurin ymmärrys on merkittävä kilpailuetu.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-white mb-3">Konkreettiset askeleet ja riskienhallinta</h2>
                  <p className="mb-3">
                    Pelkkä teknologiajohtajan palkkaaminen ei riitä. Koko organisaation on mukauduttava, ja henkilöstöä täytyy kouluttaa uuden teknologian käyttöön.
                  </p>
                  <p className="mb-3">
                    Teknologiajohtajan vastuulla on varmistaa, että uutta ei oteta käyttöön vain teknologian vuoksi, vaan siitä saadaan mitattavaa hyötyä. Selkein tapa aloittaa on AI-vastausluonnokset tiketteihin ja one-click-send -toiminto työntekijälle.
                  </p>
                  <p className="mb-3">
                    Luoda datalla johdettu ympäristö ja koota nykyinen data, niin että tekoälyn käyttöönotto helpottuisi.
                  </p>
                  <p className="mb-3">
                    Keskeistä on asiakasdatan hyödyntäminen eettisesti ja tehokkaasti, sillä tekoäly menestyy datan avulla. Tämä luo perustan Hummin tekoälystrategialle.
                  </p>
                  <p className="mb-3 font-semibold text-blue-400">
                    Yhtälö on selkeä: vahva tase + oikea aikaikkuna + oikeat roolitukset + oikea teknologia ja toteutus = todellinen kilpailuetu.
                  </p>
                  <p className="mb-3">
                    Koska ketteryys on Hummin etu markkinoilla, uuden teknologiajohtajan on aloitettava konkreettiset toimet jo ensimmäisellä viikolla.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-white mb-3">Strategiset painopisteet</h2>
                  
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Oikean teknologian valinta</h3>
                  <p className="mb-3">
                    Kun tekoälyhankkeisiin pusketaan kiihtyvällä tahdilla rahaa, on vaikea erottaa, mikä teknologia tuo todellista arvoa ja mikä vain näyttää siltä. Tässä tarvitaan jatkuvaa seurantaa.
                  </p>
                  <p className="mb-3">
                    Laajamittaisessa käytössä painotetaan avoimen lähdekoodin malleja kustannustehokkuuden ja muokattavuuden vuoksi. Tuoreiden tutkimusten mukaan yli kolmannes yrityksistä käyttää jo merkittävästi avoimia malleja, ja avoimen ekosysteemin osuus kasvaa edelleen.
                  </p>

                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Jatkuva kehityksen seuraaminen</h3>
                  <p className="mb-3">
                    Uusien teknologioiden vaikuttavuuden arviointi ei ole pelkkä hyöty, vaan elinehto, mikäli tavoitteena on kilpailuedun saavuttaminen.
                  </p>

                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Henkilöstön ja brändin asennemuutos</h3>
                  <p className="mb-3">
                    Tulevasta teknologiasta on viestittävä oikein, jotta organisaatiorakenne ei horju. Teknologiajohtaja on myös muutosjohtaja.
                  </p>

                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Vision merkitys</h3>
                  <p className="mb-3">
                    Tällä hetkellä visio tulevasta on tärkeämpi kuin se, mitä on tehty aiemmin. Nokia vs. Apple -vertaus on osuva, kun puhutaan uuden teknologian käyttöönotosta.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-white mb-3">Lyhyesti makrotaloudesta ja sen merkityksestä</h2>
                  <p className="mb-3">
                    Pitkä taustani maailman suurimpien yhtiöiden päivittäisessä seuraamisessa sekä makrotalouden analysoimisessa antaa minulle vankan pohjan tehdä oikeita päätöksiä oikeaan aikaan.
                  </p>
                  <p className="mb-3">
                    Nyt näyttää siltä, että tekoäly on pitämässä lupaustaan eksponentiaalisena (agentic AI) kannattavuuden kasvun lisääjänä.
                  </p>
                  <p className="mb-3">
                    Trumpin suora painostus Yhdysvalloissa Fedin suuntaan korkojen laskemiseksi lisää todennäköisyyttä, että tariffien vaikutukset jäävät pelättyä pienemmiksi. Tariffit iskisivät muuten eniten keskiluokkaan ja palkansaajiin. Yritykset nostavat hintoja tariffien vuoksi erityisesti kuluttajatuotteissa, mutta jos yritysten kustannukset laskevat merkittävästi automaation avulla, tämä voi kompensoida hintojen nousua runsaastikin.
                  </p>
                  <p className="mb-3 font-semibold text-blue-400">
                    Hummin vahva tase on kilpailuvaltti.
                  </p>
                </section>

                <section className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                  <h2 className="text-xl font-bold text-white mb-3">Yhteenveto</h2>
                  <p className="mb-0">
                    Onnistumistekijöihin kuuluvat selkeä visio, datan laatu ja hallinta, tiivis johto- ja sidosryhmäyhteistyö sekä henkilöstön osaaminen ja muutosvalmius.
                  </p>
                </section>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

export default function Home() {
  const { data: cases, isLoading, error } = useQuery<Case[]>({
    queryKey: ["/api/cases"],
  });
  const [techLeadModalOpen, setTechLeadModalOpen] = useState(false);
  const [csPortalModalOpen, setCsPortalModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'cases' | 'dashboard' | 'roadmap' | 'news' | 'strategy' | 'rag'>('overview');

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <h1 className="text-2xl font-bold text-foreground">Virhe</h1>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Casien lataaminen epäonnistui. Tarkista verkkoyhteys ja yritä uudelleen.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white font-sans min-h-screen flex flex-col">
      {/* Minimalistic Header */}
      <header className="bg-slate-900/95 border-b border-slate-700/50 sticky top-0 z-50 shadow-sm backdrop-blur-sm">
        <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-14">
            <div className="text-center">
              <h1 className="text-base font-semibold text-slate-200 tracking-wide">
                HUMM Group Oy - Johdon terminaali
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Netflix-style Split Layout */}
      <div className="flex flex-col lg:flex-row min-h-screen lg:min-h-0 flex-1">
        {/* Left Panel - AI Assistant (35%) - Hidden when strategy is active */}
        {activeView !== 'strategy' && (
          <div className="w-full lg:w-[35%] bg-slate-800 lg:border-r border-slate-700 flex flex-col min-h-[60vh] lg:min-h-0">
            <div className="px-4 sm:px-6 lg:px-6 py-4 lg:py-5 border-b border-slate-700">
              <div className="flex items-center space-x-3 mb-2">
                <Rocket className="h-5 w-5 lg:h-6 lg:w-6 text-blue-400" />
                <h2 className="text-lg lg:text-xl font-semibold text-white">Johdon Co-Pilot</h2>
              </div>
              <p className="text-slate-300 text-xs lg:text-sm">
                Proaktiivinen strateginen assistentti Hummin johdolle
              </p>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden">
              <ChatInterface />
            </div>
          </div>
        )}

        {/* Right Panel - Smart Content Switcher - Full width when strategy active */}
        <div className={`w-full ${activeView === 'strategy' ? 'lg:w-full' : 'lg:w-[65%]'} bg-slate-900 flex flex-col min-h-[60vh] lg:min-h-0 border-t lg:border-t-0 border-slate-700`}>
          <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6 bg-slate-800 border-b border-slate-700">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
              <div>
                <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 bg-slate-700 border border-slate-600 mb-2 sm:mb-4 gap-1 animate-in slide-in-from-top-4 duration-500 delay-200">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm text-slate-300 data-[state=active]:text-white text-xs sm:text-sm">
                      <BarChart className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Nykytila</span>
                    </TabsTrigger>
                    <TabsTrigger value="cases" className="data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm text-slate-300 data-[state=active]:text-white text-xs sm:text-sm">
                      <Target className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                      <span className="hidden sm:inline">AI Cases</span>
                    </TabsTrigger>
                    <TabsTrigger value="dashboard" className="data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm text-slate-300 data-[state=active]:text-white text-xs sm:text-sm">
                      <Activity className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Tech Lead</span>
                    </TabsTrigger>
                    <TabsTrigger value="roadmap" className="data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm text-slate-300 data-[state=active]:text-white text-xs sm:text-sm">
                      <Rocket className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Roadmap</span>
                    </TabsTrigger>
                    <TabsTrigger value="strategy" className="data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm text-slate-300 data-[state=active]:text-white text-xs sm:text-sm">
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Strategia</span>
                    </TabsTrigger>
                    <TabsTrigger value="news" className="data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm text-slate-300 data-[state=active]:text-white text-xs sm:text-sm">
                      <Newspaper className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                      <span className="hidden sm:inline">AI News</span>
                    </TabsTrigger>
                    <TabsTrigger value="rag" className="data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm text-slate-300 data-[state=active]:text-white text-xs sm:text-sm">
                      <Brain className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                      <span className="hidden sm:inline">RAG</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Dynamic Header Content */}
                  {activeView === 'overview' ? (
                    <div>
                      <h2 className="text-lg lg:text-xl font-semibold text-white">Humm Group Oy - Nykytila & AI-potentiaali</h2>
                      <p className="text-slate-300 text-xs lg:text-sm mt-1">Tilinpäätös 2024 ja polku kohti 10M€ liikevaihtoa</p>
                    </div>
                  ) : activeView === 'cases' ? (
                    <div>
                      <h2 className="text-lg lg:text-xl font-semibold text-white">Case-esimerkkejä onnistuneista AI-implementaatioista</h2>
                      <p className="text-slate-300 text-xs lg:text-sm mt-1">Todennetut tulokset asiakaspalvelun tehostamisesta</p>
                    </div>
                  ) : activeView === 'dashboard' ? (
                    <div>
                      <h2 className="text-lg lg:text-xl font-semibold text-white">Tech Lead Dashboard</h2>
                      <p className="text-slate-300 text-xs lg:text-sm mt-1">Reaaliaikainen seuranta ja liiketoimintavaikutusten mittarit</p>
                    </div>
                  ) : activeView === 'news' ? (
                    <div>
                      <h2 className="text-lg lg:text-xl font-semibold text-white">AI News & Insights</h2>
                      <p className="text-slate-300 text-xs lg:text-sm mt-1">Ajankohtaiset uutiset ja trendit AI-kehityksestä</p>
                    </div>
                  ) : activeView === 'strategy' ? (
                    <div>
                      <h2 className="text-lg lg:text-xl font-semibold text-white">Strategiset Suositukset Johdolle</h2>
                      <p className="text-slate-300 text-xs lg:text-sm mt-1">5-vuoden AI-transformaatio-ohjelma: €2.1M → €10M kasvupolku</p>
                    </div>
                  ) : activeView === 'rag' ? (
                    <div>
                      <h2 className="text-lg lg:text-xl font-semibold text-white">RAG - Document Intelligence</h2>
                      <p className="text-slate-300 text-xs lg:text-sm mt-1">Lataa dokumentteja ja kysy kysymyksiä niiden sisällöstä</p>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-lg lg:text-xl font-semibold text-white">Roadmap → 10M€</h2>
                      <p className="text-slate-300 text-xs lg:text-sm mt-1">Pitkän aikavälin tavoite: liikevaihto 10 miljoonaa euroa</p>
                    </div>
                  )}
                </Tabs>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm border-slate-600 hover:border-emerald-400 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400 px-2 sm:px-3"
                  onClick={() => setCsPortalModalOpen(true)}
                  data-testid="cs-portal-cta"
                >
                  <Building2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1 lg:mr-2" />
                  <span className="hidden sm:inline">CS Portal</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm border-slate-600 hover:border-blue-400 hover:bg-blue-500/10 text-slate-300 hover:text-blue-400 px-2 sm:px-3"
                  onClick={() => setTechLeadModalOpen(true)}
                  data-testid="tech-lead-cta"
                >
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1 lg:mr-2" />
                  <span className="hidden sm:inline">Tech Lead CV</span>
                </Button>
                <Link href="/impact-analysis">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm border-slate-600 hover:border-purple-400 hover:bg-purple-500/10 text-slate-300 hover:text-purple-400 px-2 sm:px-3"
                    data-testid="impact-analysis-cta-top"
                  >
                    <BarChart className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1 lg:mr-2" />
                    <span className="hidden sm:inline">Vaikutusanalyysi</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Dynamic Content Area */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)} className="h-full">
              {/* Overview Dashboard View */}
              <TabsContent value="overview" className="h-full mt-0 animate-in fade-in-0 duration-600 delay-200">
                <div className="h-full overflow-y-auto">
                  <Suspense fallback={<div className="flex items-center justify-center h-full"><Skeleton className="h-96 w-full" /></div>}>
                    <HummOverviewDashboard />
                  </Suspense>
                </div>
              </TabsContent>

              {/* AI Case Studies View */}
              <TabsContent value="cases" className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-4 lg:space-y-6 bg-slate-900 mt-0 animate-in fade-in-0 duration-600 delay-300">
                {/* Case Cards Grid - Netflix Style */}
                {isLoading ? (
                  <div className="space-y-6">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="bg-slate-800 border border-slate-700 hover:border-slate-600 hover:shadow-lg transition-all duration-200 animate-in fade-in-0 duration-300" style={{ animationDelay: `${i * 150}ms` }} data-testid={`skeleton-card-${i}`}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <Skeleton className="w-12 h-12 rounded-lg bg-slate-700" />
                              <div>
                                <Skeleton className="h-6 w-32 mb-2 bg-slate-700" />
                                <Skeleton className="h-4 w-24 bg-slate-700" />
                              </div>
                            </div>
                            <Skeleton className="h-6 w-20 rounded-full bg-slate-700" />
                          </div>
                          <div className="mb-4">
                            <Skeleton className="h-4 w-40 mb-2 bg-slate-700" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-full bg-slate-700" />
                              <Skeleton className="h-4 w-3/4 bg-slate-700" />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            {[...Array(3)].map((_, j) => (
                              <div key={j} className="text-center p-3">
                                <Skeleton className="h-6 w-12 mx-auto mb-1 rounded bg-slate-700" />
                                <Skeleton className="h-3 w-16 mx-auto rounded bg-slate-700" />
                              </div>
                            ))}
                          </div>
                          <div className="mb-4">
                            <Skeleton className="h-4 w-32 mb-2 bg-slate-700" />
                            <div className="space-y-1">
                              {[...Array(3)].map((_, k) => (
                                <Skeleton key={k} className="h-3 w-full bg-slate-700" />
                              ))}
                            </div>
                          </div>
                          <Skeleton className="h-10 w-full rounded bg-slate-700" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : cases?.length ? (
                  <div className="space-y-6" data-testid="cases-grid">
                      {cases.map((case_, index) => (
                        <div key={case_.id} className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                          <CaseCard case_={case_} />
                        </div>
                      ))}
                  </div>
                ) : (
                  <Card data-testid="no-cases" className="bg-slate-800 border border-slate-700">
                    <CardContent className="pt-6 text-center">
                      <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">Ei caseja saatavilla</h3>
                      <p className="text-slate-300">
                        Caseja ei löytynyt tai ne ovat väliaikaisesti poissa käytöstä.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Tech Lead Dashboard View */}
              <TabsContent value="dashboard" className="h-full mt-0 animate-in fade-in-0 duration-600 delay-200">
                <div className="h-full overflow-y-auto">
                  <Suspense fallback={<div className="flex items-center justify-center h-full"><Skeleton className="h-96 w-full" /></div>}>
                    <TechLeadDashboard />
                  </Suspense>
                </div>
              </TabsContent>

              {/* Strategic Roadmap View */}
              <TabsContent value="roadmap" className="h-full mt-0 animate-in fade-in-0 duration-600 delay-200">
                <div className="h-full overflow-y-auto">
                  <Suspense fallback={<div className="flex items-center justify-center h-full"><Skeleton className="h-96 w-full" /></div>}>
                    <StrategicRoadmap />
                  </Suspense>
                </div>
              </TabsContent>

              {/* News Feed View */}
              <TabsContent value="news" className="h-full mt-0 animate-in fade-in-0 duration-600 delay-200">
                <div className="h-full overflow-y-auto">
                  <Suspense fallback={<div className="flex items-center justify-center h-full"><Skeleton className="h-96 w-full" /></div>}>
                    <NewsFeed />
                  </Suspense>
                </div>
              </TabsContent>

              {/* Strategic Recommendations View */}
              <TabsContent value="strategy" className="h-full mt-0 animate-in fade-in-0 duration-600 delay-200">
                <Suspense fallback={<div className="flex items-center justify-center h-full"><Skeleton className="h-96 w-full" /></div>}>
                  <StrategicRecommendationsPanel />
                </Suspense>
              </TabsContent>

              {/* RAG View */}
              <TabsContent value="rag" className="h-full mt-0 animate-in fade-in-0 duration-600 delay-200">
                <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
                  <Suspense fallback={<div className="flex items-center justify-center h-full"><Skeleton className="h-96 w-full" /></div>}>
                    <RAGInterface />
                  </Suspense>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* CS Portal Modal */}
      {csPortalModalOpen && (
        <Suspense fallback={null}>
          <CSPortalModal
            isOpen={csPortalModalOpen}
            onClose={() => setCsPortalModalOpen(false)}
          />
        </Suspense>
      )}

      {/* Tech Lead Modal */}
      <TechLeadModal
        isOpen={techLeadModalOpen}
        onClose={() => setTechLeadModalOpen(false)}
      />
    </div>
  );
}
