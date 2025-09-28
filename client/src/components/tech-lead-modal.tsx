import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { PulseButton } from "@/components/ui/pulse-button";
import { Bot, User, Send, Star, Users, ExternalLink } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { handoffToTidio, isTidioConfigured, initializeTidio } from "@/lib/tidio";

interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: number;
}

interface TechLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TechLeadModal({ isOpen, onClose }: TechLeadModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isHandedOff, setIsHandedOff] = useState(false);
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
      }]);
      
      // Handle Tidio handoff when requested
      if (data.handoff_requested) {
        handleTidioHandoff(data.response);
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


  const handleSend = () => {
    const message = inputValue.trim();
    if (!message || techLeadChatMutation.isPending || isHandedOff) return;

    setMessages(prev => [...prev, {
      content: message,
      isUser: true,
      timestamp: Date.now()
    }]);

    setInputValue("");
    techLeadChatMutation.mutate({ message });
  };

  const handleExampleClick = (question: string) => {
    if (techLeadChatMutation.isPending || isHandedOff) return;

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

  // Handle handoff to Tidio
  const handleTidioHandoff = async (aiResponse: string) => {
    const configured = await isTidioConfigured();
    if (!configured) {
      toast({
        title: "Live chat ei käytettävissä",
        description: "Tidio-integraatio ei ole konfiguroitu. Ota yhteyttä sivuston ylläpitäjään.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Add system message about handoff
      setMessages(prev => [...prev, {
        content: "🔄 **Siirretään keskustelu live chattiin**\n\nKeskustelu siirretään nyt Tidio live chattiin, jossa voit keskustella suoraan asiakaspalvelun kanssa. Chat-ikkuna avautuu automaattisesti.",
        isUser: false,
        timestamp: Date.now()
      }]);

      // Wait a moment for UI update
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Perform handoff to Tidio
      const success = await handoffToTidio(messages, inputValue.trim());
      
      if (success) {
        setIsHandedOff(true);
        setInputValue("");
        
        toast({
          title: "Siirretty live chattiin",
          description: "Keskustelu jatkuu Tidio live chatissa. Chat-ikkuna on avattu.",
        });
      } else {
        throw new Error('Handoff failed');
      }
    } catch (error) {
      toast({
        title: "Virhe live chat -siirrossa",
        description: "Keskustelua ei voitu siirtää. Yritä uudelleen tai ota yhteyttä suoraan.",
        variant: "destructive"
      });
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

  // Initialize Tidio and send greeting when modal opens
  useEffect(() => {
    if (isOpen) {
      // Initialize Tidio integration
      initializeTidio();
      
      // Send greeting if not done yet
      if (!hasGreeted) {
        sendGreeting();
      }
    }
  }, [isOpen, hasGreeted, sendGreeting]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsHandedOff(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl border-slate-600/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            {isHandedOff ? "🔄 Siirretty Live Chattiin" : "Tech Lead - Panu Murtokangas"}
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            {isHandedOff 
              ? "Keskustelu siirretty Tidio live chattiin. Voit sulkea tämän ikkunan."
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
                      message.isUser ? 'bg-blue-600' : 'bg-slate-600'
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
                        <span className="text-xs text-slate-300">
                          Mietin vastausta...
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
                  loading={techLeadChatMutation.isPending}
                  data-testid={`tech-lead-example-${index}`}
                >
                  <span className="text-xs">{suggestion}</span>
                </PulseButton>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          {!isHandedOff ? (
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
          ) : (
            <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-green-400 font-medium mb-2">
                <ExternalLink className="h-4 w-4" />
                Keskustelu siirretty live chattiin
              </div>
              <p className="text-sm text-slate-300 mb-3">
                Keskustelu jatkuu Tidio live chat -ikkunassa. Jos chat ei auennut automaattisesti, etsi chat-kuvake sivun oikeasta alakulmasta.
              </p>
              <PulseButton
                onClick={onClose}
                variant="outline"
                size="sm"
                className="border-green-600/50 text-green-400 hover:bg-green-900/30"
                data-testid="close-after-handoff"
              >
                Sulje tämä ikkuna
              </PulseButton>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}