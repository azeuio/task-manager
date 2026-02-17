import React from "react";
import SideBar from "../components/SideBar";
import { useAlert } from "@/hooks/useAlert";

interface SidebarLayoutProps {
  children?: React.ReactNode;
  header?: React.ReactNode;
}
function SidebarLayout({ children, header }: SidebarLayoutProps) {
  const { state } = useAlert();

  return (
    <div className="flex flex-row h-screen">
      <SideBar />
      <div className="flex flex-col flex-1 bg-base-200">
        <div className="relative w-full flex items-center justify-center">
          {state.alerts.map((alert) => (
            <div
              key={alert.id}
              role="alert"
              className="alert alert-warning absolute top-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{alert?.message || "Warning: Invalid email address!"}</span>
            </div>
          ))}
        </div>

        {header && (
          <div className="p-4 bg-base-100 border-b border-base-content/25 h-24">
            {header}
          </div>
        )}
        <div className="p-4 flex-1">{children}</div>
      </div>
    </div>
  );
}

export default SidebarLayout;
