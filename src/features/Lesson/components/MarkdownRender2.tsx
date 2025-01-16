import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { LessonHeader } from "./LessonHeader";
import { ILesson } from "@/features/Course/types";
import { TableOfContents } from "./TableOfContents";

interface MarkdownRenderProps {
  lesson: ILesson;
  setIsScrolledToBottom: (value: boolean) => void;
}

export const MarkdownRender = (props: MarkdownRenderProps) => {
  const { lesson, setIsScrolledToBottom } = props;

  const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([]);
  const [tocTop, setTocTop] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activeTab, setActiveTab] = useState<string>("plaintext");
  const [groupedCodeBlocks, setGroupedCodeBlocks] = useState<{ [language: string]: string[] }>({});
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const preprocessMarkdown = (content: string) => {
      const blocks: { [language: string]: string[] } = {};
      const matches = content.match(/```(\w+)[\s\S]*?```/g) || [];

      matches.forEach((block) => {
        const languageMatch = block.match(/```(\w+)/);
        const language = languageMatch ? languageMatch[1] : "plaintext";
        const code = block.replace(/```(\w+)|```/g, "").trim();

        if (!blocks[language]) blocks[language] = [];
        blocks[language].push(code);
      });

      setGroupedCodeBlocks(blocks);
      setActiveTab(Object.keys(blocks)[0] || "plaintext");
    };

    preprocessMarkdown(lesson.content);
  }, [lesson.content]);

  const CodeTabs = () => (
    <div className="mt-4">
      <div className="flex bg-gray-100 border-b">
        {Object.keys(groupedCodeBlocks).map((language) => (
          <button
            key={language}
            className={`py-2 px-4 ${activeTab === language ? "bg-blue-500 text-white" : "text-gray-700"}`}
            onClick={() => setActiveTab(language)}
          >
            {language}
          </button>
        ))}
      </div>
      <div className="p-4 overflow-auto font-mono text-white bg-gray-900">
        {groupedCodeBlocks[activeTab]?.map((code, idx) => (
          <SyntaxHighlighter key={idx} language={activeTab} style={dracula} showLineNumbers>
            {code}
          </SyntaxHighlighter>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`flex ${windowWidth < 1000 ? "mr-1" : windowWidth > 1500 ? "mr-64" : "mr-48"}`}>
      <div className="pr-6" style={{ width: windowWidth * 0.8 }} ref={contentRef}>
        <LessonHeader lesson={lesson} />
        <ReactMarkdown
          className="markdown"
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
          components={{
            code({ children, className }) {
              return null; // Prevent direct rendering of code blocks
            }
          }}
        >
          {lesson.content}
        </ReactMarkdown>
        {Object.keys(groupedCodeBlocks).length > 0 && <CodeTabs />}
      </div>
      {toc.length > 0 && (
        <TableOfContents
          toc={toc}
          activeTocItem=""
          setActiveTocItem={() => {}}
          tocTop={tocTop}
          defaultTop={100}
          windowWidth={windowWidth}
        />
      )}
    </div>
  );
};
