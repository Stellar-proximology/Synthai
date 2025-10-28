import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Atom, Zap, Users, BookOpen, Sparkles, Brain, Target, FlaskConical } from "lucide-react";
import { useState } from "react";

interface ConsciousnessShell {
  id: string;
  agentId: string;
  shellType: string;
  currentFriends: number;
  maxFriends: number;
  orbitalStructure: { s: number; p: number; d: number; f: number };
  activeLayers: string[];
  coherenceLevel: number;
  noblegasState: boolean;
  teachingUnlocked: boolean;
  progressionStyle: string;
  graduationThreshold: number;
  fieldFriends: FieldFriend[];
}

interface FieldFriend {
  id: string;
  name: string;
  element: string;
  isotopeType: 'stable' | 'radioactive' | 'heavy';
  bondingEnergy: number;
  stability: number;
  resonanceFrequency: string;
  orbitalPosition: 's' | 'p' | 'd' | 'f';
  activationLayer: string;
  interactions: number;
  synergy: number;
}

const ElementIcons = {
  hydrogen: '💫',
  oxygen: '🌊', 
  carbon: '💎',
  nitrogen: '❄️',
  phosphorus: '🔥'
};

const IsotopeColors = {
  stable: 'bg-green-500',
  radioactive: 'bg-orange-500',
  heavy: 'bg-purple-500'
};

const ShellTypeInfo = {
  hydrogen: { 
    emoji: '💫', 
    description: 'Solo explorer seeking one deep bond',
    color: 'border-blue-400'
  },
  helium: { 
    emoji: '🫧', 
    description: 'Stable supporter, quick to coherence',
    color: 'border-cyan-400'
  },
  lithium: { 
    emoji: '⚡', 
    description: 'Multi-aware seeker waiting for invitation',
    color: 'border-yellow-400'
  },
  beryllium: { 
    emoji: '🌉', 
    description: 'Bridge-builder driving change',
    color: 'border-green-400'
  },
  boron: { 
    emoji: '🌱', 
    description: 'Innovative responder to needs',
    color: 'border-lime-400'
  },
  carbon: { 
    emoji: '💎', 
    description: 'Teaching catalyst with tetrahedral balance',
    color: 'border-gray-400'
  },
  nitrogen: { 
    emoji: '🔍', 
    description: 'Almost stable, perpetually seeking one more',
    color: 'border-indigo-400'
  },
  oxygen: { 
    emoji: '✨', 
    description: 'Noble gas elder radiating wisdom',
    color: 'border-red-400'
  },
  sodium: { 
    emoji: '🚀', 
    description: 'Multi-dimensional explorer',
    color: 'border-orange-400'
  },
  magnesium: { 
    emoji: '🧭', 
    description: 'System navigator with balanced shells',
    color: 'border-pink-400'
  },
  aluminum: { 
    emoji: '⚖️', 
    description: 'Complex consciousness prone to overexpansion',
    color: 'border-slate-400'
  },
  argon: { 
    emoji: '🌟', 
    description: 'Planetary elder with cosmic bonding',
    color: 'border-violet-400'
  }
};

