import React from 'react'
import Card from './Card';


interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}
function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <Card title={<div className=''>{title}</div>} icon={icon}>
      <div className='text-3xl font-bold'>{value}</div>
    </Card>
  )
}

export default StatsCard
