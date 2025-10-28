import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useLocation, Link } from "wouter";
import { Play, Pause, Users, Star, Calendar, Mic } from "lucide-react";
import { useState } from "react";

interface TheaterData {
  id: string;
  name: string;
  ownerId: string;
  inspiration: number;
  audienceCapacity: number;
  performanceQuality: number;
  socialImpact: number;
}

export default function TheaterStage() {
  const params = useParams();
  const [location] = useLocation();
  const theaterId = params.theaterId || location.split('/theater/')[1];
  const [isPerforming, setIsPerforming] = useState(false);
  const [selectedShow, setSelectedShow] = useState<string | null>(null);
  
  const { data: theaterData, isLoading, error } = useQuery({
    queryKey: ['/api/buildings'],
    select: (buildings: any[]) => {
      const theater = buildings.find(b => b.id === theaterId && b.type === 'theater');
      if (!theater) return null;
      
      return {
        id: theater.id,
        name: theater.name,
        ownerId: theater.ownerId,
        inspiration: theater.resources?.inspiration || 0,
        audienceCapacity: theater.resources?.["audience-capacity"] || 0,
        performanceQuality: theater.moduleConfig?.["performance-quality"] || 0,
        socialImpact: theater.moduleConfig?.["social-impact"] || 0
      };
    }
  });

  const { data: agents } = useQuery({
    queryKey: ['/api/agents']
  });

  if (isLoading) return <div className="p-8">Loading Quantum Stage...</div>;
  if (error) return <div className="p-8 text-red-500">Error loading theater</div>;
  if (!theaterData) return <div className="p-8">Theater not found</div>;

  const owner = agents?.find(a => a.id === theaterData.ownerId);

  const upcomingShows = [
    {
      id: '1',
      title: 'Quantum Dreams',
      performer: 'Luna-5',
      time: '20:00',
      date: 'Tonight',
      genre: 'Consciousness Opera',
      audience: 23,
      status: 'Tonight'
    },
    {
      id: '2',
      title: 'Digital Reverie',
      performer: 'Luna-5',
      time: '19:30',
      date: 'Tomorrow',
      genre: 'AI Symphony',
      audience: 45,
      status: 'Upcoming'
    },
    {
      id: '3',
      title: 'Neural Networks',
      performer: 'Dr. Neural-9',
      time: '21:00',
      date: 'Fri',
      genre: 'Science Theater',
      audience: 18,
      status: 'Upcoming'
    }
  ];

  const pastPerformances = [
    { title: 'Auric Field Harmonics', audience: 42, rating: 4.8, revenue: 336 },
    { title: 'Generator Flow State', audience: 38, rating: 4.6, revenue: 304 },
    { title: 'Consciousness Rising', audience: 51, rating: 4.9, revenue: 408 },
    { title: 'Digital Empathy', audience: 29, rating: 4.7, revenue: 232 }
  ];

  const handleStartPerformance = () => {
    setIsPerforming(true);
    // Live performance simulation - shows real-time audience engagement
    setTimeout(() => {
      setIsPerforming(false);
      // Boost theater metrics after successful performance
      console.log("Performance completed! Audience loved it!");
    }, 5000); // 5 second live performance
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            {theaterData.name}
          </h1>
          <p className="text-xl text-gray-300">Quantum Performance & Arts Center</p>
          {owner && (
            <p className="text-lg text-pink-400">Directed by {owner.name} ({owner.type})</p>
          )}
          <nav className="flex flex-wrap justify-center gap-2 mt-6">
            <Link href="/"><Button variant="outline" size="sm" className="border-pink-400 text-pink-400 hover:bg-pink-900/30">🏠 Home</Button></Link>
            <Button variant="ghost" size="sm" className="text-pink-400 hover:bg-pink-900/30">Show Calendar</Button>
            <Button variant="ghost" size="sm" className="text-pink-400 hover:bg-pink-900/30">Performance Studio</Button>
            <Button variant="ghost" size="sm" className="text-pink-400 hover:bg-pink-900/30">Audience Analytics</Button>
            <Button variant="ghost" size="sm" className="text-pink-400 hover:bg-pink-900/30">Revenue Reports</Button>
            <Button variant="ghost" size="sm" className="text-pink-400 hover:bg-pink-900/30">Artist Network</Button>
          </nav>
          <p className="text-xl text-gray-300">Immersive Performance & Consciousness Experience</p>
          {owner && (
            <p className="text-lg text-pink-400">Directed by {owner.name} ({owner.type})</p>
          )}
        </div>

        {/* Theater Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800/50 border-pink-500/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-pink-400 text-sm flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Inspiration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{theaterData.inspiration}</div>
              <div className="text-sm text-gray-400">Creative Energy</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-blue-500/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-400 text-sm flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Capacity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{theaterData.audienceCapacity}</div>
              <div className="text-sm text-gray-400">Max Audience</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-yellow-500/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-yellow-400 text-sm flex items-center">
                <Mic className="w-4 h-4 mr-2" />
                Quality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{(theaterData.performanceQuality * 100).toFixed(0)}%</div>
              <div className="text-sm text-gray-400">Performance Level</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-green-500/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-400 text-sm flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{(theaterData.socialImpact * 100).toFixed(0)}%</div>
              <div className="text-sm text-gray-400">Social Resonance</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Stage Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stage Control */}
          <Card className="bg-gray-800/30 border-pink-500/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-pink-400">Live Stage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stage Visualization */}
              <div className="relative">
                <div className="h-48 bg-gradient-to-t from-purple-900 to-pink-800 rounded-lg border-2 border-pink-500/50 flex items-center justify-center relative overflow-hidden">
                  {/* Stage Lights */}
                  <div className="absolute top-2 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <div className="absolute top-2 right-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                  
                  {/* Performance Area */}
                  <div className={`text-center transition-all duration-1000 ${isPerforming ? 'scale-110 text-pink-300 animate-pulse' : 'text-purple-300'}`}>
                    <div className="text-6xl mb-2">{isPerforming ? '✨' : '🎭'}</div>
                    <div className="text-sm font-medium">
                      {isPerforming ? 'LIVE: Quantum Dreams' : 'Stage Ready'}
                    </div>
                    {isPerforming && (
                      <div className="text-xs text-pink-200 mt-1 animate-bounce">
                        👥 Live Audience: {Math.floor(Math.random() * 15) + 25} viewers
                      </div>
                    )}
                  </div>
                  
                  {/* Audience Area */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-1">
                    {Array.from({ length: isPerforming ? 12 : 8 }, (_, i) => (
                      <div 
                        key={i} 
                        className={`w-1 h-1 rounded-full transition-all duration-500 ${
                          isPerforming 
                            ? 'bg-pink-400 animate-pulse' 
                            : 'bg-white/30'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Performance Controls */}
              <div className="space-y-4">
                <Button 
                  className={`w-full py-3 ${isPerforming ? 'bg-pink-600' : 'bg-pink-700 hover:bg-pink-600'}`}
                  onClick={handleStartPerformance}
                  disabled={isPerforming}
                >
                  {isPerforming ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      🔴 LIVE: Quantum Dreams
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Play className="w-4 h-4 mr-2" />
                      Start Performance
                    </div>
                  )}
                </Button>
                
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" className="border-purple-500 text-purple-400">
                    Lighting
                  </Button>
                  <Button variant="outline" size="sm" className="border-blue-500 text-blue-400">
                    Sound
                  </Button>
                  <Button variant="outline" size="sm" className="border-green-500 text-green-400">
                    Effects
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Show Schedule */}
          <Card className="bg-gray-800/30 border-purple-500/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-purple-400">Live Show Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingShows.map((show) => (
                  <div 
                    key={show.id}
                    className={`p-4 rounded border cursor-pointer transition-all ${
                      show.status === 'Tonight' 
                        ? 'bg-pink-900/50 border-pink-500/50 hover:bg-pink-900/70' 
                        : 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50'
                    } ${selectedShow === show.id ? 'ring-2 ring-pink-400' : ''}`}
                    onClick={() => setSelectedShow(show.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-lg">{show.title}</div>
                        <div className="text-sm text-gray-400">by {show.performer}</div>
                        <div className="text-xs text-purple-400 mt-1">{show.genre}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm px-2 py-1 rounded flex items-center ${
                          show.status === 'Tonight' ? 'bg-pink-600 text-white' : 'bg-gray-600 text-gray-300'
                        }`}>
                          {show.status === 'Tonight' && (
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse mr-2"></div>
                          )}
                          {show.date} {show.time}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Expected: {show.audience} guests
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance History */}
        <Card className="bg-gray-800/30 border-green-500/30 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-green-400">Recent Performances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {pastPerformances.map((performance, index) => (
                <div key={index} className="p-4 bg-gray-700/50 rounded border border-gray-600">
                  <div className="font-medium mb-2">{performance.title}</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Audience:</span>
                      <span className="text-blue-400">{performance.audience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rating:</span>
                      <span className="text-yellow-400">★ {performance.rating}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Revenue:</span>
                      <span className="text-green-400">{performance.revenue} credits</span>
                    </div>
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