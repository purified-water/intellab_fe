import { useEffect, useState } from "react";
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

interface MarkdownRenderProps {
  content: string;
}

export const MarkdownRender = (props: MarkdownRenderProps) => {
  const { content } = props;

  const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([]);
  const [tocTop, setTocTop] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [processedContent, setProcessedContent] = useState(content);
  const defaultTop = 350;

  const preprocessMarkdown = (content: string) => {
    const processor = unified().use(remarkParse);
    const ast = processor.parse(content) as Root;
    const languageMap = new Map<string, string>();

    ast.children.forEach((node, index) => {
      if (
        is<Code>(node, {
          type: "code",
          value: (node as Code).value // Fix the type error
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
            }
          }
        }
      }
    });

    return { ast, languageMap };
  };
  const [languageMap, setLanguageMap] = useState(new Map<string, string>());

  useEffect(() => {
    const { languageMap } = preprocessMarkdown(content);
    setLanguageMap(languageMap);
    setProcessedContent(content); // Use the preprocessed content if needed.
  }, [content]);

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"));
    const tocItems = headings.map((heading) => ({
      id: heading.id,
      text: heading.textContent || "",
      level: parseInt(heading.tagName[1])
    }));
    // extractLanguages();
    setToc(tocItems);
  }, [content]);

  useEffect(() => {
    const handleScroll = () => {
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

  const renderTOC = () => {
    if (windowWidth <= 1200) {
      return null;
    }

    return (
      <div
        className="right-0 border-l border-gray4"
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
                className="overflow-hidden underline cursor-pointer text-appPrimary"
                onClick={() => {
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
      className={`overflow-auto max-h-96 ${language === "text" || language === "plaintext" ? "h-32" : "h-auto"}`}
    >
      {value}
    </SyntaxHighlighter>
  );

  return (
    <div className="flex mr-1 md:mr-48">
      <div className="pr-12" style={{ width: windowWidth * 0.8 }}>
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
