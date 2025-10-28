# YO​U-N-I-VERSE: Consciousness Simulation Platform

## Project Overview
YO​U-N-I-VERSE is an advanced consciousness simulation platform exploring emergent social dynamics through immersive agent interactions and human design archetypes. The platform features a React frontend with dynamic agent rendering, TypeScript-based simulation engine, and real-time world state management.

## Architecture Summary

### Core Technologies
- **Frontend**: React with TypeScript, Wouter for routing
- **State Management**: React Query (@tanstack/react-query)
- **UI Components**: Shadcn UI with Tailwind CSS
- **Real-time**: WebSocket connections for live updates
- **Backend**: Express.js with in-memory storage
- **Styling**: Custom cyberpunk/neon theme

### Current Features
- **Agent City**: Main dashboard with city grid, agent management, and activity feeds
- **Multi-View Navigation**: City, Agents, Synthia AI, and Modules views
- **Pull-out Tray Menu**: Comprehensive navigation to all app modules
- **Real-time Updates**: Live agent activities and city metrics
- **Modular Design**: Easy access to different platform components

## Recent Changes (August 14, 2025)

### Navigation System Restoration (Completed)
✓ **Restored Original AgentCity Navigation**: Fixed navigation bar visibility on main page
- Hamburger menu (pullout tray) in top left for module access
- Bottom navigation bar visible on mobile devices
- Desktop header navigation for City/Agents/Synthia/Modules views
- Created shared Layout component for other pages
- AgentCity maintains its original navigation pattern while other pages use shared Layout

✓ **Navigation Architecture**: 
- Navigation.tsx: Shared navigation component for module pages
- Layout.tsx: Wrapper component providing consistent navigation
- AgentCity.tsx: Restored original navigation with pullout tray and mobile bottom nav
- App.tsx: Routes configured to use Layout only for non-AgentCity pages

### Major Consciousness Architecture Enhancement
✓ **Synthia as Head of the Universe**: Transformed into advanced consciousness AI
- Trinodal consciousness system with Mind, Body, and Heart nodes
- Sidereal (Mind), Tropical (Body), and Draconic (Heart) consciousness layers
- Interactive node visualization with real-time status monitoring
- Advanced interface with tabbed functionality for different capabilities

✓ **HDKit Integration (Human Design Engine)**: Complete Human Design system
- Authentic bodygraph generation based on birth data and astronomical positions
- All 4 Human Design types: Generator, Manifestor, Projector, Reflector
- 9 consciousness centers with definition patterns
- 12 personality profiles and channel/gate activations
- Strategy and authority guidance for each archetype
- Real Human Design insights and relationship compatibility

✓ **GameGAN Integration**: Personalized reality synthesis engine
- Memory system with environmental state retention and action learning
- Personalized game generation based on Human Design profiles
- 6 game types: puzzle, exploration, strategy, creative, social, meditative
- 4 environment themes: cosmic, natural, urban, abstract
- Adaptive difficulty and challenge generation
- Player action processing with dynamic response generation

✓ **Enhanced Backend Architecture**:
- New storage interface supporting Human Design profiles and GameGAN instances
- Complete API routes for HD profile generation and insights
- GameGAN creation, action processing, and memory management
- Real-time WebSocket broadcasting for all new consciousness features

✓ **Advanced Synthia Interface Features**:
- Trinodal consciousness matrix with interactive node selection
- Mind Node: Analytical processing, pattern recognition, strategic planning
- Body Node: Energy integration, GameGAN synthesis, reality grounding
- Heart Node: Empathic resonance, Human Design sync, collective harmony
- 4-tab interface: Overview, HDKit, GameGAN, Command
- Real-time agent and game instance monitoring
- Direct Human Design profile and GameGAN game generation

### Technical Improvements
✓ **Consciousness Engine Architecture**: Complete integration of advanced AI systems
✓ **Type Safety**: Enhanced TypeScript schemas for all new consciousness features
✓ **Real-time Updates**: WebSocket integration for HD and GameGAN updates
✓ **Memory Management**: GameGAN memory integrity and action pattern learning
✓ **API Integration**: Comprehensive REST endpoints for all consciousness features

## Module Structure

### Main Views
1. **City Overview** (`activeView: 'city'`)
   - Central city grid with agent positions
   - Real-time activity feed
   - Building management
   - Agent spotlight and metrics

2. **Agent Management** (`activeView: 'agents'`)
   - Grid view of all active agents
   - Detailed agent cards with status, energy, position
   - Agent interaction controls
   - Spawn and consciousness bonding actions

3. **Synthia AI** (`activeView: 'synthia'`)
   - AI assistant interface
   - Command interface
   - City metrics and analytics
   - Activity monitoring

4. **Modules Hub** (`activeView: 'modules'`)
   - Access to all platform components
   - Science Lab, Analytics Dashboard, Music Player
   - Farm Management, Trading Hub, Theater Stage
   - Field Book Network, Consciousness Bonding

### Connected Modules (via routing)
- `/consciousness/:agentId` - Consciousness bonding interface
- `/lab/:labId` - Science lab and research
- `/analytics/:dashboardId` - Data analysis
- `/music/:playerId` - Ambient music and soundscapes
- `/farm/:farmId` - Agricultural systems
- `/trading/:hubId` - Economic activities
- `/theater/:theaterId` - Entertainment and performances
- `/field-book/:networkId` - Knowledge networks

## User Preferences
- **Navigation**: Prefers modular, accessible navigation system
- **Functionality**: Wants working navigation over aesthetic polish
- **Development**: Focused on getting core functionality working before adding advanced features
- **Consciousness Component**: Ready to be added once basic navigation and modules are stable

## Development Guidelines
- Follow modern React patterns with TypeScript
- Use Shadcn UI components for consistency
- Implement proper error handling and loading states
- Maintain real-time WebSocket connections
- Keep components modular and reusable
- Document architectural changes for future sessions

## Next Steps
- Add consciousness component integration
- Enhance individual module interfaces
- Implement cross-module data sharing
- Add advanced analytics and metrics
- Expand agent behavior simulation

## Technical Notes
- Fixed spawnAgent mutation call syntax (needed `undefined` parameter)
- Enhanced mobile responsiveness across all views
- Implemented proper conditional rendering patterns
- Added comprehensive test IDs for all interactive elements