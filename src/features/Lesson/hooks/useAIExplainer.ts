import { useState, useEffect, useRef } from "react";

interface UseAIExplainerProps {
  isExplainerToggled: boolean;
}

export const useAIExplainer = ({ isExplainerToggled }: UseAIExplainerProps) => {
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number; align: "left" | "right" } | null>(null);
  const [isAIExplainerOpen, setIsAIExplainerOpen] = useState(false);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const isProcessingSelectionRef = useRef(false); // Flag to prevent multiple selections
  const selectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !isExplainerToggled || isProcessingSelectionRef.current) return;

      if (selectionTimeoutRef.current) clearTimeout(selectionTimeoutRef.current);

      isProcessingSelectionRef.current = true;

      selectionTimeoutRef.current = setTimeout(() => {
        try {
          if (!selection || selection.isCollapsed) {
            isProcessingSelectionRef.current = false; // Reset the flag if selection is collapsed
            return;
          }
          const selectedContent = selection.toString().trim();
          if (!selectedContent) {
            isProcessingSelectionRef.current = false; // Reset the flag if no content is selected
            return;
          }
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          const lessonDetail = document.getElementById("lesson-detail-content");
          if (!lessonDetail || !lessonDetail.contains(selection.anchorNode?.parentElement ?? null)) {
            isProcessingSelectionRef.current = false;
            return;
          }

          const menuWidth = 300;
          // Adjust alignment based on available space
          const align = rect.left + menuWidth > window.innerWidth ? "right" : "left";

          setSelectedText(selectedContent);
          setIsAIExplainerOpen(true);
          setMenuPosition({
            x: align === "right" ? rect.right : rect.left,
            y: rect.bottom + window.scrollY,
            align
          });
        } catch (error) {
          console.error("Error processing text selection:", error);
        } finally {
          isProcessingSelectionRef.current = false;
        }
      }, 300); // <- debounced here
    };

    const cancelSelection = () => {
      // Clear the selection if the user clicks outside
      if (selectionTimeoutRef.current) clearTimeout(selectionTimeoutRef.current);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (isAIExplainerOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        const selection = window.getSelection();
        if (selection) selection.removeAllRanges();
        setIsAIExplainerOpen(false);
      }
    };

    if (isExplainerToggled) {
      document.addEventListener("pointerup", handleMouseUp);
      document.addEventListener("pointerdown", cancelSelection);
      document.addEventListener("pointerdown", handleClickOutside);
    }

    return () => {
      document.addEventListener("pointerup", handleMouseUp);
      document.addEventListener("pointerdown", cancelSelection);
      document.addEventListener("pointerdown", handleClickOutside);
      if (selectionTimeoutRef.current) clearTimeout(selectionTimeoutRef.current);
    };
  }, [isExplainerToggled, isAIExplainerOpen]);

  return {
    menuRef,
    menuPosition,
    isAIExplainerOpen,
    setIsAIExplainerOpen,
    selectedText,
    setSelectedText
  };
};
