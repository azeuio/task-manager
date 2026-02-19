import { fetchAuthenticated } from "./fetchAuthenticated";
import type { Project, Task, TaskCreateRequest } from "./types";

export const fetchAllTasks = (projectId: Project["id"]) =>
  fetchAuthenticated<Task[]>(`/api/v1/projects/${projectId}/tasks`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

export const fetchTask = (projectId: Project["id"], taskId: Task["id"]) =>
  fetchAuthenticated<Task>(`/api/v1/projects/${projectId}/tasks/${taskId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

export const createTask = (
  projectId: Project["id"],
  newTask: TaskCreateRequest,
) =>
  fetchAuthenticated<Task>(`/api/v1/projects/${projectId}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: newTask,
  });

export const updateTask = (
  projectId: Project["id"],
  taskId: Task["id"],
  updatedTask: Partial<
    Omit<Task, "id" | "projectId" | "createdAt" | "updatedAt">
  >,
) =>
  fetchAuthenticated<Task>(`/api/v1/projects/${projectId}/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: updatedTask,
  });

export const deleteTask = (projectId: Project["id"], taskId: Task["id"]) =>
  fetchAuthenticated<void>(`/api/v1/projects/${projectId}/tasks/${taskId}`, {
    method: "DELETE",
  });
