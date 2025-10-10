/**
 * Chatwoot API Client
 *
 * Comprehensive wrapper for Chatwoot REST API
 * Docs: https://developers.chatwoot.com/api-reference/introduction
 *
 * Authentication: Uses user access_token from Profile Settings
 */

interface ChatwootConfig {
  apiUrl: string;
  apiToken: string;
  accountId: number;
}

interface Agent {
  id: number;
  name: string;
  email: string;
  role: 'agent' | 'administrator';
  availability_status?: string;
  confirmed?: boolean;
}

interface Team {
  id: number;
  name: string;
  description?: string;
  allow_auto_assign?: boolean;
  account_id: number;
}

interface ConversationStats {
  conversations_count: number;
  incoming_messages_count: number;
  outgoing_messages_count: number;
  resolutions_count: number;
  avg_first_response_time?: number;
  avg_resolution_time?: number;
}

interface AgentMetrics {
  id: number;
  name: string;
  email: string;
  conversations_count: number;
  avg_first_response_time?: string;
  avg_resolution_time?: string;
}

interface CSATReport {
  rating: number;
  feedback_message?: string;
  conversation_id: number;
  assigned_agent_id?: number;
  created_at: string;
}

export class ChatwootClient {
  private config: ChatwootConfig;

  constructor(config: ChatwootConfig) {
    this.config = config;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.apiUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'api_access_token': this.config.apiToken,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Chatwoot API error (${response.status}): ${error}`);
    }

    return response.json();
  }

  // ============================================================================
  // ACCOUNTS
  // ============================================================================

  async listAccounts(): Promise<any[]> {
    // Chatwoot doesn't have a direct /accounts endpoint
    // Get accounts from the user profile
    const profile = await this.request<any>('/api/v1/profile');
    return profile.accounts || [];
  }

  async getAccount(accountId: number): Promise<any> {
    return this.request(`/api/v1/accounts/${accountId}`);
  }

  async updateAccount(accountId: number, data: any): Promise<any> {
    return this.request(`/api/v1/accounts/${accountId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // ============================================================================
  // AGENTS
  // ============================================================================

  async listAgents(accountId?: number): Promise<Agent[]> {
    const aid = accountId || this.config.accountId;
    return this.request(`/api/v1/accounts/${aid}/agents`);
  }

  async createAgent(accountId: number, data: {
    name: string;
    email: string;
    role?: 'agent' | 'administrator';
  }): Promise<Agent> {
    return this.request(`/api/v1/accounts/${accountId}/agents`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAgent(accountId: number, agentId: number, data: Partial<Agent>): Promise<Agent> {
    return this.request(`/api/v1/accounts/${accountId}/agents/${agentId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteAgent(accountId: number, agentId: number): Promise<void> {
    await this.request(`/api/v1/accounts/${accountId}/agents/${agentId}`, {
      method: 'DELETE',
    });
  }

  // ============================================================================
  // TEAMS
  // ============================================================================

  async listTeams(accountId?: number): Promise<Team[]> {
    const aid = accountId || this.config.accountId;
    return this.request(`/api/v1/accounts/${aid}/teams`);
  }

  async createTeam(accountId: number, data: {
    name: string;
    description?: string;
    allow_auto_assign?: boolean;
  }): Promise<Team> {
    return this.request(`/api/v1/accounts/${accountId}/teams`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTeam(accountId: number, teamId: number, data: Partial<Team>): Promise<Team> {
    return this.request(`/api/v1/accounts/${accountId}/teams/${teamId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteTeam(accountId: number, teamId: number): Promise<void> {
    await this.request(`/api/v1/accounts/${accountId}/teams/${teamId}`, {
      method: 'DELETE',
    });
  }

  async addTeamMember(accountId: number, teamId: number, agentIds: number[]): Promise<void> {
    await this.request(`/api/v1/accounts/${accountId}/teams/${teamId}/team_members`, {
      method: 'POST',
      body: JSON.stringify({ user_ids: agentIds }),
    });
  }

  async removeTeamMember(accountId: number, teamId: number, agentIds: number[]): Promise<void> {
    await this.request(`/api/v1/accounts/${accountId}/teams/${teamId}/team_members`, {
      method: 'DELETE',
      body: JSON.stringify({ user_ids: agentIds }),
    });
  }

  async getTeamMembers(accountId: number, teamId: number): Promise<Agent[]> {
    return this.request(`/api/v1/accounts/${accountId}/teams/${teamId}/team_members`);
  }

  // ============================================================================
  // CONVERSATIONS & MESSAGES
  // ============================================================================

  async getConversation(accountId: number, conversationId: number): Promise<any> {
    return this.request(`/api/v1/accounts/${accountId}/conversations/${conversationId}`);
  }

  async listMessages(accountId: number, conversationId: number): Promise<any[]> {
    const response = await this.request<{ payload: any[] }>(
      `/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`
    );
    return response.payload || [];
  }

  async createMessage(accountId: number, conversationId: number, data: {
    content: string;
    message_type?: 'outgoing' | 'incoming';
    private?: boolean;
  }): Promise<any> {
    return this.request(`/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async assignConversation(accountId: number, conversationId: number, data: {
    assignee_id?: number;
    team_id?: number;
  }): Promise<any> {
    return this.request(`/api/v1/accounts/${accountId}/conversations/${conversationId}/assignments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateConversation(accountId: number, conversationId: number, data: {
    status?: 'open' | 'resolved' | 'pending';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    custom_attributes?: Record<string, any>;
  }): Promise<any> {
    return this.request(`/api/v1/accounts/${accountId}/conversations/${conversationId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // ============================================================================
  // REPORTS & ANALYTICS
  // ============================================================================

  async getConversationStats(accountId: number, params: {
    type?: 'account' | 'agent' | 'inbox' | 'label' | 'team';
    since?: string; // ISO date
    until?: string; // ISO date
    id?: number; // For agent/team/inbox specific stats
  } = {}): Promise<ConversationStats> {
    const queryParams = new URLSearchParams();
    if (params.type) queryParams.append('type', params.type);
    if (params.since) queryParams.append('since', params.since);
    if (params.until) queryParams.append('until', params.until);
    if (params.id) queryParams.append('id', params.id.toString());

    return this.request(`/api/v2/accounts/${accountId}/reports/conversations?${queryParams}`);
  }

  async getAgentMetrics(accountId: number, params: {
    since?: string;
    until?: string;
  } = {}): Promise<AgentMetrics[]> {
    const queryParams = new URLSearchParams();
    if (params.since) queryParams.append('since', params.since);
    if (params.until) queryParams.append('until', params.until);

    return this.request(`/api/v2/accounts/${accountId}/reports/agents?${queryParams}`);
  }

  async getCSATReports(accountId: number, params: {
    since?: string;
    until?: string;
    user_ids?: string; // comma-separated agent IDs
  } = {}): Promise<CSATReport[]> {
    const queryParams = new URLSearchParams();
    if (params.since) queryParams.append('since', params.since);
    if (params.until) queryParams.append('until', params.until);
    if (params.user_ids) queryParams.append('user_ids', params.user_ids);

    const response = await this.request<{ data: CSATReport[] }>(
      `/api/v2/accounts/${accountId}/reports/csat?${queryParams}`
    );
    return response.data || [];
  }

  // ============================================================================
  // HEALTH CHECK
  // ============================================================================

  async healthCheck(): Promise<{ status: string; connected: boolean; chatwoot_url: string }> {
    try {
      await this.listAccounts();
      return {
        status: 'ok',
        connected: true,
        chatwoot_url: this.config.apiUrl,
      };
    } catch (error) {
      return {
        status: 'error',
        connected: false,
        chatwoot_url: this.config.apiUrl,
      };
    }
  }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

let cachedClient: ChatwootClient | null = null;

export function getChatwootClient(): ChatwootClient | null {
  if (cachedClient) return cachedClient;

  const apiUrl = process.env.CHATWOOT_API_URL;
  const apiToken = process.env.CHATWOOT_API_TOKEN;
  const accountId = process.env.CHATWOOT_ACCOUNT_ID;

  console.log('🔍 Chatwoot Config Debug:');
  console.log('  API_URL:', apiUrl);
  console.log('  API_TOKEN:', apiToken ? `${apiToken.substring(0, 8)}...` : 'missing');
  console.log('  ACCOUNT_ID:', accountId);

  if (!apiUrl || !apiToken || !accountId) {
    console.warn('❌ Chatwoot credentials missing. Set CHATWOOT_API_URL, CHATWOOT_API_TOKEN, and CHATWOOT_ACCOUNT_ID in .env');
    return null;
  }

  cachedClient = new ChatwootClient({
    apiUrl,
    apiToken,
    accountId: parseInt(accountId, 10),
  });

  console.log('✅ Chatwoot client created successfully');
  return cachedClient;
}
