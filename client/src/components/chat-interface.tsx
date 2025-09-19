import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Send } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: number;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      content: "Hei! Voin kertoa lisää näistä AI-asiakaspalvelutoteutuksista. Kysy esimerkiksi teknisistä yksityiskohdista, kustannuksista, tai toteutusvinkeistä humm.fi:lle.",
      isUser: false,
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", { message });
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

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4" data-testid="chat-messages">
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
                  <p className={`text-sm ${message.isUser ? '' : 'text-muted-foreground'}`}>
                    {message.content}
                  </p>
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
