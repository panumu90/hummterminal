import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Target, TrendingUp, Shield, Zap, Code, Database, MessageSquare, BarChart3, CheckCircle2, AlertTriangle, ArrowRight, ChevronRight } from "lucide-react";

interface StrategicRecommendationsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StrategicRecommendations({ isOpen, onClose }: StrategicRecommendationsProps) {
  const [activePhase, setActivePhase] = useState<string>("phase1");

  const roadmapPhases = [
    {
      id: "phase1",
      title: "Phase 1: Foundation",
      period: "Q1-Q2 2025",
      budget: "€400K",
      focus: "Core AI Infrastructure",
      items: [
        "Deploy n8n automation platform for workflow orchestration",
        "Implement Llama 3.3 70B for customer support automation",
        "Set up Langchain framework for multi-agent coordination",
        "Migrate from Zendesk to open-source helpdesk (Chatwoot/Zammad)",
        "Establish MLOps pipeline with local model hosting",
      ],
      metrics: [
        "30% reduction in response times",
        "€120K annual savings from Zendesk migration",
        "3 AI-powered automation workflows deployed",
      ],
    },
    {
      id: "phase2",
      title: "Phase 2: Expansion",
      period: "Q3-Q4 2025",
      budget: "€500K",
      focus: "Multi-Agent Systems",
      items: [
        "Deploy Mistral Large for complex reasoning tasks",
        "Implement Claude 3.5 Sonnet for high-stakes client communications",
        "Build custom RAG system with vector databases (Qdrant/Weaviate)",
        "Create hybrid orchestration: n8n + Langchain + custom agents",
        "Launch self-service AI portal for clients",
      ],
      metrics: [
        "50% automation rate for routine inquiries",
        "CSAT increase from 82% to 90%+",
        "€200K saved from reduced escalations",
      ],
    },
    {
      id: "phase3",
      title: "Phase 3: Optimization",
      period: "Q1-Q2 2026",
      budget: "€450K",
      focus: "Predictive Analytics & Scaling",
      items: [
        "Implement predictive customer churn models",
        "Deploy sentiment analysis across all channels",
        "Build real-time agent performance optimization system",
        "Create AI-powered capacity planning tools",
        "Launch proactive customer engagement campaigns",
      ],
      metrics: [
        "20% reduction in customer churn",
        "Agent productivity +35%",
        "€300K revenue from proactive upsells",
      ],
    },
    {
      id: "phase4",
      title: "Phase 4: Innovation",
      period: "Q3 2026 - Q2 2027",
      budget: "€550K",
      focus: "Advanced AI Capabilities",
      items: [
        "Fine-tune proprietary models on Humm data",
        "Deploy multimodal AI (voice, image, video support)",
        "Implement autonomous decision-making for tier 1-2 issues",
        "Create AI product recommendation engine",
        "Launch AI-driven workforce management",
      ],
      metrics: [
        "70% automation rate for all inquiries",
        "NPS increase from 45 to 65+",
        "€500K annual cost savings",
      ],
    },
    {
      id: "phase5",
      title: "Phase 5: Transformation",
      period: "Q3 2027 - Q4 2029",
      budget: "€600K",
      focus: "AI-First Operations",
      items: [
        "Achieve 90%+ AI automation across CS operations",
        "Deploy AI-powered strategic planning tools for leadership",
        "Create white-label AI CS platform for enterprise clients",
        "Establish AI Center of Excellence",
        "Launch AI consulting services (new revenue stream)",
      ],
      metrics: [
        "Revenue: €2.1M → €10M",
        "Operating margin: +25%",
        "€1M+ annual revenue from AI consulting",
      ],
    },
  ];

