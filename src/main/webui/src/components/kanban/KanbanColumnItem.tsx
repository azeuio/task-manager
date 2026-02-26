import type { Task } from "@api/types";
import { useNavigate } from "react-router";

interface KanbanColumnItemProps {
  task: Task;
}
function KanbanColumnItem({ task }: KanbanColumnItemProps) {
  const navigate = useNavigate();
  return (
    <label
      htmlFor="task-drawer-checkbox"
      className="relative btn btn-soft justify-start hover:ring ring-primary drawer-button"
      onClick={() => {
        navigate(`?task=${task.id}`, { replace: true });
      }}
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
