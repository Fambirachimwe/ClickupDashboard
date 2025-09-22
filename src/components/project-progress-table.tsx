import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ProjectData } from "@/hooks/use-tasks";

interface ProjectProgressTableProps {
  projects: ProjectData[];
  compact?: boolean;
}

export function ProjectProgressTable({
  projects,
  compact = false,
}: ProjectProgressTableProps) {
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600";
    if (progress >= 50) return "text-blue-600";
    if (progress >= 25) return "text-yellow-600";
    return "text-red-600";
  };

  const visible = compact ? projects.slice(0, 8) : projects;

  return (
    <Card className={compact ? "h-full" : undefined}>
      <CardHeader className={compact ? "py-2" : undefined}>
        <CardTitle className={compact ? "text-base" : "text-lg font-semibold"}>
          Project Progress
        </CardTitle>
        {!compact && (
          <p className="text-sm text-muted-foreground">
            Progress overview for all projects
          </p>
        )}
      </CardHeader>
      <CardContent className={compact ? "pt-0" : undefined}>
        <div
          className={`rounded-md border ${
            compact ? "max-h-none overflow-hidden" : "max-h-96 overflow-auto"
          }`}
        >
          <Table className={compact ? "text-xs" : undefined}>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[200px]">Project Name</TableHead>
                <TableHead className="w-[120px]">Progress</TableHead>
                <TableHead className="text-center">Todo</TableHead>
                <TableHead className="text-center">In Progress</TableHead>
                <TableHead className="text-center">Completed</TableHead>
                {/* <TableHead className="text-center">This Week</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No projects available
                  </TableCell>
                </TableRow>
              ) : (
                visible.map((project) => {
                  const totalTasks =
                    project.counters.todo +
                    project.counters.inProgress +
                    project.counters.completed;
                  return (
                    <TableRow
                      key={project.id}
                      className={compact ? "h-10" : undefined}
                    >
                      <TableCell className="font-medium">
                        <div
                          className={`truncate ${
                            compact ? "max-w-[160px]" : "max-w-[180px]"
                          }`}
                          title={project.name}
                        >
                          {project.name}
                        </div>
                        {!compact && (
                          <div className="text-xs text-muted-foreground">
                            ID: {project.id}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-sm">
                            <span
                              className={`font-medium ${getProgressColor(
                                project.progress
                              )}`}
                            >
                              {project.progress}%
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {project.counters.completed}/{totalTasks}
                            </span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          {project.counters.todo}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {project.counters.inProgress}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {project.counters.completed}
                        </span>
                      </TableCell>
                      {/* <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                          {project.counters.completedThisWeek}
                        </span>
                      </TableCell> */}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
