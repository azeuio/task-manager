import React from "react";
import SideBar from "../components/SideBar";

interface SidebarLayoutProps {
  children?: React.ReactNode;
  user: Keycloak.KeycloakProfile | null;
  header?: React.ReactNode;
}
function SidebarLayout({ children, user, header }: SidebarLayoutProps) {
  return (
    <div className="flex flex-row h-screen">
      <SideBar user={user} />
      <div className="flex flex-col flex-1 bg-base-200">
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
