import type { Project } from "@/api/types";
import { useCreateTask } from "@/hooks/useTasks";
import React from "react";
import ChooseStatusDropdown from "./ChooseStatusDropdown";
import ChooseUserDropdown from "./ChooseUser";
import { useUserOfProject } from "@/hooks/useUser";

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
  const { data: users } = useUserOfProject(projectId);
  const [selectedUserId, setSelectedUserId] = React.useState<
    number | undefined
  >(undefined);

  const onCreateTask = (event: React.SubmitEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const statusValue = formData.get("status") as string;
    const status = parseInt(statusValue, 10);

    // Implement task creation logic here, e.g., send data to API, update state, etc.
    const taskData = {
      title,
      description,
      status,
      assignedToId: selectedUserId,
    };
    createTask(taskData);

    // reset form fields after submission
    event.currentTarget.reset();
    setSelectedUserId(undefined);
  };

  const updateSelectedUserId = (event: React.MouseEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    setSelectedUserId(parseInt(target.value, 10));
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
        <ChooseStatusDropdown
          statuses={statuses}
          statusesOrder={statusesOrder}
          updateStatusButton={updateStatusButton}
        />
        <ChooseUserDropdown
          updateUser={updateSelectedUserId}
          users={users ?? []}
          current={selectedUserId}
        />
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
