import { Button } from "@/components/ui";
import { Cpu, MemoryStick, RefreshCw } from "lucide-react";
import { JudgeAdjustmentCard, JudgeServiceOverview } from "../components";
import { Skeleton } from "@/components/ui/shadcn";
import { WorkerPod } from "../types/judgeTypes";
import { formatUptime } from "@/utils";
import { SEO } from "@/components/SEO";
import { useGetJudgeServices, useGetPendingSubmissions } from "../hooks/useAdminJudge";

export const JudgeManagementPage = () => {
  const {
    data: workerData = [],
    isLoading: workerLoading,
    refetch: refetchGetWorker,
    isRefetching: isWorkerRefetching
  } = useGetJudgeServices();

  const {
    data: pendingSubmissionsData = 0,
    isLoading: pendingSubmissionsLoading,
    refetch: refetchPendingSubmissions,
    isRefetching: isPendingSubmissionsRefetching
  } = useGetPendingSubmissions();

  const handleRefresh = () => {
    refetchGetWorker();
    refetchPendingSubmissions();
  };

  const workerServices: WorkerPod[] = workerData.map((worker: WorkerPod) => {
    return {
      ...worker,
      uptime: formatUptime(worker.uptime),
      containers: worker.containers.map((container) => ({
        ...container,
        usage: {
          cpu: (parseInt(container.usage.cpu, 10) / 1_000_000_000).toFixed(2),
          memory: (parseInt(container.usage.memory, 10) * 0.001024).toFixed(2)
        }
      }))
    };
  });

  const renderTableHeader = () => (
    <thead className="text-left border-t border-b border-gray5">
      <tr className="font-normal text-left border-t border-b border-gray5">
        <th className="w-2/5 py-4">
          <div className="flex items-center">Service Name</div>
        </th>
        <th className="w-1/5">
          <div className="flex items-center">Status</div>
        </th>
        <th className="w-1/5">
          <div className="flex items-center">CPU Usage</div>
        </th>
        <th className="w-1/5">
          <div className="flex items-center">Memory Usage</div>
        </th>
        <th className="w-1/5">
          <div className="flex items-center">Uptime</div>
        </th>
      </tr>
    </thead>
  );

  const renderTableBody = () => (
    <tbody>
      {workerLoading || isWorkerRefetching
        ? Array.from({ length: 3 }).map((_, index) => (
            <tr key={index} className="text-base border-b border-gray5">
              <td className="w-1/5 py-4">
                <Skeleton className="w-3/4 h-6" />
              </td>
              <td className="w-1/5 py-4">
                <Skeleton className="w-3/4 h-6" />
              </td>
              <td className="w-1/5 py-4">
                <Skeleton className="w-3/4 h-6" />
              </td>
              <td className="w-1/5 py-4">
                <Skeleton className="w-3/4 h-6" />
              </td>
              <td className="w-1/5 py-4">
                <Skeleton className="w-3/4 h-6" />
              </td>
            </tr>
          ))
        : workerServices.map((worker) => (
            <tr key={worker.metadata.name} className="text-base border-b border-gray5">
              <td className="w-1/5 py-4 pr-2 truncate max-w-1/5">{worker.metadata.name}</td>
              <td className={`w-1/5 py-4 font-medium ${worker.status == "Running" ? "text-appEasy" : "text-appHard"}`}>
                {worker.status}
              </td>
              <td className="w-1/5 py-4">
                <div className="flex items-center">
                  <Cpu className="w-4 h-4 mr-2 text-muted-foreground" />
                  {worker.containers[0]?.usage.cpu}{" "}
                  {parseFloat(worker.containers[0]?.usage.cpu) === 1 ? "Core" : "Cores"}
                </div>
              </td>
              <td className="w-1/5 py-4">
                <div className="flex items-center">
                  <MemoryStick className="w-4 h-4 mr-2 text-muted-foreground" />
                  {worker.containers[0]?.usage.memory} MB
                </div>
              </td>
              <td className="w-1/5 py-4">{worker.uptime}</td>
            </tr>
          ))}
    </tbody>
  );

  return (
    <>
      <SEO title="Judge Management | Intellab" />
      <div className="container max-w-[1200px] mx-auto p-6 space-y-8 mb-12">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight text-appPrimary">Judge Management</h1>
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleRefresh}
            disabled={
              workerLoading || isWorkerRefetching || pendingSubmissionsLoading || isPendingSubmissionsRefetching
            }
          >
            <RefreshCw
              className={`size-4 ${workerLoading || isWorkerRefetching || pendingSubmissionsLoading || isPendingSubmissionsRefetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <JudgeServiceOverview
          serviceCount={workerServices.length}
          isLoadingServices={workerLoading}
          pendingSubmissions={pendingSubmissionsData ? pendingSubmissionsData : 0}
          isLoadingPendingSubmissions={pendingSubmissionsLoading}
          isUpdatingServices={isWorkerRefetching}
          isUpdatingPendingSubmissions={isPendingSubmissionsRefetching}
        />
        <JudgeAdjustmentCard serviceCount={workerServices.length} />

        <div className="text-xl font-semibold">Judge Services</div>
        <div className="flex justify-center">
          <table className="border-collapse w-[1100px] table-fixed inline-table">
            {renderTableHeader()}
            {renderTableBody()}
          </table>
        </div>
      </div>
    </>
  );
};
