import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
  activeId: string | null;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ items, activeId }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (items.length === 0) {
    return null;
  }

  const toggleTOC = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full max-w-xs p-4">
      <div className="flex items-center mb-2 space-x-2 cursor-pointer" onClick={toggleTOC}>
        <h3 className="text-sm font-bold text-gray1">Table of Contents</h3>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {isOpen && (
        <ul className="space-y-1 text-sm">
          {items.map((item, index) => (
            <li
              key={index}
              style={{ paddingLeft: `${(item.level - 1) * 1 + 0.2}rem` }}
              className={`py-1 border-l-2 transition-colors duration-200 ${
                activeId === item.id
                  ? "border-l-appPrimary text-appPrimary font-semibold"
                  : "border-l-transparent hover:border-l-gray-300 text-gray2 hover:text-appPrimary"
              }`}
            >
              <button
                onClick={() => handleItemClick(item.id)}
                className="w-full overflow-hidden text-xs text-left text-ellipsis line-clamp-1"
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
