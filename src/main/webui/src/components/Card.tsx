import React from 'react'

interface CardProps {
  title?: string | React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}
function Card({ title, children, icon }: CardProps) {
  return (
    <div className='bg-base-100 rounded-md shadow shadow-base-300 p-4 w-full'>
      <div className='mb-4 flex flex-row justify-between' hidden={!title && !icon}>
        {title}
        {icon}
      </div>
      {children}
    </div>
  )
}

export default Card
