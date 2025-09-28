import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { PulseButton } from "@/components/ui/pulse-button";
import { Bot, User, Send, Star, Users } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: number;
  agent?: string; // "ai_panu" or "replit_agent"
}

interface TechLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TechLeadModal({ isOpen, onClose }: TechLeadModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [sessionId] = useState(() => Date.now().toString());
  const [followUpSuggestions] = useState<string[]>([
    "Mitä arvoa voisit tuoda Hummille?",
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
        timestamp: Date.now(),
        agent: "ai_panu"
      }]);
      
      // Check if handoff was requested
      if (data.handoff_requested) {
        setIsLiveMode(true);
        setMessages(prev => [...prev, {
          content: "🔄 **Live chat aktivoitu** - Nyt puhut suoraan Replit Agent:in kanssa, joka voi auttaa teknisemmissä kysymyksissä!",
          isUser: false,
          timestamp: Date.now(),
          agent: "system"
        }]);
      }
    },
    onError: () => {
      toast({
        title: "Virhe",
        description: "Viestin lähettäminen epäonnistui. Yritä uudelleen.",
        variant: "destructive"
      });
    }
  });

  const liveChatMutation = useMutation({
    mutationFn: async (data: { message: string }) => {
      const response = await apiRequest("POST", "/api/live-chat", { 
        message: data.message,
        session_id: sessionId
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        content: data.response,
        isUser: false,
        timestamp: Date.now(),
        agent: "replit_agent"
      }]);
    },
    onError: () => {
      toast({
        title: "Virhe",
        description: "Live chat viestin lähettäminen epäonnistui. Yritä uudelleen.",
        variant: "destructive"
      });
    }
  });

  const handleSend = () => {
    const message = inputValue.trim();
    const activeMutation = isLiveMode ? liveChatMutation : techLeadChatMutation;
    if (!message || activeMutation.isPending) return;

    setMessages(prev => [...prev, {
      content: message,
      isUser: true,
      timestamp: Date.now()
    }]);

    setInputValue("");
    activeMutation.mutate({ message });
  };

  const handleExampleClick = (question: string) => {
    const activeMutation = isLiveMode ? liveChatMutation : techLeadChatMutation;
    if (activeMutation.isPending) return;

    setMessages(prev => [...prev, {
      content: question,
      isUser: true,
      timestamp: Date.now()
    }]);

    activeMutation.mutate({ message: question });
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
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isLiveMode 
                ? "bg-gradient-to-r from-green-600 to-green-700 animate-pulse" 
                : "bg-gradient-to-r from-blue-600 to-blue-700"
            }`}>
              {isLiveMode ? (
                <Users className="h-4 w-4 text-white" />
              ) : (
                <Users className="h-4 w-4 text-white" />
              )}
            </div>
            {isLiveMode ? "🔴 Live Chat - Replit Agent" : "Tech Lead - Panu Murtokangas"}
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            {isLiveMode 
              ? "Live chat: Tekninen avustaja auttaa sovelluskehityksessä ja ongelmanratkaisussa"
              : "CV-chat: Keskustele taustastani ja osaamisestani Humm Group Oy:n kontekstissa"
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col h-[70vh]">
          {/* Chat Messages */}
          <ScrollArea className="flex-1 px-1">
            <div className="space-y-4 pb-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-3 max-w-[80%] ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.isUser 
                        ? 'bg-blue-600' 
                        : message.agent === 'replit_agent'
                          ? 'bg-green-600'
                          : message.agent === 'system'
                            ? 'bg-yellow-600'
                            : 'bg-slate-600'
                    }`}>
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
              
              {(techLeadChatMutation.isPending || liveChatMutation.isPending) && (
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
                        <span className="text-xs text-slate-300">
                          {isLiveMode ? "Replit Agent kirjoittaa..." : "Mietin vastausta..."}
                        </span>
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
                  loading={techLeadChatMutation.isPending || liveChatMutation.isPending}
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
              disabled={techLeadChatMutation.isPending || liveChatMutation.isPending}
              className="flex-1 bg-slate-700/50 border-slate-600 focus:border-blue-500 text-slate-100 placeholder:text-slate-400"
              data-testid="tech-lead-chat-input"
            />
            <PulseButton
              onClick={handleSend}
              loading={techLeadChatMutation.isPending || liveChatMutation.isPending}
              disabled={!inputValue.trim()}
              pulse="subtle"
              className={`px-4 ${isLiveMode ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
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