import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import './index.css'
import App from './App.tsx'
import NotFound from './NotFound.tsx'
import keycloak from './keycloak.ts'


keycloak.init({
  onLoad: 'login-required',
  checkLoginIframe: false, // Disable the login state check iframe
  pkceMethod: 'S256', // Use PKCE for enhanced security
}).then((authenticated) => {
  if (!authenticated) {
    console.warn('User is not authenticated after Keycloak initialization');
    keycloak.login()
  } else {
    startTokenRefresh(); // Start the token refresh mechanism
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

const startTokenRefresh = () => {
  setInterval(() => {
    keycloak.updateToken(60) // refresh if token expires in 60 seconds
      .then((refreshed) => {
        if (refreshed) {
          console.log("Token refreshed");
        } else {
          console.log("Token still valid");
        }
      })
      .catch(() => {
        console.error("Failed to refresh token");
        keycloak.logout();
      });
  }, 30000); // check every 30 seconds
}
