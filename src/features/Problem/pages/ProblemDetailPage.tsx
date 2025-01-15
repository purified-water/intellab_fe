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
import { ProblemType } from "@/types/ProblemType";

export const ProblemDetail = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [problemDescription, setProblemDescription] = useState("");
  const [problemDetail, setProblemDetail] = useState<ProblemType | null>(null);
  const { problemId } = useParams<{ problemId: string }>();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const courseId = "";
  const courseName = "";
  const lessonId = "";
  const lessonName = "";

  const fetchProblemDetail = async () => {
    try {
      const problemDetail = await problemApi.getProblemDetail(problemId!);

      if (problemDetail) {
        setProblemDetail(problemDetail);
      }
    } catch (error) {
      console.error("Failed to fetch problem detail", error);
    }
  };

  const handleRunCode = () => {
    // TO DO: Implement this function
    console.log("code and language", code, language);
    // TO DO: MATCH THE LANGUAGE WITH THE JUDGE0 LANGUAGE
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
              problemDetail={problemDetail}
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
                <RenderPGTabs setLanguagePackage={(lang, code) => {
                  setLanguage(lang);
                  setCode(code);
                }} />
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
          <Button
            className="font-semibold text-gray3 bg-gray5 gap-x-1 hover:bg-gray4"
            onClick={handleRunCode}
          >
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
