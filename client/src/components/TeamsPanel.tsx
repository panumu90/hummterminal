import { useState } from "react";
import { Users, MoreVertical, TrendingUp, Edit } from "lucide-react";
import { TeamEditModal } from "./TeamEditModal";

interface Team {
  id: number;
  name: string;
  description?: string;
  accountId: number;
  sla?: number;
}

interface TeamsPanelProps {
  teams: Team[];
  isLoading: boolean;
  selectedTeamId: number | null;
  onTeamSelect: (teamId: number | null) => void;
  onTeamUpdated: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
  getTeamAgentCount: (teamId: number) => number;
  onDragOver: (e: React.DragEvent, teamId: number) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, teamId: number) => void;
  dropTargetTeam: number | null;
}

export function TeamsPanel({
  teams,
  isLoading,
  selectedTeamId,
  onTeamSelect,
  onTeamUpdated,
  showToast,
  getTeamAgentCount,
  onDragOver,
  onDragLeave,
  onDrop,
  dropTargetTeam,
}: TeamsPanelProps) {
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const getSLAColor = (sla?: number) => {
    if (!sla) return 'text-gray-400 bg-gray-500/20';
    if (sla >= 95) return 'text-green-400 bg-green-500/20';
    if (sla >= 90) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/30 border-r border-slate-700/50">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Users className="h-4 w-4 text-purple-400" />
          Teams
          <span className="text-xs font-normal text-white/60">({teams.length})</span>
        </h2>
        <p className="text-xs text-white/50 mt-1">Manage team assignments</p>
      </div>

      {/* Teams List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        {isLoading ? (
          // Loading skeletons
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-slate-800/30 rounded-lg animate-pulse" />
            ))}
          </>
        ) : teams.length === 0 ? (
          <div className="text-center py-8 text-white/40 text-sm">
            No teams found
          </div>
        ) : (
          <>
            {teams.map((team) => {
              const agentCount = getTeamAgentCount(team.id);
              const isSelected = selectedTeamId === team.id;
              const isDropTarget = dropTargetTeam === team.id;

              return (
                <div
                  key={team.id}
                  onClick={() => onTeamSelect(isSelected ? null : team.id)}
                  onDragOver={(e) => onDragOver(e, team.id)}
                  onDragLeave={onDragLeave}
                  onDrop={(e) => onDrop(e, team.id)}
                  className={`
                    relative p-3 rounded-lg border-2 cursor-pointer transition-all
                    ${isSelected
                      ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                      : isDropTarget
                        ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20'
                        : 'border-slate-700/50 bg-slate-800/50 hover:border-purple-500/50 hover:bg-slate-800/70'
                    }
                  `}
                >
                  {/* Team Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate">
                        {team.name}
                      </h3>
                      {team.description && (
                        <p className="text-xs text-white/50 truncate mt-0.5">
                          {team.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTeam(team);
                      }}
                      className="text-white/40 hover:text-white transition-colors ml-2"
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1 px-2 py-1 bg-slate-700/50 rounded text-xs text-white/70">
                      <Users className="h-3 w-3" />
                      {agentCount}
                    </div>

                    {team.sla !== undefined && (
                      <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getSLAColor(team.sla)}`}>
                        <TrendingUp className="h-3 w-3" />
                        {team.sla}% SLA
                      </div>
                    )}
                  </div>

                  {/* Drop Zone Indicator */}
                  {isDropTarget && (
                    <div className="absolute inset-0 border-2 border-dashed border-emerald-400 rounded-lg bg-emerald-500/5 flex items-center justify-center pointer-events-none">
                      <span className="text-emerald-400 text-xs font-medium">
                        Drop agent here
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Footer Hint */}
      <div className="p-3 border-t border-slate-700/50 bg-slate-900/50">
        <p className="text-xs text-white/40 text-center">
          Click team to filter agents
        </p>
      </div>

      {/* Team Edit Modal */}
      {editingTeam && (
        <TeamEditModal
          isOpen={!!editingTeam}
          onClose={() => setEditingTeam(null)}
          team={editingTeam}
          onUpdated={() => {
            onTeamUpdated();
            setEditingTeam(null);
          }}
          showToast={showToast}
        />
      )}
    </div>
  );
}
