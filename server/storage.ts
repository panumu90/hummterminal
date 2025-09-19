import { type Case, type InsertCase, type ChatMessage, type InsertChatMessage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllCases(): Promise<Case[]>;
  getCaseById(id: string): Promise<Case | undefined>;
  createCase(case_: InsertCase): Promise<Case>;
  saveChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatHistory(): Promise<ChatMessage[]>;
}

export class MemStorage implements IStorage {
  private cases: Map<string, Case>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.cases = new Map();
    this.chatMessages = new Map();
    
    // Initialize with the case data from the provided text
    this.initializeCases();
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
    const message: ChatMessage = { ...insertMessage, id };
    this.chatMessages.set(id, message);
    return message;
  }

  async getChatHistory(): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).sort((a, b) => a.timestamp - b.timestamp);
  }
}

export const storage = new MemStorage();
