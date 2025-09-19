import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Send, TrendingUp, Wrench, MapPin, Target, Zap, DollarSign, Crosshair, Globe, Building, Users } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: number;
}

type ContextType = "strategic" | "practical" | "finnish" | "planning" | "general";

interface DataCategory {
  id: string;
  label: string;
  icon: typeof Bot;
  description: string;
  color: string;
}

const dataCategories: DataCategory[] = [
  {
    id: "autonomous-agents",
    label: "Autonomiset agentit",
    icon: Bot,
    description: "AI-agentit ja automaatio",
    color: "bg-blue-500"
  },
  {
    id: "ai-investments",
    label: "AI-investoinnit",
    icon: DollarSign,
    description: "ROI ja tuotto-odotukset",
    color: "bg-green-500"
  },
  {
    id: "hyperpersonalization",
    label: "Personointi",
    icon: Crosshair,
    description: "Hyperpersoonallistaminen",
    color: "bg-purple-500"
  },
  {
    id: "proactive-service",
    label: "Proaktiivinen palvelu",
    icon: Zap,
    description: "Ennakoiva asiakaspalvelu",
    color: "bg-orange-500"
  },
  {
    id: "finnish-cases",
    label: "Suomalaiset toteutukset",
    icon: MapPin,
    description: "Case-esimerkit Suomesta",
    color: "bg-red-500"
  },
  {
    id: "international-cases",
    label: "Kansainväliset toteutukset",
    icon: Globe,
    description: "Globaalit case-esimerkit",
    color: "bg-indigo-500"
  },
  {
    id: "by-industry",
    label: "Toimialat",
    icon: Building,
    description: "Toteutukset toimialoittain",
    color: "bg-teal-500"
  }
];

