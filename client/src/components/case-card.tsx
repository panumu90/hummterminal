import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PulseButton } from "@/components/ui/pulse-button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Check, Info, Loader2, ShoppingCart, Compass, Building2, Landmark, BookOpen, LucideIcon } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Case } from "@/lib/types";

interface CaseCardProps {
  case_: Case;
}

function getIconElement(iconClass: string): LucideIcon {
  // Map FontAwesome classes to Lucide React icons
  const iconMap: Record<string, LucideIcon> = {
    "fab fa-amazon": ShoppingCart,
    "fas fa-drafting-compass": Compass,
    "fas fa-university": Building2,
    "fas fa-shopping-cart": ShoppingCart,
    "fas fa-landmark": Landmark,
    "fas fa-address-book": BookOpen
  };

  return iconMap[iconClass] || Building2;
}

function getBadgeClass(type: string) {
  switch (type) {
    case 'success':
      return 'success-badge';
    case 'efficiency':
      return 'efficiency-badge';
    case 'savings':
      return 'savings-badge';
    case 'metric':
      return 'metric-badge';
    default:
      return 'metric-badge';
  }
}

function getCategoryColor(category: string) {
  const colorMap: Record<string, string> = {
    "Maailmanluokka": "bg-emerald-600/80 border border-emerald-500/50",
    "B2B Malli": "bg-slate-600/80 border border-slate-500/50",
    "Pankkisektori": "bg-amber-600/80 border border-amber-500/50",
    "Kotimainen": "bg-green-600/80 border border-green-500/50",
    "Pohjoismainen": "bg-orange-600/80 border border-orange-500/50",
    "B2B Digitaalinen": "bg-purple-600/80 border border-purple-500/50"
  };
  
  return colorMap[category] || "bg-gray-600/80 border border-gray-500/50";
}

export function CaseCard({ case_ }: CaseCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailedContent, setDetailedContent] = useState<string>("");

  const implementationMutation = useMutation({
    mutationFn: async (caseId: string): Promise<{ content: string }> => {
      const response = await apiRequest('POST', `/api/cases/${caseId}/implementation`);
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      setDetailedContent(data.content);
      setIsModalOpen(true);
    },
    onError: (error) => {
      console.error('Failed to fetch implementation details:', error);
    }
  });

  const handleImplementationClick = () => {
    implementationMutation.mutate(case_.id.toString());
  };

  const IconComponent = getIconElement(case_.icon);

  return (
    <>
      <Card className="glass-panel-light transition-smooth hover:border-slate-500/60 hover:-translate-y-1" data-testid={`card-case-${case_.id}`}>
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-700/50 to-slate-600/30 rounded-xl flex items-center justify-center border border-slate-600/30 flex-shrink-0">
                <IconComponent className="w-6 h-6 text-blue-400" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-white leading-tight" data-testid={`text-company-${case_.id}`}>
                  {case_.company}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5" data-testid={`text-location-${case_.id}`}>
                  {case_.country} • {case_.industry}
                </p>
              </div>
            </div>
            <Badge
              className={`${getCategoryColor(case_.category)} text-white shadow-sm text-xs sm:text-sm px-2 py-1 flex-shrink-0`}
              data-testid={`badge-category-${case_.id}`}
            >
              {case_.category}
            </Badge>
          </div>
          
          <div className="mb-4">
            <h4 className="font-semibold text-white mb-2 text-sm sm:text-base" data-testid={`text-solution-${case_.id}`}>
              {case_.solution_name}
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed" data-testid={`text-description-${case_.id}`}>
              {case_.description}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
            {(case_.key_metrics || []).map((metric, index) => (
              <div key={index} className="text-center p-2.5 sm:p-3 glass-panel-light rounded-lg" data-testid={`metric-${case_.id}-${index}`}>
                <div className={`${getBadgeClass(metric.type)} text-white px-2 py-1 rounded-md text-xs font-bold mb-1.5 shadow-sm`}>
                  {metric.value}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400 leading-tight">{metric.label}</div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-600/30 pt-4 mb-4">
            <h5 className="font-medium text-white mb-3 text-sm">Keskeiset oppimiskohteet:</h5>
            <ul className="text-xs sm:text-sm text-slate-300 space-y-2">
              {(case_.learning_points || []).map((point, index) => (
                <li key={index} className="flex items-start space-x-2" data-testid={`learning-point-${case_.id}-${index}`}>
                  <Check className="h-3.5 w-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <PulseButton
            onClick={handleImplementationClick}
            loading={implementationMutation.isPending}
            loadingText="Luodaan sisältöä..."
            pulse="subtle"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-smooth text-sm"
            data-testid={`button-implementation-${case_.id}`}
          >
            <Info className="mr-2 h-4 w-4" />
            <span>Lue lisää toteutuksesta</span>
          </PulseButton>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass-panel max-w-4xl max-h-[90vh] sm:max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 sm:gap-3 text-white text-lg sm:text-xl">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-slate-700/50 to-slate-600/30 border border-slate-600/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              </div>
              <span className="leading-tight">{case_.company} - Toteutuksen yksityiskohdat</span>
            </DialogTitle>
            <DialogDescription className="text-slate-300 text-sm">
              AI-generoitu syvyysanalyysi {case_.solution_name} -toteutuksesta
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-12rem)] sm:max-h-[calc(85vh-12rem)] mt-4">
            <div className="pr-4">
              {detailedContent ? (
                <div className="prose-enhanced prose prose-sm sm:prose-base max-w-none animate-in fade-in-0 duration-500">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {detailedContent}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="space-y-4 p-4">
                  <div className="flex items-center justify-center mb-4 text-slate-300">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin text-blue-400" />
                    <span className="text-sm">Luodaan yksityiskohtaista sisältöä...</span>
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full bg-slate-700/40" />
                    <Skeleton className="h-4 w-4/5 bg-slate-700/40" />
                    <Skeleton className="h-4 w-full bg-slate-700/40" />
                    <Skeleton className="h-4 w-3/5 bg-slate-700/40" />
                    <div className="pt-2">
                      <Skeleton className="h-6 w-1/3 mb-2 bg-slate-700/40" />
                      <Skeleton className="h-4 w-full bg-slate-700/40" />
                      <Skeleton className="h-4 w-5/6 bg-slate-700/40" />
                    </div>
                    <div className="pt-2">
                      <Skeleton className="h-6 w-1/4 mb-2 bg-slate-700/40" />
                      <Skeleton className="h-4 w-full bg-slate-700/40" />
                      <Skeleton className="h-4 w-4/5 bg-slate-700/40" />
                      <Skeleton className="h-4 w-2/3 bg-slate-700/40" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
