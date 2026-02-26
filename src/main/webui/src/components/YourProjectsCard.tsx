import React from "react";
import Card from "./Card";
import { useProjects } from "@hooks/useProjects";
import ProjectItem from "./dashboard/ProjectItem";

function Container({ children }: { children: React.ReactNode }) {
  return (
    <Card title={<div className="font-bold text-lg">Your projects</div>}>
      {children}
    </Card>
  );
}

function YourProjectsCard() {
  const { data: projects, isLoading, error } = useProjects(4);

  if (isLoading) {
    return (
      <Container>
        <div className="w-full bg-base-content/25 h-0.5 mb-4" />
        <p>Loading projects...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="w-full bg-base-content/25 h-0.5 mb-4" />
        <p>Error loading projects</p>
      </Container>
    );
  }

  return (
    <Container>
      <div className="w-full bg-base-content/25 h-0.5 mb-4" />
      <ul className="flex flex-col gap-2">
        {projects?.map((project) => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </ul>
    </Container>
  );
}

export default YourProjectsCard;
