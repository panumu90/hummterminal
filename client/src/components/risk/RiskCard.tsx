import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CitationPopover } from "./CitationPopover";

interface RiskCardProps {
  category: string;
  likelihood: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  risks: string[];
  mitigations?: string[];
  sources?: string[];
  delay?: number;
}

export function RiskCard({
  category,
  likelihood,
  impact,
  risks,
  mitigations = [],
  sources = [],
  delay = 0,
}: RiskCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getBadgeClass = (level: "low" | "medium" | "high") => {
    switch (level) {
      case "high":
        return "risk-high";
      case "medium":
        return "risk-medium";
      case "low":
        return "risk-low";
    }
  };

  const getLikelihoodLabel = (level: string) => {
    const labels = { low: "Matala", medium: "Keskitaso", high: "Korkea" };
    return labels[level as keyof typeof labels] || level;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="glass-panel-risk p-5 hover:-translate-y-1 transition-smooth">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold text-white">{category}</h3>
            {sources.length > 0 && (
              <CitationPopover sources={sources} />
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge className={getBadgeClass(likelihood)}>
              Todennäköisyys: {getLikelihoodLabel(likelihood)}
            </Badge>
            <Badge className={getBadgeClass(impact)}>
              Vaikutus: {getLikelihoodLabel(impact)}
            </Badge>
          </div>

          {/* Risk List */}
          <ul className="space-y-2">
            {risks.slice(0, 3).map((risk, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-slate-300">
                <span className="text-red-400 mt-0.5">•</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>

          {/* Collapsible Details */}
          {(mitigations.length > 0 || risks.length > 3) && (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger className="w-full flex items-center justify-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-smooth py-2">
                <span>{isOpen ? "Piilota tiedot" : "Lisätietoja"}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-4">
                {/* Additional risks */}
                {risks.length > 3 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">
                      Lisäriskit:
                    </h4>
                    <ul className="space-y-2">
                      {risks.slice(3).map((risk, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-slate-300">
                          <span className="text-red-400 mt-0.5">•</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Mitigations */}
                {mitigations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-400 mb-2">
                      Vähentämiskeinot:
                    </h4>
                    <ul className="space-y-2">
                      {mitigations.map((mitigation, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-slate-300">
                          <span className="text-emerald-400 mt-0.5">✓</span>
                          <span>{mitigation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
