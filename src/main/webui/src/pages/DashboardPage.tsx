import React from 'react'
import keycloak from '../keycloak'
import StatsCard from '../components/StatsCard';
import { CircleAlert, FolderKanban, TriangleAlert } from 'lucide-react';
import Card from '../components/Card';
import { Link } from 'react-router';

function Dashboard() {
  const [user, setUser] = React.useState<Keycloak.KeycloakProfile | null>(null);

  React.useEffect(() => {
    keycloak.loadUserProfile().then(profile => {
      setUser(profile);
    }).catch(error => {
      console.error('Failed to load user profile', error);
      setUser(null);
    });
  }, []);

  const getProjects = () => {
    // Placeholder for fetching projects, replace with actual API call
    return [
      { id: 1, name: 'Project 1', color: 'oklch(84.1% 0.238 128.85)' },
      { id: 2, name: 'Project 2', color: 'oklch(54.6% 0.245 262.881)' },
    ];
  }

  const getRecentTasks = () => {
    // Placeholder for fetching recent tasks, replace with actual API call
    return [
      { id: 1, title: 'Task 1', project: 'Project 1', dueDate: '2024-06-30', status: 0 },
      { id: 2, title: 'Task 2', project: 'Project 2', dueDate: '2024-07-05', status: 1 },
      { id: 3, title: 'Task 3', project: 'Project 1', dueDate: '2024-06-25', status: 2 },
      { id: 4, title: 'Task 4', project: 'Project 2', dueDate: null, status: 2 },
      { id: 5, title: 'Task 5', project: 'Project 1', dueDate: null, status: 0 },
    ];
  }

  return (
      <div className='flex flex-col gap-8'>
        <div className='font-bold text-xl'>Welcome back, {user?.firstName ?? 'user'}</div>
        <p className='text-gray-600'>Here's an overview of your tasks and projects</p>
        <div className='flex flex-row gap-4 *:bg-white *:rounded-md *:shadow *:shadow-stone-400 *:p-4 *:w-full'>
          <StatsCard title="Total projects" value="5" icon={<FolderKanban className='stroke-stone-500' />} />
          <StatsCard title="Tasks due today" value="3" icon={<CircleAlert className='stroke-amber-500' />} />
          <StatsCard title="Overdue tasks" value="2" icon={<TriangleAlert className='stroke-red-500' />} />
        </div>
        <div className='flex flex-row gap-8'>
          <Card title={<div className='font-bold text-lg'>Your projects</div> }>
            <div className='w-full bg-stone-200 h-0.5 mb-4'/>
            <ul className='flex flex-col gap-2'>
              {getProjects().map(project => (
                <li key={project.id} className=''>
                  <Link to={`/projects/${project.id}`} className='flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100'>
                    <div className='rounded-lg size-12 inline-block' style={{ backgroundColor: project.color }} />
                    <div className='flex flex-col'>
                      <h3 className='font-semibold'>{project.name}</h3>
                      <div className='text-stone-500'>
                        4 tasks - 2 due this week - 1 overdue
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
          <Card title={<div className='font-bold text-lg'>Recent tasks</div>}>
            <div className='w-full bg-stone-200 h-0.5 mb-4'/>
            <ul className='flex flex-col gap-2'>
              {getRecentTasks().map(task => (
                <li key={task.id} className='flex flex-row justify-between'>
                  <div>
                    <div className='font-semibold'>{task.title}</div>
                    <div className='text-sm text-gray-500'>{task.project} {task.dueDate ? ' - ' + new Date(task.dueDate).toLocaleDateString() : ''} </div>
                  </div>
                  <div className='text-sm flex items-center gap-2'>
                    {task.status < 2 && task.dueDate && new Date(task.dueDate) < new Date() && <span className='rounded-full bg-red-100 py-1 px-2 text-red-500'>Overdue</span>}
                    {task.status === 0 && <span className='rounded-full bg-amber-100 py-1 px-2 text-amber-500'>To do</span>}
                    {task.status === 1 && <span className='rounded-full bg-blue-100 py-1 px-2 text-blue-500'>In progress</span>}
                    {task.status === 2 && <span className='rounded-full bg-green-100 py-1 px-2 text-green-500'>Done</span>}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
  )
}

export default Dashboard
