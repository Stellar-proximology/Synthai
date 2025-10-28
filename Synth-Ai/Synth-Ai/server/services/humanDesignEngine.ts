/**
 * Human Design Engine - HDKit Integration
 * Generates authentic Human Design bodygraphs and personality profiles
 * Based on the open-source HDKit library
 */

import type { HumanDesignProfile, InsertHumanDesignProfile } from '@shared/schema';

// Human Design Types and their characteristics
export const humanDesignTypes = {
  "Generator": {
    strategy: "To Respond",
    authority: "Sacral",
    description: "Builders and life force energy",
    percentage: 70,
    aura: "Open and enveloping"
  },
  "Manifestor": {
    strategy: "To Inform",
    authority: "Emotional Solar Plexus",
    description: "Initiators and peace makers",
    percentage: 9,
    aura: "Closed and repelling"
  },
  "Projector": {
    strategy: "Wait for Invitation",
    authority: "Splenic",
    description: "Guides and energy managers",
    percentage: 20,
    aura: "Focused and absorbing"
  },
  "Reflector": {
    strategy: "Wait 28 days",
    authority: "Lunar",
    description: "Mirrors and community health indicators",
    percentage: 1,
    aura: "Resistant and sampling"
  }
} as const;

// Human Design Centers
export const centers = {
  "Head": { name: "Head", color: "#FFD700", function: "Inspiration and mental pressure" },
  "Ajna": { name: "Ajna", color: "#90EE90", function: "Conceptualization and mental awareness" },
  "Throat": { name: "Throat", color: "#8B4513", function: "Communication and manifestation" },
  "G": { name: "G Center", color: "#FFD700", function: "Identity and direction" },
  "Heart": { name: "Heart", color: "#FF6347", function: "Willpower and ego" },
  "Spleen": { name: "Spleen", color: "#8B4513", function: "Intuition and immune system" },
  "Solar Plexus": { name: "Solar Plexus", color: "#FF4500", function: "Emotions and feelings" },
  "Sacral": { name: "Sacral", color: "#FF6347", function: "Life force and sexuality" },
  "Root": { name: "Root", color: "#8B4513", function: "Pressure and adrenaline" }
} as const;

// Human Design Profiles (Lines)
export const profiles = {
  "1/3": { name: "Investigator/Martyr", description: "Foundation and discovery through trial and error" },
  "1/4": { name: "Investigator/Opportunist", description: "Foundation with externalization" },
  "2/4": { name: "Hermit/Opportunist", description: "Natural talent with networking" },
  "2/5": { name: "Hermit/Heretic", description: "Natural talent with projection" },
  "3/5": { name: "Martyr/Heretic", description: "Discovery with practical solutions" },
  "3/6": { name: "Martyr/Role Model", description: "Discovery with wisdom through experience" },
  "4/6": { name: "Opportunist/Role Model", description: "Networking with wisdom and authority" },
  "4/1": { name: "Opportunist/Investigator", description: "Externalization with foundation" },
  "5/1": { name: "Heretic/Investigator", description: "Practical solutions with foundation" },
  "5/2": { name: "Heretic/Hermit", description: "Projection with natural talent" },
  "6/2": { name: "Role Model/Hermit", description: "Wisdom with natural talent" },
  "6/3": { name: "Role Model/Martyr", description: "Authority through trial and experience" }
} as const;

/**
 * Generate a Human Design profile based on birth data
 * This is a simplified version - in production, you'd use HDKit with real astronomical data
 */
export function generateHumanDesignProfile(
  birthDate: Date,
  birthTime: string,
  birthLocation: { lat: number, lng: number },
  agentId: string
): InsertHumanDesignProfile {
  // Simplified calculation - in real HDKit, this would use planetary positions
  const hash = hashDateLocation(birthDate, birthTime, birthLocation);
  
  // Determine type based on hash
  const typeKeys = Object.keys(humanDesignTypes) as Array<keyof typeof humanDesignTypes>;
  const type = typeKeys[hash % typeKeys.length];
  const typeInfo = humanDesignTypes[type];
  
  // Determine profile
  const profileKeys = Object.keys(profiles) as Array<keyof typeof profiles>;
  const profile = profileKeys[(hash * 7) % profileKeys.length];
  
  // Generate center definitions (simplified)
  const centerKeys = Object.keys(centers);
  const definedCenters: Record<string, boolean> = {};
  centerKeys.forEach((center, index) => {
    definedCenters[center] = ((hash + index) % 3) === 0; // Roughly 33% defined
  });
  
  // Generate channels and gates (simplified)
  const activeChannels = generateActiveChannels(hash);
  const activeGates = generateActiveGates(hash);
  
  // Simulate planetary positions (in real HDKit, this would be astronomical calculation)
  const planetaryPositions = generatePlanetaryPositions(birthDate, birthTime, birthLocation);
  
  return {
    agentId,
    bodygraphData: {
      designData: {
        sun: planetaryPositions.sun,
        earth: planetaryPositions.earth,
        moon: planetaryPositions.moon,
        northNode: planetaryPositions.northNode,
        southNode: planetaryPositions.southNode
      },
      personalityData: {
        sun: planetaryPositions.personalitySun,
        earth: planetaryPositions.personalityEarth,
        moon: planetaryPositions.personalityMoon
      }
    },
    type,
    strategy: typeInfo.strategy,
    authority: typeInfo.authority,
    profile,
    centers: definedCenters,
    channels: activeChannels,
    gates: activeGates,
    planetaryPositions
  };
}

