import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { agentEngine } from "./services/agentEngine";
import { consciousnessEngine } from "./services/consciousnessEngine";
import { insertAgentSchema, insertBuildingSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store connected clients
  const clients = new Set<WebSocket>();
  
  wss.on('connection', (ws) => {
    console.log('🔌 Client connected to WebSocket');
    clients.add(ws);
    
    // Send initial data
    ws.send(JSON.stringify({ 
      type: 'connection', 
      message: 'Connected to YO​U-N-I-VERSE Agent City' 
    }));
    
    ws.on('close', () => {
      clients.delete(ws);
      console.log('❌ Client disconnected from WebSocket');
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });

  // Function to broadcast updates to all connected clients
  const broadcast = (data: any) => {
    const message = JSON.stringify(data);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  // Start agent simulation
  await agentEngine.startSimulation(3000);

  // API Routes

  // Get all agents
  app.get("/api/agents", async (req, res) => {
    try {
      const agents = await storage.getAllAgents();
      res.json(agents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agents" });
    }
  });

  // Get specific agent
  app.get("/api/agents/:id", async (req, res) => {
    try {
      const agent = await storage.getAgent(req.params.id);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agent" });
    }
  });

  // Create new agent
  app.post("/api/agents", async (req, res) => {
    try {
      const validatedData = insertAgentSchema.parse(req.body);
      const agent = await storage.createAgent(validatedData);
      
      // Broadcast new agent to all clients
      broadcast({ type: 'agent_created', data: agent });
      
      res.status(201).json(agent);
    } catch (error) {
      res.status(400).json({ message: "Invalid agent data", error });
    }
  });

  // Update agent
  app.patch("/api/agents/:id", async (req, res) => {
    try {
      const agent = await storage.updateAgent(req.params.id, req.body);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
      
      // Broadcast agent update
      broadcast({ type: 'agent_updated', data: agent });
      
      res.json(agent);
    } catch (error) {
      res.status(500).json({ message: "Failed to update agent" });
    }
  });

  // Get all buildings
  app.get("/api/buildings", async (req, res) => {
    try {
      const buildings = await storage.getAllBuildings();
      res.json(buildings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch buildings" });
    }
  });

  // Create new building
  app.post("/api/buildings", async (req, res) => {
    try {
      const validatedData = insertBuildingSchema.parse(req.body);
      const building = await storage.createBuilding(validatedData);
      
      // Broadcast new building
      broadcast({ type: 'building_created', data: building });
      
      res.status(201).json(building);
    } catch (error) {
      res.status(400).json({ message: "Invalid building data", error });
    }
  });

  // Get recent activities
  app.get("/api/activities", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const activities = await storage.getRecentActivities(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Get city metrics
  app.get("/api/city/metrics", async (req, res) => {
    try {
      const metrics = await storage.getLatestCityMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch city metrics" });
    }
  });

  // Get Synthia state
  app.get("/api/synthia", async (req, res) => {
    try {
      const state = await storage.getSynthiaState();
      res.json(state);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch Synthia state" });
    }
  });

  // Send command to Synthia
  app.post("/api/synthia/command", async (req, res) => {
    try {
      const { type, instruction } = req.body;
      
      // Update Synthia's state with the new command
      const currentState = await storage.getSynthiaState();
      const updatedState = await storage.updateSynthiaState({
        currentCommand: instruction,
        commandType: type,
        commandTimestamp: Date.now(),
        lastMessage: `New command received: ${instruction}`,
        mood: "focused"
      });
      
      console.log(`🧠 Synthia received command: ${instruction}`);
      res.json({ success: true, state: updatedState });
    } catch (error) {
      console.error("Error processing Synthia command:", error);
      res.status(500).json({ error: "Failed to process command" });
    }
  });

  // Calculate trinodal consciousness
  app.post("/api/consciousness/calculate", async (req, res) => {
    try {
      const { birthDate, birthTime, birthPlace } = req.body;
      const trinodal = consciousnessEngine.calculateTrinodal({
        birthDate,
        birthTime,
        birthPlace
      });
      res.json({ trinodal });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate consciousness" });
    }
  });

  // Human Design agent type assignment function
  function assignAgentType() {
    const rand = Math.random() * 100;
    const isScientist = Math.random() < 0.15; // 15% scientists
    let glyphTrait = isScientist ? 'analytical' : 'wisdom';
    
    if (rand < 1) return { type: 'Reflector', element: 'Hydrogen', strategy: 'Wait 28 days', glyph: { type: 'auric_field', trait: glyphTrait }, isScientist };
    if (rand < 34) return { type: 'Manifesting Generator', element: 'Nitrogen', strategy: 'Respond, then inform', glyph: { type: 'auric_field', trait: isScientist ? 'analytical' : 'innovative' }, isScientist };
    if (rand < 71) return { type: 'Generator', element: 'Oxygen', strategy: 'Respond', glyph: { type: 'auric_field', trait: isScientist ? 'analytical' : 'sustaining' }, isScientist };
    if (rand < 91) return { type: 'Projector', element: 'Phosphorus', strategy: 'Wait for invitation', glyph: { type: 'auric_field', trait: isScientist ? 'analytical' : 'guiding' }, isScientist };
    return { type: 'Manifestor', element: 'Carbon', strategy: 'Inform', glyph: { type: 'auric_field', trait: isScientist ? 'analytical' : 'initiating' }, isScientist };
  }

  // Spawn random agent
  app.post("/api/city/spawn-agent", async (req, res) => {
    try {
      const names = ["Zeta", "Nova", "Flux", "Echo", "Vex", "Kai", "Nyx", "Orb", "Sage", "Ember"];
      const humanDesignData = assignAgentType();
      
      const agentData = {
        name: `${names[Math.floor(Math.random() * names.length)]}-${Math.floor(Math.random() * 99)}`,
        type: humanDesignData.type,
        element: humanDesignData.element,
        strategy: humanDesignData.strategy,
        isScientist: humanDesignData.isScientist,
        consciousness: 0.3 + Math.random() * 0.4,
        socialBond: 0.3 + Math.random() * 0.4,
        currentActivity: `Following ${humanDesignData.strategy} strategy`,
        position: { 
          x: Math.floor(Math.random() * 12), 
          y: Math.floor(Math.random() * 12) 
        },
        glyph: humanDesignData.glyph,
        memoryStream: [
          {
            timestamp: Date.now(),
            event: `Spawned as ${humanDesignData.type} with ${humanDesignData.element} element`
          }
        ],
        relationships: {},
        inventory: {},
        isActive: true
      };

      const agent = await storage.createAgent(agentData);
      
      // Broadcast new agent
      broadcast({ type: 'agent_spawned', data: agent });
      
      res.status(201).json(agent);
    } catch (error) {
      res.status(500).json({ message: "Failed to spawn agent" });
    }
  });

  // Create building
  app.post("/api/city/create-building", async (req, res) => {
    try {
      const { type, position, ownerId } = req.body;
      
      const buildingTypes = {
        farm: { name: "Farm", resources: { "quantum-crops": 50, "nutrients": 100 } },
        trading: { name: "Trading Post", resources: { "credits": 1000, "quantum-crystals": 25 } },
        research: { name: "Research Lab", resources: { "research-points": 200, "equipment": 10 } },
        theater: { name: "Performance Hall", resources: { "inspiration": 100, "audience-capacity": 30 } }
      };

      const config = buildingTypes[type as keyof typeof buildingTypes];
      if (!config) {
        return res.status(400).json({ message: "Invalid building type" });
      }

      const buildingData = {
        name: `${config.name} ${String.fromCharCode(945 + Math.floor(Math.random() * 10))}-${Math.floor(Math.random() * 10)}`,
        type,
        position,
        size: { width: 2, height: 2 },
        ownerId,
        isActive: true,
        resources: config.resources,
        moduleConfig: {}
      };

      const building = await storage.createBuilding(buildingData);
      
      // Broadcast new building
      broadcast({ type: 'building_created', data: building });
      
      res.status(201).json(building);
    } catch (error) {
      res.status(500).json({ message: "Failed to create building" });
    }
  });

  // Set up periodic broadcasts for real-time updates
  setInterval(async () => {
    try {
      const [agents, activities, metrics, synthia] = await Promise.all([
        storage.getActiveAgents(),
        storage.getRecentActivities(5),
        storage.getLatestCityMetrics(),
        storage.getSynthiaState()
      ]);

      broadcast({
        type: 'city_update',
        data: { agents, activities, metrics, synthia }
      });
    } catch (error) {
      console.error("Error broadcasting city update:", error);
    }
  }, 2000);

  // Consciousness bonding routes
  app.get("/api/consciousness/shells", async (req, res) => {
    try {
      const shells = consciousnessEngine.getAllConsciousnessShells();
      res.json(shells);
    } catch (error) {
      console.error('Error fetching consciousness shells:', error);
      res.status(500).json({ message: "Failed to fetch consciousness shells" });
    }
  });

  app.post("/api/consciousness/bond-friend", async (req, res) => {
    try {
      const { agentId, orbital, isotope } = req.body;
      
      if (!agentId || !orbital || !isotope) {
        return res.status(400).json({ message: "Missing required fields: agentId, orbital, isotope" });
      }

      const friend = await consciousnessEngine.bondFieldFriend(agentId, orbital, isotope);
      
      if (!friend) {
        return res.status(400).json({ message: "Cannot bond friend - shell may be full or orbital at capacity" });
      }

      // Broadcast the update
      broadcast({
        type: 'consciousness_update',
        agentId,
        friend
      });

      res.json(friend);
    } catch (error) {
      console.error('Error bonding field friend:', error);
      res.status(500).json({ message: "Failed to bond field friend" });
    }
  });

  app.post("/api/consciousness/activity", async (req, res) => {
    try {
      const { agentId, activityType, orbitalTarget } = req.body;
      
      if (!agentId || !activityType) {
        return res.status(400).json({ message: "Missing required fields: agentId, activityType" });
      }

      const result = await consciousnessEngine.performConsciousnessActivity(agentId, activityType, orbitalTarget);
      
      // Broadcast the activity result
      broadcast({
        type: 'consciousness_activity',
        agentId,
        activityType,
        result
      });

      res.json(result);
    } catch (error) {
      console.error('Error performing consciousness activity:', error);
      res.status(500).json({ message: "Failed to perform consciousness activity" });
    }
  });

  app.get("/api/consciousness/shell/:agentId", async (req, res) => {
    try {
      const { agentId } = req.params;
      const shell = consciousnessEngine.getConsciousnessShell(agentId);
      
      if (!shell) {
        return res.status(404).json({ message: "Consciousness shell not found" });
      }

      res.json(shell);
    } catch (error) {
      console.error('Error fetching consciousness shell:', error);
      res.status(500).json({ message: "Failed to fetch consciousness shell" });
    }
  });

  // Human Design API routes
  app.get("/api/human-design/:agentId", async (req, res) => {
    try {
      const { agentId } = req.params;
      const profile = await storage.getHumanDesignProfile(agentId);
      
      if (!profile) {
        return res.status(404).json({ message: "Human Design profile not found" });
      }

      res.json(profile);
    } catch (error) {
      console.error('Error fetching Human Design profile:', error);
      res.status(500).json({ message: "Failed to fetch Human Design profile" });
    }
  });

  app.post("/api/human-design/generate", async (req, res) => {
    try {
      const { agentId, birthDate, birthTime, birthLocation } = req.body;
      
      if (!agentId || !birthDate || !birthTime || !birthLocation) {
        return res.status(400).json({ message: "Missing required fields: agentId, birthDate, birthTime, birthLocation" });
      }

      // Import HDKit engine here to avoid circular deps
      const { generateHumanDesignProfile } = await import('./services/humanDesignEngine');
      
      const profile = generateHumanDesignProfile(
        new Date(birthDate),
        birthTime,
        birthLocation,
        agentId
      );
      
      const savedProfile = await storage.createHumanDesignProfile(profile);
      
      // Broadcast the new profile
      broadcast({
        type: 'human_design_generated',
        agentId,
        profile: savedProfile
      });

      res.json(savedProfile);
    } catch (error) {
      console.error('Error generating Human Design profile:', error);
      res.status(500).json({ message: "Failed to generate Human Design profile" });
    }
  });

  app.get("/api/human-design/:agentId/insights", async (req, res) => {
    try {
      const { agentId } = req.params;
      const profile = await storage.getHumanDesignProfile(agentId);
      
      if (!profile) {
        return res.status(404).json({ message: "Human Design profile not found" });
      }

      // Import HDKit engine here to avoid circular deps
      const { generateHumanDesignInsights } = await import('./services/humanDesignEngine');
      const insights = generateHumanDesignInsights(profile);

      res.json(insights);
    } catch (error) {
      console.error('Error generating Human Design insights:', error);
      res.status(500).json({ message: "Failed to generate Human Design insights" });
    }
  });

  // GameGAN API routes
  app.get("/api/gamegan/:agentId", async (req, res) => {
    try {
      const { agentId } = req.params;
      const instance = await storage.getGameganInstance(agentId);
      
      if (!instance) {
        return res.status(404).json({ message: "GameGAN instance not found" });
      }

      res.json(instance);
    } catch (error) {
      console.error('Error fetching GameGAN instance:', error);
      res.status(500).json({ message: "Failed to fetch GameGAN instance" });
    }
  });

  app.post("/api/gamegan/generate", async (req, res) => {
    try {
      const { agentId, playerPreferences } = req.body;
      
      if (!agentId) {
        return res.status(400).json({ message: "Missing required field: agentId" });
      }

      // Get Human Design profile for personalization
      const humanDesignProfile = await storage.getHumanDesignProfile(agentId);
      
      if (!humanDesignProfile) {
        return res.status(400).json({ message: "Human Design profile required for game generation" });
      }

      // Import GameGAN engine here to avoid circular deps
      const { generatePersonalizedGame } = await import('./services/gameganEngine');
      
      const gameInstance = generatePersonalizedGame(
        agentId,
        humanDesignProfile,
        playerPreferences
      );
      
      const savedInstance = await storage.createGameganInstance(gameInstance);
      
      // Broadcast the new game instance
      broadcast({
        type: 'gamegan_generated',
        agentId,
        gameInstance: savedInstance
      });

      res.json(savedInstance);
    } catch (error) {
      console.error('Error generating GameGAN instance:', error);
      res.status(500).json({ message: "Failed to generate GameGAN instance" });
    }
  });

  app.post("/api/gamegan/:agentId/action", async (req, res) => {
    try {
      const { agentId } = req.params;
      const { action } = req.body;
      
      if (!action) {
        return res.status(400).json({ message: "Missing required field: action" });
      }

      const instance = await storage.getGameganInstance(agentId);
      
      if (!instance) {
        return res.status(404).json({ message: "GameGAN instance not found" });
      }

      // Import GameGAN engine here to avoid circular deps
      const { processPlayerAction } = await import('./services/gameganEngine');
      
      const { updatedGame, response } = processPlayerAction(instance, action);
      
      // Update the stored instance
      await storage.updateGameganInstance(agentId, updatedGame);
      
      // Broadcast the action result
      broadcast({
        type: 'gamegan_action',
        agentId,
        action,
        response
      });

      res.json({ action, response, gameState: updatedGame.gameState });
    } catch (error) {
      console.error('Error processing GameGAN action:', error);
      res.status(500).json({ message: "Failed to process GameGAN action" });
    }
  });

  app.get("/api/gamegan", async (req, res) => {
    try {
      const instances = await storage.getAllGameganInstances();
      res.json(instances);
    } catch (error) {
      console.error('Error fetching all GameGAN instances:', error);
      res.status(500).json({ message: "Failed to fetch GameGAN instances" });
    }
  });

  return httpServer;
}
