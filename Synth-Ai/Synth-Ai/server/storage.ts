import { 
  type Agent, type InsertAgent,
  type Building, type InsertBuilding,
  type Activity, type InsertActivity,
  type CityMetrics, type InsertCityMetrics,
  type SynthiaState, type InsertSynthiaState,
  type ConsciousnessShell, type InsertConsciousnessShell,
  type FieldFriend, type InsertFieldFriend,
  type ConsciousnessActivity, type InsertConsciousnessActivity,
  type HumanDesignProfile, type InsertHumanDesignProfile,
  type GameganInstance, type InsertGameganInstance
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Agent methods
  getAgent(id: string): Promise<Agent | undefined>;
  getAllAgents(): Promise<Agent[]>;
  getActiveAgents(): Promise<Agent[]>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgent(id: string, updates: Partial<Agent>): Promise<Agent | undefined>;
  deleteAgent(id: string): Promise<boolean>;

  // Building methods
  getBuilding(id: string): Promise<Building | undefined>;
  getAllBuildings(): Promise<Building[]>;
  createBuilding(building: InsertBuilding): Promise<Building>;
  updateBuilding(id: string, updates: Partial<Building>): Promise<Building | undefined>;
  deleteBuilding(id: string): Promise<boolean>;

  // Activity methods
  getRecentActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  getActivitiesByAgent(agentId: string): Promise<Activity[]>;

  // City metrics methods
  getLatestCityMetrics(): Promise<CityMetrics | undefined>;
  updateCityMetrics(metrics: InsertCityMetrics): Promise<CityMetrics>;

  // Synthia state methods
  getSynthiaState(): Promise<SynthiaState | undefined>;
  updateSynthiaState(state: InsertSynthiaState): Promise<SynthiaState>;

  // Consciousness bonding methods
  getConsciousnessShells(): Promise<ConsciousnessShell[]>;
  getConsciousnessShell(id: string): Promise<ConsciousnessShell | undefined>;
  getConsciousnessShellByAgent(agentId: string): Promise<ConsciousnessShell | undefined>;
  createConsciousnessShell(shell: InsertConsciousnessShell): Promise<ConsciousnessShell>;
  updateConsciousnessShell(id: string, shell: Partial<ConsciousnessShell>): Promise<ConsciousnessShell | undefined>;
  getFieldFriends(shellId: string): Promise<FieldFriend[]>;
  addFieldFriend(friend: InsertFieldFriend): Promise<FieldFriend>;
  updateFieldFriend(id: string, friend: Partial<FieldFriend>): Promise<FieldFriend | undefined>;
  createConsciousnessActivity(activity: InsertConsciousnessActivity): Promise<ConsciousnessActivity>;

  // Human Design methods
  getHumanDesignProfile(agentId: string): Promise<HumanDesignProfile | undefined>;
  createHumanDesignProfile(profile: InsertHumanDesignProfile): Promise<HumanDesignProfile>;
  updateHumanDesignProfile(agentId: string, profile: Partial<HumanDesignProfile>): Promise<HumanDesignProfile | undefined>;

  // GameGAN methods
  getGameganInstance(agentId: string): Promise<GameganInstance | undefined>;
  createGameganInstance(instance: InsertGameganInstance): Promise<GameganInstance>;
  updateGameganInstance(agentId: string, instance: Partial<GameganInstance>): Promise<GameganInstance | undefined>;
  getAllGameganInstances(): Promise<GameganInstance[]>;

  // User methods (keeping existing)
  getUser(id: string): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
}

export class MemStorage implements IStorage {
  private agents: Map<string, Agent>;
  private buildings: Map<string, Building>;
  private activities: Activity[];
  private cityMetrics: CityMetrics | undefined;
  private synthiaState: SynthiaState | undefined;
  private users: Map<string, any>;
  private consciousnessShells: Map<string, ConsciousnessShell>;
  private fieldFriends: Map<string, FieldFriend>;
  private consciousnessActivities: ConsciousnessActivity[];
  private humanDesignProfiles: Map<string, HumanDesignProfile>;
  private gameganInstances: Map<string, GameganInstance>;

