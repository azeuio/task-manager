import React from "react";
import KanbanColumn from "./kanban/KanbanColumn";
import type { Project, Task } from "@/api/types";
import { useTasks } from "@/hooks/useTasks";
import AddTaskModal from "./AddTaskModal";

interface KanbanViewProps {
  user: Keycloak.KeycloakProfile | null;
  project: Project;
}
function KanbanView({ project }: KanbanViewProps) {
  const [statuses, setStatuses] = React.useState<string[]>([
    "To Do",
    "In Progress",
    "Done",
  ]);
  const [statusesOrder, setStatusesOrder] = React.useState<number[]>([0, 1, 2]);
  const [unknownStatusTasks, setUnknownStatusTasks] = React.useState<Task[]>(
    [],
  );
  const { data: tasks } = useTasks(project.id);

  return (
    <div className="flex flex-row gap-4 h-full">
      {unknownStatusTasks.length > 0 && (
        <KanbanColumn
          title="Unknown Status"
          tasks={unknownStatusTasks}
          status={-1}
        />
      )}
      {statuses.map((status, index) => (
        <KanbanColumn
          key={index}
          title={status}
          tasks={
            tasks?.data.filter(
              (task) => statusesOrder[index] === task.status,
            ) ?? []
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
