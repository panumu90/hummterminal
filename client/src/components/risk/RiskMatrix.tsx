import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface RiskItem {
  id: string;
  name: string;
  likelihood: number; // 1-5
  impact: number; // 1-5
  description: string;
}

interface RiskMatrixProps {
  risks: RiskItem[];
}

export function RiskMatrix({ risks }: RiskMatrixProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const getCellColor = (likelihood: number, impact: number) => {
    const score = likelihood + impact;
    if (score <= 3) return "bg-green-500/20 hover:bg-green-500/30 border-green-500/40";
    if (score <= 5) return "bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-500/40";
    if (score <= 7) return "bg-orange-500/20 hover:bg-orange-500/30 border-orange-500/40";
    return "bg-red-500/20 hover:bg-red-500/30 border-red-500/40";
  };

  const getRisksInCell = (likelihood: number, impact: number) => {
    return risks.filter((r) => r.likelihood === likelihood && r.impact === impact);
  };

  return (
    <Card className="glass-panel-risk p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Riskimatriisi</h3>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500/30"></div>
              <span>Matala</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-500/30"></div>
              <span>Keskitaso</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500/30"></div>
              <span>Korkea</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {/* Y-axis label */}
          <div className="flex items-center justify-center">
            <div className="text-sm font-semibold text-slate-400 -rotate-90">
              Todennäköisyys
            </div>
          </div>

          {/* Column headers (Impact) */}
          <div></div>
          {[1, 2, 3, 4, 5].map((impact) => (
            <div key={`header-${impact}`} className="flex items-center justify-center text-xs text-slate-400">
              {impact}
            </div>
          ))}

          {/* Matrix cells */}
          {[5, 4, 3, 2, 1].map((likelihood) => (
            <>
              {/* Row header */}
              <div key={`row-${likelihood}`} className="flex items-center justify-center text-xs text-slate-400">
                {likelihood}
              </div>

              {/* Empty cell for alignment */}
              <div></div>

              {/* Cells */}
              {[1, 2, 3, 4, 5].map((impact) => {
                const cellRisks = getRisksInCell(likelihood, impact);
                const cellId = `${likelihood}-${impact}`;

                return (
                  <Tooltip key={cellId}>
                    <TooltipTrigger asChild>
                      <div
                        className={`
                          aspect-square rounded-lg border-2 transition-all cursor-pointer
                          ${getCellColor(likelihood, impact)}
                          ${hoveredCell === cellId ? "scale-110 shadow-lg" : ""}
                          ${cellRisks.length > 0 ? "ring-2 ring-white/20" : ""}
                        `}
                        onMouseEnter={() => setHoveredCell(cellId)}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        {cellRisks.length > 0 && (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">
                              {cellRisks.length}
                            </span>
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>
                    {cellRisks.length > 0 && (
                      <TooltipContent className="glass-panel-risk border-slate-700 max-w-xs">
                        <div className="space-y-2">
                          {cellRisks.map((risk) => (
                            <div key={risk.id} className="text-xs">
                              <p className="font-semibold text-white">{risk.name}</p>
                              <p className="text-slate-300 mt-1">{risk.description}</p>
                            </div>
                          ))}
                        </div>
                      </TooltipContent>
                    )}
                  </Tooltip>
                );
              })}
            </>
          ))}

          {/* X-axis label */}
          <div></div>
          <div className="col-span-5 flex items-center justify-center mt-2">
            <div className="text-sm font-semibold text-slate-400">Vaikutus</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
