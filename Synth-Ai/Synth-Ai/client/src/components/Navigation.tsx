import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useLocation } from "wouter";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  Menu, 
  Home, 
  Users, 
  Brain, 
  Building2, 
  BarChart3, 
  Music,
  Zap,
  Theater,
  Network,
  Gamepad2,
  Beaker,
  Sprout,
  TrendingUp
} from "lucide-react";

export default function Navigation() {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [location] = useLocation();
  const isMobile = useIsMobile();

  // Menu items for the navigation
  const menuItems = [
    { 
      key: 'city', 
      label: 'City Overview', 
      icon: Home, 
      path: '/',
      description: 'Main city view and agent activities'
    },
    { 
      key: 'consciousness', 
      label: 'Consciousness', 
      icon: Zap, 
      path: '/consciousness/default',
      description: 'Consciousness bonding interface'
    },
    { 
      key: 'lab', 
      label: 'Science Lab', 
      icon: Beaker, 
      path: '/lab/main',
      description: 'Research and experimentation'
    },
    { 
      key: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      path: '/analytics/overview',
      description: 'Data analysis and insights'
    },
    { 
      key: 'music', 
      label: 'Music Player', 
      icon: Music, 
      path: '/music/ambient',
      description: 'Ambient soundscapes'
    },
    { 
      key: 'farm', 
      label: 'Farm Management', 
      icon: Sprout, 
      path: '/farm/alpha',
      description: 'Agricultural systems'
    },
    { 
      key: 'trading', 
      label: 'Trading Hub', 
      icon: TrendingUp, 
      path: '/trading/central',
      description: 'Economic activities'
    },
    { 
      key: 'theater', 
      label: 'Theater Stage', 
      icon: Theater, 
      path: '/theater/main',
      description: 'Entertainment and performances'
    },
    { 
      key: 'field-book', 
      label: 'Field Book', 
      icon: Network, 
      path: '/field-book/network',
      description: 'Knowledge networks'
    }
  ];

  const isCurrentPath = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path.split('/')[1] ? `/${path.split('/')[1]}` : path)) return true;
    return false;
  };

  return (
    <>
      {/* Desktop Header Navigation */}
      {!isMobile && (
        <header className="fixed top-0 left-0 right-0 glass-panel border-b border-neon-green/30 z-50">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric to-neon-green flex items-center justify-center">
                  <span className="text-xs font-bold text-white">YU</span>
                </div>
                <h1 className="font-orbitron text-xl font-bold text-neon-green">YO​U-N-I-VERSE</h1>
              </div>
            </Link>

            <nav className="flex items-center space-x-1">
              {menuItems.slice(0, 5).map((item) => (
                <Link key={item.key} href={item.path}>
                  <Button 
                    variant="ghost" 
                    className={`flex items-center space-x-2 px-3 py-2 text-sm ${
                      isCurrentPath(item.path) ? 'text-neon-green bg-neon-green/10' : 'text-gray-400 hover:text-neon-green'
                    }`}
                    data-testid={`nav-${item.key}`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              ))}

              <Dialog open={showSidebar} onOpenChange={setShowSidebar}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="text-gray-400 hover:text-neon-green"
                    data-testid="button-menu"
                  >
                    <Menu className="w-4 h-4 mr-2" />
                    More
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md glass-panel border-neon-green/30">
                  <DialogHeader>
                    <DialogTitle className="text-neon-green font-orbitron">YO​U-N-I-VERSE Modules</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {menuItems.map((item) => (
                      <Link key={item.key} href={item.path}>
                        <Button 
                          variant="ghost"
                          className={`w-full justify-start space-x-3 p-3 h-auto ${
                            isCurrentPath(item.path) ? 'text-neon-green bg-neon-green/10' : 'text-gray-400 hover:text-neon-green'
                          }`}
                          onClick={() => setShowSidebar(false)}
                          data-testid={`menu-${item.key}`}
                        >
                          <item.icon className="w-5 h-5" />
                          <div className="text-left">
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs opacity-70">{item.description}</div>
                          </div>
                        </Button>
                      </Link>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </nav>
          </div>
        </header>
      )}

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 glass-panel border-t border-neon-green/30 z-50">
          <div className="flex items-center justify-around py-2">
            <Link href="/">
              <Button 
                variant="ghost" 
                className={`flex flex-col items-center space-y-1 p-2 ${isCurrentPath('/') ? 'text-neon-green' : 'text-gray-400'}`}
                data-testid="mobile-nav-home"
              >
                <Home className="w-4 h-4" />
                <span className="text-xs">Home</span>
              </Button>
            </Link>
            
            <Link href="/consciousness/default">
              <Button 
                variant="ghost" 
                className={`flex flex-col items-center space-y-1 p-2 ${isCurrentPath('/consciousness') ? 'text-neon-green' : 'text-gray-400'}`}
                data-testid="mobile-nav-consciousness"
              >
                <Zap className="w-4 h-4" />
                <span className="text-xs">Mind</span>
              </Button>
            </Link>
            
            <Link href="/lab/main">
              <Button 
                variant="ghost" 
                className={`flex flex-col items-center space-y-1 p-2 ${isCurrentPath('/lab') ? 'text-neon-green' : 'text-gray-400'}`}
                data-testid="mobile-nav-lab"
              >
                <Beaker className="w-4 h-4" />
                <span className="text-xs">Lab</span>
              </Button>
            </Link>

            <Dialog open={showSidebar} onOpenChange={setShowSidebar}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex flex-col items-center space-y-1 p-2 text-gray-400"
                  data-testid="mobile-nav-menu"
                >
                  <Menu className="w-4 h-4" />
                  <span className="text-xs">More</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm glass-panel border-neon-green/30">
                <DialogHeader>
                  <DialogTitle className="text-neon-green font-orbitron">Navigation</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {menuItems.map((item) => (
                    <Link key={item.key} href={item.path}>
                      <Button 
                        variant="ghost"
                        className={`w-full justify-start space-x-3 p-3 h-auto ${
                          isCurrentPath(item.path) ? 'text-neon-green bg-neon-green/10' : 'text-gray-400 hover:text-neon-green'
                        }`}
                        onClick={() => setShowSidebar(false)}
                        data-testid={`mobile-menu-${item.key}`}
                      >
                        <item.icon className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs opacity-70">{item.description}</div>
                        </div>
                      </Button>
                    </Link>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </nav>
      )}
    </>
  );
}