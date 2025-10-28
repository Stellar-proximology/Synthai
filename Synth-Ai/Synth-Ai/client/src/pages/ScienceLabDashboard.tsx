import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useLocation, Link } from "wouter";

interface ScienceLabData {
  id: string;
  name: string;
  ownerId: string;
  ownerName?: string;
  experiments: number;
  discoveries: number;
  researchData: number;
  cityHealth?: number;
  agentCount?: number;
  buildingCount?: number;
  features: string[];
}

export default function ScienceLabDashboard() {
  const params = useParams();
  const [location] = useLocation();
  const labId = params.labId || location.split('/lab/')[1];
  
  const { data: labData, isLoading, error } = useQuery({
    queryKey: ['/api/buildings'],
    select: (buildings: any[]) => {
      console.log('Looking for lab ID:', labId);
      console.log('Available buildings:', buildings.map(b => ({ id: b.id, name: b.name, type: b.moduleConfig?.type })));
      
      const lab = buildings.find(b => b.id === labId && b.moduleConfig?.type === 'science_lab');
      if (!lab) {
        console.log('Lab not found for ID:', labId);
        return null;
      }
      
      console.log('Found lab:', lab);
      return {
        id: lab.id,
        name: lab.name,
        ownerId: lab.ownerId,
        experiments: lab.resources?.experiments || 0,
        discoveries: lab.resources?.discoveries || 0,
        researchData: lab.resources?.research_data || 0,
        features: lab.moduleConfig?.features || []
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-deep-space via-cosmic-void to-deep-space p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-neon-green/20 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-32 bg-electric/20 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!labData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-deep-space via-cosmic-void to-deep-space p-6 flex items-center justify-center">
        <Card className="glass-panel border-electric">
          <CardContent className="p-6 text-center">
            <h2 className="font-orbitron text-xl text-electric mb-2">Science Lab Not Found</h2>
            <p className="text-gray-400">Lab ID: {labId}</p>
            <p className="text-gray-400">This Science Lab Dashboard does not exist or has been archived.</p>
            {error && <p className="text-red-400 text-sm mt-2">Error: {String(error)}</p>}
          </CardContent>
        </Card>
      </div>
    );
  }

  const ownerAgent = agents?.find((a: any) => a.id === labData.ownerId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-space via-cosmic-void to-deep-space p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-orbitron text-3xl font-bold text-neon-green mb-2" data-testid="lab-title">
            {labData.name}
          </h1>
          <p className="text-gray-400">
            Created by <span className="text-electric font-medium">{ownerAgent?.name || 'Unknown Agent'}</span>
            {ownerAgent && (
              <span className="ml-2 text-amber">({ownerAgent.type} • {ownerAgent.element})</span>
            )}
          </p>
          <nav className="flex flex-wrap justify-center gap-2 mt-6">
            <Link href="/"><Button variant="outline" size="sm" className="border-cyan-400 text-cyan-400 hover:bg-cyan-900/30">🏠 Home</Button></Link>
            <Button variant="ghost" size="sm" className="text-cyan-400 hover:bg-cyan-900/30">City Health</Button>
            <Button variant="ghost" size="sm" className="text-cyan-400 hover:bg-cyan-900/30">Agent Tracker</Button>
            <Button variant="ghost" size="sm" className="text-cyan-400 hover:bg-cyan-900/30">Building Analytics</Button>
            <Button variant="ghost" size="sm" className="text-cyan-400 hover:bg-cyan-900/30">Research Data</Button>
          </nav>
          <p className="text-sm text-gray-500 mt-1">
            Watch Synthia's social experiment: city health, agent interactions, builds.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* City Health */}
          <Card className="glass-panel border-neon-green/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-neon-green font-orbitron text-sm">City Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-2" data-testid="city-health">
                {Math.round((cityMetrics?.economicActivity || 0) / 10)}%
              </div>
              <div className="w-full bg-deep-space rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-neon-green to-electric h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (cityMetrics?.economicActivity || 0) / 10)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Agent Count */}
          <Card className="glass-panel border-electric/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-electric font-orbitron text-sm">Active Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white" data-testid="agent-count">
                {agents?.length || 0}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Scientists: {agents?.filter((a: any) => a.isScientist).length || 0}
              </div>
            </CardContent>
          </Card>

          {/* Building Count */}
          <Card className="glass-panel border-amber/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-amber font-orbitron text-sm">Buildings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white" data-testid="building-count">
                {buildings?.length || 0}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Science Labs: {buildings?.filter((b: any) => b.moduleConfig?.type === 'science_lab').length || 0}
              </div>
            </CardContent>
          </Card>

          {/* Research Data */}
          <Card className="glass-panel border-hot-pink/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-hot-pink font-orbitron text-sm">Research Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white" data-testid="research-data">
                {labData.researchData}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Experiments: {labData.experiments} • Discoveries: {labData.discoveries}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Agent Interaction Tracker */}
          <Card className="glass-panel border-cyber-blue/30">
            <CardHeader>
              <CardTitle className="text-cyber-blue font-orbitron">Agent Interaction Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {agents?.slice(0, 5).map((agent: any) => (
                  <div key={agent.id} className="flex items-center justify-between p-2 bg-cyber-blue/10 rounded">
                    <div>
                      <div className="font-medium text-white text-sm">{agent.name}</div>
                      <div className="text-xs text-gray-400">{agent.type} • {agent.element}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-cyber-blue text-sm font-mono">
                        {Math.round(agent.consciousness * 100)}%
                      </div>
                      <div className="text-xs text-gray-400">Consciousness</div>
                    </div>
                  </div>
                )) || (
                  <div className="text-gray-400 text-center py-4">No agent data available</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Building Analytics */}
          <Card className="glass-panel border-neon-green/30">
            <CardHeader>
              <CardTitle className="text-neon-green font-orbitron">Building Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['farm', 'research', 'trading', 'theater', 'social'].map(type => {
                  const count = buildings?.filter((b: any) => b.type === type).length || 0;
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-gray-300 capitalize">{type.replace('_', ' ')}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-deep-space rounded-full h-2">
                          <div 
                            className="bg-neon-green h-2 rounded-full"
                            style={{ width: `${Math.min(100, (count / Math.max(1, buildings?.length || 1)) * 100)}%` }}
                          />
                        </div>
                        <span className="text-neon-green font-mono text-sm w-8 text-right">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Features List */}
        <Card className="glass-panel border-electric/30">
          <CardHeader>
            <CardTitle className="text-electric font-orbitron">Dashboard Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {labData.features.map((feature, index) => (
                <div 
                  key={index}
                  className="p-3 bg-electric/10 border border-electric/30 rounded-lg text-center"
                >
                  <div className="text-electric text-sm font-medium">{feature}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}