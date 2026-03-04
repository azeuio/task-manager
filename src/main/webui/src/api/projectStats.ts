import { fetchAuthenticated } from "./fetchAuthenticated";
import type { MostNewTasks, ProjectStats } from "./types";

export const fetchMostNewTasks = () => {
  return fetchAuthenticated<MostNewTasks>(`/api/v1/projects/stats/most-new-tasks`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
};

export const fetchProjectsStats = (limit?: number) => {
  const searchParams = new URLSearchParams();
  if (limit !== undefined) {
    searchParams.append("limit", limit.toString());
  }
  return fetchAuthenticated<ProjectStats[]>(
    `/api/v1/projects/stats?${searchParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
