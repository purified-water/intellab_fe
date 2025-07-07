import { useState } from "react";
import { problemAPI } from "@/lib/api/problemApi";
import { useToast } from "@/hooks/use-toast";
import { getUserIdFromLocalStorage } from "@/utils";
import { RunCodeResponseType, RunCodeTestCase } from "../types";
import { useCatchError } from "@/hooks";
import { findLanguageByName } from "@/utils/problemUtils";

interface UseCodeRunnerProps {
  code: string;
  language: string;
  problemId?: string;
}

export const useCodeRunner = ({ code, language, problemId }: UseCodeRunnerProps) => {
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [runCodeResult, setRunCodeResult] = useState<RunCodeResponseType | null>(null);

  const { toast } = useToast();
  const userId = getUserIdFromLocalStorage();

  const submissionValidation = () => {
    if (!code) {
      toast({
        variant: "destructive",
        description: "Please write some code to submit!"
      });
      return false;
    }

    if (!userId) {
      toast({
        variant: "destructive",
        description: "Please log in to submit your code!"
      });
      return false;
    }
    return true;
  };

  const pollRunCode = async (runCodeId: string) => {
    let elapsedTime = 0;
    const maxTimeout = 30000; // 30s

    const interval = setInterval(async () => {
      elapsedTime += 5000;

      try {
        const response = await problemAPI.getRunCodeUpdate(runCodeId);

        if (response) {
          const updateResponse = response.result;

          // Check if all test case results have `result_status` not equal to "null" or "In Queue"
          const allResultsAvailable = updateResponse.testcases.every(
            (testCase: RunCodeTestCase) =>
              testCase.status && testCase.status !== "In Queue" && testCase.status !== "Progressing"
          );

          if (allResultsAvailable || elapsedTime >= maxTimeout) {
            clearInterval(interval); // Stop polling

            if (elapsedTime >= maxTimeout && !allResultsAvailable) {
              toast({
                variant: "destructive",
                description: "Run code timeout. Please try again later."
              });
              setIsRunningCode(false);
            } else {
              toast({
                description: "Run code completed!"
              });

              // Handle final results
              setRunCodeResult(updateResponse);
            }
          }
        } else {
          console.error(`Error in polling: ${response.status} ${response.statusText}`);
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Failed to fetch submission update:", error);
        clearInterval(interval);
      } finally {
        setIsRunningCode(false);
      }
    }, 4000);
  };

  const handleRunCode = async () => {
    if (!submissionValidation()) return;
    setIsRunningCode(true);

    const languageObj = findLanguageByName(language);
    const languageId = languageObj?.id;

    try {
      if (problemId && languageId) {
        const response = await problemAPI.postRunCode(code, languageId, problemId);
        const result = response.result;

        if (result) {
          pollRunCode(result.runCodeId);
        }
      }
    } catch (error) {
      const errorMessage = useCatchError(error, "Failed to run code. Please try again later.");
      toast({
        variant: "destructive",
        description: errorMessage
      });
    } finally {
      setIsRunningCode(false);
    }
  };

  return {
    isRunningCode,
    runCodeResult,
    handleRunCode,
    setRunCodeResult
  };
};
