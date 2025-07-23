import { useState } from "react";
import { TestCaseType } from "../../types/TestCaseType";

interface TestCasesProps {
  testCases: TestCaseType[];
}

export const TestCases = ({ testCases }: TestCasesProps) => {
  const [activeTab, setActiveTab] = useState(0); // Track the active tab

  const renderTabs = () => {
    return (
      <div className="flex pb-2 mb-4 overflow-x-auto gap-x-2 text-gray3">
        {testCases.map((_tc, idx) => (
          <div
            key={idx}
            className={`py-1 px-3 font-semibold cursor-pointer rounded-lg ${activeTab === idx ? "bg-gray6 text-gray2 shrink-0" : "shrink-0"}`}
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

    return (
      <div className="test-case-content">
        <div className="flex flex-col mb-2" key={selectedTestCase.testCaseId}>
          <div className="mb-1 text-sm">Input:</div>
          <div className="w-full px-4 py-1 rounded-lg bg-gray6/80 min-h-8 max-h-[400px] overflow-y-scroll">
            <pre className="text-base whitespace-pre-wrap">{selectedTestCase.input}</pre>
          </div>
          <div className="mt-4 mb-1 text-sm">Output:</div>
          <div className="w-full px-4 py-1 rounded-lg bg-gray6/80 min-h-8 max-h-[200px] overflow-y-scroll">
            <pre className="text-base whitespace-pre-wrap">{selectedTestCase.output}</pre>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full m-4 mb-8">
      {renderTabs()}
      {renderTestCaseContent()}
    </div>
  );
};
