import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useLocation, Link } from "wouter";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AnalyticsData {
  id: string;
  name: string;
  ownerId: string;
  dataPoints: number;
  visualizations: number;
  insights: number;
  features: string[];
}

export default function AnalyticsDashboard() {
  const params = useParams();
  const [location] = useLocation();
  const dashboardId = params.dashboardId || location.split('/analytics/')[1];
  
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['/api/buildings'],
    select: (buildings: any[]) => {
      const dashboard = buildings.find(b => b.id === dashboardId && b.moduleConfig?.type === 'analytics_dashboard');
      if (!dashboard) return null;
      
      return {
        id: dashboard.id,
        name: dashboard.name,
        ownerId: dashboard.ownerId,
        dataPoints: dashboard.resources?.data_points || 0,
        visualizations: dashboard.resources?.visualizations || 0,
        insights: dashboard.resources?.insights || 0,
        features: dashboard.moduleConfig?.features || []
      };
    }
  });

  const { data: cityMetrics } = useQuery({
    queryKey: ['/api/city/metrics']
  });

  const { data: agents } = useQuery({
    queryKey: ['/api/agents']
  });

  const { data: buildings } = useQuery({
    queryKey: ['/api/buildings']
  });

  if (isLoading) return <div className="p-8">Loading Analytics Dashboard...</div>;
  if (error) return <div className="p-8 text-red-500">Error loading dashboard</div>;
  if (!dashboardData) return <div className="p-8">Analytics Dashboard not found</div>;

  // Generate trend data for visualization
  const trendData = Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i + 1}`,
    consciousness: Math.floor(Math.random() * 100) + 300,
    socialBonds: Math.floor(Math.random() * 50) + 250,
    buildings: Math.floor(Math.random() * 10) + 85
  }));

  const agentTypeData = agents ? [
    { type: 'Generator', count: agents.filter(a => a.type === 'Generator').length },
    { type: 'Manifesting Generator', count: agents.filter(a => a.type === 'Manifesting Generator').length },
    { type: 'Projector', count: agents.filter(a => a.type === 'Projector').length },
    { type: 'Manifestor', count: agents.filter(a => a.type === 'Manifestor').length },
    { type: 'Reflector', count: agents.filter(a => a.type === 'Reflector').length }
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {dashboardData.name}
          </h1>
          <p className="text-xl text-gray-300">Advanced Analytics for City Performance and Agent Behavior</p>
          <nav className="flex flex-wrap justify-center gap-2 mt-6">
            <Link href="/"><Button variant="outline" size="sm" className="border-blue-400 text-blue-400 hover:bg-blue-900/30">🏠 Home</Button></Link>
            <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-blue-900/30">Data Visualization</Button>
            <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-blue-900/30">Trend Analysis</Button>
            <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-blue-900/30">Performance Metrics</Button>
            <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-blue-900/30">Predictive Analytics</Button>
          </nav>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-400 text-sm">Data Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboardData.dataPoints.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-400 text-sm">Visualizations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboardData.visualizations}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-purple-400 text-sm">Insights Generated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboardData.insights}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-yellow-400 text-sm">City Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{cityMetrics?.culturalHarmony?.toFixed(1) || "0"}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trend Chart */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-cyan-400">City Metrics Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Line type="monotone" dataKey="consciousness" stroke="#60A5FA" strokeWidth={2} />
                  <Line type="monotone" dataKey="socialBonds" stroke="#34D399" strokeWidth={2} />
                  <Line type="monotone" dataKey="buildings" stroke="#FBBF24" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Agent Distribution */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-pink-400">Agent Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={agentTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="type" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Bar dataKey="count" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-orange-400">Analytics Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {dashboardData.features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-200">{feature}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Data Feed */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-emerald-400">Live City Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400">{agents?.length || 0}</div>
                <div className="text-sm text-gray-400">Active Agents</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{buildings?.length || 0}</div>
                <div className="text-sm text-gray-400">Total Buildings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{cityMetrics?.collectiveIntelligence?.toFixed(0) || "0"}</div>
                <div className="text-sm text-gray-400">Collective Intelligence</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">{cityMetrics?.economicActivity?.toFixed(0) || "0"}</div>
                <div className="text-sm text-gray-400">Economic Activity</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-400">{cityMetrics?.population || 0}</div>
                <div className="text-sm text-gray-400">Population</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}