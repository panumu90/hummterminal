import { useQuery } from "@tanstack/react-query";
import { X, User, Mail, Users, BarChart3 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AgentDetailDrawerProps {
  agent: any;
  onClose: () => void;
  onRoleUpdate: (agentId: number, newRole: string) => Promise<void>;
  showToast: (message: string, type: 'success' | 'error') => void;
  setViewMode: (mode: 'dashboard' | 'workspace') => void;
}

export function AgentDetailDrawer({ agent, onClose, onRoleUpdate, showToast, setViewMode }: AgentDetailDrawerProps) {
  const { data: agentMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: [`/api/cs-portal/agents/${agent.id}/metrics`],
    enabled: !!agent,
  });

  return (
    <div className="absolute top-0 right-0 h-full w-96 bg-slate-900/95 border-l border-slate-700/50 shadow-2xl backdrop-blur-sm transform transition-transform duration-300 z-50 overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-gradient-to-r from-slate-800 to-slate-900">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <User className="h-4 w-4" />
            Agent Profile
          </h3>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {/* Agent Info Card */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-semibold text-xl shadow-lg">
                {agent.name?.split(' ').map((n: string) => n[0]).join('') || '?'}
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-lg">{agent.name}</h4>
                <p className="text-white/60 text-sm flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {agent.email}
                </p>
              </div>
            </div>

            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
              agent.availability_status === 'online'
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}>
              <div className={`w-2 h-2 rounded-full ${agent.availability_status === 'online' ? 'bg-green-400' : 'bg-gray-400'}`} />
              {agent.availability_status || 'offline'}
            </div>
          </div>

          {/* Role Management */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <label className="text-white/70 text-sm font-medium mb-2 block flex items-center gap-2">
              <Users className="h-4 w-4" />
              Role
            </label>
            <Select
              defaultValue={agent.role}
              onValueChange={async (newRole) => {
                try {
                  await onRoleUpdate(agent.id, newRole);
                  showToast(`Role updated to ${newRole}`, 'success');
                } catch (error) {
                  showToast('Failed to update role', 'error');
                }
              }}
            >
              <SelectTrigger className="w-full bg-slate-900/50 border-slate-600/50 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="agent" className="text-white">Agent</SelectItem>
                <SelectItem value="supervisor" className="text-white">Supervisor</SelectItem>
                <SelectItem value="administrator" className="text-white">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Performance Metrics */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-white/70 text-sm font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Performance Metrics
              </label>
              {agentMetrics && (
                <span className="text-xs text-emerald-400">Live Data</span>
              )}
            </div>

            {metricsLoading ? (
              <div className="space-y-2">
                <div className="h-12 bg-slate-700/30 rounded animate-pulse" />
                <div className="h-12 bg-slate-700/30 rounded animate-pulse" />
                <div className="h-12 bg-slate-700/30 rounded animate-pulse" />
              </div>
            ) : agentMetrics ? (
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Total Conversations</span>
                    <span className="text-white font-bold text-lg">{agentMetrics.totalConversations}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/30 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">CSAT Score</span>
                    <span className="text-emerald-400 font-bold text-lg">{agentMetrics.csat}%</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">FCR Rate</span>
                    <span className="text-purple-400 font-bold text-lg">{agentMetrics.fcr}%</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Avg Handle Time</span>
                    <span className="text-orange-400 font-bold text-lg">{agentMetrics.aht}m</span>
                  </div>
                </div>

                <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Active Chats</span>
                    <span className="text-white font-medium">{agentMetrics.activeConversations}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-white/50 text-sm">
                No metrics available
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <button
              onClick={() => {
                setViewMode('dashboard');
                showToast(`Viewing analytics for ${agent.name}`, 'success');
              }}
              className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              View Full Analytics
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white font-medium hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
