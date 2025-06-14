export interface ContainerUsage {
  cpu: string;
  memory: string;
}

export interface Container {
  usage: ContainerUsage;
  name: string;
}

export interface PodMetadata {
  name: string;
  namespace: string;
}

export interface WorkerPod {
  metadata: PodMetadata;
  containers: Container[];
  window: string;
  timestamp: string;
  uptime: number;
  status: string;
}
