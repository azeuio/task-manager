import { fetchProjectsStats } from "@/api/projectStats";
import { useQuery } from "@tanstack/react-query";

export const useProjectsStats = () => {
  return useQuery({
    queryKey: ["projects-stats"],
    queryFn: () => fetchProjectsStats().then((response) => response.data),
  });
};
