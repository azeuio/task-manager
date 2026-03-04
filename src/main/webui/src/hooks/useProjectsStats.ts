import {
  fetchMostCompleted,
  fetchMostNewMembers,
  fetchMostNewTasks,
  fetchProjectsStats,
} from "@/api/projectStats";
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

export const useMostNewMembers = () => {
  return useQuery({
    queryKey: ["most-new-members"],
    queryFn: () => fetchMostNewMembers().then((response) => response.data),
  });
};

export const useMostCompleted = () => {
  return useQuery({
    queryKey: ["most-completed"],
    queryFn: () => fetchMostCompleted().then((response) => response.data),
  });
};
