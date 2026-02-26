import KanbanColumn from "./kanban/KanbanColumn";
import type { Project } from "@/api/types";
import { useTasks } from "@/hooks/useTasks";
import AddTaskModal from "./AddTaskModal";
import { useStatuses } from "@/hooks/useStatuses";
import { useProjectMember } from "@/hooks/useProjectMembers";

interface KanbanViewProps {
  project: Project;
}
function KanbanView({ project }: KanbanViewProps) {
  const { data: myProjectMember } = useProjectMember(project.id, "me");
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
          readonly={myProjectMember?.role === "VIEWER"} // Disable the column if the user is a viewer
        />
      ))}
      {myProjectMember?.role !== "VIEWER" && ( // Only show the Add Task button if the user is not a viewer
        <AddTaskModal
          projectId={project.id}
          statuses={statuses}
          statusesOrder={statusesOrder}
        />
      )}
    </div>
  );
}

export default KanbanView;
