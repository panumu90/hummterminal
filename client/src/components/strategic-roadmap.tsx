import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  TrendingUp,
  Target,
  Rocket,
  Euro,
  Users,
  Brain,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Star,
  BarChart3,
  Bot,
  Cpu,
  Network,
  Award,
  ChevronDown,
  Info,
  GripVertical,
  Sparkles,
  Send,
  Loader2
} from "lucide-react";
import roadmapDataJson from "@/data/roadmap-data.json";

// Icon mapper to convert string names to icon components
const iconMap: Record<string, any> = {
  Zap,
  Users,
  Shield,
  Brain,
  Bot,
  BarChart3,
  Rocket,
  Star,
  Cpu,
  Globe,
  Network,
  Award,
};

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string; // Icon name as string
  color: string;
  metrics: {
    current: string;
    target: string;
    impact: string;
  };
  actions: string[];
  technologies: string[];
  risks: string[];
  benchmarks: {
    company: string;
    achievement: string;
  }[];
}

interface RoadmapPhase {
  id: string;
  quarter: string;
  title: string;
  revenue: string;
  margin: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  categories: Category[];
  kpis: {
    name: string;
    current: number;
    target: number;
    unit: string;
    change: string;
  }[];
}

// Sortable Category Component
function SortableCategory({ category, onClick }: { category: Category; onClick: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const Icon = iconMap[category.icon] || Zap; // Default to Zap if icon not found

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative ${isDragging ? 'z-50' : ''}`}
    >
      <motion.button
        onClick={onClick}
        className={`w-full text-left p-4 rounded-lg bg-gradient-to-r ${category.color} hover:scale-[1.02] transition-all cursor-pointer border border-slate-700/50`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-3">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4 text-white/70 hover:text-white transition-colors" />
          </div>
          <Icon className="w-5 h-5 text-white" />
          <div className="flex-1">
            <h4 className="font-semibold text-white text-sm">{category.name}</h4>
            <p className="text-xs text-white/80 mt-1">{category.description}</p>
          </div>
          <Info className="w-4 h-4 text-white/70" />
        </div>
      </motion.button>
    </div>
  );
}

const StrategicRoadmap = () => {
  const [expandedPhase, setExpandedPhase] = useState<string | null>("phase1");
  const [phases, setPhases] = useState<RoadmapPhase[]>([]);
  const [secretModalOpen, setSecretModalOpen] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Secret content to stream
  const secretContent = `Tein laskelmat hybridiratkaisu Chatwoot + n8n + Claude API vs SaaS.
Määritin tarkasti kaikki muuttujat ja tein oletuksen, että jos saavutetaan täysi autonomia ja jäljelle jää human oversight.

Säästöt ovat valtavia. Vaikka toteuttaisiin one-click järjestelmä aluksi, mikä onkin fiksuin tapa -- Agentic AI helpottaa sovelluskehitystä niin, että ainoa järkevä ratkaisu on käyttää avointa alustaa (Chatwoot/n8n) ja parasta LLM:ää (Claude API).

Ja mielestäni järkevintä olisi käyttää vapautuvat henkilöstöresurssit tekoäly-palvelukokonaisuuksien myyntiin ja panostaa siihen, että myös hummin omat asiakkaat hyötyisivät tästä mahdollisuudesta.

Strategiset lähtökohdat Hummilla on mielestäni saavuttaa 10 miljoonan liikevaihto viidessä vuodessa (2026-2030). Se vaatii vain tulevalta teknologiajohtajalta ymmärrystä siitä miten suuresta potentiaalista tässä on kyse -- vaikka internetistäkin muodostui aikoinaan kupla, oli se silti 'the most disruptive thing in our modern history' tähän teknologiaan perehtyneenä, ammattilaisia kuulleena... Noh, hype sikseen -- Haluan vielä verrata tätä internettiin, koska silloinkin syntyi paljon www.dotcom - yrityksiä, joilla ei ollut mitään oikeaa arvoa, mutta ne näyttivät oikeilta. Tästä syystä painotan jatkuvaa seurantaa, muuten on säilyä voittajana.`;

  // Typewriter effect
  useEffect(() => {
    if (!secretModalOpen) {
      setStreamedText("");
      return;
    }

    let currentIndex = 0;
    const intervalSpeed = 20; // milliseconds per character
    
    const interval = setInterval(() => {
      if (currentIndex < secretContent.length) {
        setStreamedText(secretContent.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, intervalSpeed);

    return () => clearInterval(interval);
  }, [secretModalOpen]);

  // Initialize phases data from JSON
  const phasesData: RoadmapPhase[] = roadmapDataJson.phases as RoadmapPhase[];

  // Initialize phases state from data
  useEffect(() => {
    if (phases.length === 0) {
      setPhases(phasesData);
    }
  }, []);

  const statusConfig = {
    completed: {
      color: "border-green-500/50 bg-green-500/5",
      badge: "bg-green-500/10 text-green-400 border-green-500/30"
    },
    "in-progress": {
      color: "border-blue-500/50 bg-blue-500/5",
      badge: "bg-blue-500/10 text-blue-400 border-blue-500/30"
    },
    upcoming: {
      color: "border-slate-600/50 bg-slate-800/20",
      badge: "bg-slate-600/10 text-slate-400 border-slate-600/30"
    }
  };

  const statusLabels = {
    completed: "Valmis",
    "in-progress": "Käynnissä",
    upcoming: "Tulossa"
  };

  // Handle drag end for reordering categories
  const handleDragEnd = (event: DragEndEvent, phaseId: string) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPhases((prevPhases) => {
        return prevPhases.map((phase) => {
          if (phase.id === phaseId) {
            const oldIndex = phase.categories.findIndex((c) => c.id === active.id);
            const newIndex = phase.categories.findIndex((c) => c.id === over.id);
            return {
              ...phase,
              categories: arrayMove(phase.categories, oldIndex, newIndex),
            };
          }
          return phase;
        });
      });
    }
  };

  // Handle AI input submission
  const handleAiSubmit = async () => {
    if (!aiInput.trim() || isProcessing) return;

    setIsProcessing(true);
    setAiResponse("");

    try {
      const response = await fetch('/api/ai/roadmap-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiInput,
          currentRoadmap: phases
        }),
      });

      if (!response.ok) throw new Error('AI request failed');

      const data = await response.json();

      // Update phases with AI suggestions
      if (data.updatedPhases) {
        setPhases(data.updatedPhases);
      }

      setAiResponse(data.explanation || "Roadmap päivitetty onnistuneesti!");
      setAiInput("");
    } catch (error) {
      console.error('AI update error:', error);
      setAiResponse("Virhe AI-päivityksessä. Yritä uudelleen.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header - Minimalistic */}
      <div className="text-center space-y-3 pb-4">
        <div className="flex items-center justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-slate-300">Strategic Roadmap</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-100">
          Humm Group: AI Transformation
        </h1>
        <p className="text-slate-400 text-sm">
          €2.1M → €10M+ | -0.2% → 32% margin | 2026-2030
        </p>
      </div>

      {/* AI Roadmap Editor */}
      <div className="mb-6 p-6 rounded-xl bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-slate-900/40 border border-purple-500/30 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI Roadmap Editor</h3>
            <p className="text-xs text-slate-400">Muokkaa roadmappia dynaamisesti AI:n avulla</p>
          </div>
          <Button
            onClick={() => setSecretModalOpen(true)}
            size="sm"
            variant="outline"
            className="ml-auto group relative overflow-hidden border-purple-500/40 hover:border-purple-400/60 bg-purple-900/10 hover:bg-purple-900/20 text-purple-300 hover:text-purple-200 transition-all duration-200"
            data-testid="secret-ace-button"
          >
            <Star className="w-3 h-3 mr-1.5" />
            Ässä hihassa
          </Button>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <textarea
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleAiSubmit();
                }
              }}
              placeholder="Esim: 'Lisää quantum computing phase 4:ään' tai 'Päivitä teknologiat vastaamaan 2026 tilannetta' tai 'Muuta aikajana aggressiivisemmaksi'"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 resize-none transition-all"
              rows={3}
              disabled={isProcessing}
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <span className="text-xs text-slate-500">⌘/Ctrl + Enter</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {aiResponse && (
                <div className={`text-sm px-3 py-1.5 rounded-md ${
                  aiResponse.includes('Virhe')
                    ? 'bg-red-500/10 text-red-300 border border-red-500/30'
                    : 'bg-green-500/10 text-green-300 border border-green-500/30'
                }`}>
                  {aiResponse}
                </div>
              )}
            </div>
            <Button
              onClick={handleAiSubmit}
              disabled={!aiInput.trim() || isProcessing}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Prosessoidaan...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Päivitä Roadmap
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setAiInput("Lisää uusin GPT-5 teknologia kaikkiin vaiheisiin")}
              className="text-xs px-3 py-1.5 rounded-md bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              💡 Päivitä AI-teknologiat
            </button>
            <button
              onClick={() => setAiInput("Tee aikajanasta aggressiivisempi, tavoite 2 vuotta aiemmin")}
              className="text-xs px-3 py-1.5 rounded-md bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              ⚡ Aggressiivisempi aikataulu
            </button>
            <button
              onClick={() => setAiInput("Lisää kestävyys ja ESG-tavoitteet jokaiseen vaiheeseen")}
              className="text-xs px-3 py-1.5 rounded-md bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              🌱 ESG-fokus
            </button>
            <button
              onClick={() => setAiInput("Analysoi riskit ja lisää mitigaatiostrategiat")}
              className="text-xs px-3 py-1.5 rounded-md bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              🛡️ Riskianalyysi
            </button>
          </div>
        </div>
      </div>

      {/* Roadmap Timeline - Map-like */}
      <div className="relative space-y-6">
        {/* Connection Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-slate-600/30" />

        {phases.map((phase, idx) => {
          const isExpanded = expandedPhase === phase.id;
          const config = statusConfig[phase.status];

          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative"
            >
              {/* Phase Dot on Timeline */}
              <div className="absolute left-8 top-6 w-3 h-3 rounded-full bg-slate-800 border-2 border-blue-400 -translate-x-1/2 z-10" />

              {/* Phase Card */}
              <div className={`ml-16 border rounded-lg ${config.color} backdrop-blur-sm transition-all duration-300`}>
                {/* Phase Header - Clickable */}
                <button
                  onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors rounded-t-lg"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant="outline" className={config.badge}>
                        {phase.quarter}
                      </Badge>
                      <Badge variant="outline" className={config.badge}>
                        {statusLabels[phase.status]}
                      </Badge>
                    </div>
                    <h2 className="text-xl font-semibold text-slate-100">{phase.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Euro className="w-4 h-4" />
                        {phase.revenue}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {phase.margin}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Expandable Content */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-slate-700/50"
                  >
                    {/* KPIs - Compact */}
                    <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                      {phase.kpis.map((kpi) => (
                        <div key={kpi.name} className="text-center space-y-1">
                          <p className="text-xs text-slate-500">{kpi.name}</p>
                          <div className="text-lg font-bold text-slate-200">
                            {kpi.target}{kpi.unit}
                          </div>
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/30 text-xs">
                            {kpi.change}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    {/* Categories Grid */}
                    <div className="p-4 pt-0">
                      <div className="grid md:grid-cols-2 gap-3">
                        {phase.categories.map((category) => {
                          const Icon = iconMap[category.icon] || Zap; // Default to Zap if icon not found
                          return (
                            <Dialog key={category.id}>
                              <DialogTrigger asChild>
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="group relative p-4 rounded-lg bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 transition-all text-left overflow-hidden"
                                >
                                  {/* Subtle gradient background */}
                                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                                  <div className="relative flex items-start gap-3">
                                    <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color}`}>
                                      <Icon className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-medium text-slate-200 text-sm mb-1 line-clamp-1">
                                        {category.name}
                                      </h3>
                                      <p className="text-xs text-slate-400 line-clamp-2">
                                        {category.description}
                                      </p>
                                    </div>
                                    <Info className="w-4 h-4 text-slate-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                </motion.button>
                              </DialogTrigger>

                            {/* Category Modal - Same as before */}
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
                              <DialogHeader>
                                <div className="flex items-center gap-4">
                                  <div className={`p-4 rounded-xl bg-gradient-to-br ${category.color}`}>
                                    <Icon className="w-8 h-8 text-white" />
                                  </div>
                                  <div>
                                    <DialogTitle className="text-2xl text-slate-100">{category.name}</DialogTitle>
                                    <DialogDescription className="text-base mt-1 text-slate-400">
                                      {category.description}
                                    </DialogDescription>
                                  </div>
                                </div>
                              </DialogHeader>

                              <Tabs defaultValue="overview" className="mt-6">
                                <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
                                  <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">Overview</TabsTrigger>
                                  <TabsTrigger value="actions" className="data-[state=active]:bg-slate-700">Actions</TabsTrigger>
                                  <TabsTrigger value="tech" className="data-[state=active]:bg-slate-700">Tech</TabsTrigger>
                                  <TabsTrigger value="benchmarks" className="data-[state=active]:bg-slate-700">Benchmarks</TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="space-y-6 mt-6">
                                  <div className="space-y-4">
                                    <h4 className="font-semibold text-lg flex items-center gap-2 text-slate-200">
                                      <BarChart3 className="w-5 h-5 text-blue-400" />
                                      Key Metrics & Impact
                                    </h4>
                                    <div className="grid gap-4">
                                      <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                                        <p className="text-sm font-medium text-blue-400">Current State</p>
                                        <p className="text-slate-300 mt-1">{category.metrics.current}</p>
                                      </div>
                                      <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                                        <p className="text-sm font-medium text-green-400">Target</p>
                                        <p className="text-slate-300 mt-1">{category.metrics.target}</p>
                                      </div>
                                      <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                                        <p className="text-sm font-medium text-purple-400">Expected Impact</p>
                                        <p className="text-slate-300 mt-1">{category.metrics.impact}</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-3">
                                    <h4 className="font-semibold text-lg flex items-center gap-2 text-slate-200">
                                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                                      Risks & Mitigation
                                    </h4>
                                    <div className="space-y-2">
                                      {category.risks.map((risk, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                                          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                          <p className="text-sm text-slate-300">{risk}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="actions" className="space-y-4 mt-6">
                                  <h4 className="font-semibold text-lg flex items-center gap-2 text-slate-200">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    Concrete Actions
                                  </h4>
                                  <div className="space-y-3">
                                    {category.actions.map((action, i) => (
                                      <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                          {i + 1}
                                        </div>
                                        <p className="text-slate-300 text-sm">{action}</p>
                                      </div>
                                    ))}
                                  </div>
                                </TabsContent>

                                <TabsContent value="tech" className="space-y-4 mt-6">
                                  <h4 className="font-semibold text-lg flex items-center gap-2 text-slate-200">
                                    <Cpu className="w-5 h-5 text-purple-400" />
                                    Technologies & Tools
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {category.technologies.map((tech, i) => (
                                      <Badge key={i} className={`bg-gradient-to-r ${category.color} text-white text-sm py-2 px-4 border-0`}>
                                        {tech}
                                      </Badge>
                                    ))}
                                  </div>
                                </TabsContent>

                                <TabsContent value="benchmarks" className="space-y-4 mt-6">
                                  <h4 className="font-semibold text-lg flex items-center gap-2 text-slate-200">
                                    <Award className="w-5 h-5 text-amber-400" />
                                    Industry Benchmarks
                                  </h4>
                                  <div className="space-y-3">
                                    {category.benchmarks.map((benchmark, i) => (
                                      <div key={i} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                                        <div className="flex items-center gap-2 mb-2">
                                          <Award className="w-4 h-4 text-amber-400" />
                                          <span className="font-semibold text-slate-200">{benchmark.company}</span>
                                        </div>
                                        <p className="text-sm text-slate-400">{benchmark.achievement}</p>
                                      </div>
                                    ))}
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </DialogContent>
                          </Dialog>
                        );
                      })}
                    </div>
                  </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
            );
          })}
        </div>

        {/* Footer - Compact */}
        <div className="mt-8 p-6 rounded-lg bg-slate-800/30 border border-slate-700/50">
        <div className="grid md:grid-cols-4 gap-4 text-center">
          <div className="space-y-1">
            <Euro className="w-5 h-5 mx-auto text-green-400" />
            <div className="text-xl font-bold text-slate-200">€2.1M → €10M+</div>
            <p className="text-xs text-slate-500">376% kasvu</p>
          </div>
          <div className="space-y-1">
            <TrendingUp className="w-5 h-5 mx-auto text-blue-400" />
            <div className="text-xl font-bold text-slate-200">-0.2% → 32%</div>
            <p className="text-xs text-slate-500">Käyttökate</p>
          </div>
          <div className="space-y-1">
            <Users className="w-5 h-5 mx-auto text-purple-400" />
            <div className="text-xl font-bold text-slate-200">€192k</div>
            <p className="text-xs text-slate-500">Per employee</p>
          </div>
          <div className="space-y-1">
            <Bot className="w-5 h-5 mx-auto text-cyan-400" />
            <div className="text-xl font-bold text-slate-200">95%</div>
            <p className="text-xs text-slate-500">AI-automaatio</p>
          </div>
        </div>
        <p className="text-center text-xs text-slate-500 mt-4 pt-4 border-t border-slate-700/50">
          Data: McKinsey, Gartner, Deloitte, Cerbos, CyberArk + Finnish benchmarks
        </p>
      </div>

      {/* First 30 Days Action Plan - Open Source Focus */}
      <div className="mt-8 p-8 rounded-lg bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-blue-500/20">
            <Rocket className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Ensimmäiset 30 Päivää - Quick Wins</h2>
            <p className="text-slate-400 text-sm mt-1">Open source -ratkaisut, nolla lisähenkilöstötarve</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Week 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">Viikko 1</Badge>
              <span className="text-xs text-slate-500">Päivät 1-7</span>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Tech Stack Audit</p>
                    <p className="text-xs text-slate-400 mt-1">Kartoita nykyiset järjestelmät, API:t ja integraatiot</p>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">n8n Setup (1 päivä)</p>
                    <p className="text-xs text-slate-400 mt-1">Asenna n8n low-code automaatioalusta - ilmainen, self-hosted</p>
                    <div className="flex gap-1 mt-2">
                      <Badge className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Open Source</Badge>
                      <Badge className="text-xs bg-purple-500/10 text-purple-400 border-purple-500/30">€0</Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Quick Win #1: CRM Auto-sync</p>
                    <p className="text-xs text-slate-400 mt-1">n8n workflow: Zendesk → CRM (2h käsityö → 5min automaatio)</p>
                    <p className="text-xs text-green-400 mt-1">💰 Säästö: 10h/viikko</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Week 2-3 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30">Viikot 2-3</Badge>
              <span className="text-xs text-slate-500">Päivät 8-21</span>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Chatwoot + Claude API</p>
                    <p className="text-xs text-slate-400 mt-1">Claude 3.5 Sonnet + Haiku API + RAG lokaaliin dataan</p>
                    <div className="flex gap-1 mt-2">
                      <Badge className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">Paras LLM-laatu</Badge>
                      <Badge className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Avoin alusta</Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-start gap-2">
                  <Bot className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Chatbot MVP (Chatwoot + Claude)</p>
                    <p className="text-xs text-slate-400 mt-1">Ensimmäinen AI-assistentti FAQ:lle - 50% kyselyistä hoidettu</p>
                    <p className="text-xs text-green-400 mt-1">💰 Säästö: 15h/viikko</p>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">MCP Proof-of-Concept</p>
                    <p className="text-xs text-slate-400 mt-1">Turvallinen AI-datavirta RBAC:lla (Cerbos OSS)</p>
                    <div className="flex gap-1 mt-2">
                      <Badge className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Open Source</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Week 4 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30">Viikko 4</Badge>
              <span className="text-xs text-slate-500">Päivät 22-30</span>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-start gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Mittarit & Dashboard</p>
                    <p className="text-xs text-slate-400 mt-1">Grafana (OSS) + InfluxDB: reaaliaikainen seuranta</p>
                    <div className="flex gap-1 mt-2">
                      <Badge className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Open Source</Badge>
                      <Badge className="text-xs bg-purple-500/10 text-purple-400 border-purple-500/30">€0</Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Tiimin Koulutus</p>
                    <p className="text-xs text-slate-400 mt-1">n8n workshop: jokainen voi rakentaa workflowja</p>
                    <p className="text-xs text-amber-400 mt-1">🎯 Tavoite: Demokraattinen automaatio</p>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Johdon Raportti</p>
                    <p className="text-xs text-slate-400 mt-1">30 päivän tulokset: säästöt, KPI:t, seuraavat askeleet</p>
                    <p className="text-xs text-green-400 mt-1">📊 KPI: 25h/viikko säästetty, €0 lisäkustannus</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Summary */}
        <div className="mt-8 p-6 rounded-lg bg-slate-800/30 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Open Source Tech Stack (30 päivää)
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Automaatio</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">n8n</Badge>
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">Temporal</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider">AI/LLM</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30">Claude API</Badge>
                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30">Langchain</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Security</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Cerbos</Badge>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Keycloak</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Monitoring</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30">Grafana</Badge>
                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30">InfluxDB</Badge>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
            <div className="text-sm text-slate-400">
              💡 <span className="font-semibold text-slate-300">Hybridistrategia:</span> Avoimet alustat (Chatwoot/n8n) + paras LLM (Claude API) = tehokas ja laadukas
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-blue-400">€30K-80K/v</p>
              <p className="text-xs text-slate-500">Claude API-kustannukset</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secret Ace Modal */}
      <Dialog open={secretModalOpen} onOpenChange={setSecretModalOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] bg-gradient-to-br from-slate-800/98 to-slate-900/98 backdrop-blur-xl border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-white" />
              </div>
              Vielä yksi ässä hihassa
            </DialogTitle>
            <DialogDescription className="text-slate-300 text-base">
              Konkreettinen ROI-analyysi ja strateginen visio 10M€ liikevaihtoon
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[65vh] pr-4">
            <div className="prose prose-invert prose-lg max-w-none">
              <div className="text-slate-200 space-y-4 leading-relaxed whitespace-pre-wrap font-sans">
                {streamedText}
                {streamedText.length < secretContent.length && (
                  <span className="inline-block w-2 h-5 bg-purple-500 animate-pulse ml-1" />
                )}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StrategicRoadmap;
