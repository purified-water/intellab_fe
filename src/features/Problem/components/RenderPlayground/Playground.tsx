import { useImperativeHandle, forwardRef, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
import { SupportedLanguages, languageExtensions } from "@/features/Problem/constants/SupportedLanguages";
import { keymap, EditorView } from "@codemirror/view";
import { Prec } from "@codemirror/state";
import { indentSelection } from "@codemirror/commands";
import { indentUnit } from "@codemirror/language";

export interface PlaygroundRef {
  codeFormat: () => void;
}

interface PlaygroundProps {
  language: SupportedLanguages;
  code: string;
  onCodeChange: (code: string) => void;
}

export const Playground = forwardRef<PlaygroundRef, PlaygroundProps>(({ language, code, onCodeChange }, ref) => {
  const viewRef = useRef<EditorView | null>(null);
  const extension = languageExtensions[language];

  const formatCode = () => {
    const view = viewRef.current;
    if (!view) return;

    try {
      const range = { from: 0, to: view.state.doc.length };
      const selection = { anchor: range.from, head: range.to };

      view.dispatch(
        view.state.update({
          selection,
          userEvent: "format"
        })
      );

      indentSelection(view);
      onCodeChange(view.state.doc.toString());
    } catch (err) {
      console.error("Formatting error:", err);
    }
  };

  useImperativeHandle(ref, () => ({
    codeFormat: formatCode
  }));

  const formatKeymap = keymap.of([
    {
      key: "Alt-Shift-f",
      run: () => {
        formatCode();
        return true;
      }
    }
  ]);

  const indentationExtension = indentUnit.of("    ");
  const extensions = [Prec.highest(formatKeymap), indentationExtension];

  if (extension) extensions.push(extension);

  return (
    <CodeMirror
      value={code}
      placeholder={`// Write your ${language} code here`}
      theme={vscodeLight}
      extensions={extensions}
      onChange={(value, viewUpdate) => {
        viewRef.current = viewUpdate.view;
        onCodeChange(value);
      }}
      style={{ fontSize: "14px", height: "100%", overflowY: "auto" }}
    />
  );
});

Playground.displayName = "Playground";
