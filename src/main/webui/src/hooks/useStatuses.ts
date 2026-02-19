import type { Project } from "@/api/types";
import { useProject } from "./useProjects";

export const useStatuses = (projectId: Project["id"]) => {
  const { data: project } = useProject(projectId);
  return {
    statuses: [
      "To Do",
      "In Progress",
      "Done",
      ...(project?.customStatuses ?? []),
    ],
    statusesOrder: project?.statusesOrder ?? [0, 1, 2],
  };
};
