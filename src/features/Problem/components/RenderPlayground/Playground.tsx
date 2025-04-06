import CodeMirror from "@uiw/react-codemirror";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
import { SupportedLanguages, languageExtensions } from "@/features/Problem/constants/SupportedLanguages";
import { keymap } from "@codemirror/view";
import { Prec } from "@codemirror/state";
import { indentSelection } from "@codemirror/commands";
import { indentUnit } from "@codemirror/language";

interface PlaygroundProps {
  language: SupportedLanguages;
  code: string;
  onCodeChange: (code: string) => void;
}

export const Playground = ({ language, code, onCodeChange }: PlaygroundProps) => {
  const extension = languageExtensions[language];

  // Basic code formatting using CodeMirror's built-in indentation tools
  const formatCode = (view: any) => {
    try {
      // Get the document's full range
      const range = {
        from: 0,
        to: view.state.doc.length
      };

      // Create a selection of the entire document
      const selection = {
        anchor: range.from,
        head: range.to
      };

      // Apply indentation to the selection
      view.dispatch(
        view.state.update({
          selection,
          userEvent: "format"
        })
      );

      // Run the indent selection command on the current view
      indentSelection(view);

      // Notify about the change
      onCodeChange(view.state.doc.toString());

      return true;
    } catch (error) {
      console.error("Error formatting code:", error);
      return false;
    }
  };

  // Create a keyboard shortcut for formatting (Alt+Shift+F or Option+Shift+F)
  const formatKeymap = keymap.of([
    {
      key: "Alt-Shift-f",
      run: (view) => formatCode(view)
    }
  ]);

  // Add extensions for better indentation
  const indentationExtension = indentUnit.of("  "); // 2 spaces indentation

  // Extensions array with formatting keymap added
  const extensions = [Prec.highest(formatKeymap), indentationExtension];

  if (extension) {
    extensions.push(extension);
  }

  return (
    <CodeMirror
      value={code}
      placeholder={`// Write your ${language} code here`}
      theme={vscodeLight}
      extensions={extensions}
      style={{ fontSize: "14px", height: "100%", overflowY: "auto" }}
      onChange={(value) => onCodeChange(value)}
    />
  );
};
