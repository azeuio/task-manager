import { useUpdateProject } from "@/hooks/useProjects";
import type { Project } from "@api/types";
import { Ellipsis } from "lucide-react";
import React from "react";

interface ProjectPageHeaderProps {
  project: Project;
  view: "kanban" | "graph";
  setView: React.Dispatch<React.SetStateAction<"kanban" | "graph">>;
}
function ProjectPageHeader({ project, view, setView }: ProjectPageHeaderProps) {
  const { mutate: updateProject } = useUpdateProject();
  // const { data: project } = useProject(projectId);
  const usersWithAccess = ["Alice", "Bob", "Charlie", "David"]; // Example data, replace with actual data

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

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex items-center gap-2">
        {/* <label htmlFor='project-color' className='rounded-lg size-12 inline-block' style={{ backgroundColor: project?.color }} /> */}
        <input
          id="project-color"
          type="color"
          value={project?.color ?? ""}
          onChange={onColorChange}
          className="rounded-lg size-12 inline-block border-none bg-transparent text-sm cursor-pointer"
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
      <div className="flex flex-row items-center">
        <div className="flex flex-row gap-2 mr-4 bg-base-300 rounded-md p-1">
          <input
            id="kanban"
            name="view"
            type="radio"
            className="peer/kanban sr-only"
            onChange={() => setView("kanban")}
            checked={view === "kanban"}
          />
          <label
            htmlFor="kanban"
            className="peer-checked/kanban:bg-base-100 peer-checked/kanban:shadow peer-checked/kanban:shadow-base-200 rounded-md px-3 py-1 cursor-pointer"
          >
            Kanban
          </label>
          <input
            id="graph"
            name="view"
            type="radio"
            className="peer/graph sr-only"
            onChange={() => setView("graph")}
            checked={view === "graph"}
          />
          <label
            htmlFor="graph"
            className="peer-checked/graph:bg-base-100 peer-checked/graph:shadow peer-checked/graph:shadow-base-200 rounded-md px-3 py-1 cursor-pointer"
          >
            Graph
          </label>
        </div>
        <div>
          {/* Where you can see people that have access to this project */}
          {usersWithAccess.length > 0 && (
            <div className="flex -space-x-2">
              {usersWithAccess.map((username, index) => {
                if (index >= 2) return null; // Show max 3 avatars, add a "+X" for the rest if needed
                return (
                  <img
                    key={index}
                    src={`https://ui-avatars.com/api/?name=${username}&background=0D8ABC&color=fff&size=32`}
                    alt={`${username}'s avatar`}
                    className="rounded-full border-2 border-white"
                  />
                );
              })}
              {usersWithAccess.length > 3 && (
                <div
                  className="rounded-full border-2 border-white bg-gray-400 text-white text-xs flex items-center justify-center"
                  style={{ width: 32, height: 32 }}
                >
                  +{usersWithAccess.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
        <Ellipsis className="cursor-pointer stroke-stone-500" />
      </div>
    </div>
  );
}

export default ProjectPageHeader;
