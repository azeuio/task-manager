import { fetchAuthenticated } from "./fetchAuthenticated";
import type { ProjectStats } from "./types";

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
