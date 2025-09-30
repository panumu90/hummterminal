import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
            <p className="text-slate-300 animate-in fade-in-0 duration-700 delay-200">Success measured by käyttökate - the only metric that matters</p>
          </div>

          {/* Macro Economic Insights */}
          <Card className="mb-6 border-l-4 border-l-blue-500 bg-blue-50 animate-in slide-in-from-top-4 duration-500 delay-300">
            <CardContent className="pt-4">
              <div className="flex items-start space-x-3">
                <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Miksi makrotalous merkitsee nyt</h3>
                  <p className="text-sm text-blue-800 leading-relaxed mb-3">
                    Trumpin Fed-painostus alentaa korkoja, mikä helpottaa investointeja. Agentic AI on saavuttamassa kriittisen massan - 
                    nyt on 2-5 vuoden aikaikkuna tehdä iso organisaatiomuutos. 2 vuotta sitten olisi ollut liian aikainen, 
                    2 vuoden päästä olisi jo liian myöhäistä. Hummin vahva tase on kilpailuvaltti tässä kontekstissa.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Korkojen lasku helpottaa investointeja</Badge>
                    <Badge variant="outline" className="text-xs">Agentic AI saavuttaa kriittisen massan</Badge>
                    <Badge variant="outline" className="text-xs">2-5 vuoden aikaikkuna muutokselle</Badge>
                    <Badge variant="outline" className="text-xs">Vahva tase kilpailuetuna</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        {/* THE KPI - Käyttökate Hero Section */}
        <div className="bg-slate-800/60 border border-slate-600/50 rounded-xl p-8 mb-6">
          <div className="text-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="p-0 h-auto">
                  <div className="text-6xl font-bold text-slate-200 mb-2 hover:text-blue-400 transition-colors duration-200 animate-in fade-in-0 duration-700 delay-400">
                    €312k
                    <Info className="h-6 w-6 ml-2 opacity-60 inline" />
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Miksi käyttökate on THE KPI</DialogTitle>
                  <DialogDescription className="text-base">
                    Technology Lead -roolin ydin on kannattavuuden parantaminen, ei vain teknologian käyttöönotto
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-gray-600">Nykyinen käyttökate</h4>
                      <p className="text-2xl font-bold text-blue-600">€200k</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-gray-600">Tavoite</h4>
                      <p className="text-2xl font-bold text-green-600">€312k</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-600">Strategiset perusteet</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                        AI-automatisointi vähentää manuaalista työtä 40-60%
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                        Skaalautuvat prosessit alentavat yksikkökustannuksia
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                        Uudet palvelutuotteet tuovat korkeampia marginaaleja
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                        Avoimen lähdekoodin mallit alentavat kustannuksia merkittävästi
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-600">Makrotaloudellinen konteksti</h4>
                    <p className="text-sm text-gray-700">
                      Korkojen lasku helpottaa investointeja, mikä nopeuttaa ROI:ta. 
                      Agentic AI on saavuttamassa kriittisen massan - nyt on oikea hetki toimia.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <div className="text-xl text-white mb-2 animate-in fade-in-0 duration-700 delay-500">Käyttökate (EBITDA) - THE KPI</div>
            <div className="text-slate-300 mb-4 animate-in fade-in-0 duration-700 delay-600">Technology Lead success = käyttökate success</div>
            <div className="flex justify-center items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-slate-200" />
                <span className="text-slate-200 font-medium">+156% vuositasolla</span>
              </div>
              <div className="text-slate-400">vs. -€4,870 baseline</div>
              <div className="flex items-center space-x-4">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600"
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