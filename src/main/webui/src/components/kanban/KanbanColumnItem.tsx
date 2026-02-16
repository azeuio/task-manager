import type { Task } from "@api/types";

interface KanbanColumnItemProps {
  task: Omit<Task, "projectId">;
}
function KanbanColumnItem({ task }: KanbanColumnItemProps) {
  return (
    <button className="btn btn-soft justify-start hover:ring ring-primary">
      {task.title}
    </button>
  );
}

export default KanbanColumnItem;
