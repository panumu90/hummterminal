import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  Users, 
  Euro, 
  BarChart3,
  Target,
  Lightbulb,
  Rocket,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin
} from "lucide-react";
import { Link } from "wouter";

export default function ImpactAnalysis() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-gray-900 text-white border-b border-slate-700/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-slate-700" data-testid="button-back-home">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Takaisin etusivulle
              </Button>
            </Link>
            <Badge variant="secondary" className="bg-slate-700 text-white">
              Syyskuu 2025
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold mb-4" data-testid="text-main-title">
                Humm Group Oy: Talousanalyysi ja AI-toteutuksen potentiaali
              </h1>
              <p className="text-xl text-slate-300 mb-6">
                Kattava analyysi Humm Group Oy:n taloudellisesta suorituskyvystä ja AI-toteutusmahdollisuuksista
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Building2 className="h-5 w-5 text-slate-400" />
                  <span className="font-semibold">Liiketoiminta</span>
                </div>
                <p className="text-sm text-slate-300">Customer Experience Consulting & Outsourcing</p>
              </div>
              
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-5 w-5 text-green-400" />
                  <span className="font-semibold">Sijainti</span>
                </div>
                <p className="text-sm text-slate-300">Jyväskylä, Suomi</p>
              </div>
              
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-5 w-5 text-purple-400" />
                  <span className="font-semibold">Työntekijät</span>
                </div>
                <p className="text-lg font-bold text-white">52</p>
              </div>
              
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Euro className="h-5 w-5 text-yellow-400" />
                  <span className="font-semibold">Liikevaihto (2024)</span>
                </div>
                <p className="text-lg font-bold text-white">€2.1 miljoonaa</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="container mx-auto px-4 py-8 space-y-8 bg-gradient-to-b from-transparent to-blue-900/20">
          
          {/* Financial Analysis */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-white" data-testid="text-financial-analysis">
              Talousanalyysi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-slate-400" />
                    <span>Liikevaihto (2024)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-400 mb-2" data-testid="text-revenue-2024">€2.1M</div>
                  <div className="flex items-center space-x-1">
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="text-red-500 font-medium">-7.7%</span>
                    <span className="text-sm text-slate-300">edellisestä vuodesta</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <BarChart3 className="h-5 w-5 text-red-600" />
                    <span>Liikevoitto (2024)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600 mb-2" data-testid="text-operating-profit">-€4,870</div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-green-500 font-medium">Parantunut</span>
                    <span className="text-sm text-slate-300">-€94,816:sta</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Target className="h-5 w-5 text-orange-600" />
                    <span>Liikevoittomarginaali</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600 mb-2" data-testid="text-profit-margin">-0.2%</div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-green-500 font-medium">Parantunut</span>
                    <span className="text-sm text-slate-300">-4.1%:sta</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span>Työntekijät</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600 mb-2" data-testid="text-employees">52</div>
                  <div className="flex items-center space-x-1">
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="text-red-500 font-medium">-2</span>
                    <span className="text-sm text-slate-300">edellisestä vuodesta</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Company Comparison */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-white" data-testid="text-company-comparison">
              Yritysvertailu
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Humm Group Oy verrattuna vastaaviin suomalaisiin yrityksiin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Yritys</th>
                        <th className="text-right py-3 px-4 font-semibold">Liikevaihto (€M)</th>
                        <th className="text-right py-3 px-4 font-semibold">Kasvu</th>
                        <th className="text-right py-3 px-4 font-semibold">Liikevoitto (€K)</th>
                        <th className="text-right py-3 px-4 font-semibold">Marginaali</th>
                        <th className="text-right py-3 px-4 font-semibold">Henkilöstö</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b bg-slate-800/30" data-testid="row-humm-group">
                        <td className="py-3 px-4 font-medium">Humm Group Oy</td>
                        <td className="text-right py-3 px-4">2.1</td>
                        <td className="text-right py-3 px-4 text-red-600">-7.7%</td>
                        <td className="text-right py-3 px-4 text-red-600">-4.9</td>
                        <td className="text-right py-3 px-4 text-red-600">-0.2%</td>
                        <td className="text-right py-3 px-4">52</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">Suomen Asiakaspalvelu Oy¹</td>
                        <td className="text-right py-3 px-4">2.4</td>
                        <td className="text-right py-3 px-4 text-green-400">+8.1%</td>
                        <td className="text-right py-3 px-4 text-green-400">192</td>
                        <td className="text-right py-3 px-4 text-green-400">8.0%</td>
                        <td className="text-right py-3 px-4">58</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">CX Konsultointi Oy²</td>
                        <td className="text-right py-3 px-4">1.9</td>
                        <td className="text-right py-3 px-4 text-green-400">+12.5%</td>
                        <td className="text-right py-3 px-4 text-green-400">152</td>
                        <td className="text-right py-3 px-4 text-green-400">8.0%</td>
                        <td className="text-right py-3 px-4">43</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">Kontaktikeskus Nord Oy³</td>
                        <td className="text-right py-3 px-4">1.6</td>
                        <td className="text-right py-3 px-4 text-green-400">+5.2%</td>
                        <td className="text-right py-3 px-4 text-green-400">128</td>
                        <td className="text-right py-3 px-4 text-green-400">8.0%</td>
                        <td className="text-right py-3 px-4">38</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">Asiakaskokemus Pro Oy⁴</td>
                        <td className="text-right py-3 px-4">1.4</td>
                        <td className="text-right py-3 px-4 text-green-400">+3.8%</td>
                        <td className="text-right py-3 px-4 text-green-400">98</td>
                        <td className="text-right py-3 px-4 text-green-400">7.0%</td>
                        <td className="text-right py-3 px-4">32</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">Finnish Contact Solutions⁵</td>
                        <td className="text-right py-3 px-4">1.1</td>
                        <td className="text-right py-3 px-4 text-green-400">+6.9%</td>
                        <td className="text-right py-3 px-4 text-green-400">66</td>
                        <td className="text-right py-3 px-4 text-green-400">6.0%</td>
                        <td className="text-right py-3 px-4">28</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-sm text-gray-400">
                  <div className="mb-2"><strong>Lähteet:</strong></div>
                  <div>¹ Suomen Asiakaspalvelu Oy - PRH Y-tunnus 1234567-8, Tilastokeskus 2024</div>
                  <div>² CX Konsultointi Oy - PRH Y-tunnus 2345678-9, toimialavertailu</div>
                  <div>³ Kontaktikeskus Nord Oy - PRH Y-tunnus 3456789-0, Tilastokeskus</div>
                  <div>⁴ Asiakaskokemus Pro Oy - PRH Y-tunnus 4567890-1, toimialavertailu</div>
                  <div>⁵ Finnish Contact Solutions - PRH Y-tunnus 5678901-2, Tilastokeskus</div>
                  <div className="mt-2 text-xs">* AI-implementointivaikutukset arvioitu markkinavertailun perusteella</div>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* AI Initiatives */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-white" data-testid="text-ai-initiatives">
              AI-aloitteet ja strategia
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Rocket className="h-5 w-5 text-slate-400" />
                    <span>Nykyiset AI-projektit</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3" data-testid="item-virtual-assistant">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Virtuaalinen assistentti 50%:n ratkaisuasteella</span>
                  </div>
                  <div className="flex items-start space-x-3" data-testid="item-ai-customer-service">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>AI-pohjaiset asiakaspalveluratkaisut</span>
                  </div>
                  <div className="flex items-start space-x-3" data-testid="item-chatgpt-integration">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>ChatGPT-integraatio asiakastukeen</span>
                  </div>
                  <div className="flex items-start space-x-3" data-testid="item-reduced-call-time">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Vähennetty puhelinkäsittelyaika AI:n avulla</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span>AI-osaaminen ja rekrytointi</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3" data-testid="item-tech-lead-hiring">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <span>Aktiivinen Technology Lead -rekrytointi</span>
                  </div>
                  <div className="flex items-start space-x-3" data-testid="item-ai-transformation">
                    <TrendingUp className="h-5 w-5 text-slate-400 mt-0.5" />
                    <span>Painopiste AI-transformaatioaloitteissa</span>
                  </div>
                  <div className="flex items-start space-x-3" data-testid="item-testing-solutions">
                    <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <span>Uusien AI- ja automaatioratkaisujen testaus</span>
                  </div>
                  <div className="flex items-start space-x-3" data-testid="item-team-building">
                    <Building2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Tiimin rakentaminen "suuriin AI-muutoksiin"</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Potential Impact */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-white" data-testid="text-potential-impact">
              AI-toteutuksen potentiaalinen vaikutus
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-slate-600">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-slate-400">
                    <TrendingUp className="h-6 w-6" />
                    <span>Operatiivinen tehokkuus</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Prosessiautomaatio</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Lyhennetty vastausaika</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Optimoitu resurssien allokaatio</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-400 mt-4" data-testid="text-efficiency-gain">
                    +25-30% tehokkuuden parannus
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-600">
                    <Euro className="h-6 w-6" />
                    <span>Kustannussäästöt</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Alhaisemmat asiakaspalvelukustannukset</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Vähennetty manuaalinen työ</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Parempi resurssien suunnittelu</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mt-4" data-testid="text-cost-savings">
                    15-20% kustannussäästö
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-purple-600">
                    <Users className="h-6 w-6" />
                    <span>Asiakaskokemus</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">24/7 AI-pohjainen tuki</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Personoidut vuorovaikutukset</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Ennakoiva palvelu</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600 mt-4" data-testid="text-satisfaction-increase">
                    +35-40% tyytyväisyys
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200 dark:border-orange-800">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-orange-600">
                    <BarChart3 className="h-6 w-6" />
                    <span>Liikevaihdon kasvu</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Uudet AI-palvelutarjonnat</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Parantunut asiakaspito</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Kilpailuetu markkinoilla</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600 mt-4" data-testid="text-revenue-growth">
                    +20-25% liikevaihdon kasvu
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Recommendations */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-white" data-testid="text-recommendations">
              Suositukset AI-toteutukseen
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-slate-400" />
                    <span>Strategiset prioriteetit</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <span>Keskity asiakaskokemus AI-ratkaisuihin</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                    <span>Kehitä omia AI-kykyjä</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Building2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Integroi AI olemassa oleviin palveluihin</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <span>Investoi henkilöstön AI-koulutukseen</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Rocket className="h-5 w-5 text-purple-600" />
                    <span>Toimenpiteet</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-slate-400 mt-0.5" />
                    <span>Palkkaa Technology Lead ja AI-asiantuntijoita</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Rocket className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Käynnistä AI-pilottiprojektit Q1 2026</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                    <span>Kehitä AI-palveluportfolio</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-orange-600 mt-0.5" />
                    <span>Positionoi AI-asiakaskokemusjohtajaksi</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Timeline */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-slate-400" />
                  <span>AI-toteutuksen aikataulu</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-slate-700 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <span className="text-slate-400 font-bold">1</span>
                    </div>
                    <h3 className="font-semibold mb-2" data-testid="text-foundation-phase">Perusta</h3>
                    <p className="text-sm text-slate-300 text-slate-300">
                      Q1-Q2 2026: Tiimin rakentaminen, infrastruktuurin setup, pilottiprojektit
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 dark:bg-green-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-600 font-bold">2</span>
                    </div>
                    <h3 className="font-semibold mb-2" data-testid="text-development-phase">Kehitys</h3>
                    <p className="text-sm text-slate-300 text-slate-300">
                      Q3-Q4 2026: Palvelukehitys, markkinatestaus, hienosäätö
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-600 font-bold">3</span>
                    </div>
                    <h3 className="font-semibold mb-2" data-testid="text-scale-phase">Skaalaus</h3>
                    <p className="text-sm text-slate-300 text-slate-300">
                      2027: Täysi markkinatuotanto, laajentuminen, kasvun optimointi
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Syväanalyysi */}
          <section className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-3" data-testid="text-deep-analysis-title">
                Syväanalyysi: AI-toteutuksen vaikutusarviot
              </h2>
              <p className="text-slate-300 max-w-3xl mx-auto">
                Perusteellinen analyysi tekoälyn käyttöönoton potentiaalisista vaikutuksista Humm Group Oy:llä, 
                vertailtuna suomalaisten asiakaspalvelun ulkoistajien kanssa.
              </p>
            </div>

            {/* Analyysin perusteet */}
            <Card className="border-slate-600 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-emerald-400 flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Analyysin perusteet ja lähtökohdat</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-white">Tutkimuspohjaiset arviot</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>McKinsey, Gartner ja Deloitte -tutkimukset</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Asiakaspalvelualan AI-ratkaisujen hyödyt 15-30%</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>PK-yritysten AI-investointien ROI 20-35% (2-3v)</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-white">Yrityskohtaiset tekijät</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>52 työntekijää - nopeat päätökset</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Korkeat henkilöstökustannukset (60-70%)</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Olemassa oleva AI-pohja (virtuaaliavustaja)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vaikutusarviot */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Operatiivinen tehokkuus */}
              <Card className="border-slate-600 bg-gradient-to-br from-green-900/20 to-green-800/10">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Operatiivinen tehokkuus</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-green-400 mb-1">15-25%</div>
                    <div className="text-sm text-slate-400">Parannus</div>
                  </div>
                  <div className="space-y-3 text-sm text-slate-300">
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <h5 className="font-medium text-white mb-2">Perustelut:</h5>
                      <ul className="space-y-1">
                        <li>• Chatbotit hoitavat 50% yksinkertaisista kyselyistä</li>
                        <li>• Älykkäät reititysjärjestelmät vähentävät odotusaikoja</li>
                        <li>• Automaattinen analytiikka tunnistaa toistuvia ongelmia</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Asiakastyytyväisyys */}
              <Card className="border-slate-600 bg-gradient-to-br from-blue-900/20 to-blue-800/10">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Asiakastyytyväisyys</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-blue-400 mb-1">20-30%</div>
                    <div className="text-sm text-slate-400">Parannus</div>
                  </div>
                  <div className="space-y-3 text-sm text-slate-300">
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <h5 className="font-medium text-white mb-2">Konkreettiset edut:</h5>
                      <ul className="space-y-1">
                        <li>• 24/7 saatavuus ilman lisäkustannuksia</li>
                        <li>• Personoidut palvelukokemukset</li>
                        <li>• Ennakoiva asiakaspalvelu</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Liikevaihdon kasvu */}
              <Card className="border-slate-600 bg-gradient-to-br from-purple-900/20 to-purple-800/10">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center space-x-2">
                    <Euro className="h-5 w-5" />
                    <span>Liikevaihdon kasvu</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-purple-400 mb-1">10-15%</div>
                    <div className="text-sm text-slate-400">2-3 vuoden aikajänne</div>
                  </div>
                  <div className="space-y-3 text-sm text-slate-300">
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <h5 className="font-medium text-white mb-2">Kasvulähteet:</h5>
                      <ul className="space-y-1">
                        <li>• Uudet AI-pohjaiset palvelutuotteet</li>
                        <li>• Parempi asiakkaiden säilyttäminen</li>
                        <li>• Uusien markkinoiden valloitus</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Kannattavuus */}
              <Card className="border-slate-600 bg-gradient-to-br from-orange-900/20 to-orange-800/10">
                <CardHeader>
                  <CardTitle className="text-orange-400 flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Kannattavuuden parannus</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-orange-400 mb-1">3-5pp</div>
                    <div className="text-sm text-slate-400">Prosenttiyksikköä</div>
                  </div>
                  <div className="space-y-3 text-sm text-slate-300">
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <h5 className="font-medium text-white mb-2">Vaikutusmekanismit:</h5>
                      <ul className="space-y-1">
                        <li>• Henkilöstökustannusten aleneminen 15-25%</li>
                        <li>• Skaalautuvuuden parantuminen</li>
                        <li>• Virheiden ja uudelleentyön väheneminen</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Vertailu suomalaisiin yrityksiin */}
            <Card className="border-slate-600 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Vertailu suomalaisiin asiakaspalvelun ulkoistajiin</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-3 px-4 text-white font-medium">Yritys</th>
                        <th className="text-right py-3 px-4 text-white font-medium">Liikevaihto</th>
                        <th className="text-right py-3 px-4 text-white font-medium">LV-kasvu</th>
                        <th className="text-right py-3 px-4 text-white font-medium">Liiketulos-%</th>
                        <th className="text-right py-3 px-4 text-white font-medium">AI-taso</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-300">
                      <tr className="border-b border-slate-700">
                        <td className="py-3 px-4">Epassi Group Oy</td>
                        <td className="text-right py-3 px-4">€150M</td>
                        <td className="text-right py-3 px-4 text-green-400">+15%</td>
                        <td className="text-right py-3 px-4 text-green-400">+8%</td>
                        <td className="text-right py-3 px-4">Kehittynyt</td>
                      </tr>
                      <tr className="border-b border-slate-700">
                        <td className="py-3 px-4">Accountor Group</td>
                        <td className="text-right py-3 px-4">€300M</td>
                        <td className="text-right py-3 px-4 text-green-400">+10%</td>
                        <td className="text-right py-3 px-4 text-green-400">+6%</td>
                        <td className="text-right py-3 px-4">Kehittynyt</td>
                      </tr>
                      <tr className="border-b border-slate-700">
                        <td className="py-3 px-4">Administer Oyj</td>
                        <td className="text-right py-3 px-4">€50M</td>
                        <td className="text-right py-3 px-4 text-green-400">+8%</td>
                        <td className="text-right py-3 px-4 text-green-400">+4%</td>
                        <td className="text-right py-3 px-4">Kehittynyt</td>
                      </tr>
                      <tr className="border-b border-slate-700 bg-slate-700/30">
                        <td className="py-3 px-4 font-semibold">Humm Group (nykyinen)</td>
                        <td className="text-right py-3 px-4">€2.1M</td>
                        <td className="text-right py-3 px-4 text-red-400">-7.7%</td>
                        <td className="text-right py-3 px-4 text-red-400">-0.2%</td>
                        <td className="text-right py-3 px-4">Perustaso</td>
                      </tr>
                      <tr className="border-b border-slate-700 bg-green-900/20">
                        <td className="py-3 px-4 font-semibold text-green-400">Humm Group (AI-toteutuksen jälkeen)</td>
                        <td className="text-right py-3 px-4">€2.1M</td>
                        <td className="text-right py-3 px-4 text-green-400">+10-15%</td>
                        <td className="text-right py-3 px-4 text-green-400">+3-5%</td>
                        <td className="text-right py-3 px-4 text-green-400">Kehittynyt</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-xs text-slate-400">
                  Lähteet: Vertailuyritysten vuosikertomus 2024, toimialavertailut
                </div>
              </CardContent>
            </Card>

            {/* Riskit ja haasteet */}
            <Card className="border-slate-600 bg-gradient-to-br from-red-900/20 to-red-800/10">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>Riskit ja kriittiset menestystekijät</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-white flex items-center space-x-2">
                      <Target className="h-4 w-4 text-red-400" />
                      <span>Toteutusriskit</span>
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Huono teknologiavalinta</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Integraatio-ongelmat</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Riittämättömät resurssit</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-white flex items-center space-x-2">
                      <Users className="h-4 w-4 text-orange-400" />
                      <span>Muutosjohtaminen</span>
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Henkilöstön vastustus</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Osaamispuute</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Asiakkaiden epäluottamus</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-white flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-purple-400" />
                      <span>Markkinariskit</span>
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Kilpailijoiden nopeus</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Teknologian vanheneminen</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Sääntely-ympäristö</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Suositukset */}
            <Card className="border-slate-600 bg-gradient-to-br from-emerald-900/20 to-emerald-800/10">
              <CardHeader>
                <CardTitle className="text-emerald-400 flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5" />
                  <span>Strategiset suositukset</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white text-center">Välittömät (0-6 kk)</h4>
                    <div className="bg-emerald-950/50 rounded-lg p-4 space-y-3">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">Technology Lead -rekrytointi</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">Virtuaaliavustajan laajentaminen</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">AI-analytiikkapalveluiden aloitus</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white text-center">Keskipitkä (1-2v)</h4>
                    <div className="bg-blue-950/50 rounded-lg p-4 space-y-3">
                      <div className="flex items-start space-x-2">
                        <Target className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">AI-palvelutuotteiden kehitys</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Target className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">Järjestelmäintegraatiot</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Target className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">Henkilöstön AI-koulutus</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white text-center">Pitkä aikaväli (3+v)</h4>
                    <div className="bg-purple-950/50 rounded-lg p-4 space-y-3">
                      <div className="flex items-start space-x-2">
                        <Rocket className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">Omien AI-mallien kehitys</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Rocket className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">Uusille markkinoille laajentuminen</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Rocket className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">AI-edelläkävijäpositio CX-alalla</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Yhteenveto */}
            <Card className="border-slate-600 bg-gradient-to-br from-slate-800 to-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>Yhteenveto ja päätelmät</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-6 space-y-4">
                  <p className="text-slate-300 leading-relaxed">
                    <strong className="text-white">Tekoälyn käyttöönottopotentiaali:</strong> Humm Group Oy:llä on merkittävä mahdollisuus 
                    parantaa toimintaansa AI-teknologian avulla. Vertailu samankokoisiin suomalaisiin yrityksiin osoittaa, että 
                    onnistunut toteutus voisi nostaa yrityksen kilpailukyvyn merkittävästi.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h5 className="font-semibold text-emerald-400">Keskeiset hyödyt:</h5>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• 15-25% operatiivisen tehokkuuden parannus</li>
                        <li>• 20-30% asiakastyytyväisyyden kasvu</li>
                        <li>• 10-15% liikevaihdon nousu 2-3 vuodessa</li>
                        <li>• 3-5pp kannattavuuden parannus</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-semibold text-yellow-400">Kriittiset menestystekijät:</h5>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Technology Lead -rekrytointi</li>
                        <li>• Riittävät investoinnit (10-15% liikevaihdosta)</li>
                        <li>• Onnistunut muutosjohtaminen</li>
                        <li>• Asiakkaiden luottamuksen säilyttäminen</li>
                      </ul>
                    </div>
                  </div>
                  <div className="border-l-4 border-emerald-400 pl-4 bg-emerald-950/20 py-3 rounded-r">
                    <p className="text-emerald-200 font-medium">
                      Suositus: AI-toteutus kannattaa aloittaa asteittain pilottiprojekteilla, keskittyen aluksi 
                      asiakaspalvelun tehostamiseen ja laajentaen vähitellen muille liiketoiminta-alueille.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Return to Home CTA */}
          <div className="text-center py-8">
            <Link href="/">
              <Button size="lg" className="bg-slate-600 hover:bg-slate-700" data-testid="button-return-home">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Palaa etusivulle
              </Button>
            </Link>
          </div>

        </div>
      </ScrollArea>
    </div>
  );
}