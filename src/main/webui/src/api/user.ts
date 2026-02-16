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
