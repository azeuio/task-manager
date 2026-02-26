import { useCreateProject, useProjects } from "@hooks/useProjects";
import ProjectListHeader from "./ProjectListHeader";
import ProjectListItem from "./ProjectListItem";
import { useEffect } from "react";
import { useNavigate } from "react-router";

function Projectlist() {
  const navigate = useNavigate();
  const { data: projects, isLoading } = useProjects();
  const {
    mutate: createProject,
    variables: pendingProject,
    isPending: isCreatingProject,
    data: createdProject,
    isSuccess: isProjectCreated,
  } = useCreateProject();

  useEffect(() => {
    if (isProjectCreated && createdProject) {
      navigate(`/projects/${createdProject.id}`);
    }
  }, [isProjectCreated, createdProject, navigate]);

  return (
    <div className="flex h-full flex-col">
      <ProjectListHeader createProject={createProject} />
      <ul className="flex flex-col gap-1 overflow-y-auto">
        {isLoading && (
          <div className="flex flex-row items-center gap-2 px-4 py-2">
            <div
              className="spinner-border spinner-border-sm text-primary"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            Loading projects...
          </div>
        )}

        {projects &&
          projects
            .sort((a, b) => a.id - b.id)
            .map((project) => (
              <ProjectListItem key={project.id} project={project} />
            ))}
        {pendingProject && isCreatingProject && (
          <ProjectListItem
            pending
            project={{ id: Infinity, ...pendingProject }}
          />
        )}
        <div className="invisible">
          {" "}
          {/* Spacer */}
          <ProjectListItem
            project={{
              id: Infinity,
              name: "",
              color: "",
            }}
          />
        </div>
      </ul>
    </div>
  );
}

export default Projectlist;
