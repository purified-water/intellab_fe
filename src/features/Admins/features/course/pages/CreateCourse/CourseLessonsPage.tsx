import { useEffect, useState } from "react";
import { CourseLessonList, CourseWizardButtons, LessonForm } from "../../components/CreateCourse";
import { LessonAction } from "../../types";
import { CreateLessonSchema } from "../../schemas";
import { useDispatch, useSelector } from "react-redux";
import { setCreateCourse } from "@/redux/createCourse/createCourseSlice";
import { RootState } from "@/redux/rootReducer";
import { useCreateLesson } from "../../hooks";
import { CreateCourseLessonStepResponse, UpdateCourseLessonPayload } from "@/types";
import { resetCreateLesson, setCreateLesson } from "@/redux/createCourse/createLessonSlice";
import { showToastError } from "@/utils";
import { useToast } from "@/hooks";
import { DEFAULT_QUIZ } from "../../constants";

export const CourseLessonsPage = () => {
  const [lessonAction, setLessonAction] = useState<LessonAction>({
    type: "default"
  });
  // const lessons = useSelector((state: RootState) => state.createCourse.courseLessons);
  const dispatch = useDispatch();
  const toast = useToast();
  const courseId = useSelector((state: RootState) => state.createCourse.courseId);
  const courseLessons = useSelector((state: RootState) => state.createCourse.courseLessons);
  if (!courseId) return null;

  const createCourseLesson = useCreateLesson(courseId);
  const { data: lessonsFromServer = [], isLoading } = createCourseLesson.getLessonList;

  // Only dispatch once when server data is fetched and redux is empty
  useEffect(() => {
    if (lessonsFromServer.length > 0 && courseLessons.length === 0) {
      dispatch(setCreateCourse({ courseLessons: lessonsFromServer }));
    }
  }, [lessonsFromServer, courseLessons.length, dispatch]);

  // Initially create a lesson to get id then call put to update it
  const handleAddInitalLesson = async () => {
    try {
      const createdLesson: CreateCourseLessonStepResponse = await createCourseLesson.createLesson.mutateAsync({
        courseId,
        cloneLessonId: null
      });
      // Add to the create lesson redux (only id and order is needed)
      dispatch(
        setCreateLesson({
          lessonName: "",
          lessonDescription: "",
          lessonContent: "",
          lessonId: createdLesson.lessonId,
          lessonOrder: createdLesson.lessonOrder,
          hasQuiz: false,
          hasProblem: false,
          lessonQuiz: DEFAULT_QUIZ,
          lessonProblemId: ""
        })
      );
    } catch (error) {
      console.error("Error creating lesson:", error);
      showToastError({ toast: toast.toast, message: "Error creating lesson" });
    }
  };

  const updateLesson = async (data: CreateLessonSchema) => {
    if (lessonAction.type === "add-blank" || lessonAction.type === "add-clone") {
      const updateLessonPayload: UpdateCourseLessonPayload = {
        lessonId: data.lessonId,
        lessonName: data.lessonName,
        description: data.lessonDescription,
        content: data.lessonContent,
        problemId: data.hasProblem ? (data.lessonProblemId ?? null) : null,
        lessonOrder: data.lessonOrder ?? 0
      };
      // console.log("Update lesson payload:", updateLessonPayload);

      try {
        await createCourseLesson.updateLesson.mutateAsync(updateLessonPayload);
        // Remove the lesson in the redux store
        dispatch(resetCreateLesson());
        // Update the lesson in the course lessons list
        const updatedLessonList = [...courseLessons, data];
        dispatch(setCreateCourse({ courseLessons: updatedLessonList }));
        setLessonAction({ type: "default" });
      } catch (error) {
        console.log("Error updating lesson:", error);
        showToastError({ toast: toast.toast, message: "Error updating lesson" });
      }
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
        return <LessonForm lessonId={lessonAction.lessonId} onSave={updateLesson} lessonActionType="view" />;
      case "edit":
        return <LessonForm lessonId={lessonAction.lessonId} onSave={updateLesson} lessonActionType="edit" />;
      case "add-blank":
        return <LessonForm onSave={updateLesson} />; // Dont add lessonId because use redux instead
      case "add-clone":
        return <div>Add Clone Lesson</div>;
      default:
        return renderDefaultAction();
    }
  };

  return (
    <div className="flex w-full">
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-56">
          <h2 className="text-base">Loading...</h2>
        </div>
      ) : (
        <CourseLessonList lessons={courseLessons} onSelect={setLessonAction} onCreateLesson={handleAddInitalLesson} />
      )}
      {/* Render different components based on selected in the Course Lesson List */}

      <div className="flex-1 p-4">
        {renderPageContent()}
        {lessonAction.type !== "add-blank" && lessonAction.type !== "add-clone" && (
          <CourseWizardButtons disabledNext={courseLessons.length <= 0} ignoreSubmit={true} />
        )}
      </div>
    </div>
  );
};
