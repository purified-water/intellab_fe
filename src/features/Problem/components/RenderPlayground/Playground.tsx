// Playground.tsx
import CodeMirror from "@uiw/react-codemirror";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
import { SupportedLanguages, languageExtensions } from "@/features/Problem/constants/SupportedLanguages";

interface PlaygroundProps {
  language: SupportedLanguages;
  code: string;
  onCodeChange: (code: string) => void;
}

export const Playground = ({ language, code, onCodeChange }: PlaygroundProps) => {
  const extension = languageExtensions[language];

  return (
    <CodeMirror
      value={`// Write your ${language} code here \n${code}`} // Placeholder for boilerplate code
      theme={vscodeLight}
      extensions={extension ? [extension] : []}
      style={{ fontSize: "14px", height: "100%", overflowY: "auto" }}
      onChange={(value) => onCodeChange(value)}
    />
  );
};
