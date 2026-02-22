import { useUpdateTask } from "@/hooks/useTasks";
import { PencilLine, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TaskTitleProps {
  projectId: number;
  title: string;
  id: number;
}
function TaskTitle({ projectId, title, id }: TaskTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateTask } = useUpdateTask(projectId);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) ref.current?.focus();
  }, [isEditing]);

  return (
    <h2 className="flex gap-4 items-baseline text-5xl mb-4 pr-4">
      <p hidden={isEditing}>{title}</p>
      <input
        ref={ref}
        className="w-full"
        defaultValue={title}
        hidden={!isEditing}
        maxLength={32}
        onBlur={(event) => {
          updateTask({
            taskId: id,
            updatedTask: { title: event.currentTarget.value },
          });
          setIsEditing(false);
        }}
      />
      <button
        className="cursor-pointer"
        onClick={() => setIsEditing(!isEditing)}
        type="button"
      >
        <PencilLine
          className={"text-base-content" + (isEditing ? " hidden" : "")}
          size={24}
        />
        <Save
          className={"text-primary" + (isEditing ? "" : " hidden")}
          size={24}
        />
      </button>
    </h2>
  );
}

export default TaskTitle;
