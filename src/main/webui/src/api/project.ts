import { fetchAuthenticated } from "./fetchAuthenticated";
import type { Project } from "./types";

export const fetchAllProjects = () =>
  fetchAuthenticated<Project[]>("/api/v1/projects", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

export const fetchProject = (projectId: Project["id"]) =>
  fetchAuthenticated<Project>(`/api/v1/projects/${projectId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

export const createProject = (newProject: Omit<Project, "id">) =>
  fetchAuthenticated<Project>("/api/v1/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: newProject,
  });

export const updateProject = (
  projectId: Project["id"],
  updatedProject: Partial<Omit<Project, "id">>,
) =>
  fetchAuthenticated<Project>(`/api/v1/projects/${projectId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: updatedProject,
  });

export const deleteProject = (projectId: Project["id"]) =>
  fetchAuthenticated<void>(`/api/v1/projects/${projectId}`, {
    method: "DELETE",
  });
