import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router';
import NotFound from './NotFound';
import Dashboard from './pages/DashboardPage';
import React from 'react';
import keycloak from './auth/keycloak';
import SidebarLayout from './layouts/SidebarLayout';
import ProjectPage from './pages/ProjectPage';

function App() {
  const [user, setUser] = React.useState<Keycloak.KeycloakProfile | null>(null);
  // const [count, setCount] = useState(0)
  // const [message, setMessage] = useState('');

  React.useEffect(() => {
    keycloak.loadUserProfile().then(profile => {
      setUser(profile);
    }).catch(error => {
      console.error('Failed to load user profile', error);
      setUser(null);
    });
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={
            <SidebarLayout user={user}>
              <Dashboard />
            </SidebarLayout>
          } />
          <Route path="/projects/:projectId" element={
            <SidebarLayout user={user}>
              <ProjectPage user={user} />
            </SidebarLayout>
          } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
