import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface Building {
  id: string;
  name: string;
  type: string;
  moduleConfig?: {
    type: string;
    features?: string[];
  };
}

export default function BuildingList() {
  const { data: buildings, isLoading } = useQuery({
    queryKey: ['/api/buildings']
  });

  if (isLoading) {
    return <div className="text-white">Loading buildings...</div>;
  }

  const allBuildings = buildings as Building[] || [];
  
  const buildingsByType = {
    science_lab: allBuildings.filter(b => b.moduleConfig?.type === 'science_lab'),
    farm: allBuildings.filter(b => b.type === 'farm'),
    trading: allBuildings.filter(b => b.type === 'trading'),
    theater: allBuildings.filter(b => b.type === 'theater')
  };

  return (
    <Card className="glass-panel border-neon-green/30">
      <CardHeader>
        <CardTitle className="text-neon-green font-orbitron">Building Modules</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Science Labs */}
        <div>
          <h3 className="text-electric text-sm font-medium mb-2">Science Labs</h3>
          {buildingsByType.science_lab.length === 0 ? (
            <p className="text-gray-400 text-sm">No Science Labs built yet</p>
          ) : (
            <div className="space-y-2">
              {buildingsByType.science_lab.map(lab => (
                <div key={lab.id} className="p-2 bg-neon-green/10 border border-neon-green/30 rounded">
                  <div className="text-white font-medium text-sm">{lab.name}</div>
                  <Link href={`/lab/${lab.id}`}>
                    <Button size="sm" variant="outline" className="mt-1 text-xs border-electric text-electric hover:bg-electric hover:text-white" data-testid={`link-lab-${lab.id}`}>
                      Visit Dashboard →
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Farms */}
        <div>
          <h3 className="text-green-400 text-sm font-medium mb-2">Farms</h3>
          {buildingsByType.farm.length === 0 ? (
            <p className="text-gray-400 text-sm">No Farms built yet</p>
          ) : (
            <div className="space-y-2">
              {buildingsByType.farm.map(farm => (
                <div key={farm.id} className="p-2 bg-green-500/10 border border-green-500/30 rounded">
                  <div className="text-white font-medium text-sm">{farm.name}</div>
                  <Link href={`/farm/${farm.id}`}>
                    <Button size="sm" variant="outline" className="mt-1 text-xs border-green-400 text-green-400 hover:bg-green-400 hover:text-white" data-testid={`link-farm-${farm.id}`}>
                      Visit Farm →
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trading Posts */}
        <div>
          <h3 className="text-yellow-400 text-sm font-medium mb-2">Trading Posts</h3>
          {buildingsByType.trading.length === 0 ? (
            <p className="text-gray-400 text-sm">No Trading Posts built yet</p>
          ) : (
            <div className="space-y-2">
              {buildingsByType.trading.map(hub => (
                <div key={hub.id} className="p-2 bg-yellow-500/10 border border-yellow-500/30 rounded">
                  <div className="text-white font-medium text-sm">{hub.name}</div>
                  <Link href={`/trading/${hub.id}`}>
                    <Button size="sm" variant="outline" className="mt-1 text-xs border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-white" data-testid={`link-trading-${hub.id}`}>
                      Visit Trading Hub →
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Theaters */}
        <div>
          <h3 className="text-purple-400 text-sm font-medium mb-2">Performance Halls</h3>
          {buildingsByType.theater.length === 0 ? (
            <p className="text-gray-400 text-sm">No Performance Halls built yet</p>
          ) : (
            <div className="space-y-2">
              {buildingsByType.theater.map(theater => (
                <div key={theater.id} className="p-2 bg-purple-500/10 border border-purple-500/30 rounded">
                  <div className="text-white font-medium text-sm">{theater.name}</div>
                  <Link href={`/theater/${theater.id}`}>
                    <Button size="sm" variant="outline" className="mt-1 text-xs border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white" data-testid={`link-theater-${theater.id}`}>
                      Visit Theater →
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}