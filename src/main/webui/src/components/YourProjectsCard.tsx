import React from "react";
import Card from "./Card";
import { useProjects } from "@hooks/useProjects";
import { Link } from "react-router";

function Container({ children }: { children: React.ReactNode }) {
  return (
    <Card title={<div className="font-bold text-lg">Your projects</div>}>
      {children}
    </Card>
  );
}

function YourProjectsCard() {
  const { data: projects, isLoading, error } = useProjects();

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
          <li key={project.id} className="">
            <Link
              to={`/projects/${project.id}`}
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-base-200"
            >
              <div
                className="rounded-lg size-12 inline-block"
                style={{ backgroundColor: project.color }}
              />
              <div className="flex flex-col">
                <h3 className="font-semibold">{project.name}</h3>
                <div className="text-stone-500">
                  4 tasks - 2 due this week - 1 overdue
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}

export default YourProjectsCard;
