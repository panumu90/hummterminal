import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TrendingUp, Target, CheckCircle2, AlertCircle } from 'lucide-react';

const strategyContent = `# Strateginen tiekartta 5-kertaiseen liikevaihdon kasvuun

## Johdon yhteenveto

Humm Group Oy on kriittisessä käännekohdassa. Vuoden 2024 liikevaihto oli 2,1 miljoonaa euroa 52 työntekijällä ja -7,7 % negatiivinen kasvu. Yritys tuottaa vain **40 385 euroa per työntekijä**—kaukana pohjoismaiselle BPO-toiminnalle kestävästä 55 000–89 000 euron vertailutasosta.

Tämä analyysi esittää polun **10 miljoonan euron liikevaihdon saavuttamiseksi vuoteen 2030 mennessä** strategisen AI-toteutuksen kautta.

---

## Kriittinen konteksti: Markkina-asema ja kiireellisyys

### Nykyinen taloudellinen todellisuus

**Humm Group Oy:n suorituskyky 2024:**
- Liikevaihto: 2,13 milj. € (laskua -7,7 %)
- Työntekijät: 52 kokoaikaista
- Liikevoittomarginaali: -0,2 % (21 000 € tappio)
- Liikevaihto per työntekijä: 40 385 € (27–54 % alle optimin)

**Markkinavertailut paljastavat tilanteen vakavuuden:**
- Pohjoismainen agenttikustannus: 22 200 € vuodessa
- Terve BPO-tavoite: 2,5–4x agenttikustannus liikevaihtona per työntekijä
- **Kuilu-analyysi: Humm toimii 1,8x kertoimella vs. tarvittava 3–4x**

### Markkinamahdollisuuden koko

**Pohjoismainen BPO-markkinadynamiikka:**
- Suomen IT-ulkoistus: 2,6 mrd € vuoteen 2025 (4,2 % CAGR)
- Euroopan CX-ulkoistus: 82 mrd € vuoteen 2033 (13,1 % CAGR)
- Pohjoismainen BPO: 15,2 mrd € vuoteen 2029 (3,9 % CAGR)
- **AI-mahdollistetut palvelut kasvavat 27,9 % vuosittain Suomessa**

---

## Alustavaihtoehtojen vertailu

### Kokonaiskustannusanalyysi (5 vuoden projektiot)

| Kustannuskomponentti | Avoin lähdekoodi (Chatwoot+n8n) | Keskimarkkina (Intercom) | Yritystaso (Zendesk) |
|---------------------|--------------------------------|--------------------------|---------------------|
| **Lisenssit** | 6 840–59 340 € | 300 000–320 000 € | 1 350 000 € |
| **Infrastruktuuri** | 26 580 € | Sisältyy | Sisältyy |
| **Käyttöönotto** | 8 000–50 000 € | 50 000–100 000 € | 50 000–100 000 € |
| **Tekninen työvoima** | 80 000–400 000 € | 60 000–120 000 € | 495 000 € |
| **Koulutus** | 15 000 € | 25 000 € | 136 000 € |
| **Tuki** | 0–52 500 € | Sisältyy | 400 000 € |
| **5 VUODEN YHTEENSÄ** | **85 000–165 000 €** | **300 000–320 000 €** | **2 060 000 €** |
| **Per agentti/vuosi** | 850–1 650 € | 3 000–3 200 € | 20 600 € |

### Hybridiratkaisu: Chatwoot + n8n + Claude API

**Vahvuudet:**
- **40–60 % kustannussäästöt** alustakustannuksissa vs. Zendesk/Intercom
- Täydellinen datasuvereniteetti (kriittinen GDPR-yhteensopivuudelle)
- **Paras LLM-laatu:** Claude 3.5 Sonnet API korkea-arvolle, Claude Haiku rutiinille
- Todistettu skaalautuvuus: 180+ agenttia, 10M+ viestiä/kk (Chatwoot)
- 400+ integraatiomahdollisuutta n8n:n kautta
- **50–70 % automaatioaste** saavutettavissa 24 kuukaudessa
- MIT-lisenssi (Chatwoot/n8n) varmistaa nolla alustalukko

**Rajoitukset:**
- Vaatii omistautunutta DevOps-osaamista (1–1,5 FTE jatkuvasti)
- Claude API-kustannukset skaalautuvat käytön mukaan (~€80K/v täydessä mittakaavassa)
- 8–12 viikon käyttöönottoaikataulu

**Automaatiokyvykkyydet:**
- Taso 1 (kk 1–3): 30–40 % FAQ-automaatio (Claude Haiku)
- Taso 2 (kk 4–12): 50–60 % AI-pohjaisilla vastauksilla (Claude Sonnet)
- Taso 3 (vuodet 2–3): 65–70 % kehittyneillä agenteilla (n8n orchestration)

### Keskimarkkinan kaupallinen: Intercom AI:lla

**Vahvuudet:**
- Alan johtava **41–51 % keskimääräinen AI-ratkaisuaste**
- No-code-konfiguraatio mahdollistaa liiketoimintakäyttäjien hallinnan
- **2–4 viikon käyttöönotto**
- 450+ natiivia integraatiota
- Todistettu kasvuskaalautuvuus

**Rajoitukset:**
- Monimutkainen, arvaamaton hinnoittelu volyymien kasvaessa
- Per-paikka kustannukset voivat eskaloitua nopeasti

**Todelliset asiakastulokset:**
- Zip: 450 000 € säästetty 7 kuukaudessa, 33,6 % automaatio
- Stuart: 88 tuntia säästetty viikoittain, 400 % volyymi käsitelty
- Synthesia: 87 % itsepalveluaste 6 kuukaudessa

### Strateginen suositus: Chatwoot + n8n + Claude API

**Suora käyttöönotto (vuodesta 1 alkaen):**
- **Perustelu:** Paras LLM-laatu (Claude) + edulliset alustat + nolla vendor lock-in
- Välitön 40–50 % automaatio Claude Sonnet + Haiku -mallien avulla
- **€400K säästöt 5 vuodessa** vs. Zendesk, **€150K säästöt** vs. Intercom

**Kustannusrakenne:**
- Chatwoot + n8n alustat: €50K 5v
- Claude API (skaalautuva): €30K v1 → €80K v5
- DevOps-henkilöstö: €80K/v (1 FTE)
- **5v kokonaisinvestointi: €480K** vs. €2.06M (Zendesk) tai €630K (Intercom)

**Teknologinen etu:**
- n8n: Visuaalinen workflow-editor (ei koodausta tarvita moniin käyttötapauksiin)
- Chatwoot: Natiivi integraatiot yleisimpiin CRM:iin
- Claude API: SOTA-laatu asiakaspalvelussa, ylivoimainen kontekstin ymmärrys

---

## 5-vuoden kasvupolku: €2.1M → €10M

### Vuosi 1 (2026): Vakauttaminen ja perusta

**Liikevaihto: 2,5 milj. €** (+19 % elpymiskasvu)

**Keskeiset aloitteet:**
- Q1 2026: Chatwoot + n8n käyttöönotto, Claude API-integraatio
- Q2 2026: Ensimmäiset automaatiopilotit (FAQ + rutiinit)
- Q3 2026: Henkilöstökoulutus, tietokantakehitys
- Q4 2026: Skaalaa automaatio 30 %:iin

**Henkilöstö: 54 FTE**
- Asiakaspalvelu: 38 agenttia
- Myynti/asiakkuudenhallinta: 12
- Transformaatiotiimi: 2
- Johto/hallinto: 2

**Taloudelliset:**
- AI-investointi: 229 000 € (9,2 % liikevaihdosta)
- Liikevaihto/työntekijä: 46 296 € (+15 %)
- **Liikevoittomarginaali: 5 %** (125 000 € voitto)

**Automaation vaikutus:**
- 30 % kyselyistä automatisoitu
- Agenttikapasiteetti: 1,2x perustaso

### Vuosi 2 (2027): Automaation skaalaus

**Liikevaihto: 3,5 milj. €** (+40 % kasvu)

**Keskeiset aloitteet:**
- 50 % automaatioaste saavutettu
- 5 agenttia → asiakkuudenhallinta
- Asiakashankinnan kiihdytys

**Henkilöstö: 60 FTE**
- Asiakaspalvelu: 36 agenttia (huolimatta 40 % liikevaihdon kasvusta)
- Myynti/AM: 18 (+50 %)
- Operaatiot: 3

**Taloudelliset:**
- AI-investointi: 295 000 € (8,4 %)
- Liikevaihto/työntekijä: 58 333 € (+26 % v/v)
- **Liikevoittomarginaali: 10 %**

**Automaation vaikutus:**
- 50 % automaatioaste
- Kustannus/ratkaisu: 8,50 € → 5,20 € (39 % vähennys)

### Vuosi 3 (2028): Transformaation kiihdytys

**Liikevaihto: 5,2 milj. €** (+49 % kasvu)

**Keskeiset aloitteet:**
- 60 % automaatioaste
- 10 agenttia → tuottavat roolit
- Premium AI-palvelut lanseerattu
- Alustasiirtymän arviointi

**Henkilöstö: 72 FTE**
- Asiakaspalvelu: 32
- Myynti/AM: 30 (67 % kasvu)
- AI-operaatiot: 5

**Taloudelliset:**
- Liikevaihto/työntekijä: 72 222 € (+24 % v/v)
- **Liikevoittomarginaali: 15 %** (780 000 €)

### Vuosi 4 (2029): Markkinajohtajuus

**Liikevaihto: 7,5 milj. €** (+44 % kasvu)

**Keskeiset aloitteet:**
- 65 % automaatioaste
- Täysi hybridimalli toiminnassa
- Vertikaalinen erikoistuminen (e-commerce, fintech)
- Claude API + Chatwoot optimointi täydessä tehossa

**Henkilöstö: 88 FTE**

**Taloudelliset:**
- Liikevaihto/työntekijä: 85 227 € (+18 % v/v)
- **Liikevoittomarginaali: 18 %** (1,35 milj. €)

### Vuosi 5 (2030): Kestävä mittakaava

**Liikevaihto: 10,0 milj. €** (+33 % kasvu)

**Keskeiset aloitteet:**
- 70 % automaatioaste
- AI-natiivit palvelutarjoomat
- Kilpailuvaltihaudat
- M&A-asemointi

**Henkilöstö: 100 FTE**
- Asiakaspalvelu: 35
- Myynti/AM: 50
- AI-operaatiot: 8

**Taloudelliset:**
- Liikevaihto/työntekijä: 100 000 € (+148 % vs. 2024)
- **Liikevoittomarginaali: 20 %** (2,0 milj. €)

**Transformaatio valmis:**
- 70 % automaatioaste (alan johtava)
- 5x liikevaihto, vain 1,9x henkilöstömäärä
- **2,54 milj. € kumulatiivinen 5v voitto**

---

## Kumulatiivinen 5 vuoden yhteenveto

**Liikevaihdon kehitys:**
- **5 vuoden CAGR: 32 %**
- Kumulatiivinen liikevaihto: 28,7 milj. €

**Kokonaisinvestointi:**
- AI-alustat: 184 000–294 000 €
- Transformaatiotiimi: 1,75 milj. €
- Koulutus: 155 000 €
- **5v kokonaisinvestointi: 2,23–2,42 milj. €** (8,5 % liikevaihdosta)

**Tuotot:**
- Kumulatiivinen liikevoitto: 2,54 milj. €
- **ROI: 113–136 % AI-investoinnille**
- **Takaisinmaksuaika: 18 kuukautta**

**Tehokkuusmittarit:**
- Liikevaihto/työntekijä: +148 %
- Kustannus/ratkaisu: -74 %
- Automaatioaste: 0 % → 70 %
- Liikevoittomarginaali: -0,2 % → 20 %

---

## Henkilöstön uudelleenkohdennusstrategia

### Nykyinen vs. Tavoite

**2024 perustaso (52 FTE):**
- Asiakaspalvelu: 42 (81 %)
- AM/Myynti: 8 (15 %)
- **Malli: Työvoimavaltainen, reaktiivinen**

**2030 tavoite (100 FTE):**
- Asiakaspalvelu: 35 (35 %)
- AM/Myynti: 50 (50 %)
- AI-operaatiot: 8 (8 %)
- **Malli: AI-täydennetty, proaktiivinen suhdejohtaminen**

### Siirtymäpolut

**Vaihe 1 (Vuosi 2): Huippusuorittajat → AM**
- Top 10–15 % CSAT-suorittajat
- 3kk intensiivinen koulutus
- Odotettu: 100 000 € liikevaihto/AM vuosittain
- Määrä: 5 agenttia

**Vaihe 2 (Vuosi 3): Kokeneet → Tekninen AM**
- 3+ vuoden kokemus, tuotetietämys
- 6kk hybridi-koulutus
- Vertikaalinen erikoistuminen
- Odotettu: 120 000 € liikevaihto/AM
- Määrä: 10 agenttia

**Vaihe 3 (Vuodet 4–5): Agentit → AI-spesialistit**
- Tekninen soveltuvuus
- 9–12kk koulutus
- Vastuu: AI-koulutus, työnkulkuoptimointi
- Vaikutus: 500 000+ € lisäkapasiteetti per spesialisti
- Määrä: 5 agenttia

**Uudelleenkoulutusbudjetti: 155 000 € (5v)**
- Kustannus/siirtymä: 3 100 €
- Liikevaihdon kasvu: 50 000–100 000 € vuosittain
- **ROI: 1 600–3 200 %**

---

## Kustannussäästöt ja marginaalin parannus

### Työvoimakustannusten optimointi

**5v kumulatiiviset säästöt: 3,14 milj. €**

| Vuosi | Automaatio | Vapautettu kapasiteetti | Säästöt |
|-------|-----------|------------------------|---------|
| 1 | 30 % | 12 FTE | 266 400 € |
| 2 | 50 % | 21 FTE | 466 200 € |
| 3 | 60 % | 29 FTE | 643 800 € |
| 5 | 70 % | 35–40 FTE | 777 000–888 000 € |

### Toiminnallinen tehokkuus

**Kustannus per ratkaisu:**
- Perinteinen: 13,50 €
- Vuosi 1: 10,20 €
- Vuosi 3: 5,50 €
- Vuosi 5: 3,80 € (**72 % vähennys**)

**Käsittelyaikojen parannus:**
- Perustaso: 12 min
- AI-kopilotilla: 6,5 min (46 % vähennys)
- Agentit käsittelevät: 2,3x volyymi

### Premium-palvelut

**AI-täydennetyt tarjoomat:**
- 24/7 AI-ensipalvelu: +520 000 € (vuosi 3)
- Ennakoiva analytiikka: +300 000 € (vuosi 4)
- Vertikaaliratkaisut: +750 000 € (vuosi 5)
- **Premium-liikevaihto yhteensä v5: 1,57 milj. €** (16 % kokonaisliikevaihdosta)

---

## Toteutuksen tiekartta

### Vaihe 1: Perusta (kk 1–6)

**Kuukausi 1–2: Arviointi**
- Johdon linjaus
- AI-valmiusarviointi
- Alustavalinta
- Muutosviestintä

**Kuukausi 3–4: Käyttöönotto**
- Intercom-toteutus (2–4 viikkoa)
- Tietokannan siirtäminen
- Pilottitiimi (5 agenttia)
- Alkuperäinen automaatio

**Kuukausi 5–6: Skaalaus**
- Optimointi
- 20 työnkulkua → 30 % volyymi
- Koulutuskohortti (AI-lukutaito)
- Asiakasviestintä

**Menestys:**
- 30 % automaatio saavutettu
- CSAT säilytetty/parannettu
- Ensiratkaisuaika -20 %

**Investointi: 100 000 €**

### Vaihe 2: Kiihdytys (kk 7–18)

**Kuukausi 7–9:**
- Kehittynyt automaatio (50 aikomusta)
- CRM-integraatiot
- AM-koulutuskohortti

**Kuukausi 10–12:**
- Ensimmäiset siirtymät (5 agenttia)
- Premium-palvelut
- Asiakasmenestysohjelmia

**Kuukausi 13–18:**
- 60 % automaatioaste
- Toinen siirtymäaalto (10 agenttia)
- Vertikaalinen erikoistuminen

**Investointi: 400 000 €**

### Vaihe 3: Johtajuus (kk 19–36)

**Kuukausi 19–24:**
- 65 % automaatio
- Hybridimalli
- Alustasiirtymä

**Kuukausi 25–30:**
- Proprietary-kyvykkyydet
- Strategiset kumppanuudet
- 70 % automaatio

**Kuukausi 31–36:**
- AI-natiivi kulttuuri
- 10M€ virstanpylväs
- Markkinajohtajuus

**Investointi: 1,5 milj. €**

---

## Kriittiset riskit ja vähentäminen

### Teknologiariskit

**Riski: Alusta ei toimita automaatioasteita**
- Vähentäminen: Pilotti-ensin, 90 päivän arviointi
- Varautuminen: Kyky vaihtaa alustoja

**Riski: Integraation monimutkaisuus**
- Vähentäminen: Yksityiskohtainen arviointi, vaiheistus
- Aikataulupuskuri: +20 %

### Organisaatioriskit

**Riski: Työntekijöiden vastustus**
- Vähentäminen:
  - "Täydennys, ei korvaus" -viestit
  - Ei-pakkoirtisanomisia -politiikka
  - Selkeät urapolut
  - Aktiivinen osallistuminen
- Seuranta: Kuukausittaiset pulssikyselyt

**Riski: Suomen työlainsäädäntö**
- Vähentäminen:
  - Työoikeusspesialistit mukaan heti
  - 6+ viikon konsultaatio
  - Varhainen ammattiliittojen osallistuminen
- Aikataulu: +3–6kk konsultaatiolle

**Riski: Taitojen siirtymävirhe**
- Vähentäminen:
  - Tiukka ehdokasvalinta
  - 3–6kk koulutus
  - Mentorointi
  - AI-kopilotti tuki
- Onnistumisaste: 80 %

### Markkinariskit

**Riski: Asiakkaiden vastustus AI:lle**
- Vähentäminen:
  - Hybridimalli
  - Läpinäkyvyys
  - Kokeilujaksot
  - Laatumittarit

**Riski: Kilpailullinen vastaus**
- Vähentäminen:
  - Nopeusetu
  - Vertikaalinen erikoistuminen
  - Brändäys AI-innovaattorina

### Taloudelliset riskit

**Riski: Liikevaihdon tavoitteet eivät toteudu**
- Vähentäminen:
  - Konservatiivinen mallinnus
  - Useita tulovirtoja
  - Kuukausittaiset putken tarkistukset
- Katkaisijat: Jos v1 < 2,3M€ tai v2 < 3,0M€

---

## Pohjoismaiset erityishuomiot

### GDPR-vaatimukset

**Pakolliset elementit:**
1. DPIA korkean riskin AI-käsittelylle
2. Artikla 22: Ihmisen valvonta automatisoiduille päätöksille
3. Läpinäkyvyys AI:n käytöstä
4. Suostumusenhallinta
5. Rekisteröidyn oikeudet

**Toteutus:**
- Sisäänrakennettu tietosuoja
- Yksityisyyttä parantavat teknologiat
- Datan lokalisointi (Suomi/EU)
- Neljännesvuosittaiset auditoinnit

**Budjetti: 25 000 € vuosittain**

### Suomen työlainsäädäntö

**Konsultaatiovelvollisuudet:**
- Kynnys: 20+ työntekijää (Humm täyttää)
- Aikataulu:
  - 2 viikkoa < 10 muutosta
  - 6 viikkoa 10+ irtisanomista

**Parhaat käytännöt:**
- Proaktiivinen ilmoitus (kk 1)
- Työntekijöiden osallistuminen
- Ei-pakkolomautuksia
- Vaiheittainen käyttöönotto
- Oikeudellinen kumppani (15 000 € pidättäjä)

**Rangaistukset:**
- 35 590 € per työntekijä konsultaatiorikkomuksesta
- Vararahasto: 100 000 €

---

## Vaihtoehtoiset skenaariot

### Skenaario A: Konservatiivinen (15 % CAGR)

**Tulokset:**
- Liikevaihto v5: 4,2 milj. € vs. 10 milj. € perustapaus
- Työntekijät: 65 vs. 100
- Liikevoittomarginaali: 12 % vs. 20 %
- ROI: 85 % (silti positiivinen)

### Skenaario B: Aggressiivinen (40 % CAGR)

**Tulokset:**
- Liikevaihto v5: 14,3 milj. €
- Liikevoittomarginaali: 25 %
- Liikevaihto/työntekijä: 130 000 €
- Markkinajohtaja-asema

**Mahdollisuudet:**
- Maantieteellinen laajennus
- Vertikaalinen laajennus
- Ulkoinen rahoitus
- Yrityskaupat

### Skenaario C: Alustastrategian kääntö

**Laukaisin:** Intercom-kustannusten eskaloituminen

**Vaihtoehto:**
- Kiihdytä Chatwoot+n8n siirtymä (v2 vs. v3)
- Lisää DevOps-henkilöstö (+2 FTE)
- 3–6kk tuottavuuden lasku
- 110 000 € säästöt aikaisemmin

**NPV-hyöty: +50 000 €**

---

## Välittömät seuraavat askeleet

### 30 päivää: Johdon linjaus

**Viikko 1–2:**
- Toimitusjohtajan sitoutuminen
- Hallituksen esitys
- Johtoryhmän työpaja
- Viestintäsuunnitelma

**Viikko 3–4:**
- AI-valmiusarviointi
- Toimittajaesittelyt
- Oikeudellinen konsultaatio
- Budjetin viimeistely

**Päätöspiste: Jatka/Keskeytä/Muokkaa**

### 90 päivää: Sprintti

**Alustavalinta:**
- Lopullinen toimittaja (viikko 5)
- Sopimusneuvottelu
- Käyttöönoton aloitus (viikko 6)

**Organisaation valmistelu:**
- Transformaatiotiimin palkkaaminen
- Muutosjohtamisohjelma
- Työntekijäviestintä
- Tietokannan auditointi

**Nopeat voitot:**
- Top 10–20 FAQ-tavoitteet
- Pilottitiimi (5 huippuagenttia)
- Menestyksen mittarit

**Tuotos: 30 % automaatio, positiiviset tulokset**

### 6 kuukautta: Virstanpylväät

**Automaation skaalaus:**
- 30 työnkulkua
- 35–40 % jatkuva automaatio
- Ensimmäinen siirtymäkohortti
- AM-koulutus

**Asiakassitoutuminen:**
- Pilotointi 3–5 asiakkaan kanssa
- Tapaustutkimukset
- Markkinointikampanja

**Hallinto:**
- GDPR-auditointi
- Laadunvarmistus
- Kuukausittainen raportointi

**Tuotos: 2,5M€ juoksutus, positiivinen marginaali**

---

## Kriittiset menestystekijät

**Pakolliset:**

1. **Toimitusjohtajan sitoutuminen**: Näkyvä, jatkuva sponsorointi
2. **Keskittyminen**: 4–5 domeinia maksimissaan
3. **Hybridi ihmis-AI**: 70 % automaatio + 100 % ihminen monimutkaisille
4. **Muutoksenhallinta**: 7–30 % osallistuminen, läpinäkyvyys
5. **Prosessin uudelleensuunnittelu**: Ei rikkinäisten automaatiota
6. **Mittarivetoinen**: Viikoittainen seuranta
7. **Vaatimustenmukaisuus**: GDPR + työlainsäädäntö
8. **Asiakaskeskeinen**: CSAT/NPS säilytys

---

## Johtopäätös: Toiminnan välttämättömyys

Humm Group Oy on määrittävässä hetkessä. Kolmen tekijän lähentyminen luo poikkeuksellisen mahdollisuuden:

**1. Markkina-ajoitus:** 56 % pohjoismaisista B2B-yrityksistä sitoutunut AI:hin juuri nyt

**2. Todistettu pelikirja:** Klarna 73 % liikevaihto/työntekijä kasvu, Vodafone 70 % automaatio

**3. Saavutettavissa oleva teknologia:** 40–50 % automaatio 6kk, 150 000 € 2v investoinnilla

Polku on selkeä: **2,1M€ → 10M€ liikevaihto 5 vuodessa**

Kysymys ei ole transformoitumisesta, vaan **johtaako vai seuraako Humm**.

Ensiliikkujilla on 12–24kk ikkuna kilpailullisten vallihaudan perustamiseen.

**Hetki aloittaa on nyt.**

---

*Johdon toimenpide vaaditaan: Jatka vaiheen 1 toteutuksella välittömästi.*
`;

