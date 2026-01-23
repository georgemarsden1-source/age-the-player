import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Setup from "@/pages/setup";
import Rules from "@/pages/rules";
import Game from "@/pages/game";
import Results from "@/pages/results";
import SearchPage from "@/pages/search";
import Privacy from "@/pages/privacy";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/setup" component={Setup} />
      <Route path="/rules" component={Rules} />
      <Route path="/game" component={Game} />
      <Route path="/results" component={Results} />
      <Route path="/search" component={SearchPage} />
      <Route path="/privacy" component={Privacy} />
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
