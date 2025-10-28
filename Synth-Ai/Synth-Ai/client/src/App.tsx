import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import NotFound from "@/pages/not-found";
import AgentCity from "@/pages/AgentCity";
import ScienceLabDashboard from "@/pages/ScienceLabDashboard";
import AnalyticsDashboard from "@/pages/AnalyticsDashboard";
import MusicPlayer from "@/pages/MusicPlayer";
import FarmDashboard from "@/pages/FarmDashboard";
import TradingHub from "@/pages/TradingHub";
import TheaterStage from "@/pages/TheaterStage";
import FieldBookNetwork from "@/pages/FieldBookNetwork";
import ConsciousnessBonding from "@/pages/ConsciousnessBonding";

function Router() {
  return (
    <Switch>
      <Route path="/" component={AgentCity} />
      <Route path="/lab/:labId">
        <Layout>
          <ScienceLabDashboard />
        </Layout>
      </Route>
      <Route path="/analytics/:dashboardId">
        <Layout>
          <AnalyticsDashboard />
        </Layout>
      </Route>
      <Route path="/music/:playerId">
        <Layout>
          <MusicPlayer />
        </Layout>
      </Route>
      <Route path="/farm/:farmId">
        <Layout>
          <FarmDashboard />
        </Layout>
      </Route>
      <Route path="/trading/:hubId">
        <Layout>
          <TradingHub />
        </Layout>
      </Route>
      <Route path="/theater/:theaterId">
        <Layout>
          <TheaterStage />
        </Layout>
      </Route>
      <Route path="/field-book/:networkId">
        <Layout>
          <FieldBookNetwork />
        </Layout>
      </Route>
      <Route path="/consciousness/:agentId">
        <Layout>
          <ConsciousnessBonding />
        </Layout>
      </Route>
      <Route>
        <Layout>
          <NotFound />
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
