import { fetchAuthenticated } from "./fetchAuthenticated";
import type { User } from "./types";

export const fetchAllUsers = () =>
  fetchAuthenticated<User[]>("/api/v1/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

export const fetchUser = (userId: User["id"]) =>
  fetchAuthenticated<User>(`/api/v1/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

export const fetchUserProfilePicture = (userName: User["username"]) =>
  `https://ui-avatars.com/api/?name=${userName}&background=0D8ABC&color=fff&size=32`;

export const registerKeycloakUser = (
  username: string,
  email: string,
  password: string,
) =>
  fetchAuthenticated<User>("/api/v1/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: { username, email, password },
  });

export const fetchUserOfProject = (projectId: number) =>
  fetchAuthenticated<User[]>(`/api/v1/projects/${projectId}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

export const fetchUserByUsername = (username: User["username"]) =>
  fetchAuthenticated<User>(`/api/v1/users/username/${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.data ?? null);
