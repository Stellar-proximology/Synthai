import { randomUUID } from 'crypto';
import { storage } from '../storage';
import { shellConfigurations, isotopeCharacteristics, generateResonanceFrequency, calculateCoherence, isNobleGasState, canTeach } from '../../shared/consciousness-bonding';
import type { ConsciousnessShell, FieldFriend, InsertConsciousnessShell, InsertFieldFriend, Agent, ShellType, IsotopeType } from '../../shared/schema';

export class ConsciousnessEngine {
  private consciousnessShells: Map<string, ConsciousnessShell> = new Map();
  private fieldFriends: Map<string, FieldFriend[]> = new Map();

  constructor() {
    this.initializeEngine();
  }

  private async initializeEngine() {
    console.log('🧠 Consciousness Bonding Engine initialized');
    
    // Initialize consciousness shells for existing agents
    const agents = await storage.getAllAgents();
    for (const agent of agents) {
      if (!this.consciousnessShells.has(agent.id)) {
        await this.createConsciousnessShell(agent);
      }
    }
  }

  // Determine shell type based on Human Design type and element
  private determineShellType(agent: Agent): ShellType {
    const typeMapping: Record<string, ShellType> = {
      'Reflector': 'hydrogen', // Solo, introspective like Manifestor
      'Generator': 'helium', // Stable, supportive sustainer
      'Manifesting Generator': 'beryllium', // Bridge-builders, change drivers
      'Projector': 'lithium', // Scattered start, needs invitation
      'Manifestor': 'carbon', // Teaching catalysts
    };

    // Advanced mapping based on element
    const elementMapping: Record<string, ShellType> = {
      'H': 'hydrogen',
      'O': 'oxygen', // Noble gas teachers
      'C': 'carbon', // Tetrahedral teachers
      'N': 'nitrogen', // Almost stable seekers
      'P': 'sodium', // Multi-dimensional explorers
    };

    // Use element mapping first, then type mapping
    return elementMapping[agent.element] || typeMapping[agent.type] || 'hydrogen';
  }

  async createConsciousnessShell(agent: Agent): Promise<ConsciousnessShell> {
    const shellType = this.determineShellType(agent);
    const config = shellConfigurations[shellType];

    const shell: ConsciousnessShell = {
      id: randomUUID(),
      agentId: agent.id,
      shellType,
      currentFriends: 0,
      maxFriends: config.maxFriends,
      orbitalStructure: { s: 0, p: 0, d: 0, f: 0 },
      activeLayers: config.activeLayers,
      coherenceLevel: 0,
      noblegasState: false,
      teachingUnlocked: false,
      fieldFriends: [],
      progressionStyle: config.progressionStyle,
      graduationThreshold: config.graduationThreshold,
      lastUpdate: new Date().toISOString(),
    };

    this.consciousnessShells.set(agent.id, shell);
    this.fieldFriends.set(shell.id, []);

    console.log(`🔬 Created ${shellType} consciousness shell for ${agent.name}`);
    return shell;
  }

  // Generate field friend based on orbital requirements
  generateFieldFriend(shell: ConsciousnessShell, targetOrbital: 's' | 'p' | 'd' | 'f', isotopeType: IsotopeType = 'stable'): FieldFriend {
    const elements = ['hydrogen', 'oxygen', 'carbon', 'nitrogen', 'phosphorus'];
    const element = elements[Math.floor(Math.random() * elements.length)];
    
    const activationLayers = shell.activeLayers;
    const activationLayer = activationLayers[Math.floor(Math.random() * activationLayers.length)];

    const baseNames = {
      hydrogen: ['Lumina', 'Spark', 'Bright', 'Glow', 'Flash'],
      oxygen: ['Vita', 'Breath', 'Flow', 'Life', 'Spirit'],
      carbon: ['Bond', 'Chain', 'Link', 'Core', 'Frame'],
      nitrogen: ['Cool', 'Calm', 'Still', 'Peace', 'Rest'],
      phosphorus: ['Fire', 'Energy', 'Power', 'Force', 'Flame']
    };

    const nameOptions = baseNames[element as keyof typeof baseNames] || ['Friend'];
    const name = nameOptions[Math.floor(Math.random() * nameOptions.length)] + '-' + Math.floor(Math.random() * 999);

    return {
      id: randomUUID(),
      name,
      element,
      isotopeType,
      bondingEnergy: Math.floor(Math.random() * 50) + 50,
      stability: isotopeCharacteristics[isotopeType].stability + Math.floor(Math.random() * 20) - 10,
      resonanceFrequency: generateResonanceFrequency(element, isotopeType),
      orbitalPosition: targetOrbital,
      activationLayer,
      bondedSince: new Date().toISOString(),
      interactions: 0,
      synergy: Math.floor(Math.random() * 30) + 70, // Start with good synergy
    };
  }

