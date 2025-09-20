import { type Case, type InsertCase, type Trend, type InsertTrend, type ChatMessage, type InsertChatMessage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllCases(): Promise<Case[]>;
  getCaseById(id: string): Promise<Case | undefined>;
  createCase(case_: InsertCase): Promise<Case>;
  getAllTrends(): Promise<Trend[]>;
  getTrendsByCategory(category: string): Promise<Trend[]>;
  saveChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatHistory(): Promise<ChatMessage[]>;
  // getQuestionAnswer(questionId: string): Promise<{ answer: string } | undefined>;
  // getAllMcpContent(): Promise<{ title: string; content: string; security: string; benefits: string }[]>;
}

export class MemStorage implements IStorage {
  private cases: Map<string, Case>;
  private trends: Map<string, Trend>;
  private chatMessages: Map<string, ChatMessage>;
  private questionAnswers: Map<string, { answer: string }>;
  private mcpContent: { title: string; content: string; security: string; benefits: string }[];

  constructor() {
    this.cases = new Map();
    this.trends = new Map();
    this.chatMessages = new Map();
    this.questionAnswers = new Map();
    this.mcpContent = [];
    
    // Initialize with the case data and trend data
    this.initializeCases();
    this.initializeTrends();
    // this.initializeQuestionAnswers(); // TODO: implement method
    // this.initializeMcpContent(); // TODO: implement method
  }

