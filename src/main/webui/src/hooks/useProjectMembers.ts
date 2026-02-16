import {
  addProjectMember,
  fetchProjectMembers,
  removeProjectMember,
} from "@/api/projectMembers";
import { useMutation, useQuery } from "@tanstack/react-query";

const PROJECT_MEMBERS_QUERY_KEY = "project-members";

export const useProjectMembers = (projectId: number) => {
  return useQuery({
    queryKey: [PROJECT_MEMBERS_QUERY_KEY, projectId],
    queryFn: () =>
      fetchProjectMembers(projectId).then((response) => response.data),
  });
};

export const useCreateProjectMember = (projectId: number) => {
  return useMutation({
    mutationFn: (username: string) =>
      addProjectMember(projectId, username).then((response) => response.data),
    onSettled: (_data, _error, _variables, _onMutateResult, context) => {
      // Invalidate and refetch
      context.client.invalidateQueries({
        queryKey: [PROJECT_MEMBERS_QUERY_KEY, projectId],
      });
    },
  });
};

export const useRemoveProjectMember = (projectId: number) => {
  return useMutation({
    mutationFn: (username: string) =>
      removeProjectMember(projectId, username).then(
        (response) => response.data,
      ),
    onSettled: (_data, _error, _variables, _onMutateResult, context) => {
      // Invalidate and refetch
      context.client.invalidateQueries({
        queryKey: [PROJECT_MEMBERS_QUERY_KEY, projectId],
      });
    },
  });
};
