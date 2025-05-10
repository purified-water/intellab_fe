import { useState, useEffect } from "react";
import { TOCItem } from "../components";

interface UseTableOfContentsProps {
  tocItems: TOCItem[];
}

export const useTableOfContents = ({ tocItems }: UseTableOfContentsProps) => {
  const [activeHeading, setActiveHeading] = useState<string | null>(null);

  // Setup intersection observer for headings
  useEffect(() => {
    if (!tocItems.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -80% 0px",
        threshold: 0
      }
    );

    // Observe all heading elements
    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      // Cleanup observer
      observer.disconnect();
    };
  }, [tocItems]);

  return { activeHeading };
};
