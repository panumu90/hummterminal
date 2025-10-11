import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  Users,
  Database,
  Briefcase,
  FileText,
  TrendingUp,
  Target,
  Clock,
  ChevronRight,
  Zap,
  BookOpen,
  Layers
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchRAGSection } from "@/lib/ragClient";
import type { RiskCategory, RootCause, Framework, TimelinePhase, CaseStudy, FailureStat } from "@/lib/ragClient";
import { MetricCard } from "@/components/risk/MetricCard";
import { RiskCard } from "@/components/risk/RiskCard";
import { RiskMatrix } from "@/components/risk/RiskMatrix";
import { TimelineStep } from "@/components/risk/TimelineStep";

// RAG query hooks
function useHeroData() {
  return useQuery({
    queryKey: ["risk-hero"],
    queryFn: () => fetchRAGSection<{ subtitle: string; stats: FailureStat[] }>(
      "risk-hero",
      "Kerro AI-muutosjohtamisen epäonnistumisprosentti BPO-alalla ja 3 tärkeintä tilastoa muutosjohtamisesta. Vastaa JSON-muodossa: {subtitle: string, stats: [{icon: string, label: string, value: string, trend?: {direction: 'up'|'down'|'neutral', value: string}, source: string}]}"
    ),
    staleTime: 1000 * 60 * 10,
  });
}

function useRiskCategories() {
  return useQuery({
    queryKey: ["risk-categories"],
    queryFn: () => fetchRAGSection<RiskCategory[]>(
      "risk-categories",
      "Kerro 5 pääasiallista riskikategoriaa AI-muutosjohtamisessa BPO-alalla. Jokaiselle kategorialle anna todennäköisyys (low/medium/high), vaikutus (low/medium/high), riskit (lista), vähentämiskeinot (lista), ja lähteet. Vastaa JSON-muodossa: [{category: string, likelihood: 'low'|'medium'|'high', impact: 'low'|'medium'|'high', risks: string[], mitigations: string[], sources: string[]}]"
    ),
    staleTime: 1000 * 60 * 10,
  });
}

function useRootCauses() {
  return useQuery({
    queryKey: ["root-causes"],
    queryFn: () => fetchRAGSection<RootCause[]>(
      "root-causes",
      "Kerro top 5 perimmäistä syytä, miksi AI-muutosjohtaminen epäonnistuu BPO-alalla. Vastaa JSON-muodossa: [{title: string, description: string, percentage: string, details: string[]}]"
    ),
    staleTime: 1000 * 60 * 10,
  });
}

function useFrameworks() {
  return useQuery({
    queryKey: ["frameworks"],
    queryFn: () => fetchRAGSection<Framework[]>(
      "frameworks",
      "Kerro 4 tärkeintä muutosjohtamisen viitekehystä (ADKAR, Kotter, NIST, ISO/IEC) ja miten ne soveltuvat AI-muutokseen. Vastaa JSON-muodossa: [{name: string, description: string, phases: string[], aiApplication: string, sources: string[]}]"
    ),
    staleTime: 1000 * 60 * 10,
  });
}

function useTimeline() {
  return useQuery({
    queryKey: ["timeline"],
    queryFn: () => fetchRAGSection<TimelinePhase[]>(
      "timeline",
      "Kerro 4-5 vaihetta AI-muutoksen toteuttamiseen BPO-yrityksessä. Jokaiselle vaiheelle anna kesto, toimenpiteet ja KPI-tavoitteet. Vastaa JSON-muodossa: [{phase: string, duration: string, icon: string, actions: string[], kpis: string[]}]"
    ),
    staleTime: 1000 * 60 * 10,
  });
}

function useCaseStudies() {
  return useQuery({
    queryKey: ["case-studies"],
    queryFn: () => fetchRAGSection<CaseStudy[]>(
      "case-studies",
      "Kerro 3-5 BPO-alan case-esimerkkiä AI-muutosjohtamisesta (sekä onnistuneet että epäonnistuneet). Vastaa JSON-muodossa: [{company: string, challenge: string, approach: string, outcome: string, lessonsLearned: string[]}]"
    ),
    staleTime: 1000 * 60 * 10,
  });
}

function useCTARecommendation() {
  return useQuery({
    queryKey: ["cta-recommendation"],
    queryFn: () => fetchRAGSection<{ recommendation: string }>(
      "cta-recommendation",
      "Anna lyhyt suositus (2-3 lausetta) AI-muutosjohtamisen aloittamiseen BPO-yrityksessä. Vastaa JSON-muodossa: {recommendation: string}"
    ),
    staleTime: 1000 * 60 * 10,
  });
}

