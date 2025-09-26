import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { CaseCard } from "@/components/case-card";
import { ChatInterface } from "@/components/chat-interface";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Bot, Building, Rocket, Users, Mail, Phone, Linkedin } from "lucide-react";
import type { Case } from "@/lib/types";

export default function Home() {
  const [techLeadModalOpen, setTechLeadModalOpen] = useState(false);
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

            {/* Tech Lead CTA Section */}
            <div className="mt-12 mb-8">
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
                        <div className="text-sm opacity-90">Ota yhteyttä asiantuntijoihin</div>
                      </div>
                      <Users className="h-6 w-6" />
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-blue-700 dark:text-blue-300 flex items-center gap-3">
                      <Building className="h-6 w-6" />
                      Tech Lead ja humm group oy
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      Ota yhteyttä AI-asiantuntijoihimme ja keskustele projektin mahdollisuuksista
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="h-[60vh] pr-4">
                    <div className="space-y-6">
                      {/* Placeholder content - will be expanded later */}
                      <section>
                        <h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400 flex items-center gap-2">
                          <Rocket className="h-4 w-4" />
                          Miksi ottaa yhteyttä?
                        </h3>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <p className="mb-3">
                            <strong>humm group oy</strong> on suomalainen AI-teknologiayhtiö, joka auttaa yrityksiä hyödyntämään tekoälyä asiakaskokemuksen parantamisessa ja liiketoiminnan tehostamisessa.
                          </p>
                          <p className="mb-3">
                            Tarjoamme asiantuntevaa konsultointia, teknologiaratkaisuja ja strategista ohjausta AI-projektien suunnittelusta toteutukseen saakka.
                          </p>
                        </div>
                      </section>

                      <section>
                        <h3 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Palvelumme
                        </h3>
                        <div className="grid gap-3">
                          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">AI-strategia ja konsultointi</h4>
                            <p className="text-sm">Autamme määrittelemään AI:n potentiaalin yrityksessäsi ja luomaan toteutuskelpoisen roadmapin.</p>
                          </div>
                          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">Tekninen toteutus</h4>
                            <p className="text-sm">Kehitämme AI-ratkaisuja asiakaspalveluun, automaatioon ja liiketoiminnan optimointiin.</p>
                          </div>
                          <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                            <h4 className="font-semibold mb-2 text-purple-800 dark:text-purple-200">Integraatiot ja alustat</h4>
                            <p className="text-sm">Yhdistämme AI-ratkaisut olemassa oleviin järjestelmiisi saumattomasti.</p>
                          </div>
                        </div>
                      </section>

                      <section>
                        <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Yhteystiedot
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
                          <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">💡 Valmis aloittamaan?</h4>
                          <p className="text-sm mb-3">
                            Ota yhteyttä jo tänään ja keskustellaan, miten voimme auttaa yritystäsi hyödyntämään tekoälyä menestyksekkäästi.
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Tarjoamme ilmaisen konsultaation, jossa kartoitamme yrityksesi tarpeet ja AI:n potentiaalin.
                          </p>
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
