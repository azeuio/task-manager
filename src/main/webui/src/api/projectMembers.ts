import { fetchAuthenticated } from "./fetchAuthenticated";
import type { ProjectMember } from "./types";

export const fetchProjectMembers = (projectId: number) =>
  fetchAuthenticated<ProjectMember[]>(`/api/v1/projects/${projectId}/members`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

export const addProjectMember = (
  projectId: number,
  username: string,
  role: ProjectMember["role"],
) =>
  fetchAuthenticated<ProjectMember>(`/api/v1/projects/${projectId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: { projectId, username, role },
  });

export const removeProjectMember = (projectId: number, username: string) =>
  fetchAuthenticated(`/api/v1/projects/${projectId}/members`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    data: { username },
  });
