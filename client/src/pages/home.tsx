import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { PageHeader } from "@/components/page-header";
import { CaseCard } from "@/components/case-card";
import { ChatInterface } from "@/components/chat-interface";
import { TechLeadModal } from "@/components/tech-lead-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PulseButton } from "@/components/ui/pulse-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { AlertCircle, Bot, Building, Rocket, Users, TrendingUp, BarChart, User, Send, Star, Target, Briefcase, Code } from "lucide-react";
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

export default function Home() {
    "Kerro taustastasi ja osaamisestasi",
    "Mikä on ydinosaamistasi?",
    "Miksi juuri sinut?"
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
        message: "Tervehdi käyttäjää AI-Panuna ja esittäydy lyhyesti Humm Group Oy:n Tech Lead -hakijana. Kerro että olet tutustunut heidän toimintaansa ja olet valmis vastaamaan kysymyksiin."
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
                    <div className={`${message.isUser ? 'bg-blue-600 text-white' : 'bg-slate-700/50 text-slate-100'} rounded-lg p-3`}>
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
                    <div className="bg-slate-700/50 rounded-lg p-3">
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
              className="flex-1 bg-slate-700/50 border-slate-600 focus:border-blue-500 text-slate-100 placeholder:text-slate-400"
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
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Home() {
  const { data: cases, isLoading, error } = useQuery<Case[]>({
    queryKey: ["/api/cases"],
  });
  const [techLeadModalOpen, setTechLeadModalOpen] = useState(false);

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
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white font-sans min-h-screen flex flex-col">
      {/* Netflix-style Header */}
      <header className="bg-slate-900/90 border-b border-slate-700/50 sticky top-0 z-50 backdrop-blur-md flex-shrink-0 animate-in fade-in-0 duration-700">
        <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="flex items-center space-x-3 lg:space-x-4 animate-in slide-in-from-left-4 duration-500">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                  <Bot className="text-white h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-white animate-in slide-in-from-left-2 duration-600 delay-100" data-testid="header-title">humm.fi</h1>
                  <p className="text-xs lg:text-sm text-slate-300 animate-in slide-in-from-left-2 duration-600 delay-200">AI Asiakaspalvelu Showcase</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 lg:space-x-6 animate-in slide-in-from-right-4 duration-500 delay-300">
              <div className="text-xs lg:text-sm text-slate-300 flex items-center space-x-2">
                <Building className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline">Sisäinen käyttö</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Netflix-style Split Layout */}
      <div className="flex flex-col lg:flex-row min-h-0 flex-1">
        {/* Left Panel - AI Assistant (35%) */}
        <div className="w-full lg:w-[35%] bg-slate-800/50 lg:border-r border-slate-700/50 flex flex-col min-h-0 backdrop-blur-sm animate-in slide-in-from-left-6 duration-700 delay-400">
          <div className="px-4 sm:px-6 lg:px-6 py-4 lg:py-5 border-b border-slate-700/50">
            <div className="flex items-center space-x-3 mb-2 animate-in fade-in-0 duration-600 delay-500">
              <Bot className="h-5 w-5 lg:h-6 lg:w-6 text-blue-400 animate-pulse" />
              <h2 className="text-lg lg:text-xl font-bold text-white">AI Assistentti</h2>
            </div>
            <p className="text-slate-300 text-xs lg:text-sm animate-in fade-in-0 duration-600 delay-600">
              🤖 Räätälöidyt vastaukset johdolle
            </p>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden animate-in fade-in-0 duration-800 delay-700">
            <ChatInterface />
          </div>
        </div>

        {/* Right Panel - Case Explorer (65%) */}
        <div className="w-full lg:w-[65%] bg-slate-900/30 flex flex-col min-h-0 border-t lg:border-t-0 border-slate-700/50 animate-in slide-in-from-right-6 duration-700 delay-500">
          <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6 bg-slate-800/40 border-b border-slate-700/50 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
              <div className="animate-in fade-in-0 duration-600 delay-600">
                <h2 className="text-lg lg:text-xl font-bold text-white">🎯 Onnistuneet AI-caset</h2>
                <p className="text-slate-300 text-xs lg:text-sm mt-1">Asiakaspalvelussa parannettu kokemus ja tehokkuus</p>
              </div>
              <div className="flex items-center space-x-2 lg:space-x-4 animate-in slide-in-from-right-4 duration-600 delay-700">
                <Button 
                  variant="outline"
                  size="sm"
                  className="text-xs lg:text-sm border-slate-600 hover:border-slate-500 hover:bg-slate-700/50 text-slate-200 hover:text-white px-2 lg:px-3 transition-all duration-200 hover:scale-105"
                  onClick={() => setTechLeadModalOpen(true)}
                  data-testid="tech-lead-cta"
                >
                  <Users className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                  Tech Lead
                </Button>
                <Link href="/impact-analysis">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-xs lg:text-sm border-slate-600 hover:border-slate-500 hover:bg-slate-700/50 text-slate-200 hover:text-white px-2 lg:px-3 transition-all duration-200 hover:scale-105"
                    data-testid="impact-analysis-cta-top"
                  >
                    <BarChart className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                    Vaikutusanalyysi
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Case Content Area - Netflix style */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-4 lg:space-y-6 bg-gradient-to-b from-slate-900/40 to-slate-900/60">
          {/* Case Cards Grid - Netflix Style */}
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-slate-800/30 border border-slate-600/50 hover:border-slate-500/50 hover:bg-slate-800/50 transition-all duration-300 backdrop-blur-sm" data-testid={`skeleton-card-${i}`}>
                  <CardContent className="p-6 animate-in fade-in-0 duration-300" style={{ animationDelay: `${i * 150}ms` }}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="w-12 h-12 rounded-lg bg-slate-700/50" />
                        <div>
                          <Skeleton className="h-6 w-32 mb-2 bg-slate-700/50" />
                          <Skeleton className="h-4 w-24 bg-slate-700/50" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-20 rounded-full bg-slate-700/50" />
                    </div>
                    <div className="mb-4">
                      <Skeleton className="h-4 w-40 mb-2 bg-slate-700/50" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full bg-slate-700/50" />
                        <Skeleton className="h-4 w-3/4 bg-slate-700/50" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="text-center p-3">
                          <Skeleton className="h-6 w-12 mx-auto mb-1 rounded bg-slate-700/50" />
                          <Skeleton className="h-3 w-16 mx-auto rounded bg-slate-700/50" />
                        </div>
                      ))}
                    </div>
                    <div className="mb-4">
                      <Skeleton className="h-4 w-32 mb-2 bg-slate-700/50" />
                      <div className="space-y-1">
                        {[...Array(3)].map((_, k) => (
                          <Skeleton key={k} className="h-3 w-full bg-slate-700/50" />
                        ))}
                      </div>
                    </div>
                    <Skeleton className="h-10 w-full rounded bg-slate-700/50" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : cases?.length ? (
            <div className="space-y-6" data-testid="cases-grid">
              {cases.map((case_, index) => (
                <div
                  key={case_.id}
                  className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 hover:scale-[1.02] transition-transform"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CaseCard case_={case_} />
                </div>
              ))}
            </div>
          ) : (
            <Card data-testid="no-cases" className="bg-slate-800/30 border border-slate-600/50 backdrop-blur-sm">
              <CardContent className="pt-6 text-center">
                <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Ei caseja saatavilla</h3>
                <p className="text-slate-300">
                  Caseja ei löytynyt tai ne ovat väliaikaisesti poissa käytöstä.
                </p>
              </CardContent>
            </Card>
          )}
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