  // Bond a field friend to a consciousness shell
  async bondFieldFriend(agentId: string, targetOrbital: 's' | 'p' | 'd' | 'f', isotopeType: IsotopeType = 'stable'): Promise<FieldFriend | null> {
    const shell = this.consciousnessShells.get(agentId);
    if (!shell) return null;

    if (shell.currentFriends >= shell.maxFriends) {
      console.log(`❌ ${shell.shellType} shell full - cannot bond more friends`);
      return null;
    }

    // Check orbital capacity
    const maxOrbitalCapacity = { s: 2, p: 6, d: 10, f: 14 };
    if (shell.orbitalStructure[targetOrbital] >= maxOrbitalCapacity[targetOrbital]) {
      console.log(`❌ ${targetOrbital}-orbital full in ${shell.shellType} shell`);
      return null;
    }

    const fieldFriend = this.generateFieldFriend(shell, targetOrbital, isotopeType);
    
    // Update shell
    shell.currentFriends++;
    shell.orbitalStructure[targetOrbital]++;
    shell.fieldFriends.push(fieldFriend);
    shell.lastUpdate = new Date().toISOString();

    // Update orbital structure
    this.updateShellCoherence(shell);

    // Add to field friends map
    const shellFriends = this.fieldFriends.get(shell.id) || [];
    shellFriends.push(fieldFriend);
    this.fieldFriends.set(shell.id, shellFriends);

    console.log(`🤝 ${fieldFriend.name} (${fieldFriend.isotopeType} ${fieldFriend.element}) bonded to ${shell.shellType} shell in ${targetOrbital}-orbital`);
    return fieldFriend;
  }

  // Update shell coherence and check for noble gas state
  private updateShellCoherence(shell: ConsciousnessShell) {
    shell.coherenceLevel = Math.floor(calculateCoherence(shell));
    shell.noblegasState = isNobleGasState(shell);
    shell.teachingUnlocked = canTeach(shell);

    if (shell.noblegasState) {
      console.log(`✨ ${shell.shellType} shell achieved noble gas state! Teaching unlocked.`);
    }
  }