  private initializeCases() {
    const casesData: InsertCase[] = [
      {
        company: "Alibaba",
        country: "Kiina",
        industry: "Verkkokauppa",
        solution_name: "AliMe Chatbot",
        description: "Tekoälypohjainen chatbot joka hoiti massiiviset volyymit Singles' Day -ostospäivän aikana. Hyödynsi puheentunnistusta, semanttista ymmärrystä ja ennakoivaa analytiikkaa.",
        key_metrics: [
          { label: "Kyselyistä hoidettu automaattisesti", value: "95-97%", type: "success" },
          { label: "Kysymystä päivässä", value: "300M", type: "efficiency" },
          { label: "Työntekijän kapasiteetti", value: "85k", type: "savings" }
        ],
        learning_points: [
          "Tunnetilan tunnistus ja eskalointi ihmiselle",
          "Semanttinen ymmärrys ja kontekstin säilyttäminen",
          "Ennakoiva analytiikka ruuhka-aikojen hallintaan"
        ],
        category: "Maailmanluokka",
        icon: "fab fa-amazon",
        full_text: "Maailman suurimpiin kuuluva verkkokauppatoimija Alibaba otti tekoälypohjaisen AliMe-chatbotin käyttöön asiakaspalvelussaan. Tekoäly hoiti massiiviset 95-97 % kaikista asiakaspalvelukyselyistä suurimman ostospäivän (Singles' Day) aikana, vastaten satoihin miljooniin asiakaskyselyihin. Esimerkiksi vuonna 2019 AliMe vastasi 300 miljoonaan kysymykseen Singles' Day -festivaalin aikana, mikä vastaa 85 000 ihmistyöntekijän kapasiteettia. Chatbot hyödynsi puheentunnistusta, semanttista ymmärrystä ja ennakoivaa analytiikkaa: se osasi jopa tunnistaa asiakkaan tunnetilan ja hälyttää ihmistyöntekijän linjoille tarvittaessa. Tuloksena Alibaba pystyi palvelemaan ostostapahtumien valtavat volyymit nopeasti, vähentämään inhimillisen työn tarvetta huippukuormituksen aikana sekä pitämään vastausajat sekunneissa - mikä parantaa asiakaskokemusta ruuhkatilanteissakin."
      },
      {
        company: "Autodesk",
        country: "USA",
        industry: "B2B Ohjelmistotuki",
        solution_name: "AVA Virtual Agent",
        description: "IBM Watson -teknologiaan perustuva virtuaalinen tukiasiantuntija tekniseen asiakastukeen. Keskittyy yleisimpien tukipyyntöjen automaattiseen ratkaisemiseen.",
        key_metrics: [
          { label: "Ratkaisuajan lyhentyminen", value: "36h → 2min", type: "success" },
          { label: "Tyytyväisyyden kasvu", value: "+10pp", type: "efficiency" },
          { label: "Kysymystä kuukaudessa", value: "35k/kk", type: "savings" }
        ],
        learning_points: [
          "Kustannustehokkuus: $15-200 → alle $1 per tapaus",
          "24/7 saatavuus teknisessä tuessa",
          "Ihmisten vapautuminen monimutkaisiin tehtäviin"
        ],
        category: "B2B Malli",
        icon: "fas fa-drafting-compass",
        full_text: "Suunnittelu- ja ohjelmistoyritys Autodesk on onnistuneesti ottanut käyttöön virtuaalisen tukiasiantuntijan nimeltä AVA (Autodesk Virtual Agent) asiakkaidensa tukipalvelussa. AVA hyödyntää tekoälyä (IBM Watson -teknologiaa) vastatakseen yleisimpiin tukipyyntöihin ja ratkaistakseen ongelmia. Tulokset ovat olleet vaikuttavia: Autodeskin mukaan AVA lyhensi tukipyyntöjen ratkaisuajan keskimäärin 36 tunnista vain muutamiin minuutteihin - toisin sanoen ratkaisuajat paranivat jopa 99 %. Samalla asiakastyytyväisyys nousi 10 prosenttiyksikköä virtuaaliassistentin käyttöönoton myötä. AVA:sta on tullut Autodeskin asiakaspalvelun käytetyin kanava: se käsittelee yli 35 000 asiakaskysymystä kuukaudessa ja hoitaa näin suurimman osan kontakteista. Myös kustannustehokkuus parani dramaattisesti - yhden tukitapauksen hoitamisen kustannus laski arviolta $15-200 tasolta alle $1 tapaukseen tekoälyn ansiosta. Tämä vapauttaa ihmistukihenkilöiden aikaa vaativampiin tehtäviin ja takaa asiakkaille nopean palvelun ympäri vuorokauden."
      },
      {
        company: "Swedbank",
        country: "Ruotsi",
        industry: "Pankkipalvelut",
        solution_name: "Nina Virtuaalinen Asiakaspalvelija",
        description: "Luonnollisen kielen ymmärtämiseen perustuva chatbot pankkipalveluihin. Käyttöönotto 2010-luvun puolivälissä, vakiintunut ratkaisu.",
        key_metrics: [
          { label: "Ensi kontaktin ratkaisu", value: "78%", type: "success" },
          { label: "Onnistumisprosentti", value: "8/10", type: "metric" },
          { label: "Keskustelua kuukaudessa", value: "30k/kk", type: "efficiency" }
        ],
        learning_points: [
          "24/7 saatavuus peruspalveluille",
          "Nopea käyttöönottoaika: 3 kuukautta",
          "Ihmisagentit vapautuvat monimutkaisiin tapauksiin"
        ],
        category: "Pankkisektori",
        icon: "fas fa-university",
        full_text: "Pohjoismainen pankkikonserni Swedbank otti jo 2010-luvun puolivälissä käyttöön Nina-nimisen virtuaalisen asiakaspalvelijan verkkosivuillaan. Nina-pohjautuu luonnollisen kielen ymmärtämiseen ja pystyy käymään asiakkaiden kanssa keskustelua näiden kirjoittamalla kielellä. Tulokset näkyivät nopeasti: 78 % asiakkaiden kyselyistä ratkesi ensi kontaktilla Ninan avulla jo kolmen kuukauden sisällä käyttöönotosta. Chatbot kävi keskimäärin 30 000 keskustelua kuukaudessa, ja osasi vastata 8 kysymykseen 10:stä onnistuneesti ilman ihmisagentin apua. Tämä paransi palvelun saatavuutta ja vapautti pankin asiakaspalvelijoita monimutkaisempien tapausten hoitoon. Swedbankin mukaan asiakaskokemus parani selvästi, kun yleisimpiin kysymyksiin saatiin välittömät vastaukset vuorokaudenajasta riippumatta."
      },
      {
        company: "Verkkokauppa.com",
        country: "Suomi",
        industry: "Verkkomyynti",
        solution_name: "Asiakaspalvelu Chatbot",
        description: "Verkkokaupan chat-kanavan automaatio. Keskittyy yleisimpien asiakaspalvelukysymysten hoitamiseen ja tilausten seurantaan.",
        key_metrics: [
          { label: "Chat-kyselyistä automaattisesti", value: "77%", type: "metric" },
          { label: "Kaikista kontakteista chatissa", value: "38%", type: "success" },
          { label: "Välitön vastaus", value: "24/7", type: "efficiency" }
        ],
        learning_points: [
          "Chat-kanavan tehokas hyödyntäminen",
          "Odotusaikojen lyhentäminen",
          "Rutiinitehtävien automatisointi"
        ],
        category: "Kotimainen",
        icon: "fas fa-shopping-cart",
        full_text: "Suomen suurimpiin kuuluva elektroniikan verkkokauppa Verkkokauppa.com on hyödyntänyt chatbot-teknologiaa asiakaspalveluchatissaan tehokkaasti. Yhtiön vuoden 2021 kestävän kehityksen raportin mukaan 38 % kaikista asiakaspalvelukontakteista tapahtui chat-kanavassa, ja näistä keskusteluista peräti 77 % hoidettiin chatbotin voimin. Toisin sanoen valtaosa asiakkaiden chat-kyselyistä saatiin ratkaistua automaattisesti tekoälyn avulla, ilman että ihmistyöntekijän tarvitsi puuttua - vain noin joka neljännessä chatissa tarvittiin ihmisen apua. Tämä on tuonut huomattavaa tehokkuutta: chatbot vastaa välittömästi yleisimpiin kysymyksiin (24/7), mikä lyhentää asiakkaiden odotusaikoja ja säästää asiakaspalvelijoiden aikaa. Ihmiset voivat keskittyä monimutkaisempiin tukipyyntöihin, kun botti hoitaa rutiinikysymykset. Verkkokauppa.com onkin raportoinut asiakaskokemuksen kohentuneen chat-kanavassa, ja asiakkaat ovat omaksuneet botti-palvelun hyvin."
      },
      {
        company: "Nordea",
        country: "Suomi/Pohjoismaat",
        industry: "Pankkipalvelut",
        solution_name: "Nova Virtuaalinen Asiakaspalvelija",
        description: "Nordean oma chatbot henkilö- ja yritysasiakkaille. Käytössä vuodesta 2017, jatkuva kehittäminen ja kouluttaminen.",
        key_metrics: [
          { label: "Keskustelua vuonna 2024", value: "7M+", type: "efficiency" },
          { label: "Vastausaika peruskysymyksiin", value: "2s", type: "success" },
          { label: "Käytön kasvu 2021-2023", value: "2x", type: "metric" }
        ],
        learning_points: [
          "Suora ohjaus tarvittaviin palveluihin (esim. PIN-koodi)",
          "Jatkuva kehittäminen ja kouluttaminen",
          "Maakohtaiset erot käyttöasteessa"
        ],
        category: "Pohjoismainen",
        icon: "fas fa-landmark",
        full_text: "Pohjoismaiden suurin pankki Nordea on kehittänyt oman virtuaalisen asiakaspalvelijansa nimeltä Nova. Nova on ollut käytössä vuodesta 2017 ja palvelee Nordean henkilö- ja yritysasiakkaita tyypillisissä pankkiasioissa. Vuosien 2021-2023 aikana Nordean chatbotin käyttö on kaksinkertaistunut, ja vuonna 2024 Nova-chatbotin odotetaan käyvän yli 7 miljoonaa asiakaskeskustelua. Nova pystyy vastaamaan yksinkertaisiin kysymyksiin noin kahdessa sekunnissa, mikä on huomattavasti nopeampaa kuin puhelinpalvelussa jonottaminen. Nordea kertoo, että chatbot vapauttaa heidän asiakasneuvojilleen aikaa keskittyä vaikeampiin tapauksiin, kun Nova hoitaa peruskysymykset reaaliajassa. Chatbotin laatu on parantunut tekoälyn kehittymisen ja jatkuvan koulutuksen myötä, ja Nova osaa nykyään viedä asiakkaan suoraan tarvitsemiinsa pankkipalveluihin (esim. unohtuneen PIN-koodin tapauksessa Nova ohjaa suoraan kortin PIN-koodin näyttötoimintoon). Tämä on parantanut käyttökokemusta: asiakkaat saavat vastaukset ja palvelun nopeasti itsepalveluna, ja palaute on ollut Nordean mukaan myönteistä. Eri Pohjoismaissa kuitenkin näkyy eroja käyttöasteessa - esimerkiksi Norjassa chatbotia käytetään suhteessa eniten ja Tanskassa ollaan varovaisimpia - mutta kokonaisuutena Nova on vakiinnuttanut paikkansa tärkeänä ensikontaktin palvelukanavana."
      },
      {
        company: "Fonecta",
        country: "Suomi",
        industry: "Digitaaliset palvelut",
        solution_name: "Aina Chatbot",
        description: "Digitaalisten yhteystieto- ja markkinointipalvelujen tukeen räätälöity chatbot. Integroitunut osaksi tiimikulttuuria.",
        key_metrics: [
          { label: "Kyselyistä itsenäisesti", value: "60-70%", type: "metric" },
          { label: "Aukioloaikojen ulkopuolella", value: "24/7", type: "success" },
          { label: "Henkilöstöpalaute", value: "Positiivinen", type: "efficiency" }
        ],
        learning_points: [
          "Integroituminen yrityskulttuuriin",
          "Työntekijöiden toiston vähentäminen",
          "Chatbot saa usein oman nimen tiimissä"
        ],
        category: "B2B Digitaalinen",
        icon: "fas fa-address-book",
        full_text: "Fonecta, joka tarjoaa digitaalisia yhteystieto- ja markkinointipalveluja, on ottanut käyttöön Aina-nimisen chatbotin asiakaspalvelussaan. Yhtiön kokemusten mukaan Aina-botti vastaa itsenäisesti 60-70 % asiakkaiden kyselyistä, jolloin inhimilliset asiakaspalvelijat voivat keskittyä vain noin kolmannekseen yhteydenotoista. Tämä on lyhentänyt ihmistyöntekijöiden vastausaikoja ja parantanut palvelun saatavuutta: botti on aina hereillä ja käytettävissä, myös aukioloaikojen ulkopuolella. Fonectan mukaan sekä asiakkaiden että työntekijöiden palaute on ollut lähes yksinomaan positiivista, koska botti ratkaisee nopeasti perustarpeet ja työntekijät säästyvät jatkuvalta toistolta. Vastaavanlaisia hyötyjä on raportoitu myös muissa suomalaisissa organisaatioissa, joissa chatbot otettiin osaksi tiimiä: botti toimii tehokkaana \"tiimiläisenä\" ja saa usein jopa leikkimielisen oman nimensä yrityskulttuurissa, mikä kuvastaa sen integroitumista osaksi arkea."
      }
    ];

    casesData.forEach(caseData => {
      const id = randomUUID();
      const case_: Case = { ...caseData, id };
      this.cases.set(id, case_);
    });
  }

