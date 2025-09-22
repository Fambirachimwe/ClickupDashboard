"use client";

import { useTasks } from "@/hooks/use-tasks";
import { StatCard } from "@/components/stat-card";
import { ProjectProgressTable } from "@/components/project-progress-table";
import { TaskOverviewTable } from "@/components/task-overview-table";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { FullscreenToggle } from "@/components/fullscreen-toggle";
import { RefreshCw, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  const { data, isLoading, error, refetch, isFetching } = useTasks();

  // console.log(data);

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-lg text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="h-8 w-8 mx-auto text-destructive" />
          <h1 className="text-lg font-semibold">Failed to load dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "An unknown error occurred"}
          </p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const stats = data?.stats;
  const projects = data?.projects || [];
  const tasks = data?.tasks || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <Image src="/logo.png" alt="Logo" width={150} height={150} />
              {/* <h1 className="text-2xl font-bold">UIP Africa</h1> */}
              <p className="text-sm pt-4 text-muted-foreground">
                Real-time task overview • Auto-refresh every 30s
              </p>
            </div>
            <div className="flex items-center gap-2">
              <FullscreenToggle />
              <ThemeToggle />
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={isFetching}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className=" container mx-auto px-2 py-6 space-y-24">
        {!stats ? (
          <div className="text-center py-12">
            <h2 className="text-lg font-semibold mb-2">No data available</h2>
            <p className="text-muted-foreground">
              Make sure your ClickUp API key and team ID are configured
              correctly.
            </p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Unassigned"
                value={stats.unassigned}
                description="Unassigned Tasks"
              />
              <StatCard
                title="In Progress"
                value={stats.inProgress}
                description="tasks in progress"
              />
              <StatCard
                title="Completed"
                value={stats.completed}
                description="tasks completed"
              />
              <StatCard
                title="Tasks Completed This Week"
                value={stats.completedThisWeek}
                description="tasks completed this week"
              />
            </div>

            {/* Project Progress and Task Overview - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project Progress Table - Left Half */}
              <div className="space-y-4 ">
                <ProjectProgressTable projects={projects} />
              </div>

              {/* Task Overview Table - Right Half */}
              <div className="space-y-4">
                <TaskOverviewTable tasks={tasks} />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-8">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Logo" width={100} height={100} />
              {/* <Image
                src="/clickup.png"
                alt="ClickUp Logo"
                width={100}
                height={100}
              /> */}
            </div>
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