const contextConfig = {
  strategic: {
    label: "Strategiset trendit",
    icon: TrendingUp,
    color: "bg-blue-500 hover:bg-blue-600",
    description: "2025 AI-trendit ja tulevaisuuden näkymät"
  },
  practical: {
    label: "Käytännön toteutus",
    icon: Wrench,
    color: "bg-green-500 hover:bg-green-600",
    description: "Konkreettiset case-esimerkit ja tulokset"
  },
  finnish: {
    label: "Suomalainen näkökulma",
    icon: MapPin,
    color: "bg-orange-500 hover:bg-orange-600",
    description: "Soveltaminen Suomen markkinoilla"
  },
  planning: {
    label: "Strateginen suunnittelu",
    icon: Target,
    color: "bg-purple-500 hover:bg-purple-600",
    description: "Humm.fi:n seuraavat askeleet"
  },
  general: {
    label: "Yleinen",
    icon: Bot,
    color: "bg-gray-500 hover:bg-gray-600",
    description: "Yleiset kysymykset"
  }
};

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      content: "Hei! Voin kertoa lisää näistä AI-asiakaspalvelutoteutuksista. Valitse painikkeesta aihepiiri joka kiinnostaa sinua eniten, niin osaan antaa tarkempia vastauksia.",
      isUser: false,
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [selectedContext, setSelectedContext] = useState<ContextType>("general");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const categorySummaryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const response = await apiRequest("GET", `/api/categories/${categoryId}/summary`);
      return response.json();
    },
    onSuccess: (data, categoryId) => {
      const category = dataCategories.find(c => c.id === categoryId);
      setMessages(prev => [...prev, {
        content: data.summary,
        isUser: false,
        timestamp: Date.now()
      }]);
      // Set context based on category
      if (['autonomous-agents', 'ai-investments', 'hyperpersonalization', 'proactive-service'].includes(categoryId)) {
        setSelectedContext('strategic');
      } else if (categoryId === 'finnish-cases') {
        setSelectedContext('finnish');
      } else if (['international-cases', 'by-industry'].includes(categoryId)) {
        setSelectedContext('practical');
      }
    },
    onError: () => {
      toast({
        title: "Virhe",
        description: "Yhteenvedon lataaminen epäonnistui.",
        variant: "destructive"
      });
    }
  });

  const handleCategoryClick = (categoryId: string) => {
    categorySummaryMutation.mutate(categoryId);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", { 
        message,
        context_type: selectedContext
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
    if (!message || chatMutation.isPending) return;

    // Add user message
    setMessages(prev => [...prev, {
      content: message,
      isUser: true,
      timestamp: Date.now()
    }]);

    setInputValue("");
    chatMutation.mutate(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="sticky top-24">
      <Card className="overflow-hidden" data-testid="chat-interface">
        {/* Chat Header */}
        <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold" data-testid="chat-title">AI Assistentti</h3>
            <p className="text-xs opacity-90">Kysy tarkempia kysymyksiä toteutuksista</p>
          </div>
        </div>

        {/* Data Category Buttons */}
        <div className="border-b border-border p-4">
          <h4 className="text-sm font-medium mb-3 text-foreground">Tutustu dataan kategorioittain:</h4>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {dataCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant="outline"
                  size="sm"
                  className={`h-12 text-xs flex flex-col items-center justify-center gap-1 hover:${category.color} hover:text-white transition-colors`}
                  onClick={() => handleCategoryClick(category.id)}
                  disabled={categorySummaryMutation.isPending}
                  data-testid={`category-${category.id}`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="text-center leading-tight">{category.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Context Selection */}
        <div className="border-b border-border p-4">
          <h4 className="text-sm font-medium mb-2 text-foreground">Kysymystyyppi:</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(contextConfig).map(([key, config]) => {
              const IconComponent = config.icon;
              return (
                <Button
                  key={key}
                  variant={selectedContext === key ? "default" : "outline"}
                  size="sm"
                  className={`h-8 text-xs ${selectedContext === key ? config.color : ""}`}
                  onClick={() => setSelectedContext(key as ContextType)}
                  data-testid={`context-${key}`}
                >
                  <IconComponent className="h-3 w-3 mr-1" />
                  {config.label}
                </Button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Valittu: {contextConfig[selectedContext].description}
          </p>
        </div>

        {/* Chat Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-4" data-testid="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className="chat-message" data-testid={`message-${index}`}>
              <div className={`flex items-start space-x-3 ${message.isUser ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 ${message.isUser ? 'bg-secondary' : 'bg-primary'} rounded-full flex items-center justify-center flex-shrink-0`}>
                  {message.isUser ? (
                    <User className="h-4 w-4 text-secondary-foreground" />
                  ) : (
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  )}
                </div>
                <div className={`${message.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3 max-w-xs`}>
                  <div className={`text-sm ${message.isUser ? '' : 'text-muted-foreground'} whitespace-pre-wrap`}>
                    {message.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {chatMutation.isPending && (
            <div className="chat-message" data-testid="loading-message">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary-foreground animate-pulse" />
                </div>
                <div className="bg-muted rounded-lg p-3 max-w-xs">
                  <p className="text-sm text-muted-foreground">Kirjoittaa...</p>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="border-t border-border p-4">
          <div className="flex space-x-3">
            <Input
              type="text"
              placeholder="Kirjoita kysymyksesi..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={chatMutation.isPending}
              className="flex-1"
              data-testid="chat-input"
            />
            <Button
              onClick={handleSend}
              disabled={chatMutation.isPending || !inputValue.trim()}
              size="icon"
              data-testid="send-button"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Esimerkki kysymyksiä:</span>
            <div className="flex space-x-2">
              <Badge 
                variant="secondary" 
                className="cursor-pointer hover:opacity-80"
                onClick={() => setInputValue("Miten kustannussäästöt saavutettiin?")}
                data-testid="example-costs"
              >
                Kustannussäästöt
              </Badge>
              <Badge 
                variant="secondary" 
                className="cursor-pointer hover:opacity-80"
                onClick={() => setInputValue("Mitä teknologioita käytettiin?")}
                data-testid="example-tech"
              >
                Teknologia
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <Card className="mt-6" data-testid="quick-stats">
        <CardContent className="p-4">
          <h4 className="font-semibold text-foreground mb-3">Yhteenveto tuloksista</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Keskimääräinen automaatioaste</span>
              <span className="font-semibold text-foreground" data-testid="stat-automation">60-95%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Vastausajan parannus</span>
              <span className="font-semibold text-foreground" data-testid="stat-response">Tunneista sekunteihin</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Asiakastyytyväisyys</span>
              <span className="font-semibold text-foreground" data-testid="stat-satisfaction">+10pp keskimäärin</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Saatavuus</span>
              <span className="font-semibold text-foreground" data-testid="stat-availability">24/7</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
