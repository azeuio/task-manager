interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  status: number; // 0 = To Do, 1 = In Progress, 2 = Done
  priority?: number;
  projectId: Project["id"];
  dueDate?: string;
  createdById: User["id"];
  assignedToId?: User["id"];
  createdAt: string;
  updatedAt: string;
}

type TaskCreateRequest = Omit<
  Task,
  "id" | "projectId" | "createdById" | "createdAt" | "updatedAt"
>;

interface Project {
  id: number;
  name: string;
  description?: string;
  color: string;
  userIds?: string[]; // Users that have access to this project
  customStatuses?: string[]; // Optional custom statuses for the project
  statusesOrder?: number[]; // Optional order of statuses, if not provided, default order is To Do, In Progress, Done
}

interface User {
  id: number;
  username: string;
  displayName: string;
  email: string;
}

interface ProjectMember {
  id: number;
  projectId: Project["id"];
  userId: User["id"];
  role: "OWNER" | "CONTRIBUTOR" | "VIEWER";
  joinedAt: string;
}

export type {
  ApiResponse,
  Task,
  TaskCreateRequest,
  Project,
  User,
  ProjectMember,
};
