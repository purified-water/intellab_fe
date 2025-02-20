import { useState } from "react";
import { TestCaseType } from "../../types/TestCaseType";

interface TestCasesProps {
  testCases: TestCaseType[];
}

export const TestCases = ({ testCases }: TestCasesProps) => {
  const [activeTab, setActiveTab] = useState(0); // Track the active tab
  // console.log("testCases in Testcases", testCases);
  const renderTabs = () => {
    return (
      <div className="flex mb-4 gap-x-2 text-gray3">
        {testCases.map((_tc, idx) => (
          <div
            key={idx}
            className={`py-1 px-3 font-semibold cursor-pointer rounded-lg ${activeTab === idx ? "bg-gray5 text-gray2" : ""}`}
            onClick={() => setActiveTab(idx)} // Set active tab on click
          >
            Case {idx + 1}
          </div>
        ))}
      </div>
    );
  };

  const renderTestCaseContent = () => {
    if (!testCases || testCases.length === 0) {
      return <div>No test cases available</div>;
    }
    const selectedTestCase = testCases[activeTab];

    // console.log("selectedTestCase", selectedTestCase);

    return (
      <div className="test-case-content">
        <div className="flex flex-col mb-2" key={selectedTestCase.testCaseId}>
          <div className="mb-1 text-sm">Inputs =</div>
          <div className="w-full px-4 py-1 rounded-lg bg-gray5">
            <pre className="text-base">{selectedTestCase.input}</pre>
          </div>
          <div className="mt-4 mb-1 text-sm">Outputs =</div>
          <div className="w-full px-4 py-1 rounded-lg bg-gray5">
            <pre className="text-base">{selectedTestCase.output}</pre>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full m-4 overflow-y-auto">
      {renderTabs()}
      {renderTestCaseContent()}
    </div>
  );
};
