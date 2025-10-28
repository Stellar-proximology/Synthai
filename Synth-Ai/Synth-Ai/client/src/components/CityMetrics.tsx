import { type CityMetrics } from "@shared/schema";

interface CityMetricsProps {
  metrics?: CityMetrics;
}

export default function CityMetrics({ metrics }: CityMetricsProps) {
  if (!metrics) {
    return (
      <div className="glass-panel rounded-xl p-4">
        <h3 className="font-orbitron text-lg font-bold text-neon-green mb-4">City Metrics</h3>
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto bg-gray-600/20 rounded-full flex items-center justify-center mb-3">
            <i className="fas fa-chart-line text-gray-500"></i>
          </div>
          <p className="text-gray-500 text-sm">Loading metrics...</p>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <div className="glass-panel rounded-xl p-4">
      <h3 className="font-orbitron text-lg font-bold text-neon-green mb-4">City Metrics</h3>
      <div className="space-y-4">
        
        {/* Collective Intelligence */}
        <div className="bg-deep-space/50 rounded-lg p-3 border border-neon-green/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Collective Intelligence</span>
            <span className="text-neon-green font-mono text-sm" data-testid="metric-intelligence">
              {formatNumber(metrics.collectiveIntelligence)}
            </span>
          </div>
          <div className="w-full bg-dark-purple rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-neon-green to-electric h-2 rounded-full animate-pulse-glow transition-all duration-1000" 
              style={{ width: `${Math.min(100, (metrics.collectiveIntelligence / 5000) * 100)}%` }}
            />
          </div>
        </div>
        
        {/* Economic Activity */}
        <div className="bg-deep-space/50 rounded-lg p-3 border border-amber/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Economic Activity</span>
            <span className="text-amber font-mono text-sm" data-testid="metric-economy">
              {formatNumber(metrics.economicActivity)}
            </span>
          </div>
          <div className="w-full bg-dark-purple rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-amber to-hot-pink h-2 rounded-full transition-all duration-1000" 
              style={{ width: `${Math.min(100, (metrics.economicActivity / 200000) * 100)}%` }}
            />
          </div>
        </div>
        
        {/* Research Progress */}
        <div className="bg-deep-space/50 rounded-lg p-3 border border-cyber-blue/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Research Progress</span>
            <span className="text-cyber-blue font-mono text-sm" data-testid="metric-research">
              {metrics.researchProgress.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-dark-purple rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cyber-blue to-neural-pink h-2 rounded-full transition-all duration-1000" 
              style={{ width: `${metrics.researchProgress}%` }}
            />
          </div>
        </div>
        
        {/* Cultural Harmony */}
        <div className="bg-deep-space/50 rounded-lg p-3 border border-hot-pink/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Cultural Harmony</span>
            <span className="text-hot-pink font-mono text-sm" data-testid="metric-harmony">
              {metrics.culturalHarmony.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-dark-purple rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-hot-pink to-amber h-2 rounded-full transition-all duration-1000" 
              style={{ width: `${metrics.culturalHarmony}%` }}
            />
          </div>
        </div>
        
        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neon-green/30">
          <div className="text-center">
            <div className="text-lg font-bold text-electric" data-testid="metric-population-display">
              {metrics.population}
            </div>
            <div className="text-xs text-gray-400">Active Agents</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-amber" data-testid="metric-buildings-display">
              {metrics.buildingsCount}
            </div>
            <div className="text-xs text-gray-400">Structures</div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
