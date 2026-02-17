import type { User } from "@/api/types";
import { fetchAllUsers, fetchUser } from "@/api/user";
import keycloak from "@/keycloak";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useKeycloakUser = () => {
  const [user, setUser] = useState<Keycloak.KeycloakProfile | null>(null);

  useEffect(() => {
    keycloak
      .loadUserProfile()
      .then((profile) => {
        setUser(profile);
      })
      .catch((error) => {
        console.error("Failed to load user profile", error);
        setUser(null);
      });
  }, []);

  return user;
};

export const useAllUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return fetchAllUsers().then((response) => response.data);
    },
  });
};

export const useUser = (id: User["id"]) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      return fetchUser(id).then((response) => response.data);
    },
  });
};
