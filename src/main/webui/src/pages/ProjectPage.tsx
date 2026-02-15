import React from "react";
import { Navigate, useParams } from "react-router";
import KanbanView from "../components/KanbanView";
import GraphView from "../components/GraphView";
import SidebarLayout from "@/layouts/SidebarLayout";
import ProjectPageHeader from "@/components/ProjectPageHeader";
import { useProject } from "@/hooks/useProjects";

interface ProjectPageProps {
  user: Keycloak.KeycloakProfile | null;
}
function ProjectPage({ user }: ProjectPageProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const {
    data: project,
    isLoading,
    isError,
  } = useProject(parseInt(projectId!, 10));
  const [view, setView] = React.useState<"kanban" | "graph">("kanban");

  if (isLoading) {
    return <SidebarLayout user={user} />;
  }

  if (!projectId || isError) {
    return <Navigate to="/404" />;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <SidebarLayout
      user={user}
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
          {view === "kanban" && <KanbanView user={user} project={project} />}
          {view === "graph" && <GraphView user={user} />}
        </div>
      </div>
    </SidebarLayout>
  );
}

export default ProjectPage;
