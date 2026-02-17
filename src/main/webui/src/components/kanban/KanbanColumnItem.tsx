import type { Task } from "@api/types";

interface KanbanColumnItemProps {
  task: Task;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
}
function KanbanColumnItem({ task, setSelectedTask }: KanbanColumnItemProps) {
  return (
    <label
      htmlFor="task-drawer-checkbox"
      className="btn btn-soft justify-start hover:ring ring-primary drawer-button"
      onClick={() => setSelectedTask(task)}
    >
      {task.title}
    </label>
  );
}

export default KanbanColumnItem;
