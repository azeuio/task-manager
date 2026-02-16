import type { Task } from "@/api/types";
import KanbanColumnItem from "./KanbanColumnItem";

interface KanbanColumnProps {
  status: Task["status"];
  title: string;
  tasks: Task[];
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
}
function KanbanColumn({
  status,
  title,
  tasks,
  setSelectedTask,
}: KanbanColumnProps) {
  const showModal = () => {
    const modal = document.getElementById(`add-task-modal`);
    const statusSelect = document.querySelector(
      `input[name='status'][value='${status}']`,
    ) as HTMLInputElement | null;
    const statusButton = document.getElementById(`status-dropdown`);
    if (statusButton) {
      statusButton.innerText = `Status: ${title}`;
    }
    if (modal && modal instanceof HTMLDialogElement) {
      if (statusSelect) {
        statusSelect.checked = true;
      }
      modal.showModal();
    }
  };

  return (
    <div className="bg-base-100 rounded-md p-4 w-full min-w-1/4 h-full">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <KanbanColumnItem
            key={task.id}
            task={task}
            setSelectedTask={setSelectedTask}
          />
        ))}
        <button className="btn btn-dash btn-sm mt-2" onClick={showModal}>
          + Add Task
        </button>
      </div>
    </div>
  );
}

export default KanbanColumn;
