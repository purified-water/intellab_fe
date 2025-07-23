import { useState } from "react";
import { RunCodeResponseType } from "../../types/RunCodeType";
import { EmptyList, Spinner } from "@/components/ui";

interface TestCaseResultProps {
  runCodeResult: RunCodeResponseType | null;
  isRunningCode?: boolean;
}

export const Output = ({ runCodeResult, isRunningCode }: TestCaseResultProps) => {
  // Show spinner when code is running
  if (isRunningCode) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Spinner className="w-8 h-8 mt-4" loading={true} />
        <p className="text-base text-gray3">Running your code...</p>
      </div>
    );
  }

  if (!runCodeResult) {
    return <EmptyList message="You must run the code first to see the output." size="sm" />;
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

  const renderTabs = () => {
    if (!runCodeResult || runCodeResult.testcases.length === 0) {
      return null;
    }
    return (
      <div className="flex pb-2 mb-4 overflow-x-auto gap-x-2 hover:cursor-pointer">
        {runCodeResult.testcases.map((tc, idx) => {
          const isAccepted = tc.status === "Accepted";
          const textColor = isAccepted ? "text-appEasy" : "text-appHard";

          return (
            <div
              key={idx}
              className={`py-1 px-3 font-semibold rounded-lg ${textColor} ${activeTab === idx ? `bg-gray6` : ""}`}
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
    const hasError = Boolean(
      selectedTestCase.error || (selectedTestCase.compileOutput && selectedTestCase.status !== "Accepted")
    );

    return (
      <div className="flex flex-col" key={selectedTestCase.input}>
        <div className="mb-1 text-sm">Input:</div>
        <div className="w-full max-h-[400px] overflow-y-scroll px-4 py-1 rounded-lg min-h-8 h-fit bg-gray6/80">
          <pre className="text-base whitespace-pre-wrap">{selectedTestCase.input}</pre>
        </div>

        <div className="mt-4 mb-1 text-sm">Expected Output:</div>
        <div className="w-full max-h-[200px] overflow-y-scroll px-4 py-1 rounded-lg min-h-8 bg-gray6/80">
          <pre className="text-base whitespace-pre-wrap">{selectedTestCase.expectedOutput}</pre>
        </div>

        <div className="mt-4 mb-1 text-sm">Actual Output:</div>
        <div className="w-full px-4 py-1 rounded-lg min-h-8 max-h-[200px] overflow-y-scroll bg-gray6/80">
          <pre className="text-base whitespace-pre-wrap">
            {selectedTestCase.actualOutput ? selectedTestCase.actualOutput : selectedTestCase.error || ""}
          </pre>
        </div>

        {/* Only show compile output if there's an error or compilation issue */}
        {hasError && (
          <>
            <div className="mt-4 mb-1 text-sm">Compile Output:</div>
            <div className="w-full px-4 py-1 mb-8 rounded-lg min-h-8 bg-gray6/80">
              <pre className="text-base whitespace-pre-wrap">
                {selectedTestCase.compileOutput ? selectedTestCase.compileOutput : selectedTestCase.error || ""}
              </pre>
            </div>
          </>
        )}
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
