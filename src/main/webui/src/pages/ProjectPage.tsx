import { Ellipsis } from 'lucide-react';
import React, { useEffect } from 'react'
import { useParams } from 'react-router';
import KanbanView from '../components/KanbanView';
import GraphView from '../components/GraphView';
import type { Project } from '@/types/api';

interface ProjectPageProps {
  user: Keycloak.KeycloakProfile | null;
}
function ProjectPage({ user }: ProjectPageProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const [view, setView] = React.useState<'kanban' | 'graph'>('kanban');
  const [project, setProject] = React.useState<Project | null>(null);
  const [usersWithAccess, setUsersWithAccess] = React.useState<string[]>([]);

  useEffect(() => {
    // Placeholder for fetching project details, replace with actual API call
    const fetchProject = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setProject({ id: projectId!, name: `Project ${projectId}`, color: 'oklch(84.1% 0.238 128.85)' });
    };
    const fetchUsersWithAccess = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsersWithAccess(['user1', 'user2', 'user3', 'user4', 'user5']);
    };
    if (projectId) {
      fetchProject();
      fetchUsersWithAccess();
    }
  }, [projectId]);

  return (
    <div className='flex flex-col gap-4 h-full max-h-full'>
      <div className='flex flex-row justify-between items-center'>
        <div className='flex items-center gap-2'>
          <div className='rounded-lg size-12 inline-block' style={{ backgroundColor: project?.color }} />
          <div className='flex flex-col'>
            <h1 className='font-bold text-2xl'>{project?.name}</h1>
            <p className='text-sm text-gray-500'>Project details and stats will be displayed here.</p>
          </div>
        </div>
        <div className='flex flex-row items-center'>
          <div className='flex flex-row gap-2 mr-4 bg-gray-200 rounded-md p-1'>
            <input id="kanban" name="view" type="radio" className="peer/kanban sr-only" onChange={() => setView('kanban')} checked={view === 'kanban'} />
            <label htmlFor="kanban" className='peer-checked/kanban:bg-white peer-checked/kanban:shadow peer-checked/kanban:shadow-stone-400 rounded-md px-3 py-1 cursor-pointer'>
              Kanban
            </label>
            <input id="graph" name="view" type="radio" className="peer/graph sr-only" onChange={() => setView('graph')} checked={view === 'graph'} />
            <label htmlFor="graph" className='peer-checked/graph:bg-white peer-checked/graph:shadow peer-checked/graph:shadow-stone-400 rounded-md px-3 py-1 cursor-pointer'>
              Graph
            </label>
          </div>
          <div>
            {/* Where you can see people that have access to this project */}
            {
              usersWithAccess.length > 0 && (
                <div className='flex -space-x-2'>
                  {usersWithAccess.map((username, index) => {
                    if (index >= 2) return null; // Show max 3 avatars, add a "+X" for the rest if needed
                    return (
                    <img
                      key={index}
                      src={`https://ui-avatars.com/api/?name=${username}&background=0D8ABC&color=fff&size=32`}
                      alt={`${username}'s avatar`}
                      className='rounded-full border-2 border-white'
                    />
                  )})}
                  {usersWithAccess.length > 3 && (
                    <div className='rounded-full border-2 border-white bg-gray-400 text-white text-xs flex items-center justify-center' style={{ width: 32, height: 32 }}>
                      +{usersWithAccess.length - 3}
                    </div>
                  )}
                </div>
              )
            }
          </div>
          <Ellipsis className='cursor-pointer stroke-stone-500' />
        </div>
      </div>
      <div className='w-full bg-stone-200 h-0.5' />
      <div className='overflow-x-auto h-full'>
        {view === 'kanban' && <KanbanView user={user} projectId={projectId} />}
        {view === 'graph' && <GraphView user={user} />}
      </div>
    </div>
  )
}

export default ProjectPage
