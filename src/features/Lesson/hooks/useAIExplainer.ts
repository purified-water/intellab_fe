import { useToast } from "@/hooks";
import { showToastError } from "@/utils";
import { useState, useEffect, useRef } from "react";

interface UseAIExplainerProps {
  isExplainerToggled: boolean;
}

export const useAIExplainer = ({ isExplainerToggled }: UseAIExplainerProps) => {
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number; align: "left" | "right" } | null>(null);
  const [isAIExplainerOpen, setIsAIExplainerOpen] = useState(false);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const selectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toast = useToast();

  // Track whether the explainer menu is being reset to prevent race conditions
  const isResettingRef = useRef(false);

  // Close the explainer menu safely and reset state
  const resetExplainer = () => {
    // Prevent concurrent reset operations
    if (isResettingRef.current) return;

    isResettingRef.current = true;

    // Clear any pending selection timeout
    if (selectionTimeoutRef.current) {
      clearTimeout(selectionTimeoutRef.current);
      selectionTimeoutRef.current = null;
    }

    // Reset states in a safe way using function form to avoid stale closures
    setIsAIExplainerOpen(false);
    setMenuPosition(null);
    setSelectedText(null);

    // Clear any text selection in the DOM
    try {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
      }
    } catch (error) {
      console.log("Failed to clear selection", error);
      showToastError({
        toast: toast.toast,
        message: "Failed to clear text selection. Please try again."
      });
    }

    // Add a small delay before allowing new selections
    setTimeout(() => {
      isResettingRef.current = false;
    }, 200); // Slightly longer delay for better user experience
  };

  useEffect(() => {
    const handleMouseUp = () => {
      // Don't process if explainer is toggled off or we're in the middle of resetting
      if (!isExplainerToggled || isResettingRef.current) return;

      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;

      // Clear any existing timeout to prevent race conditions
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current);
      }

      // Set a timeout to allow for double-click and other selection behaviors
      selectionTimeoutRef.current = setTimeout(() => {
        try {
          const selectedContent = selection.toString().trim();
          if (!selectedContent) return;

          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          // Make sure selection is within the lesson content
          const lessonDetail = document.getElementById("lesson-detail-content");
          if (!lessonDetail || !lessonDetail.contains(selection.anchorNode?.parentElement ?? null)) {
            return;
          }

          // Calculate menu position with proper alignment
          const menuWidth = 400; // Match the menu width in AIExplainerMenu
          const align = rect.left + menuWidth + 20 > window.innerWidth ? "right" : "left";

          // Position the menu just below the selection
          const yPosition = rect.bottom + window.scrollY + 5; // Add a small offset

          setSelectedText(selectedContent);
          setIsAIExplainerOpen(true);
          setMenuPosition({
            x: align === "right" ? rect.right : rect.left,
            y: yPosition,
            align
          });
        } catch (error) {
          console.error("Error processing text selection:", error);
        }
      }, 500);
    };

    // Handle clicks outside of selected text or explainer menu
    const handleDocumentClick = (event: MouseEvent) => {
      // Check if click is outside the menu
      if (isAIExplainerOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // Don't interfere with text selection process
        if (window.getSelection()?.toString().trim()) return;

        // Close menu and clear selection
        resetExplainer();
        window.getSelection()?.removeAllRanges();
      }
    };

    // Add and remove event listeners
    if (isExplainerToggled) {
      document.addEventListener("pointerup", handleMouseUp);
      document.addEventListener("pointerdown", handleDocumentClick);
    }

    return () => {
      document.removeEventListener("pointerup", handleMouseUp);
      document.removeEventListener("pointerdown", handleDocumentClick);
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current);
      }
    };
  }, [isExplainerToggled, isAIExplainerOpen]);

  // Reset explainer when toggled off
  useEffect(() => {
    if (!isExplainerToggled) {
      resetExplainer();
    }
  }, [isExplainerToggled]);

  return {
    menuRef,
    menuPosition,
    isAIExplainerOpen,
    setIsAIExplainerOpen: (isOpen: boolean) => {
      if (!isOpen) {
        resetExplainer();
      } else {
        setIsAIExplainerOpen(true);
      }
    },
    selectedText,
    setSelectedText,
    resetExplainer
  };
};
