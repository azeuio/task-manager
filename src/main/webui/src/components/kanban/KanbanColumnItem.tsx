import type { Task } from "@api/types";

interface KanbanColumnItemProps {
  task: Task;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
}
function KanbanColumnItem({ task, setSelectedTask }: KanbanColumnItemProps) {
  return (
    <label
      htmlFor="task-drawer-checkbox"
      className="relative btn btn-soft justify-start hover:ring ring-primary drawer-button"
      onClick={() => setSelectedTask(task)}
    >
      {task.title}
      <span
        className="status status-error absolute top-0 right-0"
        hidden={!(task.dueDate && new Date(task.dueDate) < new Date())}
      />
    </label>
  );
}

export default KanbanColumnItem;
