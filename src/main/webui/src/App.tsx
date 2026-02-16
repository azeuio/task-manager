import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import NotFound from "./NotFound";
import Dashboard from "./pages/DashboardPage";
import SidebarLayout from "./layouts/SidebarLayout";
import ProjectPage from "./pages/ProjectPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <SidebarLayout>
                <Dashboard />
              </SidebarLayout>
            }
          />
          <Route path="/projects/:projectId" element={<ProjectPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
