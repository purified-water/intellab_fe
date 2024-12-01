import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link as ScrollLink } from "react-scroll";
// import { terminal } from 'virtual:terminal' // log the information to the terminal for debugging

interface MarkdownRenderProps {
  content: string;
}

export const MarkdownRender = (props: MarkdownRenderProps) => {
  const { content } = props;

  const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([]);
  const [tocTop, setTocTop] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const defaultTop = 230;

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"));
    const tocItems = headings.map((heading, index) => ({
      id: index.toString(),
      text: heading.textContent || "",
      level: parseInt(heading.tagName[1])
    }));
    setToc(tocItems);
    //terminal.log(tocItems);
  }, [content]);

  const splitContent = content.split(/(?=^#{1,6}\s)/gm);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > defaultTop) {
        setTocTop(scrollTop - defaultTop);
      } else {
        setTocTop(0);
      }
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
        className="right-0"
        style={{
          position: "absolute",
          top: tocTop + defaultTop,
          width: windowWidth * 0.12
        }}
      >
        <ul>
          {toc.map((item) => (
            <li key={item.id} style={{ marginLeft: item.level * 15 }}>
              <ScrollLink
                to={item.id}
                smooth={true}
                duration={500}
                className="underline text-appPrimary cursor-pointer overflow-hidden"
              >
                {item.text}
              </ScrollLink>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="flex">
      <div className="border-r border-gray4 pr-6" style={{ width: windowWidth * 0.8 }}>
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
      {toc.length > 0 && renderTOC()}
    </div>
  );
};
