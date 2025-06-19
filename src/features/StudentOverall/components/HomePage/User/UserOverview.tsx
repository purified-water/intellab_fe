import { Card, CardContent, CardHeader, CardTitle, Progress, Skeleton } from "@/components/ui/shadcn";
import { TProgress } from "@/types";

interface UserOverviewProps {
  progress: TProgress | null;
  isLoading?: boolean;
}

const SkeletonProgress = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-10 h-4" />
          </div>
          <Skeleton className="w-full h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-1">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-10 h-4" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const UserOverview = ({ progress, isLoading }: UserOverviewProps) => {
  if (isLoading) {
    return <SkeletonProgress />;
  }

  if (!progress) return null;

  const { easy, medium, hard, totalProblems } = progress;
  const totalSolved = easy.solved + medium.solved + hard.solved;
  const totalSolvedPercentage = Math.round((totalSolved / totalProblems) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Overall Completion</div>
            <div className="text-sm font-medium">{totalSolvedPercentage}%</div>
          </div>
          <Progress value={totalSolvedPercentage} className="h-2" />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col">
              <span className="font-medium">Solved</span>
              <span className="text-muted-foreground">
                {totalSolved}/{totalProblems}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium">Easy</span>
              <span className="text-muted-foreground">
                {easy.solved}/{easy.max}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium">Medium</span>
              <span className="text-muted-foreground">
                {medium.solved}/{medium.max}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium">Hard</span>
              <span className="text-muted-foreground">
                {hard.solved}/{hard.max}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
