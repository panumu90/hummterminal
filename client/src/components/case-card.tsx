import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PulseButton } from "@/components/ui/pulse-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Check, Info, Loader2 } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Case } from "@/lib/types";

interface CaseCardProps {
  case_: Case;
}

function getIconElement(iconClass: string) {
  // Map FontAwesome classes to appropriate icons or placeholders
  const iconMap: Record<string, string> = {
    "fab fa-amazon": "🛒",
    "fas fa-drafting-compass": "📐", 
    "fas fa-university": "🏛️",
    "fas fa-shopping-cart": "🛍️",
    "fas fa-landmark": "🏦",
    "fas fa-address-book": "📞"
  };
  
  return iconMap[iconClass] || "🏢";
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

  return (
    <>
      <Card className="case-card bg-slate-800/40 border border-slate-600/50 hover:border-slate-500/50 hover:bg-slate-800/60 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm" data-testid={`card-case-${case_.id}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center text-xl border border-slate-600/30">
                {getIconElement(case_.icon)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white" data-testid={`text-company-${case_.id}`}>
                  {case_.company}
                </h3>
                <p className="text-sm text-slate-300" data-testid={`text-location-${case_.id}`}>
                  {case_.country} • {case_.industry}
                </p>
              </div>
            </div>
            <Badge 
              className={`${getCategoryColor(case_.category)} text-white shadow-sm`}
              data-testid={`badge-category-${case_.id}`}
            >
              {case_.category}
            </Badge>
          </div>
          
          <div className="mb-4">
            <h4 className="font-semibold text-white mb-2" data-testid={`text-solution-${case_.id}`}>
              {case_.solution_name}
            </h4>
            <p className="text-slate-300 text-sm mb-3" data-testid={`text-description-${case_.id}`}>
              {case_.description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            {case_.key_metrics.map((metric, index) => (
              <div key={index} className="text-center p-3 bg-slate-700/30 rounded-lg border border-slate-600/30 backdrop-blur-sm" data-testid={`metric-${case_.id}-${index}`}>
                <div className={`${getBadgeClass(metric.type)} text-white px-2 py-1 rounded text-xs font-bold mb-1 shadow-sm`}>
                  {metric.value}
                </div>
                <div className="text-xs text-slate-400">{metric.label}</div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-600/50 pt-4 mb-4">
            <h5 className="font-medium text-white mb-2">Keskeiset oppimiskohteet:</h5>
            <ul className="text-sm text-slate-300 space-y-1">
              {case_.learning_points.map((point, index) => (
                <li key={index} className="flex items-start space-x-2" data-testid={`learning-point-${case_.id}-${index}`}>
                  <Check className="h-3 w-3 text-blue-400 mt-1 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <PulseButton
            onClick={handleImplementationClick}
            loading={implementationMutation.isPending}
            loadingText="Luodaan sisältöä..."
            pulse="subtle"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            data-testid={`button-implementation-${case_.id}`}
          >
            <Info className="mr-2 h-4 w-4" />
            Lue lisää toteutuksesta
          </PulseButton>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-800/95 border border-slate-600/50 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 bg-slate-700/50 border border-slate-600/30 rounded-lg flex items-center justify-center text-lg">
                {getIconElement(case_.icon)}
              </div>
              {case_.company} - Toteutuksen yksityiskohdat
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              AI-generoitu syvyysanalyysi {case_.solution_name} -toteutuksesta
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {detailedContent ? (
              <div className="prose prose-sm max-w-none text-slate-200 prose-headings:text-white prose-strong:text-white prose-code:text-blue-300 prose-pre:bg-slate-900/50 prose-pre:border prose-pre:border-slate-600/30 animate-in fade-in-0 duration-500">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {detailedContent}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="space-y-4 p-4">
                <div className="flex items-center justify-center mb-4 text-slate-300">
                  <Loader2 className="mr-2 h-6 w-6 animate-spin text-blue-400" />
                  Luodaan yksityiskohtaista sisältöä...
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full bg-slate-700/50" />
                  <Skeleton className="h-4 w-4/5 bg-slate-700/50" />
                  <Skeleton className="h-4 w-full bg-slate-700/50" />
                  <Skeleton className="h-4 w-3/5 bg-slate-700/50" />
                  <div className="pt-2">
                    <Skeleton className="h-6 w-1/3 mb-2 bg-slate-700/50" />
                    <Skeleton className="h-4 w-full bg-slate-700/50" />
                    <Skeleton className="h-4 w-5/6 bg-slate-700/50" />
                  </div>
                  <div className="pt-2">
                    <Skeleton className="h-6 w-1/4 mb-2 bg-slate-700/50" />
                    <Skeleton className="h-4 w-full bg-slate-700/50" />
                    <Skeleton className="h-4 w-4/5 bg-slate-700/50" />
                    <Skeleton className="h-4 w-2/3 bg-slate-700/50" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
