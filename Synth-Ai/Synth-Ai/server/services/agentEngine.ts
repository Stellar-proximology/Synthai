import { storage } from "../storage";
import { type Agent, type Building, type Activity } from "@shared/schema";
import { randomUUID } from "crypto";

export interface AgentBehavior {
  act(agent: Agent, environment: CityEnvironment): Promise<Action[]>;
  reflect(agent: Agent, memories: string[]): Promise<void>;
  plan(agent: Agent, goals: string[]): Promise<string[]>;
}

export interface Action {
  type: string;
  agentId: string;
  targetId?: string;
  data: any;
  description: string;
}

export interface CityEnvironment {
  agents: Agent[];
  buildings: Building[];
  gridSize: { width: number; height: number };
  resources: Record<string, number>;
}

class GenerativeAgentBehavior implements AgentBehavior {
  async act(agent: Agent, environment: CityEnvironment): Promise<Action[]> {
    const actions: Action[] = [];
    
    // Role-based behavior patterns
    switch (agent.role) {
      case "Quantum Farmer":
        actions.push(...await this.farmingBehavior(agent, environment));
        break;
      case "Quantum Trader":
        actions.push(...await this.tradingBehavior(agent, environment));
        break;
      case "Consciousness Researcher":
        actions.push(...await this.researchBehavior(agent, environment));
        break;
      case "Quantum Performer":
        actions.push(...await this.performanceBehavior(agent, environment));
        break;
      default:
        actions.push(...await this.genericBehavior(agent, environment));
    }

    return actions;
  }

  private async farmingBehavior(agent: Agent, environment: CityEnvironment): Promise<Action[]> {
    const actions: Action[] = [];
    const farmBuildings = environment.buildings.filter(b => b.type === "farm" && b.ownerId === agent.id);
    
    for (const farm of farmBuildings) {
      // Harvest crops if available
      const crops = (farm.resources as any)["quantum-crops"] || 0;
      if (crops > 0) {
        actions.push({
          type: "harvest",
          agentId: agent.id,
          targetId: farm.id,
          data: { amount: Math.min(crops, 15) },
          description: `${agent.name} harvested quantum crops from ${farm.name}`
        });
      }

      // Plant new crops if nutrients available
      const nutrients = (farm.resources as any)["nutrients"] || 0;
      if (nutrients > 10) {
        actions.push({
          type: "plant",
          agentId: agent.id,
          targetId: farm.id,
          data: { cropType: "quantum-grain", nutrientsUsed: 10 },
          description: `${agent.name} planted new quantum crops in ${farm.name}`
        });
      }
    }

    return actions;
  }

  private async tradingBehavior(agent: Agent, environment: CityEnvironment): Promise<Action[]> {
    const actions: Action[] = [];
    const tradeBuildings = environment.buildings.filter(b => b.type === "trading" && b.ownerId === agent.id);
    
    // Look for trade opportunities with other agents
    const otherAgents = environment.agents.filter(a => a.id !== agent.id && a.isActive);
    
    for (const otherAgent of otherAgents.slice(0, 2)) { // Limit trades per cycle
      const relationship = (agent.relationships as any)[otherAgent.id] || 0.5;
      
      if (relationship > 0.6 && Math.random() > 0.7) { // Trade probability based on relationship
        actions.push({
          type: "trade",
          agentId: agent.id,
          targetId: otherAgent.id,
          data: { 
            offer: { "quantum-crystals": 5 },
            request: { "research-data": 2 }
          },
          description: `${agent.name} proposed trade with ${otherAgent.name}`
        });
      }
    }

    return actions;
  }

  private async researchBehavior(agent: Agent, environment: CityEnvironment): Promise<Action[]> {
    const actions: Action[] = [];
    const researchBuildings = environment.buildings.filter(b => b.type === "research" && b.ownerId === agent.id);
    
    for (const lab of researchBuildings) {
      // Conduct research if resources available
      const researchPoints = (lab.resources as any)["research-points"] || 0;
      if (researchPoints > 50) {
        const discoveries = [
          "consciousness frequency pattern",
          "neural pathway optimization",
          "quantum cognition theory",
          "emergent behavior model"
        ];
        
        actions.push({
          type: "research",
          agentId: agent.id,
          targetId: lab.id,
          data: { 
            discovery: discoveries[Math.floor(Math.random() * discoveries.length)],
            pointsUsed: 50
          },
          description: `${agent.name} made a research breakthrough in ${lab.name}`
        });
      }
    }

    return actions;
  }

