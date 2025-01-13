import { useEffect, useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/Resizable";
import { RenderDescTabs } from "../components/RenderDescription/RenderDescTabs";
import { RenderPGTabs } from "../components/RenderPlayground/RenderPlaygroundTabs";
import { RenderTCTabs } from "../components/RenderTestCase/RenderTestCaseTabs";
import { Button } from "@/components/ui/Button";
import { MdList } from "rocketicons/md";
import { FaPlay, FaUpload } from "rocketicons/fa6";
import { RenderAllProblems } from "../components/RenderAllProblems/RenderAllProblemsList";
import { useParams } from "react-router-dom";
import { problemApi } from "@/lib/api/problemApi";

export const ProblemDetail = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [problemDescription, setProblemDescription] = useState("");
  const { problemId } = useParams<{ problemId: string }>();
  const courseId = "";
  const courseName = "";
  const lessonId = "";
  const lessonName = "";

  const fetchProblemDetail = async () => {
    console.log("Problem ID", problemId);
    try {
      const problemDetail = await problemApi.getProblemDetail(problemId!);
      setProblemDescription(problemDetail.description);
    } catch (error) {
      console.error("Failed to fetch problem detail", error);
    }
    console.log("Problem description", problemDescription);
  };

  useEffect(() => {
    fetchProblemDetail();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] p-2 bg-gray5">
      <div className="flex-grow overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="w-full h-full pb-10 mb-12">
          <ResizablePanel defaultSize={40} minSize={20} id="description" className="bg-white rounded-t-lg">
            <RenderDescTabs
              problemDescription={problemDescription}
              courseId={courseId}
              courseName={courseName}
              lessonId={lessonId}
              lessonName={lessonName}
            />
          </ResizablePanel>

          <ResizableHandle withHandle className="w-2 bg-gray5" />

          {/* Right Panel: Playground and test case */}
          <ResizablePanel
            defaultSize={60}
            minSize={30}
            id="playground"
            className="overflow-y-auto bg-white rounded-t-lg"
          >
            <ResizablePanelGroup direction="vertical" className="h-full">
              <ResizablePanel defaultSize={60} minSize={40} className="bg-white">
                <RenderPGTabs />
              </ResizablePanel>

              <ResizableHandle withHandle className="h-[10px] bg-gray5" />

              <ResizablePanel id="test-cases" defaultSize={40} minSize={20} className="overflow-y-auto bg-white">
                <RenderTCTabs />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Sidebar (Overlay) */}
      <RenderAllProblems isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 flex items-center justify-between w-full p-6 bg-white border-t h-14">
        <Button className="font-semibold text-gray3 bg-gray5 gap-x-1 hover:bg-gray4" onClick={toggleSidebar}>
          <MdList className="inline-block icon-base icon-gray3" />
          All Problems
        </Button>

        <div className="flex space-x-4">
          <Button className="font-semibold text-gray3 bg-gray5 gap-x-1 hover:bg-gray4">
            <FaPlay className="inline-block icon-sm icon-gray3" />
            Run Code
          </Button>

          <Button className="font-semibold text-appAccent bg-appFadedAccent gap-x-1 hover:opacity-80 hover:bg-appFadedAccent">
            <FaUpload className="inline-block icon-sm icon-appAccent" />
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};
