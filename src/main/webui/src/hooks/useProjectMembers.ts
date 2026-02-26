import {
  addProjectMember,
  fetchProjectMember,
  fetchProjectMembers,
  fetchProjectMembersOfUser,
  removeProjectMember,
  updateProjectMember,
} from "@/api/projectMembers";
import type { ProjectMember, User } from "@/api/types";
import { useMutation, useQuery } from "@tanstack/react-query";

const PROJECT_MEMBERS_QUERY_KEY = "project-members";

export const useProjectMembers = (projectId: number) => {
  return useQuery({
    queryKey: [PROJECT_MEMBERS_QUERY_KEY, projectId],
    queryFn: () =>
      fetchProjectMembers(projectId).then((response) => response.data),
    enabled: projectId !== undefined && projectId > 0,
  });
};

export const useCreateProjectMember = (projectId: number) => {
  return useMutation({
    mutationFn: ({
      username,
      role,
    }: {
      username: string;
      role: ProjectMember["role"];
    }) =>
      addProjectMember(projectId, username, role).then(
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

export const useProjectMemberOfUser = (userid: User["id"]) => {
  return useQuery({
    queryKey: [PROJECT_MEMBERS_QUERY_KEY, userid],
    queryFn: () =>
      fetchProjectMembersOfUser(userid).then((response) => response.data),
    enabled: userid !== undefined && userid >= 0,
  });
};

export const useProjectMember = (projectId: number, username: string) => {
  return useQuery({
    queryKey: [PROJECT_MEMBERS_QUERY_KEY, projectId, username],
    queryFn: () =>
      fetchProjectMember(projectId, username).then((response) => response.data),
    enabled:
      projectId !== undefined &&
      projectId > 0 &&
      username !== undefined &&
      username.length > 0,
  });
};

export const useUpdateProjectMember = (
  projectId: number,
  userId: User["id"],
) => {
  return useMutation({
    mutationFn: (
      updatedFields: Partial<Omit<ProjectMember, "projectId" | "userId">>,
    ) =>
      updateProjectMember(projectId, userId, updatedFields).then(
        (response) => response.data,
      ),
    onSuccess: (_data, _variables, _onMutateResult, context) => {
      // Invalidate and refetch
      context.client.invalidateQueries({
        queryKey: [PROJECT_MEMBERS_QUERY_KEY],
      });
    },
  });
};
