import { Button } from "@/components/ui";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Label,
  Skeleton
} from "@/components/ui/shadcn";
import { Settings, Plus, Minus, RefreshCw } from "lucide-react";
import { useState } from "react";

export const JudgeAdjustmentCard = () => {
  const [targetReplicas, setTargetReplicas] = useState(2);
  const [isScaling] = useState(false);
  const isLoading = false; // Replace with actual loading state

  const handleScale = (direction: "up" | "down") => {
    // Placeholder for scaling logic
    console.log(`Scaling pods ${direction} to ${targetReplicas}`);
    if (direction === "up") {
      setTargetReplicas((prev) => Math.min(prev + 1, 4)); // Max 4
    }
    if (direction === "down") {
      setTargetReplicas((prev) => Math.max(prev - 1, 1)); // Min 1 replica
    }
  };

  return (
    <Card>
      {isLoading ? (
        <CardContent>
          <Skeleton className="h-6 w-1/2 mb-4" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
        </CardContent>
      ) : (
        <>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Adjust Judge Instances
              <Settings className="size-4" />
            </CardTitle>
            <CardDescription>Scale pods up or down based on current load</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="replicas">Target Pods:</Label>
                <Input
                  id="replicas"
                  type="number"
                  value={targetReplicas}
                  onChange={(e) => setTargetReplicas(Number.parseInt(e.target.value) || 1)}
                  className="w-20"
                  min="1"
                  max="10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleScale("up")} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Scale Up
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleScale("down")} className="gap-2">
                  <Minus className="w-4 h-4" />
                  Scale Down
                </Button>
              </div>
              {isScaling && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Scaling in progress...
                </div>
              )}
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
};
