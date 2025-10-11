# AI-toiminnot - Humm Group Oy Tech Lead Demo

Tämä dokumentti kuvaa sovelluksen keskeiset AI-toiminnot ja niiden liiketoiminta-arvon.

---

## 🤖 1. AI-Panu - Johdon Co-Pilot

### Kuvaus
Proaktiivinen AI-assistentti strategiseen päätöksentekoon. Johdon dedikoidtu chat-käyttöliittymä, joka on aina saatavilla (paitsi strategia-sivulla, jossa on oma BottomPromptTray).

### Keskeiset ominaisuudet
- **Kontekstuaalinen RAG-järjestelmä**: Vastaukset perustuvat Humm Group Oy:n todelliseen dataan
  - Strategia-asiakirjat
  - Tapaustutkimukset (case studies)
  - Talousdata ja KPI:t
- **Lähdeviittaukset**: Jokainen vastaus sisältää klikkattavat viitteet alkuperäisiin dokumentteihin
- **Auto-scroll esto**: Käyttäjä voi lukea aiempia viestejä keskeytymättä
- **Follow-up ehdotukset**: AI ehdottaa jatkokysymyksiä kontekstin perusteella

### Tekninen toteutus
- **Malli**: Claude Sonnet 4 (Anthropic)
- **Endpoint**: `/api/chat`
- **Tiedosto**: `client/src/components/chat-interface.tsx` (2900+ riviä)

### Liiketoiminta-arvo
- **Nopeampi päätöksenteko**: Johto saa välittömät vastaukset ilman manuaalista dokumenttien etsimistä
- **Tietoon perustuva johtaminen**: RAG varmistaa, että vastaukset perustuvat todelliseen dataan
- **Käytettävyys**: Intuitiivinen käyttöliittymä vähentää kynnystä käyttää AI:ta

---

## 💬 2. Luonnollisen kielen palautejärjestelmä

### Kuvaus
AI-agentti tunnistaa palauteviestit chatissa ja lähettää ne automaattisesti Panulle sähköpostiin Zapierin kautta.

### Käyttötavat
1. **Luonnollinen kieli**: Kirjoita "Lähetä palaute: [viestisi]" chattiin
2. **Badge-pikakuvake**: Klikkaa "📨 Lähetä palaute" -nappia, joka täyttää promptin
3. **Modaalilomake**: 💬-nappi otsikossa → kategoria/prioriteetti valintoineen

### Tekninen toteutus
- **Pattern matching**: `/^lähetä palaute:?\s*/i` (case insensitive regex)
- **Backend API**: `/api/feedback/send` (client/server/feedback.ts)
- **Integraatio**: Zapier Webhook → Gmail/Outlook
- **Dev-mode fallback**: Console logging kun webhook ei konfiguroitu
- **Metadata**: Sivu, aikaleima, lähde (chat/modal), kategoria, prioriteetti

### MCP-konseptin demonstrointi
Tämä on käytännön esimerkki **Model Context Protocol (MCP)** -tyylisestä integraatiosta:
- AI tunnistaa käyttäjän intention ("lähetä palaute")
- Laukaisee todellisen toimenpiteen (API-kutsu → Zapier → sähköposti)
- Palauttaa käyttäjälle vahvistuksen

### Liiketoiminta-arvo
- **Agentti-orkestraatio**: Näyttää ymmärrystä modernista AI-arkkitehtuurista
- **Palautesilmukka**: Automaatio, joka kerää arvokasta dataa ilman manuaalista työtä
- **Skaalautuvuus**: Sama pattern toimii mihin tahansa integraatioon (CRM, Slack, Sheets)

### Dokumentaatio
- **Setup-ohje**: `ZAPIER_SETUP.md` (278 riviä)
- **Testausohjeet**: Sisältyy setup-ohjeeseen
- **Troubleshooting**: Yleisimmät ongelmat ja ratkaisut

---

