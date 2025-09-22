import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ProjectData } from '@/hooks/use-tasks';

interface ProjectTileProps {
  project: ProjectData;
}

export function ProjectTile({ project }: ProjectTileProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold truncate">
          {project.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground">ID: {project.id}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        {/* Counters Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">
              {project.counters.inProgress}
            </div>
            <div className="text-xs text-muted-foreground">In Progress</div>
          </div>

          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600">
              {project.counters.completed}
            </div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>

          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-emerald-600">
              {project.counters.completedThisWeek}
            </div>
            <div className="text-xs text-muted-foreground">Done This Week</div>
          </div>

          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-orange-600">
              {project.counters.dueThisWeek}
            </div>
            <div className="text-xs text-muted-foreground">Due This Week</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
