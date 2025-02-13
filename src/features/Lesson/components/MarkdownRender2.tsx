import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow as theme } from "react-syntax-highlighter/dist/esm/styles/prism";

// Type definition for a code block
interface CodeBlock {
  language: string;
  content: string;
}

// NOTE: thử gán các code tabs là 1 id riêng 1 2 3, sau khi 1 consecutive code blocks hết thì
// xóa hết mấy cái code block cũ để gán cái mới?
// rồi hỏi thử tại sao cái code block nó lại cứ hiện sau cùng

// Function to parse markdown and group consecutive code blocks
const parseMarkdown = (markdown: string): (string | { type: string; title: string; blocks: CodeBlock[] })[] => {
  const lines = markdown.split("\n");
  const elements: (string | { type: string; title: string; blocks: CodeBlock[] })[] = [];
  let currentTitle = "";
  let currentBlocks: CodeBlock[] = [];
  let currentLanguage = "";
  let isInCodeBlock = false;

  lines.forEach((line) => {
    const match = line.match(/^([A-Za-z#\+\-]+)$/); // Match language names as headings
    const codeMatch = line.match(/^```(\w+)/); // Match code block language

    if (match && !isInCodeBlock) {
      // If we're inside a code block, add the last group
      if (currentBlocks.length > 0) {
        elements.push({
          type: "codeGroup",
          title: currentTitle,
          blocks: currentBlocks
        });
        currentBlocks = [];
      }
      currentTitle = match[1]; // Capture language name
      elements.push(line); // Add the title (e.g., "C++", "Java")
    } else if (codeMatch) {
      isInCodeBlock = true;
      currentLanguage = codeMatch[1]; // Capture language
    } else if (line.startsWith("```") && isInCodeBlock) {
      // Closing code block
      isInCodeBlock = false;
      currentLanguage = "";
    } else if (isInCodeBlock && currentLanguage) {
      // Inside a code block
      currentBlocks.push({ language: currentLanguage, content: line });
    } else {
      // Regular markdown text
      elements.push(line);
    }
  });

  // Push the last block if exists
  if (currentBlocks.length > 0) {
    elements.push({
      type: "codeGroup",
      title: currentTitle,
      blocks: currentBlocks
    });
  }

  return elements;
};

interface MarkdownEditorProps {
  markdown: string;
}

export default function MarkdownEditor({ markdown }: MarkdownEditorProps) {
  if (!markdown) return null;

  const [selectedTab, setSelectedTab] = useState<{ [key: string]: string }>({});

  const parsedContent = parseMarkdown(markdown);

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-100">
      {/* Markdown Preview */}
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md">
        {parsedContent.map((element, index) => {
          if (typeof element === "string") {
            return (
              <ReactMarkdown key={index} className="mb-4">
                {element}
              </ReactMarkdown>
            );
          }

          if (element.type === "codeGroup") {
            const languages = Array.from(new Set(element.blocks.map((b) => b.language)));
            const selectedLanguage = selectedTab[element.title] || languages[0];

            return (
              <div key={index} className="mt-6 overflow-hidden border rounded-lg">
                {/* Tabs */}
                <div className="flex bg-gray-200 border-b">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      className={`px-4 py-2 text-sm ${
                        selectedLanguage === lang
                          ? "bg-white border-t border-x border-gray-300 font-bold"
                          : "text-gray-600"
                      }`}
                      onClick={() => setSelectedTab((prev) => ({ ...prev, [element.title]: lang }))}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                {/* Code Display */}
                <div className="p-4 bg-gray-50">
                  <SyntaxHighlighter style={theme} language={selectedLanguage} PreTag="div">
                    {element.blocks
                      .filter((b) => b.language === selectedLanguage)
                      .map((b) => b.content)
                      .join("\n")}
                  </SyntaxHighlighter>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
