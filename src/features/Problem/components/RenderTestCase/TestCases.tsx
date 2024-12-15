import { useState } from "react";

export const TestCases = () => {
  const testcases = [
    {
      a: "1",
      b: "3",
      output: "3"
    },
    {
      input: "2 3",
      output: "5"
    }
  ];

  const [activeTab, setActiveTab] = useState(0); // Track the active tab

  const renderTabs = () => {
    return (
      <div className="flex mb-4 gap-x-2 text-gray3 hover:cursor-pointer">
        {testcases.map((_tc, idx) => (
          <div
            key={idx}
            className={`py-1 px-3 font-semibold rounded-lg ${activeTab === idx ? "bg-gray5 text-gray2" : ""}`}
            onClick={() => setActiveTab(idx)} // Set active tab on click
          >
            Case {idx + 1}
          </div>
        ))}
      </div>
    );
  };

  const renderTestCaseContent = () => {
    const selectedTestCase = testcases[activeTab];
    return (
      <div className="test-case-content">
        {Object.entries(selectedTestCase).map(([key, value], idx) => (
          <div className="flex flex-col mb-2" key={idx}>
            <div className="mb-1 text-sm">{key} =</div>
            <div className="w-full px-4 py-1 rounded-lg bg-gray5">{value}</div>
          </div>
        ))}
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
