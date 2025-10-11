import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/ui/Markdown";
import { Send, Bot, User, Sparkles, Briefcase, Target, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface TechLeadChatProps {
  variant?: "modal" | "standalone";
  initialMessages?: Message[];
  autoGreet?: boolean;
}

const EXAMPLE_QUESTIONS = [
  {
    icon: Briefcase,
    title: "Koulutus & tausta",
    question: "Kerro koulutuksestasi ja työkokemuksestasi",
    gradient: "from-blue-500/80 to-cyan-600/80"
  },
  {
    icon: Target,
    title: "€10M visio",
    question: "Miten saavutat €10M liikevaihdon?",
    gradient: "from-purple-500/80 to-pink-600/80"
  },
  {
    icon: TrendingUp,
    title: "Teknologia-strategia",
    question: "Mikä on teknologia-strategiasi ensimmäisille 30 päivälle?",
    gradient: "from-amber-500/80 to-orange-600/80"
  }
];

export function TechLeadChat({
  variant = "modal",
  initialMessages = [],
  autoGreet = true
}: TechLeadChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isGreeting, setIsGreeting] = useState(autoGreet);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-greeting on mount
  useEffect(() => {
    if (autoGreet && messages.length === 0) {
      const greetingText = `Hei! Olen Panu, ja haen Tech Lead -roolia Humm Group Oy:hyn.

Elämän haasteet ovat opettaneet minulle sinnikkyyden ja määrätietoisuuden – ominaisuuksia, jotka ovat kriittisiä teknologia-johtajuudessa. Olen tutustunut perusteellisesti Hummin toimintaan ja näen valtavan potentiaalin AI-transformaatiossa.

Olen valmis vastaamaan kysymyksiisi €10M visiosta, teknologia-strategiasta tai mistä tahansa muusta! Voit myös valita jonkin alla olevista aiheista.`;

      // Simulate streaming effect
      let currentText = "";
      let index = 0;
      const interval = setInterval(() => {
        if (index < greetingText.length) {
          currentText += greetingText[index];
          setMessages([{
            role: "assistant",
            content: currentText,
            timestamp: new Date()
          }]);
          index++;
        } else {
          clearInterval(interval);
          setIsGreeting(false);
        }
      }, 20);

      return () => clearInterval(interval);
    }
  }, [autoGreet]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch("/api/tech-lead-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      if (!response.ok) throw new Error("Chat request failed");
      return response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.response,
        timestamp: new Date()
      }]);
    }
  });

  const handleSend = () => {
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(input.trim());
    setInput("");
  };

  const handleExampleClick = (question: string) => {
    setInput(question);
    // Auto-send after a short delay
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`flex flex-col ${variant === "standalone" ? "h-screen" : "h-full"}`}>
      {/* Header */}
      {variant === "standalone" && (
        <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Tech Lead Chat</h2>
              <p className="text-xs text-slate-400">Kysy mitä tahansa hakemuksestani</p>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/20">
        <AnimatePresence>
          {messages.map((message, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}

              <div className={`max-w-[80%] ${message.role === "user" ? "order-first" : ""}`}>
                <div className={`rounded-lg p-4 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800/50 border border-slate-700/50"
                }`}>
                  {message.role === "user" ? (
                    <span className="text-sm whitespace-pre-wrap">{message.content}</span>
                  ) : (
                    <Markdown
                      components={{
                        h1: ({children}) => <h1 className="text-lg font-bold mb-2 text-white">{children}</h1>,
                        h2: ({children}) => <h2 className="text-base font-semibold mb-2 text-white">{children}</h2>,
                        h3: ({children}) => <h3 className="text-sm font-medium mb-1 text-gray-100">{children}</h3>,
                        p: ({children}) => <p className="mb-2 last:mb-0 text-gray-100 text-sm">{children}</p>,
                        ul: ({children}) => <ul className="list-disc pl-4 mb-2 text-gray-100">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal pl-4 mb-2 text-gray-100">{children}</ol>,
                        li: ({children}) => <li className="mb-1 text-gray-100 text-sm">{children}</li>,
                        strong: ({children}) => <strong className="font-semibold text-white">{children}</strong>,
                        em: ({children}) => <em className="italic text-gray-200">{children}</em>,
                        code: ({children}) => <code className="bg-slate-700 text-gray-100 px-1 py-0.5 rounded text-xs">{children}</code>,
                        blockquote: ({children}) => <blockquote className="border-l-2 border-slate-500 pl-3 italic text-gray-200">{children}</blockquote>
                      }}
                    >
                      {message.content}
                    </Markdown>
                  )}
                </div>
              </div>

              {message.role === "user" && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-300" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading state */}
        {chatMutation.isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white animate-pulse" />
              </div>
            </div>
            <div className="flex-1">
              <div className="rounded-lg p-4 bg-slate-800/50 border border-slate-700/50">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Example Questions - show only if no user messages yet */}
      {messages.filter(m => m.role === "user").length === 0 && !isGreeting && (
        <div className="px-6 py-4 border-t border-slate-700/50">
          <p className="text-xs text-slate-400 mb-3">Esimerkkikysymyksiä:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {EXAMPLE_QUESTIONS.map((example, idx) => {
              const Icon = example.icon;
              return (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => handleExampleClick(example.question)}
                  className={`text-left p-3 rounded-lg bg-gradient-to-r ${example.gradient} hover:scale-[1.02] transition-all border border-slate-700/50 group`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-white" />
                    <span className="text-xs font-semibold text-white">{example.title}</span>
                  </div>
                  <p className="text-xs text-white/80">{example.question}</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Kysy mitä tahansa..."
            disabled={chatMutation.isPending || isGreeting}
            className="flex-1 bg-slate-800/50 border-slate-700"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || chatMutation.isPending || isGreeting}
            size="icon"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
