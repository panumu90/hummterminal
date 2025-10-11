import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles, User, Bot, ChevronUp, ChevronDown, MessageSquare, X } from "lucide-react";
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

export function BottomPromptTray() {
  const [state, setState] = useState<'collapsed' | 'suggestions' | 'chat'>('collapsed');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Example strategy questions
  const suggestions = [
    "Mikä on realistinen vuosibudjetti AI-transformaatiolle?",
    "Miten 10M€ visio saavutetaan 5 vuodessa?",
    "Miksi nyt on oikea hetki aloittaa - aikaikkunat?",
    "Miten agentic AI eroaa perinteisistä chatboteista?",
    "Mitkä ovat suurimmat riskit ja miten ne vältetään?",
    "Mitä Klarnan 73% tuottavuushyppy opettaa meille?",
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (state === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, state]);

  // Focus input when suggestions open
  useEffect(() => {
    if (state === 'suggestions') {
      inputRef.current?.focus();
    }
  }, [state]);

  // Keyboard shortcut: Space to open from collapsed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state === 'collapsed' && e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        setState('suggestions');
      }
      if (state !== 'collapsed' && e.key === 'Escape') {
        setState('collapsed');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state]);

  // Initialize with welcome message when first opening chat
  const initializeChat = () => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content:
            "👋 Hei! Olen **AI-Panu**, Hummin strategia-assistentti.\n\nVoin vastata kysymyksiin:\n\n• **AI-transformaatiosta** - agentti-orkestraatio, RAG, MCP\n• **10M€ visiosta** - miten päästään 2,1M€ → 10M€ viidessä vuodessa\n• **Budjetoinnista** - tarvittavat investoinnit ja ROI-laskelmat\n• **Teknologiasta** - Claude vs GPT, build vs buy, open source\n• **Murroksen merkityksestä** - miksi nyt on oikea hetki\n\nVastaukseni perustuvat Hummin strategia-dokumentteihin, tilinpäätöksiin ja toimialan parhaiden käytäntöihin. **Kysy rohkeasti!**",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleSuggestionClick = (question: string) => {
    setInput(question);
    handleSubmit(new Event('submit') as any, question);
  };

  const handleSubmit = async (e: React.FormEvent, questionOverride?: string) => {
    e.preventDefault();
    const question = questionOverride || input;
    if (!question.trim() || isLoading) return;

    // Switch to chat state if not already
    if (state !== 'chat') {
      initializeChat();
      setState('chat');
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: question,
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
          message: question,
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        layout
        initial={{ y: 100, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          height: state === 'collapsed' ? 'auto' : state === 'suggestions' ? 'auto' : '65vh'
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col"
      >
        {/* Collapsed State - Prompt Bar */}
        {state === 'collapsed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-slate-800/95 backdrop-blur-xl border-t-2 border-purple-500/30 shadow-2xl"
          >
            <button
              onClick={() => setState('suggestions')}
              className="w-full text-left flex items-center gap-4 hover:bg-slate-700/50 transition-colors p-4 group"
            >
              {/* Avatar with online status */}
              <div className="relative flex-shrink-0">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 border-2 border-purple-400/40 group-hover:border-purple-400/60 transition-all">
                  <Bot className="h-6 w-6 text-purple-300" />
                </div>
                {/* Green online indicator */}
                <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-800"></span>
                </span>
              </div>

              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-white text-base font-semibold">AI-Panu</span>
                  <span className="text-emerald-400 text-xs font-medium">● Online</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Konsultoi tai kysy termistöstä: agentti-orkestraatio, tarvittava vuosibudjetti, MCP-protokolla, RAG-teknologia...
                </p>
              </div>

              {/* Hint text + chevron */}
              <div className="flex-shrink-0 flex items-center gap-2 text-slate-500">
                <span className="text-xs hidden xl:block">Välilyönti</span>
                <ChevronUp className="h-4 w-4" />
              </div>
            </button>
          </motion.div>
        )}

        {/* Suggestions State */}
        {state === 'suggestions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-slate-800/98 backdrop-blur-xl border-t-2 border-purple-500/40 shadow-2xl"
          >
            <div className="max-w-7xl mx-auto p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-400/30">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Kysy strategiasta</h3>
                    <p className="text-slate-400 text-sm">Valitse alla olevista tai kirjoita oma kysymyksesi</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setState('collapsed')}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Suggestion Chips */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {suggestions.map((suggestion, idx) => (
                  <motion.button
                    key={suggestion}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-left p-4 rounded-xl bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600/30 hover:border-purple-500/50 transition-all duration-200 group"
                  >
                    <p className="text-sm text-slate-200 group-hover:text-white transition-colors">
                      {suggestion}
                    </p>
                  </motion.button>
                ))}
              </div>

              {/* Input Field */}
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tai kirjoita oma kysymyksesi..."
                  className="w-full px-5 py-4 pr-14 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-lg"
                />
                <button
                  onClick={(e) => handleSubmit(e as any)}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-purple-500/30"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Chat State */}
        {state === 'chat' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="h-full flex flex-col bg-gradient-to-br from-purple-900/98 to-blue-900/98 backdrop-blur-xl border-t-2 border-purple-400/50 shadow-2xl"
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-purple-400/30 bg-slate-900/40">
              <div className="flex items-center gap-3">
                {/* Avatar with status */}
                <div className="relative flex-shrink-0">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/30 to-blue-500/30 border-2 border-purple-400/50">
                    <Bot className="h-5 w-5 text-purple-300" />
                  </div>
                  <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-900"></span>
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    AI-Panu
                    <span className="text-emerald-400 text-xs font-medium">● Online</span>
                  </h3>
                  <p className="text-xs text-purple-200">Claude 4.5 Sonnet + RAG</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setState('collapsed')}
                className="text-white hover:bg-white/10"
              >
                <ChevronDown className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="max-w-5xl mx-auto space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-lg ${message.role === 'user' ? 'bg-gradient-to-br from-emerald-500 to-blue-500' : 'bg-gradient-to-br from-purple-500 to-blue-500'} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        {message.role === 'user' ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-white" />
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div className={`${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-emerald-600 to-blue-600 text-white'
                          : 'bg-slate-800/60 text-slate-100 border border-purple-400/20'
                      } rounded-xl px-4 py-3 shadow-xl`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.role === 'user' ? 'text-white/60' : 'text-purple-300/60'
                        }`}>
                          {message.timestamp.toLocaleTimeString("fi-FI", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Loading State */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start gap-3 max-w-[85%]">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-white animate-pulse" />
                      </div>
                      <div className="bg-slate-800/60 rounded-xl px-4 py-3 border border-purple-400/20">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                          <span className="text-sm text-slate-300">Ajattelen...</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t border-purple-400/30 bg-slate-900/40">
              <div className="max-w-5xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Jatka keskustelua..."
                    disabled={isLoading}
                    className="w-full px-5 py-3.5 pr-14 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder:text-purple-400/50 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 transition-all"
                  />
                  <button
                    onClick={(e) => handleSubmit(e as any)}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-purple-500/20"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
