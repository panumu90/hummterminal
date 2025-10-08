import { useState } from "react";
import { Search, Filter, UserPlus, Mail, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Agent {
  id: number;
  name: string;
  email: string;
  role: string;
  availability_status: string;
  accountId: number;
  team_id?: number;
}

interface AgentsPanelProps {
  agents: Agent[];
  isLoading: boolean;
  selectedTeamId: number | null;
  onAgentClick: (agent: Agent) => void;
  onAddAgent: () => void;
  onDragStart: (agent: Agent) => void;
  onDragEnd: () => void;
  draggedAgent: Agent | null;
}

export function AgentsPanel({
  agents,
  isLoading,
  selectedTeamId,
  onAgentClick,
  onAddAgent,
  onDragStart,
  onDragEnd,
  draggedAgent,
}: AgentsPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Filter agents
  const filteredAgents = agents.filter((agent) => {
    // Team filter
    if (selectedTeamId !== null && agent.team_id !== selectedTeamId) {
      return false;
    }

    // Search filter
    const matchesSearch =
      agent.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.email?.toLowerCase().includes(searchQuery.toLowerCase());

    // Role filter
    const matchesRole = roleFilter === 'all' || agent.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'administrator':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'supervisor':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/30 border-l border-slate-700/50">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <User className="h-4 w-4 text-emerald-400" />
            Agents
            <span className="text-xs font-normal text-white/60">
              ({filteredAgents.length}/{agents.length})
            </span>
          </h2>
          <button
            onClick={onAddAgent}
            className="px-2 py-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded text-xs font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-1"
          >
            <UserPlus className="h-3 w-3" />
            Add
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-2">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-white/40" />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 pr-2 py-1.5 bg-slate-800/50 border border-slate-600/50 rounded text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Role Filter */}
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full bg-slate-800/50 border-slate-600/50 text-white text-xs h-7">
            <Filter className="h-3 w-3 mr-1" />
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700">
            <SelectItem value="all" className="text-white text-xs">All Roles</SelectItem>
            <SelectItem value="agent" className="text-white text-xs">Agent</SelectItem>
            <SelectItem value="supervisor" className="text-white text-xs">Supervisor</SelectItem>
            <SelectItem value="administrator" className="text-white text-xs">Administrator</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Agents List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
        {isLoading ? (
          // Loading skeletons
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-slate-800/30 rounded-lg animate-pulse" />
            ))}
          </>
        ) : filteredAgents.length === 0 ? (
          <div className="text-center py-8 text-white/40 text-xs">
            {selectedTeamId ? 'No agents in this team' : 'No agents found'}
          </div>
        ) : (
          <>
            {filteredAgents.map((agent) => {
              const isDragging = draggedAgent?.id === agent.id;

              return (
                <div
                  key={agent.id}
                  draggable
                  onDragStart={() => onDragStart(agent)}
                  onDragEnd={onDragEnd}
                  onClick={() => onAgentClick(agent)}
                  className={`
                    p-2.5 rounded-lg border cursor-pointer transition-all
                    ${isDragging
                      ? 'opacity-50 scale-95 border-emerald-500'
                      : 'border-slate-700/50 bg-slate-800/50 hover:border-emerald-500/50 hover:bg-slate-800/70'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                      {agent.name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-medium text-white truncate">
                        {agent.name}
                      </h3>
                      <p className="text-[10px] text-white/50 truncate flex items-center gap-1">
                        <Mail className="h-2.5 w-2.5" />
                        {agent.email}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="flex flex-col items-end gap-1">
                      <div className={`w-2 h-2 rounded-full ${
                        agent.availability_status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                      }`} />
                      <span className={`text-[9px] px-1.5 py-0.5 rounded border ${getRoleBadgeColor(agent.role)}`}>
                        {agent.role}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Footer Hint */}
      <div className="p-2 border-t border-slate-700/50 bg-slate-900/50">
        <p className="text-[10px] text-white/40 text-center">
          Click agent to view performance
        </p>
      </div>
    </div>
  );
}
