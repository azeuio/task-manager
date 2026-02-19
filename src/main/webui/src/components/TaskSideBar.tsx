import type { Task } from "@/api/types";
import { useUser } from "@/hooks/useUser";
import TaskDescription from "./sidebar/TaskDescription";
import { useDeleteTask, useUpdateTask } from "@/hooks/useTasks";
import ChooseStatusDropdown from "./ChooseStatusDropdown";
import { useStatuses } from "@/hooks/useStatuses";

interface TaskSideBarProps {
  task: Task;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
}
function TaskSideBar({ task, setSelectedTask }: TaskSideBarProps) {
  const { data: taskCreator } = useUser(task.createdById);
  const { statuses, statusesOrder } = useStatuses(task.projectId);
  const { mutate: updateTask } = useUpdateTask(task.projectId);
  const { mutate: deleteTask } = useDeleteTask(task.projectId);
  if (task.id < 0) {
    return (
      <div className="menu bg-base-100 min-h-full w-1/2 p-4">
        <h2 className="text-xl font-bold mb-4">No Task Selected</h2>
        <p>Please select a task to see its details.</p>
      </div>
    );
  }

  const onDeleteTask = () => {
    deleteTask(task.id);
    document.getElementById("task-drawer-checkbox")?.click();
  };

  const onUpdateStatus = (event: React.MouseEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const statusValue = target.value;
    const statusIndex = statusesOrder.indexOf(parseInt(statusValue, 10));
    if (statusIndex !== -1) {
      updateTask(
        {
          taskId: task.id,
          updatedTask: {
            status: statusesOrder[statusIndex],
          },
        },
        {
          onSuccess: (response) => {
            console.log("Task updated successfully:", response);
            setSelectedTask(response.data);
          },
        },
      );
    }
  };

  return (
    <div className="menu bg-base-100 min-h-full w-1/2 p-4">
      <h2 className="text-5xl mb-4">
        {task.title} #{task.id}
      </h2>
      <div className="flex flex-row h-full grow">
        <TaskDescription
          description={task.description ?? "No description provided."}
          username={taskCreator?.displayName ?? "Unknown User"}
        />
        <div className="flex-1 flex flex-col h-full">
          <div>
            <h5 className="p-2 rounded-t-box">Assignees</h5>
          </div>
          <div className="divider my-2" />
          <div className="flex flex-col gap-2 p-2">
            <h5 className="rounded-t-box">Status</h5>
            <ChooseStatusDropdown
              currentStatus={task.status}
              statuses={statuses}
              statusesOrder={statusesOrder}
              updateStatusButton={onUpdateStatus}
            />
          </div>
          <div className="divider divider-end" />
          <div className="flex flex-col gap-2 p-2">
            <button
              className="btn btn-error btn-outline"
              onClick={onDeleteTask}
            >
              Delete Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskSideBar;