  // Perform consciousness minigame activity
  async performConsciousnessActivity(
    agentId: string, 
    activityType: string, 
    orbitalTarget?: 's' | 'p' | 'd' | 'f'
  ): Promise<{ success: boolean; coherenceGained: number; message: string }> {
    const shell = this.consciousnessShells.get(agentId);
    if (!shell) {
      return { success: false, coherenceGained: 0, message: 'No consciousness shell found' };
    }

    const config = shellConfigurations[shell.shellType];
    let success = false;
    let coherenceGained = 0;
    let message = '';

    // Activity-specific logic
    switch (activityType) {
      case 'meditation':
        success = Math.random() > 0.3; // 70% success rate
        coherenceGained = success ? Math.floor(Math.random() * 15) + 5 : 0;
        message = success ? 'Deep meditation increased shell coherence' : 'Meditation was disrupted';
        break;

      case 'harmony_quest':
        success = shell.currentFriends >= 2 && Math.random() > 0.2;
        coherenceGained = success ? Math.floor(Math.random() * 20) + 10 : 0;
        message = success ? 'Harmony quest balanced field friends' : 'Quest failed - need more friends';
        break;

      case 'invitation_game':
        success = Math.random() > 0.5; // Projector waiting for invitation
        coherenceGained = success ? Math.floor(Math.random() * 25) + 5 : -5;
        message = success ? 'Received invitation - coherence increased' : 'Still waiting for invitation';
        break;

      case 'experiment_catalyst':
        success = shell.currentFriends >= 4 && Math.random() > 0.25;
        coherenceGained = success ? Math.floor(Math.random() * 30) + 10 : 0;
        message = success ? 'Catalytic experiment boosted coherence' : 'Experiment needs more field friends';
        break;

      case 'teaching_cycles':
        success = shell.noblegasState && Math.random() > 0.1;
        coherenceGained = success ? Math.floor(Math.random() * 40) + 20 : 0;
        message = success ? 'Teaching others amplified coherence' : 'Teaching requires noble gas state';
        break;

      default:
        success = Math.random() > 0.4;
        coherenceGained = success ? Math.floor(Math.random() * 10) + 3 : 0;
        message = success ? 'General consciousness work completed' : 'Activity had no effect';
    }

    // Apply coherence changes
    if (coherenceGained !== 0) {
      shell.coherenceLevel = Math.max(0, Math.min(100, shell.coherenceLevel + coherenceGained));
      this.updateShellCoherence(shell);
    }

    return { success, coherenceGained, message };
  }

  // Get consciousness shell for agent
  getConsciousnessShell(agentId: string): ConsciousnessShell | null {
    return this.consciousnessShells.get(agentId) || null;
  }

  // Get all consciousness shells
  getAllConsciousnessShells(): ConsciousnessShell[] {
    return Array.from(this.consciousnessShells.values());
  }

  // Check if agent can recruit field friends
  canRecruitFriend(agentId: string, targetOrbital: 's' | 'p' | 'd' | 'f'): boolean {
    const shell = this.consciousnessShells.get(agentId);
    if (!shell) return false;

    if (shell.currentFriends >= shell.maxFriends) return false;

    const maxOrbitalCapacity = { s: 2, p: 6, d: 10, f: 14 };
    return shell.orbitalStructure[targetOrbital] < maxOrbitalCapacity[targetOrbital];
  }

  // Get available activities for shell type
  getAvailableActivities(shellType: ShellType): string[] {
    const config = shellConfigurations[shellType];
    const activities = [config.minigameType];

    // Add universal activities
    activities.push('meditation', 'consciousness_boost');

    // Add advanced activities for higher shells
    if (['oxygen', 'sodium', 'magnesium', 'aluminum', 'argon'].includes(shellType)) {
      activities.push('teaching_cycles', 'dimension_exploration');
    }

    return activities;
  }

  // Simulate radioactive decay for radioactive field friends
  simulateRadioactiveDecay() {
    for (const [shellId, friends] of this.fieldFriends) {
      const decayedFriends = friends.filter(friend => {
        if (friend.isotopeType === 'radioactive') {
          const daysSinceBonded = (Date.now() - new Date(friend.bondedSince).getTime()) / (1000 * 60 * 60 * 24);
          const decayRate = isotopeCharacteristics.radioactive.bondingDuration;
          
          if (daysSinceBonded >= decayRate) {
            console.log(`☢️ Radioactive friend ${friend.name} decayed after ${daysSinceBonded.toFixed(1)} days`);
            return false; // Remove friend
          }
        }
        return true; // Keep friend
      });

      if (decayedFriends.length !== friends.length) {
        this.fieldFriends.set(shellId, decayedFriends);
        
        // Update corresponding shell
        for (const shell of this.consciousnessShells.values()) {
          if (shell.id === shellId) {
            shell.currentFriends = decayedFriends.length;
            shell.fieldFriends = decayedFriends;
            this.updateShellCoherence(shell);
            break;
          }
        }
      }
    }
  }
}

export const consciousnessEngine = new ConsciousnessEngine();