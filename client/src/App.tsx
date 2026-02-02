import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/Home";
import RegisterCustomer from "@/pages/RegisterCustomer";
import CustomersList from "@/pages/CustomersList";
import CustomerDetails from "@/pages/CustomerDetails";
import LoanCalculator from "@/pages/LoanCalculator";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/register" component={RegisterCustomer} />
      <Route path="/customers" component={CustomersList} />
      <Route path="/customers/:id" component={CustomerDetails} />
      <Route path="/calculator" component={LoanCalculator} />
      
      {/* Fallback to 404 */}
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
