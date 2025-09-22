import { NextRequest, NextResponse } from 'next/server';
import { isWithinInterval, startOfWeek, endOfWeek, parseISO } from 'date-fns';

interface ClickUpTask {
  id: string;
  name: string;
  status: {
    status: string;
    type: string;
  };
  date_done?: string | null;
  due_date?: string | null;
  assignees?: Array<{
    id: string;
    username: string;
    email: string;
  }>;
  project?: {
    id: string;
    name: string;
  };
  folder?: {
    id: string;
    name: string;
  };
  list?: {
    id: string;
    name: string;
  };
}

interface ClickUpResponse {
  tasks: ClickUpTask[];
}

interface ProjectData {
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

interface DashboardStats {
  unassigned: number;
  inProgress: number;
  completed: number;
  completedThisWeek: number;
  totalTasks: number;
}

interface TaskSummary {
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

function getProjectInfo(task: ClickUpTask): { id: string; name: string } {
  // Priority: project > folder > list

  // console.log("task", task);
  if (task.project) {
    return { id: task.project.id, name: task.project.name };
  }
  if (task.folder) {
    return { id: task.folder.id, name: task.folder.name };
  }
  if (task.list) {
    return { id: task.list.id, name: task.list.name };
  }
  return { id: 'unknown', name: 'Unknown Project' };
}

function isTaskCompleted(task: ClickUpTask): boolean {
  return task.status.type === 'closed' || task.status.status.toLowerCase().includes('complete');
}

function isTaskInProgress(task: ClickUpTask): boolean {
  const statusLower = task.status.status.toLowerCase();
  return !isTaskCompleted(task) && (
    statusLower.includes('progress') ||
    statusLower.includes('in progress') ||
    statusLower.includes('doing') ||
    statusLower.includes('active')
  );
}

function isTaskTodo(task: ClickUpTask): boolean {
  const statusLower = task.status.status.toLowerCase();
  return !isTaskCompleted(task) && !isTaskInProgress(task) && (
    statusLower.includes('todo') ||
    statusLower.includes('to do') ||
    statusLower.includes('open') ||
    statusLower.includes('new') ||
    statusLower.includes('backlog') ||
    task.status.type === 'open' // Default open tasks to todo
  );
}

function isTaskUnassigned(task: ClickUpTask): boolean {
  // Check if task has no assignees or assignees array is empty
  return !task.assignees || (Array.isArray(task.assignees) && task.assignees.length === 0);
}

function isDateThisWeek(dateString: string | null | undefined): boolean {
  if (!dateString) return false;

  try {
    // ClickUp timestamps are in milliseconds
    const date = new Date(parseInt(dateString));
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    return isWithinInterval(date, { start: weekStart, end: weekEnd });
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.CLICKUP_API_KEY;
    const teamId = process.env.CLICKUP_TEAM_ID;

    if (!apiKey || !teamId) {
      return NextResponse.json(
        { error: 'Missing CLICKUP_API_KEY or CLICKUP_TEAM_ID environment variables' },
        { status: 500 }
      );
    }

    // Fetch tasks from ClickUp API
    const response = await fetch(
      `https://api.clickup.com/api/v2/team/9012733295/task?include_closed=true`,
      {
        headers: {
          Authorization: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`ClickUp API error: ${response.status} ${response.statusText}`);
    }

    const data: ClickUpResponse = await response.json();

    console.log("data  from clickup api", data.tasks[0].status);
    const tasks = data.tasks || [];

    // Group tasks by project
    const projectsMap = new Map<string, {
      id: string;
      name: string;
      tasks: ClickUpTask[];
    }>();

    tasks.forEach(task => {
      const projectInfo = getProjectInfo(task);
      const projectKey = projectInfo.id;

      if (!projectsMap.has(projectKey)) {
        projectsMap.set(projectKey, {
          id: projectInfo.id,
          name: projectInfo.name,
          tasks: [],
        });
      }

      projectsMap.get(projectKey)!.tasks.push(task);
    });

    // Calculate dashboard statistics
    const totalTasks = tasks.length;
    const unassignedTasks = tasks.filter(isTaskUnassigned);
    const inProgressTasks = tasks.filter(isTaskInProgress);
    const completedTasks = tasks.filter(isTaskCompleted);
    const completedThisWeekTasks = completedTasks.filter(task =>
      isDateThisWeek(task.date_done)
    );

    const dashboardStats: DashboardStats = {
      unassigned: unassignedTasks.length,
      inProgress: inProgressTasks.length,
      completed: completedTasks.length,
      completedThisWeek: completedThisWeekTasks.length,
      totalTasks: totalTasks,
    };

    // Calculate projects data with proper progress calculation
    const projects: ProjectData[] = Array.from(projectsMap.values()).map(project => {
      const { tasks: projectTasks } = project;

      // Separate tasks by status
      const todoProjectTasks = projectTasks.filter(isTaskTodo);
      const inProgressProjectTasks = projectTasks.filter(isTaskInProgress);
      const completedProjectTasks = projectTasks.filter(isTaskCompleted);

      // Debug logging
      console.log(`\nProject: ${project.name}`);
      projectTasks.forEach(task => {
        console.log(`Task: "${task.name}" - Status: "${task.status.status}" (${task.status.type})`);
        console.log(`  - Completed: ${isTaskCompleted(task)}`);
        console.log(`  - In Progress: ${isTaskInProgress(task)}`);
        console.log(`  - Todo: ${isTaskTodo(task)}`);
      });

      // Total tasks = Todo + In Progress + Completed (all tasks in the project)
      const totalProjectTasks = todoProjectTasks.length + inProgressProjectTasks.length + completedProjectTasks.length;

      // Tasks completed this week
      const completedThisWeekProjectTasks = completedProjectTasks.filter(task =>
        isDateThisWeek(task.date_done)
      );

      // Tasks due this week
      const dueThisWeekTasks = projectTasks.filter(task =>
        isDateThisWeek(task.due_date)
      );

      // Calculate progress: completed tasks / (todo + in progress + completed) * 100
      const progress = totalProjectTasks > 0
        ? Math.round((completedProjectTasks.length / totalProjectTasks) * 100)
        : 0;

      // console.log(`Project: ${project.name}`);
      // console.log(`  Todo tasks: ${todoProjectTasks.length}`);
      // console.log(`  In Progress tasks: ${inProgressProjectTasks.length}`);
      // console.log(`  Completed tasks: ${completedProjectTasks.length}`);
      // console.log(`  Total tasks (Todo+InProgress+Completed): ${totalProjectTasks}`);
      // console.log(`  Progress: ${completedProjectTasks.length}/${totalProjectTasks} = ${progress}%`);

      return {
        id: project.id,
        name: project.name,
        progress,
        counters: {
          todo: todoProjectTasks.length,
          inProgress: inProgressProjectTasks.length,
          completed: completedProjectTasks.length,
          completedThisWeek: completedThisWeekProjectTasks.length,
          dueThisWeek: dueThisWeekTasks.length,
        },
      };
    });

    // Prepare task summaries for the table (limit to recent/important tasks)
    const taskSummaries: TaskSummary[] = tasks
      .slice(0, 50) // Limit to 50 most recent tasks
      .map(task => {
        const projectInfo = getProjectInfo(task);
        return {
          id: task.id,
          name: task.name,
          status: task.status.status,
          assignees: task.assignees || [],
          dueDate: task.due_date || null,
          projectName: projectInfo.name,
        };
      });

    return NextResponse.json({
      stats: dashboardStats,
      projects: projects,
      tasks: taskSummaries
    });

  } catch (error) {
    console.error('Error fetching ClickUp tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks from ClickUp' },
      { status: 500 }
    );
  }
}
