import React, { useState } from "react";
import { FileCheck, Upload, Download, Loader, FileQuestion, CircleX } from "lucide-react";
import { readFolderContent } from "../../../utils/filesUtils";
import { Button } from "@/components/ui";
import { adminProblemAPI } from "@/features/Admins/api";
import { useToast } from "@/hooks";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { showToastError, showToastSuccess } from "@/utils";
import { setCreateProblem } from "@/redux/createProblem/createProblemSlice";
import { CreateTestcaseSchema } from "../../../schemas";
import { TTestCaseFileContent } from "../../../types";

interface TestcaseUploadFileModalProps {
  open: boolean;
  onClose: () => void;
  onHeaderIconClick?: () => void;
}

export const TestcaseUploadFileModal = (props: TestcaseUploadFileModalProps) => {
  const { open, onClose, onHeaderIconClick } = props;

  const toast = useToast();
  const dispatch = useDispatch();
  const createProblem = useSelector((state: RootState) => state.createProblem);

  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [loadingFileIndex, setLoadingFileIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredFileContent, setHoveredFileContent] = useState<string | null>(null);
  const [hoveredFilePosition, setHoveredFilePosition] = useState<{ x: number; y: number } | null>(null);

  const handleDragEvents = (event: React.DragEvent<HTMLDivElement>, isOver: boolean) => {
    event.preventDefault();
    setIsDragging(isOver);
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(event, false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    event.target.value = ""; // Reset the input value to allow re-uploading the same files
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const createProblemTestCaseStepMultipleAPI = async (testcases: TTestCaseFileContent[]) => {
    const lastTestcaseOrder =
      createProblem.problemTestcases[createProblem.problemTestcases.length - 1]?.testcaseOrder ||
      createProblem.problemTestcases.length - 1;
    await adminProblemAPI.createProblemTestCaseStepMultiple({
      body: {
        problemId: createProblem.problemId,
        orders: testcases.map((_, index) => lastTestcaseOrder + 1 + index), // index start from 0
        inputs: testcases.map((tc) => tc.input),
        outputs: testcases.map((tc) => tc.output)
      },
      onStart: async () => setUploading(true),
      onSuccess: async (response) => {
        dispatch(
          setCreateProblem({
            problemTestcases: [
              ...createProblem.problemTestcases,
              ...response.map((tc) => {
                return {
                  testcaseId: tc.testcaseId,
                  testcaseOrder: tc.order,
                  testcaseInput: tc.input,
                  expectedOutput: tc.output
                } as CreateTestcaseSchema;
              })
            ]
          })
        );
        setFiles([]);
        setLoadingFileIndex(null);
        showToastSuccess({
          toast: toast.toast,
          message: "The test cases have been successfully uploaded."
        });
        onClose();
      },
      onFail: async (error) => showToastError({ toast: toast.toast, message: error }),
      onEnd: async () => setUploading(false)
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("No files selected for upload.");
      return;
    }

    try {
      for (let i = 0; i < files.length + 1; i++) {
        setLoadingFileIndex(i);
      }

      const testcases = await readFolderContent(files);
      if (testcases.length === 0) {
        alert("No valid test cases found in the selected files.");
        setLoadingFileIndex(null);
      } else {
        await createProblemTestCaseStepMultipleAPI(testcases);
      }
    } catch (error) {
      console.error("Error processing files:", error);
      alert("Failed to process files. Please try again.");
      setLoadingFileIndex(null);
    }
  };

  const handleCancel = () => {
    setFiles([]);
    onClose();
  };

  const handleFileHover = async (file: File, event: React.MouseEvent<HTMLElement>) => {
    try {
      const content = await file.text();
      setHoveredFileContent(content);
      setHoveredFilePosition({ x: event.clientX, y: event.clientY });
    } catch (error) {
      console.error("Error reading file content:", error);
    }
  };

  const handleFileHoverLeave = () => {
    setHoveredFileContent(null);
    setHoveredFilePosition(null);
  };

  const renderDropArea = () => (
    <div className="py-3 space-y-2 border-b">
      <p className="text-xs px-4 text-gray3">*Upload .txt test cases files</p>
      <div
        className={`mx-4 border-dashed rounded-lg p-6 border-2 border-appPrimary justify-center items-center ${isDragging ? "bg-appPrimary" : ""}`}
        onDragOver={(e) => handleDragEvents(e, true)}
        onDragLeave={(e) => handleDragEvents(e, false)}
        onDrop={handleFileDrop}
      >
        <div className="flex gap-2 items-center justify-center h-full">
          {isDragging ? (
            <>
              <Download className="w-4 h-4 text-white" />
              <p className="text-xs font-medium text-white">Drop files here</p>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 text-gray3" />
              <p className="text-gray3 text-xs">Drag files into here - </p>
              <label>
                <p className="text-xs text-appHyperlink cursor-pointer underline">Select files</p>
                <input type="file" multiple className="hidden" onChange={handleFileInputChange} />
              </label>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderFileList = () => (
    <ul className="h-96 px-4 overflow-y-auto mx-4">
      {files.map((file, index) => (
        <li
          key={index}
          className={`flex items-center justify-between border-b py-3 ${loadingFileIndex === index ? "text-gray4" : "text-black1"}`}
        >
          <div
            className="flex items-center cursor-pointer gap-2"
            onMouseEnter={(e) => handleFileHover(file, e)}
            onMouseLeave={handleFileHoverLeave}
          >
            {loadingFileIndex === index ? (
              <Loader className="animate-spin text-gray3" />
            ) : (
              <FileCheck className="w-5 h-5 text-appEasy" />
            )}
            <span className="text-sm hover:text-appPrimary">{file.name}</span>
          </div>
          <div className="flex items-center gap-2 text-gray3">
            <span className="text-sm bg-gray8 rounded-md py-1 px-2">{(file.size / 1024).toFixed(2)} kb</span>
            <p>|</p>
            {loadingFileIndex !== index && (
              <button className="cursor-pointer" onClick={() => handleRemoveFile(index)}>
                <CircleX className="w-4 h-4" />
              </button>
            )}
          </div>
        </li>
      ))}
      {hoveredFileContent && hoveredFilePosition && (
        <div
          className="absolute bg-white border rounded shadow-lg p-4 text-sm text-black1"
          style={{ top: hoveredFilePosition.y / 2, left: 170 }}
        >
          <pre className="whitespace-pre-wrap max-w-xs">{hoveredFileContent}</pre>
        </div>
      )}
    </ul>
  );

  const renderHeader = () => (
    <div className="border-b px-3 py-3">
      <h2 className="text-lg font-medium flex items-center gap-2">
        Upload test cases
        <FileQuestion className="w-4 h-4 cursor-pointer hover:text-appPrimary" onClick={onHeaderIconClick} />
      </h2>
    </div>
  );

  const renderFooter = () => (
    <div className="flex px-4 py-3 justify-end border-t gap-5">
      <Button
        variant="outline"
        className="hover:bg-appPrimary hover:text-white border-appPrimary text-appPrimary"
        onClick={handleCancel}
        disabled={uploading}
      >
        Cancel
      </Button>
      <Button onClick={handleUpload} disabled={uploading}>
        Okay
      </Button>
    </div>
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl relative w-full max-w-2xl">
        {renderHeader()}
        {renderDropArea()}
        {renderFileList()}
        {renderFooter()}
      </div>
    </div>
  );
};
