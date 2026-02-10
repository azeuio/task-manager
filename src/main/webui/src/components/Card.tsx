import React from 'react'

interface CardProps {
  title?: string | React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}
function Card({ title, children, icon }: CardProps) {
  return (
    <div className='bg-white rounded-md shadow shadow-stone-400 p-4 w-full'>
      <div className='mb-4 flex flex-row justify-between' hidden={!title && !icon}>
        {title}
        {icon}
      </div>
      {children}
    </div>
  )
}

export default Card
