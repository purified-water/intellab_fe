import { useEffect, useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/Resizable";
import { RenderDescTabs } from "../components/RenderDescription/RenderDescTabs";
import { RenderPGTabs } from "../components/RenderPlayground/RenderPlaygroundTabs";
import { RenderTCTabs } from "../components/RenderTestCase/RenderTestCaseTabs";
import { Button } from "@/components/ui/Button";
import { MdList } from "rocketicons/md";
import { FaPlay, FaSpinner, FaUpload } from "rocketicons/fa6";
import { RenderAllProblems } from "../components/RenderAllProblems/RenderAllProblemsList";
import { useParams } from "react-router-dom";
import { problemAPI } from "@/lib/api/problemApi";
import { ProblemType } from "@/types/ProblemType";
import { useSearchParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/rootReducer";
import { TestCaseAfterSubmit, TestCaseType } from "../types/TestCaseType";
import { useToast } from "@/hooks/use-toast";
import { getUserIdFromLocalStorage } from "@/utils";
import { SubmissionTypeNoProblem } from "../types/SubmissionType";
import { saveCode } from "@/redux/problem/problemSlice";
import { useDispatch } from "react-redux";
import { saveSubmission } from "@/redux/problem/submissionSlice";
import { courseAPI } from "@/lib/api";
import { LanguageCodes } from "../constants/LanguageCodes";
import { RunCodeResponseType, RunCodeTestCase } from "../types/RunCodeType";

export const ProblemDetail = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [problemDetail, setProblemDetail] = useState<ProblemType | null>(null);
  const [testCases, setTestCases] = useState<TestCaseType[]>([]);
  const { problemId } = useParams<{ problemId: string }>();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [isSubmissionPassed, setIsSubmissionPassed] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runCodeResult, setRunCodeResult] = useState<RunCodeResponseType | null>(null);
  const [isRunningCode, setIsRunningCode] = useState(false);

  // const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  const courseName = searchParams.get("courseName");
  const lessonId = searchParams.get("lessonId");
  const lessonName = searchParams.get("lessonName");
  const learningId = searchParams.get("learningId");
  // const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const userId = getUserIdFromLocalStorage();
  const { toast } = useToast();

  const submissionValidation = () => {
    console.log("code in validation", code);
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

  const dispatch = useDispatch();
  console.log("user id from local storage", userId);
  const fetchProblemDetail = async () => {
    try {
      const problemDetail = await problemAPI.getProblemDetail(problemId!);

      console.log("Problem detail", problemDetail);

      if (problemDetail) {
        setProblemDetail(problemDetail);
        setTestCases(problemDetail.testCases.slice(0, 3));
      }
    } catch (error) {
      console.error("Failed to fetch problem detail", error);
    }
  };

  const handleRunCode = async () => {
    if (!submissionValidation()) return;
    setIsRunningCode(true);

    const languageId = LanguageCodes.find((lang) => lang.name === language)?.id;

    try {
      if (problemId && languageId) {
        const response = await problemAPI.postRunCode(code, languageId, problemId);
        const result = response.result;
        console.log("Run code response", result);
        if (result) {
          pollRunCode(result.runCodeId);
        }
      }
    } catch (error) {
      console.error("Failed to run code", error);
      toast({
        variant: "destructive",
        description: "Failed to run code"
      });

      setIsRunningCode(false);
    }
  };

  const pollRunCode = async (runCodeId: string) => {
    let elapsedTime = 0;
    const maxTimeout = 12000; // 12s

    const interval = setInterval(async () => {
      elapsedTime += 4000;

      try {
        const response = await problemAPI.getRunCodeUpdate(runCodeId);
        console.log("Run code update response", response);
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
              setIsRunningCode(false);
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
    }, 4000);
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

  const handleSubmitCode = async () => {
    if (!submissionValidation()) return;
    setIsSubmitting(true);

    try {
      if (problemId && userId) {
        dispatch(saveCode({ problemId, code, language }));

        const response = await problemAPI.createSubmission(1, code, language, problemId!, userId);

        if (response?.submissionId) {
          pollSubmissionStatus(response.submissionId);
        }
      }
    } catch (error) {
      console.log("Failed to run code", error);
      toast({
        variant: "destructive",
        description: "Failed to run code"
      });

      setIsSubmitting(false);
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
    const maxTimeout = 60000; // 60 seconds
    const interval = setInterval(async () => {
      elapsedTime += 5000; // Increment elapsed time by 5 seconds

      try {
        const response = await problemAPI.getUpdateSubmission(submissionId);
        console.log("Submission update response", response);
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

  useEffect(() => {
    //NOTE: I don't know why the passing problemId if it null then its value is "null" instead of null
    if (problemId != null && problemId !== "null") {
      fetchProblemDetail();
    }
  }, [problemId]);

  // WAIT for isPrivate problem to redirect user, now problem is open to all
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate(`/course/${courseId}`);
  //   }
  // }, [isAuthenticated]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] p-2 bg-gray5">
      <div className="flex-grow overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="w-full h-full pb-10 mb-12">
          <ResizablePanel defaultSize={40} minSize={35} id="description" className="bg-white rounded-t-lg">
            <RenderDescTabs
              problemDetail={problemDetail}
              courseId={courseId}
              courseName={courseName}
              lessonId={lessonId}
              lessonName={lessonName}
              isPassed={isSubmissionPassed}
            />
          </ResizablePanel>

          <ResizableHandle withHandle className="w-2 bg-gray5" />

          {/* Right Panel: Playground and test case */}
          <ResizablePanel
            defaultSize={60}
            minSize={30}
            id="playground"
            className="overflow-y-auto bg-white rounded-t-lg"
          >
            <ResizablePanelGroup direction="vertical" className="h-full">
              <ResizablePanel defaultSize={60} minSize={40} className="bg-white">
                <RenderPGTabs
                  setLanguagePackage={(langJudge0, code) => {
                    setLanguage(langJudge0.name);
                    setCode(code);
                  }}
                />
              </ResizablePanel>

              <ResizableHandle withHandle className="h-[10px] bg-gray5" />

              <ResizablePanel id="test-cases" defaultSize={40} minSize={20} className="overflow-y-auto bg-white">
                <RenderTCTabs testCases={testCases} runCodeResult={runCodeResult} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Sidebar (Overlay) */}
      <RenderAllProblems isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 flex items-center justify-between w-full p-6 bg-white border-t h-14">
        <Button className="font-semibold text-gray3 bg-gray5 gap-x-1 hover:bg-gray4" onClick={toggleSidebar}>
          <MdList className="inline-block icon-base icon-gray3" />
          All Problems
        </Button>

        <div className="flex space-x-4">
          <Button
            className={`font-semibold text-gray3 bg-gray5 gap-x-1 hover:bg-gray4 ${isRunningCode ? "cursor-not-allowed" : ""}`}
            onClick={handleRunCode}
            disabled={isRunningCode}
          >
            {isRunningCode ? (
              <FaSpinner className="inline-block icon-sm animate-spin icon-gray3" />
            ) : (
              <FaPlay className="inline-block icon-sm icon-gray3" />
            )}
            Run Code
          </Button>

          <Button
            onClick={handleSubmitCode}
            className={`font-semibold text-white bg-appPrimary gap-x-1 hover:bg-appPrimary/80 ${
              isSubmitting ? "cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <FaSpinner className="inline-block icon-sm animate-spin icon-white" />
            ) : (
              <FaUpload className="inline-block icon-sm icon-white" />
            )}
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};
