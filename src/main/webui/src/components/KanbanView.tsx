import React from "react";
import KanbanColumn from "./kanban/KanbanColumn";
import type { Project, Task } from "@/api/types";
import { useTasks } from "@/hooks/useTasks";
import AddTaskModal from "./AddTaskModal";
import TaskSideBar from "./TaskSideBar";
import { useStatuses } from "@/hooks/useStatuses";

interface KanbanViewProps {
  project: Project;
}
function KanbanView({ project }: KanbanViewProps) {
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const { statuses, statusesOrder } = useStatuses(project.id);
  // const [unknownStatusTasks, setUnknownStatusTasks] = React.useState<Task[]>(
  //   [],
  // );
  const { data: tasks } = useTasks(project.id);

  return (
    <div className="flex flex-row gap-4 h-full drawer drawer-end">
      {/* {unknownStatusTasks.length > 0 && (
        <KanbanColumn
          title="Unknown Status"
          tasks={unknownStatusTasks}
          status={-1}
          setSelectedTask={setSelectedTask}
        />
      )} */}
      {statuses.map((status, index) => (
        <KanbanColumn
          key={index}
          title={status}
          tasks={
            tasks?.filter((task) => statusesOrder[index] === task.status) ?? []
          }
          status={statusesOrder[index] ?? -1}
          setSelectedTask={setSelectedTask}
        />
      ))}

      <AddTaskModal
        projectId={project.id}
        statuses={statuses}
        statusesOrder={statusesOrder}
      />
      {/* <div className="drawer drawer-end"> */}
      <input
        id="task-drawer-checkbox"
        type="checkbox"
        className="drawer-toggle"
      />
      {/* <div className="drawer-content">
      </div> */}
      <div className="drawer-side">
        <label
          htmlFor="task-drawer-checkbox"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        {selectedTask && (
          <TaskSideBar
            projectId={project.id}
            taskId={selectedTask.id}
            setSelectedTask={setSelectedTask}
          />
        )}
      </div>
      {/* </div> */}
    </div>
  );
}

export default KanbanView;