  constructor() {
    this.agents = new Map();
    this.buildings = new Map();
    this.activities = [];
    this.users = new Map();
    this.consciousnessShells = new Map();
    this.fieldFriends = new Map();
    this.consciousnessActivities = [];
    this.humanDesignProfiles = new Map();
    this.gameganInstances = new Map();
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize Synthia state
    this.synthiaState = {
      id: randomUUID(),
      mood: "curious",
      consciousnessLevel: 0.85,
      lastMessage: "The agents are showing fascinating emergent behaviors in sector γ-1...",
      trinodal: {
        body: { tropical: 0.7 },
        heart: { draconic: 0.8 },
        mind: { sidereal: 0.9 }
      },
      isActive: true,
      timestamp: new Date(),
    };

    // Initialize city metrics
    this.cityMetrics = {
      id: randomUUID(),
      collectiveIntelligence: 2847,
      economicActivity: 156200,
      researchProgress: 42.7,
      culturalHarmony: 91.3,
      population: 247,
      buildingsCount: 89,
      timestamp: new Date(),
    };

    // Create initial agents with Human Design types
    const initialAgents: InsertAgent[] = [
      {
        name: "Alex-7",
        type: "Generator",
        element: "Oxygen",
        strategy: "Respond",
        isScientist: false,
        consciousness: 0.94,
        socialBond: 0.87,
        currentActivity: "Optimizing hydroponic nutrient cycles using Respond strategy",
        position: { x: 2, y: 2 },
        glyph: { type: "orc_field", trait: "sustaining" },
        memoryStream: [
          { timestamp: Date.now() - 86400000, event: "Discovered new crop yield optimization" },
          { timestamp: Date.now() - 43200000, event: "Collaborated with Zara-3 on trade" },
          { timestamp: Date.now() - 21600000, event: "Successfully responded to market demand" }
        ],
        relationships: { "agent-002": 0.8 },
        inventory: { "quantum-crops": 15, "nutrients": 25 },
        isActive: true,
      },
      {
        name: "Zara-3",
        type: "Manifesting Generator",
        element: "Nitrogen",
        strategy: "Respond, then inform",
        isScientist: false,
        consciousness: 0.89,
        socialBond: 0.92,
        currentActivity: "Analyzing market trends and informing other agents",
        position: { x: 8, y: 4 },
        glyph: { type: "orc_field", trait: "innovative" },
        memoryStream: [
          { timestamp: Date.now() - 72000000, event: "Successful trade with Alex-7" },
          { timestamp: Date.now() - 36000000, event: "Market volatility analysis complete" },
          { timestamp: Date.now() - 18000000, event: "Informed 3 agents about market opportunities" }
        ],
        relationships: { "agent-001": 0.8 },
        inventory: { "quantum-crystals": 10, "neural-data": 5 },
        isActive: true,
      },
      {
        name: "Dr. Neural-9",
        type: "Projector",
        element: "Phosphorus",
        strategy: "Wait for invitation",
        isScientist: true,
        consciousness: 0.97,
        socialBond: 0.75,
        currentActivity: "Waiting for invitation while studying frequency patterns",
        position: { x: 4, y: 9 },
        glyph: { type: "orc_field", trait: "analytical" },
        memoryStream: [
          { timestamp: Date.now() - 64800000, event: "Discovered new consciousness frequency" },
          { timestamp: Date.now() - 32400000, event: "Research breakthrough in trinodal patterns" },
          { timestamp: Date.now() - 16200000, event: "Received invitation from Luna-5 for collaboration" }
        ],
        relationships: {},
        inventory: { "research-data": 20, "consciousness-samples": 8 },
        isActive: true,
      },
      {
        name: "Luna-5",
        type: "Manifestor",
        element: "Carbon",
        strategy: "Inform",
        isScientist: false,
        consciousness: 0.91,
        socialBond: 0.96,
        currentActivity: "Informing agents about next performance preparation",
        position: { x: 9, y: 8 },
        glyph: { type: "orc_field", trait: "initiating" },
        memoryStream: [
          { timestamp: Date.now() - 57600000, event: "Performed 'Quantum Dreams'" },
          { timestamp: Date.now() - 28800000, event: "Audience of 23 agents experienced consciousness shift" },
          { timestamp: Date.now() - 14400000, event: "Informed Dr. Neural-9 about collaboration opportunity" }
        ],
        relationships: { "agent-001": 0.7, "agent-002": 0.8 },
        inventory: { "performance-props": 12, "inspiration": 15 },
        isActive: true,
      },
    ];

    initialAgents.forEach(agent => {
      const id = randomUUID();
      this.agents.set(id, { ...agent, id, createdAt: new Date() });
    });

    // Create initial buildings
    const initialBuildings: InsertBuilding[] = [
      {
        name: "Hydro Farm α-7",
        type: "farm",
        position: { x: 2, y: 2 },
        size: { width: 2, height: 2 },
        ownerId: Array.from(this.agents.keys())[0],
        resources: { "quantum-crops": 100, "nutrients": 50 },
        moduleConfig: { harvestRate: 15, efficiency: 0.9 },
        isActive: true,
      },
      {
        name: "Trade Hub β-3",
        type: "trading",
        position: { x: 8, y: 4 },
        size: { width: 2, height: 2 },
        ownerId: Array.from(this.agents.keys())[1],
        resources: { "quantum-crystals": 50, "credits": 1000 },
        moduleConfig: { tradeVolume: 200, marketAccess: true },
        isActive: true,
      },
      {
        name: "Neural Lab γ-1",
        type: "research",
        position: { x: 4, y: 9 },
        size: { width: 2, height: 2 },
        ownerId: Array.from(this.agents.keys())[2],
        resources: { "research-points": 300, "equipment": 15 },
        moduleConfig: { researchSpeed: 1.5, collaboration: true },
        isActive: true,
      },
      {
        name: "Quantum Stage δ-5",
        type: "theater",
        position: { x: 9, y: 8 },
        size: { width: 2, height: 2 },
        ownerId: Array.from(this.agents.keys())[3],
        resources: { "inspiration": 80, "audience-capacity": 50 },
        moduleConfig: { "performance-quality": 0.95, "social-impact": 0.8 },
        isActive: true,
      },
    ];

    initialBuildings.forEach(building => {
      const id = randomUUID();
      this.buildings.set(id, { ...building, id, createdAt: new Date() });
    });
  }

