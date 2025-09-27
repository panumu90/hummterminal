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
    "Maailmanluokka": "bg-green-500",
    "B2B Malli": "bg-slate-600",
    "Pankkisektori": "bg-yellow-500",
    "Kotimainen": "bg-emerald-500",
    "Pohjoismainen": "bg-orange-500",
    "B2B Digitaalinen": "bg-purple-500"
  };
  
  return colorMap[category] || "bg-gray-500";
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
      <Card className="case-card shadow-sm hover:shadow-md" data-testid={`card-case-${case_.id}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-xl">
                {getIconElement(case_.icon)}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground" data-testid={`text-company-${case_.id}`}>
                  {case_.company}
                </h3>
                <p className="text-sm text-muted-foreground" data-testid={`text-location-${case_.id}`}>
                  {case_.country} • {case_.industry}
                </p>
              </div>
            </div>
            <Badge 
              className={`${getCategoryColor(case_.category)} text-white`}
              data-testid={`badge-category-${case_.id}`}
            >
              {case_.category}
            </Badge>
          </div>
          
          <div className="mb-4">
            <h4 className="font-semibold text-foreground mb-2" data-testid={`text-solution-${case_.id}`}>
              {case_.solution_name}
            </h4>
            <p className="text-muted-foreground text-sm mb-3" data-testid={`text-description-${case_.id}`}>
              {case_.description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            {case_.key_metrics.map((metric, index) => (
              <div key={index} className="text-center p-3 bg-muted rounded-lg" data-testid={`metric-${case_.id}-${index}`}>
                <div className={`${getBadgeClass(metric.type)} text-white px-2 py-1 rounded text-xs font-bold mb-1`}>
                  {metric.value}
                </div>
                <div className="text-xs text-muted-foreground">{metric.label}</div>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-4 mb-4">
            <h5 className="font-medium text-foreground mb-2">Keskeiset oppimiskohteet:</h5>
            <ul className="text-sm text-muted-foreground space-y-1">
              {case_.learning_points.map((point, index) => (
                <li key={index} className="flex items-start space-x-2" data-testid={`learning-point-${case_.id}-${index}`}>
                  <Check className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
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
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            data-testid={`button-implementation-${case_.id}`}
          >
            <Info className="mr-2 h-4 w-4" />
            Lue lisää toteutuksesta
          </PulseButton>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center text-lg">
                {getIconElement(case_.icon)}
              </div>
              {case_.company} - Toteutuksen yksityiskohdat
            </DialogTitle>
            <DialogDescription>
              AI-generoitu syvyysanalyysi {case_.solution_name} -toteutuksesta
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {detailedContent ? (
              <div className="prose prose-sm max-w-none text-foreground animate-in fade-in-0 duration-500">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {detailedContent}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="space-y-4 p-4">
                <div className="flex items-center justify-center mb-4 text-muted-foreground">
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Luodaan yksityiskohtaista sisältöä...
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/5" />
                  <div className="pt-2">
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                  <div className="pt-2">
                    <Skeleton className="h-6 w-1/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-2/3" />
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
