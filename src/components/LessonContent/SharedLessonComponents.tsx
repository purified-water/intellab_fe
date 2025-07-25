import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { xonokai } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { LANGUAGE_MAP } from "@/constants";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import { ImageCarousel } from "@/components/Markdown";
import { CarouselImage, isImageMarkdown, extractImageInfo, capitalizeFirstLetter } from "@/utils";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

// Type definitions
export interface CodeBlock {
  language: string;
  content: string;
}

export interface ContentBlock {
  type: "text" | "codeGroup" | "output" | "imageCarousel";
  content: string | CodeBlock[] | CarouselImage[];
}

// Helper function to map language names to SyntaxHighlighter languages
const getHighlighterLanguage = (language: string): string => {
  return LANGUAGE_MAP[language.toLowerCase()] || language;
};

// Output block component
export const OutputBlock = React.memo(function OutputBlock({ content }: { content: string }) {
  return (
    <div className="mb-8 overflow-y-scroll border rounded-lg min-h-fit max-h-[500px] shadow-md scrollbar-hide">
      <div className="px-4 py-3 text-sm font-semibold border-b text-appPrimary">Output</div>
      <div className="p-4 text-white bg-appOutputBG">
        <pre className="whitespace-pre-wrap">
          <code>{content}</code>
        </pre>
      </div>
    </div>
  );
});

