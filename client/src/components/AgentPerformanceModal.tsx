import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, User, Mail, BarChart3, TrendingUp, Headset, Timer, MessageSquare } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Agent {
  id: number;
  name: string;
  email: string;
  role: string;
  availability_status: string;
}

interface AgentPerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent | null;
  onRoleUpdate: (agentId: number, newRole: string) => Promise<void>;
  showToast: (message: string, type: 'success' | 'error') => void;
}

export function AgentPerformanceModal({
  isOpen,
  onClose,
  agent,
  onRoleUpdate,
  showToast,
}: AgentPerformanceModalProps) {
  const { data: metrics, isLoading } = useQuery({
    queryKey: [`/api/cs-portal/agents/${agent?.id}/metrics`],
    enabled: !!agent && isOpen,
  });

  if (!agent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-slate-700/50 text-white p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-slate-700/50">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-semibold text-2xl shadow-lg">
                {agent.name?.split(' ').map((n: string) => n[0]).join('') || '?'}
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  {agent.name}
                </DialogTitle>
                <p className="text-white/60 text-sm flex items-center gap-1 mt-1">
                  <Mail className="h-3.5 w-3.5" />
                  {agent.email}
                </p>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mt-2 ${
                  agent.availability_status === 'online'
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${agent.availability_status === 'online' ? 'bg-green-400' : 'bg-gray-400'}`} />
                  {agent.availability_status || 'offline'}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] custom-scrollbar">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-slate-800/30 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : metrics ? (
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column: KPIs */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wide flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Key Metrics
                </h3>

                {/* Total Conversations */}
                <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/60 mb-1">Total Conversations</p>
                      <p className="text-3xl font-bold text-white">{metrics.totalConversations}</p>
                    </div>
                    <MessageSquare className="h-10 w-10 text-blue-400 opacity-50" />
                  </div>
                </div>

                {/* CSAT Score */}
                <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/60 mb-1">CSAT Score</p>
                      <p className="text-3xl font-bold text-emerald-400">{metrics.csat}%</p>
                    </div>
                    <TrendingUp className="h-10 w-10 text-emerald-400 opacity-50" />
                  </div>
                  <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all"
                      style={{ width: `${metrics.csat}%` }}
                    />
                  </div>
                </div>

                {/* FCR Rate */}
                <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/60 mb-1">First Contact Resolution</p>
                      <p className="text-3xl font-bold text-purple-400">{metrics.fcr}%</p>
                    </div>
                    <Headset className="h-10 w-10 text-purple-400 opacity-50" />
                  </div>
                </div>

                {/* AHT */}
                <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/60 mb-1">Avg Handle Time</p>
                      <p className="text-3xl font-bold text-orange-400">{metrics.aht}m</p>
                    </div>
                    <Timer className="h-10 w-10 text-orange-400 opacity-50" />
                  </div>
                </div>

                {/* Active Chats */}
                <div className="bg-slate-800/50 border border-slate-600/50 rounded-xl p-4">
                  <p className="text-xs text-white/60 mb-1">Active Conversations</p>
                  <p className="text-2xl font-semibold text-white">{metrics.activeConversations}</p>
                </div>
              </div>

              {/* Right Column: Charts */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wide flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Performance Trends
                </h3>

                {/* Conversations Trend */}
                <div className="bg-slate-800/50 border border-slate-600/50 rounded-xl p-4">
                  <p className="text-xs text-white/60 mb-3">Conversations (Last 4 Weeks)</p>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={metrics.trend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '10px' }} />
                      <YAxis stroke="#94a3b8" style={{ fontSize: '10px' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #475569',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="conversations"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* CSAT Trend */}
                <div className="bg-slate-800/50 border border-slate-600/50 rounded-xl p-4">
                  <p className="text-xs text-white/60 mb-3">CSAT Trend (Last 4 Weeks)</p>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={metrics.trend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '10px' }} />
                      <YAxis stroke="#94a3b8" style={{ fontSize: '10px' }} domain={[70, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #475569',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="csat"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ fill: '#10b981', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Role Management */}
                <div className="bg-slate-800/50 border border-slate-600/50 rounded-xl p-4">
                  <label className="text-xs text-white/60 mb-2 block">Agent Role</label>
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
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-white/50">
              No performance data available
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
