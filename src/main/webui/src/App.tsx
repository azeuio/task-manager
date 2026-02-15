import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import NotFound from './NotFound';
import Dashboard from './pages/DashboardPage';
import React from 'react';
// import keycloak from './keycloak';
import SidebarLayout from './layouts/SidebarLayout';
import ProjectPage from './pages/ProjectPage';
import { useUser } from './hooks/useUser';
// import { useProjects } from './hooks/useProjects';
// import { Project } from './types/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


// Create a client
const queryClient = new QueryClient()


function App() {
  const user = useUser();
  // const [projects, setProjects] = useState<Project[]>([]);
  // const projects = useProjects();
  // const [user, setUser] = React.useState<Keycloak.KeycloakProfile | null>(null);
  // const [count, setCount] = useState(0)
  // const [message, setMessage] = useState('');

  React.useEffect(() => {
  //   keycloak.loadUserProfile().then(profile => {
  //     setUser(profile);
  //   }).catch(error => {
  //     console.error('Failed to load user profile', error);
  //     setUser(null);
  //   });
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={
          <SidebarLayout user={user}>
            <Dashboard />
          </SidebarLayout>
        } />
        <Route path="/projects/:projectId" element={
          // <SidebarLayout user={user}>
            <ProjectPage user={user} />
          // </SidebarLayout>
        } />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
