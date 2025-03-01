import { Button } from "@/components/ui/Button";
import { TestCaseResultWithIO, TestCaseAfterSubmit } from "../../types/TestCaseType";
import { MdCheckCircleOutline, MdOutlineCancel } from "rocketicons/md";
import { ChevronRight, ChevronLeft } from "lucide-react";
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
import { SubmissionTypeNoProblem } from "../../types/SubmissionType";

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
        <div className="w-full px-4 py-1 rounded-lg bg-gray5">
          <pre className="text-base">{testCaseDetail.input}</pre>
        </div>
        <div className="mt-4 mb-1 text-sm">Expected Output:</div>
        <div className="w-full px-4 py-1 rounded-lg bg-gray5">
          <pre className="text-base">{testCaseDetail.output}</pre>
        </div>

        <div className="mt-4 mb-1 text-sm">Actual Output:</div>
        <div className="w-full px-4 py-1 rounded-lg min-h-8 bg-gray5">
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
    <div className="flex-col px-4 overflow-y-scroll">
      <div className="flex items-center my-2 cursor-pointer text-gray3 hover:text-gray2" onClick={onBack}>
        <ChevronLeft className="" />
        <div className="text-lg font-medium">Back</div>
      </div>

      <div className="text-xl font-bold text-appPrimary">All test cases</div>

      <div className="overflow-y-scroll h-96">
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
  onViewAllTestCases,
  submittedCode,
  language,
  submissionResult
}: SubmissionResultsProps) => {
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
        console.log("Test case detail", response);
        setSelectedTestCaseDetail(response);
      } catch (error) {
        console.log("Error getting test case detail", error);
      }
    };

    fetchTestCaseDetail();
  }, [selectedTestCase]);

  return (
    <div className="flex-col px-6 py-2">
      <div id="result_header" className="flex items-center justify-between">
        <div className="flex flex-row items-center gap-x-2">
          <div className={`text-center text-xl font-medium ${isPassed ? "text-appEasy" : "text-appHard"}`}>
            {isPassed ? "Accepted" : "Wrong Answer"}
          </div>
          <div className="text-sm text-center text-gray3">
            {acceptedTestCasesCount}/{totalTestCasesCount} test cases passed
          </div>
        </div>

        <Button className="font-semibold text-gray3 bg-gray5 gap-x-1 hover:bg-gray4" onClick={onViewAllTestCases}>
          All test cases
        </Button>
      </div>

      {!isPassed ? (
        <div className="test-case-content">
          <div className="flex flex-col mb-2" key={selectedTestCaseDetail?.testcaseId}>
            <div className="mb-1 text-sm">Input:</div>
            <div className="w-full px-4 py-1 rounded-lg bg-gray5">
              <pre className="text-base">{selectedTestCaseDetail?.input}</pre>
            </div>

            <div className="mt-4 mb-1 text-sm">Expected Output:</div>
            <div className="w-full px-4 py-1 rounded-lg bg-gray5">
              <pre className="text-base">{selectedTestCaseDetail?.output}</pre>
            </div>

            <div className="mt-4 mb-1 text-sm">Actual Output:</div>
            <div className="w-full px-4 py-1 rounded-lg min-h-8 bg-gray5">
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
            <div className="w-full px-4 py-1 rounded-lg bg-gray5">
              <pre className="text-base">
                {selectedTestCaseDetail?.submitOutputs &&
                  selectedTestCaseDetail.submitOutputs[selectedTestCaseDetail.submitOutputs.length - 1].runtime * 1000}
                ms
              </pre>
            </div>
            {/* MISSING MEMORY */}
            <div className="mt-4 mb-1 text-sm">Memory =</div>
            <div className="w-full px-4 py-1 rounded-lg bg-gray5">
              <pre className="text-base">
                {(
                  selectedTestCaseDetail?.submitOutputs &&
                  selectedTestCaseDetail.submitOutputs[selectedTestCaseDetail.submitOutputs.length - 1].memory / 1000
                )?.toFixed(0)}
                KB
              </pre>
            </div>

            <div className="mt-4 mb-1 text-sm">Code | {language}</div>
            <div className="w-full px-4 py-2 overflow-x-auto rounded-lg bg-gray5">
              <pre className="text-base whitespace-pre-wrap">{submittedCode}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const SubmissionInformation = ({ isPassed, historyInformation, onBack }: SubmissionInformationProps) => {
  const [currentPanel, setCurrentPanel] = useState<string>("result");
  const [selectedTestCaseDetail, setSelectedTestCaseDetail] = useState<TestCaseResultWithIO | null>(null);
  const [codeInformation, setCodeInformation] = useState<{ code: string; language: string }>({
    code: "",
    language: ""
  });
  const [submissionResult, setSubmissionResult] = useState<SubmissionTypeNoProblem | null>(null);
  const [testCases, setTestCases] = useState<TestCaseAfterSubmit[]>([]);
  const { problemId } = useParams<{ problemId: string }>(); // Get the problemId from the URL

  const savedCodeData = useSelector((state: { userCode: UserCodeState }) => selectCodeByProblemId(state, problemId!)); // Retrieve saved code
  const submissionResultFromRedux = useSelector((state: RootState) => state.submission.submissions[problemId!]);

  useEffect(() => {
    // If theres no history, which is recently submitted code, get the code from the store
    const initializeData = async () => {
      if (historyInformation) {
        // console.log("History information", historyInformation);
        // console.log("Test cases", historyInformation.testCasesOutput);
        setSubmissionResult(historyInformation);
        setTestCases(historyInformation.testCasesOutput);
        setCodeInformation({ code: historyInformation.code, language: historyInformation.programmingLanguage });
      } else if (problemId) {
        if (submissionResultFromRedux && savedCodeData) {
          setSubmissionResult(submissionResultFromRedux);
          setTestCases(submissionResultFromRedux.testCasesOutput);
          setCodeInformation({ code: savedCodeData.code, language: savedCodeData.language });
        }
      }
    };

    initializeData();
  }, [historyInformation, problemId]);

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
          {historyInformation && (
            <div className="flex items-center mx-4 my-2 cursor-pointer text-gray3 hover:text-gray2" onClick={onBack}>
              <ChevronLeft className="" />
              <div className="text-lg font-medium">Back</div>
            </div>
          )}
          <SubmissionResults
            isPassed={isPassed}
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
