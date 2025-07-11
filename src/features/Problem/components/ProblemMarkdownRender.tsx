import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

interface MarkdownRenderProps {
  content: string;
}
interface CodeProps {
  children?: React.ReactNode;
  className?: string;
}

export const MarkdownRender = (props: MarkdownRenderProps) => {
  const { content } = props;

  return (
    <ReactMarkdown
      className="mb-12 markdown"
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code: ({ children, className, ...rest }: CodeProps) => {
          const isInline = !className; // Check if inline code

          if (isInline) {
            return (
              <code className="desc-code" {...rest}>
                {children}
              </code>
            );
          }

          return (
            <div className="w-full overflow-x-auto">
              <pre>
                <code className={className} {...rest}>
                  {children}
                </code>
              </pre>
            </div>
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
