import type { Task } from "@api/types";

interface KanbanColumnItemProps {
  task: Omit<Task, "projectId" | "status">;
}
function KanbanColumnItem({ task }: KanbanColumnItemProps) {
  return (
    // <div className="bg-base-content/5 hover:bg-base-content/10 rounded-md p-4 mb-2 hover:ring-1 ring-primary cursor-pointer">
    //   {task.title}
    // </div>
    <button className="btn btn-soft justify-start hover:ring ring-primary">
      {task.title}
    </button>
  );
}

export default KanbanColumnItem;
