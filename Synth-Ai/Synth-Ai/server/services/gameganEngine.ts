/**
 * GameGAN Engine Integration
 * Simulates GameGAN functionality for personalized game creation
 * Based on the concepts from "Learning to Simulate Dynamic Environments with GameGAN"
 */

import type { GameganInstance, InsertGameganInstance, HumanDesignProfile } from '@shared/schema';

// Game types that can be generated
export const gameTypes = {
  "puzzle": {
    name: "Puzzle Adventure",
    description: "Mind-bending puzzles that adapt to your cognitive style",
    complexity: "medium",
    duration: "15-30 minutes"
  },
  "exploration": {
    name: "Exploration Quest",
    description: "Open-world discovery games tailored to your curiosity",
    complexity: "high",
    duration: "30-60 minutes"
  },
  "strategy": {
    name: "Strategic Challenge",
    description: "Decision-making games that align with your authority",
    complexity: "high",
    duration: "45-90 minutes"
  },
  "creative": {
    name: "Creative Sandbox",
    description: "Building and creation games for Generator types",
    complexity: "low",
    duration: "Open-ended"
  },
  "social": {
    name: "Social Interaction",
    description: "Multiplayer experiences designed for your aura type",
    complexity: "medium",
    duration: "20-40 minutes"
  },
  "meditative": {
    name: "Reflective Journey",
    description: "Contemplative experiences for Projectors and Reflectors",
    complexity: "low",
    duration: "10-20 minutes"
  }
} as const;

// Environment types for game generation
export const environmentTypes = {
  "cosmic": {
    theme: "Space and consciousness",
    elements: ["stars", "nebulae", "quantum fields", "dimensional portals"],
    mood: "transcendent"
  },
  "natural": {
    theme: "Earth and organic growth",
    elements: ["forests", "rivers", "mountains", "wildlife"],
    mood: "grounding"
  },
  "urban": {
    theme: "City and human connection",
    elements: ["buildings", "streets", "people", "technology"],
    mood: "dynamic"
  },
  "abstract": {
    theme: "Pure consciousness and geometry",
    elements: ["fractals", "patterns", "energy fields", "sacred geometry"],
    mood: "mystical"
  }
} as const;

/**
 * GameGAN Memory Module
 * Simulates the memory system from the GameGAN paper
 */
export class GameGANMemory {
  private environmentStates: Map<string, any> = new Map();
  private actionHistory: any[] = [];
  private memoryIntegrity: number = 0;

  constructor() {
    this.memoryIntegrity = Math.random() * 0.3 + 0.7; // 70-100% initial integrity
  }

  /**
   * Store environment state in memory
   */
  storeEnvironmentState(gameId: string, state: any): void {
    this.environmentStates.set(gameId, {
      ...state,
      timestamp: Date.now(),
      visits: (this.environmentStates.get(gameId)?.visits || 0) + 1
    });
    
    // Improve memory integrity with use
    this.memoryIntegrity = Math.min(1.0, this.memoryIntegrity + 0.01);
  }

  /**
   * Retrieve environment state from memory
   */
  retrieveEnvironmentState(gameId: string): any | null {
    const state = this.environmentStates.get(gameId);
    if (state) {
      // Slightly decay memory over time
      const ageHours = (Date.now() - state.timestamp) / (1000 * 60 * 60);
      const decayFactor = Math.exp(-ageHours * 0.1);
      return {
        ...state,
        confidence: this.memoryIntegrity * decayFactor
      };
    }
    return null;
  }

  /**
   * Record player action for learning
   */
  recordAction(action: any): void {
    this.actionHistory.push({
      ...action,
      timestamp: Date.now()
    });
    
    // Keep only recent actions (last 1000)
    if (this.actionHistory.length > 1000) {
      this.actionHistory = this.actionHistory.slice(-1000);
    }
  }

  /**
   * Get memory integrity score
   */
  getMemoryIntegrity(): number {
    return this.memoryIntegrity;
  }

  /**
   * Get action patterns for personalization
   */
  getActionPatterns(): any {
    if (this.actionHistory.length < 10) return null;
    
    const recentActions = this.actionHistory.slice(-100);
    const patterns = {
      preferredActions: this.getMostFrequentActions(recentActions),
      playTime: this.getAverageSessionLength(recentActions),
      difficulty: this.getPreferredDifficulty(recentActions),
      exploration: this.getExplorationStyle(recentActions)
    };
    
    return patterns;
  }

  private getMostFrequentActions(actions: any[]): string[] {
    const actionCounts: Record<string, number> = {};
    actions.forEach(action => {
      actionCounts[action.type] = (actionCounts[action.type] || 0) + 1;
    });
    
    return Object.entries(actionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([action]) => action);
  }

