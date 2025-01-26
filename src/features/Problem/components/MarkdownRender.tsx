import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRenderProps {
  content: string;
}

export const MarkdownRender = (props: MarkdownRenderProps) => {
  const { content } = props;

  return (
    <ReactMarkdown className="mb-12 text-justify markdown" remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  );
};
