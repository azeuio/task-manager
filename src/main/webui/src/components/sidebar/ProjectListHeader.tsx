import { useCreateProject } from "@hooks/useProjects";
import { Plus } from "lucide-react";
import React from "react";

interface ProjectListHeaderProps {
  createProject: ReturnType<typeof useCreateProject>["mutate"];
  readonly?: boolean;
}
function ProjectListHeader({
  createProject,
  readonly,
}: ProjectListHeaderProps) {
  const onCreateProject = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const projectName = formData.get("projectName") as string;
    const description = formData.get("description") as string;
    const color = formData.get("color") as string;

    // Implement project creation logic here, e.g., send data to API, update state, etc.
    createProject({ name: projectName, description, color });
  };

  return (
    <div className="flex flex-row text-base-content/70 text-sm items-center px-1 my-2">
      Projects
      <label
        hidden={readonly}
        htmlFor="new-project-modal-checkbox"
        className="ml-auto cursor-pointer stroke-base-content rounded-full hover:bg-base-200 p-0.5"
      >
        <Plus className="ml-auto cursor-pointer rounded-full p-0.5" />
      </label>
      <input
        type="checkbox"
        id="new-project-modal-checkbox"
        className="peer sr-only"
        onChange={() => {
          const dialog: HTMLDialogElement | null = document.getElementById(
            "new-project-modal",
          ) as HTMLDialogElement;
          dialog?.showModal();
        }}
        disabled={readonly}
      />
      <dialog id="new-project-modal" className="modal" hidden={readonly}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">Create New Project</h3>
          <div className="modal-action">
            <form
              method="dialog"
              className="w-full flex flex-col gap-4"
              onSubmit={onCreateProject}
            >
              <input
                name="projectName"
                required
                type="text"
                placeholder="Project Name"
                className="input input-bordered w-full mt-4"
              />
              <input
                name="description"
                type="text"
                placeholder="Description"
                className="input input-bordered w-full"
              />
              <div className="flex flex-row justify-between items-center gap-4">
                <p className="grow">Choose a color:</p>
                <input
                  name="color"
                  type="color"
                  className="p-0 border-0 cursor-pointer"
                  defaultValue="#99C1F1"
                />
              </div>
              <div className="w-full justify-end flex flex-row gap-2">
                <button className="btn btn-soft btn-primary">Cancel</button>
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>
    </div>
  );
}

export default ProjectListHeader;
