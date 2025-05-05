import { useState } from "react";
import { CourseLessonList, CourseWizardButtons, LessonForm } from "../../components/CreateCourse";
import { LessonAction } from "../../types";
import { CreateLessonSchema } from "../../schemas";
import { useDispatch, useSelector } from "react-redux";
import { setCreateCourse } from "@/redux/createCourse/createCourseSlice";
import { RootState } from "@/redux/rootReducer";

export const CourseLessonsPage = () => {
  const [lessonAction, setLessonAction] = useState<LessonAction>({
    type: "default"
  });
  const lessons = useSelector((state: RootState) => state.createCourse.courseLessons);

  const dispatch = useDispatch();

  const handleAddNewLesson = (lesson: CreateLessonSchema) => {
    if (lessonAction.type === "add-blank" || lessonAction.type === "add-clone") {
      dispatch(
        setCreateCourse({ courseLessons: [...lessons, { ...lesson, lessonId: (lessons.length + 1).toString() }] })
      );
      setLessonAction({
        type: "default"
      });
    } else {
      return;
    }
  };

  const renderDefaultAction = () => {
    return (
      <div className="flex items-center justify-center w-full h-56">
        <h2 className="text-base">Select a lesson to view or edit.</h2>
      </div>
    );
  };

  const renderPageContent = () => {
    switch (lessonAction?.type) {
      case "view":
        return <LessonForm lessonId={lessonAction.lessonId} onSave={handleAddNewLesson} lessonActionType="view" />;
      case "edit":
        return <LessonForm lessonId={lessonAction.lessonId} onSave={handleAddNewLesson} lessonActionType="edit" />;
      case "add-blank":
        return <LessonForm onSave={handleAddNewLesson} />;
      case "add-clone":
        return <div>Add Clone Lesson</div>;
      default:
        return renderDefaultAction();
    }
  };

  return (
    <div className="flex w-full">
      <CourseLessonList lessons={lessons} onSelect={setLessonAction} />
      {/* Render different components based on selected in the Course Lesson List */}

      <div className="flex-1 p-4">
        {renderPageContent()}
        {lessonAction.type !== "add-blank" && lessonAction.type !== "add-clone" && (
          <CourseWizardButtons disabledNext={lessons.length <= 0} ignoreSubmit={true} />
        )}
      </div>
    </div>
  );
};