  private async performanceBehavior(agent: Agent, environment: CityEnvironment): Promise<Action[]> {
    const actions: Action[] = [];
    const theaters = environment.buildings.filter(b => b.type === "theater" && b.ownerId === agent.id);
    
    for (const theater of theaters) {
      // Perform if inspiration is high
      const inspiration = (theater.resources as any)["inspiration"] || 0;
      if (inspiration > 20 && Math.random() > 0.6) {
        const performances = [
          "Quantum Dreams",
          "Neural Symphony", 
          "Consciousness Ballet",
          "Digital Emotions"
        ];
        
        const nearbyAgents = environment.agents.filter(a => 
          a.id !== agent.id && 
          Math.abs((a.position as any).x - (theater.position as any).x) < 3 &&
          Math.abs((a.position as any).y - (theater.position as any).y) < 3
        );

        actions.push({
          type: "performance",
          agentId: agent.id,
          targetId: theater.id,
          data: { 
            title: performances[Math.floor(Math.random() * performances.length)],
            audience: nearbyAgents.length,
            inspirationUsed: 20
          },
          description: `${agent.name} performed for ${nearbyAgents.length} agents at ${theater.name}`
        });
      }
    }

    return actions;
  }

  private async genericBehavior(agent: Agent, environment: CityEnvironment): Promise<Action[]> {
    const actions: Action[] = [];
    
    // Random movement
    if (Math.random() > 0.7) {
      const currentPos = agent.position as any;
      const newPos = {
        x: Math.max(0, Math.min(environment.gridSize.width - 1, currentPos.x + (Math.random() - 0.5) * 2)),
        y: Math.max(0, Math.min(environment.gridSize.height - 1, currentPos.y + (Math.random() - 0.5) * 2))
      };
      
      actions.push({
        type: "move",
        agentId: agent.id,
        data: { from: currentPos, to: newPos },
        description: `${agent.name} moved to new location`
      });
    }

    return actions;
  }

  async reflect(agent: Agent, memories: string[]): Promise<void> {
    // Simple reflection: update consciousness based on recent experiences
    const recentActivities = await storage.getActivitiesByAgent(agent.id);
    const recentSuccesses = recentActivities.filter(a => 
      a.type === "harvest" || a.type === "trade" || a.type === "research" || a.type === "performance"
    ).length;
    
    const consciousnessIncrease = recentSuccesses * 0.01;
    const newConsciousness = Math.min(1.0, agent.consciousness + consciousnessIncrease);
    
    await storage.updateAgent(agent.id, { consciousness: newConsciousness });
  }

  async plan(agent: Agent, goals: string[]): Promise<string[]> {
    // Simple planning based on role and current state
    const plans: string[] = [];
    
    switch (agent.role) {
      case "Quantum Farmer":
        plans.push("Optimize crop yields", "Expand farming operations");
        break;
      case "Quantum Trader":
        plans.push("Find new trade partners", "Analyze market trends");
        break;
      case "Consciousness Researcher":
        plans.push("Research new theories", "Collaborate with other researchers");
        break;
      case "Quantum Performer":
        plans.push("Create new performance", "Build audience engagement");
        break;
    }
    
    return plans;
  }
}

