import { Button, ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui";
import { RenderPGTabs, RenderTCTabs } from "@/features/Problem/components";
import { useState } from "react";
import { FaSpinner, FaPlay, FaUpload } from "rocketicons/fa";
import { AdminRenderDescTabs } from "./RenderDescTabs";
import { ProblemType } from "@/types/ProblemType";
import { useCodeRunner } from "@/features/Problem/hooks/useCodeRunner";
import { useCodeSubmission } from "@/features/Problem/hooks/useCodeSubmission";

interface ProblemPreviewProps {
  problemDetail: ProblemType | null;
}

export const ProblemPreview = ({ problemDetail }: ProblemPreviewProps) => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");

  // Use custom hooks for code running and submission
  const { isRunningCode, runCodeResult, handleRunCode } = useCodeRunner({
    code,
    language,
    problemId: problemDetail?.problemId
  });

  const { isSubmitting, isSubmissionPassed, handleSubmitCode } = useCodeSubmission({
    code,
    language,
    problemId: problemDetail?.problemId
  });

  return (
    <div className="flex flex-col h-[calc(100vh-20px)] p-4 border rounded-lg border-muted">
      <div className="flex-grow overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="w-full h-full pb-10 mb-12">
          <ResizablePanel order={1} defaultSize={40} minSize={10} id="description" className="bg-white rounded-t-lg">
            <AdminRenderDescTabs problemDetail={problemDetail} isPassed={isSubmissionPassed} />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel
            order={2}
            defaultSize={60}
            minSize={30}
            id="playground"
            className="overflow-y-auto bg-white rounded-t-lg"
          >
            <ResizablePanelGroup direction="vertical" className="h-full">
              <ResizablePanel order={3} defaultSize={60} minSize={40} className="bg-white">
                {/* Re-use component from the original problem detail */}
                <RenderPGTabs
                  setLanguagePackage={(langJudge0, code) => {
                    setLanguage(langJudge0.name);
                    setCode(code);
                  }}
                  passingProblemId={problemDetail?.problemId}
                />
              </ResizablePanel>

              <ResizableHandle withHandle className="h-[10px] bg-gray5" />

              <ResizablePanel
                order={4}
                id="test-cases"
                defaultSize={40}
                minSize={20}
                className="overflow-y-auto bg-white"
              >
                <RenderTCTabs testCases={problemDetail?.testCases ?? []} runCodeResult={runCodeResult} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <div className="flex items-center justify-end w-full p-6 bg-white h-14">
        <div className="flex space-x-2">
          <Button
            type="button"
            className={`font-semibold text-gray3 bg-gray5 gap-x-1 hover:bg-gray4 ${isRunningCode ? "cursor-not-allowed" : ""}`}
            onClick={handleRunCode}
            disabled={isRunningCode}
          >
            {isRunningCode ? (
              <FaSpinner className="inline-block icon-sm animate-spin icon-gray3" />
            ) : (
              <FaPlay className="inline-block icon-sm icon-gray3" />
            )}
            Run
          </Button>

          <Button
            type="button"
            onClick={handleSubmitCode}
            className={`font-semibold text-white bg-appPrimary gap-x-1 hover:bg-appPrimary/80 ${
              isSubmitting ? "cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <FaSpinner className="inline-block icon-sm animate-spin icon-white" />
            ) : (
              <FaUpload className="inline-block icon-sm icon-white" />
            )}
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};