export default function RiskAnalysis() {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [selectedRootCause, setSelectedRootCause] = useState<number>(0);

  const heroQuery = useHeroData();
  const riskCategoriesQuery = useRiskCategories();
  const rootCausesQuery = useRootCauses();
  const frameworksQuery = useFrameworks();
  const timelineQuery = useTimeline();
  const caseStudiesQuery = useCaseStudies();
  const ctaQuery = useCTARecommendation();

  // Icon mapping for stats
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      AlertTriangle,
      TrendingUp,
      Users,
      Target,
      Clock,
      Shield,
      Database,
      Briefcase,
      FileText,
      Zap,
    };
    return icons[iconName] || AlertTriangle;
  };

  // Icon mapping for timeline
  const getTimelineIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      Target,
      Users,
      Zap,
      TrendingUp,
      Shield,
    };
    return icons[iconName] || Target;
  };

  // Create risk matrix data from categories
  const riskMatrixData = riskCategoriesQuery.data?.map((cat, idx) => ({
    id: `risk-${idx}`,
    name: cat.category,
    likelihood: cat.likelihood === "high" ? 5 : cat.likelihood === "medium" ? 3 : 1,
    impact: cat.impact === "high" ? 5 : cat.impact === "medium" ? 3 : 1,
    description: cat.risks[0] || "",
  })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-slate-800">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Takaisin
              </Button>
            </Link>
            <div className="hidden md:flex items-center gap-4 text-sm">
              <button
                onClick={() => setActiveSection("overview")}
                className={`transition-smooth ${activeSection === "overview" ? "text-blue-400" : "text-slate-400 hover:text-white"}`}
              >
                Yleiskatsaus
              </button>
              <button
                onClick={() => setActiveSection("risks")}
                className={`transition-smooth ${activeSection === "risks" ? "text-blue-400" : "text-slate-400 hover:text-white"}`}
              >
                Riskit
              </button>
              <button
                onClick={() => setActiveSection("frameworks")}
                className={`transition-smooth ${activeSection === "frameworks" ? "text-blue-400" : "text-slate-400 hover:text-white"}`}
              >
                Viitekehykset
              </button>
              <button
                onClick={() => setActiveSection("roadmap")}
                className={`transition-smooth ${activeSection === "roadmap" ? "text-blue-400" : "text-slate-400 hover:text-white"}`}
              >
                Tiekartta
              </button>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-73px)]">
        <div className="container mx-auto px-4 sm:px-6 py-8 space-y-16">

          {/* Hero Section */}
          <section id="overview" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-6">
                <AlertTriangle className="h-4 w-4" />
                <span>Kriittinen Analyysi</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Riskianalyysi: AI-muutosjohtaminen
              </h1>
              {heroQuery.isLoading ? (
                <Skeleton className="h-6 w-3/4 mx-auto bg-slate-800" />
              ) : heroQuery.isError ? (
                <div className="text-red-400">
                  Tietojen lataus epäonnistui.{" "}
                  <button onClick={() => heroQuery.refetch()} className="underline">
                    Yritä uudelleen
                  </button>
                </div>
              ) : (
                <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
                  {heroQuery.data?.subtitle || "Kattava analyysi AI-transformaation riskeistä BPO-sektorilla"}
                </p>
              )}
            </motion.div>

            {/* Stats Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {heroQuery.isLoading ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 bg-slate-800" />
                  ))}
                </>
              ) : heroQuery.isError ? (
                <div className="col-span-full text-center text-red-400">
                  Tilastoja ei voitu ladata.
                </div>
              ) : (
                heroQuery.data?.stats.map((stat, idx) => (
                  <MetricCard
                    key={idx}
                    icon={getIconComponent(stat.icon)}
                    label={stat.label}
                    value={stat.value}
                    trend={stat.trend}
                    source={stat.source}
                    delay={idx * 0.1}
                  />
                ))
              )}
            </div>
          </section>

          {/* Risk Panel */}
          <section id="risks" className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-8 w-8 text-blue-400" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Riskikategoriat
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {riskCategoriesQuery.isLoading ? (
                <>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-64 bg-slate-800" />
                  ))}
                </>
              ) : riskCategoriesQuery.isError ? (
                <div className="col-span-full">
                  <Card className="glass-panel-risk p-6 text-center">
                    <p className="text-red-400 mb-4">Riskikategorioiden lataus epäonnistui.</p>
                    <Button onClick={() => riskCategoriesQuery.refetch()} variant="outline">
                      Yritä uudelleen
                    </Button>
                  </Card>
                </div>
              ) : (
                riskCategoriesQuery.data?.map((risk, idx) => (
                  <RiskCard
                    key={idx}
                    category={risk.category}
                    likelihood={risk.likelihood}
                    impact={risk.impact}
                    risks={risk.risks}
                    mitigations={risk.mitigations}
                    sources={risk.sources}
                    delay={idx * 0.1}
                  />
                ))
              )}
            </div>
          </section>

          {/* Top 5 Root Causes */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="h-8 w-8 text-orange-400" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Top 5 Perimmäiset Syyt
              </h2>
            </div>
            {rootCausesQuery.isLoading ? (
              <Skeleton className="h-96 bg-slate-800" />
            ) : rootCausesQuery.isError ? (
              <Card className="glass-panel-risk p-6 text-center">
                <p className="text-red-400 mb-4">Perimmäisten syiden lataus epäonnistui.</p>
                <Button onClick={() => rootCausesQuery.refetch()} variant="outline">
                  Yritä uudelleen
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Horizontal scroll on mobile */}
                <div className="lg:col-span-2">
                  <ScrollArea className="w-full">
                    <div className="flex lg:grid lg:grid-cols-5 gap-4 pb-4">
                      {rootCausesQuery.data?.map((cause, idx) => (
                        <motion.button
                          key={idx}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          onClick={() => setSelectedRootCause(idx)}
                          className={`
                            flex-shrink-0 w-[200px] lg:w-full p-4 rounded-lg border-2 transition-all
                            ${selectedRootCause === idx
                              ? "bg-orange-500/20 border-orange-500"
                              : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                            }
                          `}
                        >
                          <div className="text-3xl font-bold text-orange-400 mb-2">
                            #{idx + 1}
                          </div>
                          <div className="text-sm text-slate-300 font-medium line-clamp-2">
                            {cause.title}
                          </div>
                          <div className="text-2xl font-bold text-white mt-2">
                            {cause.percentage}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>

                {/* Detail panel */}
                <Card className="glass-panel-risk p-6 lg:col-span-1">
                  {rootCausesQuery.data?.[selectedRootCause] && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white">
                        {rootCausesQuery.data[selectedRootCause].title}
                      </h3>
                      <p className="text-slate-300 text-sm">
                        {rootCausesQuery.data[selectedRootCause].description}
                      </p>
                      <div className="pt-4 border-t border-slate-700">
                        <h4 className="text-sm font-semibold text-slate-400 mb-2">
                          Lisätietoja:
                        </h4>
                        <ul className="space-y-2">
                          {rootCausesQuery.data[selectedRootCause].details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                              <ChevronRight className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            )}
          </section>

          {/* Change Management Frameworks */}
          <section id="frameworks" className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-8 w-8 text-purple-400" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Muutosjohtamisen viitekehykset
              </h2>
            </div>
            {frameworksQuery.isLoading ? (
              <Skeleton className="h-96 bg-slate-800" />
            ) : frameworksQuery.isError ? (
              <Card className="glass-panel-risk p-6 text-center">
                <p className="text-red-400 mb-4">Viitekehysten lataus epäonnistui.</p>
                <Button onClick={() => frameworksQuery.refetch()} variant="outline">
                  Yritä uudelleen
                </Button>
              </Card>
            ) : (
              <Tabs defaultValue="0" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-slate-800/50">
                  {frameworksQuery.data?.map((framework, idx) => (
                    <TabsTrigger key={idx} value={String(idx)} className="data-[state=active]:bg-purple-500/20">
                      {framework.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {frameworksQuery.data?.map((framework, idx) => (
                  <TabsContent key={idx} value={String(idx)}>
                    <Card className="glass-panel-risk p-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-3">{framework.name}</h3>
                          <p className="text-slate-300">{framework.description}</p>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-300 mb-3">Vaiheet:</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {framework.phases.map((phase, pIdx) => (
                              <div key={pIdx} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">
                                    {pIdx + 1}
                                  </div>
                                  <span className="text-sm text-slate-300">{phase}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="pt-4 border-t border-slate-700">
                          <h4 className="text-lg font-semibold text-emerald-400 mb-2">
                            AI-sovellus:
                          </h4>
                          <p className="text-slate-300">{framework.aiApplication}</p>
                        </div>
                        {framework.sources.length > 0 && (
                          <div className="pt-4 border-t border-slate-700">
                            <h4 className="text-sm font-semibold text-slate-500 mb-2">Lähteet:</h4>
                            <div className="flex flex-wrap gap-2">
                              {framework.sources.map((source, sIdx) => (
                                <span key={sIdx} className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
                                  [{sIdx + 1}] {source}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </section>

          {/* Risk Matrix & Mitigation Roadmap */}
          <section id="roadmap" className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <Layers className="h-8 w-8 text-blue-400" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Riskimatriisi & Vähentämistiekartta
              </h2>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Risk Matrix */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Riskimatriisi</h3>
                {riskCategoriesQuery.isLoading ? (
                  <Skeleton className="h-96 bg-slate-800" />
                ) : riskCategoriesQuery.isError ? (
                  <Card className="glass-panel-risk p-6 text-center">
                    <p className="text-red-400">Matriisin lataus epäonnistui.</p>
                  </Card>
                ) : (
                  <RiskMatrix risks={riskMatrixData} />
                )}
              </div>

              {/* Mitigation Timeline */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Vähentämistiekartta</h3>
                {timelineQuery.isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-48 bg-slate-800" />
                    ))}
                  </div>
                ) : timelineQuery.isError ? (
                  <Card className="glass-panel-risk p-6 text-center">
                    <p className="text-red-400 mb-4">Tiekartan lataus epäonnistui.</p>
                    <Button onClick={() => timelineQuery.refetch()} variant="outline">
                      Yritä uudelleen
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {timelineQuery.data?.map((phase, idx) => (
                      <TimelineStep
                        key={idx}
                        phase={phase.phase}
                        duration={phase.duration}
                        icon={getTimelineIcon(phase.icon)}
                        actions={phase.actions}
                        kpis={phase.kpis}
                        delay={idx * 0.15}
                        isLast={idx === (timelineQuery.data?.length || 0) - 1}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* BPO Industry Insights */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <Briefcase className="h-8 w-8 text-green-400" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                BPO-alan tapaustutkimukset
              </h2>
            </div>
            {caseStudiesQuery.isLoading ? (
              <Skeleton className="h-96 bg-slate-800" />
            ) : caseStudiesQuery.isError ? (
              <Card className="glass-panel-risk p-6 text-center">
                <p className="text-red-400 mb-4">Tapaustutkimusten lataus epäonnistui.</p>
                <Button onClick={() => caseStudiesQuery.refetch()} variant="outline">
                  Yritä uudelleen
                </Button>
              </Card>
            ) : (
              <Accordion type="single" collapsible className="w-full space-y-4">
                {caseStudiesQuery.data?.map((study, idx) => (
                  <AccordionItem key={idx} value={`case-${idx}`} className="glass-panel-risk border-none">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{study.company}</h3>
                          <p className="text-sm text-slate-400 mt-1">{study.challenge}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="space-y-4 pt-4 border-t border-slate-700">
                        <div>
                          <h4 className="text-sm font-semibold text-blue-400 mb-2">Lähestymistapa:</h4>
                          <p className="text-slate-300 text-sm">{study.approach}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-emerald-400 mb-2">Tulos:</h4>
                          <p className="text-slate-300 text-sm">{study.outcome}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-purple-400 mb-2">Opitut asiat:</h4>
                          <ul className="space-y-2">
                            {study.lessonsLearned.map((lesson, lIdx) => (
                              <li key={lIdx} className="flex items-start gap-2 text-sm text-slate-300">
                                <span className="text-purple-400 mt-0.5">•</span>
                                <span>{lesson}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </section>

          {/* CTA Footer */}
          <section className="py-12">
            <Card className="glass-panel-risk p-8 sm:p-12 text-center border-2 border-blue-500/30">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                  Valmis aloittamaan?
                </h2>
                {ctaQuery.isLoading ? (
                  <Skeleton className="h-20 w-3/4 mx-auto bg-slate-800 mb-8" />
                ) : ctaQuery.isError ? (
                  <p className="text-red-400 mb-8">Suosituksen lataus epäonnistui.</p>
                ) : (
                  <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
                    {ctaQuery.data?.recommendation || "AI-muutosjohtaminen vaatii huolellista suunnittelua ja riskienhallintaa. Aloita analysoimalla organisaatiosi valmiustaso ja rakentamalla selkeä tiekartta."}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Shield className="h-5 w-5 mr-2" />
                      Palaa etusivulle
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="border-slate-600 hover:bg-slate-800">
                    <FileText className="h-5 w-5 mr-2" />
                    Lataa analyysi (PDF)
                  </Button>
                </div>
              </motion.div>
            </Card>
          </section>

        </div>
      </ScrollArea>
    </div>
  );
}
