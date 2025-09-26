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
                    className="w-full h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 hover:from-blue-700 hover:via-purple-700 hover:to-blue-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group"
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
                    className="w-full h-16 bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 hover:from-green-700 hover:via-teal-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group"
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
                </DialogContent>
              </Dialog>
            </div>

                      {/* Opetukset */}
                      <section>
                        <h3 className="text-lg font-semibold mb-4 text-orange-600 dark:text-orange-400 flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Keskeiset opetukset ja suositukset
                        </h3>
                        <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2 text-orange-800 dark:text-orange-200">✅ Onnistumistekijät</h4>
                              <ul className="text-sm space-y-1 text-orange-700 dark:text-orange-300">
                                <li>• Vaiheittainen käyttöönotto minimoi riskejä</li>
                                <li>• Henkilöstön koulutus AI-työkalujen käyttöön</li>
                                <li>• Jatkuva datan laadun monitorointi</li>
                                <li>• Asiakaspalaute ohjasi kehitystä</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2 text-orange-800 dark:text-orange-200">⚠️ Huomioonotettavaa</h4>
                              <ul className="text-sm space-y-1 text-orange-700 dark:text-orange-300">
                                <li>• Aluksi asiakkaat skeptisiä AI-palvelua kohtaan</li>
                                <li>• Kompleksiset tapaukset vaativat edelleen ihmistä</li>
                                <li>• Mallin suorituskyky riippuu datan laadusta</li>
                                <li>• Säännöllinen uudelleenkoulutus tarpeen</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Humm Group Oy Yksityiskohtainen Analyysi */}
                      <section>
                        <h3 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400 flex items-center gap-2">
                          <Building className="h-5 w-5" />
                          Humm Group Oy - Nykytila ja Potentiaali
                        </h3>
                        
                        {/* Yrityksen perustiedot */}
                        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
                          <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">🏢 Yrityksen perustiedot</h4>
                          <div className="grid md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">€2.1M</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Liikevaihto</p>
                            </div>
                            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">52</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Henkilöstömäärä</p>
                            </div>
                            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">-0.2%</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Liiketulos-%</p>
                            </div>
                            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                              <p className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-1">CX</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Konsultointi</p>
                            </div>
                          </div>
                          <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                            <strong>Päätoiminta:</strong> Asiakaskokemuksen konsultointi ja suunnittelu sekä asiakaspalvelun ja myynnin ulkoistuspalvelut
                          </p>
                        </div>

                        {/* Kilpailija-analyysi */}
                        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                          <h4 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-200">🏆 Vertailuyritykset</h4>
                          <div className="space-y-4">
                            <div className="grid md:grid-cols-3 gap-4">
                              <div className="bg-white dark:bg-blue-900 rounded-lg p-4 border">
                                <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Epassi Group</h5>
                                <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Liikevaihto: ~€150M</p>
                                <p className="text-xs text-blue-500 dark:text-blue-400">Kehittynyt automaatio ja mobiilisovellus</p>
                              </div>
                              <div className="bg-white dark:bg-blue-900 rounded-lg p-4 border">
                                <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Accountor Group</h5>
                                <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Liikevaihto: ~€300M</p>
                                <p className="text-xs text-blue-500 dark:text-blue-400">Tekoälysovellukset HR-palveluissa</p>
                              </div>
                              <div className="bg-white dark:bg-blue-900 rounded-lg p-4 border">
                                <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Administer Oyj</h5>
                                <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Liikevaihto: ~€50M</p>
                                <p className="text-xs text-blue-500 dark:text-blue-400">Kehittyneet asiakaspalvelujärjestelmät</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Arvioitu parannus tekoälyllä */}
                        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
                          <h4 className="text-lg font-semibold mb-4 text-green-800 dark:text-green-200">📈 Arvioitu parannus tekoälyllä</h4>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="font-semibold text-green-700 dark:text-green-300 mb-3">🚀 Operatiivinen tehokkuus</h5>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Parannus:</span>
                                  <span className="font-bold text-green-600">15-25%</span>
                                </div>
                                <div className="text-xs text-green-600 dark:text-green-400">
                                  • 30-40% rutiinitehtävien automaatio<br/>
                                  • 50% yksinkertaisten kyselyjen käsittely chatboteilla<br/>
                                  • Älykkäät reititysjärjestelmät
                                </div>
                              </div>
                            </div>
                            <div>
                              <h5 className="font-semibold text-green-700 dark:text-green-300 mb-3">😊 Asiakastyytyväisyys</h5>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Parannus:</span>
                                  <span className="font-bold text-green-600">20-30%</span>
                                </div>
                                <div className="text-xs text-green-600 dark:text-green-400">
                                  • 24/7 saatavuus<br/>
                                  • Personoitu palvelu<br/>
                                  • Ennakoiva ongelmanratkaisu
                                </div>
                              </div>
                            </div>
                            <div>
                              <h5 className="font-semibold text-green-700 dark:text-green-300 mb-3">💰 Liikevaihdon kasvu</h5>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Arvioitu kasvu:</span>
                                  <span className="font-bold text-green-600">10-15%</span>
                                </div>
                                <div className="text-xs text-green-600 dark:text-green-400">
                                  • Uudet tekoälypohjaiset palvelut<br/>
                                  • Parempi asiakassäilyvyys<br/>
                                  • Markkina-aseman vahvistaminen
                                </div>
                              </div>
                            </div>
                            <div>
                              <h5 className="font-semibold text-green-700 dark:text-green-300 mb-3">📊 Kannattavuus</h5>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Parannus:</span>
                                  <span className="font-bold text-green-600">3-5pp</span>
                                </div>
                                <div className="text-xs text-green-600 dark:text-green-400">
                                  • Henkilöstökustannusten aleneminen<br/>
                                  • Skaalautuvuuden parantuminen<br/>
                                  • Virheiden vähentyminen
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Vertailutaulukko */}
                        <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-6 mb-6">
                          <h4 className="text-lg font-semibold mb-4 text-purple-800 dark:text-purple-200">📋 Vertailu kilpailijoiden kanssa</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-purple-200 dark:border-purple-700">
                                  <th className="text-left p-2 text-purple-700 dark:text-purple-300">Mittari</th>
                                  <th className="text-left p-2 text-purple-700 dark:text-purple-300">Humm Group (nyk.)</th>
                                  <th className="text-left p-2 text-purple-700 dark:text-purple-300">Epassi</th>
                                  <th className="text-left p-2 text-purple-700 dark:text-purple-300">Accountor</th>
                                  <th className="text-left p-2 text-purple-700 dark:text-purple-300">Humm (arvio AI:n jälk.)</th>
                                </tr>
                              </thead>
                              <tbody className="text-purple-600 dark:text-purple-400">
                                <tr className="border-b border-purple-100 dark:border-purple-800">
                                  <td className="p-2 font-medium">Liikevaihdon kasvu</td>
                                  <td className="p-2 text-red-600">-7.7%</td>
                                  <td className="p-2 text-green-600">+15%</td>
                                  <td className="p-2 text-green-600">+10%</td>
                                  <td className="p-2 text-green-600 font-bold">+10-15%</td>
                                </tr>
                                <tr className="border-b border-purple-100 dark:border-purple-800">
                                  <td className="p-2 font-medium">Liiketulos-%</td>
                                  <td className="p-2 text-red-600">-0.2%</td>
                                  <td className="p-2 text-green-600">+8%</td>
                                  <td className="p-2 text-green-600">+6%</td>
                                  <td className="p-2 text-green-600 font-bold">+3-5%</td>
                                </tr>
                                <tr className="border-b border-purple-100 dark:border-purple-800">
                                  <td className="p-2 font-medium">Teknologia</td>
                                  <td className="p-2">Perustaso</td>
                                  <td className="p-2 text-green-600">Kehittynyt</td>
                                  <td className="p-2 text-green-600">Kehittynyt</td>
                                  <td className="p-2 text-green-600 font-bold">Kehittynyt</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Riskit ja suositukset */}
                        <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
                          <h4 className="text-lg font-semibold mb-4 text-yellow-800 dark:text-yellow-200">⚠️ Riskit ja suositukset</h4>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-3">🚨 Keskeiset riskit</h5>
                              <ul className="text-sm space-y-2 text-yellow-600 dark:text-yellow-400">
                                <li>• <strong>Toteutusriski:</strong> Huono suunnittelu voi johtaa kustannusten kasvuun</li>
                                <li>• <strong>Muutosvastarinta:</strong> Henkilöstön ja asiakkaiden sopeutuminen</li>
                                <li>• <strong>Teknologiariski:</strong> Nopea kehitys voi vanhentaa ratkaisuja</li>
                                <li>• <strong>Regulaatioriskit:</strong> Tietosuoja ja AI-säädökset</li>
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-3">💡 Välittömät toimenpiteet</h5>
                              <ul className="text-sm space-y-2 text-yellow-600 dark:text-yellow-400">
                                <li>• <strong>Tech Lead rekrytointi:</strong> AI-osaamisen vahvistaminen</li>
                                <li>• <strong>Virtuaaliavustajan laajennus:</strong> Kaikkiin kanaviin</li>
                                <li>• <strong>Analytiikkapalvelut:</strong> Tekoälypohjaisten palveluiden kehitys</li>
                                <li>• <strong>Henkilöstökoulutus:</strong> AI-työkalujen käyttöönotto</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Yhteenveto */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                          <h4 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-200">🎯 Yhteenveto ja potentiaali</h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                            Tekoälyn käyttöönotolla on <strong>merkittävä potentiaali</strong> parantaa Humm Group Oy:n 
                            operatiivista tehokkuutta, asiakastyytyväisyyttä ja kannattavuutta. Vertailu kilpailijoiden 
                            kanssa osoittaa, että tekoäly on <strong>avainasemassa</strong> menestyksessä.
                          </p>
                          <div className="grid md:grid-cols-3 gap-4 mt-4">
                            <div className="text-center bg-white dark:bg-blue-900 rounded-lg p-4 border">
                              <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-1">3-5pp</p>
                              <p className="text-xs text-blue-500 dark:text-blue-400">Kannattavuuden parannus</p>
                            </div>
                            <div className="text-center bg-white dark:bg-blue-900 rounded-lg p-4 border">
                              <p className="text-xl font-bold text-green-600 dark:text-green-400 mb-1">10-15%</p>
                              <p className="text-xs text-green-500 dark:text-green-400">Liikevaihdon kasvu</p>
                            </div>
                            <div className="text-center bg-white dark:bg-blue-900 rounded-lg p-4 border">
                              <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-1">2-3v</p>
                              <p className="text-xs text-purple-500 dark:text-purple-400">Tavoitteiden aikajänne</p>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Call to action */}
                      <section>
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                          <h4 className="text-xl font-bold mb-3 text-green-800 dark:text-green-200">🚀 Valmis aloittamaan oman AI-projektisi?</h4>
                          <p className="mb-4 text-green-700 dark:text-green-300">
                            Saavuta vastaavat tulokset omassa organisaatiossasi. Tutustu case-esimerkkeihin ja ota yhteyttä asiantuntijoihimme!
                          </p>
                          <div className="flex justify-center gap-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-green-700 dark:text-green-300">€2.4M+</p>
                              <p className="text-xs text-green-600 dark:text-green-400">Vuosittaiset säästöt</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">85%</p>
                              <p className="text-xs text-blue-600 dark:text-blue-400">Automaatioaste</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">+18pp</p>
                              <p className="text-xs text-purple-600 dark:text-purple-400">CSAT parannus</p>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </ScrollArea>
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
