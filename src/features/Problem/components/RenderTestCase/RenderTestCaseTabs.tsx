import { useState } from "react";
import { TestCases } from "./TestCases";
import { BsCode } from "rocketicons/bs";
import { MdCheckBox } from "rocketicons/md";
import { Separator } from "@/components/ui/Separator";
import { TestCaseType } from "../../types/TestCaseType";

interface RenderTCTabsProps {
  testCases: TestCaseType[];
}

export const RenderTCTabs = ({ testCases }: RenderTCTabsProps) => {
  const [testCaseActive, setTestCaseActive] = useState("Testcase");

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
          <div className="flex-grow overflow-hidden">
            <TestCases testCases={testCases} />
          </div>
        );
      case "Output":
        return <div>Output':</div>;
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

// TODO sửa lỗi không lướt được cái codemirror với khi màn hình codemirror nhỏ mà xuống dòng thì nó đẩy
// cái tab button lên luôn không thấy nữa
