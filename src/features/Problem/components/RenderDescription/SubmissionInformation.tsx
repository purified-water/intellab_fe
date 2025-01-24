import { Button } from "@/components/ui/Button";
import { TestCaseOutputType } from "../../types/TestCaseType";
import { MdCheckCircleOutline } from "rocketicons/md";
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

const testCases: TestCaseOutputType[] = [
  {
    testcaseId: "93cfd193-1620-4e60-8c84-983041d205f0",
    input: "0 1 0",
    output: "1",
    order: 1,
    userId: null,
    submitOutputs: [
      {
        testCaseOutputID: {
          submission_id: "9edcc8ef-3450-428f-9dfb-ff827a95d530",
          testcase_id: "93cfd193-1620-4e60-8c84-983041d205f0"
        },
        token: "d08a4e51-46c5-4c78-87c5-3f400abb28d0",
        runtime: 0,
        submission_output: "null",
        result_status: "In Queue"
      },
      {
        testCaseOutputID: {
          submission_id: "02274f3d-7f85-4ae9-8d3d-d80a7a52acb7",
          testcase_id: "93cfd193-1620-4e60-8c84-983041d205f0"
        },
        token: "66768d78-5f11-493b-9991-49fdc0e1275a",
        runtime: 0,
        submission_output: "null",
        result_status: "In Queue"
      }
    ]
  },
  {
    testcaseId: "fad6d724-b8ce-4b6b-a1fb-f5a1e8b7e003",
    input: "1",
    output: "1",
    order: 2,
    userId: null,
    submitOutputs: [
      {
        testCaseOutputID: {
          submission_id: "9edcc8ef-3450-428f-9dfb-ff827a95d530",
          testcase_id: "fad6d724-b8ce-4b6b-a1fb-f5a1e8b7e003"
        },
        token: "d49298ea-bfab-4ed1-8e20-0ce056e51462",
        runtime: 0,
        submission_output: "null",
        result_status: "In Queue"
      },
      {
        testCaseOutputID: {
          submission_id: "02274f3d-7f85-4ae9-8d3d-d80a7a52acb7",
          testcase_id: "fad6d724-b8ce-4b6b-a1fb-f5a1e8b7e003"
        },
        token: "52768e51-dec1-4c76-9e73-81a8cad38bca",
        runtime: 0,
        submission_output: "null",
        result_status: "In Queue"
      }
    ]
  },
  {
    testcaseId: "f8e22dda-b2cf-473e-b10f-ca1069fd5630",
    input: "4 1 2 1 2",
    output: "4",
    order: 3,
    userId: null,
    submitOutputs: [
      {
        testCaseOutputID: {
          submission_id: "9edcc8ef-3450-428f-9dfb-ff827a95d530",
          testcase_id: "f8e22dda-b2cf-473e-b10f-ca1069fd5630"
        },
        token: "cd77436b-af8d-4db0-9f56-96af7856d604",
        runtime: 0,
        submission_output: "null",
        result_status: "In Queue"
      },
      {
        testCaseOutputID: {
          submission_id: "02274f3d-7f85-4ae9-8d3d-d80a7a52acb7",
          testcase_id: "f8e22dda-b2cf-473e-b10f-ca1069fd5630"
        },
        token: "a5069122-fcd4-4ab3-9e81-da4ecdfc66e2",
        runtime: 0,
        submission_output: "null",
        result_status: "In Queue"
      }
    ]
  },
  {
    testcaseId: "4343cfa0-4508-4157-b986-23e04fc60069",
    input: "3 3 7 8 8",
    output: "7",
    order: 4,
    userId: null,
    submitOutputs: [
      {
        testCaseOutputID: {
          submission_id: "9edcc8ef-3450-428f-9dfb-ff827a95d530",
          testcase_id: "4343cfa0-4508-4157-b986-23e04fc60069"
        },
        token: "03db5044-548b-4bd2-81ae-c31ebf27142e",
        runtime: 0,
        submission_output: "null",
        result_status: "In Queue"
      },
      {
        testCaseOutputID: {
          submission_id: "02274f3d-7f85-4ae9-8d3d-d80a7a52acb7",
          testcase_id: "4343cfa0-4508-4157-b986-23e04fc60069"
        },
        token: "7d703b0d-970f-4bec-8b39-fadd40c27d59",
        runtime: 0,
        submission_output: "null",
        result_status: "In Queue"
      }
    ]
  },
  {
    testcaseId: "e15bef99-a6dd-46a1-bbb0-af5ed9d06e09",
    input: "2 2 1",
    output: "1",
    order: 5,
    userId: null,
    submitOutputs: [
      {
        testCaseOutputID: {
          submission_id: "9edcc8ef-3450-428f-9dfb-ff827a95d530",
          testcase_id: "e15bef99-a6dd-46a1-bbb0-af5ed9d06e09"
        },
        token: "2c2fd40e-409b-4288-a5a7-7e3dc178ae3c",
        runtime: 0,
        submission_output: "null",
        result_status: "In Queue"
      },
      {
        testCaseOutputID: {
          submission_id: "02274f3d-7f85-4ae9-8d3d-d80a7a52acb7",
          testcase_id: "e15bef99-a6dd-46a1-bbb0-af5ed9d06e09"
        },
        token: "504ad583-3c5f-4ae5-afc8-02eeed867524",
        runtime: 0,
        submission_output: "null",
        result_status: "In Queue"
      }
    ]
  }
];

