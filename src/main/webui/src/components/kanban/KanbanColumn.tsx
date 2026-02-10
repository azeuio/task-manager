import type { Task } from '@/types/api'

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
}
function KanbanColumn({ title, tasks }: KanbanColumnProps) {
  return (
    <div className='bg-stone-100 rounded-md p-4 w-full min-w-1/4 h-full'>
      <h2 className='text-lg font-semibold mb-4'>{title}</h2>
      <div className='flex flex-col gap-2'>
        {tasks.map(task => (
          <div key={task.id} className='bg-white rounded-md shadow shadow-stone-400 p-3'>
            {task.title}
          </div>
        ))}
      </div>
    </div>
  )
}

export default KanbanColumn