## 🎯 3. BottomPromptTray - Strategia-assistentti

### Kuvaus
ChatGPT-tyylinen bottom tray, joka auttaa lukemaan ja ymmärtämään strategiadokumentteja. Kolme tilaa: collapsed, suggestions, chat.

### Kolme tilaa
1. **Collapsed (kiinni)**: Minimaalinen palkki näytön alareunassa
   - AI-Panu branding + online-status (🟢)
   - Kontekstuaalinen apueksti: "Konsultoi tai kysy termistöstä: agentti-orkestraatio, tarvittava vuosibudjetti..."

2. **Suggestions (ehdotukset)**: 6 esimerkkikysymystä gridissä
   - Räätälöity strategiakontekstiin
   - Klikkaa kysymystä → avautuu suoraan chat-tilaan

3. **Chat (keskustelu)**: Täysi chat-käyttöliittymä (65vh korkuus)
   - RAG-integraatio strategia-dokumentteihin
   - Lähdeviittaukset
   - Responsive: `md:w-[360px] lg:w-[400px] xl:w-[440px] 2xl:w-[480px]`

### Tekninen toteutus
- **Tiedosto**: `client/src/components/BottomPromptTray.tsx` (450+ riviä)
- **Animaatiot**: Framer Motion (smooth state transitions)
- **Design**: Glassmorphism (backdrop blur, gradient borders)
- **Responsive**: Desktop-first (mobiili-optimointi ei prioriteetti)

### Liiketoiminta-arvo
- **Progressive disclosure**: Ei häiritse, mutta aina saatavilla
- **Kontekstuaalinen apu**: Kysymysehdotukset ohjaavat oikeisiin kysymyksiin
- **UX-prioriteetti**: Käyttäjä voi lukea strategiaa ilman, että chat peittää sisältöä

---

## 📊 4. Interaktiivinen Dashboard + RAG

### Kuvaus
Koko dashboardin data (KPI:t, tapaukset, aikajana) toimii RAG-kontekstina AI-Panulle. Käyttäjä voi klikata metriikkaa → avautuu modaali → kysyä lisää → AI vastaa kontekstin perusteella.

### Datakontekstit
1. **Strategiset tavoitteet**: KPI-kortit, roadmap-data
2. **Tapaustutkimukset**: Asiakasprojektit, ROI-laskelmat
3. **Aikajana**: Toteutusaikataulu, milestone-data
4. **Talousmetriikat**: Kustannusarviot, säästölaskelmat

### Tekninen toteutus
- **RAG-pipeline**: Dokumentit → vector embeddings → semantic search
- **Modaalit**: Yksityiskohtainen data klikkauksen päässä
- **Auto-scroll esto**: Parantaa käyttökokemusta (`preventAutoScroll` flag)

### Liiketoiminta-arvo
- **Data-driven insights**: Kaikki väitteet perustuvat todelliseen dataan
- **Läpinäkyvyys**: Lähdeviittaukset rakentavat luottamusta
- **Personointi**: Vastaukset Humm Group Oy:n kontekstiin räätälöityjä

---

## 🔄 5. Agentti-orkestraatio (MCP-tyyli)

### Konsepti
AI ei ole vain chatbot, vaan **agentti**, joka voi laukaista todellisia toimenpiteitä.

### Toteutetut esimerkit
1. **Palautejärjestelmä**: AI → Zapier → Email
2. **Kontekstuaalinen routing**: AI tunnistaa intention ja ohjaa oikeaan workflowiin

### Tulevaisuuden mahdollisuudet (demo-arvoa)
- **CRM-integraatio**: "Lisää tämä asiakas CRM:ään" → Salesforce API
- **Calendar booking**: "Varaa kokous Panun kanssa" → Google Calendar
- **Slack-notifikaatiot**: "Lähetä tiivistelmä tiimille" → Slack webhook
- **Google Sheets**: "Tallenna ROI-laskelma Sheetsiin" → Sheets API

