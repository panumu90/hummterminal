import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Download, Clock, CheckCircle, MessageSquare, TrendingUp, Users } from "lucide-react";

interface AnalyticsData {
  conversations_count: number;
  incoming_messages_count: number;
  outgoing_messages_count: number;
  avg_first_response_time: string;
  avg_resolution_time: string;
  resolutions_count: number;
}

interface AgentMetric {
  id: number;
  name: string;
  email: string;
  conversations_count: number;
  avg_first_response_time: string;
  avg_resolution_time: string;
}

interface Account {
  id: number;
  name: string;
}

interface AnalyticsDashboardProps {
  selectedAccount: number | null;
  setSelectedAccount: (id: number) => void;
  accounts: Account[];
}

export function AnalyticsDashboard({ selectedAccount, setSelectedAccount, accounts }: AnalyticsDashboardProps) {
  // Fetch analytics data
  const { data: analytics, isLoading: analyticsLoading } = useQuery<AnalyticsData>({
    queryKey: [`/api/cs-portal/accounts/${selectedAccount}/analytics`],
    enabled: !!selectedAccount,
  });

  // Fetch agent performance
  const { data: agentMetrics = [] } = useQuery<AgentMetric[]>({
    queryKey: [`/api/cs-portal/accounts/${selectedAccount}/reports/agents`],
    enabled: !!selectedAccount,
  });

  const handleExport = async () => {
    if (!selectedAccount) return;

    try {
      const res = await fetch(`/api/cs-portal/accounts/${selectedAccount}/export`);
      const data = await res.json();

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${selectedAccount}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export:', error);
    }
  };

  // Helper to format time strings
  const formatTime = (timeStr: string) => {
    if (!timeStr) return 'N/A';
    return timeStr;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1 max-w-md">
          <Label>Select Account</Label>
          <Select
            value={selectedAccount?.toString()}
            onValueChange={(value) => setSelectedAccount(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a client account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id.toString()}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedAccount && (
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        )}
      </div>

      {!selectedAccount && (
        <p className="text-muted-foreground text-center py-12">
          Select an account to view analytics
        </p>
      )}

      {selectedAccount && analyticsLoading && (
        <p className="text-muted-foreground text-center py-12">
          Loading analytics...
        </p>
      )}

      {selectedAccount && analytics && (
        <>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Total Conversations
                </CardDescription>
                <CardTitle className="text-3xl">{analytics.conversations_count || 0}</CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Avg First Response
                </CardDescription>
                <CardTitle className="text-3xl">{formatTime(analytics.avg_first_response_time)}</CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Avg Resolution Time
                </CardDescription>
                <CardTitle className="text-3xl">{formatTime(analytics.avg_resolution_time)}</CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Resolutions
                </CardDescription>
                <CardTitle className="text-3xl">{analytics.resolutions_count || 0}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Message Volume */}
          <Card>
            <CardHeader>
              <CardTitle>Message Volume</CardTitle>
              <CardDescription>Incoming vs Outgoing messages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Incoming Messages</p>
                  <p className="text-3xl font-bold">{analytics.incoming_messages_count || 0}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Outgoing Messages</p>
                  <p className="text-3xl font-bold">{analytics.outgoing_messages_count || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agent Performance */}
          {agentMetrics.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Agent Performance
                </CardTitle>
                <CardDescription>Individual agent metrics for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agentMetrics.map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">{agent.name}</p>
                        <p className="text-sm text-muted-foreground">{agent.email}</p>
                      </div>
                      <div className="flex gap-6 text-sm">
                        <div className="text-center">
                          <p className="text-muted-foreground">Conversations</p>
                          <p className="font-semibold">{agent.conversations_count || 0}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">Avg FRT</p>
                          <p className="font-semibold">{formatTime(agent.avg_first_response_time)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">Avg Resolution</p>
                          <p className="font-semibold">{formatTime(agent.avg_resolution_time)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* CX Metrics Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Service Quality Metrics
              </CardTitle>
              <CardDescription>Key CX performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Resolution Rate</p>
                  <p className="text-2xl font-bold">
                    {analytics.conversations_count > 0
                      ? Math.round((analytics.resolutions_count / analytics.conversations_count) * 100)
                      : 0}%
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Messages per Conversation</p>
                  <p className="text-2xl font-bold">
                    {analytics.conversations_count > 0
                      ? Math.round(
                          (analytics.incoming_messages_count + analytics.outgoing_messages_count) /
                          analytics.conversations_count
                        )
                      : 0}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Agent Count</p>
                  <p className="text-2xl font-bold">{agentMetrics.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
