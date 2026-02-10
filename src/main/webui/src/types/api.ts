interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: number; // 0 = To Do, 1 = In Progress, 2 = Done
  projectId: string;
  assigneesId?: string[];
  dueDate?: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  userIds?: string[]; // Users that have access to this project
  customStatuses?: string[]; // Optional custom statuses for the project
  statusesOrder?: number[]; // Optional order of statuses, if not provided, default order is To Do, In Progress, Done
}

export type { ApiResponse, Task, Project };
