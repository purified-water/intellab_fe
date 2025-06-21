import { Button, EndOfListNotice } from "@/components/ui";
import { ChevronLeft, ChevronRight, Plus, Upload } from "lucide-react";
import { useState } from "react";
import { TestcaseItem } from "./TestcaseItem";
import { CreateTestcaseSchema } from "../../../schemas";
import { TestcaseAction } from "../../../types";
import { TestcaseUploadGuideModal } from "./TestcaseUploadGuideModal";
import { TestcaseUploadFileModal } from "./TestcaseUploadFileModal";

interface ProblemTestcaseListProps {
  testcases: CreateTestcaseSchema[];
  onSelectTestcase?: (testcaseAction: TestcaseAction) => void;
  selectedTestcaseId?: string;
}

export const ProblemTestcaseList = ({ testcases, onSelectTestcase, selectedTestcaseId }: ProblemTestcaseListProps) => {
  const dontShowUploadGuideModal = localStorage.getItem("dontShowUploadGuideModal") === "true";

  const [showList, setShowList] = useState(true);
  const [openUploadGuideModal, setOpenUploadGuideModal] = useState(false);
  const [openUploadFileModal, setOpenUploadFileModal] = useState(false);

  const toggleList = () => {
    setShowList(!showList);
  };

  const handleCloseUploadGuideModal = () => {
    setOpenUploadGuideModal(false);
    setOpenUploadFileModal(true);
  };

  const handleUploadFileModalHeaderIconClick = () => {
    setOpenUploadFileModal(false);
    setOpenUploadGuideModal(true);
  };

  const handleDontShowUploadGuideModalAgain = (dontShow: boolean) => {
    localStorage.setItem("dontShowUploadGuideModal", dontShow ? "true" : "false");
  };

  const handleUploadFileClick = () => {
    if (dontShowUploadGuideModal != undefined && dontShowUploadGuideModal) {
      setOpenUploadFileModal(true);
    } else {
      setOpenUploadGuideModal(true);
    }
  };

  return (
    <div className={`max-w-sm p-4 bg-white ${showList ? "w-64" : "size-18"}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-semibold ${showList ? "block" : "hidden"}`}>Test Case List</h2>
        <Button type="button" variant="ghost" size="icon" onClick={toggleList}>
          {showList ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </Button>
      </div>

      {showList && (
        <div className="overflow-y-scroll scrollbar-hide max-h-[400px]">
          <ul className="space-y-3">
            {testcases.map((testcase, index) => (
              <TestcaseItem
                key={testcase.testcaseId}
                testcase={testcase}
                onSelectTestcase={onSelectTestcase}
                index={index}
                selectedTestcaseId={selectedTestcaseId}
              />
            ))}
            {testcases && testcases.length !== 0 && <EndOfListNotice />}
          </ul>
        </div>
      )}

      <div className="mt-4 space-y-4 ">
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-lg"
          onClick={() => onSelectTestcase?.({ type: "create" })}
        >
          <Plus className="w-4 h-4" />
          Add New
        </Button>
        <Button type="button" className="w-full rounded-lg" onClick={handleUploadFileClick}>
          <Upload className="w-4 h-4" />
          Upload Files
        </Button>
      </div>
      <TestcaseUploadGuideModal
        isOpen={openUploadGuideModal}
        onDontShowAgain={handleDontShowUploadGuideModalAgain}
        onOkay={handleCloseUploadGuideModal}
        onCancel={() => setOpenUploadGuideModal(false)}
        dontShowUploadFileModalAgain={dontShowUploadGuideModal}
      />
      <TestcaseUploadFileModal
        open={openUploadFileModal}
        onClose={() => setOpenUploadFileModal(false)}
        onHeaderIconClick={handleUploadFileModalHeaderIconClick}
      />
    </div>
  );
};
