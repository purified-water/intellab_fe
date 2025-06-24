import { Button } from "@/components/ui";
import { RefreshCw } from "lucide-react";
import { JudgeAdjustmentCard, JudgeServiceOverview } from "../components";
import { Skeleton } from "@/components/ui/shadcn";
import { WorkerPod } from "../types/judgeTypes";
import { formatUptime, showToastDefault } from "@/utils";
import { SEO } from "@/components/SEO";
import { useGetJudgeServices, useGetPendingSubmissions } from "../hooks/useAdminJudge";
import { WORKER_STATUS } from "../constants/workerService";
import { NA_VALUE } from "@/constants";
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks";

export const JudgeManagementPage = () => {
  const { toast } = useToast();
  const previousWorkerCountRef = useRef<number | null>(null);

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
      uptime: worker.containers.length > 0 ? formatUptime(worker.uptime) : "0s",
      containers:
        worker.containers.length > 0
          ? worker.containers.map((container) => ({
              ...container,
              usage: {
                cpu: (parseInt(container.usage.cpu, 10) / 1_000_000_000).toFixed(2),
                memory: (parseInt(container.usage.memory, 10) * 0.001024).toFixed(2)
              }
            }))
          : [{ usage: { cpu: NA_VALUE, memory: NA_VALUE } }]
    };
  });

  useEffect(() => {
    // Only show toast if this is not the initial load and worker data has actually changed
    if (!workerLoading && !isWorkerRefetching && previousWorkerCountRef.current !== null) {
      const currentWorkerCount = workerData.length;
      const previousWorkerCount = previousWorkerCountRef.current;

      if (currentWorkerCount > previousWorkerCount) {
        const newWorkersCount = currentWorkerCount - previousWorkerCount;
        showToastDefault({
          toast: toast,
          title: "Worker Created",
          message: `${newWorkersCount} new worker${newWorkersCount > 1 ? "s" : ""} ${newWorkersCount > 1 ? "have" : "has"} been created`
        });
      } else if (currentWorkerCount < previousWorkerCount) {
        const terminatedWorkersCount = previousWorkerCount - currentWorkerCount;
        showToastDefault({
          toast: toast,
          title: "Worker Terminated",
          message: `${terminatedWorkersCount} worker${terminatedWorkersCount > 1 ? "s" : ""} ${terminatedWorkersCount > 1 ? "have" : "has"} been terminated`
        });
      }
    }

    // Update the previous worker count after processing
    if (!workerLoading && !isWorkerRefetching) {
      previousWorkerCountRef.current = workerData.length;
    }
  }, [workerData, workerLoading, isWorkerRefetching, toast]);

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
          <div className="flex items-center">CPU Usage (Core)</div>
        </th>
        <th className="w-1/5">
          <div className="flex items-center">Memory Usage (MB)</div>
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
              <td
                className={`w-1/5 py-4 font-medium ${
                  worker.status == WORKER_STATUS.RUNNING
                    ? "text-appEasy"
                    : worker.status === WORKER_STATUS.CREATING
                      ? "text-appMedium"
                      : "text-appHard"
                }`}
              >
                {worker.status}
              </td>
              <td className="w-1/5 px-12 py-4">
                <div className="flex items-center justify-end">
                  {/* <Cpu className="w-4 h-4 mr-2 text-muted-foreground" /> */}
                  {worker.containers[0]?.usage.cpu}
                </div>
              </td>
              <td className="w-1/5 py-4 px-7">
                <div className="flex items-center justify-end">
                  {/* <MemoryStick className="w-4 h-4 mr-2 text-muted-foreground" /> */}
                  {worker.containers[0]?.usage.memory}
                </div>
              </td>
              <td className="w-1/5 py-4">
                {worker.uptime}
                {worker.containers.length > 0 ? " ago" : ""}
              </td>
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
