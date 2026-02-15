import { fetchAuthenticated } from "./fetchAuthenticated";
import type { Project, Task } from "./types";

export const fetchAllTasks = (projectId: Project["id"]) => fetchAuthenticated<Task[]>(
  `/api/v1/projects/${projectId}/tasks`,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }
);

export const fetchTask = (projectId: Project["id"], taskId: string) => fetchAuthenticated<Task>(
  `/api/v1/projects/${projectId}/tasks/${taskId}`,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }
);

export const createTask = (projectId: Project["id"], newTask: Omit<Task, "id" | "projectId">) => fetchAuthenticated<Task>(
  `/api/v1/projects/${projectId}/tasks`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: newTask,
  }
);

export const updateTask = (
  projectId: Project["id"],
  taskId: string,
  updatedTask: Partial<Omit<Task, "id" | "projectId">>
) => fetchAuthenticated<Task>(
  `/api/v1/projects/${projectId}/tasks/${taskId}`,
  {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: updatedTask,
  }
);

export const deleteTask = (projectId: Project["id"], taskId: string) => fetchAuthenticated<void>(
  `/api/v1/projects/${projectId}/tasks/${taskId}`,
  {
    method: "DELETE",
  }
);
