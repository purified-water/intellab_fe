import { Button } from "@/components/ui/Button";
import { TestCaseResultWithIO, TestCaseAfterSubmit } from "../../types/TestCaseType";
import { MdCheckCircleOutline, MdOutlineCancel } from "rocketicons/md";
import { ChevronRight, ChevronLeft, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import {
  ViewTestCaseDetailProps,
  ViewAllTestCaseResultListProps,
  SubmissionResultsProps,
  SubmissionInformationProps
} from "../../types/SubmissionInformationType";
import { useSelector } from "react-redux";
import { selectCodeByProblemId } from "@/redux/problem/problemSlice";
import { useParams } from "react-router-dom";
import { UserCodeState } from "@/redux/problem/problemType";
import { RootState } from "@/redux/rootReducer";
import { problemAPI } from "@/lib/api";
import { SubmissionTypeNoProblem, MOSSResult } from "../../types/SubmissionType";
import { MOSSResultComponent } from "./MOSSResult";

// Mock data generator for MOSS results - remove when API is ready
const generateMockMOSSResult = (submissionId: string): MOSSResult => {
  const random = Math.random();
  const similarityScore = Math.floor(random * 100);

  const mockMatches = [
    {
      matchId: "match-1",
      submissionId: "sub-456",
      studentName: "Alice Johnson",
      studentId: "ST001",
      similarityPercentage: 85,
      matchedLines: 42,
      totalLines: 50,
      codeSnippet: `function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}`
    },
    {
      matchId: "match-2",
      submissionId: "sub-789",
      studentName: "Bob Smith",
      studentId: "ST002",
      similarityPercentage: 67,
      matchedLines: 33,
      totalLines: 50
    },
    {
      matchId: "match-3",
      submissionId: "sub-101",
      studentName: "Carol Davis",
      studentId: "ST003",
      similarityPercentage: 52,
      matchedLines: 26,
      totalLines: 50
    }
  ];

  return {
    analysisId: `analysis-${submissionId}`,
    similarityScore,
    status: similarityScore > 70 ? "flagged" : "analyzed",
    reportUrl: `https://moss.stanford.edu/results/${submissionId}`,
    analyzedAt: new Date().toISOString(),
    matches: similarityScore > 30 ? mockMatches.slice(0, Math.ceil(similarityScore / 30)) : [],
    threshold: 50
  };
};

const ViewTestCaseDetail = ({ testCaseDetail, onBack }: ViewTestCaseDetailProps) => {
  if (!testCaseDetail) return;
  return (
    <div className="flex-col px-4">
      <div className="flex items-center my-2 cursor-pointer text-gray3 hover:text-gray2" onClick={onBack}>
        <ChevronLeft />
        <div className="text-lg font-medium">Back</div>
      </div>
      <div className="flex flex-col mb-2" key={testCaseDetail.testcaseId}>
        <div className="mb-1 text-sm">Input:</div>
        <div className="w-full px-4 py-1 rounded-lg bg-gray6">
          <pre className="text-base">{testCaseDetail.input}</pre>
        </div>
        <div className="mt-4 mb-1 text-sm">Expected Output:</div>
        <div className="w-full px-4 py-1 rounded-lg bg-gray6">
          <pre className="text-base">{testCaseDetail.output}</pre>
        </div>

        <div className="mt-4 mb-1 text-sm">Actual Output:</div>
        <div className="w-full px-4 py-1 rounded-lg min-h-8 bg-gray6">
          <pre className="text-base">
            {testCaseDetail?.submitOutputs[testCaseDetail.submitOutputs.length - 1].submission_output}
          </pre>
        </div>
      </div>
    </div>
  );
};

const ViewAllTestCaseResultList = ({ testCases, onTestCaseClick, onBack }: ViewAllTestCaseResultListProps) => {
  return (
    <div className="flex-col px-4">
      <div className="flex items-center mt-2 mb-4 cursor-pointer text-gray3 hover:text-gray2" onClick={onBack}>
        <ChevronLeft className="" />
        <div className="text-lg font-medium">Back</div>
      </div>

      <div className="text-xl font-bold text-appPrimary">All test cases</div>

      <div className="overflow-y-scroll scrollbar-hide h-[480px]">
        {testCases.map((testCase, index) => (
          <div
            className={`flex justify-between items-center cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-gray6"}`}
            key={testCase.testCaseOutputID.testcaseId}
            onClick={() => onTestCaseClick(testCase)}
          >
            <div className="flex items-center px-2 py-2 gap-x-2">
              {testCase.result_status === "Accepted" ? (
                <MdCheckCircleOutline className="icon-appEasy" />
              ) : (
                <MdOutlineCancel className="icon-appHard" />
              )}
              <div className={`font-medium ${testCase.result_status === "Accepted" ? "text-appEasy" : "text-appHard"}`}>
                Test case {index + 1}
              </div>
            </div>
            <ChevronRight className="text-gray3" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const SubmissionResults = ({
  isPassed,
  viewingPage = false,
  onViewAllTestCases,
  submittedCode,
  language,
  submissionResult
}: SubmissionResultsProps) => {
  const { problemId } = useParams<{ problemId: string }>();
  const testCases = submissionResult.testCasesOutput as TestCaseAfterSubmit[];
  const totalTestCasesCount = testCases.length;
  const acceptedTestCasesCount = testCases.filter((testCase) => testCase.result_status === "Accepted").length;

  const firstFailedTestCase = testCases.find(
    // One test case may have many submission outputs, so we get the last submission output to check the result status
    (testCase) => testCase.result_status !== "Accepted"
  );
  const selectedTestCase = firstFailedTestCase || submissionResult.testCasesOutput[0];

  const [selectedTestCaseDetail, setSelectedTestCaseDetail] = useState<TestCaseResultWithIO | null>(null);

  useEffect(() => {
    const fetchTestCaseDetail = async () => {
      try {
        const response = await problemAPI.getTestCaseDetail(selectedTestCase.testCaseOutputID.testcaseId);
        setSelectedTestCaseDetail(response);
      } catch (error) {
        console.log("Error getting test case detail", error);
      }
    };

    fetchTestCaseDetail();
  }, [selectedTestCase]);

  const handleViewMOSSReport = () => {
    if (submissionResult.mossResult?.reportUrl) {
      window.open(submissionResult.mossResult.reportUrl, "_blank");
    }
  };

  const handleViewDetailedReport = () => {
    // Navigate to the new submission detail page
    window.open(`/problems/${problemId}/submission/${submissionResult.submissionId}`, "_blank");
  };

  return (
    <div className="flex-col px-6 py-2">
      <div id="result_header" className="flex items-center justify-between">
        <div className="flex flex-row items-end gap-x-2">
          <div className={`text-center text-xl font-medium ${isPassed ? "text-appEasy" : "text-appHard"}`}>
            {isPassed ? "Accepted" : "Wrong Answer"}
          </div>
          <div className="text-sm text-center text-gray3">
            {acceptedTestCasesCount}/{totalTestCasesCount} test cases passed
          </div>
        </div>

        <Button type="button" variant="default" onClick={onViewAllTestCases}>
          All test cases
        </Button>
      </div>

      {/* MOSS Results Section */}
      {submissionResult.mossResult && (
        <div className="mt-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Plagiarism Detection</h3>
            {!viewingPage && (
              <Button variant="outline" onClick={handleViewDetailedReport}>
                <ExternalLink className="w-4 h-4 mr-2" />
                View Full Detail
              </Button>
            )}
          </div>
          <MOSSResultComponent mossResult={submissionResult.mossResult} onViewFullReport={handleViewMOSSReport} />
        </div>
      )}

      {!isPassed ? (
        <div className="test-case-content">
          <div className="flex flex-col mb-2" key={selectedTestCaseDetail?.testcaseId}>
            <div className="mb-1 text-sm">Input:</div>
            <div className="w-full px-4 py-1 rounded-lg bg-gray6">
              <pre className="text-base">{selectedTestCaseDetail?.input}</pre>
            </div>

            <div className="mt-4 mb-1 text-sm">Expected Output:</div>
            <div className="w-full px-4 py-1 rounded-lg bg-gray6">
              <pre className="text-base">{selectedTestCaseDetail?.output}</pre>
            </div>

            <div className="mt-4 mb-1 text-sm">Actual Output:</div>
            <div className="w-full px-4 py-1 rounded-lg min-h-8 bg-gray6">
              <pre className="text-base">
                {
                  selectedTestCaseDetail?.submitOutputs[selectedTestCaseDetail.submitOutputs.length - 1]
                    .submission_output
                }
              </pre>
            </div>
          </div>
        </div>
      ) : (
        <div className="test-case-content">
          <div className="flex flex-col mb-2">
            <div className="mb-1 text-sm">Run time =</div>
            <div className="w-full px-4 py-1 rounded-lg bg-gray6">
              <pre className="text-base">
                {selectedTestCaseDetail?.submitOutputs &&
                  selectedTestCaseDetail.submitOutputs[selectedTestCaseDetail.submitOutputs.length - 1].runtime * 1000}
                ms
              </pre>
            </div>
            {/* MISSING MEMORY */}
            <div className="mt-4 mb-1 text-sm">Memory =</div>
            <div className="w-full px-4 py-1 rounded-lg bg-gray6">
              <pre className="text-base">
                {(
                  selectedTestCaseDetail?.submitOutputs &&
                  selectedTestCaseDetail.submitOutputs[selectedTestCaseDetail.submitOutputs.length - 1].memory / 1000
                )?.toFixed(0)}
                KB
              </pre>
            </div>

            <div className="mt-4 mb-1 text-sm">Code | {language}</div>
            <div className="w-full px-4 py-2 overflow-x-auto rounded-lg bg-gray6">
              <pre className="text-base whitespace-pre-wrap">{submittedCode}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const SubmissionInformation = ({
  isPassed,
  historyInformation,
  onBack,
  viewingPage = false
}: SubmissionInformationProps) => {
  const [currentPanel, setCurrentPanel] = useState<string>("result");
  const [selectedTestCaseDetail, setSelectedTestCaseDetail] = useState<TestCaseResultWithIO | null>(null);
  const [codeInformation, setCodeInformation] = useState<{ code: string; language: string }>({
    code: "",
    language: ""
  });
  const [submissionResult, setSubmissionResult] = useState<SubmissionTypeNoProblem | null>(null);
  const [testCases, setTestCases] = useState<TestCaseAfterSubmit[]>([]);
  const { problemId } = useParams<{ problemId: string }>();
  const createProblemFromRedux = useSelector((state: RootState) => state.createProblem);

  // problemId: submit in ProblemDetailPage
  // createProblemFromRedux.problemId: submit in CreateProblemSolutionPage
  const actualProblemId = problemId || createProblemFromRedux.problemId;

  const savedCodeData = useSelector((state: { userCode: UserCodeState }) =>
    selectCodeByProblemId(state, actualProblemId!)
  ); // Retrieve saved code
  const submissionResultFromRedux = useSelector((state: RootState) => state.submission.submissions[actualProblemId!]);
  useEffect(() => {
    // If theres no history, which is recently submitted code, get the code from the store
    const initializeData = async () => {
      if (historyInformation) {
        // Add mock MOSS result if not present (for demo purposes)
        const submissionWithMOSS = {
          ...historyInformation,
          mossResult: historyInformation.mossResult || generateMockMOSSResult(historyInformation.submissionId)
        };
        setSubmissionResult(submissionWithMOSS);
        setTestCases(submissionWithMOSS.testCasesOutput);
        setCodeInformation({ code: submissionWithMOSS.code, language: submissionWithMOSS.programmingLanguage });
      } else if (actualProblemId) {
        if (submissionResultFromRedux && savedCodeData) {
          // Add mock MOSS result if not present (for demo purposes)
          const submissionWithMOSS = {
            ...submissionResultFromRedux,
            mossResult:
              submissionResultFromRedux.mossResult || generateMockMOSSResult(submissionResultFromRedux.submissionId)
          };
          setSubmissionResult(submissionWithMOSS);
          setTestCases(submissionWithMOSS.testCasesOutput);
          setCodeInformation({ code: savedCodeData.code, language: savedCodeData.language });
        }
      }
    };

    initializeData();
  }, [historyInformation, actualProblemId]);

  const handleViewAllTestCases = () => setCurrentPanel("allTestCases");

  const handleViewTestCaseDetail = async (testCase: TestCaseAfterSubmit) => {
    // Get test case detail
    try {
      const response = await problemAPI.getTestCaseDetail(testCase.testCaseOutputID.testcaseId);
      setSelectedTestCaseDetail(response);
    } catch (error) {
      console.log("Error in getting test case detail", error);
    }
    setCurrentPanel("testCaseDetail");
  };

  const handleBack = () => {
    if (currentPanel === "testCaseDetail") {
      setCurrentPanel("allTestCases");
    } else {
      setCurrentPanel("result");
    }
  };

  return (
    <div>
      {currentPanel === "result" && submissionResult && (
        <>
          {!viewingPage && historyInformation && (
            <div className="flex items-center mx-4 my-2 cursor-pointer text-gray3 hover:text-gray2" onClick={onBack}>
              <ChevronLeft className="" />
              <div className="text-lg font-medium">Back</div>
            </div>
          )}
          <SubmissionResults
            isPassed={isPassed}
            viewingPage={viewingPage}
            onViewAllTestCases={handleViewAllTestCases}
            submittedCode={codeInformation.code}
            language={codeInformation.language}
            submissionResult={submissionResult}
          />
        </>
      )}
      {currentPanel === "allTestCases" && (
        <ViewAllTestCaseResultList
          testCases={testCases}
          onTestCaseClick={handleViewTestCaseDetail}
          onBack={handleBack}
        />
      )}
      {currentPanel === "testCaseDetail" && selectedTestCaseDetail && (
        <ViewTestCaseDetail testCaseDetail={selectedTestCaseDetail} onBack={handleBack} />
      )}
    </div>
  );
};