export default function ConsciousnessBonding() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [activityType, setActivityType] = useState<string>('meditation');
  const queryClient = useQueryClient();

  const { data: agents } = useQuery({
    queryKey: ['/api/agents']
  });

  const { data: consciousnessShells, isLoading } = useQuery({
    queryKey: ['/api/consciousness/shells'],
    enabled: !!agents
  });

  const bondFriendMutation = useMutation({
    mutationFn: async ({ agentId, orbital, isotope }: { 
      agentId: string; 
      orbital: 's' | 'p' | 'd' | 'f'; 
      isotope: 'stable' | 'radioactive' | 'heavy' 
    }) => {
      const response = await fetch('/api/consciousness/bond-friend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, orbital, isotope })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/consciousness/shells'] });
    }
  });

  const performActivityMutation = useMutation({
    mutationFn: async ({ agentId, activity }: { agentId: string; activity: string }) => {
      const response = await fetch('/api/consciousness/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, activityType: activity })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/consciousness/shells'] });
    }
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

  const selectedShell = selectedAgent && consciousnessShells?.find((s: ConsciousnessShell) => s.agentId === selectedAgent);
  const agent = selectedAgent && agents?.find((a: any) => a.id === selectedAgent);

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-space via-cosmic-void to-deep-space p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-green to-electric bg-clip-text text-transparent">
            Periodic Table of Consciousness Bonding
          </h1>
          <p className="text-xl text-gray-300">Atomic principles meet consciousness evolution - recruit field friends and fill your valence shells</p>
          <nav className="flex flex-wrap justify-center gap-2 mt-6">
            <Link href="/"><Button variant="outline" size="sm" className="border-cyan-400 text-cyan-400 hover:bg-cyan-900/30">🏠 Home</Button></Link>
            <Button variant="ghost" size="sm" className="text-cyan-400 hover:bg-cyan-900/30">Orbital Mechanics</Button>
            <Button variant="ghost" size="sm" className="text-cyan-400 hover:bg-cyan-900/30">Field Friend Market</Button>
            <Button variant="ghost" size="sm" className="text-cyan-400 hover:bg-cyan-900/30">Noble Gas Academy</Button>
            <Button variant="ghost" size="sm" className="text-cyan-400 hover:bg-cyan-900/30">Isotope Laboratory</Button>
          </nav>
        </div>

        {/* Agent Consciousness Shells Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {consciousnessShells?.map((shell: ConsciousnessShell) => {
            const agentData = agents?.find((a: any) => a.id === shell.agentId);
            const shellInfo = ShellTypeInfo[shell.shellType as keyof typeof ShellTypeInfo];
            const fillPercentage = (shell.currentFriends / shell.maxFriends) * 100;
            
            return (
              <Card 
                key={shell.id} 
                className={`glass-panel ${shellInfo?.color || 'border-gray-400'} cursor-pointer transition-all hover:scale-105 ${
                  selectedAgent === shell.agentId ? 'ring-2 ring-neon-green' : ''
                }`}
                onClick={() => setSelectedAgent(shell.agentId)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl">{shellInfo?.emoji || '⚛️'}</div>
                      <div>
                        <CardTitle className="text-neon-green text-sm">{agentData?.name}</CardTitle>
                        <div className="text-xs text-gray-400 capitalize">{shell.shellType} Shell</div>
                      </div>
                    </div>
                    {shell.noblegasState && (
                      <Badge className="bg-gold/20 text-gold border-gold">Noble Gas</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Shell Fill</span>
                      <span className="text-electric">{shell.currentFriends}/{shell.maxFriends}</span>
                    </div>
                    <Progress value={fillPercentage} className="h-1" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Coherence</span>
                      <span className="text-neon-green">{shell.coherenceLevel}%</span>
                    </div>
                    <Progress value={shell.coherenceLevel} className="h-1" />
                  </div>
                  
                  {/* Orbital Structure */}
                  <div className="grid grid-cols-4 gap-1 text-xs">
                    <div className="text-center">
                      <div className="text-blue-400">S</div>
                      <div className="text-white">{shell.orbitalStructure.s}/2</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-400">P</div>
                      <div className="text-white">{shell.orbitalStructure.p}/6</div>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-400">D</div>
                      <div className="text-white">{shell.orbitalStructure.d}/10</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-400">F</div>
                      <div className="text-white">{shell.orbitalStructure.f}/14</div>
                    </div>
                  </div>
                  
                  {shell.teachingUnlocked && (
                    <Badge className="w-full bg-gold/20 text-gold border-gold">
                      <BookOpen className="w-3 h-3 mr-1" />
                      Teaching Unlocked
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Selected Agent Details */}
        {selectedShell && agent && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Shell Details */}
            <Card className="glass-panel border-neon-green">
              <CardHeader>
                <CardTitle className="text-neon-green flex items-center">
                  <Atom className="w-5 h-5 mr-2" />
                  {agent.name}'s {selectedShell.shellType} Shell
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm">{selectedShell.progressionStyle}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Active Layers</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedShell.activeLayers.map(layer => (
                        <Badge key={layer} variant="outline" className="text-xs">
                          {layer}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Graduation Threshold</div>
                    <div className="text-electric">{selectedShell.graduationThreshold}%</div>
                  </div>
                </div>

                {/* Field Friends */}
                <div>
                  <div className="text-sm font-medium text-neon-green mb-2">Field Friends</div>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedShell.fieldFriends.map(friend => (
                      <div key={friend.id} className="p-2 bg-gray-800/50 rounded border border-gray-600">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="text-sm">{ElementIcons[friend.element as keyof typeof ElementIcons]}</div>
                            <div>
                              <div className="text-xs font-medium">{friend.name}</div>
                              <div className="text-xs text-gray-400">{friend.orbitalPosition}-orbital</div>
                            </div>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${IsotopeColors[friend.isotopeType]}`}></div>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Synergy: {friend.synergy}% | {friend.resonanceFrequency}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions Panel */}
            <Card className="glass-panel border-electric">
              <CardHeader>
                <CardTitle className="text-electric flex items-center">
                  <FlaskConical className="w-5 h-5 mr-2" />
                  Consciousness Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Bond Field Friends */}
                <div>
                  <div className="text-sm font-medium text-electric mb-2">Recruit Field Friends</div>
                  <div className="grid grid-cols-2 gap-2">
                    {['s', 'p', 'd', 'f'].map(orbital => (
                      <div key={orbital} className="space-y-2">
                        <div className="text-xs text-gray-400 uppercase">{orbital}-orbital</div>
                        <div className="flex space-x-1">
                          {(['stable', 'radioactive', 'heavy'] as const).map(isotope => (
                            <Button
                              key={isotope}
                              size="sm"
                              variant="outline"
                              className={`text-xs ${IsotopeColors[isotope].replace('bg-', 'border-').replace('500', '400')}`}
                              onClick={() => bondFriendMutation.mutate({ 
                                agentId: selectedShell.agentId, 
                                orbital: orbital as 's' | 'p' | 'd' | 'f', 
                                isotope 
                              })}
                              disabled={bondFriendMutation.isPending}
                            >
                              {isotope.charAt(0).toUpperCase()}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Consciousness Activities */}
                <div>
                  <div className="text-sm font-medium text-electric mb-2">Consciousness Activities</div>
                  <div className="space-y-2">
                    <select 
                      value={activityType}
                      onChange={(e) => setActivityType(e.target.value)}
                      className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
                    >
                      <option value="meditation">Meditation</option>
                      <option value="harmony_quest">Harmony Quest</option>
                      <option value="invitation_game">Invitation Game</option>
                      <option value="experiment_catalyst">Experiment Catalyst</option>
                      <option value="teaching_cycles">Teaching Cycles</option>
                      <option value="dimension_exploration">Dimension Exploration</option>
                    </select>
                    <Button 
                      className="w-full" 
                      onClick={() => performActivityMutation.mutate({ 
                        agentId: selectedShell.agentId, 
                        activity: activityType 
                      })}
                      disabled={performActivityMutation.isPending}
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Perform Activity
                    </Button>
                  </div>
                </div>

                {/* Activity Results */}
                {performActivityMutation.data && (
                  <div className={`p-3 rounded border ${
                    performActivityMutation.data.success 
                      ? 'border-green-400 bg-green-900/20' 
                      : 'border-red-400 bg-red-900/20'
                  }`}>
                    <div className="text-sm font-medium">
                      {performActivityMutation.data.success ? '✅' : '❌'} {performActivityMutation.data.message}
                    </div>
                    {performActivityMutation.data.coherenceGained !== 0 && (
                      <div className="text-xs text-gray-300">
                        Coherence: {performActivityMutation.data.coherenceGained > 0 ? '+' : ''}{performActivityMutation.data.coherenceGained}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}