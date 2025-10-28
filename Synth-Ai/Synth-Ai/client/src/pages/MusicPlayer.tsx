import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useLocation, Link } from "wouter";
import { Play, Pause, SkipForward, SkipBack, Volume2, Shuffle, Repeat } from "lucide-react";
import { useState } from "react";

interface MusicPlayerData {
  id: string;
  name: string;
  ownerId: string;
  tracks: number;
  playlists: number;
  listeningHours: number;
  features: string[];
}

export default function MusicPlayer() {
  const params = useParams();
  const [location] = useLocation();
  const playerId = params.playerId || location.split('/music/')[1];
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  
  const { data: playerData, isLoading, error } = useQuery({
    queryKey: ['/api/buildings'],
    select: (buildings: any[]) => {
      const player = buildings.find(b => b.id === playerId && b.moduleConfig?.type === 'music_player');
      if (!player) return null;
      
      return {
        id: player.id,
        name: player.name,
        ownerId: player.ownerId,
        tracks: player.resources?.tracks || 0,
        playlists: player.resources?.playlists || 0,
        listeningHours: player.resources?.listening_hours || 0,
        features: player.moduleConfig?.features || []
      };
    }
  });

  const { data: agents } = useQuery({
    queryKey: ['/api/agents']
  });

  if (isLoading) return <div className="p-8">Loading Quantum Music Player...</div>;
  if (error) return <div className="p-8 text-red-500">Error loading music player</div>;
  if (!playerData) return <div className="p-8">Music Player not found</div>;

  // Sample playlist data
  const playlists = [
    { id: 1, name: "Consciousness Frequencies", tracks: 12, genre: "Ambient Techno" },
    { id: 2, name: "Agent Work Vibes", tracks: 8, genre: "Cyberpunk" },
    { id: 3, name: "City Harmony", tracks: 15, genre: "Generative" },
    { id: 4, name: "Neural Patterns", tracks: 6, genre: "AI-Generated" },
    { id: 5, name: "Social Resonance", tracks: 10, genre: "Collaborative" }
  ];

  const currentPlaylist = playlists[0];
  const tracks = [
    "Digital Dreams - Synthia's Lullaby",
    "Generator Flow State",
    "Projector's Invitation",
    "Manifestor's Declaration", 
    "Reflector's Moon Cycle",
    "Collective Intelligence Rising",
    "Auric Field Harmonics",
    "Quantum Crop Harvest",
    "Trading Post Blues",
    "Neural Lab Frequencies",
    "Performance Space Echo",
    "City Grid Pulse"
  ];

  const owner = agents?.find(a => a.id === playerData.ownerId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
            {playerData.name}
          </h1>
          <p className="text-xl text-gray-300">Immersive Music Experience for Agents and Users</p>
          {owner && (
            <p className="text-lg text-purple-400">Created by {owner.name} ({owner.type})</p>
          )}
          <nav className="flex flex-wrap justify-center gap-2 mt-6">
            <Link href="/"><Button variant="outline" size="sm" className="border-purple-400 text-purple-400 hover:bg-purple-900/30">🏠 Home</Button></Link>
            <Button variant="ghost" size="sm" className="text-purple-400 hover:bg-purple-900/30">Music Library</Button>
            <Button variant="ghost" size="sm" className="text-purple-400 hover:bg-purple-900/30">Playlist Creator</Button>
            <Button variant="ghost" size="sm" className="text-purple-400 hover:bg-purple-900/30">Audio Visualizer</Button>
            <Button variant="ghost" size="sm" className="text-purple-400 hover:bg-purple-900/30">Social Listening</Button>
          </nav>
        </div>

        {/* Player Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-800/50 border-purple-500/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-pink-400 text-sm">Music Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{playerData.tracks}</div>
              <div className="text-sm text-gray-400">Available Tracks</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-blue-500/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-400 text-sm">Playlists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{playerData.playlists}</div>
              <div className="text-sm text-gray-400">Curated Collections</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-green-500/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-400 text-sm">Listening Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{playerData.listeningHours}</div>
              <div className="text-sm text-gray-400">Hours Played</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Player Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Track Display */}
          <Card className="lg:col-span-2 bg-gray-800/30 border-purple-500/30 backdrop-blur">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                {/* Album Art Placeholder */}
                <div className="w-64 h-64 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <div className="text-6xl">🎵</div>
                </div>
                
                {/* Track Info */}
                <div>
                  <h3 className="text-2xl font-bold">{tracks[currentTrack]}</h3>
                  <p className="text-gray-400">From "{currentPlaylist.name}"</p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full w-1/3"></div>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>1:23</span>
                  <span>3:45</span>
                </div>

                {/* Player Controls */}
                <div className="flex items-center justify-center space-x-6">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Shuffle className="w-5 h-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-400 hover:text-white"
                    onClick={() => setCurrentTrack(Math.max(0, currentTrack - 1))}
                  >
                    <SkipBack className="w-6 h-6" />
                  </Button>
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700 w-16 h-16 rounded-full"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-400 hover:text-white"
                    onClick={() => setCurrentTrack(Math.min(tracks.length - 1, currentTrack + 1))}
                  >
                    <SkipForward className="w-6 h-6" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Repeat className="w-5 h-5" />
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center justify-center space-x-4">
                  <Volume2 className="w-5 h-5 text-gray-400" />
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full w-3/4"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Playlists & Queue */}
          <div className="space-y-6">
            {/* Current Playlist */}
            <Card className="bg-gray-800/30 border-blue-500/30 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-blue-400">Now Playing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tracks.slice(0, 8).map((track, index) => (
                    <div 
                      key={index}
                      className={`p-2 rounded cursor-pointer transition-colors ${
                        index === currentTrack 
                          ? 'bg-purple-600/50 text-white' 
                          : 'hover:bg-gray-700/50 text-gray-300'
                      }`}
                      onClick={() => setCurrentTrack(index)}
                    >
                      <div className="text-sm font-medium truncate">{track}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Available Playlists */}
            <Card className="bg-gray-800/30 border-green-500/30 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-green-400">Playlists</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {playlists.map((playlist) => (
                    <div 
                      key={playlist.id}
                      className="p-3 rounded hover:bg-gray-700/50 cursor-pointer transition-colors"
                    >
                      <div className="font-medium">{playlist.name}</div>
                      <div className="text-sm text-gray-400">{playlist.tracks} tracks • {playlist.genre}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <Card className="bg-gray-800/30 border-pink-500/30 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-pink-400">Player Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {playerData.features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-gray-700/50 p-4 rounded-lg text-center hover:bg-gray-600/50 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-200">{feature}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}