const selectedTestCase = testCases[0];

const ViewTestCaseDetail = ({ testCase, onBack }: ViewTestCaseDetailProps) => {
  return (
    <div className="flex-col px-4">
      <div className="flex items-center my-2 cursor-pointer text-gray3" onClick={onBack}>
        <ChevronLeft />
        <div className="text-lg">Back</div>
      </div>
      <div className="flex flex-col mb-2" key={testCase.testcaseId}>
        <div className="mb-1 text-sm">Inputs =</div>
        <div className="w-full px-4 py-1 rounded-lg bg-gray5">
          <pre className="text-base">{testCase.input}</pre>
        </div>
        <div className="mt-4 mb-1 text-sm">Outputs =</div>
        <div className="w-full px-4 py-1 rounded-lg bg-gray5">
          <pre className="text-base">{testCase.output}</pre>
        </div>
      </div>
    </div>
  );
};

const ViewAllTestCaseResultList = ({ testCases, onTestCaseClick, onBack }: ViewAllTestCaseResultListProps) => {
  return (
    <div className="flex-col px-4 overflow-y-scroll">
      <div className="flex items-center my-2 cursor-pointer text-gray3" onClick={onBack}>
        <ChevronLeft className="" />
        <div className="text-lg">Back</div>
      </div>

      <div className="text-xl font-bold text-appPrimary">All test cases</div>

      <div className="overflow-y-scroll h-96">
        {testCases.map((testCase, index) => (
          <div
            className={`flex justify-between py-1 cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-gray6"}`}
            key={testCase.testcaseId}
            onClick={() => onTestCaseClick(testCase)}
          >
            <div className="flex items-center gap-x-2">
              <MdCheckCircleOutline className="icon-appEasy" />
              <div>Test case {index + 1}</div>
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
  language
}: SubmissionResultsProps) => {
  return (
    <div className="flex-col px-6 py-2">
      <div id="result_header" className="flex items-center justify-between">
        <div className="flex flex-row items-center justify-center gap-x-2">
          <div className={`text-center text-xl font-medium ${isPassed ? "text-green-500" : "text-red-500"}`}>
            {isPassed ? "Accepted" : "Wrong Answer"}
          </div>
          <div className="text-sm text-gray3">1/5 test cases passed</div>
        </div>

        <Button className="font-semibold text-gray3 bg-gray5 gap-x-1 hover:bg-gray4" onClick={onViewAllTestCases}>
          All test cases
        </Button>
      </div>

      {!isPassed ? (
        <div className="test-case-content">
          <div className="flex flex-col mb-2" key={selectedTestCase.testcaseId}>
            <div className="mb-1 text-sm">Inputs =</div>
            <div className="w-full px-4 py-1 rounded-lg bg-gray5">
              <pre className="text-base">{selectedTestCase.input}</pre>
            </div>

            <div className="mt-4 mb-1 text-sm">Expected outputs =</div>
            <div className="w-full px-4 py-1 rounded-lg bg-gray5">
              <pre className="text-base">{selectedTestCase.output}</pre>
            </div>

            <div className="mt-4 mb-1 text-sm">Outputs =</div>
            <div className="w-full px-4 py-1 rounded-lg bg-gray5">
              <pre className="text-base">{selectedTestCase.submitOutputs[0].submission_output}</pre>
            </div>
          </div>
        </div>
      ) : (
        <div className="test-case-content">
          <div className="flex flex-col mb-2">
            <div className="mb-1 text-sm">Run time =</div>
            <div className="w-full px-4 py-1 rounded-lg bg-gray5">
              <pre className="text-base">{selectedTestCase.input}</pre>
            </div>

            <div className="mt-4 mb-1 text-sm">Memory =</div>
            <div className="w-full px-4 py-1 rounded-lg bg-gray5">
              <pre className="text-base">{selectedTestCase.output}</pre>
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

export const SubmissionInformation = ({ isPassed }: SubmissionInformationProps) => {
  const [currentPanel, setCurrentPanel] = useState<string>("result");
  const [selectedTestCase, setSelectedTestCase] = useState<TestCaseOutputType | null>(null);

  const { problemId } = useParams<{ problemId: string }>(); // Get the problemId from the URL
  if (!problemId) return null;
  const savedCodeData = useSelector((state: { userCode: UserCodeState }) => selectCodeByProblemId(state, problemId!)); // Retrieve saved code
  const submissionResult = useSelector((state: RootState) => state.submission.submissions[problemId]);
  const testCases = submissionResult.testCases_output;

  console.log("Submission get from redux", submissionResult);
  const { code, language } = savedCodeData || { code: "", language: "" }; // Destructure saved code and language

  const handleViewAllTestCases = () => setCurrentPanel("allTestCases");

  const handleViewTestCaseDetail = (testCase: TestCaseOutputType) => {
    setSelectedTestCase(testCase);
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
      {currentPanel === "result" && (
        <SubmissionResults
          isPassed={isPassed}
          onViewAllTestCases={handleViewAllTestCases}
          submittedCode={code}
          language={language}
        />
      )}
      {currentPanel === "allTestCases" && (
        <ViewAllTestCaseResultList
          testCases={testCases}
          onTestCaseClick={handleViewTestCaseDetail}
          onBack={handleBack}
        />
      )}
      {currentPanel === "testCaseDetail" && selectedTestCase && (
        <ViewTestCaseDetail testCase={selectedTestCase} onBack={handleBack} />
      )}
    </div>
  );
};
