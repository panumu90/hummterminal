import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Clock } from "lucide-react";

interface CXAnalyticsWidgetProps {
  accountId: number | null;
}

export default function CXAnalyticsWidget({ accountId }: CXAnalyticsWidgetProps) {
  // Mock analytics data
  const analytics = {
    totalConversations: 1247,
    avgResponseTime: "2m 34s",
    customerSatisfaction: 94,
    activeAgents: 12
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
        {accountId && (
          <span className="text-sm text-white/60">Account ID: {accountId}</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Conversations */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Total Conversations
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.totalConversations}</div>
            <p className="text-xs text-green-400 mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        {/* Avg Response Time */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Avg Response Time
            </CardTitle>
            <Clock className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.avgResponseTime}</div>
            <p className="text-xs text-green-400 mt-1">
              -18% faster
            </p>
          </CardContent>
        </Card>

        {/* Customer Satisfaction */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Customer Satisfaction
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.customerSatisfaction}%</div>
            <p className="text-xs text-green-400 mt-1">
              +3% improvement
            </p>
          </CardContent>
        </Card>

        {/* Active Agents */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Active Agents
            </CardTitle>
            <Users className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.activeAgents}</div>
            <p className="text-xs text-white/60 mt-1">
              Online now
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for more detailed analytics */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-white/60">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Detailed analytics coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