  const platformComparison = [
    {
      category: "Workflow Automation",
      proprietary: { name: "Salesforce Flow", cost: "€150K/year", lock: "High" },
      opensource: { name: "n8n", cost: "€12K/year (self-hosted)", lock: "None", benefit: "€138K savings + full control" },
    },
    {
      category: "AI/LLM Platform",
      proprietary: { name: "OpenAI API", cost: "€200K/year", lock: "Total" },
      opensource: { name: "Llama 3.3 + Mistral", cost: "€45K/year (hosting)", lock: "None", benefit: "€155K savings + data privacy" },
    },
    {
      category: "Helpdesk Platform",
      proprietary: { name: "Zendesk Suite", cost: "€120K/year", lock: "High" },
      opensource: { name: "Chatwoot", cost: "€15K/year", lock: "None", benefit: "€105K savings + customization" },
    },
    {
      category: "Analytics & BI",
      proprietary: { name: "Tableau", cost: "€80K/year", lock: "Medium" },
      opensource: { name: "Superset + Metabase", cost: "€10K/year", lock: "None", benefit: "€70K savings" },
    },
    {
      category: "Vector Database",
      proprietary: { name: "Pinecone", cost: "€60K/year", lock: "Medium" },
      opensource: { name: "Qdrant/Weaviate", cost: "€8K/year", lock: "None", benefit: "€52K savings + performance" },
    },
  ];

  const openSourceBenefits = [
    {
      icon: Code,
      title: "Total Cost Ownership",
      benefit: "€520K annual savings vs proprietary stack",
      detail: "Self-hosted open source eliminates per-seat licensing, API usage fees, and vendor price increases.",
    },
    {
      icon: Shield,
      title: "Data Sovereignty",
      benefit: "100% control over customer data",
      detail: "All AI models and customer data remain on-premise or in EU-controlled cloud infrastructure.",
    },
    {
      icon: Zap,
      title: "Customization Freedom",
      benefit: "Unlimited feature development",
      detail: "Full access to source code enables custom features, integrations, and optimizations impossible with proprietary solutions.",
    },
    {
      icon: TrendingUp,
      title: "Vendor Independence",
      benefit: "Zero lock-in risk",
      detail: "Ability to switch providers, modify platforms, or bring capabilities in-house without migration penalties.",
    },
    {
      icon: Database,
      title: "Performance Optimization",
      benefit: "50% faster response times",
      detail: "Local model hosting eliminates API latency and enables GPU optimization for specific use cases.",
    },
    {
      icon: MessageSquare,
      title: "Community Innovation",
      benefit: "Access to cutting-edge features",
      detail: "Leverage global open source communities for faster feature releases, security patches, and best practices.",
    },
  ];

