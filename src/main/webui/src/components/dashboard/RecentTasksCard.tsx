import React, { useEffect } from "react";
import Card from "@components/Card";
import { useMyTasks } from "@/hooks/useTasks";
import type { Project } from "@/api/types";
import { fetchProject } from "@/api/project";

interface RecentTasksCardProps {
  userId: number;
}
function RecentTasksCard({ userId }: RecentTasksCardProps) {
  const { data: tasks } = useMyTasks(userId, 5);
  const [projects, setProjects] = React.useState<
    Record<Project["id"], Project>
  >({});

  useEffect(() => {
    if (!tasks) return;
    const projectIds = Array.from(new Set(tasks.map((task) => task.projectId)));
    Promise.all(projectIds.map((id) => fetchProject(id)))
      .then((responses) => {
        const projectMap: Record<Project["id"], Project> = {};
        responses.forEach((response) => {
          if (response.status === 200) {
            const project = response.data;
            projectMap[project.id] = project;
          }
        });
        setProjects(projectMap);
      })
      .catch((error) => {
        console.error("Error fetching projects for recent tasks:", error);
      });
  }, [tasks]);

  return (
    <Card title={<div className="font-bold text-lg">Recent tasks</div>}>
      <div className="w-full bg-base-content/25 h-0.5 mb-4" />
      <ul className="flex flex-col gap-2">
        {tasks
          ?.sort((a, b) => {
            if (a.status === 2 && b.status !== 2) return 1;
            if (a.status !== 2 && b.status === 2) return -1;
            return (
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
          })
          .map((task) => (
            <li key={task.id} className="flex flex-row justify-between">
              <div>
                <div className="font-semibold">{task.title}</div>
                <div className="text-sm text-gray-500">
                  {projects[task.projectId]?.name || "Unknown project"}{" "}
                  {task.dueDate
                    ? " - " + new Date(task.dueDate).toLocaleDateString()
                    : ""}{" "}
                </div>
              </div>
              <div className="text-sm flex items-center gap-2">
                {task.status < 2 &&
                  task.dueDate &&
                  new Date(task.dueDate) < new Date() && (
                    <span className="rounded-full border border-error py-1 px-2 text-error">
                      Overdue
                    </span>
                  )}
                {task.status === 0 && (
                  <span className="rounded-full border border-neutral-content bg-neutral py-1 px-2 text-neutral-content">
                    To do
                  </span>
                )}
                {task.status === 1 && (
                  <span className="rounded-full border border-accent-content bg-accent py-1 px-2 text-accent-content">
                    In progress
                  </span>
                )}
                {task.status === 2 && (
                  <span className="rounded-full border border-success-content bg-success py-1 px-2 text-success-content">
                    Done
                  </span>
                )}
              </div>
            </li>
          ))}
      </ul>
    </Card>
  );
}

export default RecentTasksCard;
