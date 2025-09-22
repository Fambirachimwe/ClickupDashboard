import { useQuery } from '@tanstack/react-query';

export interface ProjectData {
  id: string;
  name: string;
  progress: number;
  counters: {
    todo: number;
    inProgress: number;
    completed: number;
    completedThisWeek: number;
    dueThisWeek: number;
  };
}

export interface DashboardStats {
  unassigned: number;
  inProgress: number;
  completed: number;
  completedThisWeek: number;
  totalTasks: number;
  activeProjects: number;
}

export interface TaskSummary {
  id: string;
  name: string;
  status: string;
  assignees: Array<{
    id: string;
    username: string;
    email: string;
  }>;
  dueDate: string | null;
  projectName: string;
}

interface TasksResponse {
  stats: DashboardStats;
  projects: ProjectData[];
  tasks: TaskSummary[];
  openTasksByAssignee: Array<{ id: string; username: string; email: string; count: number }>;
}

const fetchTasks = async (): Promise<TasksResponse> => {
  const response = await fetch('/api/tasks');

  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.status}`);
  }

  return response.json();
};

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    staleTime: 30 * 1000, // Consider data stale after 30 seconds
  });
};
