import React from "react";
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import KanbanView from "../components/KanbanView";
import GraphView from "../components/GraphView";
import SidebarLayout from "@/layouts/SidebarLayout";
import ProjectPageHeader from "@/components/ProjectPageHeader";
import { useProject } from "@/hooks/useProjects";
import { AnimatePresence, motion } from "framer-motion";
import type { Task } from "@/api/types";
import TaskSideBar from "@/components/TaskSideBar";
import { useProjectMember } from "@/hooks/useProjectMembers";

function ProjectPage() {
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const selectedTask = React.useMemo(() => {
    const taskIdParam = searchParams[0].get("task");
    if (!taskIdParam) return null;
    const taskId = parseInt(taskIdParam, 10);
    if (isNaN(taskId)) return null;
    return { id: taskId } as Task;
  }, [searchParams]);
  const { projectId } = useParams<{ projectId: string }>();
  const { data: projectMembership } = useProjectMember(
    projectId ? parseInt(projectId, 10) : -1,
    "me",
  );
  const {
    data: project,
    isLoading,
    isError,
  } = useProject(parseInt(projectId!, 10));
  const [view, setView] = React.useState<"kanban" | "graph">("kanban");

  React.useEffect(() => {
    setView("kanban");
  }, [projectId]);

  if (isLoading) {
    return <SidebarLayout />;
  }

  if (!projectId || isError) {
    return <Navigate to="/404" />;
  }

  if (!project) {
    return <Navigate to="/" />;
  }

  return (
    <SidebarLayout
      header={
        isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error loading project</div>
        ) : (
          <ProjectPageHeader project={project} view={view} setView={setView} />
        )
      }
    >
      <div className="drawer drawer-end size-full">
        <div className="flex flex-col gap-4 h-full max-h-full">
          <div className="overflow-x-auto h-full">
            <AnimatePresence>
              {view === "kanban" && (
                <motion.div
                  key="kanban"
                  initial={{ x: "-100%", position: "absolute" }}
                  animate={{ x: 0, position: "relative" }}
                  exit={{ x: "-100%", position: "absolute" }}
                  transition={{ duration: 0.2 }}
                >
                  <KanbanView project={project} />
                </motion.div>
              )}
            </AnimatePresence>
            {view === "graph" && (
              <GraphView projectId={parseInt(projectId!, 10)} />
            )}
          </div>
        </div>
        <input
          id="task-drawer-checkbox"
          type="checkbox"
          className="drawer-toggle"
          defaultChecked={selectedTask !== null}
        />
        <AnimatePresence>
          <div className="drawer-side">
            <label
              htmlFor="task-drawer-checkbox"
              aria-label="close sidebar"
              className="drawer-overlay"
              onClick={() => {
                navigate(window.location.pathname);
              }}
            ></label>
            {selectedTask && (
              <TaskSideBar
                projectId={project.id}
                taskId={selectedTask.id}
                readonly={
                  !projectMembership || projectMembership.role === "VIEWER"
                }
              />
            )}
          </div>
        </AnimatePresence>
      </div>
    </SidebarLayout>
  );
}

export default ProjectPage;
