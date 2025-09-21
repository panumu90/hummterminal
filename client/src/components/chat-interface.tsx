import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User, Send, TrendingUp, Wrench, MapPin, Target, Zap, DollarSign, Crosshair, Globe, Building, Users, Shield, Database, Workflow, MessageCircle, Phone, Heart, GraduationCap, BookOpen, Cpu, Scale, Star, Maximize2, Minimize2, HelpCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: number;
}

type ContextType = "strategic" | "practical" | "finnish" | "planning" | "technical" | "mcp" | "general";

interface QuestionButton {
  id: string;
  question: string;
  category: string;
  icon: typeof Bot;
  color: string;
}

interface TopicArea {
  id: string;
  title: string;
  icon: typeof Bot;
  color: string;
  questions: QuestionButton[];
}

// MCP (Model Context Protocol) - TÄRKEÄ!
const mcpQuestions: QuestionButton[] = [
  {
    id: "mcp-what-is",
    question: "Mikä on MCP?",
    category: "mcp",
    icon: HelpCircle,
    color: "bg-emerald-500"
  },
  {
    id: "mcp-security",
    question: "Miten MCP parantaa AI-integraatioiden turvallisuutta?",
    category: "mcp",
    icon: Shield,
    color: "bg-emerald-500"
  },
  {
    id: "mcp-automation",
    question: "Mitä hyötyä MCP:stä on asiakaspalvelun automaatiossa?",
    category: "mcp",
    icon: Cpu,
    color: "bg-emerald-500"
  },
  {
    id: "mcp-access-control",
    question: "Kuinka MCP:n avulla hallitaan AI:n pääsyoikeuksia?",
    category: "mcp",
    icon: Scale,
    color: "bg-emerald-500"
  }
];

