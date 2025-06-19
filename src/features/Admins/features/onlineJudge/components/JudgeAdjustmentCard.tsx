import { AlertDialog, Button } from "@/components/ui";
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
import { Settings, RefreshCw } from "lucide-react";
import { useState } from "react";
import { usePostJudgeScale } from "../hooks/useAdminJudge";
import { showToastError, showToastSuccess } from "@/utils";
import { useToast } from "@/hooks";
import { MAX_SERVICE_COUNT } from "@/constants";

interface JudgeAdjustmentCardProps {
  serviceCount: number;
}

export const JudgeAdjustmentCard = ({ serviceCount }: JudgeAdjustmentCardProps) => {
  const [replicas, setReplicas] = useState(serviceCount);
  const [isOpenScaleDialog, setOpenScaleDialog] = useState(false);
  const isLoading = false; // Replace with actual loading state
  const { toast } = useToast();

  const { mutate: handleScaleMutation, isPending: isScaling } = usePostJudgeScale();

  const handleScale = () => {
    if (replicas === serviceCount || replicas < 1 || replicas > MAX_SERVICE_COUNT) {
      return;
    }
    handleScaleMutation(replicas, {
      onSuccess: () => {
        showToastSuccess({ toast: toast, message: `Judge service count adjusted to ${replicas}` });
      },
      onError: () => {
        setReplicas(serviceCount);
        showToastError({
          toast: toast,
          message: "Failed to adjust judge service. Please try again later."
        });
      },
      onSettled: () => {
        setOpenScaleDialog(false);
      }
    });
  };

  const renderDeleteDialog = () => {
    return (
      <AlertDialog
        open={isOpenScaleDialog}
        title="You are about to manually update the judge services"
        message="This action is irreversible. Once a service is affected, it may take some time to recover."
        onConfirm={() => handleScale()}
        onCancel={() => setOpenScaleDialog(false)}
        processing={isScaling}
      />
    );
  };

  return (
    <>
      {" "}
      <Card>
        {isLoading ? (
          <CardContent>
            <Skeleton className="w-1/2 h-6 mb-4" />
            <Skeleton className="w-3/4 h-4 mb-2" />
            <Skeleton className="w-full h-4 mb-2" />
          </CardContent>
        ) : (
          <>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Adjust Judge Services Count
                <Settings className="size-4" />
              </CardTitle>
              <CardDescription>
                Scale service up or down based on current load (Maximum {MAX_SERVICE_COUNT} services)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="replicas">Target Service Count:</Label>
                  <Input
                    id="replicas"
                    type="number"
                    value={replicas}
                    onChange={(e) => setReplicas(Number(e.target.value))}
                    className="w-20"
                    min="1"
                    max={MAX_SERVICE_COUNT}
                  />
                </div>
                <div>
                  <Button type="button" variant="outline" onClick={() => setOpenScaleDialog(true)} disabled={isScaling}>
                    Confirm
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
      {renderDeleteDialog()}
    </>
  );
};