  private getAverageSessionLength(actions: any[]): number {
    if (actions.length < 2) return 0;
    
    const sessions: number[] = [];
    let sessionStart = actions[0].timestamp;
    
    for (let i = 1; i < actions.length; i++) {
      const timeDiff = actions[i].timestamp - actions[i-1].timestamp;
      if (timeDiff > 5 * 60 * 1000) { // 5 minute gap = new session
        sessions.push(actions[i-1].timestamp - sessionStart);
        sessionStart = actions[i].timestamp;
      }
    }
    
    if (sessions.length > 0) {
      return sessions.reduce((a, b) => a + b, 0) / sessions.length / (1000 * 60); // Convert to minutes
    }
    
    return 0;
  }

  private getPreferredDifficulty(actions: any[]): string {
    const difficulties = actions
      .filter(action => action.difficulty)
      .map(action => action.difficulty);
    
    if (difficulties.length === 0) return "medium";
    
    const difficultyMap: Record<string, number> = {};
    difficulties.forEach(diff => {
      difficultyMap[diff] = (difficultyMap[diff] || 0) + 1;
    });
    
    return Object.entries(difficultyMap)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || "medium";
  }

  private getExplorationStyle(actions: any[]): string {
    const explorationActions = actions.filter(action => 
      action.type === "explore" || action.type === "discover" || action.type === "investigate"
    );
    
    const ratio = explorationActions.length / actions.length;
    
    if (ratio > 0.6) return "explorer";
    if (ratio > 0.3) return "balanced";
    return "focused";
  }
}

/**
 * Generate a personalized game using GameGAN-inspired techniques
 */
export function generatePersonalizedGame(
  agentId: string,
  humanDesignProfile: HumanDesignProfile,
  playerPreferences?: any
): InsertGameganInstance {
  // Determine game type based on Human Design
  const gameType = selectGameTypeForHumanDesign(humanDesignProfile);
  const environmentType = selectEnvironmentForHumanDesign(humanDesignProfile);
  
  // Create memory module
  const memory = new GameGANMemory();
  
  // Generate initial environment
  const environment = generateInitialEnvironment(gameType, environmentType, humanDesignProfile);
  
  // Calculate resonance score based on alignment with Human Design
  const resonanceScore = calculateResonanceScore(gameType, environmentType, humanDesignProfile);
  
  return {
    agentId,
    gameType,
    environmentData: environment,
    memoryModule: {
      integrity: memory.getMemoryIntegrity(),
      environmentStates: {},
      actionHistory: [],
      learningRate: 0.1
    },
    gameState: {
      phase: "initialization",
      level: 1,
      objectives: generateObjectives(gameType, humanDesignProfile),
      playerProgress: {
        experience: 0,
        achievements: [],
        discoveries: []
      }
    },
    playerActions: [],
    generatedFrames: 0,
    personalizedFor: agentId,
    resonanceScore
  };
}

/**
 * Select game type based on Human Design profile
 */
function selectGameTypeForHumanDesign(profile: HumanDesignProfile): string {
  switch (profile.type) {
    case "Generator":
      return Math.random() > 0.5 ? "creative" : "exploration";
    case "Manifestor":
      return Math.random() > 0.5 ? "strategy" : "creative";
    case "Projector":
      return Math.random() > 0.5 ? "puzzle" : "meditative";
    case "Reflector":
      return Math.random() > 0.5 ? "social" : "meditative";
    default:
      return "puzzle";
  }
}

/**
 * Select environment based on Human Design profile
 */
function selectEnvironmentForHumanDesign(profile: HumanDesignProfile): string {
  const centers = profile.centers as any;
  const definedCenters = Object.values(centers).filter(Boolean).length;
  
  if (definedCenters >= 7) return "urban"; // Highly defined
  if (definedCenters >= 4) return "natural"; // Moderately defined
  if (definedCenters >= 2) return "cosmic"; // Less defined
  return "abstract"; // Undefined/Reflector
}

/**
 * Generate initial environment for the game
 */
function generateInitialEnvironment(
  gameType: string,
  environmentType: string,
  profile: HumanDesignProfile
): any {
  const envConfig = environmentTypes[environmentType as keyof typeof environmentTypes];
  const gameConfig = gameTypes[gameType as keyof typeof gameTypes];
  
  return {
    theme: envConfig.theme,
    mood: envConfig.mood,
    complexity: gameConfig.complexity,
    elements: envConfig.elements,
    dynamics: {
      timeOfDay: "dynamic",
      weather: "responsive",
      inhabitants: generateInhabitants(profile),
      resources: generateResources(gameType),
      challenges: generateChallenges(gameType, profile)
    },
    adaptiveFeatures: {
      respondsToStrategy: profile.strategy,
      honorsAuthority: profile.authority,
      alignsWithProfile: profile.profile
    }
  };
}

/**
 * Generate game objectives based on type and Human Design
 */
