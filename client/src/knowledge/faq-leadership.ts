/**
 * Suosituimmat kysymykset johdolle - nopeat vastaukset ilman API-kutsua
 */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'strategy' | 'financial' | 'ai-implementation' | 'timeline' | 'risks';
  relatedDocs: string[];
}

export const leadershipFAQ: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Miten saavutamme 10M€ liikevaihdon?',
    answer: `Kolme skenaariota 10M€ tavoitteeseen:

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
    category: 'strategy',
    relatedDocs: ['humm-financial-analysis']
  },
  {
    id: 'faq-2',
    question: 'Paljonko AI-transformaatio maksaa ja mikä on ROI?',
    answer: `**Investoinnit:**
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
    category: 'financial',
    relatedDocs: ['humm-financial-analysis']
  },
  {
    id: 'faq-3',
    question: 'Mistä aloitamme AI-implementaation?',
    answer: `**Vaihe 1: Lyhyt aikaväli (0-6 kk)**
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
    category: 'ai-implementation',
    relatedDocs: ['humm-financial-analysis', 'cx-ai-trends-2025']
  },
  {
    id: 'faq-4',
    question: 'Mitkä ovat AI:n tärkeimmät käyttökohteet Hummille?',
    answer: `**1. Autonomiset asiakaspalvelu-agentit**
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
    category: 'ai-implementation',
    relatedDocs: ['cx-ai-trends-2025', 'humm-financial-analysis']
  },
  {
    id: 'faq-5',
    question: 'Mitkä ovat suurimmat riskit ja miten ne hallitaan?',
    answer: `**Teknologiariskit:**
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
    category: 'risks',
    relatedDocs: ['humm-financial-analysis', 'model-context-protocol']
  }
];

/**
 * Get FAQ by category
 */
export function getFAQByCategory(category: FAQItem['category']): FAQItem[] {
  return leadershipFAQ.filter(faq => faq.category === category);
}

/**
 * Search FAQ by keywords
 */
export function searchFAQ(query: string): FAQItem[] {
  const lowerQuery = query.toLowerCase();
  return leadershipFAQ.filter(faq =>
    faq.question.toLowerCase().includes(lowerQuery) ||
    faq.answer.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get FAQ by ID
 */
export function getFAQById(id: string): FAQItem | undefined {
  return leadershipFAQ.find(faq => faq.id === id);
}
