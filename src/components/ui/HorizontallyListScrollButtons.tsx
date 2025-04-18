import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface ScrollableListProps {
  children: ReactNode;
  size?: "small" | "large";
}

export const ScrollableList = ({ children, size }: ScrollableListProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const buttonWidth = size === "large" ? "90px" : "50px";

  return (
    <div className="relative w-full">
      <button
        className="absolute left-0 z-10 flex items-center justify-center h-full p-1 transition-opacity duration-300 transform -translate-y-1/2 pointer-events-none bg-opacity-45 bg-gradient-to-r from-white/30 to-transparent top-1/2 hover:text-gray1 text-gray2/80"
        style={{ height: scrollContainerRef.current?.offsetHeight, width: buttonWidth }}
      >
        <ChevronLeft size={28} className="pointer-events-auto" onClick={scrollLeft} />
      </button>
      <div
        ref={scrollContainerRef}
        className="relative flex w-full py-4 space-x-4 overflow-x-scroll scroll-smooth scrollbar-hide flex-nowrap"
      >
        {children}
      </div>
      <button
        className="absolute right-0 z-10 flex items-center justify-center h-full p-1 transition-opacity duration-300 transform -translate-y-1/2 pointer-events-none bg-opacity-45 bg-gradient-to-l from-white/30 to-transparent top-1/2 hover:text-gray1 text-gray2/80"
        style={{ height: scrollContainerRef.current?.offsetHeight, width: buttonWidth }}
      >
        <ChevronRight size={28} className="pointer-events-auto" onClick={scrollRight} />
      </button>
    </div>
  );
};
