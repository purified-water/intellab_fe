import { Card, CardHeader, CardTitle, CardContent, Skeleton } from "@/components/ui/shadcn";
import { MAX_SERVICE_COUNT } from "@/constants";
import { Server, Zap } from "lucide-react";

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  value?: number | string;
  description?: string;
  isLoading?: boolean;
  isUpdating?: boolean;
}

const StatCard = ({ title, icon, value, description, isLoading, isUpdating }: StatCardProps) => (
  <Card className={isUpdating ? "ring-2 ring-appPrimary transition-all duration-300" : ""}>
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`flex items-center gap-2 ${isUpdating ? "animate-pulse text-appPrimary" : ""}`}>{icon}</div>
      </>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <>
          <Skeleton className="w-1/5 h-12" />
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
  pendingSubmissions: number;
  isLoadingPendingSubmissions: boolean;
  isUpdatingServices?: boolean;
  isUpdatingPendingSubmissions?: boolean;
}

export const JudgeServiceOverview = ({
  isLoadingServices,
  serviceCount,
  pendingSubmissions,
  isLoadingPendingSubmissions,
  isUpdatingServices = false,
  isUpdatingPendingSubmissions = false
}: JudgeServiceOverviewProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <StatCard
        title="Running Judge Services"
        icon={<Server className="w-4 h-4" />}
        value={serviceCount}
        description={`Maximum ${MAX_SERVICE_COUNT} services`}
        isLoading={isLoadingServices}
        isUpdating={isUpdatingServices}
      />
      <StatCard
        title="Submissions In-queue"
        icon={<Zap className="w-4 h-4" />}
        value={pendingSubmissions || 0}
        isLoading={isLoadingPendingSubmissions}
        isUpdating={isUpdatingPendingSubmissions}
      />
    </div>
  );
};
