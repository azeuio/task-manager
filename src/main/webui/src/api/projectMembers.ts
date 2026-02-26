import { fetchAuthenticated } from "./fetchAuthenticated";
import type { ProjectMember, User } from "./types";

export const fetchProjectMembers = (projectId: number) =>
  fetchAuthenticated<ProjectMember[]>(`/api/v1/projects/${projectId}/members`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

export const fetchProjectMember = (projectId: number, username: string) =>
  fetchAuthenticated<ProjectMember>(
    `/api/v1/projects/${projectId}/members/user/${username}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

export const fetchProjectMembersOfUser = (userid: User["id"]) =>
  fetchAuthenticated<ProjectMember[]>(
    `/api/v1/users/${userid}/projects-memberships`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

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

export const removeProjectMember = (projectId: number, userId: number) => {
  console.log(`Removing user ${userId} from project ${projectId}`);
  return fetchAuthenticated(
    `/api/v1/projects/${projectId}/members/user/${userId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

export const updateProjectMember = (
  projectId: number,
  userId: User["id"],
  updatedFields: Partial<Omit<ProjectMember, "projectId" | "userId">>,
) =>
  fetchAuthenticated<ProjectMember>(
    `/api/v1/projects/${projectId}/members/user/${userId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      data: updatedFields,
    },
  );
