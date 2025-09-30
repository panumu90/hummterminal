import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Target,
  Rocket,
  Clock,
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
  Calendar,
  BarChart3,
  Lightbulb
} from "lucide-react";

interface MilestoneCard {
  quarter: string;
  title: string;
  revenue: string;
  margin: string;
  keyActions: string[];
  risks: string[];
  technologies: string[];
  status: 'upcoming' | 'in-progress' | 'at-risk' | 'completed';
  dataInsights: {
    ces: number;
    arr: number;
    revenuePerEmployee: number;
    confidence: 'high' | 'medium' | 'low';
    keyDataPoints: string[];
  };
}

const StrategicRoadmap = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1year' | '3year' | '5year'>('5year');

  const milestones: MilestoneCard[] = [
    {
      quarter: "2025 Q1-Q2",
      title: "Perusta ja nopeat voitot",
      revenue: "€2.5M",
      margin: "8%",
      keyActions: [
        "Tech Lead -roolin määrittely ja strateginen suunnittelu",
        "Automaattinen tukivastausten generointi (1-klikkaus)",
        "Henkilöstön AI-osaamisohjelma käynnistys",
        "Asiakasdata-arkkitehtuurin kartoitus ja optimointi"
      ],
      risks: ["Muutosvastarinta organisaatiossa", "Teknisten integraatioiden kompleksisuus"],
      technologies: ["MCP Protocol (RBAC + Context Limiting)", "Agentic AI", "Chatbot Enhancement"],
      status: 'in-progress',
      dataInsights: {
        ces: 2.1,
        arr: 2.1,
        revenuePerEmployee: 125,
        confidence: 'high',
        keyDataPoints: [
          "Nykyinen CES 2.3 → tavoite 2.1 (8% parannus)",
          "ARR kasvu 1.85M → 2.1M perustuu automatisoinnin efficiency-hyötyihin",
          "Revenue per Employee 118k → 125k kun AI nopeuttaa prosesseja"
        ]
      }
    },
    {
      quarter: "2025 Q3-Q4",
      title: "Skaalautuva AI-toiminta",
      revenue: "€3.2M",
      margin: "12%",
      keyActions: [
        "Kokonaan automatisoitu ensitason asiakaspalvelu",
        "Ennakoiva analytiikka ja proaktiivinen ongelmanratkaisu",
        "Asiakassegmentointi ja personointi",
        "Uusien AI-palvelutuotteiden lanseeraus"
      ],
      risks: ["Asiakasluottamuksen säilyttäminen", "Kilpailijoiden vastatoimi"],
      technologies: ["Predictive Analytics", "Customer Segmentation AI", "Automated Workflows"],
      status: 'upcoming',
      dataInsights: {
        ces: 1.9,
        arr: 2.8,
        revenuePerEmployee: 145,
        confidence: 'high',
        keyDataPoints: [
          "CES paranee 2.1 → 1.9 proaktiivisen palvelun ansiosta",
          "ARR 2.1M → 2.8M uusien AI-palvelutuotteiden kautta",
          "Revenue per Employee 125k → 145k skaalautuvien prosessien myötä"
        ]
      }
    },
    {
      quarter: "2026",
      title: "Market Expansion",
      revenue: "€4.8M",
      margin: "18%",
      keyActions: [
        "Pohjoismaihin laajentuminen",
        "B2B AI-ratkaisujen myynti",
        "Oma AI-palvelualusta kehitys",
        "Strategiset kumppanuudet"
      ],
      risks: ["Markkinasegmentointi", "Kulttuurierot"],
      technologies: ["Multi-language AI", "Platform Development", "API Economy"],
      status: 'upcoming'
    },
    {
      quarter: "2027-2028",
      title: "Industry Leadership",
      revenue: "€7.5M",
      margin: "25%",
      keyActions: [
        "AI-CoE (Center of Excellence) perustaminen",
        "Vertikaaliset ratkai",
        "M&A aktiviteetit",
        "Kansainvälinen brändi rakentaminen"
      ],
      risks: ["Organisaation kompleksisuus", "Teknologian vanheneminen"],
      technologies: ["Proprietary AI Models", "Edge Computing", "Quantum-ready Architecture"],
      status: 'upcoming'
    },
    {
      quarter: "2029-2030",
      title: "€10M Revenue Target",
      revenue: "€10M+",
      margin: "30%+",
      keyActions: [
        "Euroopan markkinajohtajuus",
        "Next-gen AI-tuotteiden lanseeraus",
        "IPO/Exit-strategian toteutus",
        "Sustainability ja ESG johtajuus"
      ],
      risks: ["Markkinakylläisyys", "Regulaatiomuutokset"],
      technologies: ["AGI Integration", "Autonomous Operations", "Sustainable AI"],
      status: 'upcoming'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-600';
      case 'in-progress': return 'bg-blue-600';
      case 'at-risk': return 'bg-amber-600';
      case 'upcoming': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const currentMacroFactors = [
    {
      factor: "Fed korkolaskut",
      impact: "Positiivinen",
      description: "Helpottaa investointien rahoitusta",
      probability: 85
    },
    {
      factor: "Tariffi-impaktit",
      impact: "Neutraali",
      description: "AI-automaatio kompensoi kustannusnousuja",
      probability: 70
    },
    {
      factor: "AI-adoptin kiihtymin",
      impact: "Erittäin positiivinen",
      description: "Markkinoiden avarhuminen ja kysynnän kasvu",
      probability: 95
    },
    {
      factor: "Euroopan sääntely",
      impact: "Haastava mutta hallittava",
      description: "AI Act luo selkeät raamit",
      probability: 80
    }
  ];

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-slate-800 to-slate-700">
      {/* Strategic Vision Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white mb-4">
          Humm → €10M Revenue Roadmap
        </h1>
        <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
          <strong className="text-blue-300">Strateginen kasvupolku 2025-2030:</strong> Strateginen ketteryys + Teknologinen osaaminen + Täsmällinen toteutus =
          <span className="text-emerald-300 font-bold"> Kestävä markkina-asema</span>
        </p>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border-emerald-500/30">
          <CardContent className="p-6 text-center">
            <Euro className="h-8 w-8 text-emerald-300 mx-auto mb-2" />
            <div className="text-3xl font-bold text-emerald-300">€10M</div>
            <div className="text-sm text-slate-300">Liikevaihto-tavoite 2030</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/20 to-slate-700/10 border-blue-500/30">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-blue-300 mx-auto mb-2" />
            <div className="text-3xl font-bold text-blue-300">30%+</div>
            <div className="text-sm text-slate-300">Tavoite kannattavuus</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30">
          <CardContent className="p-6 text-center">
            <Rocket className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-purple-400">5x</div>
            <div className="text-sm text-slate-300">Liikevaihtokertoja</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/20 to-orange-800/10 border-orange-500/30">
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-orange-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-orange-400">2-5v</div>
            <div className="text-sm text-slate-300">Critical Time Window</div>
          </CardContent>
        </Card>
      </div>

      {/* Macro-Economic Context */}
      <Card className="bg-slate-800/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-amber-300 flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Makro-taloudellinen tilanne ja AI-timing</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentMacroFactors.map((factor, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white">{factor.factor}</h4>
                  <Badge className={`${
                    factor.impact.includes('Positiivinen') ? 'bg-green-100 text-green-800' :
                    factor.impact.includes('Neutraali') ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {factor.impact}
                  </Badge>
                </div>
                <p className="text-sm text-slate-300">{factor.description}</p>
                <div className="flex items-center space-x-2">
                  <Progress value={factor.probability} className="flex-1" />
                  <span className="text-sm text-slate-400">{factor.probability}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Build vs Buy Decision Framework */}
      <Card className="bg-slate-800/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-orange-400 flex items-center space-x-2">
            <Lightbulb className="h-5 w-5" />
            <span>Build vs Buy: Strategic Technology Decisions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Platform AI (Buy) */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <h3 className="text-xl font-semibold text-blue-300">Platform AI (Buy)</h3>
                <Badge className="bg-blue-100 text-blue-800">Zendesk, Intercom</Badge>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h4 className="font-medium text-emerald-300 mb-2">✅ Hyödyt</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Nopea käyttöönotto (2-4 viikkoa)</li>
                    <li>• Valmiit integraatiot ja työkalut</li>
                    <li>• Jatkuva kehitys ja päivitykset</li>
                    <li>• Luotettava tuki ja dokumentaatio</li>
                    <li>• Compliance ja turvallisuus hoituu</li>
                  </ul>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h4 className="font-medium text-red-400 mb-2">❌ Haitat</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Korkeat lisenssikustannukset (€50-200/käyttäjä/kk)</li>
                    <li>• Rajoitettu kustomointi</li>
                    <li>• Vendor lock-in riski</li>
                    <li>• Ei unique competitive advantage</li>
                  </ul>
                </div>
              </div>

              <div className="text-center p-3 bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-300">€2,000-8,000/kk</div>
                <div className="text-sm text-slate-400">10-40 käyttäjää</div>
              </div>
            </div>

            {/* Custom Build */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <h3 className="text-xl font-semibold text-purple-400">Custom Build</h3>
                <Badge className="bg-purple-100 text-purple-800">N8N, Open Source</Badge>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h4 className="font-medium text-emerald-300 mb-2">✅ Hyödyt</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Täysi kontrolli ja kustomointi</li>
                    <li>• Alhaiset käyttökustannukset</li>
                    <li>• Unique competitive advantage</li>
                    <li>• Ei vendor lock-in</li>
                    <li>• Perfect fit Hummin tarpeisiin</li>
                  </ul>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h4 className="font-medium text-red-400 mb-2">❌ Haitat</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Pitkä kehitysaika (3-6 kuukautta)</li>
                    <li>• Korkeat aloituskustannukset</li>
                    <li>• Jatkuva ylläpito ja kehitys</li>
                    <li>• Tekninen riski ja osaaminen</li>
                  </ul>
                </div>
              </div>

              <div className="text-center p-3 bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">€200-500/kk</div>
                <div className="text-sm text-slate-400">After initial investment</div>
              </div>
            </div>
          </div>

          {/* Hybrid Strategy Recommendation */}
          <div className="mt-8 p-6 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg border border-emerald-500/30">
            <h3 className="text-xl font-semibold text-emerald-300 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Suositeltu hybridimalli: "Best of Both Worlds"
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-blue-300">Phase 1: Quick Wins (Q1-Q2)</h4>
                <div className="bg-slate-700/20 rounded p-3">
                  <p className="text-sm text-slate-300">
                    Zendesk AI käyttöön tier-1 tuelle. Nopea ROI ja oppiminen.
                  </p>
                  <div className="text-xs text-emerald-300 mt-2">⚡ 2-4 viikkoa käyttöönotto</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-purple-400">Phase 2: Custom Core (Q3-Q4)</h4>
                <div className="bg-slate-700/20 rounded p-3">
                  <p className="text-sm text-slate-300">
                    N8N-pohjainen custom ratkaisu tier-2&3 tuelle ja unique features.
                  </p>
                  <div className="text-xs text-emerald-300 mt-2">🔧 3-6 kuukautta kehitys</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-emerald-300">Phase 3: Migration (2026)</h4>
                <div className="bg-slate-700/20 rounded p-3">
                  <p className="text-sm text-slate-300">
                    Gradual migration tier-1 → custom kun valmis. Full control saavutettu.
                  </p>
                  <div className="text-xs text-emerald-300 mt-2">🎯 €5,000+/kk säästöt</div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
              <p className="text-sm text-yellow-200">
                <strong>Technology Lead insight:</strong> Hybridimalli minimoi riskit, maksimoi oppimisen ja varmistaa
                että kustannustehokkuus ja kilpailukyky kasvavat ajan myötä. Zendesk opettaa mitä tarvitsemme,
                N8N antaa unique advantagen.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategic Roadmap Timeline */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          5-vuoden strateginen roadmap
        </h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500"></div>

          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}>
                {/* Timeline marker */}
                <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-slate-800 border-4 border-blue-500 rounded-full flex items-center justify-center z-10">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(milestone.status)}`}></div>
                </div>

                {/* Content card */}
                <div className={`w-full md:w-5/12 ml-12 md:ml-0 ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                  <Card className="bg-slate-800/60 border-slate-600 hover:bg-slate-700/60 transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-blue-300 border-blue-400">
                          {milestone.quarter}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-emerald-300">{milestone.revenue}</span>
                          <span className="text-sm text-slate-400">({milestone.margin} margin)</span>
                        </div>
                      </div>
                      <CardTitle className="text-white">{milestone.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Key Actions */}
                      <div>
                        <h4 className="font-medium text-blue-300 mb-2 flex items-center">
                          <Target className="h-4 w-4 mr-2" />
                          Keskeiset toimenpiteet
                        </h4>
                        <ul className="space-y-1 text-sm text-slate-300">
                          {milestone.keyActions.map((action, i) => (
                            <li key={i} className="flex items-start space-x-2">
                              <CheckCircle className="h-3 w-3 text-emerald-300 mt-1 flex-shrink-0" />
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Technologies */}
                      <div>
                        <h4 className="font-medium text-purple-400 mb-2 flex items-center">
                          <Brain className="h-4 w-4 mr-2" />
                          Teknologiat
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {milestone.technologies.map((tech, i) => (
                            <Badge key={i} className="bg-purple-100 text-purple-800 text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Risks */}
                      <div>
                        <h4 className="font-medium text-red-400 mb-2 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Keskeiset riskit
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {milestone.risks.map((risk, i) => (
                            <Badge key={i} className="bg-red-100 text-red-800 text-xs">
                              {risk}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Data-Driven Insights */}
                      {milestone.dataInsights && (
                        <div className="bg-slate-700/30 rounded-lg p-4 border-l-4 border-cyan-500">
                          <h4 className="font-medium text-cyan-400 mb-3 flex items-center">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Dataan perustuvat ennusteet
                            <Badge className={`ml-2 text-xs ${
                              milestone.dataInsights.confidence === 'high' ? 'bg-emerald-100 text-emerald-800' :
                              milestone.dataInsights.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {milestone.dataInsights.confidence} confidence
                            </Badge>
                          </h4>

                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div className="text-center">
                              <div className="text-lg font-bold text-cyan-300">{milestone.dataInsights.ces}</div>
                              <div className="text-xs text-slate-400">CES Target</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-300">€{milestone.dataInsights.arr}M</div>
                              <div className="text-xs text-slate-400">ARR Forecast</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-emerald-300">€{milestone.dataInsights.revenuePerEmployee}k</div>
                              <div className="text-xs text-slate-400">Rev/Employee</div>
                            </div>
                          </div>

                          <ul className="space-y-1 text-xs text-slate-300">
                            {milestone.dataInsights.keyDataPoints.map((point, i) => (
                              <li key={i} className="flex items-start space-x-2">
                                <BarChart3 className="h-3 w-3 text-cyan-400 mt-0.5 flex-shrink-0" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Lead Critical Success Factors */}
      <Card className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-blue-300 flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Technology Lead: Kriittiset menestystekijät</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Viikko 1-4: Foundation</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start space-x-2">
                  <Zap className="h-4 w-4 text-amber-300 mt-0.5 flex-shrink-0" />
                  <span>Automaattinen tukivastausten generointi (1-klikkaus)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Users className="h-4 w-4 text-emerald-300 mt-0.5 flex-shrink-0" />
                  <span>Henkilöstön asennemuutos ja visiokommunikaatio</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-blue-300 mt-0.5 flex-shrink-0" />
                  <span>Asiakasdata-auditointi ja eettinen käyttö</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-white">Kuukausi 2-6: Scaling</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start space-x-2">
                  <Brain className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>Agentic AI ja MCP-protokollan implementointi (RBAC, audit-jäljet, kontekstin rajaus)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <BarChart3 className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Mitattavan hyödyn varmistaminen (ROI tracking)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Lightbulb className="h-4 w-4 text-amber-300 mt-0.5 flex-shrink-0" />
                  <span>Uusien teknologioiden jatkuva arviointi</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-white">Vuosi 1+: Leadership</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start space-x-2">
                  <Rocket className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>Dynaaminen roadmap ja strategian mukautus</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Globe className="h-4 w-4 text-blue-300 mt-0.5 flex-shrink-0" />
                  <span>Markkinajohtajuuden rakentaminen</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Target className="h-4 w-4 text-emerald-300 mt-0.5 flex-shrink-0" />
                  <span>€10M vision toteutuksen johtaminen</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Detailed Implementation Tips */}
          <div className="mt-8 space-y-6">
            <h3 className="text-xl font-semibold text-white border-b border-slate-600 pb-2">
              Käytännön toteutusvinkit uudelle Technology Leadille
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Day 1-7 Actions */}
              <div className="bg-slate-700/20 rounded-lg p-5">
                <h4 className="font-semibold text-emerald-300 mb-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Ensimmäinen viikko (Päivät 1-7)
                </h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Päivä 1:</strong> Käyttökate-dashboardin pystytys ja baseline mittaus</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Päivä 2-3:</strong> Asiakaspalvelutiimin shadow & pain points dokumentointi</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Päivä 4-5:</strong> AI-pilot suunnittelu (Zendesk evaluation)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Päivä 6-7:</strong> Henkilöstön AI-asennekysely ja vision esittely</span>
                  </li>
                </ul>
              </div>

              {/* Key Metrics to Track */}
              <div className="bg-slate-700/20 rounded-lg p-5">
                <h4 className="font-semibold text-blue-300 mb-3 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Mittarit joita seurata päivittäin
                </h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center justify-between">
                    <span>Käyttökate (€/kk)</span>
                    <Badge className="bg-green-100 text-green-800 text-xs">THE KPI</Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Ticket resolution time</span>
                    <span className="text-xs text-slate-400">Baseline → Target</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>CSAT score</span>
                    <span className="text-xs text-slate-400">Weekly avg</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Agent efficiency</span>
                    <span className="text-xs text-slate-400">Tickets/hour</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>AI automation %</span>
                    <span className="text-xs text-slate-400">0% → 60%</span>
                  </li>
                </ul>
              </div>

              {/* Technology Decisions */}
              <div className="bg-slate-700/20 rounded-lg p-5">
                <h4 className="font-semibold text-purple-400 mb-3 flex items-center">
                  <Brain className="h-4 w-4 mr-2" />
                  Teknologiapäätökset kuukausi 1
                </h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Zendesk AI vs Intercom: Pilot-vertailu 2 viikkoa</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>N8N proof-of-concept: Custom workflow automation</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>MCP protocol: Turvallisuus-first lähestyminen (RBAC, eksplisiittinen kontekstin rajaus, audit-lokit)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Data infrastructure audit: GDPR & analytics readiness</span>
                  </li>
                </ul>
              </div>

              {/* Team Management */}
              <div className="bg-slate-700/20 rounded-lg p-5">
                <h4 className="font-semibold text-orange-400 mb-3 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Tiiminhallinta ja muutosjohtaminen
                </h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Weekly AI-koulutussessiot: "AI as a superpower"</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Success stories sharing: Aina kun AI auttaa</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Transparent metrics: Jokainen näkee käyttökatteen</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Address fears directly: "AI ei vie töitä, parantaa niitä"</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Critical Success Quote */}
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-lg border-l-4 border-yellow-500">
              <blockquote className="text-yellow-200 italic">
                <p className="mb-2">
                  "Technology Lead success = Business success. Jos käyttökate ei kasva, teknologia-investointi on epäonnistunut.
                  AI-timing on nyt 2-5 vuotta - sen jälkeen on liian myöhäistä."
                </p>
              </blockquote>
              <div className="text-xs text-amber-300 mt-2">
                — Strategic insight, Technology Leadership @Humm
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MCP Security Framework */}
      <Card className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-purple-500/50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="h-8 w-8 text-purple-400" />
            <h3 className="text-xl font-bold text-white">MCP-protokollan tietoturvakehikko</h3>
            <Badge className="bg-purple-600/80 text-white">Security-First</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* RBAC */}
            <div className="bg-slate-800/40 rounded-lg p-4 border border-purple-800/50">
              <h4 className="font-semibold text-purple-300 mb-3 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Roolipohjainen pääsy (RBAC)
              </h4>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>AI-agentti saa vain ne oikeudet, mitä sen tehtävä vaatii</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Vähimmän oikeuden periaate (esim. vain asiakkaan X tiedot)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Asiakaspalvelubotin oikeudet = asiakaspalvelijan oikeudet</span>
                </li>
              </ul>
            </div>

            {/* Context Limiting */}
            <div className="bg-slate-800/40 rounded-lg p-4 border border-indigo-800/50">
              <h4 className="font-semibold text-indigo-300 mb-3 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Eksplisiittinen kontekstin rajaus
              </h4>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>AI saa vain kulloinkin tarpeellisen tiedon</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Hiekkalaatikko-rajaus estää tietojen vuotamisen</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>GDPR-yhteensopiva datan minimointi</span>
                </li>
              </ul>
            </div>

            {/* Audit Trail */}
            <div className="bg-slate-800/40 rounded-lg p-4 border border-green-800/50">
              <h4 className="font-semibold text-green-300 mb-3 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Audit-jäljet ja valvonta
              </h4>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Jokainen AI-toiminto kirjataan läpinäkyvästi</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Vaatimustenmukaisuus (finanssi-, terveysala)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Jälkikäteen tarkastettavat AI-päätökset</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-700/20 rounded-lg border border-purple-600/30">
            <h5 className="font-semibold text-white mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-300" />
              MCP:n arvo Hummille
            </h5>
            <p className="text-sm text-slate-300 leading-relaxed">
              MCP mahdollistaa turvallisen AI-integraation: asiakaspalvelubotti voi hakea tietoa useista järjestelmistä
              (CRM, ERP, tiketti) samassa keskustelussa, mutta vain sallituissa rajoissa. Esimerkki: asiakas kysyy
              tilaustaan → AI kutsuu "hae_lasku_asiakkaalle_X" → saa vain kyseisen asiakkaan tiedot, ei muiden.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border-emerald-500/50">
        <CardContent className="p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold text-white">
            "Humm on ottamassa nyt oikeaa askelta oikeaan aikaan"
          </h3>
          <p className="text-slate-300 max-w-3xl mx-auto">
            Vahva tase + 2-5v aikaikkunahaaste + ketteryys kilpailuetuna + oikea teknologia-johtajuus =
            <strong className="text-emerald-300"> €10M revenue 2030</strong>
          </p>

          {/* Personal Commitment Section */}
          <div className="mt-6 p-4 bg-slate-800/40 rounded-lg border border-slate-600/30 max-w-2xl mx-auto">
            <h4 className="text-lg font-semibold text-amber-300 mb-2 flex items-center justify-center">
              <Target className="h-5 w-5 mr-2" />
              Henkilökohtainen sitoutuminen
            </h4>
            <p className="text-sm text-slate-200 italic">
              "Tämä ei ole minulle vain työ - se on missio. Elämän haasteet ovat opettaneet minulle,
              että aidot läpimurrot syntyvät silloin, kun on pakko onnistua. Hummin €10M visio
              vaatii johtajan, joka ymmärtää sekä teknologian mahdollisuudet että ihmisten tarpeet."
            </p>
            <div className="text-xs text-yellow-300 mt-2 font-medium">
              — Panu Murtokangas, Technology Lead -hakija
            </div>
          </div>

          <div className="flex justify-center space-x-4 pt-4">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <ArrowRight className="h-4 w-4 mr-2" />
              Implementoi strategia
            </Button>
            <Button variant="outline" className="border-blue-500 text-blue-300 hover:bg-blue-600/10">
              <Calendar className="h-4 w-4 mr-2" />
              Strategiatapaaminen
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategicRoadmap;