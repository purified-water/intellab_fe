import { Card, CardHeader, CardTitle, CardContent, Skeleton } from "@/components/ui/shadcn";
import { Server, Zap } from "lucide-react";

export const JudgeServiceOverview = () => {
  const isLoading = false; // Replace with actual loading state

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {isLoading ? (
        Array.from({ length: 2 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-6" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </CardContent>
          </Card>
        ))
      ) : (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Running Judge Services (Pods)</CardTitle>
              <Server className="w-4 h-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{2}</div>
              <p className="text-xs text-muted-foreground">Maximum 4 instances</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Today Submissions</CardTitle>
              <Zap className="w-4 h-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{2}</div>
              <p className="text-xs text-muted-foreground">+12% compared to yesterday</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
