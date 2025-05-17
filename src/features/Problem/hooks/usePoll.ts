import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

// type PollFunction<T> = (id: string) => Promise<void>;
// type ValidationFunction = () => boolean;
// type ExecuteFunction<T> = () => Promise<void>;

interface UsePollProps<T> {
  pollingInterval: number;
  maxTimeout: number;
  onSuccess: (data: T) => void;
  onTimeout: () => void;
  onError: (error: unknown) => void;
}

/**
 * A generalized hook for handling polling operations
 */
export const usePoll = <T>({ pollingInterval, maxTimeout, onSuccess, onTimeout, onError }: UsePollProps<T>) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const clearPollInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => clearPollInterval();
  }, []);

  const createPollFunction = (fetchUpdateFn: (id: string) => Promise<T>, checkCompletionFn: (data: T) => boolean) => {
    return async (id: string) => {
      let elapsedTime = 0;

      // Clear any existing interval
      clearPollInterval();

      intervalRef.current = setInterval(async () => {
        elapsedTime += pollingInterval;

        try {
          const response = await fetchUpdateFn(id);

          if (response) {
            const isComplete = checkCompletionFn(response);

            if (isComplete || elapsedTime >= maxTimeout) {
              clearPollInterval();

              if (elapsedTime >= maxTimeout && !isComplete) {
                toast({
                  variant: "destructive",
                  description: "Operation timed out. Please try again later."
                });
                onTimeout();
              } else {
                toast({
                  description: "Operation completed successfully!"
                });
                onSuccess(response);
              }
            }
          } else {
            console.error("Error in polling: No response received");
            clearPollInterval();
            onError(new Error("No response received"));
          }
        } catch (error) {
          console.error("Failed to fetch update:", error);
          clearPollInterval();
          onError(error);
        }
      }, pollingInterval);
    };
  };

  return {
    createPollFunction,
    clearPollInterval
  };
};
