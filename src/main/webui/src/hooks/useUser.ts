import keycloak from "@/keycloak";
import { useEffect, useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState<Keycloak.KeycloakProfile | null>(null);

  useEffect(() => {
    keycloak.loadUserProfile().then(profile => {
      setUser(profile);
    }).catch(error => {
      console.error('Failed to load user profile', error);
      setUser(null);
    });
  }, [])

  return user;
}
