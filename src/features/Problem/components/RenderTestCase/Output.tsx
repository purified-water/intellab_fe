import { useState } from "react";
import { RunCodeResponseType } from "../../types/RunCodeType";

interface TestCaseResultProps {
  runCodeResult: RunCodeResponseType | null;
}

export const Output = ({ runCodeResult }: TestCaseResultProps) => {
  if (!runCodeResult) {
    return (
      <div className="flex items-center justify-center h-full pt-8 text-gray3">
        <div>You must run your code first</div>
      </div>
    );
  }

  const allPassed = runCodeResult.testcases.every((tc) => tc.status === "Accepted");
  const passedCount = runCodeResult.testcases.filter((tc) => tc.status === "Accepted").length;

  const [activeTab, setActiveTab] = useState(0); // Track the active tab

  const renderResultHeader = () => {
    if (!runCodeResult || runCodeResult.testcases.length === 0) {
      return null;
    }
    return (
      <div className="my-4">
        <div className={`text-lg font-semibold ${allPassed ? "text-appEasy" : "text-appHard"}`}>
          {allPassed ? "All test cases passed!" : "Test cases failed!"}
        </div>
        <div className="text-sm text-gray3">
          {passedCount}/{runCodeResult.testcases.length} test cases passed
        </div>
      </div>
    );
  };
  // console.log("testCases in Testcases", testCases);
  const renderTabs = () => {
    if (!runCodeResult || runCodeResult.testcases.length === 0) {
      return null;
    }
    return (
      <div className="flex mb-4 gap-x-2 hover:cursor-pointer">
        {runCodeResult.testcases.map((tc, idx) => {
          const isAccepted = tc.status === "Accepted";
          const textColor = isAccepted ? "text-appEasy" : "text-appHard";

          return (
            <div
              key={idx}
              className={`py-1 px-3 font-semibold rounded-lg ${textColor} ${activeTab === idx ? `bg-gray5` : ""}`}
              onClick={() => setActiveTab(idx)} // Set active tab on click
            >
              Case {idx + 1}
            </div>
          );
        })}
      </div>
    );
  };

  const renderTestCaseContent = () => {
    if (!runCodeResult) return;

    const selectedTestCase = runCodeResult.testcases[activeTab];

    return (
      <div className="flex flex-col" key={selectedTestCase.input}>
        <div className="mb-1 text-sm">Input:</div>
        <div className="w-full px-4 py-1 rounded-lg min-h-8 h-fit bg-gray5">
          <pre className="text-base">{selectedTestCase.input}</pre>
        </div>

        <div className="mt-4 mb-1 text-sm">Expected Output:</div>
        <div className="w-full px-4 py-1 rounded-lg min-h-8 bg-gray5">
          <pre className="text-base">{selectedTestCase.expectedOutput}</pre>
        </div>

        <div className="mt-4 mb-1 text-sm">Actual Output:</div>
        <div className="w-full px-4 py-1 mb-8 rounded-lg min-h-8 bg-gray5">
          <pre className="text-base">
            {selectedTestCase.actualOutput ? selectedTestCase.actualOutput : selectedTestCase.error}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full mx-4">
      {renderResultHeader()}
      {renderTabs()}
      {renderTestCaseContent()}
    </div>
  );
};
