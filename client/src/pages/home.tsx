import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { PageHeader } from "@/components/page-header";
import { CaseCard } from "@/components/case-card";
import { ChatInterface } from "@/components/chat-interface";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Bot, Building, Rocket, Users, TrendingUp, BarChart } from "lucide-react";
import type { Case } from "@/lib/types";

export default function Home() {
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
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white font-sans min-h-screen">
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
        {/* Page Header - Full Width */}
        <div className="mb-8">
          <PageHeader />
        </div>

        {/* AI Assistant - Prominent Section */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">🤖 AI Assistentti</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Kysy mitä tahansa AI-asiakaspalvelusta. Saat räätälöityjä vastauksia Humm Group Oy:n johdolle 
              ja asiakaspalvelualan ammattilaisille.
            </p>
          </div>
          <ChatInterface />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-1">
            {/* CTA Section - Tech Lead and Impact Analysis */}
            <div className="mb-8 grid grid-cols-1 gap-4">
              {/* Tech Lead CTA */}
              <Link href="/tech-lead-cv">
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
              </Link>
              
              {/* Impact Analysis CTA */}
              <Link href="/impact-analysis">
                <Button 
                  size="lg"
                  className="w-full h-16 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 hover:from-slate-700 hover:via-slate-800 hover:to-slate-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group"
                  data-testid="impact-analysis-cta-top"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="flex items-center justify-center space-x-3 relative z-10">
                    <TrendingUp className="h-6 w-6" />
                    <div className="text-center">
                      <div className="text-lg font-bold">📈 AI-projektin vaikutus</div>
                      <div className="text-sm opacity-90">Tehokkuuteen ja säästöihin</div>
                    </div>
                    <BarChart className="h-6 w-6" />
                  </div>
                </Button>
              </Link>
            </div>
          </div>

          {/* Case Studies Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">📚 Onnistuneet AI-toteutukset</h3>
              <p className="text-gray-300 text-sm">
                Tutustu kuuteen onnistuneeseen AI-asiakaspalveluprojektiin
              </p>
            </div>
            
            {/* Case Cards Grid */}
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse" data-testid={`skeleton-card-${i}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-muted rounded"></div>
                          <div>
                            <div className="h-4 bg-muted rounded w-24 mb-1"></div>
                            <div className="h-3 bg-muted rounded w-16"></div>
                          </div>
                        </div>
                        <div className="h-4 bg-muted rounded w-16"></div>
                      </div>
                      <div className="space-y-1">
                        <div className="h-3 bg-muted rounded w-full"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : cases?.length ? (
              <div className="space-y-4 max-h-96 overflow-y-auto" data-testid="cases-grid">
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
            <div className="mt-8">
              <Link href="/impact-analysis">
                <Button 
                  size="lg"
                  className="w-full h-14 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 hover:from-slate-700 hover:via-slate-800 hover:to-slate-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group"
                  data-testid="impact-analysis-cta"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="flex items-center justify-center space-x-3 relative z-10">
                    <TrendingUp className="h-5 w-5" />
                    <div className="text-center">
                      <div className="text-base font-bold">📈 AI-projektin vaikutusanalyysi</div>
                      <div className="text-xs opacity-90">Tehokkuuteen ja säästöihin</div>
                    </div>
                    <BarChart className="h-5 w-5" />
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
