import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import './index.css'
import App from './App.tsx'
import NotFound from './NotFound.tsx'
import keycloak from './auth/keycloak.ts'


keycloak.init({
  onLoad: 'login-required',
  checkLoginIframe: false, // Disable the login state check iframe
  pkceMethod: 'S256', // Use PKCE for enhanced security
}).then((authenticated) => {
  if (!authenticated) {
    console.warn('User is not authenticated after Keycloak initialization');
  }
  console.log('Keycloak initialized, authenticated:', authenticated);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
}).catch((error) => {
  console.error('Failed to initialize Keycloak', error);
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<NotFound message="Failed to initialize Keycloak" />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>,
  );
});
