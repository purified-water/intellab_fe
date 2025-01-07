import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Link as ScrollLink } from "react-scroll";
// For getting paragraph tag for language name in code block
import { unified } from "unified";
import remarkParse from "remark-parse";
import { Root, Code, Paragraph } from "mdast";
import { is } from "unist-util-is";
import { LessonHeader } from "./LessonHeader";
import { ILesson } from "@/features/Course/types";
import { addBookmark, getUserIdFromLocalStorage, getBookmark } from "@/utils";

interface MarkdownRenderProps {
  lesson: ILesson;
  setIsScrolledToBottom: (value: boolean) => void;
}

export const MarkdownRender = (props: MarkdownRenderProps) => {
  const { lesson, setIsScrolledToBottom } = props;

  const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([]);
  const [tocTop, setTocTop] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [processedContent, setProcessedContent] = useState(lesson.content);
  const [activeTocItem, setActiveTocItem] = useState("");
  const contentRef = useRef<HTMLDivElement | null>(null); // Ref for the Markdown content
  const defaultTop = 100;
  const userId = getUserIdFromLocalStorage(); // support bookmarking

  const preprocessMarkdown = (content: string) => {
    const processor = unified().use(remarkParse);
    const ast = processor.parse(content) as Root;
    const languageMap = new Map<string, string>();

    ast.children.forEach((node, index) => {
      if (
        is<Code>(node, {
          type: "code",
          value: (node as Code).value // This will fix the type error
        })
      ) {
        const prevNode = ast.children[index - 1];

        if (
          prevNode &&
          is<Paragraph>(prevNode, {
            type: "paragraph",
            children: (prevNode as Paragraph).children // Check if children is an array
          })
        ) {
          // Ensure prevNode.children is a non-empty array
          const firstChild = prevNode.children[0];
          if (firstChild && "value" in firstChild) {
            const languageFromParagraph = firstChild.value as string;

            if (languageFromParagraph) {
              const normalizedLanguage = languageFromParagraph.toLowerCase();
              languageMap.set(node.value, normalizedLanguage);

              // Map special cases
              if (languageFromParagraph === "C++" || languageFromParagraph === "c++") {
                languageMap.set(node.value, "cpp");
              }
              if (languageFromParagraph === "C#" || languageFromParagraph === "c#") {
                languageMap.set(node.value, "csharp");
              }
              if (languageFromParagraph.toLowerCase().includes("python")) {
                languageMap.set(node.value, "python");
              }
            }
          }
        }
      }
    });

    return { ast, languageMap };
  };
  const [languageMap, setLanguageMap] = useState(new Map<string, string>());

  useEffect(() => {
    const { languageMap } = preprocessMarkdown(lesson.content);
    setLanguageMap(languageMap);
    setProcessedContent(lesson.content); // Use the preprocessed content if needed.
  }, [lesson.content]);

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"));
    const tocItems = headings.map((heading) => ({
      id: heading.id,
      text: heading.textContent || "",
      level: parseInt(heading.tagName[1])
    }));
    // extractLanguages();
    setToc(tocItems);
  }, [lesson.content]);

  useEffect(() => {
    const handleScroll = () => {
      // console.log(contentRef.current);
      if (contentRef.current) {
        const { top, bottom, height } = contentRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Calculate the visible portion of the content
        // as you scroll down, the top with descrease, you have to add the absolute value of top and visible height to get the scrolled height
        const visibleHeight = Math.min(bottom, viewportHeight) + Math.max(Math.abs(top), 0);

        // Calculate the scrolled percentage
        const scrolledPercentage = (visibleHeight / height) * 100;
        if (scrolledPercentage >= 70) {
          setIsScrolledToBottom(true);
        }
      }

      const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"));
      // const scrollPosition = window.scrollY;

      headings.forEach((heading) => {
        const { top } = heading.getBoundingClientRect();
        if (top <= 200 && top > -200) {
          setActiveTocItem(heading.id); // Update active TOC item (id is the same as heading id)

          if (userId) {
            addBookmark(userId, lesson.lessonId, heading.id); // Bookmark is specific to user and lessons
          }
        }
      });

      const scrollTop = window.scrollY;
      setTocTop(scrollTop > defaultTop ? scrollTop - defaultTop : 0);
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    let lastViewedSection = null;

    if (userId) {
      lastViewedSection = getBookmark(userId, lesson.lessonId);
    }

    if (lastViewedSection) {
      const targetElement = document.getElementById(lastViewedSection);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
        setActiveTocItem(lastViewedSection);
      }
    }
  }, [lesson.lessonId]);

  const renderTOC = () => {
    if (windowWidth <= 1000) {
      return null;
    }

    return (
      <div
        className="right-0 mr-4 border-l border-gray4"
        style={{
          position: "absolute",
          top: tocTop + defaultTop + 20,
          width: windowWidth * 0.18
        }}
      >
        <ul>
          {toc.map((item) => (
            <li key={item.id} style={{ marginLeft: item.level * 10 }}>
              <ScrollLink
                to={item.id}
                smooth={true}
                duration={500}
                className={`overflow-hidden text-sm cursor-pointer hover:text-gray1 ${activeTocItem === item.id ? "text-black" : "text-gray3"}`}
                onClick={() => {
                  setActiveTocItem(item.id); // Set the clicked item as active
                  window.location.hash = item.id;
                }}
              >
                {item.text}
              </ScrollLink>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const CodeBlock = ({ language, value }: { language: string; value: string }) => (
    <SyntaxHighlighter
      language={language}
      style={dracula}
      showLineNumbers
      className={`overflow-auto max-h-96 ${language === "text" || language === "plaintext" ? "h-fit max-h-56" : "h-auto"}`}
    >
      {value}
    </SyntaxHighlighter>
  );

  return (
    <div className={`flex ${windowWidth < 1000 ? "mr-1" : "mr-48"}`}>
      <div className="pr-6" style={{ width: windowWidth * 0.8 }} ref={contentRef}>
        <LessonHeader lesson={lesson} />
        <ReactMarkdown
          className="markdown"
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
          components={{
            code({ children, className }) {
              const rawCode = String(children).replace(/\n$/, "");
              const language = languageMap.get(rawCode) || className?.replace("language-", "") || "text";

              return <CodeBlock language={language} value={rawCode} />;
            }
          }}
        >
          {processedContent}
        </ReactMarkdown>
      </div>
      {toc.length > 0 && renderTOC()}
    </div>
  );
};
