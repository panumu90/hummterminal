import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: {
    direction: "up" | "down" | "neutral";
    value: string;
  };
  source?: string;
  delay?: number;
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  trend,
  source,
  delay = 0,
}: MetricCardProps) {
  const getTrendColor = () => {
    if (!trend) return "";
    switch (trend.direction) {
      case "up":
        return "text-red-400";
      case "down":
        return "text-green-400";
      default:
        return "text-slate-400";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="glass-panel-risk p-4 sm:p-5 hover:-translate-y-1 transition-smooth cursor-default group">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-smooth">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
          </div>
          {trend && (
            <div className={`text-xs sm:text-sm font-medium ${getTrendColor()}`}>
              {trend.value}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-xs sm:text-sm text-slate-400 font-medium">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
        </div>

        {source && (
          <p className="text-[10px] text-slate-500 mt-2 line-clamp-1">
            {source}
          </p>
        )}
      </Card>
    </motion.div>
  );
}
