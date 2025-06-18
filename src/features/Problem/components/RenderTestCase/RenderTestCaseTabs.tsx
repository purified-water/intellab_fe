import { useState, useEffect } from "react";
import { TestCases } from "./TestCases";
import { BsCode } from "rocketicons/bs";
import { MdCheckBox } from "rocketicons/md";
import { Separator } from "@/components/ui/Separator";
import { TestCaseType } from "../../types/TestCaseType";
import { Output } from "./Output";
import { RunCodeResponseType } from "../../types/RunCodeType";

interface RenderTCTabsProps {
  testCases: TestCaseType[];
  runCodeResult?: RunCodeResponseType | null;
}

export const RenderTCTabs = ({ testCases, runCodeResult }: RenderTCTabsProps) => {
  const initialTab = runCodeResult ? "Output" : "Testcase";
  const [testCaseActive, setTestCaseActive] = useState(initialTab);

  useEffect(() => {
    if (runCodeResult !== null) {
      setTestCaseActive("Output");
    }
  }, [runCodeResult]);

  const renderPlaygroundTabButton = (tabName: string) => {
    const getIcon = () => {
      const iconColorClass = testCaseActive === tabName ? "icon-appAccent" : "icon-gray3";
      switch (tabName) {
        case "Testcase":
          return <MdCheckBox className={`inline-block mr-2 ${iconColorClass}`} />;
        case "Output":
          return <BsCode className={`inline-block mr-2 ${iconColorClass}`} />;
        default:
          return null;
      }
    };

    return (
      <button
        type="button"
        onClick={() => setTestCaseActive(tabName)}
        className={`flex items-center ${
          testCaseActive === tabName ? "text-appAccent font-semibold" : "text-gray3 font-semibold"
        }`}
      >
        {getIcon()}
        {tabName === "Testcase" ? "Test Case" : "Output"}
      </button>
    );
  };

  const renderTestcaseContent = () => {
    switch (testCaseActive) {
      case "Testcase":
        return (
          <div className="flex-grow">
            <TestCases testCases={testCases} />
          </div>
        );
      case "Output":
        return <Output runCodeResult={runCodeResult ?? null} />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tab Buttons */}
      <div
        id="tab-buttons"
        className="flex items-center px-4 py-2 overflow-y-hidden border-b h-18 gap-x-4 sm:overflow-x-auto scrollbar-hide shrink-0"
      >
        {renderPlaygroundTabButton("Testcase")}
        <Separator orientation="vertical" className="h-6" />
        {renderPlaygroundTabButton("Output")}
      </div>

      {/* Test case Content */}
      <div id="testcase-content" className="overflow-y-scroll">
        {renderTestcaseContent()}
      </div>
    </div>
  );
};
