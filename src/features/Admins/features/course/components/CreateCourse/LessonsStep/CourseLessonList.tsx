import { useRef, useEffect, useState } from "react";
import { Button, EndOfListNotice } from "@/components/ui";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { AddLessonModal } from "./AddLessonModal";
import { LessonItem } from "./LessonItem";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { LessonAction } from "../../../types";
import { CreateLessonSchema } from "../../../schemas";
import { useDispatch, useSelector } from "react-redux";
import { deleteLesson, setCreateCourse } from "@/redux/createCourse/createCourseSlice";
import { useCreateLesson } from "../../../hooks";
import { RootState } from "@/redux/rootReducer";

interface CourseLessonListProps {
  lessons: CreateLessonSchema[];
  onSelect: (action: LessonAction) => void;
  onCreateLesson: (action: LessonAction) => void;
  setHasLessonsReordered?: (value: boolean) => void;
}

export function CourseLessonList({ lessons, onSelect, onCreateLesson, setHasLessonsReordered }: CourseLessonListProps) {
  const [selectedLesson, setSelectedLesson] = useState<CreateLessonSchema | null>(null);
  const [showList, setShowList] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const courseId = useSelector((state: RootState) => state.createCourse.courseId);
  const createCourseLesson = useCreateLesson(courseId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(event.target as Node)) {
        setSelectedLesson(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onSelect]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = lessons.findIndex((l) => l.lessonId === String(active.id));
    const newIndex = lessons.findIndex((l) => l.lessonId === String(over.id));
    const newOrder = arrayMove(lessons, oldIndex, newIndex);

    dispatch(setCreateCourse({ courseLessons: newOrder }));
    if (setHasLessonsReordered) {
      setHasLessonsReordered(true);
    }
  };

  const handleAction = (action: LessonAction) => {
    if (!action) return;
    if (action.type === "add-blank" || action.type === "add-clone") {
      onCreateLesson(action);
    }
    if (action.type !== "delete" && action.type !== "duplicate") {
      onSelect(action);
    }
    if (action.type === "delete") {
      if (!action.lessonId) return;
      // Immediately update the UI by dispatching the action first
      dispatch(deleteLesson(action.lessonId!));
      // Reset selected lesson after deletion
      setSelectedLesson(null);
      // Then perform the server deletion
      createCourseLesson.deleteLesson.mutateAsync(action.lessonId).catch((error) => {
        console.error("Error deleting lesson:", error);
        // If there's an error, we should refresh the lesson list from the server
        if (courseId) {
          createCourseLesson.getLessonList.refetch();
        }
      });
    }
  };

  const toggleList = () => {
    setShowList(!showList);
  };

  return (
    <div className={`max-w-sm p-4 bg-white ${showList ? "w-80" : "size-18"}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-semibold ${showList ? "block" : "hidden"}`}>Lessons List</h2>
        <Button type="button" variant="ghost" size="icon" onClick={toggleList}>
          {showList ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </Button>
      </div>

      {showList && (
        <>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={lessons.map((lesson) => ({ id: lesson.lessonId }))}
              strategy={verticalListSortingStrategy}
            >
              <div ref={listRef} className="space-y-3 overflow-y-scroll max-h-[500px] scrollbar-hide">
                {lessons.map((lesson) => (
                  <LessonItem
                    onAction={(action) => {
                      handleAction(action);
                      setSelectedLesson(lesson);
                    }}
                    key={lesson.lessonId}
                    lesson={lesson}
                    selectedLessonId={selectedLesson?.lessonId}
                  />
                ))}
                {lessons && lessons.length !== 0 && <EndOfListNotice />}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}

      <div className="mt-4">
        <Button type="button" variant="default" className="w-full" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Add New Lesson
        </Button>
      </div>

      <AddLessonModal onAddLesson={handleAction} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
