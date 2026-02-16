import type { Project, Task } from "@api/types";
import {
  createTask,
  deleteTask,
  fetchAllTasks,
  fetchTask,
  updateTask,
} from "@/api/task";
import { useMutation, useQuery } from "@tanstack/react-query";

const TASKS_QUERY_KEY = "tasks";

export const useTasks = (projectId: Project["id"]) => {
  return useQuery({
    queryKey: [TASKS_QUERY_KEY, projectId],
    queryFn: () => fetchAllTasks(projectId),
  });
};

export const useTask = (projectId: Project["id"], taskId: Task["id"]) => {
  return useQuery({
    queryKey: [TASKS_QUERY_KEY, projectId, taskId],
    queryFn: () => fetchTask(projectId, taskId),
  });
};

export const useCreateTask = (projectId: Project["id"]) => {
  return useMutation({
    mutationFn: (task: Omit<Task, "id">) => createTask(projectId, task),
    onSettled: (_data, _error, _variables, _onMutateResult, context) => {
      // Invalidate and refetch
      context.client.invalidateQueries({
        queryKey: [TASKS_QUERY_KEY, projectId],
      });
    },
  });
};

export const useUpdateTask = (projectId: Project["id"]) => {
  return useMutation({
    mutationFn: ({
      taskId,
      updatedTask,
    }: {
      taskId: Task["id"];
      updatedTask: Partial<Omit<Task, "id" | "projectId">>;
    }) => updateTask(projectId, taskId, updatedTask),
    onSettled: (_data, _error, variables, _onMutateResult, context) => {
      // Invalidate and refetch
      context.client.invalidateQueries({
        queryKey: [TASKS_QUERY_KEY, projectId, variables.taskId],
      });
    },
  });
};

export const useDeleteTask = (projectId: Project["id"]) => {
  return useMutation({
    mutationFn: (taskId: Task["id"]) => deleteTask(projectId, taskId),
    onSettled: (_data, _error, taskId, _onMutateResult, context) => {
      // Invalidate and refetch
      context.client.invalidateQueries({
        queryKey: [TASKS_QUERY_KEY, projectId, taskId],
      });
      context.client.invalidateQueries({
        queryKey: [TASKS_QUERY_KEY, projectId],
      });
    },
  });
};
