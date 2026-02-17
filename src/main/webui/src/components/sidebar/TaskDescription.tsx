interface TaskDescriptionProps {
  description: string;
  username: string;
}
function TaskDescription({ description, username }: TaskDescriptionProps) {
  return (
    <div className="flex-4 rounded-box mr-4 pb-4">
      <h4 className="text-lg bg-accent p-2 rounded-t-box border-b border-base-content/25">
        {username} opened this task
      </h4>
      <p className="border border-t-0 border-primary p-4 rounded-b-box">
        {description}
      </p>
    </div>
  );
}

export default TaskDescription;
