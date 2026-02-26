import React from "react";
import { Navigate, useParams } from "react-router";
import KanbanView from "../components/KanbanView";
import GraphView from "../components/GraphView";
import SidebarLayout from "@/layouts/SidebarLayout";
import ProjectPageHeader from "@/components/ProjectPageHeader";
import { useProject } from "@/hooks/useProjects";
import { AnimatePresence, motion } from "framer-motion";

function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
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
            {view === "graph" && (
              <GraphView projectId={parseInt(projectId!, 10)} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </SidebarLayout>
  );
}

export default ProjectPage;