const topicAreas: TopicArea[] = [
  {
    id: "strategy-roi",
    title: "Strategia & ROI",
    icon: TrendingUp,
    color: "bg-blue-500",
    questions: [
      {
        id: "roi-measurement",
        question: "Miten AI-investoinnista saa mitattavaa arvoa asiakaspalvelussa?",
        category: "strategy-roi",
        icon: DollarSign,
        color: "bg-blue-500"
      },
      {
        id: "cx-trends-2025",
        question: "Mitkä ovat vuoden 2025 suurimmat CX-trendit?",
        category: "strategy-roi",
        icon: TrendingUp,
        color: "bg-blue-500"
      }
    ]
  },
  {
    id: "data-privacy",
    title: "Data & tietosuoja",
    icon: Database,
    color: "bg-purple-500",
    questions: [
      {
        id: "data-quality",
        question: "Miten varmistetaan, että asiakasdata pysyy laadukkaana ja suojattuna?",
        category: "data-privacy",
        icon: Shield,
        color: "bg-purple-500"
      },
      {
        id: "gdpr-compliance",
        question: "Kuinka vältetään datasiilot ja GDPR-riskit AI-projekteissa?",
        category: "data-privacy",
        icon: Scale,
        color: "bg-purple-500"
      }
    ]
  },
  {
    id: "automation-workflows",
    title: "Automaatio & työnkulut",
    icon: Workflow,
    color: "bg-green-500",
    questions: [
      {
        id: "reduce-manual-work",
        question: "Miten automaatio voi vähentää manuaalista työtä asiakaspalvelussa?",
        category: "automation-workflows",
        icon: Workflow,
        color: "bg-green-500"
      },
      {
        id: "ticket-classification",
        question: "Mitä hyötyä on AI:sta tikettien luokittelussa ja reitityksessä?",
        category: "automation-workflows",
        icon: Target,
        color: "bg-green-500"
      }
    ]
  },
  {
    id: "bots-agents",
    title: "Botit & agentit",
    icon: Bot,
    color: "bg-orange-500",
    questions: [
      {
        id: "bot-vs-agent",
        question: "Mikä ero on chatbotilla ja AI-agentilla?",
        category: "bots-agents",
        icon: Bot,
        color: "bg-orange-500"
      },
      {
        id: "escalation-timing",
        question: "Milloin kannattaa eskaloida botti-asiakaspalvelusta ihmiselle?",
        category: "bots-agents",
        icon: Users,
        color: "bg-orange-500"
      }
    ]
  },
  {
    id: "voice-phone",
    title: "Ääni & puhelin",
    icon: Phone,
    color: "bg-pink-500",
    questions: [
      {
        id: "asr-sentiment",
        question: "Miten puheentunnistus (ASR) ja sentimenttianalyysi voivat parantaa puhelinpalvelua?",
        category: "voice-phone",
        icon: Phone,
        color: "bg-pink-500"
      },
      {
        id: "call-summary",
        question: "Kuinka automaattinen yhteenveto helpottaa agentin työtä puhelun jälkeen?",
        category: "voice-phone",
        icon: MessageCircle,
        color: "bg-pink-500"
      }
    ]
  },
  {
    id: "hyperpersonalization",
    title: "Hyperpersoonallistaminen",
    icon: Heart,
    color: "bg-red-500",
    questions: [
      {
        id: "realtime-recommendations",
        question: "Miten AI voi tarjota asiakkaille räätälöityjä suosituksia reaaliajassa?",
        category: "hyperpersonalization",
        icon: Crosshair,
        color: "bg-red-500"
      },
      {
        id: "proactive-communication",
        question: "Kuinka proaktiivinen viestintä lisää asiakastyytyväisyyttä?",
        category: "hyperpersonalization",
        icon: Zap,
        color: "bg-red-500"
      }
    ]
  },
  {
    id: "agent-quality",
    title: "Agenttien laatu & koulutus",
    icon: GraduationCap,
    color: "bg-indigo-500",
    questions: [
      {
        id: "quality-assessment",
        question: "Miten AI voi arvioida ja parantaa asiakaspalvelijan laatua?",
        category: "agent-quality",
        icon: Star,
        color: "bg-indigo-500"
      },
      {
        id: "agent-assist-training",
        question: "Voiko agent-assist toimia myös koulutusvälineenä?",
        category: "agent-quality",
        icon: GraduationCap,
        color: "bg-indigo-500"
      }
    ]
  },
  {
    id: "case-library",
    title: "Case-kirjasto",
    icon: BookOpen,
    color: "bg-cyan-500",
    questions: [
      {
        id: "successful-cases",
        question: "Mitä voimme oppia onnistuneista AI-caseista asiakaspalvelussa?",
        category: "case-library",
        icon: BookOpen,
        color: "bg-cyan-500"
      },
      {
        id: "failed-projects",
        question: "Miksi osa AI-projekteista epäonnistuu CX:ssä?",
        category: "case-library",
        icon: Target,
        color: "bg-cyan-500"
      }
    ]
  },
  {
    id: "technology-integrations",
    title: "Teknologia & integraatiot",
    icon: Cpu,
    color: "bg-teal-500",
    questions: [
      {
        id: "required-technologies",
        question: "Mitä teknologioita tarvitaan AI:n integrointiin asiakaspalveluun?",
        category: "technology-integrations",
        icon: Cpu,
        color: "bg-teal-500"
      },
      {
        id: "platform-integration",
        question: "Miten Intercom, CRM ja CCaaS voidaan yhdistää tekoälyn avulla?",
        category: "technology-integrations",
        icon: Globe,
        color: "bg-teal-500"
      }
    ]
  },
  {
    id: "governance-ethics",
    title: "Hallintamalli & eettisyys",
    icon: Scale,
    color: "bg-slate-500",
    questions: [
      {
        id: "ethical-ai",
        question: "Miten varmistetaan tekoälyn eettinen käyttö asiakaspalvelussa?",
        category: "governance-ethics",
        icon: Scale,
        color: "bg-slate-500"
      },
      {
        id: "decision-responsibility",
        question: "Kuka vastaa tekoälyn tekemistä päätöksistä CX-yrityksessä?",
        category: "governance-ethics",
        icon: Users,
        color: "bg-slate-500"
      }
    ]
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
  technical: {
    label: "Tekninen toteutus",
    icon: Cpu,
    color: "bg-emerald-500 hover:bg-emerald-600",
    description: "MCP ja teknologiset ratkaisut"
  },
  mcp: {
    label: "Model Context Protocol",
    icon: Shield,
    color: "bg-emerald-600 hover:bg-emerald-700",
    description: "MCP-spesifinen tieto ja ohjeistus"
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
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const questionMutation = useMutation({
    mutationFn: async (questionId: string) => {
      const response = await apiRequest("GET", `/api/questions/${questionId}/answer?enhance=true`);
      return response.json();
    },
    onSuccess: (data, questionId) => {
      setMessages(prev => [...prev, {
        content: data.answer,
        isUser: false,
        timestamp: Date.now()
      }]);
      // Set context based on question type
      if (questionId.includes('mcp-') || questionId.includes('required-technologies') || questionId.includes('platform-integration')) {
        setSelectedContext('technical');
      } else if (questionId.includes('roi-') || questionId.includes('cx-trends') || questionId.includes('strategy')) {
        setSelectedContext('strategic');
      } else if (questionId.includes('successful-cases') || questionId.includes('failed-projects') || questionId.includes('automation') || questionId.includes('bot-')) {
        setSelectedContext('practical');
      } else if (questionId.includes('finnish') || questionId.includes('suomalainen')) {
        setSelectedContext('finnish');
      } else {
        setSelectedContext('general');
      }
    },
    onError: () => {
      toast({
        title: "Virhe",
        description: "Vastauksen lataaminen epäonnistui.",
        variant: "destructive"
      });
    }
  });

  const handleQuestionClick = (questionId: string) => {
    setIsExpanded(true); // Auto-expand chat when question is clicked
    
    // Find question text
    const allQuestions = [
      ...mcpQuestions,
      ...topicAreas.flatMap(topic => topic.questions)
    ];
    const question = allQuestions.find(q => q.id === questionId);
    
    if (question) {
      // Add user question first
      setMessages(prev => [...prev, {
        content: question.question,
        isUser: true,
        timestamp: Date.now()
      }]);

      // Send question as chat message to get enhanced markdown response with appropriate context
      const isMcpQuestion = question.id.includes('mcp-') || question.question.toLowerCase().includes('mcp');
      const contextType = isMcpQuestion ? 'mcp' : 
                         question.category.includes('roi') || question.category.includes('strategy') ? 'strategic' :
                         question.category.includes('automation') || question.category.includes('practical') ? 'practical' : 'general';
      console.log("Question clicked:", question.question, "ID:", question.id, "Context:", contextType);
      chatMutation.mutate({ message: question.question, context_type: contextType });
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (data: { message: string, context_type?: ContextType }) => {
      const response = await apiRequest("POST", "/api/chat", { 
        message: data.message || data,
        context_type: data.context_type || selectedContext
      });
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Chat response received:", data.response);
      console.log("Has markdown headers:", data.response.includes('##') || data.response.includes('###'));
      console.log("Has markdown bold:", data.response.includes('**'));
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
    chatMutation.mutate({ message: message });
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
        <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold" data-testid="chat-title">AI Assistentti</h3>
              <p className="text-xs opacity-90">Kysy tarkempia kysymyksiä toteutuksista</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpanded}
            className="text-primary-foreground hover:bg-primary-foreground/20 p-2"
            data-testid="expand-button"
            title={isExpanded ? "Pienennä chat" : "Laajenna chat"}
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* MCP Section - TÄRKEÄ! */}
        <div className={`border-b border-border bg-emerald-50 dark:bg-emerald-950 transition-all duration-300 ${
          isExpanded ? 'max-h-0 overflow-hidden opacity-0 p-0' : 'p-4 max-h-96 opacity-100'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-emerald-600" />
            <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">Model Context Protocol (MCP) - TÄRKEÄ!</h4>
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-300 mb-3">
            MCP mahdollistaa turvallisen AI-integraation yritysjärjestelmiin
          </p>
          <div className="grid grid-cols-1 gap-2">
            {mcpQuestions.map((question) => {
              const IconComponent = question.icon;
              return (
                <Button
                  key={question.id}
                  variant="outline"
                  size="sm"
                  className="h-auto p-3 text-xs text-left justify-start border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 dark:border-emerald-800 dark:hover:bg-emerald-900"
                  onClick={() => handleQuestionClick(question.id)}
                  disabled={questionMutation.isPending}
                  data-testid={`question-${question.id}`}
                >
                  <IconComponent className="h-4 w-4 mr-2 text-emerald-600 flex-shrink-0" />
                  <span className="leading-tight">{question.question}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* AI Kysymykset aiheittain */}
        <div className={`border-b border-border transition-all duration-300 ${
          isExpanded ? 'max-h-0 overflow-hidden opacity-0 p-0' : 'p-4 max-h-80 overflow-y-auto opacity-100'
        }`}>
          <h4 className="text-sm font-medium mb-3 text-foreground">AI-asiakaspalvelu kysymykset:</h4>
          <div className="space-y-4">
            {topicAreas.map((topic) => {
              const TopicIcon = topic.icon;
              return (
                <div key={topic.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TopicIcon className={`h-4 w-4 ${topic.color.replace('bg-', 'text-')}`} />
                    <h5 className="text-xs font-medium text-foreground">{topic.title}</h5>
                  </div>
                  <div className="grid grid-cols-1 gap-1 ml-6">
                    {topic.questions.map((question) => {
                      const QuestionIcon = question.icon;
                      return (
                        <Button
                          key={question.id}
                          variant="ghost"
                          size="sm"
                          className="h-auto p-2 text-xs text-left justify-start hover:bg-muted"
                          onClick={() => handleQuestionClick(question.id)}
                          disabled={questionMutation.isPending}
                          data-testid={`question-${question.id}`}
                        >
                          <QuestionIcon className="h-3 w-3 mr-2 text-muted-foreground flex-shrink-0" />
                          <span className="leading-tight text-muted-foreground">{question.question}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Context Selection */}
        <div className={`border-b border-border transition-all duration-300 ${
          isExpanded ? 'max-h-0 overflow-hidden opacity-0 p-0' : 'p-4 max-h-96 opacity-100'
        }`}>
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
        <div className={`overflow-y-auto p-4 space-y-4 transition-all duration-300 ${
          isExpanded ? 'h-[calc(100vh-12rem)]' : 'h-80'
        }`} data-testid="chat-messages">
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
                <div className={`${message.isUser ? 'bg-primary text-primary-foreground max-w-xs' : 'bg-muted max-w-2xl'} rounded-lg p-3`}>
                  <div className={`text-sm ${message.isUser ? '' : 'text-muted-foreground'}`}>
                    {message.isUser ? (
                      <span className="whitespace-pre-wrap">{message.content}</span>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({children}) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                            h2: ({children}) => <h2 className="text-base font-semibold mb-2">{children}</h2>,
                            h3: ({children}) => <h3 className="text-sm font-medium mb-1">{children}</h3>,
                            p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                            ul: ({children}) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                            li: ({children}) => <li className="mb-1">{children}</li>,
                            strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                            em: ({children}) => <em className="italic">{children}</em>,
                            code: ({children}) => <code className="bg-muted px-1 py-0.5 rounded text-xs">{children}</code>,
                            blockquote: ({children}) => <blockquote className="border-l-2 border-border pl-3 italic">{children}</blockquote>
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
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
