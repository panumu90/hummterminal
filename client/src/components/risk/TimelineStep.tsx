import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TimelineStepProps {
  phase: string;
  duration: string;
  icon: LucideIcon;
  actions: string[];
  kpis?: string[];
  delay?: number;
  isLast?: boolean;
}

export function TimelineStep({
  phase,
  duration,
  icon: Icon,
  actions,
  kpis = [],
  delay = 0,
  isLast = false,
}: TimelineStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative"
    >
      {/* Connector line */}
      {!isLast && (
        <div className="absolute top-12 left-8 w-px h-full bg-gradient-to-b from-blue-500/50 to-transparent hidden md:block"></div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        {/* Icon circle */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center ring-4 ring-blue-500/20">
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Content card */}
        <Card className="glass-panel-risk flex-1 p-5 hover:-translate-y-1 transition-smooth">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{phase}</h3>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  {duration}
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-2">
                Toimenpiteet:
              </h4>
              <ul className="space-y-2">
                {actions.map((action, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-emerald-400 mt-0.5">→</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* KPIs */}
            {kpis.length > 0 && (
              <div className="pt-3 border-t border-slate-700">
                <h4 className="text-sm font-semibold text-slate-300 mb-2">
                  Tavoitteet (KPI):
                </h4>
                <div className="flex flex-wrap gap-2">
                  {kpis.map((kpi, index) => (
                    <Badge key={index} className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                      {kpi}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
