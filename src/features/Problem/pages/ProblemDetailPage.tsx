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
import { TestCaseSubmitOutput, TestCaseType } from "../types/TestCaseType";
import { useToast } from "@/hooks/use-toast";
import { getUserIdFromLocalStorage } from "@/utils";
import { SubmissionTypeNoProblem } from "../types/SubmissionType";
import { saveCode } from "@/redux/problem/problemSlice";
import { useDispatch } from "react-redux";
import { saveSubmission } from "@/redux/problem/submissionSlice";

export const ProblemDetail = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [problemDescription, setProblemDescription] = useState("");
  const [problemDetail, setProblemDetail] = useState<ProblemType | null>(null);
  const [testCases, setTestCases] = useState<TestCaseType[]>([]);
  const { problemId } = useParams<{ problemId: string }>();
  const [code, setCode] = useState("printjdaksjdalksjdklajsd");
  const [language, setLanguage] = useState("");
  const [isSubmissionPassed, setIsSubmissionPassed] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  const courseName = searchParams.get("courseName");
  const lessonId = searchParams.get("lessonId");
  const lessonName = searchParams.get("lessonName");
  // const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const userId = getUserIdFromLocalStorage();
  const { toast } = useToast();

  const dispatch = useDispatch();

  const fetchProblemDetail = async () => {
    try {
      const problemDetail = await problemAPI.getProblemDetail(problemId!);
      console.log("problemDetail", problemDetail);

      if (problemDetail) {
        setProblemDetail(problemDetail);
        setTestCases(problemDetail.testCases);

        console.log("Test cases", testCases);
      }
    } catch (error) {
      console.error("Failed to fetch problem detail", error);
    }
  };
  const handleRunCode = async () => {
    console.log("code and language", code, language);
  };
  const handleSubmitCode = async () => {
    setIsSubmitting(true);

    try {
      if (problemId && userId) {
        dispatch(saveCode({ problemId, code, language }));

        const response = await problemAPI.createSubmission(1, code, language, problemId!);
        console.log("Submission response", response);

        if (response?.submission_id) {
          console.log("Submission ID", response.submission_id);
          pollSubmissionStatus(response.submission_id);
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
    const testCases_output = submission.testCases_output as any;
    // Save the submission result to the state
    if (!problemId) return;
    dispatch(saveSubmission({ problemId, updateResponse: submission }));
    // Check if all test cases are passed
    const isPassed = testCases_output.every((testCase: TestCaseSubmitOutput) => testCase.result_status === "Accepted");

    setIsSubmissionPassed(isPassed);
    setIsSubmitting(false);
  };

  const pollSubmissionStatus = async (submissionId: string) => {
    let elapsedTime = 0;
    const maxTimeout = 60000; // 60 seconds

    // const response = await problemAPI.getUpdateSubmission(submissionId);
    // console.log("Submission update response", response);
    const interval = setInterval(async () => {
      elapsedTime += 5000; // Increment elapsed time by 5 seconds

      try {
        const response = await problemAPI.getUpdateSubmission(submissionId);
        console.log("Submission update response", response);
        if (response) {
          const updateResponse = response;
          console.log("Submission update:", updateResponse);

          // Check if all test case results have `result_status` not equal to "null" or "In Queue"
          const allResultsAvailable = updateResponse.testCases_output.every(
            (testCase: TestCaseSubmitOutput) =>
              testCase.result_status &&
              testCase.result_status !== "In Queue" &&
              testCase.result_status !== "Progressing"
          );

          console.log("All results available:", allResultsAvailable);

          if (allResultsAvailable || elapsedTime >= maxTimeout) {
            clearInterval(interval); // Stop polling

            if (elapsedTime >= maxTimeout && !allResultsAvailable) {
              toast({
                variant: "destructive",
                description: "Submission timeout. Please try again later."
              });
            } else {
              toast({
                description: "Submission completed! Check the results."
              });

              // Handle final results
              handleSubmissionResult(updateResponse);
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
          <ResizablePanel defaultSize={40} minSize={20} id="description" className="bg-white rounded-t-lg">
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
                <RenderTCTabs testCases={testCases} />
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
          <Button className="font-semibold text-gray3 bg-gray5 gap-x-1 hover:bg-gray4" onClick={handleRunCode}>
            <FaPlay className="inline-block icon-sm icon-gray3" />
            Run Code
          </Button>

          <Button
            onClick={handleSubmitCode}
            className={`font-semibold text-appAccent bg-appFadedAccent gap-x-1 hover:bg-appFadedAccent/80 ${
              isSubmitting ? "cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <FaSpinner className="inline-block icon-sm animate-spin icon-appAccent" />
            ) : (
              <FaUpload className="inline-block icon-sm icon-appAccent" />
            )}
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};
