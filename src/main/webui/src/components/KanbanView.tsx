import React from 'react'
import KanbanColumn from './kanban/KanbanColumn';
import type { Project, Task } from '@/types/api';


interface KanbanViewProps {
  user: Keycloak.KeycloakProfile | null;
  projectId?: string;
}
function KanbanView({ user, projectId }: KanbanViewProps) {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  // const [project, setProject] = React.useState<Project | null>(null);
  const [statuses, setStatuses] = React.useState<string[]>(['To Do', 'In Progress', 'Done']);
  const [statusesOrder, setStatusesOrder] = React.useState<number[]>([0, 1, 2]);
  const [unknownStatusTasks, setUnknownStatusTasks] = React.useState<Task[]>([]);

  React.useEffect(() => {
    const fetchProjectData = async () => {
      // Placeholder for fetching project and tasks, replace with actual API calls
      console.log(`Fetching data for project ${projectId}... User: ${user?.username}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      const project: Project = { id: projectId!, name: `Project ${projectId}`, color: 'oklch(84.1% 0.238 128.85)', customStatuses: ['Backlog'], statusesOrder: [3, 0, 1, 2] };
      if (project.customStatuses) {
        if (project.statusesOrder) {
          const orderedStatuses = project.statusesOrder.map(order => {
            if (order < 3) return ['To Do', 'In Progress', 'Done'][order];
            return project.customStatuses![order - 3];
          });
          setStatuses(orderedStatuses);
          setStatusesOrder(project.statusesOrder);
        } else {
          setStatuses(['To Do', 'In Progress', 'Done', ...project.customStatuses]);
        }
      }
      setTasks([
        { id: '1', title: 'Task 1', status: 0, projectId: projectId! },
        { id: '2', title: 'Task 2', status: 1, projectId: projectId! },
        { id: '3', title: 'Task 3', status: 2, projectId: projectId! },
      ]);

      const order = project.statusesOrder ?? statusesOrder;
      setUnknownStatusTasks(tasks.filter(task => !order.includes(task.status)));
    }

    fetchProjectData();
  }, [projectId, statusesOrder, tasks, user?.username]);

  return (
    <div className='flex flex-row gap-4'>
      {unknownStatusTasks.length > 0 && (
        <KanbanColumn title="Unknown Status" tasks={unknownStatusTasks} />
      )}
      {statuses.map((status, index) => (
        <KanbanColumn key={index} title={status} tasks={tasks.filter(task => statusesOrder[index] === task.status)} />
      ))}
    </div>
  )
}

export default KanbanView
