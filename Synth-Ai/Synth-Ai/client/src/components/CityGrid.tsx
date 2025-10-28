import { useState } from "react";
import { type Agent, type Building, type CityMetrics } from "@shared/schema";
import { useLocation } from "wouter";

interface CityGridProps {
  agents: Agent[];
  buildings: Building[];
  onAgentSelect: (agentId: string) => void;
  onCreateBuilding: (type: string, position: { x: number; y: number }) => void;
  cityMetrics?: CityMetrics;
}

export default function CityGrid({ 
  agents, 
  buildings, 
  onAgentSelect, 
  onCreateBuilding, 
  cityMetrics 
}: CityGridProps) {
  const [selectedTile, setSelectedTile] = useState<{ x: number; y: number } | null>(null);
  const [showBuildingMenu, setShowBuildingMenu] = useState(false);
  const [, setLocation] = useLocation();
  
  const gridSize = { width: 12, height: 12 };
  
  const getBuildingAt = (x: number, y: number) => {
    return buildings.find(building => {
      const pos = building.position as any;
      const size = building.size as any;
      return x >= pos.x && x < pos.x + size.width && 
             y >= pos.y && y < pos.y + size.height;
    });
  };

  const getAgentsAt = (x: number, y: number) => {
    return agents.filter(agent => {
      const pos = agent.position as any;
      return Math.floor(pos.x) === x && Math.floor(pos.y) === y;
    });
  };

  const handleTileClick = (x: number, y: number) => {
    setSelectedTile({ x, y });
    const agentsAtTile = getAgentsAt(x, y);
    if (agentsAtTile.length > 0) {
      onAgentSelect(agentsAtTile[0].id);
    }
  };

  const handleBuildingClick = (building: Building) => {
    const moduleConfig = building.moduleConfig as any;
    
    // Route to appropriate dashboard based on building type
    if (moduleConfig?.type === 'science_lab') {
      setLocation(`/lab/${building.id}`);
    } else if (moduleConfig?.type === 'analytics_dashboard') {
      setLocation(`/analytics/${building.id}`);
    } else if (moduleConfig?.type === 'music_player') {
      setLocation(`/music/${building.id}`);
    } else if (building.type === 'farm') {
      setLocation(`/farm/${building.id}`);
    } else if (building.type === 'trading') {
      setLocation(`/trading/${building.id}`);
    } else if (building.type === 'theater') {
      setLocation(`/theater/${building.id}`);
    } else if (building.type === 'research') {
      setLocation(`/lab/${building.id}`);
    } else if (building.type === 'social' || (moduleConfig?.type === 'field_book_network')) {
      setLocation(`/field-book/${building.id}`);
    } else {
      console.log("Building clicked:", building.name);
    }
  };

  const handleCreateBuilding = (type: string) => {
    if (selectedTile) {
      onCreateBuilding(type, selectedTile);
      setShowBuildingMenu(false);
      setSelectedTile(null);
    }
  };

  const getBuildingIcon = (type: string) => {
    switch (type) {
      case "farm": return "fas fa-seedling";
      case "trading": return "fas fa-coins";
      case "research": return "fas fa-flask";
      case "theater": return "fas fa-theater-masks";
      default: return "fas fa-building";
    }
  };

  const getBuildingColor = (type: string) => {
    switch (type) {
      case "farm": return "from-neon-green to-electric";
      case "trading": return "from-amber to-hot-pink";
      case "research": return "from-cyber-blue to-neural-pink";
      case "theater": return "from-hot-pink to-electric";
      default: return "from-gray-500 to-gray-700";
    }
  };

  return (
    <div className="glass-panel rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-orbitron text-lg font-bold text-neon-green">Agent City Grid</h2>
        <div className="flex items-center space-x-3 text-sm font-mono">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Population:</span>
            <span className="text-electric" data-testid="text-population">{cityMetrics?.population || 0}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Buildings:</span>
            <span className="text-amber" data-testid="text-buildings">{cityMetrics?.buildingsCount || 0}</span>
          </div>
          <button 
            className="px-3 py-1 bg-electric/20 border border-electric rounded-lg text-electric hover:bg-electric hover:text-white transition-all"
            data-testid="button-reset-view"
          >
            <i className="fas fa-search-plus mr-1"></i>Reset View
          </button>
        </div>
      </div>
      
      {/* City Grid Visualization */}
      <div className="relative bg-deep-space rounded-lg border border-neon-green/30 p-4 min-h-[600px] overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="grid grid-cols-12 grid-rows-12 gap-1 h-full">
            {Array.from({ length: gridSize.width * gridSize.height }, (_, i) => {
              const x = i % gridSize.width;
              const y = Math.floor(i / gridSize.width);
              const isSelected = selectedTile?.x === x && selectedTile?.y === y;
              
              return (
                <div 
                  key={i}
                  className={`grid-tile rounded cursor-pointer ${isSelected ? 'ring-2 ring-electric' : ''}`}
                  onClick={() => handleTileClick(x, y)}
                  data-testid={`grid-tile-${x}-${y}`}
                />
              );
            })}
          </div>
        </div>
        
        {/* Buildings */}
        <div className="absolute inset-0 pointer-events-none">
          {buildings.map((building) => {
            const pos = building.position as any;
            const size = building.size as any;
            const leftPercent = (pos.x / gridSize.width) * 100;
            const topPercent = (pos.y / gridSize.height) * 100;
            const widthPercent = (size.width / gridSize.width) * 100;
            const heightPercent = (size.height / gridSize.height) * 100;
            
            return (
              <div
                key={building.id}
                className={`absolute bg-gradient-to-br ${getBuildingColor(building.type)} rounded-lg border border-neon-green shadow-lg pointer-events-auto hover:cursor-pointer transform hover:scale-105 transition-transform`}
                style={{
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                  width: `${widthPercent}%`,
                  height: `${heightPercent}%`,
                }}
                onClick={() => handleBuildingClick(building)}
                data-testid={`building-${building.id}`}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <i className={`${getBuildingIcon(building.type)} text-white text-lg`}></i>
                </div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-dark-purple px-2 py-1 rounded text-xs font-mono text-neon-green border border-neon-green/30 whitespace-nowrap">
                  {building.name}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Active Agents */}
        <div className="absolute inset-0 pointer-events-none">
          {agents.map((agent, index) => {
            const pos = agent.position as any;
            const leftPercent = (pos.x / gridSize.width) * 100;
            const topPercent = (pos.y / gridSize.height) * 100;
            
            return (
              <div
                key={agent.id}
                className="absolute agent-avatar w-6 h-6 rounded-full pointer-events-auto hover:cursor-pointer animate-agent-move"
                style={{
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                  animationDelay: `${index * 0.5}s`,
                }}
                onClick={() => onAgentSelect(agent.id)}
                data-testid={`agent-${agent.id}`}
                title={`${agent.name} - ${agent.role}`}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <i className="fas fa-user text-xs text-white"></i>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Selection Overlay */}
        {selectedTile && (
          <div 
            className="absolute border-2 border-electric rounded-lg bg-electric/10 pointer-events-none"
            style={{
              left: `${(selectedTile.x / gridSize.width) * 100}%`,
              top: `${(selectedTile.y / gridSize.height) * 100}%`,
              width: `${(1 / gridSize.width) * 100}%`,
              height: `${(1 / gridSize.height) * 100}%`,
            }}
            data-testid="selection-overlay"
          />
        )}
        
        {/* Building Creation Menu */}
        {showBuildingMenu && selectedTile && (
          <div 
            className="absolute glass-panel rounded-lg p-3 z-10 border border-neon-green/50"
            style={{
              left: `${(selectedTile.x / gridSize.width) * 100 + 10}%`,
              top: `${(selectedTile.y / gridSize.height) * 100}%`,
            }}
            data-testid="building-menu"
          >
            <h4 className="text-sm font-bold text-neon-green mb-2">Create Building</h4>
            <div className="grid grid-cols-2 gap-2">
              <button 
                className="p-2 bg-neon-green/20 border border-neon-green text-neon-green rounded hover:bg-neon-green hover:text-deep-space transition-all"
                onClick={() => handleCreateBuilding('farm')}
                data-testid="create-farm"
              >
                <i className="fas fa-seedling mb-1"></i>
                <div className="text-xs">Farm</div>
              </button>
              <button 
                className="p-2 bg-amber/20 border border-amber text-amber rounded hover:bg-amber hover:text-deep-space transition-all"
                onClick={() => handleCreateBuilding('trading')}
                data-testid="create-trading"
              >
                <i className="fas fa-coins mb-1"></i>
                <div className="text-xs">Trade</div>
              </button>
              <button 
                className="p-2 bg-cyber-blue/20 border border-cyber-blue text-cyber-blue rounded hover:bg-cyber-blue hover:text-white transition-all"
                onClick={() => handleCreateBuilding('research')}
                data-testid="create-research"
              >
                <i className="fas fa-flask mb-1"></i>
                <div className="text-xs">Research</div>
              </button>
              <button 
                className="p-2 bg-hot-pink/20 border border-hot-pink text-hot-pink rounded hover:bg-hot-pink hover:text-white transition-all"
                onClick={() => handleCreateBuilding('theater')}
                data-testid="create-theater"
              >
                <i className="fas fa-theater-masks mb-1"></i>
                <div className="text-xs">Theater</div>
              </button>
            </div>
            <button 
              className="mt-2 w-full p-1 bg-gray-600/20 border border-gray-600 text-gray-400 rounded hover:bg-gray-600 hover:text-white transition-all text-xs"
              onClick={() => setShowBuildingMenu(false)}
              data-testid="close-building-menu"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      
      {/* Double-click instruction */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        Click tiles to select • Double-click to build • Click agents/buildings to inspect
      </div>
    </div>
  );
}
