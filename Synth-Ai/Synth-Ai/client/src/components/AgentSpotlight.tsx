import { type Agent } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface AgentSpotlightProps {
  agent: Agent;
  onInteract: () => void;
}

export default function AgentSpotlight({ agent, onInteract }: AgentSpotlightProps) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Quantum Farmer": return "fas fa-seedling";
      case "Quantum Trader": return "fas fa-coins";
      case "Consciousness Researcher": return "fas fa-flask";
      case "Quantum Performer": return "fas fa-theater-masks";
      default: return "fas fa-user";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Quantum Farmer": return "text-neon-green";
      case "Quantum Trader": return "text-amber";
      case "Consciousness Researcher": return "text-cyber-blue";
      case "Quantum Performer": return "text-hot-pink";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="glass-panel rounded-xl p-4">
      <h3 className="font-orbitron text-lg font-bold text-neon-green mb-4">Agent Spotlight</h3>
      <div className="space-y-4">
        
        {/* Agent Info */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-hot-pink to-amber rounded-full border-2 border-neon-green flex items-center justify-center">
            <i className={`${getRoleIcon(agent.role)} text-white`}></i>
          </div>
          <div>
            <h4 className="font-semibold text-white" data-testid="agent-name">{agent.name}</h4>
            <p className={`text-xs font-mono ${getRoleColor(agent.role || agent.type)}`} data-testid="agent-role">
              {agent.type || agent.role}
            </p>
            {agent.element && (
              <p className="text-xs text-amber font-mono">{agent.element} • {agent.strategy}</p>
            )}
            {agent.isScientist && (
              <span className="inline-block mt-1 px-1 py-0.5 bg-cyber-blue/20 text-cyber-blue text-xs rounded">
                Scientist
              </span>
            )}
          </div>
        </div>
        
        {/* Stats */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Consciousness:</span>
            <span className="text-electric font-mono" data-testid="agent-consciousness">
              {Math.round(agent.consciousness * 100)}%
            </span>
          </div>
          <div className="w-full bg-deep-space rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-electric to-neon-green h-2 rounded-full transition-all duration-500" 
              style={{ width: `${agent.consciousness * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Social Bond:</span>
            <span className="text-amber font-mono" data-testid="agent-social-bond">
              {Math.round(agent.socialBond * 100)}%
            </span>
          </div>
          <div className="w-full bg-deep-space rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-amber to-hot-pink h-2 rounded-full transition-all duration-500" 
              style={{ width: `${agent.socialBond * 100}%` }}
            />
          </div>
        </div>
        
        {/* Current Activity */}
        <div className="pt-2 border-t border-neon-green/30">
          <p className="text-xs text-gray-300 mb-2">Current Activity:</p>
          <p className="text-sm text-neon-green" data-testid="agent-activity">{agent.currentActivity}</p>
        </div>
        
        {/* Human Design Information */}
        {agent.glyph && (
          <div className="pt-2 border-t border-neon-green/30">
            <p className="text-xs text-gray-300 mb-2">Human Design Glyph:</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-electric">Type: {agent.glyph.type}</span>
              <span className="text-xs text-amber">Trait: {agent.glyph.trait}</span>
            </div>
          </div>
        )}

        {/* Memory Stream */}
        {agent.memoryStream && agent.memoryStream.length > 0 && (
          <div className="pt-2 border-t border-neon-green/30">
            <p className="text-xs text-gray-300 mb-2">Recent Memories:</p>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {agent.memoryStream.slice(-3).map((memory: any, index: number) => (
                <div key={index} className="text-xs text-gray-400">
                  <span className="text-neon-green">•</span> {memory.event}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personality Traits */}
        {agent.personality && Object.keys(agent.personality as any).length > 0 && (
          <div className="pt-2 border-t border-neon-green/30">
            <p className="text-xs text-gray-300 mb-2">Personality Traits:</p>
            <div className="flex flex-wrap gap-1">
              {Object.entries(agent.personality as any).map(([trait, value]) => (
                <span 
                  key={trait}
                  className="px-2 py-1 bg-electric/20 border border-electric/50 rounded text-xs text-electric"
                  data-testid={`trait-${trait}`}
                >
                  {trait}: {Math.round((value as number) * 100)}%
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Inventory */}
        {agent.inventory && Object.keys(agent.inventory as any).length > 0 && (
          <div className="pt-2 border-t border-neon-green/30">
            <p className="text-xs text-gray-300 mb-2">Inventory:</p>
            <div className="space-y-1">
              {Object.entries(agent.inventory as any).map(([item, quantity]) => (
                <div key={item} className="flex justify-between text-xs">
                  <span className="text-gray-400 capitalize">{item.replace('-', ' ')}</span>
                  <span className="text-neon-green font-mono" data-testid={`inventory-${item}`}>{quantity as number}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Relationships */}
        {agent.relationships && Object.keys(agent.relationships as any).length > 0 && (
          <div className="pt-2 border-t border-neon-green/30">
            <p className="text-xs text-gray-300 mb-2">Relationships:</p>
            <div className="space-y-1">
              {Object.entries(agent.relationships as any).slice(0, 3).map(([agentId, bond]) => (
                <div key={agentId} className="flex justify-between text-xs">
                  <span className="text-gray-400">Agent {agentId.slice(-3)}</span>
                  <span className="text-hot-pink font-mono" data-testid={`relationship-${agentId}`}>
                    {Math.round((bond as number) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button 
            className="flex-1 bg-electric/20 border border-electric text-electric hover:bg-electric hover:text-white transition-all text-sm"
            data-testid="button-inspect-agent"
          >
            <i className="fas fa-search mr-1"></i>Inspect
          </Button>
          <Button 
            className="flex-1 bg-neon-green/20 border border-neon-green text-neon-green hover:bg-neon-green hover:text-deep-space transition-all text-sm"
            onClick={onInteract}
            data-testid="button-interact-agent"
          >
            <i className="fas fa-comments mr-1"></i>Interact
          </Button>
        </div>
      </div>
    </div>
  );
}
