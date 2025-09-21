// MCP and AI Questions/Answers for the new UI structure

export const questionAnswers: Record<string, { answer: string }> = {
  // MCP Questions - TÄRKEÄ!
  "mcp-what-is": {
    answer: "## 🤖 **Model Context Protocol (MCP)**\n\n**MCP** on avoin standardi, joka mahdollistaa **turvallisen yhteyden** AI-mallien ja ulkoisten tietolähteiden välillä.\n\n### **Mitä MCP tekee:**\n- 🔗 **Yhdistää AI:n reaaliaikaiseen dataan** (CRM, ERP, tietokannat)\n- 🛡️ **Hallitsee pääsyoikeudet** roolipohjaisesti\n- 📊 **Mahdollistaa monivaiheiset prosessit** asiakaspalvelussa\n- 🔍 **Tarjoaa läpinäkyvän audit-jäljen** kaikista toimista\n\n### **Yksinkertaisesti:**\nMCP on \"tulkki\" joka antaa AI:lle luvan käyttää yrityksen järjestelmiä turvallisesti - ei enempää eikä vähempää kuin tarvitaan.\n\n**Esimerkki:** Asiakaspalvelu-AI voi hakea tilauksen tiedot mutta ei muokata niitä ilman lupaa."
  },
  "mcp-security": {
    answer: "🔒 **MCP parantaa AI-integraatioiden turvallisuutta merkittävästi**\n\n• **Roolipohjainen pääsynhallinta (RBAC)**: AI-agentti saa vain ne oikeudet, joita sen tehtävän hoitamiseen tarvitaan\n• **Eksplisiittinen kontekstin rajaus**: Tekoäly pääsee käsiksi vain kulloinkin tarpeelliseen tietoon\n• **Audit-jäljet ja valvonta**: Kaikki AI:n toimet tallennetaan läpinäkyvästi\n• **Automaattinen tietoturva**: MCP-palvelin hallitsee pääsyoikeudet keskitetysti\n\nTämä estää AI:ta ylittämästä valtuuksiaan ja vuotamasta arkaluontoista tietoa. MCP toimii 'hiekkalaatikkona' joka pitää tekoälyn kontrollissa."
  },
  "mcp-automation": {
    answer: "⚡ **MCP:n hyödyt asiakaspalvelun automaatiossa**\n\n• **Reaaliaikainen järjestelmäintegraatio**: AI voi hakea tietoa CRM:stä, ERP:stä ja muista järjestelmistä samassa keskustelussa\n• **Monivaiheiset prosessit**: Esim. asiakas kysyy tilausta → AI hakea tiedot → luo palautuspyynnön → lähettää sähköpostin\n• **Ajantasainen tieto**: Tekoäly ei ole sidottu vain koulutusdataansa vaan näkee nykyisen tilanteen\n• **Yhtenäinen rajapinta**: Sama AI voi käyttää eri järjestelmiä ilman erillistä integraatiota jokaiseen\n\nTuloksena asiakaspalvelu on paljon älykkäämpää ja pystyy ratkaisemaan ongelmia nopeammin."
  },
  "mcp-access-control": {
    answer: "🛡️ **MCP:n avulla AI:n pääsyoikeuksien hallinta**\n\n• **Vähimmän oikeuden periaate**: AI saa vain tarvittavat oikeudet, ei kaikkea\n• **Asiakaskohtainen rajaus**: Asiakaspalvelu-AI näkee vain kyseisen asiakkaan tiedot\n• **Roolipohjaiset rajoitukset**: Tavallisen työntekijän avustaja vs. esimiehen avustaja\n• **Reaaliaikainen valvonta**: Jokainen AI:n tekemä toimenpide kirjataan lokiin\n• **Keskitetty hallinta**: Organisaatio päättää, mitkä 'ovet' ovat auki kullekin AI:lle\n\nEsimerkki: AI-agentti voi lukea asiakkaan tilaukset mutta ei muokata niitä ilman erillislupaa."
  },

  // Strategy & ROI
  "roi-measurement": {
    answer: "📊 **AI-investoinnin mitattava arvo asiakaspalvelussa**\n\n• **Suorat säästöt**: Automaatio vähentää henkilöstökuluja 30-50%\n• **Vastausaikojen paraneminen**: 36h → 2min (Autodeskin tulos)\n• **Asiakastyytyväisyyden kasvu**: +10 prosenttiyksikköä tyypillisesti\n• **24/7 saatavuus**: Ei ylimääräisiä vuorotyökustannuksia\n• **Skaalautuvuus**: Yhden AI:n hinta vs. useiden työntekijöiden palkkaaminen\n\n**Mittarit joita seurata:**\n- Ratkaisuprosentti automaatiolla (tavoite 80-95%)\n- Keskimääräinen käsittelyaika\n- Asiakastyytyväisyyspistemäärä (CSAT)\n- Kustannus per ratkaisu tapaus"
  },
  "cx-trends-2025": {
    answer: "🚀 **2025 suurimmat CX-trendit**\n\n• **Hyperpersoonallistaminen**: Jokainen asiakaskohtaaminen räätälöity reaaliaikaisesti\n• **Autonomiset AI-agentit**: Tekoäly hoitaa tehtäviä itsenäisesti ilman ihmisen ohjausta\n• **Proaktiivinen asiakaspalvelu**: AI ennakoi ongelmia ja ottaa yhteyttä ennen kuin asiakas valittaa\n• **Äänipohjainen AI**: Puheentunnistus ja sentimenttianalyysi mullistavat puhelinpalvelun\n• **AI + ihminen -yhteistyö**: Agent assist -työkalut tekevät ihmistyöntekijöistä tehokkaampia\n\n**Konkreettinen vaikutus:** 95% asiakaskohtaamisista sisältää AI-komponentin vuoteen 2025 mennessä."
  },

  // Data & Privacy
  "data-quality": {
    answer: "🔐 **Asiakasdata laadukkaana ja suojattuna**\n\n• **Automaattinen datavalidointi**: AI tarkistaa tietojen oikeellisuuden syötön yhteydessä\n• **GDPR-compliance**: Sisäänrakennettu tietosuoja ja 'right to be forgotten'\n• **Salaus kaikissa kerroksissa**: Data on suojattu sekä säilytyksen että siirron aikana\n• **Pääsynhallinta**: Vain valtuutetut järjestelmät ja henkilöt näkevät asiakastietoja\n• **Audit-lokit**: Kaikki datan käyttö dokumentoidaan\n\n**Käytännössä**: AI voi esim. automaattisesti tunnistaa vanhentuneet yhteystiedot ja pyytää päivitystä asiakkaalta."
  },
  "gdpr-compliance": {
    answer: "⚖️ **Datasiilojen välttäminen ja GDPR-riskien hallinta**\n\n• **Keskitetty datan hallinta**: Master Data Management (MDM) -järjestelmä\n• **Privacy by Design**: Tietosuoja suunnitellaan järjestelmään alusta lähtien\n• **Datakartoitus**: Tiedetään missä asiakasdata sijaitsee ja miten sitä käytetään\n• **Automaattinen anonymisointi**: Henkilötiedot poistetaan automaattisesti määräajan kuluttua\n• **API-pohjainen integraatio**: Järjestelmät jakavat dataa hallitusti, ei kopioi\n\n**GDPR-compliance varmistetaan:**\n- Suostumusten hallinta keskitetysti\n- Tietojen poisto-oikeus automaattisesti\n- Tietovuotojen ilmoitusvelvollisuus 72h"
  },

  // Automation & Workflows  
  "reduce-manual-work": {
    answer: "🤖 **Automaatio vähentää manuaalista työtä**\n\n• **Tikettien luokittelu**: AI tunnistaa automaattisesti ongelmatyypin ja kiireellisyyden\n• **Reitittäminen oikealle osastolle**: Intelligent routing säästää aikaa ja virheitä\n• **Vakiovastausten generointi**: AI kirjoittaa räätälöidyt vastaukset automaattisesti\n• **Tiedonhaku**: Automaattinen haku knowledge basesta ja dokumenteista\n• **Seuranta ja eskalointi**: AI muistaa seurata tapauksia ja eskaloi tarvittaessa\n\n**Tulokset käytännössä:** Alibaban AliMe hoitaa 95-97% kyselyistä automaattisesti, vapauttaen henkilöstön monimutkaisiin tehtäviin."
  },
  "ticket-classification": {
    answer: "🎯 **AI:n hyödyt tikettien luokittelussa ja reitityksessä**\n\n• **Automaattinen prioriteetti**: AI tunnistaa kriittisyystason viestin sisällöstä\n• **Älykkäs kategorisointi**: Tekninen ongelma vs. laskutuskysymys vs. palautus\n• **Sentimentin tunnistus**: Vihainen asiakas → pikareitti kokeneelle agentille\n• **Osaston valinta**: AI tietää kuka parhaiten osaa auttaa kullakin alueella\n• **SLA-seuranta**: Automaattinen muistutus ennen määräajan umpeutumista\n\n**Konkreettinen esimerkki:** 'Laskuni on väärä ja olen erittäin tyytymätön!' → AI tunnistaa: Billing-osasto, Korkea prioriteetti, Negatiivinen sentimentti → Reitittää suoraan senior-agentille."
  }
};

export const mcpContent = {
  title: "Model Context Protocol (MCP) - Turvallinen AI-integraatio",
  content: "MCP on avoin standardi, joka määrittelee tavan liittää suuria kielimalleja ja tekoälyagentteja ulkoisiin tieto- ja työkalulähteisiin turvallisesti. Sen avulla AI-avustajat voivat päästä käsiksi reaaliaikaiseen tietoon ja järjestelmiin.",
  security: "MCP mahdollistaa roolipohjaisen pääsynhallinnan, eksplisiittisen kontekstin rajauksen ja kattavan audit-jäljen. Organisaatio voi tarkasti määritellä, mihin tietoihin ja toimintoihin AI:lla on pääsy.",
  benefits: "MCP:n avulla AI voi yhdistää eri tietolähteitä saumattomasti, mikä parantaa vastausten laatua ja mahdollistaa monivaiheiset automaatioprosessit asiakaspalvelussa."
};