import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  className,
}: StatCardProps) {
  return (
    <Card className={`h-full ${className || ""}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center space-y-2 pt-0">
        <div className="text-6xl font-bold text-foreground">{value}</div>
        <div className="text-sm text-muted-foreground text-center">
          {description}
        </div>
      </CardContent>
    </Card>
  );
}
