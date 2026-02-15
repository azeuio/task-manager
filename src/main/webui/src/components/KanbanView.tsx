import React from "react";
import KanbanColumn from "./kanban/KanbanColumn";
import type { Project, Task } from "@/api/types";
import { useTasks } from "@/hooks/useTasks";

interface KanbanViewProps {
  user: Keycloak.KeycloakProfile | null;
  project: Project;
}
function KanbanView({ project }: KanbanViewProps) {
  // const [tasks, setTasks] = React.useState<Task[]>([]);
  // const [project, setProject] = React.useState<Project | null>(null);
  const [statuses, setStatuses] = React.useState<string[]>([
    "To Do",
    "In Progress",
    "Done",
  ]);
  const [statusesOrder, setStatusesOrder] = React.useState<number[]>([0, 1, 2]);
  const [unknownStatusTasks, setUnknownStatusTasks] = React.useState<Task[]>(
    [],
  );
  // const { data: project } = useProject(parseInt(projectId, 10));
  const { data: tasks } = useTasks(project.id);

  // React.useEffect(() => {
  //   const fetchProjectData = async () => {
  //     if (!projectId) return;

  //     try {
  //       const projectResponse = await fetch(`/api/v1/projects/${projectId}`, {
  //         headers: {
  //           'Authorization': `Bearer ${keycloak.token}`,
  //         },
  //       });
  //       if (!projectResponse.ok) {
  //         throw new Error('Failed to fetch project data', { cause: projectResponse.status });
  //       }
  //       const projectData: Project = await projectResponse.json();
  //       setProject(projectData);

  //       if (projectData.customStatuses) {
  //         if (projectData.statusesOrder) {
  //           const orderedStatuses = projectData.statusesOrder.map(order => {
  //             if (order < 3) return ['To Do', 'In Progress', 'Done'][order];
  //             return projectData.customStatuses![order - 3];
  //           });
  //           setStatuses(orderedStatuses);
  //           setStatusesOrder(projectData.statusesOrder);
  //         } else {
  //           setStatuses(['To Do', 'In Progress', 'Done', ...projectData.customStatuses]);
  //         }
  //       }

  //       const tasksResponse = await fetch(`/api/v1/projects/${projectId}/tasks`, {
  //         headers: {
  //           'Authorization': `Bearer ${keycloak.token}`,
  //         },
  //       });
  //       if (!tasksResponse.ok) {
  //         throw new Error('Failed to fetch tasks', { cause: tasksResponse.status });
  //       }
  //       const tasksData: Task[] = await tasksResponse.json();
  //       setTasks(tasksData);

  //       const order = projectData.statusesOrder ?? statusesOrder;
  //       setUnknownStatusTasks(tasksData.filter(task => !order.includes(task.status)));
  //     } catch (error) {
  //       if (error instanceof Error && error.cause === 401) {
  //         console.warn('Unauthorized, attempting to refresh token...');
  //         try {
  //           const refreshed = await keycloak.updateToken(30);
  //           if (refreshed) {
  //             console.log('Token refreshed successfully, retrying fetch...');
  //             fetchProjectData(); // Retry fetching data after refreshing token
  //           } else {
  //             console.warn('Token is still valid, no need to refresh');
  //           }
  //         } catch (refreshError) {
  //           console.error('Failed to refresh token', refreshError);
  //         }
  //       } else {
  //         console.error('Error fetching project data:', error);
  //       }
  //     }
  //   };

  // const project: Project = { id: projectId!, name: `Project ${projectId}`, color: 'oklch(84.1% 0.238 128.85)', customStatuses: ['Backlog'], statusesOrder: [3, 0, 1, 2] };
  // if (project.customStatuses) {
  //   if (project.statusesOrder) {
  //     const orderedStatuses = project.statusesOrder.map(order => {
  //       if (order < 3) return ['To Do', 'In Progress', 'Done'][order];
  //       return project.customStatuses![order - 3];
  //     });
  //     setStatuses(orderedStatuses);
  //     setStatusesOrder(project.statusesOrder);
  //   } else {
  //     setStatuses(['To Do', 'In Progress', 'Done', .jectId}`, color: 'oklch(84.1% 0.238 128.85)', customStatuses: ['Backlog'], statusesOrder: [3, 0, 1, 2] };
  // if (project.customStatuses) {
  //   if (project.statusesOrder) {
  //     const orderedStatuses = project.statusesOrder.map(order => {
  //       if (order < 3) return ['To Do', 'In Progress', 'Done'][order];
  //       return project.customStatuses![order - 3];
  //     });
  //     setStatuses(orderedStatuses);
  //     setStatusesOrder(project.statusesOrder);
  //   } else {
  //     setStatuses(['To Do', 'In Progress', 'Done', ...project.customStatuses]);
  //   }
  // }
  // setTasks([
  //   { id: '1', title: 'Task 1', status: 0, projectId: projectId! },
  //   { id: '2', title: 'Task 2', status: 1, projectId: projectId! },
  //   { id: '3', title: 'Task 3', status: 2, projectId: projectId! },
  // ]);

  // const order = project.statusesOrder ?? statusesOrder;
  // setUnknownStatusTasks(tasks.filter(task => !order.inc..project.customStatuses]);
  //   }
  // }
  // setTasks([
  //   { id: '1', title: 'Task 1', status: 0, projectId: projectId! },
  //   { id: '2', title: 'Task 2', status: 1, projectId: projectId! },
  //   { id: '3', title: 'Task 3', status: 2, projectId: projectId! },
  // ]);

  // const order = project.statusesOrder ?? statusesOrder;
  // setUnknownStatusTasks(tasks.filter(task => !order.includes(task.status)));
  //   }
  // }

  //   fetchProjectData();
  // }, [projectId, statusesOrder, tasks]);

  return (
    <div className="flex flex-row gap-4 h-full">
      {unknownStatusTasks.length > 0 && (
        <KanbanColumn title="Unknown Status" tasks={unknownStatusTasks} />
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
        />
      ))}
    </div>
  );
}

export default KanbanView;
