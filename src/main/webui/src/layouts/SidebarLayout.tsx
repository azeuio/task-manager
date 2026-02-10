import React from 'react'
import SideBar from '../components/SideBar';


interface SidebarLayoutProps {
  children: React.ReactNode;
  user: Keycloak.KeycloakProfile | null;
}
function SidebarLayout({ children, user }: SidebarLayoutProps) {
  return (
    <div className='flex flex-row h-screen'>
      <SideBar user={user} />
      <div className='flex-1 p-4'>
        {children}
      </div>
    </div>
  )
}

export default SidebarLayout
