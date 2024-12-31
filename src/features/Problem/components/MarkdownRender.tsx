import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
// import { terminal } from 'virtual:terminal' // log the information to the terminal for debugging

interface MarkdownRenderProps {
  content: string;
}

export const MarkdownRender = (props: MarkdownRenderProps) => {
  const { content } = props;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const splitContent = content.split(/(?=^#{1,6}\s)/gm);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex">
      <div className="mb-4" style={{ width: windowWidth * 0.8 }}>
        {splitContent.map((section, index) => {
          const id = index.toString();
          return (
            <div key={id} id={id}>
              <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]}>
                {section}
              </ReactMarkdown>
            </div>
          );
        })}
      </div>
    </div>
  );
};
