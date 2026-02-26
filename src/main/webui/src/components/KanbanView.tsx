import KanbanColumn from "./kanban/KanbanColumn";
import type { Project } from "@/api/types";
import { useTasks } from "@/hooks/useTasks";
import AddTaskModal from "./AddTaskModal";
import { useStatuses } from "@/hooks/useStatuses";

interface KanbanViewProps {
  project: Project;
}
function KanbanView({ project }: KanbanViewProps) {
  // const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const { statuses, statusesOrder } = useStatuses(project.id);
  // const [unknownStatusTasks, setUnknownStatusTasks] = React.useState<Task[]>(
  //   [],
  // );
  const { data: tasks } = useTasks(project.id);

  return (
    <div className="flex flex-row gap-4 h-full">
      {statuses.map((status, index) => (
        <KanbanColumn
          key={index}
          title={status}
          tasks={
            tasks?.filter((task) => statusesOrder[index] === task.status) ?? []
          }
          status={statusesOrder[index] ?? -1}
        />
      ))}

      <AddTaskModal
        projectId={project.id}
        statuses={statuses}
        statusesOrder={statusesOrder}
      />
    </div>
  );
}

export default KanbanView;
