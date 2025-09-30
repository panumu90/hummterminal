import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import ImpactAnalysis from "@/pages/impact-analysis";
import Roadmap from "@/pages/roadmap";
import TechLeadCV from "@/pages/tech-lead-cv";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/impact-analysis" component={ImpactAnalysis} />
      <Route path="/roadmap" component={Roadmap} />
      <Route path="/tech-lead-cv" component={TechLeadCV} />
      <Route component={NotFound} />
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
