import type { Task } from "@/api/types";
import { useUser, useUserOfProject } from "@/hooks/useUser";
import TaskDescription from "./sidebar/TaskDescription";
import { useDeleteTask, useTask, useUpdateTask } from "@/hooks/useTasks";
import ChooseStatusDropdown from "./ChooseStatusDropdown";
import { useStatuses } from "@/hooks/useStatuses";
import ChooseUserDropdown from "./ChooseUser";
import TaskTitle from "./sidebar/TaskTitle";

interface TaskSideBarProps {
  projectId: number;
  taskId: Task["id"];
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
}
function TaskSideBar({ projectId, taskId, setSelectedTask }: TaskSideBarProps) {
  const { data: task } = useTask(projectId, taskId);
  const { data: taskCreator } = useUser(task?.createdById);
  const { statuses, statusesOrder } = useStatuses(projectId);
  const { mutate: updateTask } = useUpdateTask(projectId);
  const { mutate: deleteTask } = useDeleteTask(projectId);
  const { data: users } = useUserOfProject(projectId);

  if ((task?.id ?? -1) < 0) {
    return (
      <div className="menu bg-base-100 min-h-full w-1/2 p-4">
        <h2 className="text-xl font-bold mb-4">No Task Selected</h2>
        <p>Please select a task to see its details.</p>
      </div>
    );
  }

  const onUpdateAssignedUser = (event: React.MouseEvent<HTMLInputElement>) => {
    if (!task) return;
    const target = event.target as HTMLInputElement;
    const userIdValue = target.value;
    const userId = parseInt(userIdValue, 10);
    if (!isNaN(userId)) {
      updateTask(
        {
          taskId: task.id,
          updatedTask: {
            assignedToId: userId,
          },
        },
        {
          onSuccess: (response) => {
            setSelectedTask(response.data);
          },
        },
      );
    }
  };

  const onDeleteTask = () => {
    if (!task) return;
    deleteTask(task.id);
    document.getElementById("task-drawer-checkbox")?.click();
  };

  const onUpdateStatus = (event: React.MouseEvent<HTMLInputElement>) => {
    if (!task) return;
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
      <TaskTitle
        title={task?.title ?? "Unknown Task"}
        id={task?.id ?? -1}
        projectId={projectId}
      />
      <div className="flex flex-row h-full grow">
        <TaskDescription
          projectId={projectId}
          taskId={task?.id ?? -1}
          description={task?.description ?? "No description provided."}
          username={taskCreator?.displayName ?? "Unknown User"}
        />
        <div className="flex-1 flex flex-col h-full">
          <div>
            <h5 className="p-2 rounded-t-box">Assignees</h5>
            <ChooseUserDropdown
              current={task?.assignedToId}
              users={users ?? []}
              updateUser={onUpdateAssignedUser}
            />
          </div>
          <div className="divider my-2" />
          <div className="flex flex-col gap-2 p-2">
            <h5 className="rounded-t-box">Status</h5>
            <ChooseStatusDropdown
              currentStatus={task?.status}
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
