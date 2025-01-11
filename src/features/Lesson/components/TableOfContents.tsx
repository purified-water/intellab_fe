import { Link as ScrollLink } from "react-scroll";

interface TableOfContentsProps {
  toc: { id: string; text: string; level: number }[];
  activeTocItem: string;
  setActiveTocItem: (id: string) => void;
  tocTop: number;
  defaultTop: number;
  windowWidth: number;
}

export const TableOfContents = ({
  toc,
  activeTocItem,
  setActiveTocItem,
  tocTop,
  defaultTop,
  windowWidth
}: TableOfContentsProps) => {
  if (windowWidth <= 1000) {
    return null;
  }

  return (
    <div
      className="right-0 px-2 mr-4 border-l border-gray4 lg:mr-0"
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
              className={`overflow-hidden text-sm cursor-pointer hover:text-gray1 ${activeTocItem === item.id ? "text-black" : "text-gray3"
                }`}
              onClick={() => setActiveTocItem(item.id)}
            >
              {item.text}
            </ScrollLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
