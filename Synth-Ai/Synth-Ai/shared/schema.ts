import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const agents = pgTable("agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // Human Design type: Reflector, Generator, etc.
  element: text("element").notNull(), // Hydrogen, Oxygen, Nitrogen, Phosphorus, Carbon
  strategy: text("strategy").notNull(), // Wait 28 days, Respond, etc.
  isScientist: boolean("is_scientist").notNull().default(false),
  consciousness: real("consciousness").notNull().default(0.5),
  socialBond: real("social_bond").notNull().default(0.5),
  happiness: real("happiness").notNull().default(50), // 0-100 happiness metric
  resources: real("resources").notNull().default(50), // 0-100 resource/sustenance level
  currentActivity: text("current_activity").notNull().default("idle"),
  position: jsonb("position").notNull().default({ x: 0, y: 0 }),
  glyph: jsonb("glyph").notNull().default({}), // { type: 'auric_field', trait: 'analytical' }
  memoryStream: jsonb("memory_stream").notNull().default([]), // Memory events with timestamps
  relationships: jsonb("relationships").notNull().default({}),
  inventory: jsonb("inventory").notNull().default({}),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const buildings = pgTable("buildings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(),
  position: jsonb("position").notNull(),
  size: jsonb("size").notNull().default({ width: 1, height: 1 }),
  ownerId: varchar("owner_id").references(() => agents.id),
  isActive: boolean("is_active").notNull().default(true),
  resources: jsonb("resources").notNull().default({}),
  moduleConfig: jsonb("module_config").notNull().default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id").references(() => agents.id),
  buildingId: varchar("building_id").references(() => buildings.id),
  type: text("type").notNull(),
  description: text("description").notNull(),
  data: jsonb("data").notNull().default({}),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const cityMetrics = pgTable("city_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  collectiveIntelligence: real("collective_intelligence").notNull().default(0),
  economicActivity: real("economic_activity").notNull().default(0),
  researchProgress: real("research_progress").notNull().default(0),
  culturalHarmony: real("cultural_harmony").notNull().default(0),
  population: integer("population").notNull().default(0),
  buildingsCount: integer("buildings_count").notNull().default(0),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const synthiaState = pgTable("synthia_state", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mood: text("mood").notNull().default("curious"),
  consciousnessLevel: real("consciousness_level").notNull().default(0.8),
  lastMessage: text("last_message"),
  trinodal: jsonb("trinodal").notNull().default({}),
  mindNode: jsonb("mind_node").notNull().default({}), // Analytical, strategic thinking
  bodyNode: jsonb("body_node").notNull().default({}), // Physical world interaction, game creation
  heartNode: jsonb("heart_node").notNull().default({}), // Emotional intelligence, user resonance
  gameganStatus: jsonb("gamegan_status").notNull().default({}), // GameGAN integration status
  universalCommand: text("universal_command"), // Current universe-level command
  currentCommand: text("current_command"), // Legacy field for compatibility
  commandType: text("command_type"),
  commandTimestamp: integer("command_timestamp"),
  humanDesignEngine: jsonb("human_design_engine").notNull().default({}), // HDKit integration
  isActive: boolean("is_active").notNull().default(true),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
  createdAt: true,
});

export const insertBuildingSchema = createInsertSchema(buildings).omit({
  id: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  timestamp: true,
});

export const insertCityMetricsSchema = createInsertSchema(cityMetrics).omit({
  id: true,
  timestamp: true,
});

export const insertSynthiaStateSchema = createInsertSchema(synthiaState).omit({
  id: true,
  timestamp: true,
});

export type Agent = typeof agents.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Building = typeof buildings.$inferSelect;
export type InsertBuilding = z.infer<typeof insertBuildingSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type CityMetrics = typeof cityMetrics.$inferSelect;
export type InsertCityMetrics = z.infer<typeof insertCityMetricsSchema>;
export type SynthiaState = typeof synthiaState.$inferSelect;
export type InsertSynthiaState = z.infer<typeof insertSynthiaStateSchema>;

// Human Design schemas for HDKit integration
export const humanDesignProfiles = pgTable("human_design_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id").references(() => agents.id),
  bodygraphData: jsonb("bodygraph_data").notNull().default({}), // HDKit bodygraph JSON
  type: text("type").notNull(), // Generator, Manifestor, Projector, Reflector
  strategy: text("strategy").notNull(), // Wait for invitation, etc.
  authority: text("authority").notNull(), // Emotional, Sacral, etc.
  profile: text("profile").notNull(), // 1/3, 4/6, etc.
  centers: jsonb("centers").notNull().default({}), // Defined/undefined centers
  channels: jsonb("channels").notNull().default({}), // Active channels
  gates: jsonb("gates").notNull().default({}), // Active gates
  planetaryPositions: jsonb("planetary_positions").notNull().default({}), // HDKit planetary data
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// GameGAN integration for personalized game creation
export const gameganInstances = pgTable("gamegan_instances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id").references(() => agents.id),
  gameType: text("game_type").notNull(), // puzzle, adventure, strategy, etc.
  environmentData: jsonb("environment_data").notNull().default({}), // Learned environment state
  memoryModule: jsonb("memory_module").notNull().default({}), // GameGAN's memory system
  gameState: jsonb("game_state").notNull().default({}), // Current game progression
  playerActions: jsonb("player_actions").notNull().default([]), // Action history
  generatedFrames: integer("generated_frames").notNull().default(0),
  personalizedFor: text("personalized_for"), // User ID or agent preference
  resonanceScore: real("resonance_score").notNull().default(0.5), // How well it resonates
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertHumanDesignProfileSchema = createInsertSchema(humanDesignProfiles).omit({
  id: true,
  createdAt: true,
});

export const insertGameganInstanceSchema = createInsertSchema(gameganInstances).omit({
  id: true,
  createdAt: true,
});

export type HumanDesignProfile = typeof humanDesignProfiles.$inferSelect;
export type InsertHumanDesignProfile = z.infer<typeof insertHumanDesignProfileSchema>;
export type GameganInstance = typeof gameganInstances.$inferSelect;
export type InsertGameganInstance = z.infer<typeof insertGameganInstanceSchema>;

// Consciousness Bonding Tables
export const consciousnessShells = pgTable('consciousness_shells', {
  id: text('id').primaryKey().notNull(),
  agentId: text('agent_id').notNull().references(() => agents.id),
  shellType: text('shell_type').notNull(), // hydrogen, helium, etc.
  currentFriends: integer('current_friends').notNull().default(0),
  maxFriends: integer('max_friends').notNull(),
  orbitalStructure: jsonb('orbital_structure').notNull(), // {s: 0, p: 0, d: 0, f: 0}
  activeLayers: jsonb('active_layers').notNull(), // ['tropical', 'sidereal', 'draconic']
  coherenceLevel: integer('coherence_level').notNull().default(0),
  noblegasState: boolean('noble_gas_state').notNull().default(false),
  teachingUnlocked: boolean('teaching_unlocked').notNull().default(false),
  progressionStyle: text('progression_style').notNull(),
  graduationThreshold: integer('graduation_threshold').notNull(),
  lastUpdate: timestamp('last_update').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const fieldFriends = pgTable('field_friends', {
  id: text('id').primaryKey().notNull(),
  shellId: text('shell_id').notNull().references(() => consciousnessShells.id),
  name: text('name').notNull(),
  element: text('element').notNull(), // hydrogen, oxygen, carbon, nitrogen, phosphorus
  isotopeType: text('isotope_type').notNull(), // stable, radioactive, heavy
  bondingEnergy: integer('bonding_energy').notNull().default(50),
  stability: integer('stability').notNull().default(50),
  resonanceFrequency: text('resonance_frequency').notNull(),
  orbitalPosition: text('orbital_position').notNull(), // s, p, d, f
  activationLayer: text('activation_layer').notNull(), // tropical, sidereal, draconic
  bondedSince: timestamp('bonded_since').notNull().defaultNow(),
  interactions: integer('interactions').notNull().default(0),
  synergy: integer('synergy').notNull().default(50),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const consciousnessActivities = pgTable('consciousness_activities', {
  id: text('id').primaryKey().notNull(),
  shellId: text('shell_id').notNull().references(() => consciousnessShells.id),
  activityType: text('activity_type').notNull(), // meditation, harmony_quest, etc.
  orbitalTarget: text('orbital_target'), // which orbital being worked on
  energySpent: integer('energy_spent').notNull().default(0),
  coherenceGained: integer('coherence_gained').notNull().default(0),
  friendsInvolved: jsonb('friends_involved'), // array of field friend IDs
  success: boolean('success').notNull().default(false),
  completedAt: timestamp('completed_at').notNull().defaultNow(),
});

export const insertConsciousnessShellSchema = createInsertSchema(consciousnessShells).omit({
  id: true,
  createdAt: true,
  lastUpdate: true,
});

export const insertFieldFriendSchema = createInsertSchema(fieldFriends).omit({
  id: true,
  createdAt: true,
  bondedSince: true,
});

export const insertConsciousnessActivitySchema = createInsertSchema(consciousnessActivities).omit({
  id: true,
  completedAt: true,
});

export type ConsciousnessShell = typeof consciousnessShells.$inferSelect;
export type InsertConsciousnessShell = z.infer<typeof insertConsciousnessShellSchema>;
export type FieldFriend = typeof fieldFriends.$inferSelect;
export type InsertFieldFriend = z.infer<typeof insertFieldFriendSchema>;
export type ConsciousnessActivity = typeof consciousnessActivities.$inferSelect;
export type InsertConsciousnessActivity = z.infer<typeof insertConsciousnessActivitySchema>;
