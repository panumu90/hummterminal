import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'positive' | 'negative';
  subtitle?: string;
}

const TechLeadDashboard = () => {
  const keyMetrics: MetricCard[] = [
    {
      title: "Liikevaihto",
      value: "€2.48M",
      change: 18.2,
      changeType: 'positive',
      subtitle: "vs. edellinen vuosi"
    },
    {
      title: "Käyttökate (EBITDA)",
      value: "€312K",
      change: 156,
      changeType: 'positive',
      subtitle: "Automaation vaikutus"
    },
    {
      title: "Revenue per Employee",
      value: "€118K",
      change: 14.2,
      changeType: 'positive',
      subtitle: "THE KPI - Tuottavuusmittari"
    },
    {
      title: "Customer Satisfaction",
      value: "8.7/10",
      change: 24,
      changeType: 'positive',
      subtitle: "CSAT score"
    },
  ];

  const operationalMetrics: MetricCard[] = [
    {
      title: "Resolution Time",
      value: "1.2h",
      change: 42,
      changeType: 'negative',
      subtitle: "Keskimääräinen ratkaisu"
    },
    {
      title: "Automation Rate",
      value: "78%",
      change: 23,
      changeType: 'positive',
      subtitle: "Tikettien automatisointi"
    },
    {
      title: "Cost Savings",
      value: "€156K",
      change: 89,
      changeType: 'positive',
      subtitle: "Vuotuinen säästö"
    },
    {
      title: "NPS Score",
      value: "68",
      change: 31,
      changeType: 'positive',
      subtitle: "Net Promoter Score"
    },
  ];

  const projects = [
    { 
      name: "AI-vastausluonnokset tiketteihin", 
      progress: 85, 
      status: 'active' as const,
      impact: 'Kriittinen tehokkuusparannus'
    },
    { 
      name: "Automaatioaste 60% → 85%", 
      progress: 62, 
      status: 'active' as const,
      impact: 'Kustannussäästö €50K/v'
    },
    { 
      name: "Customer onboarding -50%", 
      progress: 91, 
      status: 'completed' as const,
      impact: 'Parantunut asiakaskokemus'
    },
    { 
      name: "CSAT 8.7 → 9.2", 
      progress: 45, 
      status: 'planning' as const,
      impact: 'Asiakasuskollisuus +15%'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-2">Technology Lead Dashboard</h1>
        <p className="text-sm text-slate-400">Liiketoimintavaikutukset ja keskeiset mittarit</p>
      </div>

      {/* Key Business Metrics */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-4">Liiketoimintamittarit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {keyMetrics.map((metric, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <p className="text-sm text-slate-400">{metric.title}</p>
                  {metric.changeType === 'positive' ? (
                    <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-emerald-400" />
                  )}
                </div>
                <p className="text-2xl font-semibold text-white mb-1">{metric.value}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`${
                    metric.changeType === 'positive' ? 'border-emerald-500/30 text-emerald-400' : 'border-emerald-500/30 text-emerald-400'
                  } text-xs`}>
                    {metric.changeType === 'positive' ? '+' : '-'}{Math.abs(metric.change)}%
                  </Badge>
                  {metric.subtitle && (
                    <p className="text-xs text-slate-500">{metric.subtitle}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Operational Metrics */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-4">Operatiiviset mittarit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {operationalMetrics.map((metric, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <p className="text-sm text-slate-400">{metric.title}</p>
                  {metric.changeType === 'positive' ? (
                    <ArrowUpRight className="h-4 w-4 text-blue-400" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-blue-400" />
                  )}
                </div>
                <p className="text-2xl font-semibold text-white mb-1">{metric.value}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`${
                    metric.changeType === 'positive' ? 'border-blue-500/30 text-blue-400' : 'border-blue-500/30 text-blue-400'
                  } text-xs`}>
                    {metric.changeType === 'positive' ? '+' : '-'}{Math.abs(metric.change)}%
                  </Badge>
                  {metric.subtitle && (
                    <p className="text-xs text-slate-500">{metric.subtitle}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Active Projects */}
      <div>
        <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-4">Käynnissä olevat projektit</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((project, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-white mb-1">{project.name}</h3>
                    <p className="text-xs text-slate-400">{project.impact}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`ml-2 text-xs ${
                      project.status === 'completed' 
                        ? 'border-emerald-500/30 text-emerald-400' 
                        : project.status === 'active'
                        ? 'border-blue-500/30 text-blue-400'
                        : 'border-slate-500/30 text-slate-400'
                    }`}
                  >
                    {project.status === 'completed' ? 'Valmis' : project.status === 'active' ? 'Käynnissä' : 'Suunnittelu'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Edistyminen</span>
                    <span className="text-white font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all ${
                        project.status === 'completed' 
                          ? 'bg-emerald-500' 
                          : project.status === 'active'
                          ? 'bg-blue-500'
                          : 'bg-slate-500'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Strategic Insight */}
      <div className="mt-8">
        <Card className="bg-blue-950/30 border-blue-800/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Target className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-300 mb-2">Strateginen tavoite: €10M liikevaihto</h3>
                <p className="text-sm text-slate-300 mb-3">
                  Nykyinen liikevaihto €2.48M. Tavoite vaatii 4x kasvun seuraavan 5 vuoden aikana.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-slate-400 mb-1">Teknologian rooli</p>
                    <p className="text-white font-medium">Automaatio + AI-integraatiot</p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1">Aikajänne</p>
                    <p className="text-white font-medium">2025-2030 (5 vuotta)</p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1">Kriittinen mittari</p>
                    <p className="text-white font-medium">Revenue per Employee</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TechLeadDashboard;