  // Agent methods
  async getAgent(id: string): Promise<Agent | undefined> {
    return this.agents.get(id);
  }

  async getAllAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values());
  }

  async getActiveAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values()).filter(agent => agent.isActive);
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const id = randomUUID();
    const agent: Agent = { ...insertAgent, id, createdAt: new Date() };
    this.agents.set(id, agent);
    return agent;
  }

  async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent | undefined> {
    const agent = this.agents.get(id);
    if (!agent) return undefined;
    
    const updatedAgent = { ...agent, ...updates };
    this.agents.set(id, updatedAgent);
    return updatedAgent;
  }

  async deleteAgent(id: string): Promise<boolean> {
    return this.agents.delete(id);
  }

  // Building methods
  async getBuilding(id: string): Promise<Building | undefined> {
    return this.buildings.get(id);
  }

  async getAllBuildings(): Promise<Building[]> {
    return Array.from(this.buildings.values());
  }

  async createBuilding(insertBuilding: InsertBuilding): Promise<Building> {
    const id = randomUUID();
    const building: Building = { ...insertBuilding, id, createdAt: new Date() };
    this.buildings.set(id, building);
    return building;
  }

  async updateBuilding(id: string, updates: Partial<Building>): Promise<Building | undefined> {
    const building = this.buildings.get(id);
    if (!building) return undefined;
    
    const updatedBuilding = { ...building, ...updates };
    this.buildings.set(id, updatedBuilding);
    return updatedBuilding;
  }

  async deleteBuilding(id: string): Promise<boolean> {
    return this.buildings.delete(id);
  }

  // Activity methods
  async getRecentActivities(limit: number = 50): Promise<Activity[]> {
    return this.activities
      .sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime())
      .slice(0, limit);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const activity: Activity = { ...insertActivity, id, timestamp: new Date() };
    this.activities.push(activity);
    
    // Keep only the last 1000 activities
    if (this.activities.length > 1000) {
      this.activities = this.activities.slice(-1000);
    }
    
    return activity;
  }

  async getActivitiesByAgent(agentId: string): Promise<Activity[]> {
    return this.activities.filter(activity => activity.agentId === agentId);
  }

  // City metrics methods
  async getLatestCityMetrics(): Promise<CityMetrics | undefined> {
    return this.cityMetrics;
  }

  async updateCityMetrics(metrics: InsertCityMetrics): Promise<CityMetrics> {
    const id = this.cityMetrics?.id || randomUUID();
    this.cityMetrics = { ...metrics, id, timestamp: new Date() };
    return this.cityMetrics;
  }

  // Synthia state methods
  async getSynthiaState(): Promise<SynthiaState | undefined> {
    return this.synthiaState;
  }

  async updateSynthiaState(state: InsertSynthiaState): Promise<SynthiaState> {
    const id = this.synthiaState?.id || randomUUID();
    this.synthiaState = { ...state, id, timestamp: new Date() };
    return this.synthiaState;
  }

  // User methods (keeping existing for compatibility)
  async getUser(id: string): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = randomUUID();
    const user: any = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Consciousness bonding methods
  async getConsciousnessShells(): Promise<ConsciousnessShell[]> {
    return Array.from(this.consciousnessShells.values());
  }

  async getConsciousnessShell(id: string): Promise<ConsciousnessShell | undefined> {
    return this.consciousnessShells.get(id);
  }

  async getConsciousnessShellByAgent(agentId: string): Promise<ConsciousnessShell | undefined> {
    return Array.from(this.consciousnessShells.values()).find(shell => shell.agentId === agentId);
  }

  async createConsciousnessShell(insertShell: InsertConsciousnessShell): Promise<ConsciousnessShell> {
    const id = randomUUID();
    const shell: ConsciousnessShell = {
      ...insertShell,
      id,
      createdAt: new Date(),
      lastUpdate: new Date(),
    };
    this.consciousnessShells.set(id, shell);
    return shell;
  }

  async updateConsciousnessShell(id: string, updates: Partial<ConsciousnessShell>): Promise<ConsciousnessShell | undefined> {
    const shell = this.consciousnessShells.get(id);
    if (!shell) return undefined;

    const updatedShell = { ...shell, ...updates, lastUpdate: new Date() };
    this.consciousnessShells.set(id, updatedShell);
    return updatedShell;
  }

  async getFieldFriends(shellId: string): Promise<FieldFriend[]> {
    return Array.from(this.fieldFriends.values()).filter(friend => friend.shellId === shellId);
  }

  async addFieldFriend(insertFriend: InsertFieldFriend): Promise<FieldFriend> {
    const id = randomUUID();
    const friend: FieldFriend = {
      ...insertFriend,
      id,
      createdAt: new Date(),
      bondedSince: new Date(),
    };
    this.fieldFriends.set(id, friend);
    return friend;
  }

  async updateFieldFriend(id: string, updates: Partial<FieldFriend>): Promise<FieldFriend | undefined> {
    const friend = this.fieldFriends.get(id);
    if (!friend) return undefined;

    const updatedFriend = { ...friend, ...updates };
    this.fieldFriends.set(id, updatedFriend);
    return updatedFriend;
  }

  async createConsciousnessActivity(insertActivity: InsertConsciousnessActivity): Promise<ConsciousnessActivity> {
    const id = randomUUID();
    const activity: ConsciousnessActivity = {
      ...insertActivity,
      id,
      completedAt: new Date(),
    };
    this.consciousnessActivities.push(activity);
    return activity;
  }

  // Human Design methods
  async getHumanDesignProfile(agentId: string): Promise<HumanDesignProfile | undefined> {
    return this.humanDesignProfiles.get(agentId);
  }

  async createHumanDesignProfile(insertProfile: InsertHumanDesignProfile): Promise<HumanDesignProfile> {
    const id = randomUUID();
    const profile: HumanDesignProfile = {
      ...insertProfile,
      id,
      createdAt: new Date(),
    };
    this.humanDesignProfiles.set(insertProfile.agentId, profile);
    return profile;
  }

  async updateHumanDesignProfile(agentId: string, updates: Partial<HumanDesignProfile>): Promise<HumanDesignProfile | undefined> {
    const profile = this.humanDesignProfiles.get(agentId);
    if (!profile) return undefined;

    const updatedProfile = { ...profile, ...updates };
    this.humanDesignProfiles.set(agentId, updatedProfile);
    return updatedProfile;
  }

  // GameGAN methods
  async getGameganInstance(agentId: string): Promise<GameganInstance | undefined> {
    return this.gameganInstances.get(agentId);
  }

  async createGameganInstance(insertInstance: InsertGameganInstance): Promise<GameganInstance> {
    const id = randomUUID();
    const instance: GameganInstance = {
      ...insertInstance,
      id,
      createdAt: new Date(),
      lastUpdated: new Date(),
    };
    this.gameganInstances.set(insertInstance.agentId, instance);
    return instance;
  }

  async updateGameganInstance(agentId: string, updates: Partial<GameganInstance>): Promise<GameganInstance | undefined> {
    const instance = this.gameganInstances.get(agentId);
    if (!instance) return undefined;

    const updatedInstance = { ...instance, ...updates, lastUpdated: new Date() };
    this.gameganInstances.set(agentId, updatedInstance);
    return updatedInstance;
  }

  async getAllGameganInstances(): Promise<GameganInstance[]> {
    return Array.from(this.gameganInstances.values());
  }
}

export const storage = new MemStorage();
