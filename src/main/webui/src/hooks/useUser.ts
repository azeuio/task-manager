import type { User } from "@/api/types";
import {
  fetchAllUsers,
  fetchUser,
  fetchUserByUsername,
  fetchUserOfProject,
} from "@/api/user";
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

export const useUser = (id?: User["id"]) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      return fetchUser(id!).then((response) => response.data);
    },
    enabled: id !== undefined && id >= 0,
  });
};

export const useUserByUsername = (username: User["username"]) => {
  return useQuery({
    queryKey: ["user-by-username", username],
    queryFn: async () => {
      return fetchUserByUsername(username);
    },
    enabled: username !== undefined && username.trim() !== "",
  });
};

export const useUserOfProject = (projectId: number) => {
  return useQuery({
    queryKey: ["user-of-project", projectId],
    queryFn: async () => {
      return fetchUserOfProject(projectId).then((response) => response.data);
    },
    enabled: projectId !== undefined && projectId >= 0,
  });
};
