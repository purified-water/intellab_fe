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

  const buttonWidth = size === "large" ? "40px" : "30px";

  return (
    <div className="relative w-full">
      <button
        type="button"
        className="absolute z-10 flex items-center justify-center p-2 transition-transform duration-300 transform -translate-y-1/2 rounded-full shadow-md left-4 bg-white/50 hover:bg-white opacity-70 hover:opacity-100 hover:scale-105 top-1/2"
        style={{ width: buttonWidth, height: buttonWidth }}
        onClick={scrollLeft}
        aria-label="Scroll left"
      >
        <ChevronLeft size={24} className="text-gray3" />
      </button>
      <div
        ref={scrollContainerRef}
        className="relative flex w-full py-4 space-x-4 overflow-x-scroll scroll-smooth scrollbar-hide flex-nowrap"
      >
        {children}
      </div>
      <button
        type="button"
        className="absolute z-10 flex items-center justify-center p-2 transition-transform duration-300 transform -translate-y-1/2 rounded-full shadow-md right-4 bg-white/50 hover:bg-white opacity-70 hover:opacity-100 hover:scale-105 top-1/2"
        style={{ width: buttonWidth, height: buttonWidth }}
        onClick={scrollRight}
        aria-label="Scroll right"
      >
        <ChevronRight size={24} className="text-gray3" />
      </button>
    </div>
  );
};
