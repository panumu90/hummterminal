/**
 * Customer Service Management Portal - Agents Split View
 *
 * Usage with React Router:
 * ```tsx
 * <Route path="/agents" element={<AgentsSplitView />} />
 * ```
 *
 * Features:
 * - Left panel: Agents directory with search, filter, multi-select
 * - Right panel: Team board with drag-and-drop assignment
 * - Bulk actions: Assign role, add/remove from team
 * - Command palette (Ctrl/Cmd+K)
 * - Mock data with localStorage persistence
 *
 * Tech: React 18 + TypeScript, HTML5 Drag & Drop, Tailwind CSS
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';

// ============================================================================
// Types
// ============================================================================

type AgentRole = 'agent' | 'supervisor' | 'admin' | 'ai-agent';

interface Agent {
  id: string;
  name: string;
  email: string;
  role: AgentRole;
  team: string;
  skills: string[];
  langs: string[];
}

const TEAMS = ['Unassigned', 'Acme Support', 'Humm CX Team'] as const;

// ============================================================================
// Mock Data
// ============================================================================

const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Emma Wilson',
    email: 'emma.wilson@humm.fi',
    role: 'agent',
    team: 'Unassigned',
    skills: ['Technical Support', 'CRM'],
    langs: ['English', 'Finnish'],
  },
  {
    id: '2',
    name: 'Mikko Virtanen',
    email: 'mikko.virtanen@humm.fi',
    role: 'supervisor',
    team: 'Acme Support',
    skills: ['Leadership', 'Escalation'],
    langs: ['Finnish', 'English', 'Swedish'],
  },
  {
    id: '3',
    name: 'Sarah Chen',
    email: 'sarah.chen@humm.fi',
    role: 'agent',
    team: 'Acme Support',
    skills: ['Billing', 'Technical'],
    langs: ['English', 'Mandarin'],
  },
  {
    id: '4',
    name: 'Jari Laine',
    email: 'jari.laine@humm.fi',
    role: 'admin',
    team: 'Humm CX Team',
    skills: ['Admin', 'Analytics', 'Reporting'],
    langs: ['Finnish', 'English'],
  },
  {
    id: '5',
    name: 'AI Assistant Claude',
    email: 'ai-agent@humm.fi',
    role: 'ai-agent',
    team: 'Humm CX Team',
    skills: ['Auto-Response', 'Classification', 'Summarization'],
    langs: ['All Languages'],
  },
];

// ============================================================================
// Storage Helpers
// ============================================================================

const STORAGE_KEY = 'humm-agents-data';

function loadAgents(): Agent[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return mockAgents;
    }
  }
  return mockAgents;
}

function saveAgents(agents: Agent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(agents));
}

// ============================================================================
// Main Component
// ============================================================================

export default function AgentsSplitView() {
  const [agents, setAgents] = useState<Agent[]>(loadAgents);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<AgentRole | 'all'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [draggedAgent, setDraggedAgent] = useState<Agent | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Persist changes to localStorage
  useEffect(() => {
    saveAgents(agents);
  }, [agents]);

  // Command palette keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // ============================================================================
  // Computed Values
  // ============================================================================

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesSearch =
        agent.name.toLowerCase().includes(search.toLowerCase()) ||
        agent.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === 'all' || agent.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [agents, search, roleFilter]);

  const teamCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    TEAMS.forEach((team) => {
      counts[team] = agents.filter((a) => a.team === team).length;
    });
    return counts;
  }, [agents]);

  const teamSLA = useMemo(() => {
    // Mock SLA percentages
    return {
      'Unassigned': 0,
      'Acme Support': 94,
      'Humm CX Team': 98,
    };
  }, []);

  // ============================================================================
  // Handlers
  // ============================================================================

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const updateAgent = useCallback((id: string, updates: Partial<Agent>) => {
    setAgents((prev) =>
      prev.map((agent) => (agent.id === id ? { ...agent, ...updates } : agent))
    );
  }, []);

  const updateAgentTeam = useCallback(
    (agentId: string, newTeam: string) => {
      updateAgent(agentId, { team: newTeam });
      // TODO: Integrate with Chatwoot API when backend is ready
      showToast(`Moved agent to ${newTeam}`);
    },
    [updateAgent]
  );

  const updateAgentRole = useCallback(
    (agentId: string, newRole: AgentRole) => {
      updateAgent(agentId, { role: newRole });
      // TODO: Integrate with Chatwoot API when backend is ready
      showToast(`Updated role to ${newRole}`);
    },
    [updateAgent]
  );

  const handleDragStart = (e: React.DragEvent, agent: Agent) => {
    setDraggedAgent(agent);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedAgent(null);
    setDropTarget(null);
  };

  const handleDragOver = (e: React.DragEvent, team: string) => {
    e.preventDefault();
    setDropTarget(team);
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const handleDrop = (e: React.DragEvent, team: string) => {
    e.preventDefault();
    if (draggedAgent && draggedAgent.team !== team) {
      updateAgentTeam(draggedAgent.id, team);
    }
    setDraggedAgent(null);
    setDropTarget(null);
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const bulkAssignRole = (role: AgentRole) => {
    selectedIds.forEach((id) => {
      updateAgentRole(id, role);
    });
    setSelectedIds(new Set());
    showToast(`Updated ${selectedIds.size} agent(s) to ${role}`);
  };

  const bulkAddToTeam = (team: string) => {
    selectedIds.forEach((id) => {
      updateAgentTeam(id, team);
    });
    setSelectedIds(new Set());
    showToast(`Moved ${selectedIds.size} agent(s) to ${team}`);
  };

  const bulkRemoveFromTeam = () => {
    selectedIds.forEach((id) => {
      updateAgentTeam(id, 'Unassigned');
    });
    setSelectedIds(new Set());
    showToast(`Removed ${selectedIds.size} agent(s) from teams`);
  };

  // ============================================================================
  // Role/Team Pill Styles
  // ============================================================================

  const getRolePillClass = (role: AgentRole) => {
    const baseClass = 'px-2 py-0.5 rounded-full text-xs font-medium';
    const colorMap = {
      agent: 'bg-blue-500/20 text-blue-300',
      supervisor: 'bg-purple-500/20 text-purple-300',
      admin: 'bg-red-500/20 text-red-300',
      'ai-agent': 'bg-emerald-500/20 text-emerald-300',
    };
    return `${baseClass} ${colorMap[role]}`;
  };

  const getTeamPillClass = (team: string) => {
    const baseClass = 'px-2 py-0.5 rounded-full text-xs font-medium';
    if (team === 'Unassigned') return `${baseClass} bg-gray-500/20 text-gray-400`;
    return `${baseClass} bg-indigo-500/20 text-indigo-300`;
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Customer Service Portal</h1>
        <p className="text-slate-400">Manage agents and team assignments</p>
      </div>

      {/* Split View Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT PANEL: Agents Directory */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Agents Directory</h2>

          {/* Search and Filter */}
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="Search agents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as AgentRole | 'all')}
              className="bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="agent">Agent</option>
              <option value="supervisor">Supervisor</option>
              <option value="admin">Admin</option>
              <option value="ai-agent">AI Agent</option>
            </select>
          </div>

          {/* Bulk Actions Bar */}
          {selectedIds.size > 0 && (
            <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-between">
              <span className="text-blue-300 text-sm">
                {selectedIds.size} agent(s) selected
              </span>
              <div className="flex gap-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      bulkAssignRole(e.target.value as AgentRole);
                      e.target.value = '';
                    }
                  }}
                  className="bg-slate-900 border border-slate-600 rounded px-3 py-1 text-sm text-white"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Assign Role ▼
                  </option>
                  <option value="agent">Agent</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="admin">Admin</option>
                </select>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      bulkAddToTeam(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="bg-slate-900 border border-slate-600 rounded px-3 py-1 text-sm text-white"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Add to Team ▼
                  </option>
                  {TEAMS.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
                <button
                  onClick={bulkRemoveFromTeam}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1 rounded text-sm transition-colors"
                >
                  Remove from Team
                </button>
              </div>
            </div>
          )}

          {/* Agents List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto" role="list">
            {filteredAgents.map((agent) => (
              <div
                key={agent.id}
                draggable
                onDragStart={(e) => handleDragStart(e, agent)}
                onDragEnd={handleDragEnd}
                className={`bg-slate-900/70 border border-slate-600/50 rounded-xl p-4 cursor-move hover:border-blue-500/50 transition-all group relative ${
                  draggedAgent?.id === agent.id ? 'opacity-50 scale-95' : ''
                }`}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedIds.has(agent.id)}
                  onChange={() => toggleSelect(agent.id)}
                  className="absolute top-4 right-4 w-4 h-4 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                />

                {/* Agent Info */}
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {agent.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-white font-medium">{agent.name}</h3>
                    <p className="text-slate-400 text-sm">{agent.email}</p>

                    <div className="flex gap-2 mt-2">
                      <span className={getRolePillClass(agent.role)}>{agent.role}</span>
                      <span className={getTeamPillClass(agent.team)}>{agent.team}</span>
                    </div>
                  </div>
                </div>

                {/* Tooltip on Hover */}
                <div className="absolute left-0 top-full mt-2 bg-slate-800 border border-slate-600 rounded-lg p-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 w-64">
                  <p className="text-white text-sm font-medium mb-1">Skills:</p>
                  <p className="text-slate-300 text-xs mb-2">{agent.skills.join(', ')}</p>
                  <p className="text-white text-sm font-medium mb-1">Languages:</p>
                  <p className="text-slate-300 text-xs">{agent.langs.join(', ')}</p>
                </div>
              </div>
            ))}

            {filteredAgents.length === 0 && (
              <div className="text-center text-slate-400 py-8">No agents found</div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Teams Board */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Teams Board</h2>

          <div className="space-y-4">
            {TEAMS.map((team) => {
              const teamAgents = agents.filter((a) => a.team === team);
              const sla = teamSLA[team as keyof typeof teamSLA];

              return (
                <div
                  key={team}
                  onDragOver={(e) => handleDragOver(e, team)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, team)}
                  className={`border-2 border-dashed rounded-xl p-4 min-h-[150px] transition-all ${
                    dropTarget === team
                      ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                      : 'border-slate-600/50 bg-slate-900/30'
                  }`}
                  role="region"
                  aria-label={`${team} team drop zone`}
                >
                  {/* Team Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-semibold">{team}</h3>
                      <span className="px-2 py-0.5 bg-slate-700 rounded-full text-xs text-slate-300">
                        {teamCounts[team]}
                      </span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        sla >= 95
                          ? 'bg-green-500/20 text-green-300'
                          : sla >= 90
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {sla}% SLA
                    </span>
                  </div>

                  {/* Team Members */}
                  <div className="space-y-2">
                    {teamAgents.map((agent) => (
                      <div
                        key={agent.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, agent)}
                        onDragEnd={handleDragEnd}
                        className="bg-slate-800/70 border border-slate-600/50 rounded-lg p-3 cursor-move hover:border-purple-500/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                            {agent.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">{agent.name}</p>
                            <span className={getRolePillClass(agent.role)}>{agent.role}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {teamAgents.length === 0 && (
                      <p className="text-slate-500 text-sm text-center py-4">
                        Drop agents here
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Command Palette */}
      {commandPaletteOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-start justify-center pt-32 z-50"
          onClick={() => setCommandPaletteOpen(false)}
        >
          <div
            className="bg-slate-800 border border-slate-600 rounded-xl p-4 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setCommandPaletteOpen(false);
                  showToast('Use drag & drop to assign agents to teams');
                }}
                className="w-full text-left px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-white transition-colors"
              >
                Assign to Team
              </button>
              <button
                onClick={() => {
                  setCommandPaletteOpen(false);
                  showToast('Use bulk actions or individual dropdowns');
                }}
                className="w-full text-left px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-white transition-colors"
              >
                Change Role
              </button>
              <button
                onClick={() => {
                  setCommandPaletteOpen(false);
                  document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
                }}
                className="w-full text-left px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-white transition-colors"
              >
                Search Agent
              </button>
            </div>
            <p className="text-slate-400 text-xs mt-3">Press Esc to close</p>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg z-50 ${
            toast.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Keyboard Hint */}
      <div className="fixed bottom-6 left-6 text-slate-500 text-sm">
        Press <kbd className="px-2 py-1 bg-slate-800 rounded border border-slate-600">Ctrl+K</kbd>{' '}
        for quick actions
      </div>
    </div>
  );
}
