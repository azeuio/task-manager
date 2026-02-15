import type { Project } from '@api/types'
import { Link } from 'react-router'

interface ProjectListItemProps {
  project: Project
  pending?: boolean; // Optional prop to indicate if this is a pending project
}
function ProjectListItem({ project, pending }: ProjectListItemProps) {
  return (
    <li key={project.id} className="w-full">
      <Link to={`/projects/${project.id}`} className="cursor-pointer px-4 py-2 hover:bg-base-200 flex flex-col">
        <div className='flex flex-row items-center gap-2'>
          <div className='rounded-radius-selector size-2 inline-block' style={{backgroundColor: project.color ?? "red"}}/>
          {pending ? <span className="text-sm text-base-content/50">{project.name}</span> : project.name}
        </div>
        <p className='ml-4 text-base-content/50'>{project.description}</p>
      </Link>
    </li>
  )
}

export default ProjectListItem
