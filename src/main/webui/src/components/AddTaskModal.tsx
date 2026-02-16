import type { Project } from "@/api/types";
import { useCreateTask } from "@/hooks/useTasks";
import React from "react";

interface AddTaskModalProps {
  projectId: Project["id"];
  statuses: string[];
  statusesOrder: number[];
}
function AddTaskModal({
  projectId,
  statusesOrder,
  statuses,
}: AddTaskModalProps) {
  const { mutate: createTask } = useCreateTask(projectId);

  const onCreateTask = (event: React.SubmitEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const statusValue = formData.get("status") as string;
    const status = parseInt(statusValue, 10);

    // Implement task creation logic here, e.g., send data to API, update state, etc.
    createTask({
      title,
      description,
      status,
      projectId,
    });
  };

  const updateStatusButton = (event: React.MouseEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const statusValue = target.value;
    const statusIndex = statusesOrder.indexOf(parseInt(statusValue, 10));
    if (statusIndex !== -1) {
      const statusButton = document.getElementById(`status-dropdown`);
      if (statusButton) {
        statusButton.innerText = `Status: ${statuses[statusIndex]}`;
        statusButton.blur();
      }
    }
  };
  return (
    <dialog id="add-task-modal" className="modal">
      <form method="dialog" className="modal-box" onSubmit={onCreateTask}>
        <h3 className="font-bold text-lg">Add New Task</h3>
        <input
          type="text"
          placeholder="Task Title"
          className="input input-bordered w-full mt-4"
          name="title"
        />
        <textarea
          placeholder="Task Description"
          className="textarea textarea-bordered w-full mt-2"
          name="description"
        ></textarea>
        <div className="dropdown dropdown-top">
          <div
            tabIndex={0}
            id="status-dropdown"
            role="button"
            className="btn m-1"
          >
            Click
          </div>
          <ul
            tabIndex={-1}
            className="dropdown-content dropdown-top menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
          >
            {statusesOrder.map((status, index) => (
              <li key={index}>
                <label>
                  <input
                    name="status"
                    type="radio"
                    value={status}
                    className="peer radio radio-primary"
                    defaultChecked={index === 0}
                    onClick={updateStatusButton}
                  />{" "}
                  {statuses[index]}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="modal-action">
          <button className="btn">Cancel</button>
          <button className="btn btn-primary">Add Task</button>
        </div>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>Close</button>
      </form>
    </dialog>
  );
}

export default AddTaskModal;