### Tekninen arkkitehtuuri
```
Käyttäjä → AI (Claude) → Intent Detection → Action Router
                              ↓
                    [Chat | Feedback | Integration]
                              ↓
                    Backend API → External Service
                              ↓
                    Response → User Confirmation
```

### Liiketoiminta-arvo
- **Modernin AI-arkkitehtuurin ymmärrys**: MCP on 2024-2025 standardi
- **Käytännön implementointi**: Ei vain teoria, vaan toimiva koodi
- **Skaalautuva pattern**: Sama rakenne toimii sataan eri integraatioon

---

## 🎨 6. UX-ensisijaisuus kaikessa

### Periaatteet
> "Käyttäjäkokemus on aina tärkein" - Projektin ydinperiaate

### Konkreettiset päätökset
1. **StrategyChat → BottomPromptTray**: Chat ei saa peittää sisältöä
2. **Auto-scroll esto**: Käyttäjä kontrolloi omaa lukemistaan
3. **Progressive disclosure**: Tieto paljastetaan tarpeen mukaan
4. **Responsive design**: Toimii kaikilla näytöillä (desktop-first)
5. **Badge shortcuts**: Nopeat toiminnot yhden klikkauksen päässä

### Tekninen toteutus
- **State management**: React hooks optimaalisesti
- **Animaatiot**: Framer Motion smooth transitions
- **Glassmorphism**: Moderni, premium-tuntuma
- **Accessibility**: ARIA-labels, keyboard navigation

### Liiketoiminta-arvo
- **Käyttöönottoaste**: Hyvä UX → enemmän käyttäjiä
- **Tyytyväisyys**: Intuitiivinen = vähemmän tukipyyntöjä
- **Brändi-imago**: Premium UX = premium ratkaisu

---

## 📈 Yhteenveto: Miksi nämä toiminnot ovat tärkeitä

### Tekninen osaaminen
✅ **Modern AI stack**: Claude, RAG, vector search
✅ **Integration patterns**: Zapier, webhooks, MCP-tyyli
✅ **Full-stack**: React, TypeScript, Express, API design
✅ **Production-ready**: Error handling, fallbacks, dev-mode

### Liiketoimintaymmärrys
✅ **User-centric**: UX on prioriteetti, ei teknologia
✅ **Value-driven**: Jokainen toiminto ratkaisee todellisen ongelman
✅ **Scalable thinking**: Patternit, jotka skaalautuvat
✅ **Change management**: AI:n käyttöönotto vaatii hyvää UX:ää

### Johtajuus
✅ **Strateginen visio**: Ymmärrys mihin AI-kehitys menee (MCP, agentit)
✅ **Käytännön toteutus**: Ei vain ideoita, vaan toimivaa koodia
✅ **Dokumentaatio**: Selkeät ohjeet, maintenance-friendly
✅ **Iteratiivinen kehitys**: Kuuntele palautetta, paranna jatkuvasti

---

## 🚀 Seuraavat askeleet (demo-arvoa)

### Lisätoiminnot, joita voisi demonstroida
1. **Multi-agent orchestration**: Useampi agentti erikoistuneisiin tehtäviin
2. **Real-time collaboration**: WebSocket-chat tiimeille
3. **Analytics dashboard**: Miten johtajat käyttävät AI:ta
4. **A/B testing**: Optimoi prompteja datan perusteella
5. **Fine-tuning**: Räätälöi malli Humm Group Oy:n dataan

### Integraatiot
- Salesforce / HubSpot (CRM)
- Google Workspace (Calendar, Sheets, Drive)
- Slack / Microsoft Teams
- Jira / Linear (project management)
- Power BI / Tableau (analytics)

---

**Dokumentin versio**: 1.0
**Päivitetty**: 2025-10-11
**Tekijä**: AI-Panu (Claude Sonnet 4) + Admin
**Projekti**: Humm Group Oy Tech Lead -työhakemus demo
