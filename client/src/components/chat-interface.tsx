import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PulseButton } from "@/components/ui/pulse-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User, Send, TrendingUp, Wrench, MapPin, Target, Zap, DollarSign, Crosshair, Globe, Building, Users, Shield, Database, Workflow, MessageCircle, Phone, Heart, GraduationCap, BookOpen, Cpu, Scale, Star, Maximize2, Minimize2, HelpCircle, FileText, ExternalLink, BarChart3 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  },
  {
    id: "mcp-deep-analysis",
    question: "📊 Syväanalyysi MCP",
    category: "mcp",
    icon: FileText,
    color: "bg-emerald-500"
  }
];

const topicAreas: TopicArea[] = [
  {
    id: "trends-2025",
    title: "🚀 Trendit 2025",
    icon: TrendingUp,
    color: "bg-gradient-to-r from-purple-600 to-orange-600",
    questions: [
      {
        id: "hyperpersonalization-trend",
        question: "🎯 Kuinka hyperpersonointi mullistaa asiakaskokemuksen 2025?",
        category: "general",
        icon: Target,
        color: "bg-purple-600"
      },
      {
        id: "proactive-service-trend",
        question: "⚡ Miksi proaktiivinen asiakaspalvelu on vuoden 2025 megatrendi?",
        category: "general",
        icon: Zap,
        color: "bg-orange-600"
      },
      {
        id: "cx-trends-2025-featured",
        question: "📊 2025 suurimmat CX-trendit ja AI:n rooli",
        category: "general",
        icon: BarChart3,
        color: "bg-blue-600"
      }
    ]
  },
  {
    id: "strategy-roi",
    title: "Strategia & ROI",
    icon: TrendingUp,
    color: "bg-slate-600",
    questions: [
      {
        id: "roi-measurement",
        question: "Miten AI-investoinnista saa mitattavaa arvoa asiakaspalvelussa?",
        category: "strategy-roi",
        icon: DollarSign,
        color: "bg-slate-600"
      },
      {
        id: "cx-trends-2025",
        question: "Mitkä ovat vuoden 2025 suurimmat CX-trendit?",
        category: "strategy-roi",
        icon: TrendingUp,
        color: "bg-slate-600"
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
    color: "bg-slate-600 hover:bg-slate-700",
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
      content: "Moro Hummilaiset. Tähän chattiin on integroitu Googlen uusin Gemini 2.5 pro tekoäly ja sitä on koulutettu vastaamaan teidän mieltä askarruttaviin kysymyksiin tekoälyn implementoinnista liiketoimintaan. Feel free to ask anything",
      isUser: false,
      timestamp: Date.now()
    },
    {
      content: "Alla on tekoälyyn liittyviä keskeisiä teemoja, käsitteitä ja niihin liittyviä teemoja. Klikkaa esimerkiksi MCP-aiheista kysymystä, niin sinulle avautuu keskustelumuotoinen infopläjäys, jossa voit chattailla mun datan kanssa",
      isUser: false,
      timestamp: Date.now() + 1
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [selectedContext, setSelectedContext] = useState<ContextType>("general");
  const [isExpanded, setIsExpanded] = useState(false);
  const [mcpModalOpen, setMcpModalOpen] = useState(false);
  const [followUpSuggestions, setFollowUpSuggestions] = useState<string[]>([]);
  const [placeholderText, setPlaceholderText] = useState("Kysy mitä tahansa AI-asiakaspalvelusta johdolle...");

  // Striimaavat placeholder-kysymykset
  const rotatingQuestions = [
    "Kysy mitä tahansa AI-asiakaspalvelusta johdolle...",
    "Mikä on ROI AI-investoinnille asiakaspalvelussa?",
    "Millä aikataululla voimme toteuttaa AI-asiakaspalvelun?",
    "Mitä riskejä AI-asiakaspalvelussa on?",
    "Kuinka paljon AI-asiakaspalvelu maksaa?",
    "Mitä teknisiä vaatimuksia AI-toteutuksella on?",
    "Kuinka integroida AI olemassa oleviin järjestelmiin?",
    "Mitä tietoturvaseikkoja AI-käyttöönotossa tulee huomioida?",
    "Kuinka mitata AI-asiakaspalvelun menestystä?",
    "Millaista osaamista AI-projekti vaatii tiimiltä?"
  ];

  // Optimized placeholder rotation - avoid unnecessary re-renders
  useEffect(() => {
    if (inputValue) return; // Don't rotate when user is typing
    
    const interval = setInterval(() => {
      setPlaceholderText(prev => {
        const currentIndex = rotatingQuestions.indexOf(prev);
        const nextIndex = (currentIndex + 1) % rotatingQuestions.length;
        return rotatingQuestions[nextIndex];
      });
    }, 4000); // Increased interval to reduce render frequency

    return () => clearInterval(interval);
  }, [inputValue]); // Removed rotatingQuestions dependency to prevent unnecessary re-renders
  
  // New modal state for AI responses
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [modalMessages, setModalMessages] = useState<ChatMessage[]>([]);
  const [modalInputValue, setModalInputValue] = useState("");
  const [modalFollowUpSuggestions, setModalFollowUpSuggestions] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [currentQuestionContext, setCurrentQuestionContext] = useState<ContextType>("general");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modalMessagesEndRef = useRef<HTMLDivElement>(null);
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
    // Special handling for MCP deep analysis - open modal instead of chat
    if (questionId === "mcp-deep-analysis") {
      setMcpModalOpen(true);
      return;
    }

    // Find question text
    const allQuestions = [
      ...mcpQuestions,
      ...topicAreas.flatMap(topic => topic.questions)
    ];
    const question = allQuestions.find(q => q.id === questionId);
    
    if (question) {
      // Determine context based on question category
      const isMcpQuestion = question.id.includes('mcp-') || question.question.toLowerCase().includes('mcp');
      const contextType = isMcpQuestion ? 'mcp' : 
                         question.category.includes('roi') || question.category.includes('strategy') ? 'strategic' :
                         question.category.includes('automation') || question.category.includes('practical') ? 'practical' : 'general';
      
      // Set up modal with initial user message
      setCurrentQuestion(question.question);
      setCurrentQuestionContext(contextType);
      setModalMessages([{
        content: question.question,
        isUser: true,
        timestamp: Date.now()
      }]);
      setModalInputValue("");
      setModalFollowUpSuggestions([]);
      setAiModalOpen(true);
      
      console.log("Question clicked:", question.question, "ID:", question.id, "Context:", contextType);
      // Use modal mutation to get initial response
      modalChatMutation.mutate({ message: question.question, context_type: contextType });
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Removed auto-scroll to bottom to prevent annoying behavior when clicking buttons
  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);
  
  useEffect(() => {
    if (modalMessagesEndRef.current) {
      modalMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [modalMessages]);

  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  
  const sendStreamingMessage = async (message: string, context_type?: ContextType) => {
    if (isStreaming) return;
    
    setIsStreaming(true);
    setStreamingMessage("");
    
    // Add user message immediately
    setMessages(prev => [...prev, {
      content: message,
      isUser: true,
      timestamp: Date.now()
    }]);
    
    // Create placeholder for AI response  
    const aiMessageIndex = messages.length + 1;
    setMessages(prev => [...prev, {
      content: "",
      isUser: false,
      timestamp: Date.now()
    }]);
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message,
          context_type: context_type || selectedContext
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                if (data.type === 'chunk') {
                  fullResponse += data.text;
                  
                  // Update the AI message with streaming content
                  setMessages(prev => prev.map((msg, idx) => 
                    idx === aiMessageIndex 
                      ? { ...msg, content: fullResponse }
                      : msg
                  ));
                } else if (data.type === 'complete') {
                  if (data.followUpSuggestions) {
                    setFollowUpSuggestions(data.followUpSuggestions || []);
                  }
                } else if (data.type === 'error') {
                  throw new Error(data.message);
                }
              } catch (parseError) {
                console.error("Failed to parse SSE data:", parseError);
              }
            }
          }
        }
      }
      
      console.log("Streaming response completed:", fullResponse);
    } catch (error) {
      console.error("Streaming error:", error);
      toast({
        title: "Virhe",
        description: "Viestin lähettäminen epäonnistui. Yritä uudelleen.",
        variant: "destructive"
      });
      
      // Remove placeholder message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsStreaming(false);
      setStreamingMessage("");
    }
  };

  // Modal chat mutation for AI responses in modal
  const modalChatMutation = useMutation({
    mutationFn: async (data: { message: string, context_type?: ContextType }) => {
      const response = await apiRequest("POST", "/api/chat", { 
        message: data.message || data,
        context_type: data.context_type || currentQuestionContext
      });
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Modal chat response received:", data.response);
      console.log("Modal follow-up suggestions received:", data.followUpSuggestions);
      
      // Add AI response to modal messages
      setModalMessages(prev => [...prev, {
        content: data.response,
        isUser: false,
        timestamp: Date.now()
      }]);
      
      // Update modal follow-up suggestions
      if (data.followUpSuggestions && Array.isArray(data.followUpSuggestions)) {
        setModalFollowUpSuggestions(data.followUpSuggestions);
      }
    },
    onError: (error) => {
      console.error("Modal chat error:", error);
      setModalMessages(prev => [...prev, {
        content: "Anteeksi, en pystynyt käsittelemään kysymystäsi.",
        isUser: false,
        timestamp: Date.now()
      }]);
      toast({
        title: "Virhe",
        description: "Vastauksen lataaminen epäonnistui.",
        variant: "destructive"
      });
    }
  });

  const handleSend = () => {
    const message = inputValue.trim();
    if (!message || isStreaming) return;

    setInputValue("");
    // Clear previous follow-up suggestions when sending new message
    setFollowUpSuggestions([]);
    sendStreamingMessage(message);
  };

  const handleFollowUpClick = (suggestion: string) => {
    if (isStreaming) return;

    // Clear follow-up suggestions immediately when one is clicked
    setFollowUpSuggestions([]);
    sendStreamingMessage(suggestion);
  };

  // Modal chat functions
  const handleModalSend = () => {
    const message = modalInputValue.trim();
    if (!message || modalChatMutation.isPending) return;

    // Add user message to modal
    setModalMessages(prev => [...prev, {
      content: message,
      isUser: true,
      timestamp: Date.now()
    }]);

    setModalInputValue("");
    setModalFollowUpSuggestions([]);
    modalChatMutation.mutate({ message: message, context_type: currentQuestionContext });
  };

  const handleModalFollowUpClick = (suggestion: string) => {
    if (modalChatMutation.isPending) return;

    // Add user message to modal
    setModalMessages(prev => [...prev, {
      content: suggestion,
      isUser: true,
      timestamp: Date.now()
    }]);

    setModalFollowUpSuggestions([]);
    modalChatMutation.mutate({ message: suggestion, context_type: currentQuestionContext });
  };

  const handleModalKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleModalSend();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full">
      <Card className="overflow-hidden shadow-xl border-0 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm" data-testid="chat-interface">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold" data-testid="chat-title">AI Chat</h3>
              <p className="text-xs opacity-90">Johdon kysymykset</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpanded}
            className="text-primary-foreground hover:bg-primary-foreground/20 p-1"
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



        {/* Chat Messages */}
        <div className={`overflow-y-auto p-6 space-y-6 transition-all duration-300 bg-slate-950/20 ${
          isExpanded ? 'h-[calc(100vh-16rem)]' : 'h-96'
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
                  <div className={`text-sm ${message.isUser ? '' : 'text-foreground'}`}>
                    {message.isUser ? (
                      <span className="whitespace-pre-wrap">{message.content}</span>
                    ) : (
                      <div className="max-w-none text-gray-100">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({children}) => <h1 className="text-lg font-bold mb-2 text-white">{children}</h1>,
                            h2: ({children}) => <h2 className="text-base font-semibold mb-2 text-white">{children}</h2>,
                            h3: ({children}) => <h3 className="text-sm font-medium mb-1 text-gray-100">{children}</h3>,
                            p: ({children}) => <p className="mb-2 last:mb-0 text-gray-100">{children}</p>,
                            ul: ({children}) => <ul className="list-disc pl-4 mb-2 text-gray-100">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal pl-4 mb-2 text-gray-100">{children}</ol>,
                            li: ({children}) => <li className="mb-1 text-gray-100">{children}</li>,
                            strong: ({children}) => <strong className="font-semibold text-white">{children}</strong>,
                            em: ({children}) => <em className="italic text-gray-200">{children}</em>,
                            code: ({children}) => <code className="bg-slate-700 text-gray-100 px-1 py-0.5 rounded text-xs">{children}</code>,
                            blockquote: ({children}) => <blockquote className="border-l-2 border-slate-500 pl-3 italic text-gray-200">{children}</blockquote>
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
          {isStreaming && (
            <div className="chat-message animate-in fade-in-0 duration-300" data-testid="loading-message">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary-foreground animate-pulse" />
                </div>
                <div className="bg-muted rounded-lg p-3 max-w-2xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <p className="text-sm text-muted-foreground">AI miettii vastausta...</p>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                    <Skeleton className="h-3 w-3/5" />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          
          <div ref={messagesEndRef} />
        </div>

        {/* Follow-up Suggestions - Above Input */}
        {followUpSuggestions.length > 0 && (
          <div className="border-t border-border bg-slate-800/30 p-4" data-testid="follow-up-suggestions-input">
            <p className="text-sm font-medium mb-3 text-slate-200">💡 Suositellut jatkokysymykset johdolle:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {followUpSuggestions.map((suggestion, index) => (
                <PulseButton
                  key={index}
                  variant="outline"
                  size="sm"
                  pulse="subtle"
                  className="text-left h-auto py-3 px-4 justify-start whitespace-normal bg-slate-700/50 hover:bg-slate-600/50 text-slate-100 border-slate-600 hover:border-slate-500 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
                  style={{animationDelay: `${index * 100}ms`}}
                  onClick={() => handleFollowUpClick(suggestion)}
                  loading={isStreaming}
                  data-testid={`follow-up-input-${index}`}
                >
                  <span className="text-xs leading-relaxed">{suggestion}</span>
                </PulseButton>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input */}
        <div className="border-t border-border p-6 bg-slate-900/30">
          <div className="flex space-x-4">
            <Input
              type="text"
              placeholder={placeholderText}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isStreaming}
              className="flex-1 h-12 text-base bg-slate-800/50 border-slate-600 focus:border-primary text-slate-100 placeholder:text-slate-400"
              data-testid="chat-input"
            />
            <PulseButton
              onClick={handleSend}
              loading={isStreaming}
              disabled={!inputValue.trim()}
              size="lg"
              pulse="subtle"
              className="h-12 px-6"
              data-testid="send-button"
            >
              <Send className="h-5 w-5" />
            </PulseButton>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>💼 Räätälöidyt vastaukset Humm Group Oy:n johdolle</span>
            <div className="flex space-x-2">
              <Badge 
                variant="secondary" 
                className="cursor-pointer hover:opacity-80 bg-slate-700 text-slate-200"
                onClick={() => setInputValue("Millä aikataululla voimme toteuttaa AI-asiakaspalvelun?")}
                data-testid="example-timeline"
              >
                Aikataulu
              </Badge>
              <Badge 
                variant="secondary" 
                className="cursor-pointer hover:opacity-80 bg-slate-700 text-slate-200"
                onClick={() => setInputValue("Mikä on ROI AI-investoinnille asiakaspalvelussa?")}
                data-testid="example-roi"
              >
                ROI & Hyödyt
              </Badge>
            </div>
          </div>
        </div>

        {/* MCP Section - TÄRKEÄ! */}
        <div className={`border-t border-border bg-emerald-950 transition-all duration-300 ${
          isExpanded ? 'max-h-0 overflow-hidden opacity-0 p-0' : 'p-4 pb-6 max-h-none opacity-100'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-emerald-600" />
            <h4 className="text-sm font-semibold text-emerald-100">Model Context Protocol (MCP) - TÄRKEÄ!</h4>
          </div>
          <p className="text-xs text-emerald-300 mb-3">
            MCP mahdollistaa turvallisen AI-integraation yritysjärjestelmiin
          </p>
          <div className="grid grid-cols-1 gap-2">
            {mcpQuestions.map((question) => {
              const IconComponent = question.icon;
              return (
                <PulseButton
                  key={question.id}
                  variant="outline"
                  size="sm"
                  pulse="subtle"
                  className="h-auto p-3 text-xs text-left justify-start border-emerald-800 hover:bg-emerald-900 hover:border-emerald-700 text-emerald-50 hover:text-white"
                  onClick={() => handleQuestionClick(question.id)}
                  loading={questionMutation.isPending}
                  disabled={questionMutation.isPending}
                  data-testid={`question-${question.id}`}
                >
                  <IconComponent className="h-4 w-4 mr-2 text-emerald-600 flex-shrink-0" />
                  <span className="leading-tight">{question.question}</span>
                </PulseButton>
              );
            })}
          </div>
        </div>

        {/* Suositut kysymykset - Featured */}
        <div className={`border-t border-border transition-all duration-300 ${
          isExpanded ? 'max-h-0 overflow-hidden opacity-0 p-0' : 'p-6 opacity-100'
        }`}>
          <h4 className="text-base font-semibold mb-4 text-white">🎯 Suositut kysymykset johdolle</h4>
          <div className="space-y-3">
            {/* Top 6 featured questions - hyperpersonalization and proactivity first */}
            <PulseButton
              variant="outline"
              size="lg"
              pulse="subtle"
              className="w-full h-auto p-4 text-left justify-start bg-slate-700/30 hover:bg-slate-600/50 text-slate-100 border-slate-600 hover:border-purple-500 transition-all duration-200"
              onClick={() => handleQuestionClick("hyperpersonalization-trend")}
              disabled={questionMutation.isPending}
              data-testid="featured-question-personalization"
            >
              <Target className="h-5 w-5 mr-3 text-purple-400 flex-shrink-0" />
              <div>
                <div className="font-medium">Kuinka hyperpersonointi mullistaa asiakaskokemuksen?</div>
                <div className="text-xs text-slate-400 mt-1">Personalisaation tulevaisuus</div>
              </div>
            </PulseButton>

            <PulseButton
              variant="outline"
              size="lg"
              pulse="subtle"
              className="w-full h-auto p-4 text-left justify-start bg-slate-700/30 hover:bg-slate-600/50 text-slate-100 border-slate-600 hover:border-orange-500 transition-all duration-200"
              onClick={() => handleQuestionClick("proactive-service-trend")}
              disabled={questionMutation.isPending}
              data-testid="featured-question-proactive"
            >
              <Zap className="h-5 w-5 mr-3 text-orange-400 flex-shrink-0" />
              <div>
                <div className="font-medium">Miksi proaktiivinen asiakaspalvelu on vuoden 2025 megatrendi?</div>
                <div className="text-xs text-slate-400 mt-1">Ennakoiva asiakaspalvelu</div>
              </div>
            </PulseButton>
            
            <PulseButton
              variant="outline"
              size="lg"
              pulse="subtle"
              className="w-full h-auto p-4 text-left justify-start bg-slate-700/30 hover:bg-slate-600/50 text-slate-100 border-slate-600 hover:border-blue-500 transition-all duration-200"
              onClick={() => handleQuestionClick("cx-trends-2025-featured")}
              disabled={questionMutation.isPending}
              data-testid="featured-question-trends"
            >
              <BarChart3 className="h-5 w-5 mr-3 text-blue-400 flex-shrink-0" />
              <div>
                <div className="font-medium">2025 suurimmat CX-trendit ja AI:n rooli</div>
                <div className="text-xs text-slate-400 mt-1">Strateginen näkemys tulevaisuudesta</div>
              </div>
            </PulseButton>
            
            <PulseButton
              variant="outline"
              size="lg"
              pulse="subtle"
              className="w-full h-auto p-4 text-left justify-start bg-slate-700/30 hover:bg-slate-600/50 text-slate-100 border-slate-600 hover:border-green-500 transition-all duration-200"
              onClick={() => handleQuestionClick("roi-measurement")}
              disabled={questionMutation.isPending}
              data-testid="featured-question-roi"
            >
              <DollarSign className="h-5 w-5 mr-3 text-green-400 flex-shrink-0" />
              <div>
                <div className="font-medium">Miten AI-investoinnista saa mitattavaa arvoa?</div>
                <div className="text-xs text-slate-400 mt-1">ROI ja konkreettiset hyödyt</div>
              </div>
            </PulseButton>

            <PulseButton
              variant="outline"
              size="lg"
              pulse="subtle"
              className="w-full h-auto p-4 text-left justify-start bg-slate-700/30 hover:bg-slate-600/50 text-slate-100 border-slate-600 hover:border-red-500 transition-all duration-200"
              onClick={() => handleQuestionClick("reduce-manual-work")}
              disabled={questionMutation.isPending}
              data-testid="featured-question-automation"
            >
              <Workflow className="h-5 w-5 mr-3 text-red-400 flex-shrink-0" />
              <div>
                <div className="font-medium">Miten automaatio voi vähentää manuaalista työtä?</div>
                <div className="text-xs text-slate-400 mt-1">Prosessien tehostaminen</div>
              </div>
            </PulseButton>

            <PulseButton
              variant="outline"
              size="lg"
              pulse="subtle"
              className="w-full h-auto p-4 text-left justify-start bg-slate-700/30 hover:bg-slate-600/50 text-slate-100 border-slate-600 hover:border-cyan-500 transition-all duration-200"
              onClick={() => handleQuestionClick("data-quality")}
              disabled={questionMutation.isPending}
              data-testid="featured-question-data"
            >
              <Shield className="h-5 w-5 mr-3 text-cyan-400 flex-shrink-0" />
              <div>
                <div className="font-medium">Miten asiakasdata pysyy laadukkaana ja suojattuna?</div>
                <div className="text-xs text-slate-400 mt-1">Tietosuoja ja laatuvaatimukset</div>
              </div>
            </PulseButton>
          </div>

          {/* More topics toggle */}
          <div className="mt-4 pt-4 border-t border-slate-600/50">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-slate-300 hover:text-white hover:bg-slate-700/50"
              onClick={toggleExpanded}
              data-testid="toggle-more-questions"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Näytä lisää aiheita ({topicAreas.length} kategoriaa)
            </Button>
          </div>
        </div>

        {/* Extended questions view */}
        <div className={`border-t border-border transition-all duration-300 ${
          isExpanded ? 'p-6 max-h-96 overflow-y-auto opacity-100' : 'max-h-0 overflow-hidden opacity-0 p-0'
        }`}>
          <div className="space-y-4">
            {topicAreas.slice(0, 6).map((topic) => {
              const TopicIcon = topic.icon;
              return (
                <div key={topic.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TopicIcon className={`h-4 w-4 ${topic.color.replace('bg-', 'text-')}`} />
                    <h5 className="text-sm font-medium text-white">{topic.title}</h5>
                  </div>
                  <div className="grid grid-cols-1 gap-2 ml-6">
                    {topic.questions.slice(0, 2).map((question) => {
                      const QuestionIcon = question.icon;
                      return (
                        <Button
                          key={question.id}
                          variant="ghost"
                          size="sm"
                          className="h-auto p-3 text-xs text-left justify-start hover:bg-slate-700/50 text-slate-300 hover:text-white"
                          onClick={() => handleQuestionClick(question.id)}
                          disabled={questionMutation.isPending}
                          data-testid={`question-${question.id}`}
                        >
                          <QuestionIcon className="h-3 w-3 mr-2 text-slate-400 flex-shrink-0" />
                          <span className="leading-tight">{question.question}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-600/50">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-slate-400 hover:text-slate-200"
              onClick={toggleExpanded}
              data-testid="collapse-questions"
            >
              <Minimize2 className="h-4 w-4 mr-2" />
              Piilota lisäkysymykset
            </Button>
          </div>
        </div>
      </Card>

      {/* MCP Deep Analysis Button */}
      <div className="mt-6 mb-8">
        <Dialog open={mcpModalOpen} onOpenChange={setMcpModalOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full bg-emerald-950 border-emerald-800 hover:bg-emerald-900 text-emerald-300"
              data-testid="mcp-deep-analysis-button"
            >
              <FileText className="h-4 w-4 mr-2" />
              Syväanalyysi MCP
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-emerald-300 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Model Context Protocol (MCP) - Syväanalyysi
              </DialogTitle>
              <DialogDescription>
                Kattava analyysi MCP:n käytöstä ja tietoturvaeduista AI-integraatioissa
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[70vh] pr-4">
              <div className="space-y-6">
                {/* Johdanto */}
                <section>
                  <h3 className="text-lg font-semibold mb-3 text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Mikä on MCP ja miksi sitä tarvitaan?
                  </h3>
                  <div className="max-w-none text-gray-100">
                    <p className="mb-3 text-gray-100">
                      <strong className="text-white">Model Context Protocol (MCP)</strong> on avoin standardi, joka määrittelee tavan liittää suuria kielimalleja ja tekoälyagentteja ulkoisiin tieto- ja työkalulähteisiin. Sen avulla AI-avustajat eivät enää ole eristyksissa vain omien koulutusdatojensa varassa, vaan ne voivat päästä käsiksi reaaliaikaiseen tietoon ja järjestelmiin turvallisesti.
                    </p>
                    <p className="mb-3 text-gray-100">
                      MCP toimii kuin eräänlainen erikoistunut API-rajapinta tekoälylle: AI-agentti voi sen kautta "keskustella" yrityksen tietokantojen, sovellusten tai palveluiden kanssa yhtenäisellä tavalla. Tämä avaa uusia käyttömahdollisuuksia – esimerkiksi AI voi hakea tietoa yrityksen sisäisistä järjestelmistä, päivittää tietueita tai suorittaa toimintoja.
                    </p>
                    <div className="bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-3">
                      <p className="text-sm text-yellow-100">
                        <strong className="text-yellow-50">Huomio:</strong> MCP on vain rajapinta – se itsessään ei sisällä automaattisesti turvamekanismeja kuten autentikointia tai pääsynhallintaa. Organisaation tehtävä on päättää, mitkä "ovet ovat auki ja kenelle".
                      </p>
                    </div>
                  </div>
                </section>

                {/* Käyttöhyödyt */}
                <section>
                  <h3 className="text-lg font-semibold mb-3 text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    MCP:n hyödyt käytön näkökulmasta
                  </h3>
                  <div className="max-w-none text-gray-100">
                    <p className="mb-3 text-gray-100">
                      Käyttöympäristön kannalta MCP:n suurin etu on, että se parantaa tekoälyn kykyä antaa relevantteja vastauksia ja suorittaa tehtäviä käyttämällä organisaation omaa dataa ja työkaluja.
                    </p>
                    
                    <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold mb-2 text-white">Käytännön esimerkki: Asiakaspalveluchatbot</h4>
                      <p className="text-sm mb-2 text-gray-100">
                        MCP:n avulla asiakaspalvelubot voi hakea tietoa useista lähteistä asiakkaan kysymyksen ratkaisemiseksi:
                      </p>
                      <ul className="text-sm list-disc pl-4 space-y-1 text-gray-100">
                        <li>Tarkistaa tilauksen tilan ERP-järjestelmästä</li>
                        <li>Hakee tuotetietoja tietokannasta</li>
                        <li>Luo tukipyynnön tiketöintijärjestelmään</li>
                        <li>Aloittaa palautusprosessin automaattisesti</li>
                      </ul>
                    </div>

                    <p className="mb-3 text-gray-100">
                      <strong className="text-white">Organisaation hyödyt:</strong> Rutiinitehtävät hoituvat automatisoidusti, henkilöstö voi keskittyä vaativampiin tehtäviin, ja AI:n toimet perustuvat ajantasaiseen ja oikeaan tietoon.
                    </p>
                  </div>
                </section>

                {/* Tietoturva */}
                <section>
                  <h3 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Tietoturva ja pääsynhallinta
                  </h3>
                  <div className="max-w-none text-gray-100">
                    <p className="mb-4 text-gray-100">
                      MCP:n tuoma voimakas integraatiokyky asettaa tietoturvalle erityisvaatimuksia. Koska AI-agentti voi MCP:n kautta toimia ikään kuin käyttäjänä eri järjestelmissä, on välttämätöntä varmistaa asianmukainen pääsynhallinta.
                    </p>

                    <div className="grid gap-4 mb-4">
                      <div className="bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 text-red-200 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          1. Roolipohjainen pääsy (RBAC)
                        </h4>
                        <p className="text-sm mb-2 text-red-100">
                          AI-agentille annetaan vain ne oikeudet, jotka sen tehtävän hoitamiseen tarvitaan – ei enempää. Periaatteena on <strong className="text-red-50">vähimmän oikeuden periaate</strong>.
                        </p>
                        <p className="text-sm text-red-100">
                          <em>Esimerkki:</em> Asiakaspalvelubotin MCP-palvelin voidaan toteuttaa niin, että botti pystyy hakemaan vain kyseisen asiakkaan tiedot CRM:stä, ei koskaan muiden asiakkaiden tietoja.
                        </p>
                      </div>

                      <div className="bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 text-orange-200 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          2. Eksplisiittinen kontekstin rajaus
                        </h4>
                        <p className="text-sm mb-2 text-orange-100">
                          Tekoälylle syötetään vain kulloinkin tarpeellinen tieto tai päästään käsiksi vain rajattuun resurssiin. Konteksti voidaan rajata tiettyyn asiakkaaseen, tukipyyntöön tai tehtäväalueeseen.
                        </p>
                        <p className="text-sm text-orange-100">
                          <em>Hyöty:</em> AI ei voi vahingossakaan lipsauttaa tietoja kontekstin ulkopuolelta, koska se ei pääse niihin käsiksi.
                        </p>
                      </div>

                      <div className="bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 text-purple-200 flex items-center gap-2">
                          <Database className="h-4 w-4" />
                          3. Audit-jäljet ja valvonta
                        </h4>
                        <p className="text-sm mb-2 text-purple-100">
                          Kaikesta AI:n toiminnasta jää läpinäkyvä loki. Järjestelmä kirjaa ylös kuka/mikä agentti teki mitä, mihin aikaan, ja oliko toimi sallittu.
                        </p>
                        <p className="text-sm text-purple-100">
                          <em>Esimerkki lokimerkinnästä:</em> "AI-agentti X haki asiakkaan Y osoitetiedot CRM:stä 21.9.2025 klo 14:05 käyttäjän Z pyynnöstä"
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                      <h4 className="font-semibold mb-2 text-white">Lisäturvatoimet:</h4>
                      <ul className="text-sm list-disc pl-4 space-y-1 text-gray-100">
                        <li>Autentikointi ja salaus (TLS-suojatut MCP-kutsut)</li>
                        <li>Syötevalidointi (estää haitallisten syötteiden johdattelun)</li>
                        <li>Nopeusrajoitukset (estetään ylikuormitus)</li>
                        <li>Hätätapauksien esto (työkalujen valkolistat, hälytykset)</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Sääntely ja luottamus */}
                <section>
                  <h3 className="text-lg font-semibold mb-3 text-slate-400 flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    Sääntely- ja luottamusnäkökulma
                  </h3>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="mb-3">
                      MCP:n käyttöönotto merkitsee uudenlaista vastuuta sääntelyn noudattamisesta ja interessiryhmien luottamuksen säilyttämisestä. Koska AI pääsee käsiksi potentiaalisesti arkaluonteiseen dataan, läpinäkyvyys ja kontrolli korostuvat.
                    </p>

                    <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold mb-2 text-white">GDPR ja vaatimustenmukaisuus</h4>
                      <p className="text-sm mb-2">
                        EU:n GDPR edellyttää, että henkilötietoja käsitellään asianmukaisin suojamekanismein ja vain käyttötarkoituksiinsa rajatusti. MCP:n roolipohjainen pääsy ja kontekstin rajaus tukevat näitä vaatimuksia.
                      </p>
                      <p className="text-sm">
                        <strong>Compliance-periaate:</strong> Jokainen tekoälytoiminto on nähtävä kuin mikä tahansa liiketoimintatapahtuma, joka pitää tarvittaessa voida tarkastaa jälkikäteen.
                      </p>
                    </div>

                    <div className="bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 text-green-200">Asiakkaiden luottamus</h4>
                      <p className="text-sm mb-2">
                        Tutkimusten mukaan jopa 66% asiakkaista on huolissaan tietosuojasta asioidessaan tekoälyä hyödyntävien palveluiden kanssa.
                      </p>
                      <p className="text-sm">
                        <strong>Ratkaisu:</strong> Läpinäkyvä viestintä siitä, mitä tietoja AI haki asiakkaan kysymyksen ratkaisemiseksi ja että sillä ei ole pääsyä mihinkään muuhun.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Johtopäätökset */}
                <section>
                  <h3 className="text-lg font-semibold mb-3 text-white flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Johtopäätökset
                  </h3>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="mb-3">
                      Model Context Protocol tarjoaa uuden tehokkaan tavan integroida tekoäly osaksi yrityksen tietojärjestelmiä ja prosesseja. Sen avulla AI pystyy hyödyntämään vain haluttua osajoukkoa tietoa tuottaakseen parempia vastauksia ja hoitaakseen tehtäviä automaattisesti.
                    </p>
                    
                    <div className="bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 text-emerald-100">MCP:n arvon kaksijako:</h4>
                      <div className="text-sm space-y-2">
                        <p><strong>Mahdollistaja:</strong> Tuo tekoälyn osaksi arkea ennennäkemättömillä tavoilla</p>
                        <p><strong>Hallinnan työväline:</strong> Tarjoaa keinot rajata ja seurata tekoälyn toimintaa</p>
                      </div>
                    </div>

                    <p className="mt-4">
                      <strong>Lopputulos:</strong> Hyödyntämällä MCP:tä vastuullisesti organisaatiot voivat nousta tekoälyn seuraavalle tasolle ilman, että kontrolli tai luottamus karkaa käsistä.
                    </p>
                  </div>
                </section>

                {/* Lähteet */}
                <section>
                  <h3 className="text-lg font-semibold mb-3 text-white flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Lähteet ja lisätietoa
                  </h3>
                  <div className="text-xs text-white space-y-2">
                    <div>
                      <p className="font-medium">Keskeiset lähteet:</p>
                      <ul className="list-disc pl-4 mt-1 space-y-1">
                        <li>Anthropic: Introducing the Model Context Protocol</li>
                        <li>CyberArk: What is Model Context Protocol (MCP)?</li>
                        <li>Cerbos: MCP Authorization with Fine-Grained Access Control</li>
                        <li>Zenity: Securing the Model Context Protocol</li>
                        <li>USDM: The Model Context Protocol in Life Sciences</li>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      
      {/* AI Response Modal */}
      <Dialog open={aiModalOpen} onOpenChange={setAiModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-primary flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Assistentti
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {currentQuestion}
            </DialogDescription>
          </DialogHeader>
          
          {/* Modal Chat Messages */}
          <ScrollArea className="h-[60vh] pr-4 border rounded-lg">
            <div className="p-4 space-y-4">
              {modalMessages.map((message, index) => (
                <div key={index} className="chat-message" data-testid={`modal-message-${index}`}>
                  <div className={`flex items-start space-x-3 ${message.isUser ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 ${message.isUser ? 'bg-secondary' : 'bg-primary'} rounded-full flex items-center justify-center flex-shrink-0`}>
                      {message.isUser ? (
                        <User className="h-4 w-4 text-secondary-foreground" />
                      ) : (
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      )}
                    </div>
                    <div className={`${message.isUser ? 'bg-primary text-primary-foreground max-w-xs' : 'bg-muted max-w-2xl'} rounded-lg p-3`}>
                      <div className={`text-sm ${message.isUser ? '' : 'text-foreground'}`}>
                        {message.isUser ? (
                          <span className="whitespace-pre-wrap">{message.content}</span>
                        ) : (
                          <div className="max-w-none text-gray-100">
                            <ReactMarkdown 
                              remarkPlugins={[remarkGfm]}
                              components={{
                                h1: ({children}) => <h1 className="text-lg font-bold mb-2 text-white">{children}</h1>,
                                h2: ({children}) => <h2 className="text-base font-semibold mb-2 text-white">{children}</h2>,
                                h3: ({children}) => <h3 className="text-sm font-medium mb-1 text-gray-100">{children}</h3>,
                                p: ({children}) => <p className="mb-2 last:mb-0 text-gray-100">{children}</p>,
                                ul: ({children}) => <ul className="list-disc pl-4 mb-2 text-gray-100">{children}</ul>,
                                ol: ({children}) => <ol className="list-decimal pl-4 mb-2 text-gray-100">{children}</ol>,
                                li: ({children}) => <li className="mb-1 text-gray-100">{children}</li>,
                                strong: ({children}) => <strong className="font-semibold text-white">{children}</strong>,
                                em: ({children}) => <em className="italic text-gray-200">{children}</em>,
                                code: ({children}) => <code className="bg-slate-700 text-gray-100 px-1 py-0.5 rounded text-xs">{children}</code>,
                                blockquote: ({children}) => <blockquote className="border-l-2 border-slate-500 pl-3 italic text-gray-200">{children}</blockquote>
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
              
              {modalChatMutation.isPending && (
                <div className="chat-message" data-testid="modal-loading-message">
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
              
              {/* Modal Follow-up Suggestions */}
              {modalFollowUpSuggestions.length > 0 && (
                <div className="chat-message" data-testid="modal-follow-up-suggestions">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <div className="bg-accent/50 rounded-lg p-3 max-w-2xl">
                      <p className="text-sm font-medium mb-2 text-accent-foreground">Jatkokysymyksiä:</p>
                      <div className="space-y-2">
                        {modalFollowUpSuggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-left h-auto py-2 px-3 justify-start whitespace-normal bg-background/80 hover:bg-background text-foreground"
                            onClick={() => handleModalFollowUpClick(suggestion)}
                            data-testid={`modal-follow-up-${index}`}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={modalMessagesEndRef} />
            </div>
          </ScrollArea>
          
          {/* Modal Chat Input */}
          <div className="border-t border-border p-4 bg-background">
            <div className="flex space-x-3">
              <Input
                type="text"
                placeholder="Jatka keskustelua..."
                value={modalInputValue}
                onChange={(e) => setModalInputValue(e.target.value)}
                onKeyPress={handleModalKeyPress}
                disabled={modalChatMutation.isPending}
                className="flex-1"
                data-testid="modal-chat-input"
              />
              <Button
                onClick={handleModalSend}
                disabled={modalChatMutation.isPending || !modalInputValue.trim()}
                size="icon"
                data-testid="modal-send-button"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              <span>Kysy tarkentavia kysymyksiä aiheesta tai valitse jatkokysymys yllä olevista ehdotuksista.</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>

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
