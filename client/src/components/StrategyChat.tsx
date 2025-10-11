import { useState, useEffect, useRef } from "react";
import { Send, Loader2, Sparkles, User, Bot, ChevronDown, X, MessageSquare, Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface StrategyChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StrategyChat({ isOpen, onClose }: StrategyChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderText, setPlaceholderText] = useState("");

  // Example questions with animations
  const exampleQuestions = [
    "Mikä on realistinen vuosibudjetti AI-transformaatiolle?",
    "Miten 10M€ visio on saavutettavissa 5 vuodessa?",
    "Miksi nyt on oikea hetki aloittaa - aikaikkunat?",
    "Miten agentic AI eroaa perinteisistä chatboteista?",
    "Mitkä ovat suurimmat riskit ja miten ne vältetään?",
    "Mitä Klarnan 73% tuottavuushyppy opettaa meille?",
  ];

  // Typewriter effect for placeholder
  useEffect(() => {
    const currentExample = exampleQuestions[placeholderIndex];
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex <= currentExample.length) {
        setPlaceholderText(currentExample.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setPlaceholderIndex((prev) => (prev + 1) % exampleQuestions.length);
        }, 3000);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [placeholderIndex]);

  // Prevent page scroll when chat opens
  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;

      // Prevent scroll immediately
      window.scrollTo(0, scrollY);

      // Keep position locked for a moment while widget animates in
      const preventScroll = () => {
        window.scrollTo(0, scrollY);
      };

      window.addEventListener('scroll', preventScroll);

      // Remove lock after animation completes
      const timeout = setTimeout(() => {
        window.removeEventListener('scroll', preventScroll);
      }, 300);

      return () => {
        window.removeEventListener('scroll', preventScroll);
        clearTimeout(timeout);
      };
    }
  }, [isOpen]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content:
            "👋 Hei! Olen Panun virtuaaliavustaja.\n\nVoin vastata kysymyksiin Hummin AI-transformaatiosta, 10M€ visiosta, budjetoinnista, teknologiavalinnoista ja murroksen merkityksestä.\n\nVastaukseni perustuvat Hummin strategia-analyysiin, tilinpäätökseen ja toimialan parhaista käytännöistä. Kysy rohkeasti!",
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call RAG endpoint with streaming
      const response = await fetch("/api/rag/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          topK: 5,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      // Create assistant message placeholder
      const assistantMessageId = `assistant-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        },
      ]);

      // Read streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No reader available");

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));

            if (data.chunk) {
              // Accumulate text chunks
              accumulatedContent += data.chunk;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: accumulatedContent }
                    : msg
                )
              );
            }

            if (data.done) {
              // Streaming complete
              break;
            }

            if (data.error) {
              throw new Error(data.error);
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "❌ Pahoittelut, tapahtui virhe. Varmista että strategia-dokumentti on ladattu serverille (/api/rag/upload).",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (question: string) => {
    setInput(question);
  };

  if (!isOpen) return null;

  // Minimized floating button (mobile & desktop)
  if (isMinimized) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 shadow-2xl flex items-center justify-center hover:scale-110 transition-transform border-2 border-purple-400/50"
      >
        <MessageSquare className="h-6 w-6 text-white" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
      </motion.button>
    );
  }

  return (
    <>
      {/* Backdrop overlay - mobile always, desktop only when expanded */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 ${
          isExpanded ? "" : "md:hidden"
        }`}
        onClick={() => isExpanded ? setIsExpanded(false) : setIsMinimized(true)}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className={`fixed ${
          isExpanded
            ? "inset-0 md:inset-4 lg:inset-8"
            : "bottom-0 right-0 left-0 md:bottom-4 md:right-4 md:left-auto md:w-[360px] lg:w-[400px] xl:w-[440px] 2xl:w-[480px] h-[70vh] md:h-[580px] lg:h-[620px] xl:h-[650px]"
        } z-50 flex flex-col`}
        style={{ willChange: 'opacity, transform' }}
      >
      <Card className="flex flex-col h-full bg-gradient-to-br from-purple-900/95 to-blue-900/95 border-2 border-purple-400/50 backdrop-blur-xl shadow-2xl rounded-t-2xl md:rounded-2xl">
        {/* Mobile drag handle */}
        <div className="md:hidden w-full flex justify-center pt-2 pb-1">
          <div className="w-12 h-1 bg-purple-300/50 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-purple-400/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/30 border border-purple-400/50">
              <MessageSquare className="h-5 w-5 text-purple-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Kysy Panulta
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </h3>
              <p className="text-xs text-purple-200">AI-strategia-assistentti</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Minimize button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-white/10 text-white"
              onClick={() => setIsMinimized(true)}
              title="Pienennä"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            {/* Expand button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-white/10 text-white"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Palauta" : "Laajenna koko näytölle"}
            >
              {isExpanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-white/10 text-white"
              onClick={onClose}
              title="Sulje"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-3 sm:p-4">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-2.5 sm:p-3 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-emerald-600 to-blue-600 text-white"
                        : "bg-slate-800/60 text-slate-100 border border-purple-400/20"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        message.role === "user"
                          ? "text-white/60"
                          : "text-purple-300/60"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString("fi-FI", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {message.role === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 justify-start"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-slate-800/60 rounded-2xl p-3 border border-purple-400/20">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                    <span className="text-sm text-slate-300">Ajattelen...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Example Questions - Only show if no messages yet */}
        {messages.length <= 1 && !isLoading && (
          <div className="px-3 sm:px-4 pb-2">
            <p className="text-xs text-purple-200/60 font-medium mb-2">
              Kokeile näitä kysymyksiä:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {exampleQuestions.slice(0, 4).map((question, idx) => (
                <motion.button
                  key={question}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleExampleClick(question)}
                  className="text-xs px-3 py-2 rounded-lg text-left bg-gradient-to-r from-slate-700/40 to-slate-600/40 text-white/70 border border-slate-600/30 hover:from-purple-600/30 hover:to-pink-600/30 hover:text-white hover:border-purple-500/50 transition-all duration-200 font-medium"
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 sm:p-4 border-t border-purple-400/30">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholderText}
                disabled={isLoading}
                className="w-full px-4 py-3 pr-12 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white text-sm placeholder:text-purple-400/50 placeholder:italic focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 hover:scale-105 transition-all flex items-center justify-center shadow-lg shadow-purple-500/20"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </form>

          <div className="mt-2 flex items-center justify-between text-[10px] sm:text-xs text-purple-200/60">
            <div className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span className="hidden sm:inline">Powered by Claude 4.5 Sonnet</span>
              <span className="sm:hidden">Claude 4.5</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>RAG</span>
            </div>
          </div>
        </div>
      </Card>
      </motion.div>
    </>
  );
}
