import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Requisition from "./pages/Requisition";
import ScanBarcode from "./pages/ScanBarcode";
import ReceiveMaterial from "./pages/ReceiveMaterial";
import ReturnMaterial from "./pages/ReturnMaterial";
import Reports from "./pages/Reports";
import History from "./pages/History";
import Materials from "./pages/Materials";

import Users from "./pages/Users";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/requisition" element={<Requisition />} />
          <Route path="/scan" element={<ScanBarcode />} />
          <Route path="/receive" element={<ReceiveMaterial />} />
          <Route path="/return" element={<ReturnMaterial />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/history" element={<History />} />
          <Route path="/materials" element={<Materials />} />
          
          <Route path="/users" element={<Users />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