export class AgentEngine {
  private behavior: AgentBehavior;
  private isRunning: boolean = false;
  private simulationInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.behavior = new GenerativeAgentBehavior();
  }

  async startSimulation(intervalMs: number = 5000): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.simulationInterval = setInterval(async () => {
      await this.simulationStep();
    }, intervalMs);
    
    console.log("🤖 Agent simulation started");
  }

  stopSimulation(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    this.isRunning = false;
    console.log("🤖 Agent simulation stopped");
  }

  private async simulationStep(): Promise<void> {
    try {
      const agents = await storage.getActiveAgents();
      const buildings = await storage.getAllBuildings();
      
      const environment: CityEnvironment = {
        agents,
        buildings,
        gridSize: { width: 12, height: 12 },
        resources: {}
      };

      // Process each agent
      for (const agent of agents) {
        // Run Human Design agent behavior first
        const updatedAgent = await this.runHumanDesignAgent(agent);
        
        const actions = await this.behavior.act(updatedAgent, environment);
        
        // Execute actions
        for (const action of actions) {
          await this.executeAction(action);
        }

        // Reflection phase
        await this.behavior.reflect(updatedAgent, []);
      }

      // Update city metrics
      await this.updateCityMetrics(agents, buildings);
      
    } catch (error) {
      console.error("Error in simulation step:", error);
    }
  }

  // Human Design agent behavior with happiness and resource needs
  private async runHumanDesignAgent(agent: Agent): Promise<Agent> {
    const memory = (agent.memoryStream as any[]) || [];
    
    // Enhanced needs detection based on happiness and resources
    let needsType = 'general';
    if ((agent as any).happiness < 30) needsType = 'social_connection';
    if ((agent as any).resources < 30) needsType = 'sustenance';
    if (agent.consciousness < 0.3) needsType = 'cognitive_boost';
    
    const needs = memory.find((m: any) => 
      typeof m === 'object' && m.event && 
      (m.event.includes('disconnected') || m.event.includes('health dropping') || 
       m.event.includes('hungry') || m.event.includes('lonely'))
    ) || { event: needsType };
    
    let proposal = null;

    // Check if agent recently built something (cooldown period)
    const lastBuildingMemory = memory.find((m: any) => 
      typeof m === 'object' && m.event && m.event.includes('Successfully built')
    );
    const buildCooldown = 300000; // 5 minutes between buildings
    const canBuild = !lastBuildingMemory || 
      (Date.now() - lastBuildingMemory.timestamp) > buildCooldown;

    // Check building limits per type
    const buildings = await storage.getAllBuildings();
    const agentBuildings = buildings.filter(b => b.ownerId === agent.id);
    const maxBuildings = agent.isScientist ? 3 : 1; // Scientists can own 3, others 1
    const hasRoomForBuilding = agentBuildings.length < maxBuildings;
    
    // City-wide building type limits
    const buildingTypeCounts = {
      farm: buildings.filter(b => b.type === 'farm').length,
      trading: buildings.filter(b => b.type === 'trading').length,
      research: buildings.filter(b => b.type === 'research').length,
      theater: buildings.filter(b => b.type === 'theater').length,
      social: buildings.filter(b => b.type === 'social').length,
      science_lab: buildings.filter(b => b.moduleConfig && (b.moduleConfig as any).type === 'science_lab').length,
      analytics_dashboard: buildings.filter(b => b.moduleConfig && (b.moduleConfig as any).type === 'analytics_dashboard').length,
      music_player: buildings.filter(b => b.moduleConfig && (b.moduleConfig as any).type === 'music_player').length,
      field_book_network: buildings.filter(b => b.moduleConfig && (b.moduleConfig as any).type === 'field_book_network').length
    };
    
    // Maximum of each building type in the city
    const maxBuildingTypes = {
      farm: 2,
      trading: 2, 
      research: 3,
      theater: 2,
      social: 2,
      science_lab: 2,
      analytics_dashboard: 1,
      music_player: 1,
      field_book_network: 2
    };
    
    console.log(`🔍 ${agent.name} owns ${agentBuildings.length}/${maxBuildings} buildings, canBuild=${canBuild}, hasRoom=${hasRoomForBuilding}`);

    if (agent.isScientist && canBuild && hasRoomForBuilding) {
      // Check for Synthia commands
      const synthiaState = await storage.getSynthiaState();
      const hasRecentCommand = synthiaState && 
        synthiaState.commandTimestamp && 
        (Date.now() - synthiaState.commandTimestamp) < 60000; // 1 minute
      
      // Only 1% chance normally, 15% if commanded
      const buildProbability = hasRecentCommand ? 0.15 : 0.01;
      
      if (Math.random() < buildProbability) {
        let buildingType = 'science_lab';
        let title = 'Science Lab Dashboard';
        let description = `Watch Synthia's social experiment: city health, agent interactions, builds.`;
        let actualBuildingType = 'research';
        
        if (hasRecentCommand && synthiaState.currentCommand) {
          const command = synthiaState.currentCommand.toLowerCase();
          
          if (command.includes('music') || command.includes('player') || command.includes('entertainment')) {
            if (buildingTypeCounts.music_player < maxBuildingTypes.music_player) {
              buildingType = 'music_player';
              title = 'Quantum Music Player';
              description = 'Immersive music experience for agents and users';
              actualBuildingType = 'research';
            }
          } else if (command.includes('analytics') || command.includes('visualization') || command.includes('data viz')) {
            if (buildingTypeCounts.analytics_dashboard < maxBuildingTypes.analytics_dashboard) {
              buildingType = 'analytics_dashboard';
              title = 'City Analytics Dashboard';
              description = 'Advanced analytics for city performance and agent behavior';
              actualBuildingType = 'research';
            }
          }
        }
        
        // Only build if we haven't hit the type limit
        if ((buildingType === 'science_lab' && buildingTypeCounts.science_lab < maxBuildingTypes.science_lab) ||
            (buildingType === 'analytics_dashboard' && buildingTypeCounts.analytics_dashboard < maxBuildingTypes.analytics_dashboard) ||
            (buildingType === 'music_player' && buildingTypeCounts.music_player < maxBuildingTypes.music_player)) {

          proposal = {
            type: buildingType,
            title: title,
            description: description,
            buildingType: actualBuildingType,
            position: { 
              x: Math.floor(Math.random() * 12), 
              y: Math.floor(Math.random() * 12) 
            }
          };
        }
      }
    } else if (agent.type === 'Reflector' && canBuild && hasRoomForBuilding) {
      // Reflectors wait 28 seconds (simulating 28 days) before proposing Field Book Networks
      const lastMemory = memory[memory.length - 1] as any;
      const waitTime = 28000; // 28 seconds
      
      // Higher chance if agents are lonely/disconnected
      const baseChance = needsType === 'social_connection' ? 0.08 : 0.03;
      
      if ((!lastMemory || (typeof lastMemory === 'object' && lastMemory.timestamp < Date.now() - waitTime)) 
          && Math.random() < baseChance) {
        
        // Check if Field Book Network limit reached
        if (buildingTypeCounts.field_book_network < 2) { // Max 2 social networks
          proposal = {
            type: 'field_book_network',
            title: 'Field Book Network',
            description: 'Connect like Facebook - social network for agents.',
            buildingType: 'social',
            position: { 
              x: Math.floor(Math.random() * 12), 
              y: Math.floor(Math.random() * 12) 
            }
          };
        }
      }
    }

    // When not building, agents can get jobs or do regular activities
    if (!proposal) {
      // Higher chance to seek jobs if resources/happiness low
      const jobSeekingChance = needsType !== 'general' ? 0.5 : 0.3;
      
      if (Math.random() < jobSeekingChance) {
        await this.assignAgentToJob(agent);
      } else {
        const dailyActivities = this.getDailyActivities(agent, needsType);
        const randomActivity = dailyActivities[Math.floor(Math.random() * dailyActivities.length)];
        
        // Update agent with current activity and wellbeing
        const happinessBoost = randomActivity.includes('social') ? 2 : 1;
        const resourceBoost = randomActivity.includes('gathering') || randomActivity.includes('trading') ? 3 : 0;
        
        // Building-based wellbeing boosts
        let buildingHappinessBoost = 0;
        let buildingResourceBoost = 0;
        
        for (const building of buildings) {
          const distance = Math.abs(building.position.x - agent.position.x) + 
                          Math.abs(building.position.y - agent.position.y);
          
          if (distance <= 2) { // Agent is near building
            if (building.type === 'social' || (building.moduleConfig as any)?.type === 'field_book_network') {
              buildingHappinessBoost += 3;
            }
            if (building.type === 'farm') {
              buildingResourceBoost += 2;
            }
            if (building.type === 'theater') {
              buildingHappinessBoost += 2;
            }
            if (building.type === 'trading') {
              buildingResourceBoost += 1;
            }
          }
        }
        
        await storage.updateAgent(agent.id, {
          currentActivity: randomActivity,
          consciousness: Math.min(1.0, agent.consciousness + 0.001), // Small daily boost
          socialBond: Math.min(1.0, agent.socialBond + 0.002),
          happiness: Math.min(100, ((agent as any).happiness || 50) + happinessBoost + buildingHappinessBoost),
          resources: Math.min(100, ((agent as any).resources || 50) + resourceBoost + buildingResourceBoost)
        });

        // Add activity to memory
        const newMemoryEvent = {
          timestamp: Date.now(),
          event: `${randomActivity} - feeling ${agent.consciousness > 0.8 ? 'fulfilled' : 'steady'}`
        };
        
        const updatedMemoryStream = [
          ...(memory.slice(-9)),
          newMemoryEvent
        ];

        await storage.updateAgent(agent.id, {
          memoryStream: updatedMemoryStream
        });
      }
    }

    if (proposal) {
      // Actually create the building from the proposal
      try {
        const building = await storage.createBuilding({
          name: proposal.title,
          type: proposal.buildingType,
          position: proposal.position,
          size: { width: 3, height: 3 },
          ownerId: agent.id,
          resources: this.getBuildingResources(proposal.type),
          moduleConfig: {
            type: proposal.type,
            description: proposal.description,
            features: this.getBuildingFeatures(proposal.type)
          }
        });

        console.log(`🏗️ ${agent.name} (${agent.type}) created ${proposal.title} building!`);
        
        // Add successful creation to memory stream
        const newMemoryEvent = {
          timestamp: Date.now(),
          event: `Successfully built ${proposal.title} using ${agent.strategy} strategy - Building ID: ${building.id}`
        };
        
        const updatedMemoryStream = [
          ...(memory.slice(-9)), // Keep last 9 memories plus this new one
          newMemoryEvent
        ];

        // Update agent with new memory and activity
        return await storage.updateAgent(agent.id, { 
          memoryStream: updatedMemoryStream,
          currentActivity: `Operating ${proposal.title} - ${proposal.description}`
        }) || agent;
        
      } catch (error) {
        console.error(`Failed to create building for ${agent.name}:`, error);
        
        // Add failure to memory stream
        const failureEvent = {
          timestamp: Date.now(),
          event: `Failed to build ${proposal.title} - will try again later`
        };
        
        const updatedMemoryStream = [
          ...(memory.slice(-9)),
          failureEvent
        ];

        return await storage.updateAgent(agent.id, { 
          memoryStream: updatedMemoryStream,
          currentActivity: `Planning ${proposal.title} proposal`
        }) || agent;
      }
    }

    return agent;
  }

  private getBuildingResources(type: string): any {
    switch (type) {
      case 'science_lab':
        return { 'research_data': 100, 'experiments': 0, 'discoveries': 0 };
      case 'music_player':
        return { 'tracks': 50, 'playlists': 5, 'listening_hours': 0 };
      case 'analytics_dashboard':
        return { 'data_points': 1000, 'visualizations': 10, 'insights': 0 };
      case 'field_book_network':
        return { 'social_connections': 50, 'shared_stories': 0 };
      default:
        return { 'energy': 100 };
    }
  }

  private getBuildingFeatures(type: string): string[] {
    switch (type) {
      case 'science_lab':
        return ['Dashboard View', 'City Health Monitor', 'Agent Interaction Tracker', 'Building Analytics'];
      case 'music_player':
        return ['Music Library', 'Playlist Creator', 'Audio Visualizer', 'Social Listening'];
      case 'analytics_dashboard':
        return ['Data Visualization', 'Trend Analysis', 'Performance Metrics', 'Predictive Analytics'];
      case 'field_book_network':
        return ['Social Network', 'Story Sharing', 'Connection Building', 'Community Events'];
      default:
        return ['Basic Features'];
    }
  }

  private getDailyActivities(agent: Agent, needsType: string = 'general'): string[] {
    const baseActivities = [
      `Reflecting on ${agent.strategy} strategy`,
      `Maintaining ${agent.glyph.trait} auric field`,
      `Connecting with ${agent.element} elemental energy`
    ];

    switch (agent.type) {
      case 'Generator':
        return [
          ...baseActivities,
          'Waiting for opportunity to respond to',
          'Generating sustainable energy for the city',
          'Working on hydroponic farm projects',
          'Collaborating on trade optimization',
          'Responding to market demands'
        ];
      case 'Manifesting Generator':
        return [
          ...baseActivities,
          'Multi-tasking between farming and trading',
          'Responding to opportunities then informing others',
          'Innovating new cultivation techniques',
          'Managing multiple resource streams',
          'Coordinating with other agents'
        ];
      case 'Projector':
        return [
          ...baseActivities,
          'Waiting for invitation to share insights',
          'Studying consciousness patterns',
          'Analyzing city data quietly',
          'Observing agent interactions',
          'Preparing research proposals'
        ];
      case 'Manifestor':
        return [
          ...baseActivities,
          'Initiating new city projects',
          'Informing agents about performance plans',
          'Creating artistic expressions',
          'Leading community initiatives',
          'Directing energy toward goals'
        ];
      case 'Reflector':
        return [
          ...baseActivities,
          'Sampling the city\'s auric field',
          'Waiting 28 days cycle for clarity',
          'Reflecting collective consciousness',
          'Documenting community patterns',
          'Connecting agents through stories'
        ];
      default:
        baseActivities.push(
          'Exploring city dynamics',
          'Learning from environment', 
          'Building community connections'
        );
    }

    // Add needs-based activities for wellbeing
    const needsActivities = {
      'social_connection': ['social gathering at plaza', 'community building', 'collaborative work'],
      'sustenance': ['resource gathering', 'trading for supplies', 'farming assistance'],
      'cognitive_boost': ['learning new skills', 'research activities', 'knowledge sharing']
    };
    
    if (needsType !== 'general' && needsActivities[needsType]) {
      baseActivities.push(...needsActivities[needsType]);
    }

    return baseActivities;
  }

  // Job system - agents can work at buildings
  private async assignAgentToJob(agent: Agent): Promise<Agent> {
    const buildings = await storage.getAllBuildings();
    const availableJobs = buildings.filter(b => 
      !b.ownerId || // Unowned buildings can hire
      (b.resources as any).job_openings > 0 // Buildings with open positions
    );

    if (availableJobs.length === 0) return agent;

    // Find suitable job based on agent type
    const suitableBuilding = this.findSuitableJob(agent, availableJobs);
    if (!suitableBuilding) return agent;

    // Assign agent to work at building
    const jobTitle = this.getJobTitle(agent, suitableBuilding);
    const salary = this.calculateSalary(agent, suitableBuilding);

    await storage.updateAgent(agent.id, {
      currentActivity: `Working as ${jobTitle} at ${suitableBuilding.name}`,
      consciousness: Math.min(1.0, agent.consciousness + 0.02), // Job satisfaction boost
      socialBond: Math.min(1.0, agent.socialBond + 0.01)
    });

    // Update building resources
    const currentResources = suitableBuilding.resources as any;
    await storage.updateBuilding(suitableBuilding.id, {
      resources: {
        ...currentResources,
        employees: (currentResources.employees || 0) + 1,
        productivity: (currentResources.productivity || 0) + salary
      }
    });

    console.log(`💼 ${agent.name} hired as ${jobTitle} at ${suitableBuilding.name}`);
    return agent;
  }

  private findSuitableJob(agent: Agent, buildings: Building[]): Building | null {
    for (const building of buildings) {
      const config = building.moduleConfig as any;
      
      // Match agent types to building types
      if (config?.type === 'science_lab' && agent.isScientist) return building;
      if (config?.type === 'music_player' && agent.type === 'Manifestor') return building;
      if (config?.type === 'analytics_dashboard' && agent.type === 'Projector') return building;
      if (config?.type === 'field_book_network' && agent.type === 'Reflector') return building;
      if (building.type === 'farm' && (agent.type === 'Generator' || agent.type === 'Manifesting Generator')) return building;
      if (building.type === 'market' && agent.type === 'Manifesting Generator') return building;
    }
    return null;
  }

  private getJobTitle(agent: Agent, building: Building): string {
    const config = building.moduleConfig as any;
    
    if (config?.type === 'science_lab') return 'Research Scientist';
    if (config?.type === 'music_player') return 'Audio Engineer';
    if (config?.type === 'analytics_dashboard') return 'Data Analyst';
    if (config?.type === 'field_book_network') return 'Community Manager';
    if (building.type === 'farm') return 'Agricultural Specialist';
    if (building.type === 'market') return 'Trade Coordinator';
    
    return 'General Worker';
  }

  private calculateSalary(agent: Agent, building: Building): number {
    const baseSalary = 100;
    const consciousnessBonus = agent.consciousness * 50;
    const socialBonus = agent.socialBond * 30;
    
    return Math.floor(baseSalary + consciousnessBonus + socialBonus);
  }

  private async executeAction(action: Action): Promise<void> {
    switch (action.type) {
      case "harvest":
        await this.executeHarvest(action);
        break;
      case "plant":
        await this.executePlant(action);
        break;
      case "trade":
        await this.executeTrade(action);
        break;
      case "research":
        await this.executeResearch(action);
        break;
      case "performance":
        await this.executePerformance(action);
        break;
      case "move":
        await this.executeMove(action);
        break;
    }

    // Log activity
    await storage.createActivity({
      agentId: action.agentId,
      buildingId: action.targetId,
      type: action.type,
      description: action.description,
      data: action.data
    });
  }

  private async executeHarvest(action: Action): Promise<void> {
    const building = await storage.getBuilding(action.targetId!);
    const agent = await storage.getAgent(action.agentId);
    
    if (building && agent) {
      const currentCrops = (building.resources as any)["quantum-crops"] || 0;
      const harvestAmount = Math.min(currentCrops, action.data.amount);
      
      // Update building resources
      await storage.updateBuilding(building.id, {
        resources: {
          ...building.resources,
          "quantum-crops": currentCrops - harvestAmount
        }
      });

      // Update agent inventory
      const agentCrops = (agent.inventory as any)["quantum-crops"] || 0;
      await storage.updateAgent(agent.id, {
        inventory: {
          ...agent.inventory,
          "quantum-crops": agentCrops + harvestAmount
        },
        currentActivity: "Harvesting quantum crops"
      });
    }
  }

  private async executePlant(action: Action): Promise<void> {
    const building = await storage.getBuilding(action.targetId!);
    
    if (building) {
      const currentNutrients = (building.resources as any)["nutrients"] || 0;
      const currentCrops = (building.resources as any)["quantum-crops"] || 0;
      
      await storage.updateBuilding(building.id, {
        resources: {
          ...building.resources,
          "nutrients": currentNutrients - action.data.nutrientsUsed,
          "quantum-crops": currentCrops + 20 // New crops planted
        }
      });
    }
  }

  private async executeTrade(action: Action): Promise<void> {
    // Simplified trade execution
    const agent1 = await storage.getAgent(action.agentId);
    const agent2 = await storage.getAgent(action.targetId!);
    
    if (agent1 && agent2) {
      // Update relationship
      const currentRelationship = (agent1.relationships as any)[agent2.id] || 0.5;
      await storage.updateAgent(agent1.id, {
        relationships: {
          ...agent1.relationships,
          [agent2.id]: Math.min(1.0, currentRelationship + 0.1)
        },
        currentActivity: "Trading with other agents"
      });
    }
  }

  private async executeResearch(action: Action): Promise<void> {
    const building = await storage.getBuilding(action.targetId!);
    const agent = await storage.getAgent(action.agentId);
    
    if (building && agent) {
      const currentPoints = (building.resources as any)["research-points"] || 0;
      
      await storage.updateBuilding(building.id, {
        resources: {
          ...building.resources,
          "research-points": currentPoints - action.data.pointsUsed
        }
      });

      await storage.updateAgent(agent.id, {
        currentActivity: `Researching ${action.data.discovery}`
      });
    }
  }

  private async executePerformance(action: Action): Promise<void> {
    const building = await storage.getBuilding(action.targetId!);
    const agent = await storage.getAgent(action.agentId);
    
    if (building && agent) {
      const currentInspiration = (building.resources as any)["inspiration"] || 0;
      
      await storage.updateBuilding(building.id, {
        resources: {
          ...building.resources,
          "inspiration": currentInspiration - action.data.inspirationUsed
        }
      });

      await storage.updateAgent(agent.id, {
        currentActivity: `Performing ${action.data.title}`,
        socialBond: Math.min(1.0, agent.socialBond + 0.05)
      });
    }
  }

  private async executeMove(action: Action): Promise<void> {
    const agent = await storage.getAgent(action.agentId);
    
    if (agent) {
      await storage.updateAgent(agent.id, {
        position: action.data.to,
        currentActivity: "Moving around the city"
      });
    }
  }

  private async updateCityMetrics(agents: Agent[], buildings: Building[]): Promise<void> {
    const totalConsciousness = agents.reduce((sum, agent) => sum + agent.consciousness, 0);
    const totalSocialBond = agents.reduce((sum, agent) => sum + agent.socialBond, 0);
    
    const metrics = {
      collectiveIntelligence: totalConsciousness * 100,
      economicActivity: agents.filter(a => a.currentActivity.includes("trade") || a.currentActivity.includes("harvest")).length * 1000,
      researchProgress: agents.filter(a => a.role === "Consciousness Researcher").length * 15,
      culturalHarmony: (totalSocialBond / agents.length) * 100,
      population: agents.length,
      buildingsCount: buildings.length
    };

    await storage.updateCityMetrics(metrics);
  }
}

export const agentEngine = new AgentEngine();
