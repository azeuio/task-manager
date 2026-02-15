import type { Task } from "@/api/types";
import KanbanColumnItem from "./KanbanColumnItem";

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
}
function KanbanColumn({ title, tasks }: KanbanColumnProps) {
  const showModal = () => {
    const modal = document.getElementById("add-task-modal");
    if (modal && modal instanceof HTMLDialogElement) {
      modal.showModal();
    }
  };

  const onCreateTask = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    // Implement task creation logic here, e.g., send data to API, update state, etc.
    console.log("Creating task:", { title, description });
  };

  return (
    <div className="bg-base-100 rounded-md p-4 w-full min-w-1/4 h-full">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="flex flex-col gap-2">
        <KanbanColumnItem
          key={"test"}
          task={{
            id: "test",
            title: "Test Task",
            description: "This is a test task",
          }}
        />
        {tasks.map((task) => (
          <KanbanColumnItem key={task.id} task={task} />
        ))}
        <button className="btn btn-dash btn-sm mt-2" onClick={showModal}>
          + Add Task
        </button>
        <dialog id="add-task-modal" className="modal">
          <form method="dialog" className="modal-box" onSubmit={onCreateTask}>
            <h3 className="font-bold text-lg">Add New Task</h3>
            <input
              type="text"
              placeholder="Task Title"
              className="input input-bordered w-full mt-4"
              name="title"
              required
            />
            <textarea
              placeholder="Task Description"
              className="textarea textarea-bordered w-full mt-2"
              name="description"
            ></textarea>
            <div className="modal-action">
              <button className="btn">Cancel</button>
              <button className="btn btn-primary">Add Task</button>
            </div>
          </form>
          <form method="dialog" className="modal-backdrop">
            <button>Close</button>
          </form>
        </dialog>
      </div>
    </div>
  );
}

export default KanbanColumn;
