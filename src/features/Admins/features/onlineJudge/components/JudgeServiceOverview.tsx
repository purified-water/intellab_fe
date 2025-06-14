import { Card, CardHeader, CardTitle, CardContent, Skeleton } from "@/components/ui/shadcn";
import { MAX_SERVICE_COUNT, NA_VALUE } from "@/constants";
import { Server, Zap } from "lucide-react";

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  value?: number | string;
  description?: string;
  isLoading?: boolean;
}

const StatCard = ({ title, icon, value, description, isLoading }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      {isLoading ? (
        <>
          <Skeleton className="w-1/2 h-4" />
          <Skeleton className="w-6 h-6" />
        </>
      ) : (
        <>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </>
      )}
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <>
          <Skeleton className="w-1/3 h-8" />
          <Skeleton className="w-2/3 h-4 mt-2" />
        </>
      ) : (
        <>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </>
      )}
    </CardContent>
  </Card>
);

interface JudgeServiceOverviewProps {
  isLoadingServices: boolean;
  serviceCount: number;
  isLoadingTodaySubmissions: boolean;
}

export const JudgeServiceOverview = ({
  isLoadingServices,
  serviceCount,
  isLoadingTodaySubmissions
}: JudgeServiceOverviewProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <StatCard
        title="Running Judge Services"
        icon={<Server className="w-4 h-4" />}
        value={serviceCount}
        description={`Maximum ${MAX_SERVICE_COUNT} services`}
        isLoading={isLoadingServices}
      />
      <StatCard
        title="Today Submissions"
        icon={<Zap className="w-4 h-4" />}
        value={NA_VALUE}
        description="+12% compared to yesterday"
        isLoading={isLoadingTodaySubmissions}
      />
    </div>
  );
};
