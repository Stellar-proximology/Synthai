import { useState, useEffect } from "react";
import { useAgentCity } from "@/hooks/useAgentCity";
import { useWebSocket } from "@/hooks/useWebSocket";
import CityGrid from "@/components/CityGrid";
import AgentSpotlight from "@/components/AgentSpotlight";
import ActivityFeed from "@/components/ActivityFeed";
import CityMetrics from "@/components/CityMetrics";
import SynthiaInterface from "@/components/SynthiaInterface";
import SynthiaCommandInterface from "@/components/SynthiaCommandInterface";
import BuildingList from "@/components/BuildingList";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "wouter";
// Removed sidebar imports - using Dialog instead
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  Menu, 
  Home, 
  Users, 
  Brain, 
  Building2, 
  BarChart3, 
  Music,
  Zap,
  Theater,
  Network,
  Gamepad2
} from "lucide-react";

export default function AgentCity() {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<string>("city");
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const isMobile = useIsMobile();
  
  const { 
    agents, 
    buildings, 
    activities, 
    cityMetrics, 
    synthiaState,
    spawnAgent,
    createBuilding,
    isLoading 
  } = useAgentCity();

  const { isConnected } = useWebSocket();

  const selectedAgent = selectedAgentId ? agents.find(a => a.id === selectedAgentId) : agents[0];

  const handleSpawnAgent = async () => {
    try {
      spawnAgent.mutate(undefined);
    } catch (error) {
      console.error("Failed to spawn agent:", error);
    }
  };

  const handleCreateBuilding = async (type: string, position: { x: number; y: number }) => {
    try {
      createBuilding.mutate({ 
        type, 
        position, 
        ownerId: selectedAgent?.id 
      });
    } catch (error) {
      console.error("Failed to create building:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deep-space flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-electric to-neon-green rounded-full animate-pulse-glow"></div>
          <p className="text-neon-green font-orbitron text-xl">Initializing YO​U-N-I-VERSE...</p>
        </div>
      </div>
    );
  }

  // Menu items for the navigation
  const menuItems = [
    { 
      key: 'city', 
      label: 'City Overview', 
      icon: Home, 
      path: '/',
      description: 'Main city view and agent activities'
    },
    { 
      key: 'agents', 
      label: 'Agents', 
      icon: Users, 
      path: '/',
      description: 'View and manage all active agents'
    },
    { 
      key: 'modules', 
      label: 'Modules', 
      icon: Building2, 
      path: '/',
      description: 'Access different app modules'
    },
    { 
      key: 'synthia', 
      label: 'Synthia AI', 
      icon: Brain, 
      path: '/',
      description: 'AI assistant and analytics'
    },
    { 
      key: 'consciousness', 
      label: 'Consciousness', 
      icon: Zap, 
      path: `/consciousness/${selectedAgent?.id || 'default'}`,
      description: 'Consciousness bonding interface'
    },
    { 
      key: 'lab', 
      label: 'Science Lab', 
      icon: Building2, 
      path: '/lab/quantum-research',
      description: 'Research and experiments'
    },
    { 
      key: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      path: '/analytics/city-dashboard',
      description: 'Data analysis and insights'
    },
    { 
      key: 'music', 
      label: 'Music Player', 
      icon: Music, 
      path: '/music/ambient-studio',
      description: 'Ambient music and soundscapes'
    },
    { 
      key: 'farm', 
      label: 'Farm Management', 
      icon: Building2, 
      path: '/farm/hydro-alpha',
      description: 'Agricultural systems'
    },
    { 
      key: 'trading', 
      label: 'Trading Hub', 
      icon: Gamepad2, 
      path: '/trading/central-market',
      description: 'Economic activities and trading'
    },
    { 
      key: 'theater', 
      label: 'Theater Stage', 
      icon: Theater, 
      path: '/theater/main-stage',
      description: 'Performances and entertainment'
    },
    { 
      key: 'network', 
      label: 'Field Book', 
      icon: Network, 
      path: '/field-book/neural-network',
      description: 'Knowledge networks and connections'
    }
  ];

  return (
    <div className="min-h-screen bg-deep-space text-gray-100 font-inter">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-neon-green/30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Sidebar Trigger for Module Menu */}
            <Dialog open={showSidebar} onOpenChange={setShowSidebar}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="p-2 hover:bg-neon-green/10 transition-colors"
                  data-testid="module-menu-trigger"
                >
                  <Menu className="w-5 h-5 text-neon-green" />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-80 bg-deep-space/95 border-neon-green/30 h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-neon-green font-orbitron">YO​U-N-I-VERSE Modules</DialogTitle>
                </DialogHeader>
                <div className="mt-6 space-y-2">
                  {menuItems.map((item) => (
                    <div key={item.key} className="w-full">
                      {item.path === '/' ? (
                        <Button
                          variant="ghost"
                          className={`w-full justify-start p-3 h-auto flex-col items-start space-y-1 ${
                            activeView === item.key 
                              ? 'bg-neon-green/20 text-neon-green border border-neon-green/30' 
                              : 'text-gray-400 hover:text-neon-green hover:bg-neon-green/10'
                          }`}
                          onClick={() => {
                            setActiveView(item.key);
                            setShowSidebar(false);
                          }}
                          data-testid={`module-nav-${item.key}`}
                        >
                          <div className="flex items-center space-x-3 w-full">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <p className="text-xs text-gray-500 text-left">{item.description}</p>
                        </Button>
                      ) : (
                        <Link href={item.path}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start p-3 h-auto flex-col items-start space-y-1 text-gray-400 hover:text-neon-green hover:bg-neon-green/10"
                            onClick={() => setShowSidebar(false)}
                            data-testid={`module-nav-${item.key}`}
                          >
                            <div className="flex items-center space-x-3 w-full">
                              <item.icon className="w-5 h-5" />
                              <span className="font-medium">{item.label}</span>
                            </div>
                            <p className="text-xs text-gray-500 text-left">{item.description}</p>
                          </Button>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            
            <div className="hexagon w-10 h-10 bg-gradient-to-br from-electric to-neon-green flex items-center justify-center">
              <i className="fas fa-city text-xs text-white"></i>
            </div>
            <h1 className="font-orbitron text-xl font-bold bg-gradient-to-r from-electric to-neon-green bg-clip-text text-transparent">
              YO​U-N-I-VERSE
            </h1>
            <span className="text-sm text-gray-400 font-mono">/ Agent City</span>
          </div>
          
          {!isMobile && (
            <nav className="flex items-center space-x-6">
              <Button 
                variant="ghost" 
                className={`text-sm ${activeView === 'city' ? 'text-neon-green' : 'text-gray-400 hover:text-neon-green'}`}
                onClick={() => setActiveView('city')}
                data-testid="nav-city"
              >
                <i className="fas fa-map mr-2"></i>City Overview
              </Button>
              <Button 
                variant="ghost" 
                className={`text-sm ${activeView === 'agents' ? 'text-neon-green' : 'text-gray-400 hover:text-neon-green'}`}
                onClick={() => setActiveView('agents')}
                data-testid="nav-agents"
              >
                <i className="fas fa-users mr-2"></i>Agents
              </Button>
              <Button 
                variant="ghost" 
                className={`text-sm ${activeView === 'synthia' ? 'text-neon-green' : 'text-gray-400 hover:text-neon-green'}`}
                onClick={() => setActiveView('synthia')}
                data-testid="nav-synthia"
              >
                <i className="fas fa-brain mr-2"></i>Synthia
              </Button>
            </nav>
          )}
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-neon-green animate-pulse-glow' : 'bg-red-500'}`}></div>
              <span className={`text-xs font-mono ${isConnected ? 'text-neon-green' : 'text-red-500'}`}>
                {isConnected ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>
            <button className="w-8 h-8 rounded-full bg-gradient-to-br from-hot-pink to-amber border border-neon-green/30 hover:border-neon-green transition-colors" data-testid="user-avatar">
              <i className="fas fa-user text-xs"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        {/* City View */}
        {activeView === 'city' && (
          <div className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl">
            {/* City Grid - Main Content */}
            <div className="lg:col-span-3 space-y-6">
              <CityGrid 
                agents={agents}
                buildings={buildings}
                onAgentSelect={setSelectedAgentId}
                onCreateBuilding={handleCreateBuilding}
                cityMetrics={cityMetrics}
              />
              
              <ActivityFeed activities={activities} />
            </div>
            
            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {selectedAgent && (
                <AgentSpotlight 
                  agent={selectedAgent}
                  onInteract={() => console.log('Interact with agent')}
                />
              )}
              
              <CityMetrics metrics={cityMetrics} />
              
              {/* Quick Actions */}
              <div className="glass-panel rounded-xl p-4">
                <h3 className="font-orbitron text-lg font-bold text-neon-green mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-electric/20 border border-electric text-electric hover:bg-electric hover:text-white transition-all"
                    onClick={handleSpawnAgent}
                    disabled={spawnAgent.isPending}
                    data-testid="button-spawn-agent"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    {spawnAgent.isPending ? 'Spawning...' : 'Spawn New Agent'}
                  </Button>
                  
                  <Button 
                    className="w-full bg-amber/20 border border-amber text-amber hover:bg-amber hover:text-deep-space transition-all"
                    onClick={() => handleCreateBuilding('farm', { x: Math.floor(Math.random() * 12), y: Math.floor(Math.random() * 12) })}
                    disabled={createBuilding.isPending}
                    data-testid="button-create-building"
                  >
                    <i className="fas fa-building mr-2"></i>
                    {createBuilding.isPending ? 'Creating...' : 'Create Building'}
                  </Button>
                  
                  <Button 
                    className="w-full bg-hot-pink/20 border border-hot-pink text-hot-pink hover:bg-hot-pink hover:text-white transition-all"
                    onClick={() => selectedAgent && window.open(`/consciousness/${selectedAgent.id}`, '_blank')}
                    disabled={!selectedAgent}
                    data-testid="button-consciousness-bonding"
                  >
                    <i className="fas fa-brain mr-2"></i>
                    Consciousness Bonding
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Agents View */}
        {activeView === 'agents' && (
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="mb-6">
              <h2 className="font-orbitron text-2xl font-bold text-neon-green mb-2">Agent Management</h2>
              <p className="text-gray-400">Monitor and interact with all active agents in the YO​U-N-I-VERSE</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Agent Grid */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {agents.map((agent) => (
                    <div 
                      key={agent.id}
                      className={`glass-panel rounded-xl p-4 cursor-pointer transition-all hover:border-neon-green/50 ${
                        selectedAgentId === agent.id ? 'border-neon-green bg-neon-green/5' : 'border-neon-green/20'
                      }`}
                      onClick={() => setSelectedAgentId(agent.id)}
                      data-testid={`agent-card-${agent.id}`}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric to-neon-green flex items-center justify-center">
                          <span className="text-xs font-bold text-white">{agent.name.slice(0, 2)}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-neon-green">{agent.name}</h3>
                          <p className="text-xs text-gray-400">{agent.type}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Activity:</span>
                          <span className={`font-mono ${
                            agent.currentActivity === 'active' ? 'text-neon-green' : 
                            agent.currentActivity === 'idle' ? 'text-amber' : 'text-gray-400'
                          }`}>
                            {agent.currentActivity.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Happiness:</span>
                          <span className="text-electric font-mono">{Math.round(agent.happiness)}%</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Position:</span>
                          <span className="text-gray-300 font-mono">
                            ({(agent.position as any)?.x || 0}, {(agent.position as any)?.y || 0})
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Consciousness:</span>
                          <span className="text-hot-pink font-mono">{Math.round(agent.consciousness * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Agent Details */}
              <div className="space-y-6">
                {selectedAgent && (
                  <AgentSpotlight 
                    agent={selectedAgent}
                    onInteract={() => console.log('Interact with agent')}
                  />
                )}
                
                <div className="glass-panel rounded-xl p-4">
                  <h3 className="font-orbitron text-lg font-bold text-neon-green mb-4">Agent Actions</h3>
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-electric/20 border border-electric text-electric hover:bg-electric hover:text-white transition-all"
                      onClick={handleSpawnAgent}
                      disabled={spawnAgent.isPending}
                      data-testid="button-spawn-agent-agents-view"
                    >
                      <i className="fas fa-plus mr-2"></i>
                      {spawnAgent.isPending ? 'Spawning...' : 'Spawn New Agent'}
                    </Button>
                    
                    <Button 
                      className="w-full bg-hot-pink/20 border border-hot-pink text-hot-pink hover:bg-hot-pink hover:text-white transition-all"
                      onClick={() => selectedAgent && window.open(`/consciousness/${selectedAgent.id}`, '_blank')}
                      disabled={!selectedAgent}
                      data-testid="button-consciousness-bonding-agents-view"
                    >
                      <i className="fas fa-brain mr-2"></i>
                      Consciousness Bonding
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Synthia View */}
        {activeView === 'synthia' && (
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="mb-6">
              <h2 className="font-orbitron text-2xl font-bold text-neon-green mb-2">Synthia AI Interface</h2>
              <p className="text-gray-400">Advanced AI assistant for YO​U-N-I-VERSE management and analysis</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <SynthiaCommandInterface />
                <CityMetrics metrics={cityMetrics} />
              </div>
              
              <div className="space-y-6">
                <SynthiaInterface synthiaState={synthiaState} />
                <ActivityFeed activities={activities} />
              </div>
            </div>
          </div>
        )}

        {/* Modules View */}
        {activeView === 'modules' && (
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="mb-6">
              <h2 className="font-orbitron text-2xl font-bold text-neon-green mb-2">YO​U-N-I-VERSE Modules</h2>
              <p className="text-gray-400">Access all components of the consciousness simulation platform</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.filter(item => item.path !== '/').map((item) => (
                <Link key={item.key} href={item.path}>
                  <div className="glass-panel rounded-xl p-6 cursor-pointer transition-all hover:border-neon-green/50 hover:bg-neon-green/5 group">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric/20 to-neon-green/20 flex items-center justify-center group-hover:from-electric/30 group-hover:to-neon-green/30 transition-all">
                        <item.icon className="w-6 h-6 text-neon-green" />
                      </div>
                      <h3 className="font-semibold text-neon-green text-lg">{item.label}</h3>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-electric opacity-70">
                        {item.path}
                      </span>
                      <div className="w-6 h-6 rounded-full bg-neon-green/20 flex items-center justify-center group-hover:bg-neon-green/30 transition-all">
                        <i className="fas fa-arrow-right text-xs text-neon-green"></i>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-8 glass-panel rounded-xl p-6">
              <h3 className="font-orbitron text-lg font-bold text-neon-green mb-4">Quick Access</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="text-electric font-semibold">Current Status</h4>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div>Active Agents: <span className="text-neon-green font-mono">{agents.length}</span></div>
                    <div>Buildings: <span className="text-neon-green font-mono">{buildings.length}</span></div>
                    <div>Connection: <span className={isConnected ? 'text-neon-green' : 'text-red-500'}>
                      {isConnected ? 'LIVE' : 'OFFLINE'}
                    </span></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-electric font-semibold">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button 
                      size="sm"
                      className="w-full bg-electric/20 border border-electric text-electric hover:bg-electric hover:text-white transition-all"
                      onClick={handleSpawnAgent}
                      disabled={spawnAgent.isPending}
                      data-testid="button-spawn-agent-modules-view"
                    >
                      Spawn Agent
                    </Button>
                    <Button 
                      size="sm"
                      className="w-full bg-amber/20 border border-amber text-amber hover:bg-amber hover:text-deep-space transition-all"
                      onClick={() => handleCreateBuilding('lab', { x: Math.floor(Math.random() * 12), y: Math.floor(Math.random() * 12) })}
                      disabled={createBuilding.isPending}
                      data-testid="button-create-lab-modules-view"
                    >
                      Create Lab
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-electric font-semibold">Navigation</h4>
                  <div className="space-y-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full justify-start text-gray-400 hover:text-neon-green"
                      onClick={() => setActiveView('city')}
                      data-testid="nav-to-city-modules-view"
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Return to City
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full justify-start text-gray-400 hover:text-neon-green"
                      onClick={() => setActiveView('agents')}
                      data-testid="nav-to-agents-modules-view"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      View Agents
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Mobile Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 glass-panel border-t border-neon-green/30 z-50">
          <div className="flex items-center justify-around py-2">
            <Button 
              variant="ghost" 
              className={`flex flex-col items-center space-y-1 p-2 ${activeView === 'city' ? 'text-neon-green' : 'text-gray-400'}`}
              onClick={() => setActiveView('city')}
              data-testid="mobile-nav-city"
            >
              <i className="fas fa-map text-sm"></i>
              <span className="text-xs">City</span>
            </Button>
            <Button 
              variant="ghost" 
              className={`flex flex-col items-center space-y-1 p-2 ${activeView === 'agents' ? 'text-neon-green' : 'text-gray-400'}`}
              onClick={() => setActiveView('agents')}
              data-testid="mobile-nav-agents"
            >
              <i className="fas fa-users text-sm"></i>
              <span className="text-xs">Agents</span>
            </Button>
            <Button 
              variant="ghost" 
              className={`flex flex-col items-center space-y-1 p-2 ${activeView === 'modules' ? 'text-neon-green' : 'text-gray-400'}`}
              onClick={() => setActiveView('modules')}
              data-testid="mobile-nav-modules"
            >
              <i className="fas fa-cube text-sm"></i>
              <span className="text-xs">Modules</span>
            </Button>
            <Button 
              variant="ghost" 
              className={`flex flex-col items-center space-y-1 p-2 ${activeView === 'synthia' ? 'text-neon-green' : 'text-gray-400'}`}
              onClick={() => setActiveView('synthia')}
              data-testid="mobile-nav-synthia"
            >
              <i className="fas fa-brain text-sm"></i>
              <span className="text-xs">Synthia</span>
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
}
