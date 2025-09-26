import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { CaseCard } from "@/components/case-card";
import { ChatInterface } from "@/components/chat-interface";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Bot, Building, Rocket, Users, Mail, Phone, Linkedin, TrendingUp, BarChart, Target, CheckCircle, Zap, Clock, PiggyBank, Headphones, Wrench, LineChart, Heart, MessageSquare, Brain, Star, ShoppingBag, Shield, Award } from "lucide-react";
import type { Case } from "@/lib/types";

export default function Home() {
  const [techLeadModalOpen, setTechLeadModalOpen] = useState(false);
  const [impactModalOpen, setImpactModalOpen] = useState(false);
  const { data: cases, isLoading, error } = useQuery<Case[]>({
    queryKey: ["/api/cases"],
  });

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
    <div className="bg-background text-foreground font-sans">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-card/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Bot className="text-primary-foreground h-4 w-4" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground" data-testid="header-title">humm.fi</h1>
                  <p className="text-xs text-muted-foreground">AI Asiakaspalvelu Showcase</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground flex items-center space-x-2">
                <Building className="h-4 w-4" />
                <span>Sisäinen käyttö</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <PageHeader />

            {/* Tech Lead CTA Section */}
            <div className="mb-8">
              <Dialog open={techLeadModalOpen} onOpenChange={setTechLeadModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg"
                    className="w-full h-16 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 hover:from-slate-700 hover:via-slate-800 hover:to-slate-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group"
                    data-testid="tech-lead-cta"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-center justify-center space-x-3 relative z-10">
                      <Rocket className="h-6 w-6" />
                      <div className="text-center">
                        <div className="text-lg font-bold">🚀 Tech Lead ja humm group oy</div>
                        <div className="text-sm opacity-90">Minun visio roolista</div>
                      </div>
                      <Users className="h-6 w-6" />
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-blue-700 dark:text-blue-300 flex items-center gap-3">
                      <Building className="h-6 w-6" />
                      Tech Lead ja humm group oy - Minun visio roolista
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      Työhakemus ja visioni siitä, kuinka Tech Lead -roolia tulisi hoitaa
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="h-[60vh] pr-4">
                    <div className="space-y-6">
                      <section>
                        <h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400 flex items-center gap-2">
                          <Rocket className="h-4 w-4" />
                          Miksi hakea Tech Lead -roolia?
                        </h3>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <p className="mb-3">
                            Haluan tuoda <strong>humm group oy:lle</strong> teknistä johtajuutta ja visiota, joka yhdistää AI-teknologian liiketoimintatavoitteisiin. Minun näkemykseni Tech Lead -roolista on holistinen lähestymistapa teknologiajohtajuuteen.
                          </p>
                          <p className="mb-3">
                            Uskon, että tehokas Tech Lead ei ainoastaan hallitse teknologiaa, vaan toimii siltana liiketoiminnan ja teknisen toteutuksen välillä.
                          </p>
                        </div>
                      </section>

                      <section>
                        <h3 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Visioni roolista
                        </h3>
                        <div className="grid gap-3">
                          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">Strateginen teknologiajohtajuus</h4>
                            <p className="text-sm">Yhdistän teknisen osaamisen liiketoimintaymmärrykseen ja luon selkeät roadmapit AI-toteutuksille.</p>
                          </div>
                          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">Tiimin kehittäminen</h4>
                            <p className="text-sm">Rakennan vahvoja kehitystiimejä, menton kulttuuria ja varmistan teknisen laadun kaikissa projekteissa.</p>
                          </div>
                          <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                            <h4 className="font-semibold mb-2 text-purple-800 dark:text-purple-200">Arkkitehtuuri ja skaalautuvuus</h4>
                            <p className="text-sm">Suunnittelen ja toteutan skaalautuvia AI-arkkitehtuureja, jotka kasvavat yrityksen mukana.</p>
                          </div>
                        </div>
                      </section>

                      <section>
                        <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Ota yhteyttä
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Mail className="h-4 w-4 text-blue-600" />
                              <span className="text-sm">info@humm.fi</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Phone className="h-4 w-4 text-green-600" />
                              <span className="text-sm">+358 XX XXX XXXX</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Linkedin className="h-4 w-4 text-blue-700" />
                              <span className="text-sm">LinkedIn: /company/humm-group</span>
                            </div>
                          </div>
                        </div>
                      </section>

                      <section>
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                          <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">💡 Valmis rakentamaan tulevaisuutta?</h4>
                          <p className="text-sm mb-3">
                            Ota yhteyttä ja keskustellaan, miten voin auttaa humm group oy:tä saavuttamaan seuraavan tason AI-teknologiajohtajuudessa.
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Tarjoan visionäärisen lähestymistavan teknologiajohtajuuteen ja intohimoa rakentaa tulevaisuuden AI-ratkaisuja.
                          </p>
                        </div>
                      </section>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>

            {/* Case Cards Grid */}
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse" data-testid={`skeleton-card-${i}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-muted rounded-lg"></div>
                          <div>
                            <div className="h-6 bg-muted rounded w-32 mb-2"></div>
                            <div className="h-4 bg-muted rounded w-24"></div>
                          </div>
                        </div>
                        <div className="h-6 bg-muted rounded w-20"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : cases?.length ? (
              <div className="space-y-6" data-testid="cases-grid">
                {cases.map((case_) => (
                  <CaseCard key={case_.id} case_={case_} />
                ))}
              </div>
            ) : (
              <Card data-testid="no-cases">
                <CardContent className="pt-6 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Ei caseja saatavilla</h3>
                  <p className="text-muted-foreground">
                    Caseja ei löytynyt tai ne ovat väliaikaisesti poissa käytöstä.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* AI Project Impact Analysis Section */}
            <div className="mt-12 mb-8">
              <Dialog open={impactModalOpen} onOpenChange={setImpactModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg"
                    className="w-full h-16 bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 hover:from-slate-700 hover:via-blue-700 hover:to-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group"
                    data-testid="impact-analysis-cta"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-center justify-center space-x-3 relative z-10">
                      <TrendingUp className="h-6 w-6" />
                      <div className="text-center">
                        <div className="text-lg font-bold">📈 Humm group oy onnistuneen AI-projektin vaikutus</div>
                        <div className="text-sm opacity-90">Tehokkuuteen ja säästöihin</div>
                      </div>
                      <BarChart className="h-6 w-6" />
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-green-700 dark:text-green-300 flex items-center gap-3">
                      <TrendingUp className="h-6 w-6" />
                      Onnistuneen AI-projektin vaikutus tehokkuuteen ja säästöihin
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      Kattava analyysi todellisista liiketoimintahyödyistä ja mitattavista tuloksista
                    </DialogDescription>
                  </DialogHeader>
                  <div className="h-[75vh] flex flex-col">
                    {/* Modern Header */}
                    <div className="bg-slate-800 text-white p-6 rounded-t-lg mb-6">
                      <h1 className="text-3xl font-bold mb-2">Tekoälyn käyttöönoton vaikutus</h1>
                      <p className="text-slate-200 text-lg">Arvioitu parannus suorituskyvyssä ja kilpailuasemassa</p>
                    </div>

                    <ScrollArea className="flex-1 px-4">
                      <div className="space-y-6">
                        {/* Financial Impact Chart Placeholder */}
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                          <h3 className="text-xl font-semibold text-center mb-4 text-slate-800 dark:text-slate-200">
                            Arvioitu taloudellinen vaikutus 3 vuoden aikana
                          </h3>
                          <div className="h-32 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-lg flex items-center justify-center">
                            <div className="text-center text-slate-600 dark:text-slate-400">
                              <BarChart className="h-12 w-12 mx-auto mb-2" />
                              <p className="text-sm">Liikevaihdon kasvu, kustannussäästöt ja kannattavuuden parannus</p>
                            </div>
                          </div>
                        </div>

                        {/* Impact Grid - 2x2 Layout */}
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Operational Efficiency Card */}
                          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700 flex flex-col h-full">
                            <div className="flex items-center mb-4">
                              <div className="w-12 h-12 bg-slate-800 bg-opacity-10 dark:bg-slate-600 rounded-full flex items-center justify-center mr-4">
                                <Zap className="h-6 w-6 text-slate-800 dark:text-slate-200" />
                              </div>
                              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Operatiivinen tehokkuus</h3>
                            </div>
                            <div className="flex-1">
                              <ul className="space-y-3 mb-4">
                                <li className="flex items-start">
                                  <TrendingUp className="h-5 w-5 text-slate-600 dark:text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
                                  <span className="text-slate-700 dark:text-slate-300">Prosessien automaatio</span>
                                </li>
                                <li className="flex items-start">
                                  <Clock className="h-5 w-5 text-slate-600 dark:text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
                                  <span className="text-slate-700 dark:text-slate-300">Vastausaikojen lyhentyminen</span>
                                </li>
                                <li className="flex items-start">
                                  <Users className="h-5 w-5 text-slate-600 dark:text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
                                  <span className="text-slate-700 dark:text-slate-300">Resurssien optimointi</span>
                                </li>
                              </ul>
                              <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">+25-30% tehokkuuden parannus</div>
                            </div>
                          </div>

                          {/* Cost Reduction Card */}
                          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700 flex flex-col h-full">
                            <div className="flex items-center mb-4">
                              <div className="w-12 h-12 bg-slate-800 bg-opacity-10 dark:bg-slate-600 rounded-full flex items-center justify-center mr-4">
                                <PiggyBank className="h-6 w-6 text-slate-800 dark:text-slate-200" />
                              </div>
                              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Kustannussäästöt</h3>
                            </div>
                            <div className="flex-1">
                              <ul className="space-y-3 mb-4">
                                <li className="flex items-start">
                                  <Headphones className="h-5 w-5 text-slate-600 dark:text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
                                  <span className="text-slate-700 dark:text-slate-300">Asiakaspalvelukustannusten alennus</span>
                                </li>
                                <li className="flex items-start">
                                  <Wrench className="h-5 w-5 text-slate-600 dark:text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
                                  <span className="text-slate-700 dark:text-slate-300">Manuaalisen työn väheneminen</span>
                                </li>
                                <li className="flex items-start">
                                  <LineChart className="h-5 w-5 text-slate-600 dark:text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
                                  <span className="text-slate-700 dark:text-slate-300">Parempi resurssisuunnittelu</span>
                                </li>
                              </ul>
                              <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">15-20% kustannussäästö</div>
                            </div>
                          </div>

                          {/* Customer Experience Card */}
                          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700 flex flex-col h-full">
                            <div className="flex items-center mb-4">
                              <div className="w-12 h-12 bg-slate-800 bg-opacity-10 dark:bg-slate-600 rounded-full flex items-center justify-center mr-4">
                                <Heart className="h-6 w-6 text-slate-800 dark:text-slate-200" />
                              </div>
                              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Asiakaskokemus</h3>
                            </div>
                            <div className="flex-1">
                              <ul className="space-y-3 mb-4">
                                <li className="flex items-start">
                                  <MessageSquare className="h-5 w-5 text-slate-600 dark:text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
                                  <span className="text-slate-700 dark:text-slate-300">24/7 AI-tuki</span>
                                </li>
                                <li className="flex items-start">
                                  <Brain className="h-5 w-5 text-slate-600 dark:text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
                                  <span className="text-slate-700 dark:text-slate-300">Personoitu vuorovaikutus</span>
                                </li>
                                <li className="flex items-start">
                                  <Star className="h-5 w-5 text-slate-600 dark:text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
                                  <span className="text-slate-700 dark:text-slate-300">Ennakoiva palvelu</span>
                                </li>
                              </ul>
                              <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">+35-40% tyytyväisyys</div>
                            </div>
                          </div>

                          {/* Revenue Growth Card */}
                          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700 flex flex-col h-full">
                            <div className="flex items-center mb-4">
                              <div className="w-12 h-12 bg-slate-800 bg-opacity-10 dark:bg-slate-600 rounded-full flex items-center justify-center mr-4">
                                <TrendingUp className="h-6 w-6 text-slate-800 dark:text-slate-200" />
                              </div>
                              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Liikevaihdon kasvu</h3>
                            </div>
                            <div className="flex-1">
                              <ul className="space-y-3 mb-4">
                                <li className="flex items-start">
                                  <ShoppingBag className="h-5 w-5 text-slate-600 dark:text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
                                  <span className="text-slate-700 dark:text-slate-300">Uudet AI-palvelut</span>
                                </li>
                                <li className="flex items-start">
                                  <Shield className="h-5 w-5 text-slate-600 dark:text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
                                  <span className="text-slate-700 dark:text-slate-300">Asiakassäilyvyyden parannus</span>
                                </li>
                                <li className="flex items-start">
                                  <Award className="h-5 w-5 text-slate-600 dark:text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
                                  <span className="text-slate-700 dark:text-slate-300">Kilpailuedun saavuttaminen</span>
                                </li>
                              </ul>
                              <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">+20-25% liikevaihdon kasvu</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-1">
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
}
