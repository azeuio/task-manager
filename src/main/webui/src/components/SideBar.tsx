import keycloak from "../keycloak";
import { ClipboardList, Home } from "lucide-react";
import { Link } from "react-router";
import Projectlist from "./sidebar/Projectlist";
import { useKeycloakUser } from "@/hooks/useUser";
import { fetchUserProfilePicture } from "@/api/user";

function SideBar() {
  const user = useKeycloakUser();

  const handleLogout = () => {
    // Implement logout logic here, e.g., clear tokens, redirect to login page, etc.
    keycloak
      .logout()
      .then(() => {
        console.log("User logged out successfully");
      })
      .catch((error) => {
        console.error("Failed to log out", error);
      });
  };

  return (
    <div className="bg-base-100 flex min-h-screen flex-col divide-y divide-base-content/25 border-r border-base-content/25">
      <div className="flex flex-row items-center p-4 h-24">
        <div className="m-2 flex size-12 items-center justify-center rounded-xl bg-neutral">
          {/* Logo Section */}
          <ClipboardList className="size-full p-2 stroke-neutral-content" />
        </div>
        <div className="text-lg font-bold">Task Manager</div>
      </div>
      <div className="grow px-2 py-2">
        <Link
          to="/dashboard"
          className="flex cursor-pointer flex-row items-center rounded-md px-4 py-2 hover:bg-base-300"
        >
          <Home className="mr-2" strokeWidth={1} />
          Dashboard
        </Link>
        <Projectlist />
      </div>
      <div className="join join-vertical">
        <input
          type="radio"
          name="theme-buttons"
          className="btn theme-controller join-item"
          aria-label="Default"
          value="default"
        />
        <input
          type="radio"
          name="theme-buttons"
          className="btn theme-controller join-item"
          aria-label="Light"
          value="autumn"
        />
        <input
          type="radio"
          name="theme-buttons"
          className="btn theme-controller join-item"
          aria-label="Dark"
          value="abyss"
        />
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
        ></div>
      </div>
      <div className="dropdown dropdown-top dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost w-full p-4 h-16 rounded-none"
        >
          <div className="size-8 rounded-full bg-black">
            <img src={fetchUserProfilePicture(user?.username ?? "default")} />
          </div>
          <div className="ml-2 text-left">
            <div>
              {user ? user.username : "User Name"} {}
            </div>
            <div className="text-sm text-gray-500">
              {user ? user.email : "user@example.com"}
            </div>
          </div>
        </div>
        <ul
          tabIndex={-1}
          className="dropdown-content menu w-52 rounded-box bg-base-100 border border-base-content/25 shadow-sm"
        >
          {/* <li className="btn btn-ghost">Profile</li>
          <li className="btn btn-ghost">Settings</li> */}
          <li className="btn btn-ghost" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideBar;