function generateObjectives(gameType: string, profile: HumanDesignProfile): any[] {
  const baseObjectives = {
    "puzzle": [
      { type: "solve", description: "Unlock the consciousness puzzle", difficulty: "medium" },
      { type: "discover", description: "Find hidden patterns", difficulty: "easy" },
      { type: "connect", description: "Link all energy centers", difficulty: "hard" }
    ],
    "exploration": [
      { type: "explore", description: "Map the quantum realm", difficulty: "medium" },
      { type: "collect", description: "Gather consciousness crystals", difficulty: "easy" },
      { type: "unlock", description: "Access new dimensions", difficulty: "hard" }
    ],
    "strategy": [
      { type: "plan", description: "Design the optimal path", difficulty: "hard" },
      { type: "manage", description: "Balance energy resources", difficulty: "medium" },
      { type: "lead", description: "Guide other entities", difficulty: "hard" }
    ],
    "creative": [
      { type: "build", description: "Create your reality", difficulty: "medium" },
      { type: "design", description: "Craft unique experiences", difficulty: "easy" },
      { type: "share", description: "Inspire others", difficulty: "medium" }
    ],
    "social": [
      { type: "connect", description: "Form meaningful bonds", difficulty: "medium" },
      { type: "collaborate", description: "Work together", difficulty: "easy" },
      { type: "harmonize", description: "Create group resonance", difficulty: "hard" }
    ],
    "meditative": [
      { type: "reflect", description: "Find inner clarity", difficulty: "easy" },
      { type: "balance", description: "Achieve equilibrium", difficulty: "medium" },
      { type: "transcend", description: "Reach higher awareness", difficulty: "hard" }
    ]
  };
  
  return baseObjectives[gameType as keyof typeof baseObjectives] || baseObjectives.puzzle;
}

/**
 * Generate inhabitants based on Human Design profile
 */
function generateInhabitants(profile: HumanDesignProfile): any[] {
  const inhabitants: any[] = [];
  
  // Add complementary types for interaction
  const allTypes = ["Generator", "Manifestor", "Projector", "Reflector"];
  const otherTypes = allTypes.filter(type => type !== profile.type);
  
  otherTypes.forEach(type => {
    inhabitants.push({
      type,
      name: `${type} Guide`,
      role: `Teaches ${type} wisdom`,
      interaction: getInteractionStyle(profile.type, type)
    });
  });
  
  return inhabitants;
}

/**
 * Generate resources for the game type
 */
function generateResources(gameType: string): any[] {
  const resourcesByType = {
    "puzzle": ["logic-crystals", "pattern-keys", "consciousness-fragments"],
    "exploration": ["energy-cells", "dimension-maps", "quantum-compasses"],
    "strategy": ["command-tokens", "resource-pools", "time-crystals"],
    "creative": ["creation-matter", "inspiration-sparks", "reality-clay"],
    "social": ["connection-threads", "harmony-stones", "empathy-pools"],
    "meditative": ["serenity-orbs", "balance-stones", "transcendence-light"]
  };
  
  const resources = resourcesByType[gameType as keyof typeof resourcesByType] || resourcesByType.puzzle;
  
  return resources.map(resource => ({
    name: resource,
    quantity: Math.floor(Math.random() * 50) + 10,
    renewable: Math.random() > 0.5,
    difficulty: ["easy", "medium", "hard"][Math.floor(Math.random() * 3)]
  }));
}

/**
 * Generate challenges based on game type and profile
 */
function generateChallenges(gameType: string, profile: HumanDesignProfile): any[] {
  const baseChallenges = {
    "puzzle": ["Logic Gates", "Pattern Recognition", "System Analysis"],
    "exploration": ["Navigation Puzzles", "Hidden Passages", "Environmental Hazards"],
    "strategy": ["Resource Management", "Time Constraints", "Complex Decisions"],
    "creative": ["Material Limitations", "Inspiration Blocks", "Sharing Barriers"],
    "social": ["Communication Gaps", "Conflict Resolution", "Group Dynamics"],
    "meditative": ["Mental Noise", "Emotional Turbulence", "Spiritual Obstacles"]
  };
  
  const challenges = baseChallenges[gameType as keyof typeof baseChallenges] || baseChallenges.puzzle;
  
  return challenges.map(challenge => ({
    name: challenge,
    description: `Navigate ${challenge.toLowerCase()} using your ${profile.strategy} strategy`,
    difficulty: getChallengeDifficulty(profile.type),
    solution: `Honor your ${profile.authority} authority`,
    reward: "Consciousness expansion"
  }));
}

/**
 * Calculate resonance score between game and Human Design profile
 */
