import { useEffect, useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup, Button } from "@/components/ui";
import {
  RenderDescTabs,
  RenderPGTabs,
  RenderTCTabs,
  RenderAllProblems,
  RenderAIAssistant,
  LockProblemOverlay
} from "../components";
import { MdList } from "rocketicons/md";
import { HiOutlineSparkles } from "rocketicons/hi2";
import { FaPlay, FaSpinner, FaUpload } from "rocketicons/fa6";
import { useParams } from "react-router-dom";
import { problemAPI } from "@/lib/api/problemApi";
import { ProblemType } from "@/types/ProblemType";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { TestCaseType } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { CommentContext } from "@/hooks";
import { AxiosError } from "axios";
import { useCodeSubmission } from "../hooks/useCodeSubmission";
import { useCodeRunner } from "../hooks/useCodeRunner";
import { showToastError } from "@/utils";
import { userAPI } from "@/lib/api";
import { setPoint } from "@/redux/user/userSlice";
import { useDispatch } from "react-redux";

export const ProblemDetail = () => {
  // #region State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [problemDetail, setProblemDetail] = useState<ProblemType | null>(null);
  const [testCases, setTestCases] = useState<TestCaseType[]>([]);
  const { problemId } = useParams<{ problemId: string }>();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  const courseName = searchParams.get("courseName");
  const lessonId = searchParams.get("lessonId");
  const lessonName = searchParams.get("lessonName");
  const learningId = searchParams.get("learningId");
  const { toast } = useToast();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // Lock problem
  const [isPublished, setIsPublished] = useState(true);

  // For comment redirection
  const redirectedCommentId = searchParams.get("commentId");
  // #endregion

  // Custom hooks
  const { isRunningCode, runCodeResult, handleRunCode } = useCodeRunner({
    code,
    language,
    problemId
  });

  const { isSubmitting, isSubmissionPassed, handleSubmitCode } = useCodeSubmission({
    code,
    language,
    problemId,
    learningId,
    courseId
  });

  // #region Fetch problem detail
  const fetchProblemDetail = async () => {
    try {
      const problemDetail = await problemAPI.getProblemDetail(problemId!);
      if (problemDetail) {
        setProblemDetail(problemDetail);
        document.title = `${problemDetail.problemName} | Intellab`;
        setTestCases(problemDetail.testCases.slice(0, 3));
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 403) {
        setIsPublished(false);
        return;
      }
      showToastError({ toast: toast, message: "Failed to fetch problem detail" });
    }
  };
  // #endregion

  const getMyPointAPI = async () => {
    await userAPI.getMyPoint({
      onSuccess: async (point) => {
        dispatch(setPoint(point));
      },
      onFail: async (message) => showToastError({ toast: toast, message })
    });
  };

  useEffect(() => {
    //NOTE: I don't know why the passing problemId if it null then its value is "null" instead of null
    if (problemId != null && problemId !== "null") {
      fetchProblemDetail();
    }
  }, [problemId, redirectedCommentId]);

  useEffect(() => {
    if (isSubmissionPassed) {
      getMyPointAPI();
    }
  }, [isSubmissionPassed]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isPublished === false) {
    return <LockProblemOverlay />;
  }
  // #region Render
  return (
    <CommentContext.Provider value={{ commentId: redirectedCommentId || "" }}>
      <div className="flex flex-col h-[calc(100vh-60px)] p-2 bg-gray6/50">
        <div className="flex-grow overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="w-full h-full pb-10 mb-12">
            <ResizablePanel
              order={1}
              defaultSize={isAIAssistantOpen ? 30 : 40}
              minSize={10}
              id="description"
              className="bg-white rounded-t-lg"
            >
              <RenderDescTabs
                problemDetail={problemDetail}
                courseId={courseId}
                courseName={courseName}
                lessonId={lessonId}
                lessonName={lessonName}
                isPassed={isSubmissionPassed}
              />
            </ResizablePanel>

            <ResizableHandle withHandle className="w-2 bg-gray6/50" />

            {/* Middle Panel: Playground and test case */}
            <ResizablePanel
              order={2}
              defaultSize={isAIAssistantOpen ? 50 : 60}
              minSize={30}
              id="playground"
              className="overflow-y-auto bg-white rounded-t-lg"
            >
              <ResizablePanelGroup direction="vertical" className="h-full">
                <ResizablePanel order={3} defaultSize={60} minSize={40} className="bg-white">
                  <RenderPGTabs
                    setLanguagePackage={(langJudge0, code) => {
                      setLanguage(langJudge0.name);
                      setCode(code);
                    }}
                  />
                </ResizablePanel>

                <ResizableHandle withHandle className="h-[10px] bg-gray5" />

                <ResizablePanel
                  order={4}
                  id="test-cases"
                  defaultSize={40}
                  minSize={20}
                  className="overflow-y-auto bg-white"
                >
                  <RenderTCTabs testCases={testCases} runCodeResult={runCodeResult} />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>

            {isAIAssistantOpen && <ResizableHandle withHandle className="w-2 bg-gray5" />}

            {/* Right Panel: AI Assistant */}
            {isAIAssistantOpen && (
              <ResizablePanel
                order={5}
                defaultSize={20}
                minSize={20}
                id="ai-assistant"
                className="overflow-y-auto bg-white rounded-t-lg"
              >
                <RenderAIAssistant
                  isAIAssistantOpen={true}
                  setIsAIAssistantOpen={setIsAIAssistantOpen}
                  problem={problemDetail}
                />
              </ResizablePanel>
            )}
          </ResizablePanelGroup>
        </div>

        {/* Sidebar (Overlay) */}
        <RenderAllProblems isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Bottom bar */}
        <div className="fixed bottom-0 left-0 flex items-center justify-between w-full p-6 bg-white border-t h-14">
          <div className="flex space-x-2">
            <Button
              type="button"
              className="font-semibold text-gray3 bg-gray5 gap-x-1 hover:bg-gray4"
              onClick={toggleSidebar}
            >
              <MdList className="inline-block icon-base icon-gray3" />
              All Problems
            </Button>

            {isAuthenticated && (
              <Button
                className={`flex items-center justify-center p-4 ml-2 text-white rounded-lg shadow-sm [&_svg]:size-5 ${isAIAssistantOpen ? "bg-gradient-to-tr from-appAIFrom to-appAITo  hover:opacity-80" : "bg-gray2 hover:bg-gray2/80"}`}
                onClick={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
              >
                <HiOutlineSparkles className="inline-block w-4 h-4 icon-white" />
                Ask AI
              </Button>
            )}
          </div>

          <div className="flex space-x-2">
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
              Run
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
    </CommentContext.Provider>
  );
};
// #endregion
