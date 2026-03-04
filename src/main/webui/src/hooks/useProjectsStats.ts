import { fetchMostNewTasks, fetchProjectsStats } from "@/api/projectStats";
import { useQuery } from "@tanstack/react-query";

export const useProjectsStats = () => {
  return useQuery({
    queryKey: ["projects-stats"],
    queryFn: () => fetchProjectsStats().then((response) => response.data),
  });
};

export const useMostNewTasks = () => {
  return useQuery({
    queryKey: ["most-new-tasks"],
    queryFn: () => fetchMostNewTasks().then((response) => response.data),
  });
};
