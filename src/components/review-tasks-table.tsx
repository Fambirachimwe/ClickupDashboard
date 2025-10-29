import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TaskSummary } from "@/hooks/use-tasks";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ReviewTasksTableProps {
  tasks: TaskSummary[];
}

const getInitials = (username: string) => {
  return username
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
};

export function ReviewTasksTable({ tasks }: ReviewTasksTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Tasks In Review</CardTitle>
        <p className="text-sm text-muted-foreground">
          All tasks currently marked as Review
        </p>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border max-h-96 overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[220px]">Task Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assignees</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-2 text-muted-foreground"
                  >
                    No tasks in review
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">
                      <div className="truncate" title={task.name}>
                        {task.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {task.projectName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{task.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {task.assignees.length === 0 ? (
                        <span className="text-sm text-muted-foreground">
                          Unassigned
                        </span>
                      ) : task.assignees.length <= 3 ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          {task.assignees.map((assignee) => (
                            <div
                              key={assignee.id}
                              className="flex items-center gap-2 bg-muted px-2 py-1 rounded-md"
                              title={assignee.email}
                            >
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={undefined} />
                                <AvatarFallback className="text-xs">
                                  {getInitials(assignee.username)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs font-medium">
                                {assignee.username}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex -space-x-2">
                          {task.assignees.slice(0, 3).map((assignee) => (
                            <Avatar
                              key={assignee.id}
                              className="h-8 w-8 ring-2 ring-background"
                              title={`${assignee.username} (${assignee.email})`}
                            >
                              <AvatarImage src={undefined} />
                              <AvatarFallback className="text-xs">
                                {getInitials(assignee.username)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {task.assignees.length > 3 && (
                            <Avatar className="h-8 w-8 ring-2 ring-background bg-muted">
                              <AvatarFallback className="text-xs">
                                +{task.assignees.length - 3}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