// Enhanced Code tabs component with both styles
export const CodeTabs = React.memo(function CodeTabs({
  codeBlocks,
  variant = "original"
}: {
  codeBlocks: CodeBlock[];
  variant?: "original" | "simple";
}) {
  const [activeTab, setActiveTab] = useState(variant === "original" ? codeBlocks[0]?.language || "" : 0);
  const codeRef = useRef<HTMLDivElement>(null);
  const [codeHeight, setCodeHeight] = useState("auto");

  useEffect(() => {
    if (variant === "original" && codeRef.current) {
      const contentHeight = codeRef.current.scrollHeight;
      setCodeHeight(contentHeight > 700 ? "700px" : "fit-content");
    }
  }, [activeTab, variant]);

  if (variant === "original") {
    return (
      <div className="mt-8 mb-4 border rounded-lg shadow-md h-fit code-tabs-headers">
        <div className="flex rounded-t-lg">
          {codeBlocks.map((block) => (
            <button
              type="button"
              key={block.language}
              className={`px-4 py-3 text-sm ${
                activeTab === block.language
                  ? "bg-white font-semibold border-b-2 border-appPrimary text-appPrimary"
                  : "text-gray2 hover:text-appPrimary hover:bg-gray6"
              }`}
              onClick={() => setActiveTab(block.language)}
            >
              {capitalizeFirstLetter(block.language)}
            </button>
          ))}
        </div>

        <div
          className="overflow-auto rounded-b-lg shadow-md code-content"
          style={{ maxHeight: codeHeight }}
          ref={codeRef}
        >
          {codeBlocks.map((block) => (
            <div key={block.language} className={activeTab === block.language ? "block" : "hidden"}>
              <SyntaxHighlighter
                language={getHighlighterLanguage(block.language)}
                style={xonokai}
                customStyle={{ margin: 0, borderRadius: 0 }}
                showLineNumbers
              >
                {block.content}
              </SyntaxHighlighter>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Simple variant
  return (
    <div className="mb-8 border rounded-lg shadow-md">
      <div className="flex rounded-t-lg">
        {codeBlocks.map((block, index) => (
          <button
            type="button"
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-3 text-sm ${
              activeTab === block.language
                ? "bg-white font-semibold border-b-2 border-appPrimary text-appPrimary"
                : "text-gray2 hover:text-appPrimary hover:bg-gray6"
            }`}
          >
            {capitalizeFirstLetter(block.language)}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={getHighlighterLanguage(codeBlocks[activeTab as number].language)}
          style={xonokai}
          customStyle={{
            margin: 0,
            borderRadius: "0 0 8px 8px",
            fontSize: "14px"
          }}
        >
          {codeBlocks[activeTab as number].content}
        </SyntaxHighlighter>
      </div>
    </div>
  );
});

// Content parser function
export const parseContent = (content: string): ContentBlock[] => {
  const blocks: ContentBlock[] = [];
  const lines = content.split("\n");

  let currentText = "";
  let currentCodeBlocks: CodeBlock[] = [];
  let carouselImages: CarouselImage[] = [];
  let inCodeBlock = false;
  let currentLanguage = "";
  let codeContent = "";
  let expectingOutput = false;
  let processingCarousel = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for code block start/end
    if (line.startsWith("```")) {
      // If we were processing a carousel, finalize it
      if (processingCarousel && carouselImages.length > 0) {
        blocks.push({
          type: "imageCarousel",
          content: [...carouselImages]
        });
        carouselImages = [];
        processingCarousel = false;
      }

      const blockType = line.substring(3).trim().toLowerCase();

      if (inCodeBlock) {
        // End of a code block
        inCodeBlock = false;

        if (currentLanguage === "output") {
          // This is an output block that follows code blocks
          if (currentCodeBlocks.length > 0) {
            // First add the code blocks
            blocks.push({
              type: "codeGroup",
              content: [...currentCodeBlocks]
            });
            currentCodeBlocks = [];
          }

          // Then add the output block
          blocks.push({
            type: "output",
            content: codeContent.trim()
          });
          expectingOutput = false;
        } else {
          // This is a regular code block
          currentCodeBlocks.push({
            language: currentLanguage,
            content: codeContent.trim()
          });
          expectingOutput = true;
        }

        codeContent = "";
      } else {
        // Start of a code block
        inCodeBlock = true;
        currentLanguage = blockType;

        // If the block is not an output block and we're not expecting output,
        // finalize any text and previous code blocks
        if (blockType !== "output" && !expectingOutput) {
          // If we have text content, add it before starting code blocks
          if (currentText.trim()) {
            blocks.push({
              type: "text",
              content: currentText.trim()
            });
            currentText = "";
          }

          // If we have previous code blocks, add them
          if (currentCodeBlocks.length > 0) {
            blocks.push({
              type: "codeGroup",
              content: [...currentCodeBlocks]
            });
            currentCodeBlocks = [];
          }
        }
      }
    } else if (inCodeBlock) {
      // Inside a code block
      codeContent += line + "\n";
    } else {
      // Check if this is an image line
      if (isImageMarkdown(line)) {
        // If we have text content and we're not already processing a carousel, add it
        if (currentText.trim() && !processingCarousel) {
          blocks.push({
            type: "text",
            content: currentText.trim()
          });
          currentText = "";
        }

        // Extract images from the line
        const images = extractImageInfo(line);
        carouselImages.push(...images);
        processingCarousel = true;
      } else if (line.trim() === "" && processingCarousel) {
        // Empty line after images - end of carousel
        if (carouselImages.length > 0) {
          blocks.push({
            type: "imageCarousel",
            content: [...carouselImages]
          });
          carouselImages = [];
          processingCarousel = false;
        }
      } else if (!processingCarousel) {
        // Regular text content

        // If we were expecting output but didn't get one, add the code blocks
        if (expectingOutput && currentCodeBlocks.length > 0) {
          blocks.push({
            type: "codeGroup",
            content: [...currentCodeBlocks]
          });
          currentCodeBlocks = [];
          expectingOutput = false;
        }

        // Then continue with text
        currentText += line + "\n";
      }
    }
  }

  // Add any remaining content
  if (processingCarousel && carouselImages.length > 0) {
    blocks.push({
      type: "imageCarousel",
      content: carouselImages
    });
  } else if (currentText.trim()) {
    blocks.push({
      type: "text",
      content: currentText.trim()
    });
  }

  if (currentCodeBlocks.length > 0) {
    blocks.push({
      type: "codeGroup",
      content: currentCodeBlocks
    });
  }

  return blocks;
};

// Enhanced Markdown Text Renderer with customizable components
export const MarkdownTextRenderer = React.memo(function MarkdownTextRenderer({
  content,
  variant = "original"
}: {
  content: string;
  variant?: "original" | "simple";
}) {
  const baseComponents = {
    code: (props: React.ComponentProps<"code">) => {
      const { children, ...rest } = props;
      const isInline = children;
      return isInline ? (
        <code className="px-1 py-0.5 bg-gray-100 rounded text-gray-800 font-mono text-sm" {...rest}>
          {children}
        </code>
      ) : (
        <code {...props} />
      );
    },
    p: ({ children }: React.ComponentProps<"p">) => {
      const textContent = String(children);
      if (isImageMarkdown(textContent)) {
        const images = extractImageInfo(textContent);
        if (images.length > 1) {
          return <ImageCarousel images={images} />;
        }
      }
      return <p className="mb-4 leading-relaxed">{children}</p>;
    }
  };

  const originalComponents = {
    ...baseComponents
  };

  const containerClass =
    variant === "original" ? "mb-4 prose-sm prose md:prose-base lg:prose-lg max-w-none" : "prose prose-lg max-w-none";

  const components = originalComponents; // Can change to simpleComponents if needed

  return (
    <div className={containerClass}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }], rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

// TOC Item type
export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

// Extract TOC from markdown content
export const extractTOC = (content: string): TOCItem[] => {
  const toc: TOCItem[] = [];
  const lines = content.split("\n");

  const headingRegex = /^(#{1,3})\s+(.+)$/;
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.startsWith("```")) {
      inCodeBlock = !inCodeBlock; // Toggle code block state
      continue;
    }

    if (!inCodeBlock) {
      const match = line.match(headingRegex);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();

        const slug = text
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, "")
          .replace(/\s+/g, "-");

        toc.push({ id: slug, text, level });
      }
    }
  }

  return toc;
};

// Content Block Renderer
export const ContentBlockRenderer = React.memo(function ContentBlockRenderer({
  blocks,
  variant = "original"
}: {
  blocks: ContentBlock[];
  variant?: "original" | "simple";
}) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "text") {
          return <MarkdownTextRenderer key={index} content={block.content as string} variant={variant} />;
        } else if (block.type === "codeGroup") {
          // Check if the next block is an output block
          const nextBlock = blocks[index + 1];
          const hasOutput = nextBlock && nextBlock.type === "output";

          return (
            <div key={index} className={hasOutput ? "mb-0" : "mb-4"}>
              <CodeTabs codeBlocks={block.content as CodeBlock[]} variant={variant} />
            </div>
          );
        } else if (block.type === "output") {
          return (
            <div key={index} className="mb-4">
              <OutputBlock content={block.content as string} />
            </div>
          );
        } else if (block.type === "imageCarousel") {
          return (
            <div key={index} className="mb-4">
              <ImageCarousel images={block.content as CarouselImage[]} />
            </div>
          );
        }
        return null;
      })}
    </>
  );
});
