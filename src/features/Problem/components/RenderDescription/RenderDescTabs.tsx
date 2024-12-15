import { useState } from "react";
import { ProblemDescription } from "./ProblemDescription";

export const RenderDescTabs = () => {
  const [desActive, setDesActive] = useState("Description");

  const renderDescriptionTabButton = (tabName: string) => {
    return (
      <button
        onClick={() => setDesActive(tabName)}
        className={
          desActive === tabName
            ? "text-appAccent font-semibold text-sm md:text-base"
            : "text-gray3 font-semibold text-sm md:text-base"
        }
      >
        {tabName}
      </button>
    );
  };

  const renderDescriptionTabContent = () => {
    switch (desActive) {
      case "Description":
        return <ProblemDescription />;
      case "Comments":
        return <div>Comments</div>;
      case "Submissions":
        return <div>Submissions</div>;
      case "Hints":
        return <div>Hints</div>;
    }
  };

  return (
    <>
      <div
        id="tab-buttons"
        className="flex items-center justify-around px-2 py-3 overflow-x-scroll border-b h-18 scrollbar-hide"
      >
        {renderDescriptionTabButton("Description")}
        {renderDescriptionTabButton("Comments")}
        {renderDescriptionTabButton("Submissions")}
        {renderDescriptionTabButton("Hints")}
      </div>
      {renderDescriptionTabContent()}
    </>
  );
};
