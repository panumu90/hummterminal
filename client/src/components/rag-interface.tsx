/**
 * RAG INTERFACE COMPONENT
 *
 * OPPITUNTI: RAG UI Architecture
 * --------------------------------
 * Tämä komponentti yhdistää kolme keskeistä osaa:
 * 1. Document Upload - Ladataan PDF/TXT tiedostoja
 * 2. RAG Chat - Kysytään kysymyksiä ladatuista dokumenteista
 * 3. Document Management - Hallitaan ladattuja dokumentteja
 *
 * KÄYTTÖKOKEMUS:
 * - Upload → Chunking → Embedding → Vector Store
 * - Chat → Similarity Search → Context Retrieval → AI Response
 * - Management → List → Delete → Stats
 */

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  FileText,
  MessageSquare,
  Database,
  Trash2,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileUp,
  Brain,
  Sparkles
} from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Document {
  source: string;
  chunkCount: number;
  totalChars: number;
  uploadedAt: string;
  chunks: {
    id: string;
    preview: string;
    chars: number;
  }[];
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: {
    source: string;
    similarity: number;
    chunk: number;
    preview: string;
  }[];
}

export function RAGInterface() {
  const [activeTab, setActiveTab] = useState<'upload' | 'chat' | 'documents'>('upload');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [chatting, setChatting] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Lataa dokumentit sivun latautuessa
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * OPPITUNTI: Document Fetching
   * Haetaan dokumentit backendistä ja päivitetään stats
   */
  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/rag/documents');
      const data = await response.json();

      if (data.success) {
        setDocuments(data.documents || []);
        setStats(data.stats || null);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    }
  };

  /**
   * OPPITUNTI: File Upload Flow
   * 1. Käyttäjä valitsee tiedoston
   * 2. Lähetetään FormData backendiin
   * 3. Backend prosessoi → chunkit → embeddings → vector store
   * 4. Päivitetään UI
   */
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Tarkista tiedostotyyppi
    const allowedTypes = ['.pdf', '.txt', '.md', '.json'];
    const fileExt = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

    if (!allowedTypes.includes(fileExt)) {
      toast({
        title: "Tiedostotyyppi ei tuettu",
        description: `Tuetut tyypit: ${allowedTypes.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/rag/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Dokumentti ladattu onnistuneesti!",
          description: `${data.data.chunks} chunkkia luotu, yhteensä ${data.data.totalChars} merkkiä.`,
        });

        // Päivitä dokumenttilista
        await fetchDocuments();

        // Vaihda chat-välilehdelle
        setActiveTab('chat');
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error: any) {
      toast({
        title: "Lataus epäonnistui",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  /**
   * OPPITUNTI: RAG Chat Flow
   * 1. Lähetä kysymys backendiin
   * 2. Backend tekee similarity search
   * 3. Backend rakentaa kontekstin relevanteista dokumenteista
   * 4. Backend kutsuu Claude:a kontekstilla
   * 5. Stream vastaus käyttäjälle
   */
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || chatting) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setChatting(true);

    try {
      const response = await fetch('/api/rag/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          topK: 5,
        }),
      });

      if (!response.ok) {
        throw new Error('Chat request failed');
      }

      // Stream response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      let sources: any[] = [];

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.substring(6);
              try {
                const data = JSON.parse(jsonStr);

                if (data.chunk) {
                  assistantMessage += data.chunk;
                  // Update message in real-time
                  setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];

                    if (lastMessage?.role === 'assistant') {
                      lastMessage.content = assistantMessage;
                    } else {
                      newMessages.push({
                        role: 'assistant',
                        content: assistantMessage,
                      });
                    }
                    return newMessages;
                  });
                }

                if (data.sources) {
                  sources = data.sources;
                }

                if (data.done) {
                  // Add sources to final message
                  setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage?.role === 'assistant') {
                      lastMessage.sources = sources;
                    }
                    return newMessages;
                  });
                }

                if (data.error) {
                  throw new Error(data.error);
                }
              } catch (e) {
                console.error('Failed to parse stream data:', e);
              }
            }
          }
        }
      }
    } catch (error: any) {
      toast({
        title: "Chat-virhe",
        description: error.message,
        variant: "destructive",
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Pahoittelut, tapahtui virhe. Varmista että OPENAI_API_KEY ja ANTHROPIC_API_KEY on asetettu .env-tiedostoon.',
      }]);
    } finally {
      setChatting(false);
    }
  };

  /**
   * OPPITUNTI: Document Deletion
   * Poistaa dokumentin vector storesta
   */
  const handleDeleteDocument = async (documentId: string) => {
    try {
      const response = await fetch(`/api/rag/documents/${documentId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Dokumentti poistettu",
          description: `Dokumentti ${documentId} poistettu onnistuneesti.`,
        });
        await fetchDocuments();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: "Poisto epäonnistui",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  /**
   * OPPITUNTI: Clear All Documents
   * Tyhjentää koko vector storen
   */
  const handleClearAll = async () => {
    if (!confirm('Haluatko varmasti poistaa kaikki dokumentit?')) return;

    try {
      const response = await fetch('/api/rag/clear', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Kaikki dokumentit poistettu",
          description: data.message,
        });
        await fetchDocuments();
        setMessages([]);
      }
    } catch (error: any) {
      toast({
        title: "Tyhjennys epäonnistui",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">RAG - Document Intelligence</CardTitle>
              <CardDescription>
                Lataa dokumentteja ja kysy kysymyksiä niiden sisällöstä
              </CardDescription>
            </div>
          </div>
          {stats && (
            <Badge variant="secondary" className="text-sm">
              {stats.documentCount} dokumenttia
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <FileUp className="w-4 h-4" />
              Lataa
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat ({messages.length})
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Dokumentit ({documents.length})
            </TabsTrigger>
          </TabsList>

          {/* UPLOAD TAB */}
          <TabsContent value="upload" className="space-y-4 mt-4">
            <div className="border-2 border-dashed rounded-lg p-12 text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Lataa dokumentti</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tuetut formaatit: PDF, TXT, MD, JSON (max 10MB)
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.md,.json"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />

              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                size="lg"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Ladataan...
                  </>
                ) : (
                  <>
                    <FileUp className="w-4 h-4 mr-2" />
                    Valitse tiedosto
                  </>
                )}
              </Button>
            </div>

            {/* Upload info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">1. Upload</p>
                      <p className="text-xs text-muted-foreground">Lataa PDF tai teksti</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium">2. Process</p>
                      <p className="text-xs text-muted-foreground">Chunking + Embeddings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">3. Chat</p>
                      <p className="text-xs text-muted-foreground">Kysy kysymyksiä</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* CHAT TAB */}
          <TabsContent value="chat" className="mt-4">
            <div className="space-y-4">
              <ScrollArea className="h-[500px] border rounded-lg p-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center">
                    <div className="space-y-3">
                      <Brain className="w-12 h-12 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Ei viestejä vielä. Kysy jotain ladatuista dokumenteista!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg p-4 ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}>
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.content}
                            </ReactMarkdown>
                          </div>

                          {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-muted-foreground/20">
                              <p className="text-xs font-semibold mb-2">Lähteet:</p>
                              <div className="space-y-1">
                                {msg.sources.map((source, sidx) => (
                                  <div key={sidx} className="text-xs opacity-80">
                                    <span className="font-medium">{source.source}</span>
                                    <span className="mx-1">•</span>
                                    <span>Similarity: {(source.similarity * 100).toFixed(1)}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                )}
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  placeholder="Kysy jotain dokumenteista..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  disabled={chatting || documents.length === 0}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={chatting || !inputMessage.trim() || documents.length === 0}
                  size="icon"
                >
                  {chatting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {documents.length === 0 && (
                <p className="text-sm text-center text-muted-foreground">
                  Lataa ensin dokumentteja Upload-välilehdellä
                </p>
              )}
            </div>
          </TabsContent>

          {/* DOCUMENTS TAB */}
          <TabsContent value="documents" className="mt-4 space-y-4">
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{stats.documentCount}</div>
                    <p className="text-xs text-muted-foreground">Dokumentteja</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{stats.totalCharacters}</div>
                    <p className="text-xs text-muted-foreground">Merkkiä yhteensä</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{stats.averageCharacters}</div>
                    <p className="text-xs text-muted-foreground">Merkkiä/dokumentti</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{Object.keys(stats.sources || {}).length}</div>
                    <p className="text-xs text-muted-foreground">Uniikkeja lähteitä</p>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearAll}
                disabled={documents.length === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Poista kaikki
              </Button>
            </div>

            <ScrollArea className="h-[400px] border rounded-lg p-4">
              {documents.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center">
                  <div className="space-y-3">
                    <Database className="w-12 h-12 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Ei dokumentteja ladattuna
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-4 h-4 text-primary" />
                              <h4 className="font-semibold text-sm">{doc.source}</h4>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                              <div>
                                <span className="font-medium">Chunkkeja:</span> {doc.chunkCount}
                              </div>
                              <div>
                                <span className="font-medium">Merkkejä:</span> {doc.totalChars}
                              </div>
                              <div>
                                <span className="font-medium">Ladattu:</span>{' '}
                                {new Date(doc.uploadedAt).toLocaleDateString('fi-FI')}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-2"
                            onClick={() => {
                              if (doc.chunks.length > 0) {
                                handleDeleteDocument(doc.chunks[0].id.split('-chunk-')[0]);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
