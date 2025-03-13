import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
      remarkPlugins={[remarkGfm]}
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
            <div className="overflow-x-auto max-w-[100%]">
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
