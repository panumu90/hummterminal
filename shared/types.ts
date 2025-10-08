// Shared Types for Humm Terminal Application

// ==================== CS PORTAL TYPES ====================

export interface Agent {
  id: number;
  name: string;
  email: string;
  role: 'agent' | 'supervisor' | 'manager' | 'admin';
  status: 'active' | 'away' | 'offline';
  avatar?: string;
  teamId?: number;
  skills?: string[];
  performance?: {
    satisfaction: number;
    resolutionTime: number;
    ticketsResolved: number;
  };
}

export interface Team {
  id: number;
  name: string;
  description?: string;
  color?: string;
  agentCount: number;
  agentIds: number[];
  createdAt: string;
  updatedAt?: string;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  company?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  totalTickets?: number;
  satisfaction?: number;
}

export interface Analytics {
  totalTickets: number;
  resolvedTickets: number;
  averageResolutionTime: number;
  customerSatisfaction: number;
  activeAgents: number;
  teamPerformance: TeamPerformance[];
}

export interface TeamPerformance {
  teamId: number;
  teamName: string;
  ticketsResolved: number;
  avgResolutionTime: number;
  satisfaction: number;
}

// ==================== CHAT TYPES ====================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context_type?: ContextType;
  isEnhanced?: boolean;
}

export type ContextType =
  | 'strategic'
  | 'practical'
  | 'finnish'
  | 'planning'
  | 'technical'
  | 'mcp'
  | 'tech_lead'
  | 'general';

export interface ChatRequest {
  message: string;
  context_type?: ContextType;
}

export interface ChatResponse {
  message: string;
  context_type: ContextType;
  timestamp: string;
}

// ==================== CASE STUDY TYPES ====================

export interface CaseStudy {
  id: string;
  company: string;
  industry: string;
  challenge: string;
  solution: string;
  results: CaseResult[];
  technologies: string[];
  timeline?: string;
  region?: string;
}

export interface CaseResult {
  metric: string;
  value: string;
  description?: string;
}

// ==================== QUESTION & ANSWER TYPES ====================

export interface QuestionAnswer {
  id: string;
  question: string;
  answer: string;
  category?: string;
  tags?: string[];
}

// ==================== ROADMAP TYPES ====================

export interface RoadmapPhase {
  id: string;
  name: string;
  description: string;
  timeframe: string;
  revenue: {
    start: number;
    end: number;
    growth: number;
  };
  margin: {
    start: number;
    end: number;
    improvement: number;
  };
  status: 'in_progress' | 'upcoming' | 'completed';
  categories: RoadmapCategory[];
  kpis: KPI[];
}

export interface RoadmapCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  metrics: {
    current: string;
    target: string;
    impact: string;
  };
  actions: string[];
  technologies: string[];
  risks: string[];
  benchmarks: Benchmark[];
}

export interface Benchmark {
  company: string;
  achievement: string;
  source?: string;
}

export interface KPI {
  name: string;
  current: number | string;
  target: number | string;
  unit: string;
  change?: number;
}

// ==================== DASHBOARD TYPES ====================

export interface DashboardMetric {
  id: string;
  label: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: string;
  color: string;
  description?: string;
}

export interface ProjectProgress {
  id: string;
  name: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'completed';
  dueDate?: string;
}

// ==================== API RESPONSE TYPES ====================

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AICommandResponse {
  success: boolean;
  message: string;
  type?: 'agent' | 'team' | 'client' | 'analytics';
  data?: any;
  action?: string;
}

// ==================== FORM TYPES ====================

export interface CreateAgentForm {
  name: string;
  email: string;
  role: Agent['role'];
  teamId?: number;
  skills?: string[];
}

export interface CreateTeamForm {
  name: string;
  description?: string;
  color?: string;
}

export interface CreateClientForm {
  name: string;
  email: string;
  company?: string;
}

// ==================== UTILITY TYPES ====================

export type DateRange = {
  from: Date;
  to: Date;
};

export type ViewMode = 'executive' | 'technical' | 'operational';

export type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all';