export function StrategicRecommendationsPanel() {
  return (
    <ScrollArea className="h-full bg-gradient-to-br from-slate-950 via-blue-950/50 to-slate-950">
      <div className="max-w-6xl mx-auto p-6 sm:p-8 lg:p-12">
        {/* Hero Header - Enhanced with sophisticated glassmorphism */}
        <div className="mb-10 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900/40 via-blue-900/30 to-purple-900/40 border border-white/10 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:shadow-blue-500/20 hover:scale-[1.01] animate-in fade-in-0 slide-in-from-top-8 duration-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-400/30 shadow-lg shadow-emerald-500/20 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-emerald-500/40">
              <CheckCircle2 className="h-10 w-10 text-emerald-400" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight leading-tight">
                Strategiset Suositukset Johdolle
              </h1>
              <p className="text-white/70 text-base sm:text-lg lg:text-xl leading-relaxed">
                5-vuoden AI-transformaatio-ohjelma: <span className="text-emerald-400 font-semibold">€2.1M → €10M</span> kasvupolku
              </p>
            </div>
          </div>

          {/* Key Metrics - Enhanced glassmorphism cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-400/20 backdrop-blur-md p-5 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/20 hover:border-emerald-400/40 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-emerald-400" />
                  <p className="text-xs font-medium text-emerald-300/70 uppercase tracking-wider">Tavoite</p>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-emerald-300">€10M</p>
                <p className="text-xs text-emerald-400/60 mt-1">liikevaihto 2030</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-400/20 backdrop-blur-md p-5 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 hover:border-blue-400/40 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                  <p className="text-xs font-medium text-blue-300/70 uppercase tracking-wider">Investointi</p>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-blue-300">€2.5M</p>
                <p className="text-xs text-blue-400/60 mt-1">5 vuoden aikana</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-400/20 backdrop-blur-md p-5 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 hover:border-purple-400/40 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-400" />
                  <p className="text-xs font-medium text-purple-300/70 uppercase tracking-wider">Säästöt</p>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-purple-300">€520K/v</p>
                <p className="text-xs text-purple-400/60 mt-1">vs. proprietary</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-400/20 backdrop-blur-md p-5 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20 hover:border-orange-400/40 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-orange-400" />
                  <p className="text-xs font-medium text-orange-300/70 uppercase tracking-wider">ROI</p>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-orange-300">113-136%</p>
                <p className="text-xs text-orange-400/60 mt-1">AI-investointi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Markdown Content - Enhanced with sophisticated glassmorphism containers */}
        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <div className="mb-10 mt-16 first:mt-0 p-6 rounded-2xl bg-gradient-to-br from-slate-900/60 via-blue-900/40 to-slate-900/60 border border-white/10 backdrop-blur-lg shadow-xl animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                  <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight">
                    {children}
                  </h1>
                  <div className="mt-3 h-1 w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full"></div>
                </div>
              ),
              h2: ({ children }) => (
                <div className="mb-8 mt-12 p-5 rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/8 backdrop-blur-md shadow-lg group hover:shadow-xl hover:border-white/15 transition-all duration-300">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-4 leading-snug tracking-tight">
                    <span className="flex-shrink-0 w-1.5 h-10 bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500 rounded-full group-hover:scale-110 transition-transform duration-300"></span>
                    <span className="flex-1">{children}</span>
                  </h2>
                </div>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl sm:text-2xl font-semibold mb-5 mt-10 text-blue-300 leading-snug tracking-tight pl-4 border-l-4 border-blue-500/40 hover:border-blue-400 transition-colors duration-300">
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-lg sm:text-xl font-semibold mb-4 mt-8 text-emerald-300 leading-snug">
                  {children}
                </h4>
              ),
              p: ({ children }) => (
                <p className="mb-5 text-slate-200 leading-relaxed text-base sm:text-lg tracking-wide">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-none pl-0 mb-6 space-y-3">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 mb-6 space-y-3 marker:text-blue-400 marker:font-semibold">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-slate-200 leading-relaxed pl-6 relative before:content-['→'] before:absolute before:left-0 before:text-blue-400 before:font-bold">
                  {children}
                </li>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400">
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className="italic text-purple-300 not-italic font-medium">
                  {children}
                </em>
              ),
              code: ({ children }) => (
                <code className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 text-emerald-300 px-3 py-1.5 rounded-lg text-sm font-mono border border-emerald-500/20 shadow-inner">
                  {children}
                </code>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-8 rounded-2xl border border-white/10 backdrop-blur-lg shadow-2xl animate-in fade-in-0 zoom-in-95 duration-500">
                  <div className="bg-gradient-to-br from-slate-900/60 to-slate-800/60 backdrop-blur-xl">
                    <table className="w-full border-collapse">
                      {children}
                    </table>
                  </div>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-gradient-to-r from-slate-900/80 via-blue-900/60 to-slate-900/80 backdrop-blur-sm">
                  {children}
                </thead>
              ),
              tbody: ({ children }) => (
                <tbody className="divide-y divide-slate-700/40">
                  {children}
                </tbody>
              ),
              tr: ({ children }) => (
                <tr className="hover:bg-slate-700/20 transition-all duration-200 hover:scale-[1.01]">
                  {children}
                </tr>
              ),
              th: ({ children }) => (
                <th className="px-5 py-4 text-left text-sm font-bold text-blue-300 border-b-2 border-blue-500/40 uppercase tracking-wider">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-5 py-4 text-sm text-slate-200 leading-relaxed">
                  {children}
                </td>
              ),
              blockquote: ({ children }) => (
                <blockquote className="relative my-6 p-6 rounded-xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-l-4 border-blue-500 backdrop-blur-sm shadow-lg italic text-slate-200 overflow-hidden group hover:shadow-blue-500/20 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">{children}</div>
                </blockquote>
              ),
              hr: () => (
                <hr className="my-12 border-t border-slate-700/50 relative overflow-hidden after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-blue-500/30 after:to-transparent after:h-[1px] after:top-0" />
              ),
            }}
          >
            {strategyContent}
          </ReactMarkdown>
        </div>

        {/* Footer CTA - Enhanced with sophisticated glassmorphism */}
        <div className="mt-16 p-8 sm:p-10 lg:p-12 rounded-3xl bg-gradient-to-br from-slate-900/60 via-blue-900/40 to-purple-900/50 border-2 border-white/15 text-center backdrop-blur-xl shadow-2xl transition-all duration-500 hover:shadow-blue-500/30 hover:scale-[1.01] animate-in fade-in-0 zoom-in-95 duration-700 relative overflow-hidden group">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-400/30 shadow-lg shadow-emerald-500/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-emerald-500/40">
                <AlertCircle className="h-10 w-10 text-emerald-400" strokeWidth={2.5} />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-5 tracking-tight">
              Seuraavat Askeleet
            </h2>
            <p className="text-white/80 text-base sm:text-lg lg:text-xl mb-8 max-w-4xl mx-auto leading-relaxed">
              Aloitetaan <span className="text-emerald-400 font-semibold">Phase 1 pilotti Q1 2026</span>: Chatwoot + n8n + Claude API käyttöönotto yhden asiakkaan tiimille.
              Tavoitteena validoida hybridiratkaisu ja ROI ennen laajempaa skaalausta.
            </p>

            {/* Action Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
              <div className="group/card relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-400/20 backdrop-blur-md p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/20 hover:border-emerald-400/40 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 mb-3 mx-auto" />
                  <p className="text-xs font-medium text-emerald-300/70 uppercase tracking-wider mb-2">Aloitus</p>
                  <p className="text-lg font-bold text-emerald-300">Q1 2026</p>
                </div>
              </div>

              <div className="group/card relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-400/20 backdrop-blur-md p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 hover:border-blue-400/40 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <Target className="h-6 w-6 text-blue-400 mb-3 mx-auto" />
                  <p className="text-xs font-medium text-blue-300/70 uppercase tracking-wider mb-2">Budget</p>
                  <p className="text-lg font-bold text-blue-300">€100K</p>
                  <p className="text-xs text-blue-400/60 mt-1">Phase 1</p>
                </div>
              </div>

              <div className="group/card relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-400/20 backdrop-blur-md p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 hover:border-purple-400/40 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <TrendingUp className="h-6 w-6 text-purple-400 mb-3 mx-auto" />
                  <p className="text-xs font-medium text-purple-300/70 uppercase tracking-wider mb-2">ROI-tavoite</p>
                  <p className="text-lg font-bold text-purple-300">3 kk</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-10 pt-8 border-t border-white/10">
              <p className="text-white/60 text-sm italic">
                Johdon toimenpide vaaditaan: Jatka vaiheen 1 toteutuksella välittömästi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
