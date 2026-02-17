import type { Project } from "@/api/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createProject,
  fetchAllProjects,
  deleteProject,
  updateProject,
  fetchProject,
} from "@api/project";

const PROJECTS_QUERY_KEY = "projects";

export const useProjects = () => {
  return useQuery({
    queryKey: [PROJECTS_QUERY_KEY],
    queryFn: () => fetchAllProjects().then((response) => response.data),
  });
};

export const useProject = (projectId: Project["id"]) => {
  return useQuery({
    queryKey: [PROJECTS_QUERY_KEY, projectId],
    queryFn: () => fetchProject(projectId).then((response) => response.data),
  });
};

export const useCreateProject = () => {
  return useMutation({
    mutationFn: (project: Omit<Project, "id">) =>
      createProject(project).then((response) => response.data),
    onSettled: (_data, _error, _variables, _onMutateResult, context) => {
      // Invalidate and refetch
      context.client.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
    },
  });
};

export const useUpdateProject = () => {
  return useMutation({
    mutationFn: ({
      projectId,
      updatedProject,
    }: {
      projectId: Project["id"];
      updatedProject: Partial<Omit<Project, "id">>;
    }) =>
      updateProject(projectId, updatedProject).then(
        (response) => response.data,
      ),
    onMutate: async ({ projectId, updatedProject }, context) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await context.client.cancelQueries({
        queryKey: [PROJECTS_QUERY_KEY, projectId],
      });
      // Snapshot the previous value
      const previousProject =
        context.client.getQueryData<Project>([PROJECTS_QUERY_KEY, projectId]) ??
        null;

      // Optimistically update to the new value
      context.client.setQueryData<Project>([PROJECTS_QUERY_KEY, projectId], {
        ...previousProject,
        ...updatedProject,
        id: projectId,
      } as Project);

      // Return a context object with the snapshotted value
      return { previousProject, updatedProject };
    },
    onSettled: (_newProject, error, variables, onMutateResult, context) => {
      console.log("Project update settled:", {
        _newProject,
        error,
        variables,
        onMutateResult,
      });
      if (error) {
        // If the mutation fails, rollback to the previous value
        context.client.setQueryData<Project>(
          [PROJECTS_QUERY_KEY, variables.projectId],
          onMutateResult?.previousProject ?? undefined,
        );
      }
      // Always refetch after error or success:
      context.client.invalidateQueries({
        queryKey: [PROJECTS_QUERY_KEY, variables.projectId],
      });
      context.client.invalidateQueries({
        queryKey: [PROJECTS_QUERY_KEY],
      });
    },
  });
};

export const useDeleteProject = () => {
  return useMutation({
    mutationFn: (projectId: Project["id"]) =>
      deleteProject(projectId).then((response) => response.data),
    onSettled: (_data, _error, projectId, _onMutateResult, context) => {
      // Invalidate and refetch
      context.client.invalidateQueries({
        queryKey: [PROJECTS_QUERY_KEY, projectId],
      });
    },
  });
};

export const useProjectCRUD = () => {
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  return {
    get: useProjects,
    getOne: useProject,
    create: createProjectMutation.mutate,
    update: updateProjectMutation.mutate,
    delete: deleteProjectMutation.mutate,
  };
};
