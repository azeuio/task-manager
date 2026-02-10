import React from 'react'
import keycloak from '../keycloak'
import { Home, Plus } from 'lucide-react';
import { Link } from 'react-router';

function SideBar({user}: {user: Keycloak.KeycloakProfile | null}) {
  const handleLogout = () => {
    // Implement logout logic here, e.g., clear tokens, redirect to login page, etc.
    keycloak.logout().then(() => {
      console.log('User logged out successfully');
    }).catch(error => {
      console.error('Failed to log out', error);
    });
  }

  const getProjects = () => {
    // Placeholder for fetching projects, replace with actual API call
    return [
      { id: 1, name: 'Project 1', color: 'oklch(84.1% 0.238 128.85)' },
      { id: 2, name: 'Project 2', color: 'oklch(54.6% 0.245 262.881)' },
    ];
  }

  return (
    <div className="bg-sidebar-bg flex min-h-screen flex-col divide-y divide-gray-300 border-r border-gray-300">
      <div className="flex flex-row items-center p-4">
        <div className="m-2 flex size-12 items-center justify-center rounded-xl bg-black">
          {/* Logo Section */}
        </div>
        <div className="text-lg font-bold">Task Manager</div>
      </div>
      <div className="grow px-2 py-2">
        <Link to="/dashboard" className="flex cursor-pointer flex-row items-center rounded-md px-4 py-2 hover:bg-gray-200">
          <Home className="mr-2" strokeWidth={1} />
          Dashboard
        </Link>
        <div className="flex flex-row text-gray-700 text-sm items-center px-1 my-2">
          Projects
          <Plus className="ml-auto cursor-pointer stroke-stone-800 rounded-full hover:bg-gray-200" />
        </div>
        <ul className="ml-4 flex flex-col gap-1">
          {getProjects().map(project => (
            <li key={project.id} className="">
              <Link to={`/projects/${project.id}`} className="cursor-pointer px-4 py-2 hover:bg-gray-200 flex items-center">
                <div className='rounded-full w-2 h-2 inline-block mr-2' style={{backgroundColor: project.color}}/>
                {project.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative px-2">
        <input
          type="checkbox"
          id="user-menu-toggle"
          className="peer relative hidden"
        />
        <div
          className={
            "absolute hidden w-4/5 -translate-y-full flex-col divide-y divide-gray-300 rounded-md border border-gray-300 bg-white shadow-lg *:cursor-pointer *:px-4 *:py-2 peer-checked:flex first:*:pt-2 last:*:pb-2 *:hover:bg-gray-100"
          }
        >
          <div>Profile</div>
          <div>Settings</div>
          <div onClick={handleLogout}>Logout</div>
        </div>
      </div>
      <label
        htmlFor="user-menu-toggle"
        className="relative flex cursor-pointer flex-row items-center px-4 py-4 hover:bg-gray-200"
      >
        <div className="size-8 rounded-full bg-black">{/* User Avatar */}</div>
        <div className="ml-2">
          <div>
            {user ? user.username : "User Name"} {}
          </div>
          <div className="text-sm text-gray-500">
            {user ? user.email : "user@example.com"}
          </div>
        </div>
      </label>
    </div>
  )
}

export default SideBar
