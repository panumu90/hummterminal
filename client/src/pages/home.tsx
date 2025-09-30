import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { PageHeader } from "@/components/page-header";
import { CaseCard } from "@/components/case-card";
import { ChatInterface } from "@/components/chat-interface";
import TechLeadDashboard from "@/components/tech-lead-dashboard";
import StrategicRoadmap from "@/components/strategic-roadmap";
import NewsFeed from "@/components/news-feed";
import { HummAILogo } from "@/components/humm-ai-logo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PulseButton } from "@/components/ui/pulse-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Bot, Building, Rocket, Users, TrendingUp, BarChart, User, Send, Star, Target, Briefcase, Code, Activity, DollarSign, Newspaper } from "lucide-react";
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

// Tech Lead Modal Component
function TechLeadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [jobApplicationOpen, setJobApplicationOpen] = useState(false);
  const [followUpSuggestions] = useState<string[]>([
    "Kerro kokemuksestasi makro-talouden analyysistä ja AI-timing ikkunasta",
    "Miten näet teknologian roolin Hummin €10M visiossa?",
    "Mikä on sinun unique value proposition Technology Leadina?",
    "Kerro Build vs Buy -strategiasta: Zendesk AI vs. N8N custom",
    "Kuinka käyttökate tulisi olla THE KPI Technology Leadille?",
    "Mitä tekisit ensimmäisen viikon aikana Hummilla?",
    "Miten henkilökohtaiset haasteesi ovat muokanneet johtamistyyliäsi?"
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

  const handleExampleClick = (question: string) => {
    if (techLeadChatMutation.isPending) return;

    setMessages(prev => [...prev, {
      content: question,
      isUser: true,
      timestamp: Date.now()
    }]);

    techLeadChatMutation.mutate({ message: question });
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
      <DialogContent className="max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl border-slate-600/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            Tech Lead - Panu Murtokangas
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            CV-chat: Keskustele taustastani ja osaamisestani Humm Group Oy:n kontekstissa
            <div className="text-xs text-slate-400 mt-1 italic">
              "Elämän haasteet ovat opettaneet minulle sinnikkyyden ja määrätietoisuuden - juuri niitä ominaisuuksia,
              joita tarvitaan johtamaan Hummin €10M transformaatiota."
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col h-[70vh]">
          {/* Chat Messages */}
          <ScrollArea className="flex-1 px-1">
            <div className="space-y-4 pb-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-3 max-w-[80%] ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 ${message.isUser ? 'bg-blue-600' : 'bg-slate-600'} rounded-full flex items-center justify-center flex-shrink-0`}>
                      {message.isUser ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className={`${message.isUser ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-100'} rounded-lg p-3`}>
                      {message.isUser ? (
                        <span className="text-sm">{message.content}</span>
                      ) : (
                        <div className="text-sm">
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({children}) => <h1 className="text-base font-bold mb-2 text-white">{children}</h1>,
                              h2: ({children}) => <h2 className="text-sm font-semibold mb-2 text-white">{children}</h2>,
                              h3: ({children}) => <h3 className="text-sm font-medium mb-1 text-slate-100">{children}</h3>,
                              p: ({children}) => <p className="mb-2 last:mb-0 text-slate-100">{children}</p>,
                              ul: ({children}) => <ul className="list-disc pl-4 mb-2 text-slate-100">{children}</ul>,
                              ol: ({children}) => <ol className="list-decimal pl-4 mb-2 text-slate-100">{children}</ol>,
                              li: ({children}) => <li className="mb-1 text-slate-100">{children}</li>,
                              strong: ({children}) => <strong className="font-semibold text-white">{children}</strong>,
                              em: ({children}) => <em className="italic text-slate-200">{children}</em>,
                              code: ({children}) => <code className="bg-slate-600 text-slate-100 px-1 py-0.5 rounded text-xs">{children}</code>
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
              
              {techLeadChatMutation.isPending && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3 max-w-[80%]">
                    <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white animate-pulse" />
                    </div>
                    <div className="bg-slate-700 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-xs text-slate-300">Mietin vastausta...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Example Questions */}
          <div className="border-t border-slate-600/50 pt-4 mb-4">
            <p className="text-sm font-medium mb-3 text-slate-200 flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400" />
              Esimerkkikysymykset:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {followUpSuggestions.map((suggestion, index) => (
                <PulseButton
                  key={index}
                  variant="outline"
                  size="sm"
                  pulse="subtle"
                  className="text-left h-auto py-3 px-4 justify-start text-slate-200 bg-slate-700/30 hover:bg-slate-600/50 border-slate-600 hover:border-blue-500 transition-all duration-200"
                  onClick={() => handleExampleClick(suggestion)}
                  loading={techLeadChatMutation.isPending}
                  data-testid={`tech-lead-example-${index}`}
                >
                  <span className="text-xs">{suggestion}</span>
                </PulseButton>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <div className="flex space-x-3">
            <Input
              type="text"
              placeholder="Kysy minulta mitä tahansa Tech Lead -roolista..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={techLeadChatMutation.isPending}
              className="flex-1 bg-slate-700 border-slate-600 focus:border-blue-500 text-slate-100 placeholder:text-slate-400"
              data-testid="tech-lead-chat-input"
            />
            <PulseButton
              onClick={handleSend}
              loading={techLeadChatMutation.isPending}
              disabled={!inputValue.trim()}
              pulse="subtle"
              className="px-4 bg-blue-600 hover:bg-blue-700"
              data-testid="tech-lead-send-button"
            >
              <Send className="h-4 w-4" />
            </PulseButton>
          </div>

          {/* Job Application Button */}
          <div className="mt-4 pt-4 border-t border-slate-600/50">
            <PulseButton
              onClick={() => setJobApplicationOpen(true)}
              variant="outline"
              className="w-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border-blue-500/50 text-white"
              pulse="subtle"
              data-testid="job-application-button"
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Työhakemus
            </PulseButton>
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
  const [activeView, setActiveView] = useState<'cases' | 'dashboard' | 'roadmap' | 'news'>('cases');

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
      <div className="flex flex-col lg:flex-row min-h-0 flex-1">
        {/* Left Panel - AI Assistant (35%) */}
        <div className="w-full lg:w-[35%] bg-slate-800 lg:border-r border-slate-700 flex flex-col min-h-0">
          <div className="px-4 sm:px-6 lg:px-6 py-4 lg:py-5 border-b border-slate-700">
            <div className="flex items-center space-x-3 mb-2">
              <Rocket className="h-5 w-5 lg:h-6 lg:w-6 text-blue-400" />
              <h2 className="text-lg lg:text-xl font-semibold text-white">Johdon Co-Pilot</h2>
            </div>
            <p className="text-slate-300 text-xs lg:text-sm">
              Proaktiivinen strateginen assistentti Hummin johdolle
            </p>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <ChatInterface />
          </div>
        </div>

        {/* Right Panel - Smart Content Switcher (65%) */}
        <div className="w-full lg:w-[65%] bg-slate-900 flex flex-col min-h-0 border-t lg:border-t-0 border-slate-700">
          <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6 bg-slate-800 border-b border-slate-700">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
              <div>
                <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-slate-700 border border-slate-600 mb-4 animate-in slide-in-from-top-4 duration-500 delay-200">
                    <TabsTrigger value="cases" className="data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm text-slate-300 data-[state=active]:text-white">
                      <Target className="h-4 w-4 mr-2" />
                      AI Cases
                    </TabsTrigger>
                    <TabsTrigger value="dashboard" className="data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm text-slate-300 data-[state=active]:text-white">
                      <Activity className="h-4 w-4 mr-2" />
                      Tech Lead
                    </TabsTrigger>
                    <TabsTrigger value="roadmap" className="data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm text-slate-300 data-[state=active]:text-white">
                      <Rocket className="h-4 w-4 mr-2" />
                      Roadmap
                    </TabsTrigger>
                    <TabsTrigger value="news" className="data-[state=active]:bg-slate-600 data-[state=active]:shadow-sm text-slate-300 data-[state=active]:text-white">
                      <Newspaper className="h-4 w-4 mr-2" />
                      AI News
                    </TabsTrigger>
                  </TabsList>

                  {/* Dynamic Header Content */}
                  {activeView === 'cases' ? (
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
                  ) : (
                    <div>
                      <h2 className="text-lg lg:text-xl font-semibold text-white">Roadmap → 10M€</h2>
                      <p className="text-slate-300 text-xs lg:text-sm mt-1">Pitkän aikavälin tavoite: liikevaihto 10 miljoonaa euroa</p>
                    </div>
                  )}
                </Tabs>
              </div>
              <div className="flex items-center space-x-2 lg:space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs lg:text-sm border-slate-600 hover:border-blue-400 hover:bg-blue-500/10 text-slate-300 hover:text-blue-400 px-2 lg:px-3"
                  onClick={() => setTechLeadModalOpen(true)}
                  data-testid="tech-lead-cta"
                >
                  <Users className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                  Tech Lead CV
                </Button>
                <Link href="/impact-analysis">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs lg:text-sm border-slate-600 hover:border-blue-400 hover:bg-blue-500/10 text-slate-300 hover:text-blue-400 px-2 lg:px-3"
                    data-testid="impact-analysis-cta-top"
                  >
                    <BarChart className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                    Vaikutusanalyysi
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Dynamic Content Area */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)} className="h-full">
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
                  <TechLeadDashboard />
                </div>
              </TabsContent>

              {/* Strategic Roadmap View */}
              <TabsContent value="roadmap" className="h-full mt-0 animate-in fade-in-0 duration-600 delay-200">
                <div className="h-full overflow-y-auto">
                  <StrategicRoadmap />
                </div>
              </TabsContent>

              {/* News Feed View */}
              <TabsContent value="news" className="h-full mt-0 animate-in fade-in-0 duration-600 delay-200">
                <div className="h-full overflow-y-auto">
                  <NewsFeed />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Tech Lead Modal */}
      <TechLeadModal 
        isOpen={techLeadModalOpen} 
        onClose={() => setTechLeadModalOpen(false)} 
      />
    </div>
  );
}
