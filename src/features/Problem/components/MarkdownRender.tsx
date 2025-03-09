import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRenderProps {
  content: string;
}

export const MarkdownRender = (props: MarkdownRenderProps) => {
  const { content } = props;

  return (
    <ReactMarkdown
      className="mb-12 markdown"
      remarkPlugins={[remarkGfm]}
      components={{
        code: (props) => {
          const { children, className, ...rest } = props;

          // Check if this is an inline code block (not in a pre)
          const isInline = !className;

          if (isInline) {
            // For inline code like `nums1` or `nums2`
            return (
              <code className="desc-code" {...rest}>
                {children}
              </code>
            );
          }

          // For code blocks with ```
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