  const risks = [
    {
      risk: "Internal resistance to AI adoption",
      mitigation: "Phased rollout with extensive training, transparent communication, and early wins demonstration",
      impact: "Medium",
    },
    {
      risk: "Open source platform learning curve",
      mitigation: "Hire 2-3 specialized engineers, partner with n8n/Langchain consultants for initial 6 months",
      impact: "Low",
    },
    {
      risk: "Model performance below expectations",
      mitigation: "Hybrid approach: Start with proven models (Llama 3.3), maintain Claude API as fallback",
      impact: "Low",
    },
    {
      risk: "Data privacy/security concerns",
      mitigation: "ISO 27001 certification, regular security audits, SOC 2 compliance by Phase 2",
      impact: "Medium",
    },
    {
      risk: "Budget overruns",
      mitigation: "Quarterly budget reviews, 15% contingency fund, clear ROI gates before phase progression",
      impact: "Medium",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-slate-700/50 backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0f1b2d] to-[#1a2a44] border-b border-slate-600/50 p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(79,131,241,0.15),transparent_50%)]" />

          <div className="relative flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
                <Target className="h-8 w-8 text-emerald-400" />
                <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent">
                  Strategiset Suositukset Johdolle
                </span>
              </h1>
              <p className="text-white/70 text-sm max-w-3xl">
                5-vuoden AI-transformaatio-ohjelma: €2.1M → €10M kasvupolku avoimen lähdekoodin teknologioilla
              </p>
              <div className="flex items-center gap-4 mt-3">
                <div className="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-medium">
                  Tavoite: €10M liikevaihto 2029
                </div>
                <div className="px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-medium">
                  Investointi: €2.5M (5v)
                </div>
                <div className="px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-medium">
                  Säästöt: €520K/v (vs. proprietary)
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="h-[calc(95vh-160px)] overflow-y-auto custom-scrollbar">
          <div className="p-6 space-y-8">

            {/* Executive Summary */}
            <section className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-blue-400" />
                Johdon Yhteenveto
              </h2>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-xs text-white/60 uppercase tracking-wide">Strateginen Visio</p>
                  <p className="text-white/90 text-sm leading-relaxed">
                    Humm Group siirtää CS-operaatiot AI-ensisijaisiksi hyödyntäen avoimen lähdekoodin teknologioita.
                    Tavoitteena on €10M liikevaihto vuoteen 2029 mennessä, samanaikaisesti parantaen laatua ja alentaen kustannuksia.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-white/60 uppercase tracking-wide">Miksi Avoin Lähdekoodi?</p>
                  <ul className="text-white/90 text-sm space-y-1">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> €520K vuosittaiset säästöt</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Nolla vendor lock-in</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Täysi datahallinta</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Rajaton kustomointi</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-white/60 uppercase tracking-wide">Keskeiset Teknologiat</p>
                  <div className="flex flex-wrap gap-2">
                    {["n8n", "Llama 3.3", "Mistral", "Langchain", "Chatwoot", "Qdrant", "Superset"].map((tech) => (
                      <span key={tech} className="px-2.5 py-1 rounded-md bg-slate-800/50 border border-slate-600/50 text-white/80 text-xs font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 5-Year Roadmap */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-emerald-400" />
                5-Vuoden Transformaatio Roadmap
              </h2>

              {/* Phase Tabs */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {roadmapPhases.map((phase) => (
                  <button
                    key={phase.id}
                    onClick={() => setActivePhase(phase.id)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      activePhase === phase.id
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                        : "bg-slate-800/50 text-white/60 hover:bg-slate-700/50 border border-slate-600/50"
                    }`}
                  >
                    {phase.title}
                    <span className="block text-xs opacity-70 mt-0.5">{phase.period}</span>
                  </button>
                ))}
              </div>

              {/* Active Phase Content */}
              {roadmapPhases.map((phase) => (
                <div
                  key={phase.id}
                  className={`${activePhase === phase.id ? "block" : "hidden"} bg-slate-800/30 border border-slate-600/50 rounded-xl p-6`}
                >
                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div>
                      <p className="text-xs text-white/60 mb-1">Ajanjakso</p>
                      <p className="text-lg font-semibold text-white">{phase.period}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60 mb-1">Budjetti</p>
                      <p className="text-lg font-semibold text-emerald-400">{phase.budget}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60 mb-1">Fokusalue</p>
                      <p className="text-lg font-semibold text-purple-400">{phase.focus}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-blue-400" />
                        Keskeiset Toimenpiteet
                      </h4>
                      <ul className="space-y-2">
                        {phase.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-white/80">
                            <ArrowRight className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-purple-400" />
                        Tavoitellut Mittarit
                      </h4>
                      <div className="space-y-3">
                        {phase.metrics.map((metric, idx) => (
                          <div key={idx} className="bg-slate-900/50 border border-slate-600/30 rounded-lg p-3">
                            <p className="text-sm text-white/90 flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                              {metric}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Platform Comparison */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Code className="h-6 w-6 text-purple-400" />
                Alustojen Vertailu: Proprietary vs. Open Source
              </h2>
              <div className="bg-slate-800/30 border border-slate-600/50 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-900/50">
                    <tr>
                      <th className="text-left p-4 text-sm font-semibold text-white/80">Kategoria</th>
                      <th className="text-left p-4 text-sm font-semibold text-red-400">Proprietary Ratkaisu</th>
                      <th className="text-left p-4 text-sm font-semibold text-emerald-400">Open Source Ratkaisu</th>
                      <th className="text-left p-4 text-sm font-semibold text-blue-400">Hyöty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {platformComparison.map((row, idx) => (
                      <tr key={idx} className="border-t border-slate-700/50">
                        <td className="p-4 text-sm font-medium text-white">{row.category}</td>
                        <td className="p-4">
                          <div className="text-sm text-white/80">{row.proprietary.name}</div>
                          <div className="text-xs text-red-400 mt-1">{row.proprietary.cost}</div>
                          <div className="text-xs text-white/50 mt-0.5">Lock-in: {row.proprietary.lock}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-white/80">{row.opensource.name}</div>
                          <div className="text-xs text-emerald-400 mt-1">{row.opensource.cost}</div>
                          <div className="text-xs text-white/50 mt-0.5">Lock-in: {row.opensource.lock}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-blue-300 font-medium">{row.opensource.benefit}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-900/50 border-t-2 border-blue-500/30">
                    <tr>
                      <td className="p-4 text-sm font-bold text-white">Vuosittaiset Kokonaiskustannukset</td>
                      <td className="p-4 text-lg font-bold text-red-400">€610K/vuosi</td>
                      <td className="p-4 text-lg font-bold text-emerald-400">€90K/vuosi</td>
                      <td className="p-4 text-lg font-bold text-blue-400">€520K vuosisäästö</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>

            {/* Open Source Benefits */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="h-6 w-6 text-yellow-400" />
                Avoimen Lähdekoodin Strategiset Edut
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {openSourceBenefits.map((item, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/50 rounded-xl p-5 hover:border-blue-500/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-400/30">
                        <item.icon className="h-6 w-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                        <p className="text-emerald-400 text-sm font-medium mb-2">{item.benefit}</p>
                        <p className="text-white/70 text-sm leading-relaxed">{item.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Risk Management */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-orange-400" />
                Riskienhallinta
              </h2>
              <div className="space-y-3">
                {risks.map((item, idx) => (
                  <div key={idx} className="bg-slate-800/30 border border-slate-600/50 rounded-xl p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-base font-semibold text-white flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-400" />
                        {item.risk}
                      </h3>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        item.impact === "Low" ? "bg-green-500/20 text-green-300" :
                        item.impact === "Medium" ? "bg-yellow-500/20 text-yellow-300" :
                        "bg-red-500/20 text-red-300"
                      }`}>
                        {item.impact} Impact
                      </span>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed">
                      <span className="font-medium text-blue-400">Mitigaatio:</span> {item.mitigation}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Call to Action */}
            <section className="bg-gradient-to-r from-blue-900/50 via-purple-900/50 to-emerald-900/50 border-2 border-blue-500/30 rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-3">
                Seuraavat Askeleet
              </h2>
              <p className="text-white/80 text-lg mb-6 max-w-3xl mx-auto">
                Aloitetaan Phase 1 pilotti Q1 2025: n8n + Llama 3.3 käyttöönotto yhden asiakkaan tiimille.
                Tavoitteena validoida teknologia ja ROI ennen laajempaa skaalausta.
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="px-6 py-3 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-medium">
                  Pilotti alkaa: Q1 2025
                </div>
                <div className="px-6 py-3 rounded-lg bg-blue-500/20 border border-blue-400/40 text-blue-300 font-medium">
                  Budget: €100K (Phase 1 osa)
                </div>
                <div className="px-6 py-3 rounded-lg bg-purple-500/20 border border-purple-400/40 text-purple-300 font-medium">
                  ROI-tavoite: 3kk sisällä
                </div>
              </div>
            </section>

          </div>
        </div>

        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(59, 130, 246, 0.3);
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(59, 130, 246, 0.5);
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
