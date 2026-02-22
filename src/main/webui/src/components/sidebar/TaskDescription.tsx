import { useUpdateTask } from "@/hooks/useTasks";
import { PencilLine } from "lucide-react";
import { useEffect, useState } from "react";

interface TaskDescriptionProps {
  projectId: number;
  taskId: number;
  description: string;
  username: string;
}
function TaskDescription({
  projectId,
  taskId,
  description,
  username,
}: TaskDescriptionProps) {
  const { mutate: updateTask } = useUpdateTask(projectId);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    // Focus the textarea when it becomes editable
    const textarea = document.querySelector(
      "textarea#task-edit-description",
    ) as HTMLTextAreaElement | null;
    if (textarea) {
      textarea.focus();
      textarea.value = description; // Set the current description as the textarea value
    }
  }, [description, isEditing]);

  const onSaveEdits = (event: React.FormEvent) => {
    event.preventDefault();
    const textarea = event.currentTarget.querySelector(
      "textarea#task-edit-description",
    ) as HTMLTextAreaElement | null;
    if (textarea) {
      const newDescription = textarea.value;
      updateTask(
        {
          taskId: taskId,
          updatedTask: {
            description: newDescription,
          },
        },
        {
          onSuccess: () => {
            // Handle successful update, e.g., show a success message or update local state
            setIsEditing(false);
          },
        },
      );
    }
  };

  return (
    <form className="flex-4 rounded-box mr-4 pb-4" onSubmit={onSaveEdits}>
      <h4 className="flex justify-between items-center px-4 text-lg bg-accent p-2 rounded-t-box border-b border-base-content/25">
        {username} opened this task
        <button
          className="cursor-pointer"
          onClick={() => {
            setIsEditing((prev) => !prev);
          }}
          type="button"
        >
          <PencilLine className="text-primary" size={16} />
        </button>
      </h4>
      <p className="border border-t-0 border-primary p-4 rounded-b-box">
        <p hidden={isEditing}>{description}</p>
        <textarea
          id="task-edit-description"
          className="resize-none w-full mt-4 focus:ring-0 focus:outline-none"
          placeholder="Edit description..."
          defaultValue={description}
          readOnly={!isEditing}
          hidden={!isEditing}
        />
        <div className="flex justify-end">
          <button
            className="btn btn-primary btn-sm mt-2"
            hidden={!isEditing}
            type="submit"
          >
            Save
          </button>
        </div>
      </p>
    </form>
  );
}

export default TaskDescription;
