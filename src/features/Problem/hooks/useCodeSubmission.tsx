import { useState } from "react";
import { problemAPI } from "@/lib/api/problemApi";
import { courseAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { getUserIdFromLocalStorage } from "@/utils";
import { SubmissionTypeNoProblem, TestCaseAfterSubmit } from "../types";
import { saveCode } from "@/redux/problem/problemSlice";
import { saveSubmission } from "@/redux/problem/submissionSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { showToastError } from "@/utils";
import { useCatchError } from "@/hooks";

interface UseCodeSubmissionProps {
  code: string;
  language: string;
  problemId?: string;
  learningId?: string | null;
  courseId?: string | null;
}

export const useCodeSubmission = ({ code, language, problemId, learningId, courseId }: UseCodeSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmissionPassed, setIsSubmissionPassed] = useState<boolean | null>(null);

  const { toast } = useToast();
  const dispatch = useDispatch();
  const userRedux = useSelector((state: RootState) => state.user.user);
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

  // If the user is logged in and the problem is belong to a lesson (has learning ID), update the learning progress
  const updatePracticeDone = async () => {
    if (learningId && userId && courseId) {
      try {
        await courseAPI.updatePracticeDone(learningId, courseId);
      } catch (error) {
        console.error("Failed to update learning progress", error);
      }
    }
  };

  const handleSubmissionResult = (submission: SubmissionTypeNoProblem) => {
    const testCasesOutput = submission.testCasesOutput as TestCaseAfterSubmit[];
    // Save the submission result to the state
    if (!problemId) return;
    dispatch(saveSubmission({ problemId, updateResponse: submission }));
    // Check if all test cases are passed
    const isPassed = testCasesOutput.every((testCase: TestCaseAfterSubmit) => testCase.result_status === "Accepted");

    setIsSubmissionPassed(isPassed);
    setIsSubmitting(false);
  };

  const pollSubmissionStatus = async (submissionId: string) => {
    let elapsedTime = 0;
    const maxTimeout = 80000; // 80 seconds
    const interval = setInterval(async () => {
      elapsedTime += 5000; // Increment elapsed time by 5 seconds

      try {
        const response = await problemAPI.getUpdateSubmission(submissionId);
        if (response) {
          const updateResponse = response;

          // Check if all test case results have `result_status` not equal to "null" or "In Queue"
          const allResultsAvailable = updateResponse.testCasesOutput.every(
            (testCase: TestCaseAfterSubmit) =>
              testCase.result_status &&
              testCase.result_status !== "In Queue" &&
              testCase.result_status !== "Progressing"
          );

          if (allResultsAvailable || elapsedTime >= maxTimeout) {
            clearInterval(interval); // Stop polling

            if (elapsedTime >= maxTimeout && !allResultsAvailable) {
              toast({
                variant: "destructive",
                description: "Submission timeout. Please try again later."
              });
              setIsSubmitting(false);
            } else {
              toast({
                description: "Submission completed! Check the results."
              });
              // Commented out because it is not needed as it has already been handled
              // await problemAPI.getSubmissionIsSolved(submissionId);
              // Handle final results
              handleSubmissionResult(updateResponse);
              // Update learning progress if the problem is in a lesson
              updatePracticeDone();
            }
          }
        } else {
          console.error(`Error in polling: ${response.status} ${response.statusText}`);
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Failed to fetch submission update:", error);
        clearInterval(interval);
      }
    }, 5000); // Poll every 5 seconds
  };

  const handleSubmitCode = async () => {
    if (!userRedux?.isEmailVerified) {
      showToastError({
        toast: toast,
        title: "Email verification required",
        message: (
          <>
            Please go to the{" "}
            <a href="/profile/edit" className="underline text-appHyperlink">
              Setting Page
            </a>{" "}
            and verify your email to submit problem.
          </>
        )
      });
      return;
    }

    if (!submissionValidation()) return;
    setIsSubmitting(true);

    try {
      if (problemId && userId) {
        dispatch(saveCode({ problemId, code, language }));

        const response = await problemAPI.createSubmission(1, code, language, problemId, userId);

        if (response?.submissionId) {
          pollSubmissionStatus(response.submissionId);
        }
      }
    } catch (error) {
      const errorMessage = useCatchError(error, "Failed to run code. Please try again later.");

      toast({
        variant: "destructive",
        description: errorMessage
      });

      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    isSubmissionPassed,
    handleSubmitCode,
    setIsSubmissionPassed
  };
};
