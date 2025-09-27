import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { PageHeader } from "@/components/page-header";
import { CaseCard } from "@/components/case-card";
import { ChatInterface } from "@/components/chat-interface";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
    <div className="bg-white text-gray-900 font-sans min-h-screen flex flex-col">
      {/* Clean Header */}
      <header className="bg-white/95 border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm flex-shrink-0">
        <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                  <Bot className="text-white h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <div>
                  <h1 className="text-xl lg:text-2xl font-semibold text-gray-900" data-testid="header-title">humm.fi</h1>
                  <p className="text-xs lg:text-sm text-gray-500">AI Asiakaspalvelu Showcase</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 lg:space-x-6">
              <div className="text-xs lg:text-sm text-gray-500 flex items-center space-x-2">
                <Building className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline">Sisäinen käyttö</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dual-Pane Layout - Responsive */}
      <div className="flex flex-col lg:flex-row min-h-0 flex-1">
        {/* Left Panel - AI Assistant */}
        <div className="w-full lg:w-1/2 bg-white lg:border-r border-gray-100 flex flex-col min-h-0">
          <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6 border-b border-gray-50">
            <div className="flex items-center space-x-3 mb-2">
              <Bot className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900">AI Assistentti</h2>
            </div>
            <p className="text-gray-600 text-xs lg:text-sm">
              Räätälöidyt vastaukset Humm Group Oy:n johdolle
            </p>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <ChatInterface />
          </div>
        </div>

        {/* Right Panel - Case Explorer */}
        <div className="w-full lg:w-1/2 bg-gray-50 flex flex-col min-h-0 border-t lg:border-t-0 border-gray-100">
          <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6 bg-white border-b border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
              <div>
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Onnistuneet AI-caset</h2>
                <p className="text-gray-600 text-xs lg:text-sm mt-1">Asiakaspalvelussa parannettu kokemus ja tehokkuus</p>
              </div>
              <div className="flex items-center space-x-2 lg:space-x-4">
                <Link href="/tech-lead-cv">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-xs lg:text-sm border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-2 lg:px-3"
                    data-testid="tech-lead-cta"
                  >
                    <Users className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                    Tech Lead
                  </Button>
                </Link>
                <Link href="/impact-analysis">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-xs lg:text-sm border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-2 lg:px-3"
                    data-testid="impact-analysis-cta-top"
                  >
                    <BarChart className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                    Vaikutusanalyysi
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Case Content Area */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-4 lg:space-y-6">
          {/* Case Cards Grid */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200" data-testid={`skeleton-card-${i}`}>
                  <CardContent className="p-6 animate-in fade-in-0 duration-300" style={{ animationDelay: `${i * 150}ms` }}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="w-12 h-12 rounded-lg" />
                        <div>
                          <Skeleton className="h-6 w-32 mb-2" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <div className="mb-4">
                      <Skeleton className="h-4 w-40 mb-2" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="text-center p-3">
                          <Skeleton className="h-6 w-12 mx-auto mb-1 rounded" />
                          <Skeleton className="h-3 w-16 mx-auto rounded" />
                        </div>
                      ))}
                    </div>
                    <div className="mb-4">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <div className="space-y-1">
                        {[...Array(3)].map((_, k) => (
                          <Skeleton key={k} className="h-3 w-full" />
                        ))}
                      </div>
                    </div>
                    <Skeleton className="h-10 w-full rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : cases?.length ? (
            <div className="space-y-4" data-testid="cases-grid">
              {cases.map((case_, index) => (
                <div
                  key={case_.id}
                  className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CaseCard case_={case_} />
                </div>
              ))}
            </div>
          ) : (
            <Card data-testid="no-cases" className="bg-white shadow-sm border border-gray-100">
              <CardContent className="pt-6 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ei caseja saatavilla</h3>
                <p className="text-gray-600">
                  Caseja ei löytynyt tai ne ovat väliaikaisesti poissa käytöstä.
                </p>
              </CardContent>
            </Card>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
