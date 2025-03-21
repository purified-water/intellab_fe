import { ILesson } from "@/types";

interface HeaderProps {
  lesson: ILesson;
}
export const LessonHeader = ({ lesson }: HeaderProps) => (
  <div className="py-4 space-y-2 border-b border-gray4">
    <p className="text-5xl font-bold">{lesson?.lessonName}</p>
    <p className="text-gray3 line-clamp-4">{lesson?.description}</p>
  </div>
);
