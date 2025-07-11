import { useState } from "react";
import { FileText, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui";
import { QuickReferenceGuide } from "./QuickReferenceGuide";

interface TestcaseUploadGuideModalProps {
  isOpen: boolean;
  onOkay: () => void;
  onCancel: () => void;
  onDontShowAgain: (dontShow: boolean) => void;
  dontShowUploadFileModalAgain: boolean;
}

export const TestcaseUploadGuideModal = (props: TestcaseUploadGuideModalProps) => {
  const { isOpen, onOkay, onCancel, onDontShowAgain, dontShowUploadFileModalAgain } = props;

  const [dontShowAgain, setDontShowAgain] = useState(dontShowUploadFileModalAgain);
  const [selectedTab, setSelectedTab] = useState("format-guide");

  const renderHeader = () => (
    <div className="border-b px-4 py-4">
      <div className="flex items-center gap-2">
        <FileText className="w-6 h-6 font-medium text-base text-appPrimary" />
        <p className="font-semibold text-lg text-black1">File Format Guide</p>
      </div>
    </div>
  );

  const renderFormatGuideContent = () => {
    const formatStructureGuides = [
      {
        title: "Start with the keyword 'input'",
        description: "This indicates the beginning of the input section."
      },
      {
        title: "Specify the inputs",
        description: "Format depending on the structure that has been declared in the previous step."
      },
      {
        title: "Add the keyword 'output'",
        description: "This indicates the beginning of the output section."
      },
      {
        title: "Specify the expected output",
        description: "The result that should be produced for the given inputs."
      }
    ];

    const importantNotes = [
      "Each section must be on a separate line.",
      "Array elements must be separated by spaces.",
      "Do not add extra blank lines.",
      "Make sure to use the exact keywords 'input' and 'output'."
    ];

    return (
      <div className="w-full px-4 py-4 space-y-6">
        <div>
          <p className="font-medium text-base text-black1">File Format Structure</p>
          <p className="font-light text-xs text-gray3">Your .txt file should follow this specific structure:</p>
        </div>
        <div className="space-y-2">
          {formatStructureGuides.map((guide, index) => (
            <div key={index} className="flex gap-3">
              <p className="text-white font-medium text-base bg-appPrimary p-4 rounded-full flex items-center justify-center w-8 h-8">
                {index + 1}
              </p>
              <div>
                <p className="font-medium text-base text-black1">{guide.title}</p>
                <p className="font-light text-xs text-gray3">{guide.description}</p>
                {index === 1 && <QuickReferenceGuide />}
              </div>
            </div>
          ))}
        </div>
        <div className="bg-lightGold bg-opacity-40 p-4 rounded-md space-y-2">
          <div className="flex items-center gap-2">
            <CircleAlert className="inline w-4 h-4 text-appWarning" />
            <p className="text-base font-medium text-darkGold">Important Notes:</p>
          </div>

          <ul className="list-disc pl-10">
            {importantNotes.map((note, index) => (
              <li key={index} className="text-xs text-gray3">
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderExampleContent = () => (
    <div className="w-full px-4 py-4 space-y-4">
      <div className="space-y-2">
        <p className="font-medium text-base text-black1">Example File Format:</p>
        <div className="border border-gray4 rounded-sm p-4 font-light text-sm">
          <p>input</p>
          <p>abcyy</p>
          <p>2</p>
          <p>26</p>
          <p>1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2</p>
          <p>output</p>
          <p>cdeabab</p>
        </div>
      </div>
      <div className="bg-greenBackground bg-opacity-15 p-4 space-y-2">
        <p className="font-medium text-appEasy">Explain This Example:</p>
        <ul className="list-disc pl-5 text-gray3 text-xs">
          <li>
            <strong>input:</strong>
            <ul className="list-disc pl-6">
              <li>abcxy: An input with string data type.</li>
              <li>2: An input with integer data type.</li>
              <li>
                26: A number indicating the list's length must appear right before the list itself and all elements of
                the list.
              </li>
            </ul>
          </li>
          <li>
            <strong>output:</strong>
            <ul className="list-disc pl-6">
              <li>cdeabab → Output with string data type.</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );

  const renderBody = () => (
    <div className="justify-items-center w-full h-full">
      <div className="flex w-full px-4 font-bold">
        <button
          className={`flex-1 px-4 py-2 ${selectedTab === "format-guide" ? "text-appAccent border-b-2 border-appAccent" : "text-gray3"}`}
          onClick={() => setSelectedTab("format-guide")}
        >
          File Format Guide
        </button>
        <button
          className={`flex-1 px-4 py-2 ${selectedTab === "example" ? "text-appAccent border-b-2 border-appAccent" : "text-gray3"}`}
          onClick={() => setSelectedTab("example")}
        >
          Example
        </button>
      </div>
      {selectedTab === "format-guide" ? renderFormatGuideContent() : renderExampleContent()}
    </div>
  );

  const renderFooter = () => (
    <div className="flex justify-between border-t px-4 py-3">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="dont-show-again"
          checked={dontShowAgain}
          onChange={(e) => {
            setDontShowAgain(e.target.checked);
            onDontShowAgain(e.target.checked);
          }}
          className="accent-appPrimary"
        />
        <label htmlFor="dont-show-again" className="text-sm text-gray-500">
          Don't show this again
        </label>
      </div>
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="hover:bg-appPrimary hover:text-white border-appPrimary text-appPrimary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button onClick={onOkay}>Okay</Button>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl relative w-full max-w-xl">
        {renderHeader()}
        {renderBody()}
        {renderFooter()}
      </div>
    </div>
  );
};
