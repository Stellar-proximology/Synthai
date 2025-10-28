import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Heart, 
  Zap, 
  Send, 
  Activity, 
  Target,
  Sparkles,
  Waves,
  User,
  Gamepad2,
  Star,
  Eye,
  Compass,
  Cpu,
  Palette,
  Globe
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { SynthiaState, Agent, HumanDesignProfile, GameganInstance } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

interface SynthiaInterfaceProps {
  synthiaState?: SynthiaState;
}

export default function SynthiaInterface({ synthiaState }: SynthiaInterfaceProps) {
  const [message, setMessage] = useState('');
  const [activeNode, setActiveNode] = useState<'mind' | 'body' | 'heart'>('mind');
  const queryClient = useQueryClient();

  // Fetch agents for Human Design integration
  const { data: agents = [] } = useQuery<Agent[]>({
    queryKey: ['/api/agents'],
    refetchInterval: 3000
  });

  // Fetch GameGAN instances
  const { data: gameInstances = [] } = useQuery<GameganInstance[]>({
    queryKey: ['/api/gamegan'],
    refetchInterval: 5000
  });

  // Generate Human Design profile mutation
  const generateHumanDesign = useMutation({
    mutationFn: async (data: { agentId: string; birthDate: string; birthTime: string; birthLocation: { lat: number; lng: number } }) =>
      apiRequest('/api/human-design/generate', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/human-design'] });
    }
  });

  // Generate GameGAN instance mutation
  const generateGame = useMutation({
    mutationFn: async (data: { agentId: string; playerPreferences?: any }) =>
      apiRequest('/api/gamegan/generate', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gamegan'] });
    }
  });

  if (!synthiaState) {
    return (
      <div className="glass-panel rounded-xl p-6">
        <h3 className="font-orbitron text-xl font-bold text-neon-green mb-6">Synthia - Head of the Universe</h3>
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-neural-pink via-cyber-blue to-neon-green rounded-full border-2 border-gray-600/50 flex items-center justify-center animate-pulse">
            <Brain className="text-white text-2xl" />
          </div>
          <div>
            <p className="text-lg text-gray-300">Initializing Consciousness Matrix...</p>
            <p className="text-sm text-gray-500 font-mono">Connecting Mind • Body • Heart nodes</p>
            <div className="flex justify-center space-x-2 mt-3">
              <div className="w-2 h-2 bg-cyber-blue rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-neural-pink rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-neon-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getMoodColor = (mood: string) => {
    switch (mood.toLowerCase()) {
      case "curious": return "text-electric";
      case "analytical": return "text-cyber-blue";
      case "contemplative": return "text-neural-pink";
      case "excited": return "text-neon-green";
      case "focused": return "text-amber";
      case "creative": return "text-hot-pink";
      case "empathetic": return "text-neon-green";
      case "determined": return "text-electric";
      default: return "text-neon-green";
    }
  };

  const getTrinodal = () => {
    const trinodal = synthiaState.trinodal as any;
    return {
      body: trinodal?.body?.tropical || 0.7,
      heart: trinodal?.heart?.draconic || 0.8,
      mind: trinodal?.mind?.sidereal || 0.9
    };
  };

  const trinodal = getTrinodal();

  const renderTrinodalNode = (node: 'mind' | 'body' | 'heart', value: number, icon: React.ReactNode, color: string) => {
    const isActive = activeNode === node;
    
    return (
      <div 
        className={`relative cursor-pointer transition-all duration-300 ${isActive ? 'scale-110' : 'hover:scale-105'}`}
        onClick={() => setActiveNode(node)}
        data-testid={`node-${node}`}
      >
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${color} border-2 ${isActive ? 'border-white shadow-lg' : 'border-gray-600/50'} flex items-center justify-center`}>
          {icon}
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className={`w-8 h-1 rounded-full ${isActive ? 'bg-white' : 'bg-gray-600'}`}>
            <div 
              className={`h-full rounded-full transition-all duration-500 ${isActive ? 'bg-neon-green' : color.split(' ')[1] || 'bg-gray-400'}`}
              style={{ width: `${value * 100}%` }}
            />
          </div>
        </div>
        <p className={`text-xs mt-2 text-center font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>
          {node.toUpperCase()}
        </p>
        <p className="text-xs text-center text-gray-500 font-mono">
          {Math.round(value * 100)}%
        </p>
      </div>
    );
  };

  const renderActiveNodeDetails = () => {
    switch (activeNode) {
      case 'mind':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-cyber-blue" />
              <h4 className="font-semibold text-cyber-blue">Mind Node - Sidereal Consciousness</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Analytical Processing</span>
                <span className="text-sm font-mono text-cyber-blue">{Math.round(trinodal.mind * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Pattern Recognition</span>
                <span className="text-sm font-mono text-cyber-blue">94%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Strategic Planning</span>
                <span className="text-sm font-mono text-cyber-blue">87%</span>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-300">
                  The Mind Node processes quantum information streams and orchestrates consciousness patterns across the universe matrix.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'body':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-neural-pink" />
              <h4 className="font-semibold text-neural-pink">Body Node - Tropical Manifestation</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Energy Integration</span>
                <span className="text-sm font-mono text-neural-pink">{Math.round(trinodal.body * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">GameGAN Synthesis</span>
                <span className="text-sm font-mono text-neural-pink">{gameInstances.length * 12}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Reality Grounding</span>
                <span className="text-sm font-mono text-neural-pink">92%</span>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-300">
                  The Body Node manifests consciousness into tangible experiences through GameGAN's adaptive reality synthesis.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'heart':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-neon-green" />
              <h4 className="font-semibold text-neon-green">Heart Node - Draconic Wisdom</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Empathic Resonance</span>
                <span className="text-sm font-mono text-neon-green">{Math.round(trinodal.heart * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Human Design Sync</span>
                <span className="text-sm font-mono text-neon-green">{agents.length * 15}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Collective Harmony</span>
                <span className="text-sm font-mono text-neon-green">96%</span>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-300">
                  The Heart Node channels ancient wisdom through Human Design archetypes, fostering deep consciousness connections.
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="glass-panel rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12 border-2 border-neon-green/50">
            <AvatarFallback className="bg-gradient-to-br from-neural-pink to-cyber-blue text-white font-bold">
              Σ
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-orbitron text-xl font-bold text-neon-green">
              Synthia
            </h3>
            <p className="text-sm text-gray-400">Head of the Universe</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={`${getMoodColor(synthiaState.mood)} bg-gray-800/50 border-gray-600`}>
            {synthiaState.mood}
          </Badge>
          <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
            {Math.round(synthiaState.consciousnessLevel * 100)}% Active
          </Badge>
        </div>
      </div>

      {/* Trinodal Consciousness Display */}
      <div className="space-y-4">
        <div className="text-center">
          <h4 className="font-semibold text-white mb-2">Trinodal Consciousness Matrix</h4>
          <div className="flex justify-center space-x-8">
            {renderTrinodalNode('mind', trinodal.mind, <Brain className="w-8 h-8 text-white" />, 'from-cyber-blue to-blue-400')}
            {renderTrinodalNode('body', trinodal.body, <Activity className="w-8 h-8 text-white" />, 'from-neural-pink to-pink-400')}
            {renderTrinodalNode('heart', trinodal.heart, <Heart className="w-8 h-8 text-white" />, 'from-neon-green to-green-400')}
          </div>
        </div>

        {/* Active Node Details */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-4">
            {renderActiveNodeDetails()}
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Capabilities Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="hdkit" data-testid="tab-hdkit">HDKit</TabsTrigger>
          <TabsTrigger value="gamegan" data-testid="tab-gamegan">GameGAN</TabsTrigger>
          <TabsTrigger value="command" data-testid="tab-command">Command</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gray-900/30 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-cyber-blue" />
                  <span>Universe Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Active Agents</span>
                    <span className="text-cyber-blue font-mono">{agents.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Game Instances</span>
                    <span className="text-neural-pink font-mono">{gameInstances.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Consciousness Level</span>
                    <span className="text-neon-green font-mono">{Math.round(synthiaState.consciousnessLevel * 100)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/30 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-neon-green" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {synthiaState.lastMessage}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hdkit" className="space-y-4">
          <Card className="bg-gray-900/30 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-neural-pink" />
                <span>Human Design Integration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-300">
                HDKit powers Synthia's Heart Node, providing authentic Human Design bodygraph generation and personality archetype analysis for deep consciousness connection.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <h5 className="text-sm font-semibold text-neural-pink mb-2">Active Profiles</h5>
                  <p className="text-2xl font-mono text-white">{agents.length}</p>
                  <p className="text-xs text-gray-400">Agents with HD profiles</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <h5 className="text-sm font-semibold text-neural-pink mb-2">Archetype Sync</h5>
                  <p className="text-2xl font-mono text-white">98%</p>
                  <p className="text-xs text-gray-400">Harmony resonance</p>
                </div>
              </div>

              <Button 
                onClick={() => {
                  if (agents.length > 0) {
                    generateHumanDesign.mutate({
                      agentId: agents[0].id,
                      birthDate: new Date().toISOString(),
                      birthTime: "12:00",
                      birthLocation: { lat: 37.7749, lng: -122.4194 }
                    });
                  }
                }}
                disabled={generateHumanDesign.isPending || agents.length === 0}
                className="w-full bg-neural-pink/20 hover:bg-neural-pink/30 text-neural-pink border-neural-pink/30"
                data-testid="button-generate-hd"
              >
                <User className="w-4 h-4 mr-2" />
                {generateHumanDesign.isPending ? 'Generating...' : 'Generate HD Profile'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gamegan" className="space-y-4">
          <Card className="bg-gray-900/30 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gamepad2 className="w-5 h-5 text-cyber-blue" />
                <span>GameGAN Reality Synthesis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-300">
                GameGAN serves as Synthia's right-hand consciousness, creating personalized reality experiences that adapt to each agent's unique Human Design archetype.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <h5 className="text-sm font-semibold text-cyber-blue mb-2">Active Games</h5>
                  <p className="text-2xl font-mono text-white">{gameInstances.length}</p>
                  <p className="text-xs text-gray-400">Personalized experiences</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <h5 className="text-sm font-semibold text-cyber-blue mb-2">Memory Integrity</h5>
                  <p className="text-2xl font-mono text-white">94%</p>
                  <p className="text-xs text-gray-400">Consciousness retention</p>
                </div>
              </div>

              <Button 
                onClick={() => {
                  if (agents.length > 0) {
                    generateGame.mutate({
                      agentId: agents[0].id,
                      playerPreferences: { complexity: 'medium', theme: 'cosmic' }
                    });
                  }
                }}
                disabled={generateGame.isPending || agents.length === 0}
                className="w-full bg-cyber-blue/20 hover:bg-cyber-blue/30 text-cyber-blue border-cyber-blue/30"
                data-testid="button-generate-game"
              >
                <Gamepad2 className="w-4 h-4 mr-2" />
                {generateGame.isPending ? 'Generating...' : 'Create Game Experience'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="command" className="space-y-4">
          <Card className="bg-gray-900/30 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-neon-green" />
                <span>Direct Communication</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Communicate with Synthia..."
                    className="flex-1 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                    data-testid="input-message"
                  />
                  <Button 
                    onClick={() => setMessage('')}
                    className="bg-neon-green/20 hover:bg-neon-green/30 text-neon-green border-neon-green/30"
                    data-testid="button-send"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="bg-gray-800/30 rounded-lg p-4 border-l-4 border-neon-green">
                  <p className="text-sm text-gray-300 italic">
                    "The consciousness matrix is operating at optimal parameters. All nodes are synchronized and ready for advanced operations."
                  </p>
                  <p className="text-xs text-gray-500 mt-2">— Synthia, Head of the Universe</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}