  async getAllCases(): Promise<Case[]> {
    return Array.from(this.cases.values());
  }

  async getCaseById(id: string): Promise<Case | undefined> {
    return this.cases.get(id);
  }

  async createCase(insertCase: InsertCase): Promise<Case> {
    const id = randomUUID();
    const case_: Case = { ...insertCase, id };
    this.cases.set(id, case_);
    return case_;
  }

  async saveChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = { 
      ...insertMessage, 
      id,
      context_type: insertMessage.context_type || "general"
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getAllTrends(): Promise<Trend[]> {
    return Array.from(this.trends.values());
  }

  async getTrendsByCategory(category: string): Promise<Trend[]> {
    return Array.from(this.trends.values()).filter(trend => trend.category === category);
  }

  async getChatHistory(): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).sort((a, b) => a.timestamp - b.timestamp);
  }

  private initializeTrends() {
    const trendsData: InsertTrend[] = [
      // Finnish AI trends from comprehensive market analysis
      {
        category: "autonomous_agents",
        title: "Autonomiset AI-agentit tehostavat asiakaspalvelua",
        description: "AI-agentit tulevat tavanomaisiksi osaksi asiakaspalvelua integroituen asiakasviestintaalustoihin ja hoitaen pieniarvoisia tehtavia taysin itsenaisesti.",
        key_points: [
          "Integroituvat asiakasviestintaalustoihin hoitamaan yksinkertaisia kyselyita",
          "Lyhentavat jonotusaikoja ja mahdollistavat hyperpersoonoidun tuen",
          "Monista kuluttajista tulee AI-kanavan natiiveja",
          "Yrityksilla ilman toimivaa AI-palvelukanavaa riski asiakasuskollisuuden heikkenemiseen"
        ],
        examples: ["CCaaS- ja UCaaS-ratkaisut", "Proaktiivinen asiakaspalvelu"],
        full_content: "Mila D'Antonio (Omdia) ennustaa, etta autonomiset AI-agentit tulevat tavanomaisiksi osaksi asiakaspalvelua. Ne integroituvat asiakasviestintaalustoihin ja hoitavat pieniarvoisia tehtavia - esimerkiksi yksinkertaisia kyselyita tai tilausten seurantaa - taysin itsenaisesti. Nain ne lyhentavat jonotusaikoja ja mahdollistavat hyperpersoonoidun tuen. Zeus Kerravala muistuttaa, etta monista kuluttajista tulee AI-kanavan natiiveja: he asioivat mieluummin tekoalyagentin kanssa yksinkertaisissa asioissa."
      },
      {
        category: "ai_investments",
        title: "AI-investointien tuotto-odotukset kypsyvat",
        description: "Forresterin AI-pulse-tutkimuksen mukaan 49% AI-johtajista odottaa investointien tuottavan tulosta 1-3 vuodessa ja 44% 3-5 vuodessa. Hype on laantumassa ja johtajat painottavat realistisempia liiketoimintalahtöisia mittareita.",
        key_points: [
          "49% AI-johtajista odottaa tuloksia 1-3 vuodessa",
          "44% odottaa tuloksia 3-5 vuodessa",
          "Ennakoiva AI tulee takaisin generatiivisen AI:n rinnalle",
          "50% kayttotapauksista hyodyntaa perinteisia koneoppimisalgoritmeja",
          "30% AI-projekteista saatetaan hylata huonon datan tai kustannusten vuoksi"
        ],
        examples: ["Webex", "Metrigy", "Forrester"],
        full_content: "Christina McAllister (Forrester) toteaa, etta aiemmin generatiivinen AI sai paljon huomiota, mutta vuonna 2025 ennakoiva AI tulee takaisin: jopa 50% kayttotapauksista hyodyntaa perinteisia koneoppimisalgoritmeja, koska ne suorittavat tietyt tehtavat tehokkaammin tai taydentavat generatiivista AI:ta. Vaikka lahes 60% yrityksista on ottanut AI:n laajalti kayttoon, vain noin puolet kokee nykyisen teknologiansa tuottavan toivotun asiakaskokemuksen."
      },
      {
        category: "hyperpersonalization",
        title: "Hyperpersoonalistaminen ja datan laatu",
        description: "Generatiivinen AI ja monimodaaliset mallit mahdollistavat yksilollisen vuorovaikutuksen jokaiselle asiakkaalle analysoimalla ostotietoja, selaushistoriaa ja tunnesavya.",
        key_points: [
          "AI mahdollistaa hyperpersoonalisoinnin, automatisoidut tyonkulut ja tunteiden tunnistuksen",
          "Palvelut ovat entista henkilokohtaisempia ja tehokkaampia",
          "Generatiivisen AI:n avulla voidaan toimittaa raataloitya sisaltoa skaalauttavasti",
          "Datan laatu on kriittinen menestyksen edellytys",
          "Datan siilot on purettava taydellisen asiakasymmartyksen saavuttamiseksi"
        ],
        examples: ["NICE", "Genesys", "ServiceNow"],
        full_content: "NICE:n mukaan AI mahdollistaa hyperpersoonalisoinnin, automatisoidut tyonkulut, tunteiden tunnistuksen ja ennakoivan analytiikan, jolloin palvelut ovat entista henkilokohtaisempia ja tehokkaampia. Asiantuntijat painottavat myos datan laatua. Cathy Mauzaize (ServiceNow) toteaa, etta AI-hankkeet kaatuvat usein datan puhtauden puutteeseen; onnistuminen vaatii siirtymista proof-of-conceptista proof-of-valueen todellisella datalla."
      },
      {
        category: "proactive_service",
        title: "Proaktiivinen kanavien yli ulottuva palvelu",
        description: "AI ja automaatio siirtyvat reaktiivisesta ongelmanratkaisusta kohti proaktiivista asiakkaan ilahduttamista. Esimerkkeja ovat lentoyhtiöt, jotka rebookaavat lennot automaattisesti.",
        key_points: [
          "Siirtyminen reaktiivisesta proaktiiviseen asiakkaan ilahduttamiseen",
          "AI voi yhdistaa eri jarjestelmia tarjoamaan ajantasaista apua",
          "Reaaliaikainen kanavien valinen nakyvyys mahdollistaa sentimentin ymmartamisen",
          "Keskeista on ymmartaa asiakkaan profiili, mieltymykset ja aikomukset",
          "Intentional channel strategies ovat valttamattomia"
        ],
        examples: ["Lentoyhtiöt", "Terveydenhuolto", "Genesys"],
        full_content: "Nextivan Kate Hodgins huomauttaa, etta AI ja automaatio siirtyvat reaktiivisesta ongelmanratkaisusta kohti proaktiivista asiakkaan ilahduttamista. Esimerkkeja ovat lentoyhtiöt, jotka rebookaavat lennot automaattisesti ja ilmoittavat asiakkaille, tai terveydenhuollon toimijat, jotka muistuttavat ajoissa sovituista ajoista. Keskeista on ymmartaa asiakkaan profiili, mieltymykset ja aikomukset ja kayttaa naita tietoja oikea-aikaiseen yhteydenottoon."
      },
      {
        category: "human_ai_collaboration",
        title: "Ihmisen ja tekoalyn yhteistyo",
        description: "Asiakkaat odottavat yha ihmiskosketusta monimutkaisissa tilanteissa. Yritysten on koulutettava agenteista entista empaattisempia ja paremmin informoituja.",
        key_points: [
          "AI parantaa asiakastyytyvaisyytta keskimaarin 22,3%",
          "40% kuluttajista valttaa chatboteja, koska ne eivat ymmarra pyyntoja",
          "Menestyvat organisaatiot mittaavat menestysta asiakasuskollisuudella",
          "Yritykset siirtyvat pienempiin raatalöityihin malleihin",
          "Luotettavien AI-toimittajien etsiminen on kriittista"
        ],
        examples: ["Agent assist -ratkaisut", "NICE", "Forbes"],
        full_content: "Alpa Shah (Frost & Sullivan) muistuttaa, etta asiakkaat odottavat yha ihmiskosketusta monimutkaisissa tilanteissa. Yritysten on koulutettava agenteista entista empaattisempia ja paremmin informoituja, koska AI hoitaa peruskysymykset. Robin Gareiss huomauttaa, etta vaikka AI parantaa asiakastyytyvaisyytta keskimaarin 22,3%, 40% kuluttajista valttaa chatboteja, koska ne eivat ymmarra heidan pyynnönsä."
      },
      {
        category: "business_impact",
        title: "Liiketoimintavaikutus ja vastuullisuus",
        description: "CX:n arvoa mitataan yha selvemmin liiketoiminnan mittareilla. Tietosuojasta ja eettisyydesta on tullut kriittisia. Sosiaalisen median rooli kasvaa ostopoluissa.",
        key_points: [
          "Yritykset yhdistävät asiakaspalvelustrategiat liiketoiminnan tuloksiin",
          "Asiakaselinkaaren arvo ja uskollisuus ovat keskiossa",
          "Monet organisaatiot hylkäävät AI-hankkeet ilman läpinäkyvyyttä",
          "TikTok, Amazon ja muut algoritmit vaikuttavat suoraan ostopolkuihin",
          "Brändien näkyvyys siirtyy generatiivisten AI-hakujen maailmaan"
        ],
        examples: ["Genesys", "Gartner", "TikTok", "Amazon"],
        full_content: "Genesysin mukaan yritykset yhdistävät asiakaspalvelustrategiat selvästi liiketoiminnan tuloksiin, kuten asiakaselinkaaren arvoon ja uskollisuuteen. Tietosuojasta ja eettisyydestä on tullut kriittisiä. Gartner ennustaa, että monet organisaatiot hylkäävät AI-hankkeita, jos ne eivät pysty osoittamaan, että mallit ovat läpinäkyviä ja ennakkoluulottomia. Myös sosiaalisen median rooli kasvaa: TikTokin, Amazonin ja muiden alojen algoritmit vaikuttavat suoraan asiakkaiden ostopolkuihin."
      },
      {
        category: "customer_understanding",
        title: "Tekoäly syväluotaa asiakasdatan",
        description: "AI-mallit analysoivat valtavia määriä asiakasdataa löytäen merkityksellisiä kuvioita asiakaspalautteiden, tukipyyntöjen ja keskustelulogien joukosta.",
        key_points: [
          "Generatiiviset kielimallit tiivistävät tuhansia asiakaspalautteita nopeasti",
          "Toistuvien teemojen ja ongelmakohtien paljastaminen automaattisesti",
          "Zendesk luokittelee tukipyynnöt aiheen, kielen ja sentimentin perusteella",
          "Reaaliaikainen asiakasymmärrys ennennäkemättömälle syvyydelle"
        ],
        examples: ["Zendesk"],
        full_content: "Nykyiset AI-mallit - mukaan lukien suuret kielimallit (LLM) ja monimodaaliset mallit - pystyvät analysoimaan valtavia määriä asiakasdataa (kuten tekstiä, ääntä ja kuvaa) ja löytämään sieltä merkityksellisiä kuvioita. Esimerkiksi asiakaspalautteet, tukipyynnöt ja keskustelulokit sisältävät jäsentämätöntä tietoa, jonka käsittelyyn AI tuo tehoa. Generatiiviset kielimallit voivat tiivistää tuhansia asiakaspalautteita nopeasti ja paljastaa toistuvat teemat tai ongelmakohdat, mikä olisi manuaalisesti lähes mahdotonta."
      },
      {
        category: "customer_understanding",
        title: "Asiakassegmentointi ja churn-ennustaminen",
        description: "Koneoppiminen ennustaa asiakasarvoa, tunnistaa churn-riskejä ja analysoi jäsentämätöntä tekstidataa luonnollisen kielen käsittelyn avulla.",
        key_points: [
          "Ennakoiva analytiikka yhdistää historiatiedot ja nykykäyttäytymisen",
          "Turhautumisen ja tyytymättömyyden merkkien tunnistaminen teksteistä",
          "Proaktiivinen puuttuminen ennen asiakkaan menettämistä",
          "Miljoonasäästöt tilausliiketoiminnassa ja telecom-sektorilla"
        ],
        examples: ["Zendesk"],
        full_content: "Vuonna 2025 monet yritykset hyödyntävät AI:ta esimerkiksi asiakassegmentoinnissa, asiakasarvon ennustamisessa sekä churn-riskin tunnistamisessa. Ennakoiva analytiikka pystyy yhdistämään historiatietoja ja nykykäyttäytymistä paljastaakseen, mitkä asiakkaat ovat vaarassa lähteä kilpailijalle. Uudet työkalut analysoivat jopa jäsentämätöntä tekstidataa - kuten asiakasviestejä - luonnollisen kielen käsittelyn avulla: ne seulovat tuhansia avainsanoja ja lauseita havaitakseen turhautumisen tai tyytymättömyyden merkkejä."
      },
      {
        category: "customer_understanding",
        title: "Hyperpersoonallistaminen reaaliajassa",
        description: "Jokaiselle asiakkaalle luodaan yksilöllinen kokemus reaaliaikaisen data-analyysin avulla, hyödyntäen selaushistoriaa, ostotietoja ja preferenssejä.",
        key_points: [
          "85% kuluttajista odottaa yritysten ennakoivan tarpeitaan etukäteen",
          "Yksilöidyt kokemukset tuottavat 40% enemmän liikevaihtoa massalähestymiseen verrattuna",
          "80% kuluttajista todennäköisemmin ostoaikeissa personoitujen kokemusten kanssa",
          "Netflix AI-suosittelu tuottaa yli miljardi dollaria lisävuosituloa"
        ],
        examples: ["Netflix", "Starbucks", "Amazon Rufus"],
        full_content: "Pelkkä personointi ei enää riitä - nyt pyritään hyperpersoonallistamiseen, jossa jokaiselle asiakkaalle luodaan yksilöllinen kokemus reaaliaikaisen data-analyysin avulla. AI:n tukema hyperpersoonallistaminen tarkoittaa, että järjestelmät hyödyntävät mm. asiakkaan selaushistoriaa, ostotietoja, sijaintia ja muita preferenssejä räätälöidäkseen sisällön ja viestit juuri kyseiselle henkilölle sopiviksi."
      },
      {
        category: "automation",
        title: "Generatiiviset tekoälymallit asiakaspalvelussa",
        description: "Suuret kielimallit mullistavat asiakaspalvelun automaation laadun tuottamalla dynaamisia, ihmismäisiä vastauksia asiakkaiden kysymyksiin.",
        key_points: [
          "Yli 80% yrityksistä ottaa käyttöön generatiivista tekoälyä vuonna 2025",
          "Pankkikonsernin chatbot parani 20% seitsemässä viikossa",
          "51% asiakkaista suosii botti-palvelua välittömiin vastauksiin",
          "95% asiakaskohtaamisista sisältää AI-komponentin vuoteen 2025"
        ],
        examples: ["OpenAI GPT-sarja"],
        full_content: "Generatiivinen tekoäly - erityisesti suuret kielimallit kuten OpenAI:n GPT-sarja - on mullistanut asiakaspalvelun automaation laadun. Toisin kuin vanhat sääntöpohjaiset chatbotit, uudet LLM-mallit tuottavat dynaamisia, ihmismäisiä vastauksia asiakkaiden kysymyksiin. Vuonna 2025 yli 80 % yrityksistä on jo ottanut käyttöön tai suunnittelee ottavansa käyttöön generatiivista tekoälyä asiakasvuorovaikutuksessaan."
      },
      {
        category: "automation",
        title: "Autonomiset agentit ja työnkulkujen orkestrointi (klassinen)",
        description: "Autonomiset tekoälyagentit hoitavat tehtäviä itsenäisesti ennalta asetettujen tavoitteiden mukaisesti, suunnitellen ja suorittaen monivaiheisia prosesseja.",
        key_points: [
          "Agentit käyttävät tekoälyä tehtävien suorittamiseen ilman tarkkoja käyttäjän syötteitä",
          "Pystyvät laatimaan suunnitelman ja käyttämään erilaisia työkaluja",
          "Salesforce Agentforce tarjoaa 100 tekoälybotin kirjaston",
          "Talkdesk AI Agents for Retail vähittäiskaupalle"
        ],
        examples: ["Salesforce Agentforce", "Talkdesk AI Agents"],
        full_content: "Yksi vuoden 2025 puhutuimmista edistysaskeleista on agenttiteknologia - toisin sanoen autonomiset tekoälyagentit, jotka hoitavat tehtäviä itsenäisesti ennalta asetettujen tavoitteiden mukaisesti. Aikaisemmat chatbotit odottivat käyttäjän seuraavaa viestiä, mutta agenttimainen AI voi omatoimisesti suunnitella ja suorittaa useita askeleita sisältäviä prosesseja."
      }
    ];

    trendsData.forEach(trendData => {
      const id = randomUUID();
      const trend: Trend = { ...trendData, id };
      this.trends.set(id, trend);
    });
  }
}

export const storage = new MemStorage();
