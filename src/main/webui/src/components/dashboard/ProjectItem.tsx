import type { Project } from "@/api/types";
import { useTasks } from "@/hooks/useTasks";
import { Link } from "react-router";

interface ProjectItemProps {
  project: Project;
}
function ProjectItem({ project }: ProjectItemProps) {
  const { data: tasks } = useTasks(project.id);
  const tasksCount = tasks?.length ?? 0;
  const dueThisWeekCount =
    tasks?.filter((task) => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      const now = new Date();
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(now.getDate() + 7);
      return dueDate >= now && dueDate <= oneWeekFromNow;
    }).length ?? 0;
  const overdueCount =
    tasks?.filter((task) => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      const now = new Date();
      return dueDate < now && task.status < 2;
    }).length ?? 0;
  return (
    <li>
      <Link
        to={`/projects/${project.id}`}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-base-200"
      >
        <div
          className="rounded-lg size-12 inline-block"
          style={{ backgroundColor: project.color }}
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{project.name}</h3>
          <div className="text-stone-500">
            {tasksCount} tasks - {dueThisWeekCount} due this week -{" "}
            {overdueCount} overdue
          </div>
        </div>
      </Link>
    </li>
  );
}

export default ProjectItem;