function calculateResonanceScore(
  gameType: string,
  environmentType: string,
  profile: HumanDesignProfile
): number {
  let score = 0.5; // Base score
  
  // Type alignment bonus
  const typeBonus: Record<string, Record<string, number>> = {
    "Generator": { "creative": 0.3, "exploration": 0.2 },
    "Manifestor": { "strategy": 0.3, "creative": 0.2 },
    "Projector": { "puzzle": 0.3, "meditative": 0.2 },
    "Reflector": { "social": 0.3, "meditative": 0.2 }
  };
  
  const bonus = typeBonus[profile.type]?.[gameType] || 0;
  score += bonus;
  
  // Environment alignment
  const envBonus = {
    "cosmic": 0.1,
    "natural": 0.05,
    "urban": 0.05,
    "abstract": 0.15
  };
  
  score += envBonus[environmentType as keyof typeof envBonus] || 0;
  
  // Profile complexity bonus
  const centers = profile.centers as any;
  const definedCenters = Object.values(centers).filter(Boolean).length;
  score += (definedCenters / 9) * 0.2; // Up to 20% bonus for definition
  
  return Math.min(1.0, Math.max(0.0, score));
}

/**
 * Get challenge difficulty based on Human Design type
 */
function getChallengeDifficulty(type: string): string {
  const difficulties = {
    "Generator": "medium", // Steady energy
    "Manifestor": "hard", // Intense bursts
    "Projector": "easy", // Guided wisdom
    "Reflector": "variable" // Depends on environment
  };
  
  return difficulties[type as keyof typeof difficulties] || "medium";
}

/**
 * Get interaction style between Human Design types
 */
function getInteractionStyle(type1: string, type2: string): string {
  if (type1 === "Generator" && type2 === "Projector") return "guidance-seeking";
  if (type1 === "Projector" && type2 === "Generator") return "energy-management";
  if (type1 === "Manifestor") return "information-sharing";
  if (type2 === "Manifestor") return "space-giving";
  if (type1 === "Reflector" || type2 === "Reflector") return "environment-sampling";
  
  return "mutual-learning";
}

/**
 * Process player action and update game state
 */
export function processPlayerAction(
  gameInstance: GameganInstance,
  action: any
): { updatedGame: GameganInstance; response: any } {
  const memory = new GameGANMemory();
  
  // Record action in memory
  memory.recordAction(action);
  
  // Update game state based on action
  const gameState = gameInstance.gameState as any;
  const updatedGameState = {
    ...gameState,
    playerProgress: {
      ...gameState.playerProgress,
      experience: gameState.playerProgress.experience + (action.value || 1)
    }
  };
  
  // Generate response frame (simulated)
  const responseFrame = generateResponseFrame(gameInstance, action);
  
  const updatedGame: GameganInstance = {
    ...gameInstance,
    gameState: updatedGameState,
    playerActions: [...(gameInstance.playerActions as any[]), action],
    generatedFrames: gameInstance.generatedFrames + 1,
    memoryModule: {
      ...(gameInstance.memoryModule as any),
      integrity: memory.getMemoryIntegrity()
    }
  };
  
  return {
    updatedGame,
    response: responseFrame
  };
}

/**
 * Generate response frame for player action
 */
function generateResponseFrame(gameInstance: GameganInstance, action: any): any {
  return {
    frameId: gameInstance.generatedFrames + 1,
    timestamp: Date.now(),
    environment: {
      ...(gameInstance.environmentData as any),
      lastAction: action.type,
      response: `Environment responds to ${action.type} action`
    },
    feedback: {
      success: Math.random() > 0.3, // 70% success rate
      message: generateActionFeedback(action, gameInstance),
      nextSuggestion: generateNextSuggestion(action, gameInstance)
    }
  };
}

/**
 * Generate feedback for player action
 */
function generateActionFeedback(action: any, gameInstance: GameganInstance): string {
  const feedbackTemplates = {
    "explore": "Your exploration reveals new pathways in the quantum field...",
    "create": "Your creative energy manifests new possibilities...",
    "solve": "Your analytical mind unlocks hidden patterns...",
    "connect": "Your connection creates resonance with other entities...",
    "meditate": "Your reflection brings clarity to the consciousness stream..."
  };
  
  return feedbackTemplates[action.type as keyof typeof feedbackTemplates] || 
         "Your action ripples through the fabric of this reality...";
}

/**
 * Generate next action suggestion
 */
function generateNextSuggestion(action: any, gameInstance: GameganInstance): string {
  const suggestions = {
    "explore": "Consider investigating the energy signature you've discovered",
    "create": "Try building upon this foundation with complementary elements",
    "solve": "Apply this insight to the larger pattern emerging",
    "connect": "Deepen this connection to unlock its full potential",
    "meditate": "Integrate this wisdom into your next conscious action"
  };
  
  return suggestions[action.type as keyof typeof suggestions] || 
         "Follow your inner guidance to the next step";
}