import { Button } from "@/components/ui";
import { Cpu, MemoryStick, RefreshCw } from "lucide-react";
import { JudgeAdjustmentCard, JudgeServiceOverview } from "../components";
import { Skeleton } from "@/components/ui/shadcn";

// Update the WorkerPod interface to include uptime
interface WorkerPod {
  podName: string;
  cpu: string;
  memory: string;
  status: string;
  isRunning: boolean;
  uptime: string; // New field for uptime
}

// Mock data for worker pods
const defaultWorkerPods: WorkerPod[] = [
  {
    podName: "Judge Pod 1",
    cpu: "40m",
    memory: "512Mi",
    status: "Running",
    isRunning: true,
    uptime: "24h"
  },
  {
    podName: "Judge Pod 2",
    cpu: "50m",
    memory: "1Gi",
    status: "Running",
    isRunning: true,
    uptime: "12h"
  },
  {
    podName: "Judge Pod 3",
    cpu: "30m",
    memory: "256Mi",
    status: "Stopped",
    isRunning: false,
    uptime: "0h"
  }
];

interface JudgeManagementPageProps {
  workerPods?: WorkerPod[];
}

export const JudgeManagementPage = ({ workerPods = defaultWorkerPods }: JudgeManagementPageProps) => {
  const renderTableHeader = () => (
    <thead className="text-left border-t border-b border-gray5">
      <tr className="font-normal text-left border-t border-b border-gray5">
        <th className="w-1/5 py-4">
          <div className="flex items-center">Pod Name</div>
        </th>
        <th className="w-1/5">
          <div className="flex items-center">CPU Usage</div>
        </th>
        <th className="w-1/5">
          <div className="flex items-center">Memory Usage</div>
        </th>
        <th className="w-1/5">
          <div className="flex items-center">Status</div>
        </th>
        <th className="w-1/5">
          <div className="flex items-center">Uptime</div>
        </th>
      </tr>
    </thead>
  );

  const renderTableBody = () => (
    <tbody>
      {workerPods.length === 0
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
        : workerPods.map((pod) => (
            <tr key={pod.podName} className="text-base border-b border-gray5">
              <td className="w-1/5 py-4">{pod.podName}</td>
              <td className="w-1/5 py-4">
                <div className="flex items-center">
                  <Cpu className="w-4 h-4 mr-2 text-muted-foreground" />
                  {pod.cpu}
                </div>
              </td>
              <td className="w-1/5 py-4">
                <div className="flex items-center">
                  <MemoryStick className="w-4 h-4 mr-2 text-muted-foreground" />
                  {pod.memory}
                </div>
              </td>
              <td className={`w-1/5 py-4 font-medium ${pod.isRunning ? "text-appEasy" : "text-appHard"}`}>
                {pod.status}
              </td>
              <td className="w-1/5 py-4">{pod.uptime}</td>
            </tr>
          ))}
    </tbody>
  );

  return (
    <div className="container max-w-[1200px] mx-auto p-6 space-y-8 mb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight text-appPrimary">Judge Management</h1>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <JudgeServiceOverview />
      <JudgeAdjustmentCard />

      <div className="text-xl font-semibold">Judge Services (Pods)</div>
      <div className="flex justify-center">
        <table className="border-collapse w-[1100px] table-fixed inline-table">
          {renderTableHeader()}
          {renderTableBody()}
        </table>
      </div>
    </div>
  );
};
