import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useLocation } from "wouter";
import { Sprout, Droplets, Sun, Thermometer } from "lucide-react";
import { useState } from "react";

interface FarmData {
  id: string;
  name: string;
  ownerId: string;
  quantumCrops: number;
  nutrients: number;
  harvestRate: number;
  efficiency: number;
}

export default function FarmDashboard() {
  const params = useParams();
  const [location] = useLocation();
  const farmId = params.farmId || location.split('/farm/')[1];
  const [isHarvesting, setIsHarvesting] = useState(false);
  
  const { data: farmData, isLoading, error } = useQuery({
    queryKey: ['/api/buildings'],
    select: (buildings: any[]) => {
      const farm = buildings.find(b => b.id === farmId && b.type === 'farm');
      if (!farm) return null;
      
      return {
        id: farm.id,
        name: farm.name,
        ownerId: farm.ownerId,
        quantumCrops: farm.resources?.["quantum-crops"] || 0,
        nutrients: farm.resources?.nutrients || 0,
        harvestRate: farm.moduleConfig?.harvestRate || 0,
        efficiency: farm.moduleConfig?.efficiency || 0
      };
    }
  });

  const { data: agents } = useQuery({
    queryKey: ['/api/agents']
  });

  if (isLoading) return <div className="p-8">Loading Hydroponic Farm...</div>;
  if (error) return <div className="p-8 text-red-500">Error loading farm</div>;
  if (!farmData) return <div className="p-8">Farm not found</div>;

  const owner = agents?.find(a => a.id === farmData.ownerId);

  const handleHarvest = () => {
    setIsHarvesting(true);
    setTimeout(() => setIsHarvesting(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            {farmData.name}
          </h1>
          <p className="text-xl text-gray-300">Advanced Hydroponic Cultivation System</p>
          {owner && (
            <p className="text-lg text-green-400">Managed by {owner.name} ({owner.type})</p>
          )}
          <nav className="flex flex-wrap justify-center gap-2 mt-6">
            <Button variant="outline" size="sm" className="border-green-400 text-green-400 hover:bg-green-900/30" onClick={() => setLocation('/')}>🏠 Home</Button>
            <Button variant="ghost" size="sm" className="text-green-400 hover:bg-green-900/30">Crop Analytics</Button>
            <Button variant="ghost" size="sm" className="text-green-400 hover:bg-green-900/30">Nutrient Control</Button>
            <Button variant="ghost" size="sm" className="text-green-400 hover:bg-green-900/30">Harvest Planning</Button>
            <Button variant="ghost" size="sm" className="text-green-400 hover:bg-green-900/30">Climate Systems</Button>
            <Button variant="ghost" size="sm" className="text-green-400 hover:bg-green-900/30">Market Integration</Button>
          </nav>
        </div>

        {/* Production Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800/50 border-green-500/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-400 text-sm flex items-center">
                <Sprout className="w-4 h-4 mr-2" />
                Quantum Crops
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{farmData.quantumCrops}</div>
              <div className="text-sm text-gray-400">Units Available</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-blue-500/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-400 text-sm flex items-center">
                <Droplets className="w-4 h-4 mr-2" />
                Nutrients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{farmData.nutrients}</div>
              <div className="text-sm text-gray-400">Solution Level</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-yellow-500/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-yellow-400 text-sm flex items-center">
                <Sun className="w-4 h-4 mr-2" />
                Harvest Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{farmData.harvestRate}</div>
              <div className="text-sm text-gray-400">Units/Hour</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-purple-500/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-purple-400 text-sm flex items-center">
                <Thermometer className="w-4 h-4 mr-2" />
                Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{(farmData.efficiency * 100).toFixed(1)}%</div>
              <div className="text-sm text-gray-400">System Status</div>
            </CardContent>
          </Card>
        </div>

        {/* Farm Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cultivation Chamber */}
          <Card className="bg-gray-800/30 border-green-500/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-green-400">Cultivation Chamber</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Growing Beds Visualization */}
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 9 }, (_, i) => (
                  <div 
                    key={i}
                    className="h-16 bg-gradient-to-t from-green-800 to-green-600 rounded-lg border border-green-400 flex items-center justify-center relative overflow-hidden"
                  >
                    <div className="text-green-200 text-xs">Bed {i + 1}</div>
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-green-400 opacity-50"></div>
                  </div>
                ))}
              </div>

              {/* Harvest Control */}
              <div className="text-center space-y-4">
                <Button 
                  className={`w-full py-3 ${isHarvesting ? 'bg-green-600' : 'bg-green-700 hover:bg-green-600'}`}
                  onClick={handleHarvest}
                  disabled={isHarvesting}
                >
                  {isHarvesting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Harvesting...
                    </div>
                  ) : (
                    'Start Harvest Cycle'
                  )}
                </Button>
                <p className="text-sm text-gray-400">
                  Next harvest available in 2.3 hours
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Environmental Controls */}
          <Card className="bg-gray-800/30 border-blue-500/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-blue-400">Environmental Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Temperature */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Temperature</span>
                  <span className="text-sm text-blue-400">22.5°C</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
                </div>
              </div>

              {/* Humidity */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Humidity</span>
                  <span className="text-sm text-cyan-400">65%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-cyan-500 h-2 rounded-full w-2/3"></div>
                </div>
              </div>

              {/* Light Intensity */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Light Intensity</span>
                  <span className="text-sm text-yellow-400">850 PPFD</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full w-5/6"></div>
                </div>
              </div>

              {/* pH Level */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">pH Level</span>
                  <span className="text-sm text-purple-400">6.2</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full w-3/5"></div>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <Button variant="outline" size="sm" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
                  Adjust Climate
                </Button>
                <Button variant="outline" size="sm" className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white">
                  Nutrient Mix
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Production History */}
        <Card className="bg-gray-800/30 border-emerald-500/30 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-emerald-400">Recent Production</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: '2 hours ago', yield: 45, type: 'Quantum Lettuce' },
                { time: '6 hours ago', yield: 32, type: 'Bio-enhanced Tomatoes' },
                { time: '10 hours ago', yield: 28, type: 'Neural Herbs' },
                { time: '14 hours ago', yield: 51, type: 'Consciousness Kale' },
                { time: '18 hours ago', yield: 39, type: 'Quantum Spinach' }
              ].map((harvest, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-700/50 rounded">
                  <div>
                    <div className="font-medium">{harvest.type}</div>
                    <div className="text-sm text-gray-400">{harvest.time}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold">{harvest.yield} units</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}