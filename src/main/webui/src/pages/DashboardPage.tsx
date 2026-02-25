import React from "react";
import keycloak from "../keycloak";
import StatsCard from "../components/StatsCard";
import {
  ChartNoAxesColumn,
  CircleAlert,
  FolderKanban,
  TriangleAlert,
} from "lucide-react";
import YourProjectsCard from "@/components/YourProjectsCard";
import { useProjects } from "@/hooks/useProjects";
import StatsHero from "@/components/dashboard/StatsHero";
import RecentTasksCard from "@/components/dashboard/RecentTasksCard";
import { useUserByUsername } from "@/hooks/useUser";
import ProjectsStats from "@/components/ProjectStats";
import { AnimatePresence, motion } from "framer-motion";

function Dashboard() {
  const [keycloakUser, setUser] =
    React.useState<Keycloak.KeycloakProfile | null>(null);
  const { data: user } = useUserByUsername(keycloakUser?.username ?? "");

  const { data: projects } = useProjects();

  React.useEffect(() => {
    keycloak
      .loadUserProfile()
      .then((profile) => {
        setUser(profile);
      })
      .catch((error) => {
        console.error("Failed to load user profile", error);
        setUser(null);
      });
  }, []);
  const [c, setC] = React.useState(0);

  return (
    <div className="flex flex-col gap-8">
      <AnimatePresence>
        {c % 2 === 0 && (
          <motion.div
            className="absolute size-full top-0 left-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ProjectsStats key={c % 2} toggle={() => setC((c) => c + 1)} />
          </motion.div>
        )}
      </AnimatePresence>
      <button
        className="absolute top-4 right-4 btn btn-ghost"
        onClick={() => setC((c) => c + 1)}
      >
        <ChartNoAxesColumn />
      </button>
      <div className="flex flex-col gap-2 border-b border-base-content/25 pb-4">
        <h1 className="font-bold text-3xl">
          Welcome back, {keycloakUser?.firstName ?? "user"}
        </h1>
        <p className="text-gray-600">
          Here's an overview of your tasks and projects
        </p>
      </div>
      <StatsHero username={keycloakUser?.username ?? ""} />
      <div className="flex flex-row gap-4" hidden>
        <StatsCard
          title="Total projects"
          value={projects?.length ?? 0}
          icon={<FolderKanban className="stroke-base-content" />}
        />
        <StatsCard
          title="Tasks due today"
          value="3"
          icon={<CircleAlert className="stroke-warning" />}
        />
        <StatsCard
          title="Overdue tasks"
          value="2"
          icon={<TriangleAlert className="stroke-error" />}
        />
      </div>
      <div className="flex flex-row gap-8">
        <YourProjectsCard />
        <RecentTasksCard userId={user?.id ?? -1} />
      </div>
    </div>
  );
}

export default Dashboard;
