import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useWebSocket } from './useWebSocket';
import { 
  type Agent, 
  type Building, 
  type Activity, 
  type CityMetrics, 
  type SynthiaState 
} from '@shared/schema';

interface UseAgentCityReturn {
  agents: Agent[];
  buildings: Building[];
  activities: Activity[];
  cityMetrics?: CityMetrics;
  synthiaState?: SynthiaState;
  isLoading: boolean;
  error: string | null;
  spawnAgent: ReturnType<typeof useMutation>;
  createBuilding: ReturnType<typeof useMutation>;
  refetch: () => void;
}

export function useAgentCity(): UseAgentCityReturn {
  const [error, setError] = useState<string | null>(null);
  const { lastMessage, isConnected } = useWebSocket();

  // Fetch agents
  const agentsQuery = useQuery({
    queryKey: ['/api/agents'],
    refetchInterval: 5000, // Fallback polling if WebSocket fails
    staleTime: 2000,
  });

  // Fetch buildings
  const buildingsQuery = useQuery({
    queryKey: ['/api/buildings'],
    refetchInterval: 5000,
    staleTime: 2000,
  });

  // Fetch activities
  const activitiesQuery = useQuery({
    queryKey: ['/api/activities'],
    refetchInterval: 3000,
    staleTime: 1000,
  });

  // Fetch city metrics
  const cityMetricsQuery = useQuery({
    queryKey: ['/api/city/metrics'],
    refetchInterval: 5000,
    staleTime: 2000,
  });

  // Fetch Synthia state
  const synthiaQuery = useQuery({
    queryKey: ['/api/synthia'],
    refetchInterval: 8000,
    staleTime: 3000,
  });

  // Spawn agent mutation
  const spawnAgent = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/city/spawn-agent');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/agents'] });
      queryClient.invalidateQueries({ queryKey: ['/api/city/metrics'] });
    },
    onError: (error: Error) => {
      setError(`Failed to spawn agent: ${error.message}`);
    },
  });

  // Create building mutation
  const createBuilding = useMutation({
    mutationFn: async ({ type, position, ownerId }: { type: string; position: { x: number; y: number }; ownerId?: string }) => {
      const response = await apiRequest('POST', '/api/city/create-building', {
        type,
        position,
        ownerId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/buildings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/city/metrics'] });
    },
    onError: (error: Error) => {
      setError(`Failed to create building: ${error.message}`);
    },
  });

  // Handle WebSocket messages for real-time updates
  useEffect(() => {
    if (!lastMessage) return;

    try {
      switch (lastMessage.type) {
        case 'city_update':
          // Real-time city update - invalidate all queries to fetch fresh data
          if (lastMessage.data) {
            queryClient.setQueryData(['/api/agents'], lastMessage.data.agents);
            queryClient.setQueryData(['/api/activities'], lastMessage.data.activities);
            queryClient.setQueryData(['/api/city/metrics'], lastMessage.data.metrics);
            queryClient.setQueryData(['/api/synthia'], lastMessage.data.synthia);
          }
          break;

        case 'agent_created':
        case 'agent_updated':
        case 'agent_spawned':
          // Invalidate agents query to fetch updated data
          queryClient.invalidateQueries({ queryKey: ['/api/agents'] });
          queryClient.invalidateQueries({ queryKey: ['/api/city/metrics'] });
          break;

        case 'building_created':
          // Invalidate buildings query
          queryClient.invalidateQueries({ queryKey: ['/api/buildings'] });
          queryClient.invalidateQueries({ queryKey: ['/api/city/metrics'] });
          break;

        default:
          // Handle other message types if needed
          break;
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  }, [lastMessage]);

  // Handle connection status changes
  useEffect(() => {
    if (!isConnected) {
      setError('Lost connection to city simulation');
    } else {
      setError(null);
    }
  }, [isConnected]);

  // Clear errors after some time
  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  const refetch = () => {
    agentsQuery.refetch();
    buildingsQuery.refetch();
    activitiesQuery.refetch();
    cityMetricsQuery.refetch();
    synthiaQuery.refetch();
  };

  const isLoading = 
    agentsQuery.isLoading || 
    buildingsQuery.isLoading || 
    activitiesQuery.isLoading || 
    cityMetricsQuery.isLoading || 
    synthiaQuery.isLoading;

  return {
    agents: agentsQuery.data || [],
    buildings: buildingsQuery.data || [],
    activities: activitiesQuery.data || [],
    cityMetrics: cityMetricsQuery.data,
    synthiaState: synthiaQuery.data,
    isLoading,
    error,
    spawnAgent,
    createBuilding,
    refetch,
  };
}
