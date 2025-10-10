import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CXAnalyticsWidget from "@/components/cx-analytics-widget";
import { ClientOnboardingModal, AgentCreationModal, TeamCreationModal } from "@/components/onboarding-modals";
import { X, Plus, Search, UserPlus, Building2, Users, Filter, MoreVertical, Mail, CheckSquare, Square, ArrowRight, BarChart3, User, Sparkles } from "lucide-react";

import { AgentDetailDrawer } from "@/components/AgentDetailDrawer";
import { TeamsPanel } from "@/components/TeamsPanel";
import { AgentsPanel } from "@/components/AgentsPanel";
import { AgentPerformanceModal } from "@/components/AgentPerformanceModal";
import { AICommandInput } from "@/components/AICommandInput";
interface CSPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CSPortalModal({ isOpen, onClose }: CSPortalModalProps) {
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  // Modal states
  const [showClientModal, setShowClientModal] = useState(false);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);

  // Multi-select state
  const [selectedAgents, setSelectedAgents] = useState<Set<number>>(new Set());

  // Drag-and-drop state
  const [draggedAgent, setDraggedAgent] = useState<any | null>(null);
  const [dropTargetTeam, setDropTargetTeam] = useState<number | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[placeholder*="Search"]')?.focus();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowAgentModal(true);
      }
      if (e.key === 'Escape' && selectedAgent) {
        setSelectedAgent(null);
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, selectedAgent]);

  // Fetch accounts
  const { data: accounts = [], refetch: refetchAccounts } = useQuery<any[]>({
    queryKey: ['/api/cs-portal/accounts'],
    queryFn: async () => {
      const response = await fetch('/api/cs-portal/accounts');
      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }
      return response.json();
    },
    enabled: isOpen,
  });
  useEffect(() => {
    if (isOpen && selectedAccount === null && accounts.length > 0) {
      const firstAccountId = accounts[0]?.id;
      if (typeof firstAccountId === 'number') {
        setSelectedAccount(firstAccountId);
      }
    }
  }, [isOpen, selectedAccount, accounts]);

  // Fetch agents for selected account
  const { data: agents = [], isLoading: agentsLoading, refetch: refetchAgents } = useQuery<any[]>({
    queryKey: ['/api/cs-portal/agents', selectedAccount],
    queryFn: async () => {
      const response = await fetch(`/api/cs-portal/agents?accountId=${selectedAccount}`);
      if (!response.ok) throw new Error('Failed to fetch agents');
      return response.json();
    },
    enabled: isOpen && selectedAccount !== null,
    refetchInterval: 5000, // Auto-refresh every 5 seconds to sync data
  });

  // Fetch teams for selected account
  const { data: teams = [], isLoading: teamsLoading, refetch: refetchTeams } = useQuery<any[]>({
    queryKey: ['/api/cs-portal/teams', selectedAccount],
    queryFn: async () => {
      const response = await fetch(`/api/cs-portal/teams?accountId=${selectedAccount}`);
      if (!response.ok) throw new Error('Failed to fetch teams');
      return response.json();
    },
    enabled: isOpen && selectedAccount !== null,
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  const handleAccountCreated = (account: any) => {
    void refetchAccounts();
    if (typeof account?.id === 'number') {
      setSelectedAccount(account.id);
    }
    const name = account?.name || 'Client';
    setToast({ message: `${name} added successfully`, type: 'success' });
  };

  const handleAgentCreated = (agent: any) => {
    void refetchAgents();
    const name = agent?.name || 'Agent';
    setToast({ message: `${name} created`, type: 'success' });
  };

  const handleTeamCreated = (team: any) => {
    void refetchTeams();
    const name = team?.name || 'Team';
    setToast({ message: `${name} created`, type: 'success' });
  };

  // Chatwoot health status
  const { data: health } = useQuery<{ status: string; connected: boolean; chatwoot_url?: string; error?: string }>({
    queryKey: ['/api/cs-portal/health'],
    queryFn: async () => {
      const res = await fetch('/api/cs-portal/health');
      return res.json();
    },
    enabled: isOpen,
    refetchInterval: 10000,
  });

  // Drag-and-drop handlers
  const handleDragStart = (agent: any) => {
    setDraggedAgent(agent);
  };

  const handleDragOver = (e: React.DragEvent, teamId: number) => {
    e.preventDefault();
    setDropTargetTeam(teamId);
  };

  const handleDragLeave = () => {
    setDropTargetTeam(null);
  };

  const handleDrop = async (e: React.DragEvent, teamId: number) => {
    e.preventDefault();
    if (!draggedAgent) return;

    try {
      // Call API to assign agent to team
      await fetch(`/api/cs-portal/teams/${teamId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: draggedAgent.id }),
      });

      setToast({ message: `Moved ${draggedAgent.name} to team`, type: 'success' });
      refetchAgents();
      refetchTeams();
    } catch (error) {
      setToast({ message: 'Failed to assign agent', type: 'error' });
    }

    setDraggedAgent(null);
    setDropTargetTeam(null);
  };

  // Multi-select handlers
  const toggleAgentSelection = (agentId: number) => {
    const newSelected = new Set(selectedAgents);
    if (newSelected.has(agentId)) {
      newSelected.delete(agentId);
    } else {
      newSelected.add(agentId);
    }
    setSelectedAgents(newSelected);
  };

  const selectAllAgents = () => {
    if (selectedAgents.size === filteredAgents.length) {
      setSelectedAgents(new Set());
    } else {
      setSelectedAgents(new Set(filteredAgents.map(a => a.id)));
    }
  };

  const bulkAssignRole = async (role: string) => {
    try {
      await Promise.all(
        Array.from(selectedAgents).map(agentId =>
          fetch(`/api/cs-portal/agents/${agentId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role }),
          })
        )
      );
      setToast({ message: `Updated ${selectedAgents.size} agent(s)`, type: 'success' });
      setSelectedAgents(new Set());
      refetchAgents();
    } catch (error) {
      setToast({ message: 'Failed to update agents', type: 'error' });
    }
  };

  const bulkAssignTeam = async (teamId: number) => {
    try {
      await Promise.all(
        Array.from(selectedAgents).map(agentId =>
          fetch(`/api/cs-portal/teams/${teamId}/members`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agentId }),
          })
        )
      );
      setToast({ message: `Assigned ${selectedAgents.size} agent(s) to team`, type: 'success' });
      setSelectedAgents(new Set());
      refetchAgents();
      refetchTeams();
    } catch (error) {
      setToast({ message: 'Failed to assign agents', type: 'error' });
    }
  };

  // Filtered agents
  const filteredAgents = agents.filter((agent: any) => {
    const matchesSearch = agent.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || agent.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Get team agents count
  const getTeamAgentCount = (teamId: number) => {
    // TODO: When team members API is available, use actual data
    return agents.filter((a: any) => a.team_id === teamId).length;
  };

  // Mock SLA data
  const getTeamSLA = (teamId: number) => {
    const slaMap: Record<number, number> = { 7: 94, 8: 98 };
    return slaMap[teamId] || 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[98vw] max-h-[98vh] p-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-slate-700/50 backdrop-blur-sm">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0f1b2d] to-[#1a2a44] border-b border-slate-600/50 p-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(79,131,241,0.1),transparent_50%)]" />

            <div className="relative flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  CS Portal
                </span>
              </h1>
                <p className="text-white/60 text-xs mt-0.5">Workspace & Analytics</p>
            </div>

            <div className="flex items-center gap-3">
                {/* Chatwoot health chip */}
                <div className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${health?.connected ? 'bg-green-500/10 text-green-300 border-green-400/30' : 'bg-red-500/10 text-red-300 border-red-400/30'}`} title={health?.error || health?.chatwoot_url || ''}>
                  {health?.connected ? 'Chatwoot: Connected' : 'Chatwoot: Disconnected'}
                </div>
              <Select
                value={selectedAccount?.toString() || "all"}
                onValueChange={(value) => setSelectedAccount(value === "all" ? null : parseInt(value))}
              >
                <SelectTrigger className="w-[220px] bg-white/5 border-slate-600/50 text-white text-sm h-9">
                  <SelectValue placeholder="Select Account" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2332] border-slate-600/50">
                  <SelectItem value="all" className="text-white/70">All Accounts</SelectItem>
                  {accounts.map((account: any) => (
                    <SelectItem
                      key={account.id}
                      value={account.id.toString()}
                      className="text-white hover:bg-white/10"
                    >
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <button onClick={onClose} className="text-white/60 hover:text-white transition-colors p-1.5">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

  {/* Main Content */}
  <div className="h-[calc(98vh-80px)] overflow-auto">
          {/* 3-Column Grid Layout: Teams | Analytics | Agents */}
          <div className="grid grid-cols-[20%_50%_30%] h-full">
            {/* LEFT: Teams Panel */}
            <TeamsPanel
              teams={teams}
              isLoading={teamsLoading}
              selectedTeamId={selectedTeamId}
              onTeamSelect={setSelectedTeamId}
              onTeamUpdated={refetchTeams}
              showToast={(message, type) => setToast({ message, type })}
              getTeamAgentCount={getTeamAgentCount}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              dropTargetTeam={dropTargetTeam}
            />

            {/* CENTER: Analytics Widget + AI Command Input */}
            <div className="h-full flex flex-col border-x border-slate-700/50">
              <div className="flex-1 overflow-auto">
                <CXAnalyticsWidget accountId={selectedAccount} selectedTeamId={selectedTeamId} />
              </div>
              <AICommandInput
                accountId={selectedAccount}
                onAgentCreated={handleAgentCreated}
                onClientCreated={handleAccountCreated}
                onTeamCreated={handleTeamCreated}
                onShowAgentModal={() => setShowAgentModal(true)}
                onShowClientModal={() => setShowClientModal(true)}
                onShowTeamModal={() => setShowTeamModal(true)}
                showToast={(message, type) => setToast({ message, type })}
              />
            </div>

            {/* RIGHT: Agents Panel */}
            <AgentsPanel
              agents={agents}
              isLoading={agentsLoading}
              selectedTeamId={selectedTeamId}
              onAgentClick={setSelectedAgent}
              onAddAgent={() => setShowAgentModal(true)}
              onDragStart={handleDragStart}
              onDragEnd={() => setDraggedAgent(null)}
              draggedAgent={draggedAgent}
            />
          </div>
        </div>

        {/* Agent Performance Modal */}
        <AgentPerformanceModal
          isOpen={!!selectedAgent}
          onClose={() => setSelectedAgent(null)}
          agent={selectedAgent}
          onRoleUpdate={async (agentId, newRole) => {
            await fetch(`/api/cs-portal/agents/${agentId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ role: newRole }),
            });
            refetchAgents();
          }}
          showToast={(message, type) => setToast({ message, type })}
        />

                {/* Toast Notification */}
        {toast && (
          <div className={`absolute bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg z-50 ${
            toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {toast.message}
          </div>
        )}

        {/* Keyboard Shortcuts Hint */}
        <div className="absolute bottom-3 left-3 text-white/40 text-[10px] space-y-0.5">
          <div>⌘/Ctrl + F: Search</div>
          <div>⌘/Ctrl + K: Add Agent</div>
          <div>Shift + Click: Multi-select</div>
        </div>

        {/* Onboarding Modals */}
        <ClientOnboardingModal isOpen={showClientModal} onClose={() => setShowClientModal(false)} onCreated={handleAccountCreated} />
        <AgentCreationModal isOpen={showAgentModal} onClose={() => setShowAgentModal(false)} accountId={selectedAccount} onCreated={handleAgentCreated} />
        <TeamCreationModal isOpen={showTeamModal} onClose={() => setShowTeamModal(false)} accountId={selectedAccount} onCreated={handleTeamCreated} />
      </DialogContent>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </Dialog>
  );
}