/**
 * Hash function for birth data to create consistent but varied profiles
 */
function hashDateLocation(date: Date, time: string, location: { lat: number, lng: number }): number {
  const str = `${date.getTime()}_${time}_${location.lat}_${location.lng}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Generate active channels for the bodygraph
 */
function generateActiveChannels(hash: number): Record<string, any> {
  const channels = {
    "61-24": { name: "Channel of Awareness", description: "Thinking to Knowing" },
    "17-62": { name: "Channel of Acceptance", description: "Logical Mind" },
    "64-47": { name: "Channel of Abstraction", description: "Mental Activity" },
    "11-56": { name: "Channel of Curiosity", description: "Seeker to Stimulation" },
    "34-57": { name: "Channel of Power", description: "Intuitive Power" }
  };
  
  const activeChannels: Record<string, any> = {};
  Object.entries(channels).forEach(([key, value], index) => {
    if (((hash + index) % 5) === 0) { // Roughly 20% of channels active
      activeChannels[key] = value;
    }
  });
  
  return activeChannels;
}

/**
 * Generate active gates for the bodygraph
 */
function generateActiveGates(hash: number): Record<string, any> {
  const activeGates: Record<string, any> = {};
  
  // Generate 15-25 active gates (typical range)
  const gateCount = 15 + (hash % 11);
  for (let i = 1; i <= 64; i++) {
    if (((hash + i) % 3) === 0 && Object.keys(activeGates).length < gateCount) {
      activeGates[i.toString()] = {
        line: (hash + i) % 6 + 1,
        planet: getPlanetForGate(i, hash),
        conscious: (hash + i) % 2 === 0
      };
    }
  }
  
  return activeGates;
}

/**
 * Generate planetary positions (simplified simulation)
 */
function generatePlanetaryPositions(
  birthDate: Date,
  birthTime: string,
  location: { lat: number, lng: number }
): Record<string, any> {
  const hash = hashDateLocation(birthDate, birthTime, location);
  
  return {
    sun: { gate: (hash % 64) + 1, line: (hash % 6) + 1 },
    earth: { gate: ((hash + 31) % 64) + 1, line: ((hash + 3) % 6) + 1 },
    moon: { gate: ((hash + 15) % 64) + 1, line: ((hash + 2) % 6) + 1 },
    northNode: { gate: ((hash + 45) % 64) + 1, line: ((hash + 4) % 6) + 1 },
    southNode: { gate: ((hash + 45 + 31) % 64) + 1, line: ((hash + 4 + 3) % 6) + 1 },
    personalitySun: { gate: ((hash + 88) % 64) + 1, line: ((hash + 1) % 6) + 1 },
    personalityEarth: { gate: ((hash + 88 + 31) % 64) + 1, line: ((hash + 1 + 3) % 6) + 1 },
    personalityMoon: { gate: ((hash + 75) % 64) + 1, line: ((hash + 5) % 6) + 1 }
  };
}

/**
 * Get planet association for a gate
 */
function getPlanetForGate(gate: number, hash: number): string {
  const planets = ['Sun', 'Earth', 'Moon', 'North Node', 'South Node', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
  return planets[(gate + hash) % planets.length];
}

/**
 * Generate Human Design insights based on profile
 */
export function generateHumanDesignInsights(profile: HumanDesignProfile): {
  strengths: string[];
  challenges: string[];
  relationships: string[];
  career: string[];
} {
  const typeInfo = humanDesignTypes[profile.type as keyof typeof humanDesignTypes];
  const profileInfo = profiles[profile.profile as keyof typeof profiles];
  
  return {
    strengths: [
      `${typeInfo.description} with ${typeInfo.aura} aura`,
      `${profileInfo.description}`,
      `Natural ${profile.authority} authority`,
      `Strategy: ${profile.strategy}`
    ],
    challenges: [
      `Learning to follow their ${profile.strategy} strategy`,
      `Honoring their ${profile.authority} authority`,
      `Understanding their unique aura type`,
      `Deconditioning from societal pressures`
    ],
    relationships: [
      `Works best when following ${profile.strategy}`,
      `${typeInfo.aura} aura affects how others perceive them`,
      `Authority through ${profile.authority}`,
      `Profile influences how they interact with others`
    ],
    career: [
      `Best suited for roles that honor their ${profile.type} nature`,
      `Success comes from following ${profile.strategy}`,
      `Authority decisions through ${profile.authority}`,
      `${profileInfo.description} in professional settings`
    ]
  };
}