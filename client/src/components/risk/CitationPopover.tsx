import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface CitationPopoverProps {
  sources: string[];
  metadata?: Record<string, any>;
}

export function CitationPopover({ sources, metadata }: CitationPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="p-1.5 rounded-full hover:bg-white/10 transition-smooth text-slate-400 hover:text-blue-400">
          <Info className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 glass-panel-risk border-slate-700">
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-700">
            <Info className="h-4 w-4 text-blue-400" />
            <h4 className="font-semibold text-white text-sm">Lähteet</h4>
          </div>

          <div className="space-y-2">
            {sources.map((source, index) => (
              <div key={index} className="text-xs space-y-1">
                <div className="flex items-start gap-2">
                  <span className="text-slate-500 font-mono">[{index + 1}]</span>
                  <p className="text-slate-300 flex-1">{source}</p>
                </div>
              </div>
            ))}
          </div>

          {metadata && Object.keys(metadata).length > 0 && (
            <div className="pt-2 border-t border-slate-700">
              <p className="text-[10px] text-slate-500">
                Luottamusvahv: {metadata.confidence || "N/A"}
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
