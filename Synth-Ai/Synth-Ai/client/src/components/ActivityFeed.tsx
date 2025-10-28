import { type Activity } from "@shared/schema";

interface ActivityFeedProps {
  activities: Activity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "harvest": return "fas fa-seedling";
      case "plant": return "fas fa-leaf";
      case "trade": return "fas fa-coins";
      case "research": return "fas fa-flask";
      case "performance": return "fas fa-theater-masks";
      case "move": return "fas fa-walking";
      default: return "fas fa-circle";
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "harvest":
      case "plant":
        return "bg-neon-green border-neon-green/20";
      case "trade":
        return "bg-amber border-amber/20";
      case "research":
        return "bg-cyber-blue border-cyber-blue/20";
      case "performance":
        return "bg-hot-pink border-hot-pink/20";
      case "move":
        return "bg-gray-500 border-gray-500/20";
      default:
        return "bg-electric border-electric/20";
    }
  };

  const formatTimeAgo = (timestamp: Date | string | undefined) => {
    if (!timestamp) return "just now";
    
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="glass-panel rounded-xl p-4">
      <h3 className="font-orbitron text-lg font-bold text-neon-green mb-4">Live City Activity</h3>
      <div className="space-y-3 max-h-48 overflow-y-auto cyber-scrollbar">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto bg-gray-600/20 rounded-full flex items-center justify-center mb-3">
              <i className="fas fa-clock text-gray-500"></i>
            </div>
            <p className="text-gray-500 text-sm">No recent activity</p>
            <p className="text-gray-600 text-xs mt-1">Agent activities will appear here as they happen</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-center space-x-3 p-3 bg-deep-space/50 rounded-lg border animate-slide-up"
              data-testid={`activity-${activity.id}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                <i className={`${getActivityIcon(activity.type)} text-deep-space text-xs`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300 truncate" data-testid="activity-description">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 font-mono" data-testid="activity-timestamp">
                  {formatTimeAgo(activity.timestamp)}
                </p>
              </div>
              {activity.data && Object.keys(activity.data as any).length > 0 && (
                <button 
                  className="p-1 text-gray-500 hover:text-neon-green transition-colors"
                  title="View details"
                  data-testid="activity-details"
                >
                  <i className="fas fa-info-circle text-xs"></i>
                </button>
              )}
            </div>
          ))
        )}
      </div>
      
      {activities.length > 0 && (
        <div className="mt-3 text-center">
          <button 
            className="text-xs text-gray-500 hover:text-neon-green transition-colors"
            data-testid="button-load-more-activities"
          >
            Load more activities
          </button>
        </div>
      )}
    </div>
  );
}
