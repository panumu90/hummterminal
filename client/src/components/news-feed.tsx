import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Newspaper,
  TrendingUp,
  Globe,
  Shield,
  Lightbulb,
  Search,
  Filter,
  ExternalLink,
  Clock,
  Star,
  Target,
  Zap,
  Brain,
  Users,
  Building2,
  ChevronRight,
  Calendar,
  Tag
} from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  relevanceScore: number;
  category: 'industry' | 'technology' | 'regulation' | 'opportunity' | 'humm-specific';
  actionable: boolean;
  tags: string[];
  publishedAt: Date;
  readTime: number;
  url?: string;
  priority: 'high' | 'medium' | 'low';
}

const NewsFeed = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // Mock news data based on current AI/CX trends
  const mockNews: NewsItem[] = [
    {
      id: '1',
      title: 'Anthropic julkaisee MCP 2.0 – Turvallisuus ensimmäisenä prioriteettina',
      summary: 'Uusi versio Model Context Protocol -standardista tuo mukanaan parannetut RBAC-ominaisuudet ja audit-lokit. Erityisesti pk-yrityksille suunnattuja turvallisuusparannuksia.',
      source: 'Anthropic Blog',
      relevanceScore: 95,
      category: 'technology',
      actionable: true,
      tags: ['MCP', 'Security', 'RBAC', 'Audit'],
      publishedAt: new Date('2025-01-15T10:30:00'),
      readTime: 4,
      priority: 'high',
      url: 'https://anthropic.com/news/mcp-2.0'
    },
    {
      id: '2',
      title: 'Nordean AI-asiakaspalvelu kasvattaa käyttöä 40% Q4:ssä',
      summary: 'Nova-chatbotin menestys jatkuu Pohjoismaissa. Erityisesti nuoret asiakkaat suosivat AI-palvelua puhelinpalvelun sijaan. Malli voisi toimia benchmarkina Hummin asiakkaille.',
      source: 'Tivi.fi',
      relevanceScore: 88,
      category: 'industry',
      actionable: true,
      tags: ['Banking', 'Chatbot', 'Nordic', 'Customer Service'],
      publishedAt: new Date('2025-01-14T14:15:00'),
      readTime: 3,
      priority: 'high'
    },
    {
      id: '3',
      title: 'Jyväskylän yliopisto avaa AI-keskuksen – Etsii yrityspartnereita',
      summary: 'Uusi tutkimuskeskus keskittyy asiakaskokemuksen AI-ratkaisuihin. Hakevat aktiivisesti paikallisia yrityspartnereita pilot-projekteihin. Mahdollisuus Hummille?',
      source: 'Keskisuomalainen',
      relevanceScore: 92,
      category: 'opportunity',
      actionable: true,
      tags: ['Jyväskylä', 'University', 'Partnership', 'R&D'],
      publishedAt: new Date('2025-01-14T08:45:00'),
      readTime: 2,
      priority: 'high'
    },
    {
      id: '4',
      title: 'EU:n AI Act vaikuttaa asiakaspalvelu-AI:hin – Mitä yritysten tulee tietää',
      summary: 'Uudet säädökset edellyttävät läpinäkyvyyttä ja auditointia AI-järjestelmiltä. Pk-yrityksille 12kk siirtymäaika. Hummin kannattaa valmistautua ajoissa.',
      source: 'Tietoviikko',
      relevanceScore: 75,
      category: 'regulation',
      actionable: true,
      tags: ['EU AI Act', 'Compliance', 'Audit', 'SME'],
      publishedAt: new Date('2025-01-13T16:20:00'),
      readTime: 6,
      priority: 'medium'
    },
    {
      id: '5',
      title: 'Verkkokauppa.com:n AI-chatbot saavuttaa 80% ratkaisuasteen',
      summary: 'Suomalainen verkkokauppajätti raportoi ennätystuloksia. Chatbot hoitaa nyt 80% asiakaskyselyistä itsenäisesti. Asiakastyytyväisyys noussut 15%.',
      source: 'Kauppalehti',
      relevanceScore: 84,
      category: 'industry',
      actionable: false,
      tags: ['E-commerce', 'Finland', 'Success Story', 'Metrics'],
      publishedAt: new Date('2025-01-13T11:10:00'),
      readTime: 4,
      priority: 'medium'
    },
    {
      id: '6',
      title: 'Hyperpersonointi 2025: McKinsey-tutkimus paljastaa ROI-odotukset',
      summary: 'Uusi tutkimus osoittaa, että hyperpersonointi voi nostaa asiakasuskollisuutta 35%. Erityisesti B2B-sektorilla suuret mahdollisuudet.',
      source: 'McKinsey & Company',
      relevanceScore: 79,
      category: 'industry',
      actionable: false,
      tags: ['Hyperpersonalization', 'ROI', 'B2B', 'Research'],
      publishedAt: new Date('2025-01-12T13:30:00'),
      readTime: 8,
      priority: 'medium'
    },
    {
      id: '7',
      title: 'Humm Group hakee Technology Lead -positioon: AI-transformaation kärjessä',
      summary: 'Jyväskyläläinen CX-konsulttitalo panostaa voimakkaasti AI-osaamiseen. Tavoitteena €10M liikevaihto 2030 mennessä AI-palveluiden avulla.',
      source: 'Humm Group Blogi',
      relevanceScore: 100,
      category: 'humm-specific',
      actionable: false,
      tags: ['Humm Group', 'Recruitment', 'AI Strategy', 'Growth'],
      publishedAt: new Date('2025-01-12T09:15:00'),
      readTime: 3,
      priority: 'high'
    },
    {
      id: '8',
      title: 'Voice AI mullistaa asiakaspalvelun: Gartner ennustaa 60% kasvua',
      summary: 'Äänipohjainen tekoäly kasvaa nopeammin kuin ennustettiin. Erityisesti pohjoismainen markkina on kuuma. Mahdollisuus Hummille laajentaa palvelutarjontaa.',
      source: 'Gartner',
      relevanceScore: 72,
      category: 'technology',
      actionable: true,
      tags: ['Voice AI', 'Growth', 'Nordic', 'Opportunity'],
      publishedAt: new Date('2025-01-11T15:45:00'),
      readTime: 5,
      priority: 'medium'
    }
  ];

  const categories = [
    { id: 'all', label: 'Kaikki', icon: Globe, color: 'text-slate-400' },
    { id: 'industry', label: 'Toimiala', icon: Building2, color: 'text-blue-400' },
    { id: 'technology', label: 'Teknologia', icon: Brain, color: 'text-purple-400' },
    { id: 'regulation', label: 'Säädökset', icon: Shield, color: 'text-red-400' },
    { id: 'opportunity', label: 'Mahdollisuudet', icon: Target, color: 'text-green-400' },
    { id: 'humm-specific', label: 'Humm-uutiset', icon: Star, color: 'text-yellow-400' }
  ];

  const priorities = [
    { id: 'all', label: 'Kaikki prioriteetit' },
    { id: 'high', label: 'Korkea prioriteetti' },
    { id: 'medium', label: 'Keskiprioriteetti' },
    { id: 'low', label: 'Matala prioriteetti' }
  ];

  const filteredNews = mockNews.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || item.priority === selectedPriority;
    const matchesSearch = searchTerm === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesPriority && matchesSearch;
  }).sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : Globe;
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : 'text-slate-400';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-green-500 bg-green-500/10';
      default: return 'border-slate-500 bg-slate-500/10';
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Juuri nyt';
    if (diffHours < 24) return `${diffHours}h sitten`;
    if (diffDays < 7) return `${diffDays} päivää sitten`;
    return date.toLocaleDateString('fi-FI');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Newspaper className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">AI News & Insights</h1>
            <p className="text-slate-400">Kohdennettuja uutisia Humm Groupin AI-strategialle</p>
          </div>
        </div>
        <Badge className="bg-blue-600/80 text-white px-3 py-1">
          {filteredNews.length} uutista
        </Badge>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/40 border-slate-600/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Hae uutisia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white"
              />
            </div>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white text-sm"
            >
              {priorities.map(priority => (
                <option key={priority.id} value={priority.id}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map(category => {
              const IconComponent = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <Button
                  key={category.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`${isSelected
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-700/30 hover:bg-slate-600/50 text-slate-300 border-slate-600'
                  }`}
                >
                  <IconComponent className={`h-4 w-4 mr-2 ${category.color}`} />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* News Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredNews.map(item => {
          const CategoryIcon = getCategoryIcon(item.category);

          return (
            <Card
              key={item.id}
              className={`bg-slate-800/40 border hover:bg-slate-800/60 transition-all duration-200 ${getPriorityColor(item.priority)}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 text-sm text-slate-400">
                    <CategoryIcon className={`h-4 w-4 ${getCategoryColor(item.category)}`} />
                    <span>{item.source}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(item.publishedAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.actionable && (
                      <Badge variant="outline" className="border-green-500 text-green-400 text-xs">
                        <Lightbulb className="h-3 w-3 mr-1" />
                        Toimenpide
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        item.priority === 'high' ? 'border-red-400 text-red-400' :
                        item.priority === 'medium' ? 'border-yellow-400 text-yellow-400' :
                        'border-green-400 text-green-400'
                      }`}
                    >
                      {item.relevanceScore}%
                    </Badge>
                  </div>
                </div>

                <CardTitle className="text-white leading-tight text-base">
                  {item.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-slate-300 text-sm leading-relaxed">
                  {item.summary}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map(tag => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs border-slate-600 text-slate-400"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                      +{item.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                  <div className="flex items-center text-xs text-slate-400 space-x-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{item.readTime} min</span>
                    </div>
                  </div>

                  {item.url && (
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 p-0 h-auto">
                      <span className="text-xs mr-1">Lue lisää</span>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredNews.length === 0 && (
        <Card className="bg-slate-800/40 border-slate-600/50">
          <CardContent className="p-12 text-center">
            <Newspaper className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Ei uutisia löytynyt</h3>
            <p className="text-slate-400">Kokeile muuttaa hakuehtoja tai filttereitä.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NewsFeed;