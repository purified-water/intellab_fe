import { MoreVertical, GripVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui";
import { SortableItem } from "@/components/ui";
import { LessonAction } from "../../../types";
import { CreateLessonSchema } from "../../../schemas";

interface LessonItemProps {
  lesson: CreateLessonSchema;
  onAction: (action: LessonAction) => void;
  selectedLessonId?: string;
}

export function LessonItem({ lesson, onAction, selectedLessonId }: LessonItemProps) {
  if (!lesson) return;

  const handleAction = (action: LessonAction) => {
    const { type, lessonId } = action;
    if (!action) return;

    switch (type) {
      case "view":
      case "edit":
        onAction({ type, lessonId });
        break;
      case "duplicate":
        // Handle duplicate action
        break;
      case "delete":
        onAction({ type: "delete", lessonId });
        break;
      default:
        console.error("Unknown action type:", type);
    }
  };

  return (
    <SortableItem id={lesson.lessonId} key={lesson.lessonId}>
      {({ attributes, listeners, setNodeRef, style }) => (
        // Set node ref to the div that will be sortable
        // Apply the style to the div to enable drag-and-drop
        <div
          ref={setNodeRef}
          style={style}
          className={`flex items-center justify-between px-3 py-2 border rounded-lg hover:bg-muted ${selectedLessonId === lesson.lessonId ? "bg-purple-100 border-appFadedPrimary" : ""}`}
        >
          <div
            className="flex items-center flex-1 space-x-2 cursor-pointer"
            onClick={() => onAction({ type: "view", lessonId: lesson.lessonId })}
          >
            {/* Attached only the listener to the gripIcon */}
            <GripVertical
              className="size-3 shrink-0 text-muted-foreground cursor-grab"
              {...attributes}
              {...listeners}
            />
            <span className="text-sm font-medium line-clamp-1">{lesson.lessonName}</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div onPointerDown={(e) => e.stopPropagation()}>
                <MoreVertical className="cursor-pointer size-4 shrink-0 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent onPointerDown={(e) => e.stopPropagation()}>
              {["view", "edit", "duplicate", "delete"].map((action) => (
                <DropdownMenuItem
                  key={action}
                  onClick={() => handleAction({ type: action, lessonId: lesson.lessonId } as LessonAction)}
                  className={action === "delete" ? "text-appHard" : ""}
                >
                  {action.charAt(0).toUpperCase() + action.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </SortableItem>
  );
}
