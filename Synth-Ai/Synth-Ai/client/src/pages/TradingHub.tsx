import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useLocation } from "wouter";
import { TrendingUp, Coins, Package, Users } from "lucide-react";
import { useState } from "react";

interface TradingData {
  id: string;
  name: string;
  ownerId: string;
  quantumCrystals: number;
  credits: number;
  tradeVolume: number;
  marketAccess: boolean;
}

export default function TradingHub() {
  const params = useParams();
  const [location] = useLocation();
  const hubId = params.hubId || location.split('/trading/')[1];
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  
  const { data: hubData, isLoading, error } = useQuery({
    queryKey: ['/api/buildings'],
    select: (buildings: any[]) => {
      const hub = buildings.find(b => b.id === hubId && b.type === 'trading');
      if (!hub) return null;
      
      return {
        id: hub.id,
        name: hub.name,
        ownerId: hub.ownerId,
        quantumCrystals: hub.resources?.["quantum-crystals"] || 0,
        credits: hub.resources?.credits || 0,
        tradeVolume: hub.moduleConfig?.tradeVolume || 0,
        marketAccess: hub.moduleConfig?.marketAccess || false
      };
    }
  });

  const { data: agents } = useQuery({
    queryKey: ['/api/agents']
  });

  if (isLoading) return <div className="p-8">Loading Trading Hub...</div>;
  if (error) return <div className="p-8 text-red-500">Error loading trading hub</div>;
  if (!hubData) return <div className="p-8">Trading Hub not found</div>;

  const owner = agents?.find(a => a.id === hubData.ownerId);

  const marketOrders = [
    { id: '1', type: 'BUY', item: 'Quantum Crops', quantity: 150, price: 12.5, trader: 'Alex-7' },
    { id: '2', type: 'SELL', item: 'Neural Data', quantity: 25, price: 45.0, trader: 'Dr. Neural-9' },
    { id: '3', type: 'BUY', item: 'Performance Tickets', quantity: 50, price: 8.2, trader: 'Luna-5' },
    { id: '4', type: 'SELL', item: 'Research Points', quantity: 100, price: 15.7, trader: 'Dr. Neural-9' },
    { id: '5', type: 'BUY', item: 'Social Connections', quantity: 75, price: 6.8, trader: 'Zara-3' }
  ];

  const recentTrades = [
    { time: '5 min ago', item: 'Quantum Crystals', quantity: 20, price: 35.0, total: 700 },
    { time: '12 min ago', item: 'Bio Nutrients', quantity: 80, price: 4.5, total: 360 },
    { time: '23 min ago', item: 'Entertainment Credits', quantity: 45, price: 12.0, total: 540 },
    { time: '34 min ago', item: 'Research Data', quantity: 15, price: 28.0, total: 420 },
    { time: '1 hour ago', item: 'Social Tokens', quantity: 120, price: 2.8, total: 336 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-yellow-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
            {hubData.name}
          </h1>
          <p className="text-xl text-gray-300">Inter-Agent Commerce Platform</p>
          {owner && (
            <p className="text-lg text-amber-400">Operated by {owner.name} ({owner.type})</p>
          )}
          <nav className="flex flex-wrap justify-center gap-2 mt-6">
            <Button variant="outline" size="sm" className="border-amber-400 text-amber-400 hover:bg-amber-900/30" onClick={() => setLocation('/')}>🏠 Home</Button>
            <Button variant="ghost" size="sm" className="text-amber-400 hover:bg-amber-900/30">Market Orders</Button>
            <Button variant="ghost" size="sm" className="text-amber-400 hover:bg-amber-900/30">Price Analytics</Button>
            <Button variant="ghost" size="sm" className="text-amber-400 hover:bg-amber-900/30">Trade History</Button>
            <Button variant="ghost" size="sm" className="text-amber-400 hover:bg-amber-900/30">Portfolio Management</Button>
            <Button variant="ghost" size="sm" className="text-amber-400 hover:bg-amber-900/30">Futures Market</Button>
          </nav>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800/50 border-amber-500/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-amber-400 text-sm flex items-center">
                <Package className="w-4 h-4 mr-2" />
                Quantum Crystals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{hubData.quantumCrystals}</div>
              <div className="text-sm text-gray-400">In Inventory</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-green-500/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-400 text-sm flex items-center">
                <Coins className="w-4 h-4 mr-2" />
                Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{hubData.credits.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Available Balance</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-blue-500/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-400 text-sm flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Trade Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{hubData.tradeVolume}</div>
              <div className="text-sm text-gray-400">Daily Transactions</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-purple-500/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-purple-400 text-sm flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Market Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">
                {hubData.marketAccess ? 'OPEN' : 'CLOSED'}
              </div>
              <div className="text-sm text-gray-400">Trading Access</div>
            </CardContent>
          </Card>
        </div>

        {/* Market Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Orders */}
          <Card className="bg-gray-800/30 border-amber-500/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-amber-400">Market Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {marketOrders.map((order) => (
                  <div 
                    key={order.id}
                    className={`p-3 rounded border cursor-pointer transition-all ${
                      order.type === 'BUY' 
                        ? 'bg-green-900/30 border-green-500/50 hover:bg-green-900/50' 
                        : 'bg-red-900/30 border-red-500/50 hover:bg-red-900/50'
                    } ${selectedOrder === order.id ? 'ring-2 ring-amber-400' : ''}`}
                    onClick={() => setSelectedOrder(order.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            order.type === 'BUY' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                          }`}>
                            {order.type}
                          </span>
                          <span className="font-medium">{order.item}</span>
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          {order.quantity} units × {order.price} credits
                        </div>
                        <div className="text-xs text-gray-500">by {order.trader}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-amber-400">
                          {(order.quantity * order.price).toFixed(0)} credits
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedOrder && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex space-x-3">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      Execute Trade
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trade History */}
          <Card className="bg-gray-800/30 border-green-500/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-green-400">Recent Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTrades.map((trade, index) => (
                  <div key={index} className="p-3 bg-gray-700/50 rounded border border-gray-600">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{trade.item}</div>
                        <div className="text-sm text-gray-400">
                          {trade.quantity} units × {trade.price}
                        </div>
                        <div className="text-xs text-gray-500">{trade.time}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-400">
                          {trade.total} credits
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trading Tools */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-800/30 border-blue-500/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-blue-400 text-sm">Market Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Quantum Crops</span>
                  <span className="text-green-400">↗ +12.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Neural Data</span>
                  <span className="text-red-400">↘ -3.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Research Points</span>
                  <span className="text-green-400">↗ +8.7%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/30 border-purple-500/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-purple-400 text-sm">Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400 mb-2">2,840 credits</div>
              <div className="text-sm text-gray-400">
                <span className="text-green-400">+156 credits</span> today
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/30 border-orange-500/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-orange-400 text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full border-orange-500 text-orange-400">
                  Place Order
                </Button>
                <Button variant="outline" size="sm" className="w-full border-blue-500 text-blue-400">
                  Check Inventory
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}