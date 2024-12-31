import CodeMirror from "@uiw/react-codemirror";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
import { SupportedLanguages, languageExtensions } from "@/features/Problem/constants/SupportedLanguages";

interface PlaygroundProps {
  language: SupportedLanguages;
}

export const Playground = ({ language }: PlaygroundProps) => {
  const extension = languageExtensions[language];

  return (
    <div className="h-full m-4 overflow-y-auto">
      <CodeMirror
        value={`// Write your ${language} code here`}
        theme={vscodeLight}
        extensions={extension ? [extension] : []}
        style={{ fontSize: "14px", height: "100%", overflowY: "auto" }}
      />
    </div>
  );
};
