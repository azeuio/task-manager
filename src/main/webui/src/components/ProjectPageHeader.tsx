import { useDeleteProject, useUpdateProject } from "@/hooks/useProjects";
import type { Project } from "@api/types";
import React from "react";
import ProjectMembers from "./ProjectMembers";
import { Ellipsis } from "lucide-react";
import { useProjectMember } from "@/hooks/useProjectMembers";

interface ProjectPageHeaderProps {
  project: Project;
  view: "kanban" | "graph";
  setView: (view: "kanban" | "graph") => void;
}
function ProjectPageHeader({ project, view, setView }: ProjectPageHeaderProps) {
  const { data: projectMembership } = useProjectMember(project.id, "me");
  const { mutate: updateProject } = useUpdateProject();
  const { mutate: deleteProject } = useDeleteProject();

  React.useEffect(() => {
    if (!project) return;
    // force update name and color when project data changes, otherwise they won't update after the first change
    const nameInput = document.getElementById(
      "project-name",
    ) as HTMLInputElement | null;
    const descriptionInput = document.getElementById(
      "project-description",
    ) as HTMLInputElement | null;
    const colorInput = document.getElementById(
      "project-color",
    ) as HTMLInputElement | null;
    if (nameInput) nameInput.value = project.name;
    if (descriptionInput) descriptionInput.value = project.description ?? "";
    if (colorInput) colorInput.value = project.color ?? "#000000";
  }, [project]);

  const onColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    if (project) {
      updateProject({
        projectId: project.id,
        updatedProject: { color: newColor },
      });
    }
  };

  const onNameChange = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newName = formData.get("name") as string;
    const newDescription = formData.get("description") as string;
    console.log("Updating project:", { newName, newDescription });
    if (project) {
      updateProject({
        projectId: project.id,
        updatedProject: { name: newName, description: newDescription },
      });
    }
    const focusedElement = document.activeElement as HTMLElement;
    focusedElement.blur();
  };

  const onDeleteProject = () => {
    if (project) {
      deleteProject(project.id);
    }
  };

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex items-center gap-2">
        {/* <label htmlFor='project-color' className='rounded-lg size-12 inline-block' style={{ backgroundColor: project?.color }} /> */}
        <input
          id="project-color"
          type="color"
          value={project?.color ?? ""}
          onChange={onColorChange}
          className="size-12 inline-block bg-transparent text-sm cursor-pointer"
        />
        <form className="group flex flex-col" onSubmit={onNameChange}>
          <input
            id="project-name"
            name="name"
            className="focus:bg-base-300 outline-0 py-1 px-2 font-bold text-2xl"
            defaultValue={project?.name ?? ""}
          />
          <div className="flex flex-row gap-2 w-full">
            <input
              id="project-description"
              name="description"
              className="focus:bg-base-300 outline-0 py-1 px-2 text-sm text-base-content/50 w-full"
              defaultValue={project?.description ?? ""}
            />
            <button
              type="submit"
              className="btn btn-sm btn-primary group-has-focus:flex hidden"
            >
              Save
            </button>
          </div>
        </form>
      </div>
      <div className="flex flex-row items-center gap-2">
        <div className="tabs tabs-box">
          <input
            type="radio"
            name="view-tabs"
            className="tab"
            aria-label="Kanban"
            onChange={() => setView("kanban")}
            checked={view === "kanban"}
          />
          <input
            type="radio"
            name="view-tabs"
            className="tab"
            aria-label="Graph"
            onChange={() => setView("graph")}
            checked={view === "graph"}
          />
        </div>

        <ProjectMembers projectId={project.id} />
        <button
          className="btn btn-ghost"
          popoverTarget="popover-extra-actions"
          style={
            { anchorName: "--anchor-extra-actions" } as React.CSSProperties
          }
        >
          <Ellipsis className="stroke-base-content fill-base-content" />
        </button>
        <ul
          className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
          popover="auto"
          id="popover-extra-actions"
          style={
            {
              positionAnchor: "--anchor-extra-actions",
            } /* as React.CSSProperties */
          }
        >
          <li>
            <button
              className="btn btn-error btn-outline"
              onClick={onDeleteProject}
              disabled={
                !projectMembership || projectMembership.role !== "OWNER"
              }
            >
              Delete Project
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ProjectPageHeader;
