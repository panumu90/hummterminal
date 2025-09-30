import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Code,
  Server,
  DollarSign,
  Target,
  Lightbulb,
  GitCommit,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  Rocket,
  Zap,
  RefreshCw,
  Gauge,
  UserCheck,
  Info,
  ArrowRight,
  Globe,
  Brain
} from "lucide-react";

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface ProjectMetric {
  name: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'completed';
  impact: 'high' | 'medium' | 'low';
}

const TechLeadDashboard = () => {
  const [selectedView, setSelectedView] = useState<'executive' | 'technical' | 'operational'>('executive');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Simulated real-time stock data (in production, fetch from API)
  const stockData = {
    'NVDA': { price: 135.58, change: 2.4, changeAmount: 3.18 },
    'META': { price: 621.43, change: 1.8, changeAmount: 10.98 },
    'GOOGL': { price: 178.23, change: 1.2, changeAmount: 2.12 },
    'MSFT': { price: 428.76, change: 0.8, changeAmount: 3.40 },
    'TSLA': { price: 248.91, change: -1.5, changeAmount: -3.79 },
    'AAPL': { price: 189.43, change: 0.5, changeAmount: 0.94 }
  };

  // Fed rate forecast data
  const fedRates = [
    { date: 'Now', rate: 4.50, note: 'Current' },
    { date: 'Q2 2025', rate: 4.00, note: 'Expected cut' },
    { date: 'Q4 2025', rate: 3.25, note: 'Target' }
  ];

  // AI adoption metrics
  const aiMetrics = [
    { company: 'OpenAI GPT-4', adoption: 92, trend: 'up' },
    { company: 'Anthropic Claude', adoption: 78, trend: 'up' },
    { company: 'Agentic Workflows', adoption: 45, trend: 'up' }
  ];

  // Load TradingView widget script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbol": "NASDAQ:NVDA",
      "width": "100%",
      "height": "220",
      "locale": "en",
      "dateRange": "1D",
      "colorTheme": "dark",
      "isTransparent": true,
      "autosize": true,
      "largeChartUrl": ""
    });

    const container = document.getElementById('tradingview-widget');
    if (container && !container.hasChildNodes()) {
      container.appendChild(script);
    }

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  // Business Impact Metrics - Technology Lead Performance
  const [metrics, setMetrics] = useState<MetricCard[]>([
    {
      title: "Liikevaihto",
      value: "€2.48M",
      change: 18.2,
      changeType: 'increase',
      icon: DollarSign,
      description: "Technology-driven revenue growth"
    },
    {
      title: "Käyttökate",
      value: "€312k",
      change: 156,
      changeType: 'increase',
      icon: TrendingUp,
      description: "EBITDA improvement from automation"
    },
    {
      title: "Customer Satisfaction",
      value: "8.7/10",
      change: 24,
      changeType: 'increase',
      icon: Users,
      description: "CSAT score improvement"
    },
    {
      title: "Net Promoter Score",
      value: "68",
      change: 31,
      changeType: 'increase',
      icon: Target,
      description: "NPS driven by tech improvements"
    },
    {
      title: "Cost Savings",
      value: "€156k",
      change: 89,
      changeType: 'increase',
      icon: Activity,
      description: "Annual savings from automation"
    },
    {
      title: "Resolution Time",
      value: "1.2h",
      change: -42,
      changeType: 'decrease',
      icon: Zap,
      description: "Average customer issue resolution"
    },
    {
      title: "Customer Effort Score",
      value: "2.3",
      change: -18,
      changeType: 'decrease',
      icon: UserCheck,
      description: "CES: Lower is better (1-5 scale)"
    },
    {
      title: "Annual Recurring Revenue",
      value: "€1.85M",
      change: 23.5,
      changeType: 'increase',
      icon: RefreshCw,
      description: "ARR growth from recurring services"
    },
    {
      title: "Revenue per Employee",
      value: "€118k",
      change: 14.2,
      changeType: 'increase',
      icon: Gauge,
      description: "Productivity: Revenue/FTE efficiency"
    }
  ]);

  const [projects, setProjects] = useState<ProjectMetric[]>([
    { name: "AI-vastausluonnokset tiketteihin (one-click-send)", progress: 85, status: 'on-track', impact: 'high' },
    { name: "Asiakaspalvelun automaatioaste nostaminen 60% → 85%", progress: 62, status: 'on-track', impact: 'high' },
    { name: "Customer onboarding ajan lyhentäminen 50%", progress: 91, status: 'completed', impact: 'high' },
    { name: "CSAT-pisteiden nostaminen 8.7 → 9.2", progress: 45, status: 'at-risk', impact: 'high' },
    { name: "Asiakashankintakustannusten pudotus 25%", progress: 78, status: 'on-track', impact: 'high' }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        change: metric.change + (Math.random() - 0.5) * 2
      })));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'on-track': return 'bg-blue-500';
      case 'at-risk': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-slate-200';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6 p-6 bg-slate-900 min-h-screen">
        {/* Header with THE KPI */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-white mb-2 animate-in fade-in-0 duration-700">Technology Lead Business Impact</h1>
            <p className="text-slate-300 animate-in fade-in-0 duration-700 delay-200">Success measured by Revenue per Employee - the ultimate efficiency metric</p>
          </div>

          {/* Real-time Macro Economic Dashboard */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {/* Fed Rate & AI Timing Window */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredCard('fedrates')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card className="border-l-4 border-l-amber-500 bg-slate-800/50 border-slate-700/50 transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/10">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <TrendingDown className="h-5 w-5 text-amber-400 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-amber-300 text-sm mb-2">Fed Rate Trajectory</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400">Current Rate</span>
                          <span className="text-sm font-bold text-white">4.50%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400">Expected Q4 2025</span>
                          <span className="text-sm font-bold text-green-400">3.25%</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                          💡 Trump-painostus + inflaation hidastuminen → korkoja alas → helpompi investoida AI:hin
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dropdown for Fed Rates */}
              <AnimatePresence>
                {hoveredCard === 'fedrates' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-0 right-0 mt-2 p-4 bg-slate-800 border border-amber-500/30 rounded-lg shadow-2xl z-50"
                  >
                    <h4 className="text-sm font-semibold text-amber-300 mb-3">Fed Rate Forecast Timeline</h4>
                    <div className="space-y-2">
                      {fedRates.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex justify-between items-center p-2 bg-slate-700/50 rounded"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">{item.date}</span>
                            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs">
                              {item.note}
                            </Badge>
                          </div>
                          <span className="text-sm font-bold text-white">{item.rate}%</span>
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-3 italic">💡 Lower rates = easier AI investment justification</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* AI Market Timing */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredCard('aitiming')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card className="border-l-4 border-l-purple-500 bg-slate-800/50 border-slate-700/50 transition-all duration-200 hover:shadow-xl hover:shadow-purple-500/10">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-purple-400 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-purple-300 text-sm mb-2">AI Timing Window</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400">Agentic AI Maturity</span>
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/30 text-xs">Ready</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400">Action Window</span>
                          <span className="text-sm font-bold text-amber-400">2-5 vuotta</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                          ⏰ <strong className="text-purple-300">Nyt tai ei koskaan:</strong> 2v sitten liian aikaista, 2v kuluttua liian myöhäistä
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dropdown for AI Metrics */}
              <AnimatePresence>
                {hoveredCard === 'aitiming' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-0 right-0 mt-2 p-4 bg-slate-800 border border-purple-500/30 rounded-lg shadow-2xl z-50"
                  >
                    <h4 className="text-sm font-semibold text-purple-300 mb-3">AI Adoption Metrics</h4>
                    <div className="space-y-2">
                      {aiMetrics.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex justify-between items-center p-2 bg-slate-700/50 rounded"
                        >
                          <span className="text-xs text-slate-300">{item.company}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={item.adoption} className="w-16 h-1" />
                            <span className="text-sm font-bold text-white">{item.adoption}%</span>
                            <TrendingUp className="h-3 w-3 text-green-400" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-3 italic">🚀 Enterprise AI adoption accelerating</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tech Stocks - Real-time */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredCard('stocks')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card className="border-l-4 border-l-blue-500 bg-slate-800/50 border-slate-700/50 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/10">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <BarChart3 className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue-300 text-sm mb-2">AI Tech Stocks (Live)</h3>
                        <p className="text-xs text-slate-400">
                          📈 AI-investointien markkinavalidaatio jatkuu - instituutiot uskovat kasvuun
                        </p>
                      </div>
                    </div>
                    {/* TradingView Widget */}
                    <div className="tradingview-widget-container" id="tradingview-widget">
                      <div className="tradingview-widget-container__widget"></div>
                    </div>
                    <p className="text-xs text-slate-500 text-center">Powered by TradingView</p>
                  </div>
                </CardContent>
              </Card>

              {/* Dropdown for Stocks */}
              <AnimatePresence>
                {hoveredCard === 'stocks' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-0 right-0 mt-2 p-4 bg-slate-800 border border-blue-500/30 rounded-lg shadow-2xl z-50"
                  >
                    <h4 className="text-sm font-semibold text-blue-300 mb-3">Top AI Tech Stocks (Today)</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(stockData).map(([symbol, data], idx) => (
                        <motion.div
                          key={symbol}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex flex-col p-2 bg-slate-700/50 rounded"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-300">{symbol}</span>
                            <span className={`text-xs font-medium ${data.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {data.change >= 0 ? '+' : ''}{data.change}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-white">${data.price}</span>
                            <span className={`text-xs ${data.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {data.change >= 0 ? '+' : ''}{data.changeAmount}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-3 italic">💰 Market validates AI infrastructure investment</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Strategic Insight Banner */}
          <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30 mb-6">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-6 w-6 text-yellow-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white mb-2">Miksi Hummin pitää toimia nyt</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-300">
                    <div>
                      <p className="font-semibold text-blue-300 mb-1">1. Makrotalous tukee</p>
                      <p className="text-xs">Korot laskevat → ROI paranee → helpompi perustella AI-investoinnit johdolle</p>
                    </div>
                    <div>
                      <p className="font-semibold text-purple-300 mb-1">2. Teknologia kypsä</p>
                      <p className="text-xs">Agentic AI + n8n + OSS = kustannustehokas toteutus ilman isoa tiimiä</p>
                    </div>
                    <div>
                      <p className="font-semibold text-emerald-300 mb-1">3. Kilpailuetu katoaa</p>
                      <p className="text-xs">First-mover advantage: 2 vuoden päästä kaikki tekevät samaa → differentiaatio vaikeaa</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        {/* THE KPI - Revenue per Employee Hero Section */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-600/50 rounded-xl p-8 mb-6">
          <div className="text-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="p-0 h-auto">
                  <div className="text-6xl font-bold text-white mb-2 hover:text-blue-400 transition-colors duration-200 animate-in fade-in-0 duration-700 delay-400">
                    €192k
                    <Info className="h-6 w-6 ml-2 opacity-60 inline" />
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-white">Miksi Revenue per Employee on THE KPI</DialogTitle>
                  <DialogDescription className="text-base text-slate-300">
                    Tech Leadin ensisijainen tehtävä: skaalata liiketoimintaa ilman lineaarista henkilöstönkasvua
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <h4 className="font-semibold text-sm text-red-400">Nykytila</h4>
                      <p className="text-3xl font-bold text-red-300">€40k</p>
                      <p className="text-xs text-slate-400">€2.1M / 52 hlöä</p>
                    </div>
                    <div className="space-y-2 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <h4 className="font-semibold text-sm text-green-400">Tavoite 2028</h4>
                      <p className="text-3xl font-bold text-green-300">€192k</p>
                      <p className="text-xs text-slate-400">€10M / 52 hlöä</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-blue-400">Miksi tämä mittari?</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-400 flex-shrink-0" />
                        <strong className="text-white">Suora Tech-vaikutus:</strong> AI-automaatio nostaa tätä → Tech Lead vaikuttaa 100%
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-400 flex-shrink-0" />
                        <strong className="text-white">Skaalautuvuuden mittari:</strong> Kasvatatko liiketoimintaa vai vain headcountia?
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-400 flex-shrink-0" />
                        <strong className="text-white">Johdolle ymmärrettävä:</strong> CFO/CEO näkee välittömästi automation ROI:n
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-400 flex-shrink-0" />
                        <strong className="text-white">Realistinen aikataulu:</strong> Reagoi teknologisiin muutoksiin 3-6kk:ssa
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <h4 className="font-semibold text-sm text-amber-400 mb-2">Benchmark: Epassi (€150M revenue)</h4>
                    <p className="text-sm text-slate-300">
                      Suomalainen success story: digitaalisten palveluiden avulla €150M liikevaihto <strong className="text-white">ilman massiivista henkilöstökasvua</strong>.
                      Hummin roadmap noudattaa samaa kaavaa: automaatio → skaalautuvuus → korkea revenue/employee.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <div className="text-xl text-white mb-2 animate-in fade-in-0 duration-700 delay-500">Revenue per Employee - THE KPI</div>
            <div className="text-slate-300 mb-4 animate-in fade-in-0 duration-700 delay-600">
              Tech Lead success = skaalaa ilman henkilöstölisäystä
            </div>
            <div className="flex justify-center items-center gap-8 text-sm">
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Nykytila</p>
                <p className="text-2xl font-bold text-red-400">€40k</p>
              </div>
              <ArrowRight className="h-8 w-8 text-slate-600" />
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Q4 2025 tavoite</p>
                <p className="text-2xl font-bold text-amber-400">€76k</p>
                <p className="text-xs text-green-400">+90%</p>
              </div>
              <ArrowRight className="h-8 w-8 text-slate-600" />
              <div className="space-y-1">
                <p className="text-xs text-slate-500">2028 tavoite</p>
                <p className="text-2xl font-bold text-green-400">€192k</p>
                <p className="text-xs text-green-400">+380%</p>
              </div>
              <div className="flex items-center gap-4 ml-6">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 text-sm"
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                </select>
                <Badge variant="secondary" className="bg-slate-700 text-slate-200">
                  Live Data
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Switcher */}
      <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-600 animate-in slide-in-from-top-4 duration-500 delay-700">
          <TabsTrigger value="executive" className="data-[state=active]:bg-slate-700">
            <BarChart3 className="h-4 w-4 mr-2" />
            Executive View
          </TabsTrigger>
          <TabsTrigger value="technical" className="data-[state=active]:bg-slate-700">
            <Code className="h-4 w-4 mr-2" />
            Technical View
          </TabsTrigger>
          <TabsTrigger value="operational" className="data-[state=active]:bg-slate-700">
            <Activity className="h-4 w-4 mr-2" />
            Operational View
          </TabsTrigger>
        </TabsList>

        {/* Executive View */}
        <TabsContent value="executive" className="space-y-6 animate-in fade-in-0 duration-600 delay-800">
          {/* Key Performance Indicators - Premium Focus */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-400" />
              Keskeiset mittarit (Tech Lead KPI:t)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Highlight the key metrics */}
              {metrics.filter(m => ['Customer Effort Score', 'Annual Recurring Revenue', 'Revenue per Employee'].includes(m.title)).map((metric, index) => (
                <Card key={index} className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 hover:border-blue-500/50 transition-all duration-200 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                          <metric.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{metric.title}</h3>
                          <p className="text-xs text-slate-300">{metric.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-white">{metric.value}</span>
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
                        metric.changeType === 'increase' ? 'bg-emerald-500/10 text-emerald-400' :
                        metric.changeType === 'decrease' && metric.title === 'Customer Effort Score' ? 'bg-emerald-500/10 text-emerald-400' :
                        metric.changeType === 'decrease' ? 'bg-red-500/10 text-red-400' : 'text-slate-400'
                      }`}>
                        {(metric.changeType === 'increase' || (metric.changeType === 'decrease' && metric.title === 'Customer Effort Score')) ?
                          <TrendingUp className="h-4 w-4" /> :
                          <TrendingDown className="h-4 w-4" />
                        }
                        <span className="text-sm font-medium">{Math.abs(metric.change).toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* All Business Metrics */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-slate-400" />
              Liiketoiminta-mittarit
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {metrics.map((metric, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 transition-all duration-300 hover:shadow-lg hover:scale-105 animate-in fade-in-0 slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-700 rounded-lg">
                        <metric.icon className="h-5 w-5 text-slate-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{metric.title}</h3>
                        <p className="text-xs text-slate-400">{metric.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">{metric.value}</span>
                    <div className={`flex items-center space-x-1 ${
                      metric.changeType === 'increase' ? 'text-emerald-400' :
                      metric.changeType === 'decrease' && metric.title === 'Customer Effort Score' ? 'text-emerald-400' :
                      metric.changeType === 'decrease' ? 'text-red-400' : 'text-slate-400'
                    }`}>
                      {(metric.changeType === 'increase' || (metric.changeType === 'decrease' && metric.title === 'Customer Effort Score')) ?
                        <TrendingUp className="h-4 w-4" /> :
                        <TrendingDown className="h-4 w-4" />
                      }
                      <span className="text-sm font-medium">{Math.abs(metric.change).toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          </div>

          {/* Business Impact Summary */}
          <Card className="bg-slate-800/40 border-slate-600/50">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Technology Lead Business Impact</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-1">2.3</div>
                  <div className="text-sm text-slate-300">Customer Effort Score</div>
                  <div className="text-xs text-slate-400">↓18% parempi</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-1">€1.85M</div>
                  <div className="text-sm text-slate-300">Annual Recurring Revenue</div>
                  <div className="text-xs text-slate-400">+23.5%</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-1">€118k</div>
                  <div className="text-sm text-slate-300">Revenue per Employee</div>
                  <div className="text-xs text-slate-400">+14.2% tehokkuus</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-200 mb-1">68</div>
                  <div className="text-sm text-slate-300">Net Promoter Score</div>
                  <div className="text-xs text-slate-400">+31%</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-200 mb-1">8.7/10</div>
                  <div className="text-sm text-slate-300">Customer Satisfaction</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technical View */}
        <TabsContent value="technical" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Architecture Health */}
            <Card className="bg-slate-800/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center space-x-2">
                  <Server className="h-5 w-5" />
                  <span>Architecture Health Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Code Quality</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={87} className="w-24" />
                      <span className="text-white font-medium">87%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Security Score</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={92} className="w-24" />
                      <span className="text-white font-medium">92%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Performance</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={78} className="w-24" />
                      <span className="text-white font-medium">78%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Scalability</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={85} className="w-24" />
                      <span className="text-white font-medium">85%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Innovation Pipeline */}
            <Card className="bg-slate-800/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5" />
                  <span>Innovation Pipeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-slate-300">AI/ML Integration</span>
                    <Badge className="bg-slate-700 text-slate-200">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-slate-300">Cloud Migration</span>
                    <Badge className="bg-slate-700 text-slate-200">Planning</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-slate-300">Blockchain PoC</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Research</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-slate-300">DevOps 2.0</span>
                    <Badge className="bg-slate-700 text-slate-200">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Operational View */}
        <TabsContent value="operational" className="space-y-6">
          {/* Current Projects */}
          <Card className="bg-slate-800/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Current Projects & Initiatives</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-white">{project.name}</h4>
                        <Badge className={`${getStatusColor(project.status)} text-white`}>
                          {project.status}
                        </Badge>
                        <span className={`text-xs font-medium ${getImpactColor(project.impact)}`}>
                          {project.impact.toUpperCase()} IMPACT
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={project.progress} className="flex-1" />
                        <span className="text-sm text-slate-300 font-medium">{project.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Business Performance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Revenue Impact</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-200 mb-2">€438k</div>
                  <p className="text-slate-300 text-sm">Technology-driven revenue</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">New customers</span>
                      <span className="text-white">+28</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Upsell rate</span>
                      <span className="text-slate-200">+34%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Customer Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-200 mb-2">8.7</div>
                  <p className="text-slate-300 text-sm">Customer Satisfaction</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">NPS Score</span>
                      <span className="text-white">68</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Churn Rate</span>
                      <span className="text-slate-200">-18%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Operational Excellence</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">Automaatioaste</span>
                    <Badge className="bg-slate-700 text-slate-200">74%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">Kustannussäästö</span>
                    <Badge className="bg-slate-700 text-slate-200">€156k</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">Process efficiency</span>
                    <Badge className="bg-slate-700 text-slate-200">+42%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Business Actions */}
      <Card className="bg-slate-800/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Rocket className="h-5 w-5" />
            <span>Business Impact Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="bg-slate-600 hover:bg-slate-700 text-white h-auto py-4 px-6 flex flex-col items-center space-y-2">
              <DollarSign className="h-6 w-6" />
              <span className="text-sm">Revenue Report</span>
            </Button>
            <Button className="bg-slate-600 hover:bg-slate-700 text-white h-auto py-4 px-6 flex flex-col items-center space-y-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">CSAT Analysis</span>
            </Button>
            <Button className="bg-slate-600 hover:bg-slate-700 text-white h-auto py-4 px-6 flex flex-col items-center space-y-2">
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">Cost Optimization</span>
            </Button>
            <Button className="bg-slate-600 hover:bg-slate-700 text-white h-auto py-4 px-6 flex flex-col items-center space-y-2">
              <Target className="h-6 w-6" />
              <span className="text-sm">ROI Dashboard</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechLeadDashboard;