
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { OrganizationProvider } from "./contexts/OrganizationContext";
import PublicHomePage from "./pages/PublicHomePage";
import OrganizationSelector from "./pages/OrganizationSelector";
import Dashboard from "./pages/Dashboard";
import ElectionManagement from "./pages/ElectionManagement";
import UserManagement from "./pages/UserManagement";
import Results from "./pages/Results";
import CampaignManagement from "./pages/CampaignManagement";
import OperationDetail from "./pages/OperationDetail";
import Conversations from "./pages/Conversations";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import VotingCenters from "./pages/VotingCenters";

// Create QueryClient outside of component to avoid recreation on every render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <OrganizationProvider>
            <NotificationProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<PublicHomePage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/organizations" element={<OrganizationSelector />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/elections" element={<ElectionManagement />} />
                  <Route path="/centers" element={<VotingCenters />} />
                  <Route path="/users" element={<UserManagement />} />
                  <Route path="/results" element={<Results />} />
                  <Route path="/campaign" element={<CampaignManagement />} />
                  <Route path="/campaign/operation/:id" element={<OperationDetail />} />
                  <Route path="/conversations" element={<Conversations />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
              <Toaster />
              <Sonner />
            </NotificationProvider>
          </OrganizationProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
