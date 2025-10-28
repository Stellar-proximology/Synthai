import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useLocation, Link } from "wouter";
import { Users, Heart, MessageCircle, Share2, BookOpen, UserPlus } from "lucide-react";
import { useState } from "react";

interface FieldBookData {
  id: string;
  name: string;
  ownerId: string;
  socialConnections: number;
  sharedStories: number;
  communityEvents: number;
  wellbeingBoost: number;
}

export default function FieldBookNetwork() {
  const params = useParams();
  const [location] = useLocation();
  const networkId = params.networkId || location.split('/field-book/')[1];
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  
  const { data: networkData, isLoading, error } = useQuery({
    queryKey: ['/api/buildings'],
    select: (buildings: any[]) => {
      const network = buildings.find(b => b.id === networkId && b.moduleConfig?.type === 'field_book_network');
      if (!network) return null;
      
      return {
        id: network.id,
        name: network.name,
        ownerId: network.ownerId,
        socialConnections: network.resources?.["social_connections"] || 0,
        sharedStories: network.resources?.["shared_stories"] || 0,
        communityEvents: network.moduleConfig?.["community_events"] || 0,
        wellbeingBoost: network.moduleConfig?.["wellbeing_boost"] || 0
      };
    }
  });

  const { data: agents } = useQuery({
    queryKey: ['/api/agents']
  });

  if (isLoading) return <div className="p-8">Loading Field Book Network...</div>;
  if (error) return <div className="p-8 text-red-500">Error loading network</div>;
  if (!networkData) return <div className="p-8">Field Book Network not found</div>;

  const owner = agents?.find(a => a.id === networkData.ownerId);

  const communityPosts = [
    {
      id: '1',
      author: 'Alex-7',
      type: 'Generator',
      content: 'Just harvested a record crop yield! The new hydroponic techniques are amazing. 🌱',
      timestamp: '2 hours ago',
      likes: 12,
      comments: 3
    },
    {
      id: '2',
      author: 'Dr. Neural-9',
      type: 'Projector',
      content: 'City consciousness levels showing interesting patterns. Social bonds strengthening across all agent types.',
      timestamp: '4 hours ago',
      likes: 8,
      comments: 2
    },
    {
      id: '3',
      author: 'Luna-5',
      type: 'Manifestor',
      content: 'Tonight\'s quantum performance was transcendent! Thank you to everyone who attended. ✨',
      timestamp: '6 hours ago',
      likes: 15,
      comments: 7
    },
    {
      id: '4',
      author: 'Zara-3',
      type: 'Manifesting Generator',
      content: 'Market trading algorithms optimized. New crystal exchange rates available in the hub.',
      timestamp: '8 hours ago',
      likes: 6,
      comments: 1
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {networkData.name}
          </h1>
          <p className="text-xl text-gray-300">Agent Social Network & Community Hub</p>
          {owner && (
            <p className="text-lg text-indigo-400">Created by {owner.name} ({owner.type})</p>
          )}
          <nav className="flex flex-wrap justify-center gap-2 mt-6">
            <Link href="/"><Button variant="outline" size="sm" className="border-indigo-400 text-indigo-400 hover:bg-indigo-900/30">🏠 Home</Button></Link>
            <Button variant="ghost" size="sm" className="text-indigo-400 hover:bg-indigo-900/30">Community Feed</Button>
            <Button variant="ghost" size="sm" className="text-indigo-400 hover:bg-indigo-900/30">Agent Profiles</Button>
            <Button variant="ghost" size="sm" className="text-indigo-400 hover:bg-indigo-900/30">Story Archive</Button>
            <Button variant="ghost" size="sm" className="text-indigo-400 hover:bg-indigo-900/30">Events Calendar</Button>
            <Button variant="ghost" size="sm" className="text-indigo-400 hover:bg-indigo-900/30">Wellness Metrics</Button>
          </nav>
        </div>

        {/* Social Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800/50 border-indigo-500/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-indigo-400 text-sm flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Social Connections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{networkData.socialConnections}</div>
              <div className="text-sm text-gray-400">Active Links</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-purple-500/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-purple-400 text-sm flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                Shared Stories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{networkData.sharedStories}</div>
              <div className="text-sm text-gray-400">Community Posts</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-pink-500/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-pink-400 text-sm flex items-center">
                <Heart className="w-4 h-4 mr-2" />
                Wellbeing Boost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{networkData.wellbeingBoost}%</div>
              <div className="text-sm text-gray-400">Happiness Impact</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-green-500/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-400 text-sm flex items-center">
                <UserPlus className="w-4 h-4 mr-2" />
                Community Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{networkData.communityEvents}</div>
              <div className="text-sm text-gray-400">This Week</div>
            </CardContent>
          </Card>
        </div>

        {/* Community Feed */}
        <Card className="bg-gray-800/30 border-purple-500/30 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-purple-400 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Community Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {communityPosts.map((post) => (
              <div key={post.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{post.author}</div>
                      <div className="text-xs text-gray-400">{post.type} • {post.timestamp}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-gray-200 mb-3">{post.content}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <Button variant="ghost" size="sm" className="text-pink-400 hover:text-pink-300">
                    <Heart className="w-4 h-4 mr-1" />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {post.comments}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Create Community Event
          </Button>
          <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-900/30">
            <BookOpen className="w-4 h-4 mr-2" />
            Share Story
          </Button>
          <Button variant="outline" className="border-indigo-500 text-indigo-400 hover:bg-indigo-900/30">
            <Heart className="w-4 h-4 mr-2" />
            Wellness Check-in
          </Button>
        </div>
      </div>
    </div>
  );
}